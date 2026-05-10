using BookKaroo.Application.DTOs.Payment;

namespace BookKaroo.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<CreateOrderResponse> CreateOrderAsync(
        CreateOrderRequest request,
        Guid               userId,
        CancellationToken  ct = default);
}
