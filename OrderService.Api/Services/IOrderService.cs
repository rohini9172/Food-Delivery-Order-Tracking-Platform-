using OrderService.Api.Models;

namespace OrderService.Api.Services
{
    public interface IOrderService
    {
        Task<Order?> GetOrderAsync(Guid id);
        Task<Order> PlaceOrderAsync(Order order);
        Task UpdateOrderStatusAsync(Guid id, string status);
    }
}
