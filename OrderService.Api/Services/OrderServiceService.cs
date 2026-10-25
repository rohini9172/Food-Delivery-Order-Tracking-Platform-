using OrderService.Api.Models;
using OrderService.Api.Repositories;
using Microsoft.AspNetCore.SignalR;
using OrderService.Api.Hubs;

namespace OrderService.Api.Services
{
    public class OrderServiceService : IOrderService
    {
        private readonly IOrderRepository _repo;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrderServiceService(IOrderRepository repo, IHubContext<OrderHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        public Task<Order?> GetOrderAsync(Guid id) => _repo.GetByIdAsync(id);

        public async Task<Order> PlaceOrderAsync(Order order)
        {
            await _repo.AddAsync(order);

            // Notify customer group
            await _hubContext.Clients.Group(order.CustomerId.ToString())
                .SendAsync("OrderPlaced", order);

            return order;
        }

        public async Task UpdateOrderStatusAsync(Guid id, string status)
        {
            var order = await _repo.GetByIdAsync(id);
            if (order != null)
            {
                order.Status = status;
                await _repo.UpdateAsync(order);

                // Notify customer group
                await _hubContext.Clients.Group(order.CustomerId.ToString())
                    .SendAsync("OrderStatusUpdated", new { order.Id, order.Status });
            }
        }
    }
}
