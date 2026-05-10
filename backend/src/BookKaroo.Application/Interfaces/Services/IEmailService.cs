using BookKaroo.Domain.Entities;

namespace BookKaroo.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendBookingConfirmationAsync(
        Booking booking, Show show, Movie? movie, User user,
        byte[] invoicePdf, byte[]? qrCodePng, CancellationToken ct = default);

    Task SendWelcomeAsync(User user, CancellationToken ct = default);

    Task SendPasswordResetAsync(User user, string token, CancellationToken ct = default);

    Task SendBookingCancelledAsync(
        Booking booking, User user, decimal refundAmount, CancellationToken ct = default);
}
