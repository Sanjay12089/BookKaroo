using System.Text.Json;
using BookKaroo.Application.DTOs.Booking;
using BookKaroo.Application.DTOs.Pricing;
using BookKaroo.Application.Exceptions;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Application.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Domain.Enums;
using PaymentEntity = BookKaroo.Domain.Entities.Payment;
using BookKaroo.Infrastructure.Data;
using BookKaroo.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using QRCoder;

namespace BookKaroo.Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly BookKarooDbContext          _db;
    private readonly IShowRepository             _shows;
    private readonly IRepository<Venue>          _venues;
    private readonly IRepository<Screen>         _screens;
    private readonly IMovieRepository            _movies;
    private readonly ISeatLockRepository         _locks;
    private readonly SupabaseStorageService      _storage;
    private readonly IServiceScopeFactory        _scopeFactory;
    private readonly ILogger<BookingService>     _logger;

    public BookingService(
        BookKarooDbContext      db,
        IShowRepository         shows,
        IRepository<Venue>      venues,
        IRepository<Screen>     screens,
        IMovieRepository        movies,
        ISeatLockRepository     locks,
        SupabaseStorageService  storage,
        IServiceScopeFactory    scopeFactory,
        ILogger<BookingService> logger)
    {
        _db           = db;
        _shows        = shows;
        _venues       = venues;
        _screens      = screens;
        _movies       = movies;
        _locks        = locks;
        _storage      = storage;
        _scopeFactory = scopeFactory;
        _logger       = logger;
    }

    public async Task<BookingDetailResponse> FinalizeBookingAsync(
        Guid bookingId, string providerPaymentId, CancellationToken ct = default)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw new NotFoundException("Booking not found.");

        if (booking.Status != BookingStatus.Pending)
            throw new ConflictException("Booking already processed.");

        List<string> finalSeatLabels = [];
        PaymentEntity? finalPayment  = null;

        var strategy = _db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(ct);
            try
            {
                // a. Update payment
                var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId, ct);
                if (payment is not null)
                {
                    payment.ProviderPaymentId = providerPaymentId;
                    payment.Status            = PaymentStatus.Captured;
                    payment.CapturedAt        = DateTime.UtcNow;
                    payment.Method            = "mock";
                }
                finalPayment = payment;

                // b. Confirm booking
                booking.Status = BookingStatus.Confirmed;

                // c. Delete seat locks for this show + seats
                var seatLabels = await _db.BookingSeats
                    .Where(bs => bs.BookingId == bookingId)
                    .Select(bs => bs.SeatLabel)
                    .ToListAsync(ct);
                finalSeatLabels = seatLabels;

                var locks = await _db.SeatLocks
                    .Where(sl => sl.ShowId == booking.ShowId && seatLabels.Contains(sl.SeatLabel))
                    .ToListAsync(ct);
                _db.SeatLocks.RemoveRange(locks);

                // d. Invoice number
                booking.InvoiceNumber = $"TIN{DateTime.UtcNow:yy}{booking.Id:N}"[..14].ToUpper();

                // e. QR code (best-effort — failure does not abort the transaction)
                try
                {
                    var qrBytes = GenerateQr(booking.BookingRef);
                    var qrUrl   = await _storage.UploadQrAsync(booking.BookingRef, qrBytes, ct);
                    if (qrUrl is not null) booking.QrUrl = qrUrl;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "QR upload failed for {Ref} — continuing", booking.BookingRef);
                }

                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
                _logger.LogInformation("Booking finalized: {Ref}", booking.BookingRef);
            }
            catch
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        });

        // Fire-and-forget notification in its own DI scope so scoped services survive
        var capturedId  = booking.Id;
        var capturedRef = booking.BookingRef;
        _ = Task.Run(async () =>
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var notifications = scope.ServiceProvider.GetRequiredService<INotificationService>();
            try
            {
                await notifications.SendBookingConfirmedAsync(capturedId);
                _logger.LogInformation("Notification sent for {Ref}", capturedRef);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Notification failed for {Ref}", capturedRef);
            }
        }, CancellationToken.None);

        return await BuildDetailAsync(booking, finalPayment, finalSeatLabels, ct);
    }

    public async Task<BookingDetailResponse> GetByRefAsync(
        string bookingRef, Guid userId, CancellationToken ct = default)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.BookingRef == bookingRef && b.UserId == userId, ct)
            ?? throw new NotFoundException("Booking not found.");

        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == booking.Id, ct);
        var seats   = await _db.BookingSeats
            .Where(bs => bs.BookingId == booking.Id)
            .Select(bs => bs.SeatLabel)
            .ToListAsync(ct);

        return await BuildDetailAsync(booking, payment, seats, ct);
    }

    public async Task<PaginatedBookings> GetByUserAsync(
        Guid userId, string? tab, int page, int pageSize, CancellationToken ct = default)
    {
        var now   = DateTime.UtcNow;
        var query = _db.Bookings.Where(b => b.UserId == userId && b.DeletedAt == null);

        query = tab switch
        {
            "upcoming" => query
                .Where(b => b.Status == BookingStatus.Confirmed &&
                            _db.Shows.Any(s => s.Id == b.ShowId && s.ShowDatetime > now))
                .OrderBy(b => _db.Shows.Where(s => s.Id == b.ShowId).Select(s => s.ShowDatetime).FirstOrDefault()),
            "past" => query
                .Where(b => (b.Status == BookingStatus.Confirmed &&
                             _db.Shows.Any(s => s.Id == b.ShowId && s.ShowDatetime <= now)) ||
                            b.Status == BookingStatus.Cancelled ||
                            b.Status == BookingStatus.Refunded)
                .OrderByDescending(b => _db.Shows.Where(s => s.Id == b.ShowId).Select(s => s.ShowDatetime).FirstOrDefault()),
            _ => query.OrderByDescending(b => b.CreatedAt)
        };

        var total    = await query.CountAsync(ct);
        var bookings = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        // Pre-load all venues and screens to avoid per-booking round trips
        var allVenues  = (await _venues.GetAllAsync(ct)).ToList();
        var allScreens = (await _screens.GetAllAsync(ct)).ToList();

        var items = new List<BookingListItem>();
        foreach (var b in bookings)
        {
            var show   = await _shows.GetByIdAsync(b.ShowId, ct);
            var venue  = show is not null ? allVenues.FirstOrDefault(v => v.Id == show.VenueId) : null;
            var screen = show is not null ? allScreens.FirstOrDefault(s => s.Id == show.ScreenId) : null;

            Movie?  movie = null;
            Event?  evt   = null;
            string  title = "Unknown";
            string  slug  = "";
            string? poster        = null;
            string? certificate   = null;
            string? format        = show?.Format;
            string? language      = show?.Language;

            if (show?.MovieId.HasValue == true)
            {
                movie       = await _movies.GetByIdAsync(show.MovieId!.Value, ct);
                title       = movie?.Title ?? "Unknown";
                slug        = movie?.Slug ?? "";
                poster      = movie?.PosterUrl;
                certificate = movie?.Certificate;
            }
            else if (show?.EventId.HasValue == true)
            {
                evt   = await _db.Events.FirstOrDefaultAsync(e => e.Id == show.EventId!.Value, ct);
                title = evt?.Title ?? "Unknown";
                slug  = evt?.Slug  ?? "";
                poster = evt?.PosterUrl;
            }

            var seats = await _db.BookingSeats
                .Where(bs => bs.BookingId == b.Id)
                .Select(bs => new BookingSeatItem(bs.SeatLabel, bs.Category, bs.Price))
                .ToListAsync(ct);

            var showDatetime = show?.ShowDatetime ?? DateTime.MinValue;
            var minutesLeft  = (showDatetime - now).TotalMinutes;
            var canCancel    = b.Status == BookingStatus.Confirmed && minutesLeft > 120;

            var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == b.Id, ct);

            items.Add(new BookingListItem(
                Id:             b.Id,
                BookingRef:     b.BookingRef,
                Status:         b.Status.ToString(),
                Title:          title,
                Slug:           slug,
                PosterUrl:      poster,
                Certificate:    certificate,
                Format:         format,
                Language:       language,
                ShowDate:       show?.ShowDate.ToString("ddd, dd MMM yyyy") ?? "",
                ShowTime:       show?.ShowTime.ToString("hh\\:mm tt") ?? "",
                ShowDatetime:   showDatetime,
                VenueName:      venue?.Name    ?? "Unknown",
                VenueAddress:   venue?.Address ?? "",
                ScreenName:     screen?.Name   ?? "Screen",
                Seats:          seats,
                TicketQty:      b.TicketQty,
                AmountPaid:     b.AmountPaid,
                Discount:       b.Discount,
                PaymentMethod:  payment?.Method ?? b.PaymentMethodLabel,
                InvoiceUrl:     b.InvoiceUrl,
                QrUrl:          b.QrUrl,
                CanCancel:      canCancel,
                MinutesUntilShow: minutesLeft,
                CreatedAt:      b.CreatedAt));
        }

        return new PaginatedBookings(
            Items:      items,
            Total:      total,
            Page:       page,
            PageSize:   pageSize,
            TotalPages: (int)Math.Ceiling((double)total / pageSize));
    }

    public async Task<CancelResponse> CancelAsync(
        string bookingRef, Guid userId, CancellationToken ct = default)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.BookingRef == bookingRef && b.UserId == userId, ct)
            ?? throw new NotFoundException("Booking not found.");

        if (booking.Status != BookingStatus.Confirmed)
            throw new AppException("Cannot cancel this booking.", 400);

        var show = await _shows.GetByIdAsync(booking.ShowId, ct)
            ?? throw new NotFoundException("Show not found.");

        if (show.ShowDatetime <= DateTime.UtcNow.AddHours(2))
            throw new AppException("Cannot cancel within 2 hours of show.", 400);

        var refundAmount = booking.AmountPaid
            - (booking.ConvenienceFee + booking.Cgst + booking.Sgst + booking.Igst);
        refundAmount = Math.Max(0, Math.Round(refundAmount, 2));

        var refundId = $"MOCK-REF-{Guid.NewGuid():N}";

        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == booking.Id, ct);
        if (payment is not null)
        {
            payment.Status       = PaymentStatus.Refunded;
            payment.RefundAmount = refundAmount;
            payment.RefundId     = refundId;
        }

        booking.Status      = BookingStatus.Cancelled;
        booking.CancelledAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        var capturedId      = booking.Id;
        var capturedRef     = booking.BookingRef;
        var capturedRefund  = refundAmount;
        _ = Task.Run(async () =>
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var notifications = scope.ServiceProvider.GetRequiredService<INotificationService>();
            try { await notifications.SendBookingCancelledAsync(capturedId, capturedRefund); }
            catch (Exception ex) { _logger.LogError(ex, "Cancel notification failed for {Ref}", capturedRef); }
        }, CancellationToken.None);

        return new CancelResponse(booking.BookingRef, refundAmount, refundId,
            $"Booking cancelled. ₹{refundAmount:F2} will be refunded within 7 business days.");
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(
        string bookingRef, Guid userId, CancellationToken ct = default)
    {
        var booking = await _db.Bookings
            .FirstOrDefaultAsync(b => b.BookingRef == bookingRef && b.UserId == userId, ct)
            ?? throw new NotFoundException("Booking not found.");

        var show    = await _shows.GetByIdAsync(booking.ShowId, ct);
        var movie   = show?.MovieId.HasValue == true ? await _movies.GetByIdAsync(show.MovieId!.Value, ct) : null;
        var allVenues = await _venues.GetAllAsync(ct);
        var venue   = show is not null ? allVenues.FirstOrDefault(v => v.Id == show.VenueId) : null;
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == booking.Id, ct);
        var user    = await _db.Users.FirstOrDefaultAsync(u => u.Id == booking.UserId, ct)
            ?? throw new NotFoundException("User not found.");

        await using var scope = _scopeFactory.CreateAsyncScope();
        var builder   = scope.ServiceProvider.GetRequiredService<InvoiceBuilder>();
        var generator = scope.ServiceProvider.GetRequiredService<IInvoicePdfGenerator>();

        var model    = await builder.BuildAsync(booking, show!, movie, venue, payment, user, ct);
        return generator.Generate(model);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task<BookingDetailResponse> BuildDetailAsync(
        Booking booking, PaymentEntity? payment, List<string> seatLabels, CancellationToken ct)
    {
        var show     = await _shows.GetByIdAsync(booking.ShowId, ct);
        var allVenues  = await _venues.GetAllAsync(ct);
        var venue    = show is not null ? allVenues.FirstOrDefault(v => v.Id == show?.VenueId) : null;
        var allScreens = await _screens.GetAllAsync(ct);
        var screen   = show is not null ? allScreens.FirstOrDefault(s => s.Id == show?.ScreenId) : null;
        var movie    = show?.MovieId.HasValue == true
            ? await _movies.GetByIdAsync(show.MovieId!.Value, ct) : null;

        var bsItems  = await _db.BookingSeats
            .Where(bs => bs.BookingId == booking.Id)
            .ToListAsync(ct);

        var seatItems = bsItems.Select(bs =>
            new BookingSeatItem(bs.SeatLabel, bs.Category, bs.Price)).ToList();

        var pricing = new PricingBreakdown(
            booking.TicketAmount,
            booking.ConvenienceFee,
            Math.Round(booking.ConvenienceFee * 0.18m, 2),
            booking.OfferProcessingFee,
            Math.Round(booking.OfferProcessingFee * 0.18m, 2),
            booking.TaxableAmount,
            booking.Cgst,
            booking.Sgst,
            booking.Igst,
            booking.Discount,
            booking.AmountPaid,
            booking.CustomerStateCode == "24");

        var movieCity = venue is not null
            ? (await _venues.GetAllAsync(ct)).FirstOrDefault(v => v.Id == venue.Id)?.CityId.ToString() ?? ""
            : "";

        return new BookingDetailResponse(
            BookingRef:    booking.BookingRef,
            Status:        booking.Status.ToString(),
            CreatedAt:     booking.CreatedAt,
            Movie: new BookingMovieInfo(
                Title:       movie?.Title ?? "Unknown",
                Slug:        movie?.Slug ?? "",
                PosterUrl:   movie?.PosterUrl,
                Certificate: movie?.Certificate,
                Format:      show?.Format,
                Language:    show?.Language),
            Show: new BookingShowInfo(
                Date:       show?.ShowDate.ToString("yyyy-MM-dd") ?? "",
                Time:       show?.ShowTime.ToString(@"hh\:mm") ?? "",
                VenueName:  venue?.Name ?? "Unknown",
                ScreenName: screen?.Name ?? "Screen",
                City:       movieCity),
            Seats:   seatItems,
            Pricing: pricing,
            Payment: new BookingPaymentInfo(
                Method:             payment?.Method,
                CapturedAt:         payment?.CapturedAt,
                ProviderPaymentId:  payment?.ProviderPaymentId),
            QrUrl:         booking.QrUrl,
            InvoiceUrl:    booking.InvoiceUrl,
            InvoiceNumber: booking.InvoiceNumber,
            BookingId:     booking.Id);
    }

    private static byte[] GenerateQr(string text)
    {
        using var gen  = new QRCodeGenerator();
        var data       = gen.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
        using var code = new PngByteQRCode(data);
        return code.GetGraphic(20);
    }
}
