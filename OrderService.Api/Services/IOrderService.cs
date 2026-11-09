using OrderService.Api.Contracts;
using OrderService.Api.Models;

namespace OrderService.Api.Services
{
    public interface IOrderService
    {
        Task<OrderResponse?> GetOrderAsync(Guid id, Guid customerId);
        Task<IReadOnlyList<OrderResponse>> GetMyOrdersAsync(Guid customerId);
        Task<OrderResponse?> PlaceOrderAsync(Guid customerId);
    }
}
