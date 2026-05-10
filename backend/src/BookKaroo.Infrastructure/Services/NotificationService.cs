using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(ILogger<NotificationService> logger) => _logger = logger;

    public Task SendBookingConfirmedAsync(Booking booking, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "NOTIFICATION: Booking confirmed — Ref={Ref} ShowId={ShowId} UserId={UserId} Amount={Amount}",
            booking.BookingRef, booking.ShowId, booking.UserId, booking.AmountPaid);
        return Task.CompletedTask;
    }

    public Task SendBookingCancelledAsync(Booking booking, decimal refundAmount, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "NOTIFICATION: Booking cancelled — Ref={Ref} Refund={Refund}",
            booking.BookingRef, refundAmount);
        return Task.CompletedTask;
    }
}
