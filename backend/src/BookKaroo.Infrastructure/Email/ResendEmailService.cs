using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using BookKaroo.Application.Interfaces.Services;
using BookKaroo.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Infrastructure.Email;

public class ResendEmailService : IEmailService
{
    private readonly IHttpClientFactory _http;
    private readonly IConfiguration _config;
    private readonly ILogger<ResendEmailService> _logger;

    public ResendEmailService(
        IHttpClientFactory http,
        IConfiguration config,
        ILogger<ResendEmailService> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task SendBookingConfirmationAsync(
        Booking booking, Show show, User user, byte[] invoicePdf, CancellationToken ct = default)
    {
        var html = BuildBookingConfirmationHtml(booking, show, user);
        var pdfBase64 = System.Convert.ToBase64String(invoicePdf);

        await SendAsync(
            to: user.Email,
            subject: $"Your Tickets — {booking.BookingRef}",
            html: html,
            attachments: [new EmailAttachment($"{booking.BookingRef}_GST_Invoice.pdf", pdfBase64)],
            ct: ct);
    }

    public async Task SendWelcomeAsync(User user, CancellationToken ct = default)
    {
        var html = $"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2>Welcome to BookKaroo, {user.Name}! 🎬</h2>
              <p>Book the moment. Karo it now.</p>
              <a href="https://bookkaroo.com/movies" style="background:#E50914;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
                Explore Movies
              </a>
            </div>
            """;

        await SendAsync(user.Email, $"Welcome to BookKaroo, {user.Name}! 🎬", html, ct: ct);
    }

    public async Task SendPasswordResetAsync(User user, string token, CancellationToken ct = default)
    {
        var resetUrl = $"https://bookkaroo.com/reset-password?token={Uri.EscapeDataString(token)}";
        var html = $"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2>Reset your BookKaroo password</h2>
              <p>We received a password reset request for <strong>{user.Email}</strong>.</p>
              <p>This link expires in 1 hour.</p>
              <a href="{resetUrl}" style="background:#E50914;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
                Reset Password
              </a>
              <p style="color:#71717A;font-size:12px;margin-top:24px">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            """;

        await SendAsync(user.Email, "Reset your BookKaroo password", html, ct: ct);
    }

    public async Task SendBookingCancelledAsync(Booking booking, decimal refundAmount, CancellationToken ct = default)
    {
        var html = $"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2>Booking Cancelled — {booking.BookingRef}</h2>
              <p>Your booking has been cancelled.</p>
              <p><strong>Refund Amount:</strong> ₹{refundAmount:F2}</p>
              <p>Refunds are processed within 7 business days.</p>
            </div>
            """;

        await SendAsync(
            // We don't have user email here directly; BookingService should pass it via the User entity
            to: "noreply@bookkaroo.com", // placeholder — in real use, inject user lookup
            subject: $"Your booking {booking.BookingRef} has been cancelled",
            html: html,
            ct: ct);
    }

    private async Task SendAsync(
        string to, string subject, string html,
        IEnumerable<EmailAttachment>? attachments = null,
        CancellationToken ct = default)
    {
        var apiKey = _config["RESEND_API_KEY"];
        var from = _config["RESEND_FROM"] ?? "BookKaroo <onboarding@resend.dev>";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("RESEND_API_KEY not configured — skipping email to {To}", to);
            return;
        }

        var payload = new
        {
            from,
            to = new[] { to },
            subject,
            html,
            attachments = attachments?.Select(a => new { filename = a.Filename, content = a.ContentBase64 }).ToArray()
        };

        var client = _http.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync("https://api.resend.com/emails", content, ct);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Resend API error {Status}: {Body}", response.StatusCode, body);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }

    private static string BuildBookingConfirmationHtml(Booking booking, Show show, User user)
    {
        return $"""
            <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#F4F4F5;padding:24px">
              <div style="background:linear-gradient(135deg,#0A0E1A,#1A2138);padding:28px;text-align:center;border-radius:12px 12px 0 0">
                <span style="font-size:28px;font-weight:700;color:#FFF">Book<span style="color:#E50914">Karoo</span></span>
              </div>
              <div style="background:#FFF;padding:28px;border-radius:0 0 12px 12px">
                <div style="text-align:center;margin-bottom:24px">
                  <div style="width:48px;height:48px;line-height:48px;border-radius:50%;background:rgba(16,185,129,.15);color:#10B981;font-size:24px;display:inline-block">✓</div>
                  <h2 style="color:#10B981;margin:8px 0">Your booking is confirmed!</h2>
                  <p style="color:#71717A">Booking ID <strong style="color:#18181B;font-family:monospace">{booking.BookingRef}</strong></p>
                </div>
                <table style="width:100%;border:1px solid #E4E4E7;border-radius:12px;border-collapse:collapse">
                  <tr><td style="padding:16px;font-size:14px;font-weight:600">TICKET AMOUNT</td><td align="right" style="padding:16px;font-size:14px;font-weight:600">₹{booking.TicketAmount:F2}</td></tr>
                  <tr><td style="padding:8px 16px;font-size:13px;color:#71717A">Convenience Fees</td><td align="right" style="padding:8px 16px;font-size:13px;color:#71717A">₹{(booking.ConvenienceFee + booking.Cgst + booking.Sgst + booking.Igst):F2}</td></tr>
                  {(booking.Discount > 0 ? $"<tr><td style='padding:8px 16px;font-size:13px;color:#10B981'>Discount</td><td align='right' style='padding:8px 16px;font-size:13px;color:#10B981'>-₹{booking.Discount:F2}</td></tr>" : "")}
                  <tr style="border-top:2px solid #E4E4E7"><td style="padding:16px;font-size:16px;font-weight:700">AMOUNT PAID</td><td align="right" style="padding:16px;font-size:18px;font-weight:700;color:#E50914">₹{booking.AmountPaid:F2}</td></tr>
                </table>
                <div style="margin-top:24px;font-size:12px;color:#71717A;text-align:center">
                  GST collected is remitted to the department.<br>© 2026 BookKaroo Pvt Ltd
                </div>
              </div>
            </div>
            """;
    }

    private record EmailAttachment(string Filename, string ContentBase64);
}
