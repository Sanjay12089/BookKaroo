using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Services;

public interface INotificationService
{
    Task SendBookingConfirmedAsync(Booking booking, CancellationToken ct = default);
    Task SendBookingCancelledAsync(Booking booking, decimal refundAmount, CancellationToken ct = default);
}
