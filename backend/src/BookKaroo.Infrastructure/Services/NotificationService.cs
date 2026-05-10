using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Application.Services;
using BookKaroo.Domain.Entities;
using BookKaroo.Infrastructure.Data;
using BookKaroo.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly BookKarooDbContext          _db;
    private readonly IUserRepository             _users;
    private readonly IShowRepository             _shows;
    private readonly IMovieRepository            _movies;
    private readonly IRepository<Venue>          _venues;
    private readonly IEmailService               _email;
    private readonly InvoiceBuilder              _invoiceBuilder;
    private readonly IInvoicePdfGenerator        _pdfGenerator;
    private readonly SupabaseStorageService      _storage;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        BookKarooDbContext           db,
        IUserRepository              users,
        IShowRepository              shows,
        IMovieRepository             movies,
        IRepository<Venue>           venues,
        IEmailService                email,
        InvoiceBuilder               invoiceBuilder,
        IInvoicePdfGenerator         pdfGenerator,
        SupabaseStorageService       storage,
        ILogger<NotificationService> logger)
    {
        _db             = db;
        _users          = users;
        _shows          = shows;
        _movies         = movies;
        _venues         = venues;
        _email          = email;
        _invoiceBuilder = invoiceBuilder;
        _pdfGenerator   = pdfGenerator;
        _storage        = storage;
        _logger         = logger;
    }

    public async Task SendBookingConfirmedAsync(Guid bookingId, CancellationToken ct = default)
    {
        _logger.LogInformation("Sending booking confirmation for BookingId={BookingId}", bookingId);

        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (booking is null)
        {
            _logger.LogWarning("Booking {BookingId} not found for notification", bookingId);
            return;
        }

        var user    = await _users.GetByIdAsync(booking.UserId, ct);
        var show    = await _shows.GetByIdAsync(booking.ShowId, ct);
        var movie   = show?.MovieId.HasValue == true ? await _movies.GetByIdAsync(show.MovieId!.Value, ct) : null;
        var allVenues = await _venues.GetAllAsync(ct);
        var venue   = show is not null ? allVenues.FirstOrDefault(v => v.Id == show.VenueId) : null;
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId, ct);

        if (user is null)
        {
            _logger.LogWarning("User not found for booking {Ref}", booking.BookingRef);
            return;
        }
        if (show is null)
        {
            _logger.LogWarning("Show not found for booking {Ref}", booking.BookingRef);
            return;
        }

        try
        {
            // Build GST invoice
            var invoiceModel = await _invoiceBuilder.BuildAsync(booking, show, movie, venue, payment, user, ct);
            var pdfBytes     = _pdfGenerator.Generate(invoiceModel);

            // Upload PDF to Supabase Storage (best-effort — does not block email)
            try
            {
                var invoiceUrl = await _storage.UploadInvoiceAsync(booking.UserId, booking.BookingRef, pdfBytes, ct);
                if (invoiceUrl is not null && booking.InvoiceUrl is null)
                {
                    booking.InvoiceUrl = invoiceUrl;
                    await _db.SaveChangesAsync(ct);
                    _logger.LogInformation("Invoice uploaded to {Url}", invoiceUrl);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Invoice upload failed for {Ref} — email will still be sent", booking.BookingRef);
            }

            // Send email with PDF attached regardless of storage outcome
            await _email.SendBookingConfirmationAsync(booking, show, movie, user, pdfBytes, ct);
            _logger.LogInformation("Booking confirmation email sent for {Ref} to {Email}", booking.BookingRef, user.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send booking confirmation for {Ref}", booking.BookingRef);
        }
    }

    public async Task SendBookingCancelledAsync(Guid bookingId, decimal refundAmount, CancellationToken ct = default)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (booking is null) return;

        var user = await _users.GetByIdAsync(booking.UserId, ct);
        if (user is null) return;

        _logger.LogInformation("Sending cancellation notification for {Ref}", booking.BookingRef);

        try
        {
            await _email.SendBookingCancelledAsync(booking, user, refundAmount, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send cancellation email for {Ref}", booking.BookingRef);
        }
    }
}
