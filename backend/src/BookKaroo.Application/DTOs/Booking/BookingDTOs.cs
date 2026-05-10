using BookKaroo.Application.DTOs.Pricing;

namespace BookKaroo.Application.DTOs.Booking;

public record BookingSeatItem(string Label, string Category, decimal Price);

public record BookingMovieInfo(
    string  Title,
    string  Slug,
    string? PosterUrl,
    string? Certificate,
    string? Format,
    string? Language);

public record BookingShowInfo(
    string  Date,
    string  Time,
    string  VenueName,
    string  ScreenName,
    string  City);

public record BookingPaymentInfo(
    string?  Method,
    DateTime? CapturedAt,
    string?  ProviderPaymentId);

public record BookingDetailResponse(
    string                   BookingRef,
    string                   Status,
    DateTime                 CreatedAt,
    BookingMovieInfo         Movie,
    BookingShowInfo          Show,
    IReadOnlyList<BookingSeatItem> Seats,
    PricingBreakdown         Pricing,
    BookingPaymentInfo       Payment,
    string?                  QrUrl,
    string?                  InvoiceUrl,
    string?                  InvoiceNumber,
    Guid                     BookingId);

public record BookingListItem(
    Guid     Id,
    string   BookingRef,
    string   Status,
    string   MovieTitle,
    string?  PosterUrl,
    string   VenueName,
    string   ShowDate,
    string   ShowTime,
    int      TicketQty,
    decimal  AmountPaid,
    DateTime CreatedAt);

public record CancelResponse(
    decimal RefundAmount,
    string  RefundId,
    string  Message);

public record MockCaptureRequest(
    string ProviderOrderId,
    bool   SimulateFailure = false);

public record PaginatedBookings(
    IReadOnlyList<BookingListItem> Items,
    int Total,
    int Page,
    int PageSize,
    int TotalPages);
