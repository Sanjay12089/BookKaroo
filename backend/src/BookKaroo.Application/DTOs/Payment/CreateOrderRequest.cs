namespace BookKaroo.Application.DTOs.Payment;

public record CreateOrderRequest(
    Guid ShowId,
    string[] Seats,
    decimal Amount,
    string Currency = "INR",
    string? CouponCode = null
);
