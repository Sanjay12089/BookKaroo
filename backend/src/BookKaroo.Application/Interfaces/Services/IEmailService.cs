using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendBookingConfirmationAsync(Booking booking, Show show, User user, byte[] invoicePdf, CancellationToken ct = default);
    Task SendWelcomeAsync(User user, CancellationToken ct = default);
    Task SendPasswordResetAsync(User user, string token, CancellationToken ct = default);
    Task SendBookingCancelledAsync(Booking booking, User user, decimal refundAmount, CancellationToken ct = default);
}
