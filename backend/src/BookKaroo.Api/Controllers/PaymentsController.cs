using System.Security.Claims;
using BookKaroo.Application.DTOs.Payment;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookKaroo.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Produces("application/json")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _payments;

    public PaymentsController(IPaymentService payments) => _payments = payments;

    /// <summary>Create a payment order and pending booking.</summary>
    [HttpPost("order")]
    [Authorize]
    [ProducesResponseType(typeof(CreateOrderResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> CreateOrder(
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKeyHeader,
        [FromBody] CreateOrderRequest request,
        CancellationToken ct)
    {
        if (request.Seats.Length == 0 || request.Seats.Length > 10)
            return BadRequest("seats must contain 1–10 entries.");

        var effectiveKey = idempotencyKeyHeader ?? request.IdempotencyKey;
        if (string.IsNullOrWhiteSpace(effectiveKey))
            return BadRequest("Idempotency-Key header is required.");

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Merge the header key into the request so service can use it
        var req = request with { IdempotencyKey = effectiveKey };
        var result = await _payments.CreateOrderAsync(req, userId, ct);
        return Ok(result);
    }
}
