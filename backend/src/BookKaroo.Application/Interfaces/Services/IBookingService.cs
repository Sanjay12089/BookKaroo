using BookKaroo.Application.DTOs.Booking;

namespace BookKaroo.Application.Interfaces.Services;

public interface IBookingService
{
    Task<BookingDetailResponse> FinalizeBookingAsync(
        Guid bookingId, string providerPaymentId, CancellationToken ct = default);

    Task<BookingDetailResponse> GetByRefAsync(
        string bookingRef, Guid userId, CancellationToken ct = default);

    Task<PaginatedBookings> GetByUserAsync(
        Guid userId, string? status, int page, int pageSize, CancellationToken ct = default);

    Task<CancelResponse> CancelAsync(
        string bookingRef, Guid userId, CancellationToken ct = default);
}
