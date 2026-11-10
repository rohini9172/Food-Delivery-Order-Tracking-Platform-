using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Models;

namespace OrderService.Api.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrderDbContext _context;
        public OrderRepository(OrderDbContext context) => _context = context;

        public async Task<Order?> GetByIdAsync(Guid id) =>
            await _context.Orders
                .Include(order => order.Restaurant)
                .Include(order => order.Items)
                .FirstOrDefaultAsync(order => order.Id == id);

        public async Task<IReadOnlyList<Order>> GetByCustomerIdAsync(Guid customerId) =>
            await _context.Orders
                .Where(order => order.CustomerId == customerId)
                .Include(order => order.Restaurant)
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAt)
                .ToListAsync();

        public async Task<IReadOnlyList<Order>> GetAllAsync() =>
            await _context.Orders
                .Include(order => order.Restaurant)
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAt)
                .ToListAsync();

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
    }
}
