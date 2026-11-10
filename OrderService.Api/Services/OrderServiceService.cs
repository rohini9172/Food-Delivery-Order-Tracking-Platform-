using Microsoft.EntityFrameworkCore;
using MassTransit;
using OrderService.Api.Contracts;
using OrderService.Api.Data;
using OrderService.Api.Models;
using OrderService.Api.Repositories;
using Shared.Events;

namespace OrderService.Api.Services
{
    public class OrderServiceService : IOrderService
    {
        private readonly IOrderRepository _repo;
        private readonly OrderDbContext _context;
        private readonly IPublishEndpoint _publishEndpoint;

        public OrderServiceService(
            IOrderRepository repo,
            OrderDbContext context,
            IPublishEndpoint publishEndpoint)
        {
            _repo = repo;
            _context = context;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<OrderResponse?> GetOrderAsync(Guid id, Guid customerId)
        {
            var order = await _repo.GetByIdAsync(id);
            return order is null || order.CustomerId != customerId ? null : ToResponse(order);
        }

        public async Task<IReadOnlyList<OrderResponse>> GetMyOrdersAsync(Guid customerId)
        {
            var orders = await _repo.GetByCustomerIdAsync(customerId);
            return orders.Select(ToResponse).ToArray();
        }

        public async Task<IReadOnlyList<OrderResponse>> GetAllOrdersAsync()
        {
            var orders = await _repo.GetAllAsync();
            return orders.Select(ToResponse).ToArray();
        }

        public async Task<OrderResponse?> PlaceOrderAsync(Guid customerId)
        {
            var cartEntries = await _context.CartEntries
                .Include(item => item.MenuItem)
                .Where(item => item.CustomerId == customerId)
                .ToListAsync();

            if (cartEntries.Count == 0)
                return null;

            var restaurantIds = cartEntries
                .Select(item => item.MenuItem.RestaurantId)
                .Distinct()
                .ToArray();

            if (restaurantIds.Length != 1)
                throw new InvalidOperationException("The cart contains items from more than one restaurant.");

            var restaurant = await _context.Restaurants.SingleAsync(
                item => item.Id == restaurantIds[0]);
            var order = new Order
            {
                CustomerId = customerId,
                RestaurantId = restaurantIds[0],
                Restaurant = restaurant,
                Status = Order.PendingStatus,
                TotalAmount = cartEntries.Sum(item => item.MenuItem.Price * item.Quantity),
                Items = cartEntries.Select(item => new OrderItem
                {
                    MenuItemId = item.MenuItemId,
                    Name = item.MenuItem.Name,
                    UnitPrice = item.MenuItem.Price,
                    Quantity = item.Quantity
                }).ToList()
            };

            await using var transaction = await _context.Database.BeginTransactionAsync();
            await _repo.AddAsync(order);
            _context.CartEntries.RemoveRange(cartEntries);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            await _publishEndpoint.Publish(new OrderCreated(
                order.Id,
                order.CustomerId,
                order.TotalAmount));

            return ToResponse(order);
        }

        private static OrderResponse ToResponse(Order order)
        {
            var lines = order.Items
                .Select(item => new OrderLineResponse(
                    item.Name,
                    item.UnitPrice,
                    item.Quantity,
                    item.UnitPrice * item.Quantity))
                .ToArray();

            return new OrderResponse(
                order.Id,
                order.CustomerId,
                order.Restaurant?.Name,
                order.TotalAmount,
                order.Status,
                order.CreatedAt,
                lines);
        }
    }
}
