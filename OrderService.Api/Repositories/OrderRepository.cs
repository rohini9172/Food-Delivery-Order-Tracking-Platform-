using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Models;

namespace OrderService.Api.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrderDbContext _context;
        public OrderRepository(OrderDbContext context) => _context = context;

        public async Task<Order?> GetByIdAsync(Guid id) => await _context.Orders.Include(o => o.CartItems).FirstOrDefaultAsync(o => o.Id == id);
        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
