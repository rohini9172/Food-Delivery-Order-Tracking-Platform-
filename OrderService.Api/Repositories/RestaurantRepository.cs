using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Models;

namespace OrderService.Api.Repositories
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly OrderDbContext _context;
        public RestaurantRepository(OrderDbContext context) => _context = context;

        public async Task<IEnumerable<Restaurant>> GetAllAsync() => await _context.Restaurants.Include(r => r.MenuItems).ToListAsync();
        public async Task<Restaurant?> GetByIdAsync(Guid id) => await _context.Restaurants.Include(r => r.MenuItems).FirstOrDefaultAsync(r => r.Id == id);
        public async Task AddAsync(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
        }
    }
}
