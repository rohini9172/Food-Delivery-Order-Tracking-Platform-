using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Models;
using OrderService.Api.Repositories;

namespace OrderService.Api.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _repo;
        private readonly OrderDbContext _context;

        public RestaurantService(IRestaurantRepository repo, OrderDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public Task<IEnumerable<Restaurant>> GetRestaurantsAsync() => _repo.GetAllAsync();
        public Task<Restaurant?> GetRestaurantAsync(Guid id) => _repo.GetByIdAsync(id);
        public Task AddRestaurantAsync(Restaurant restaurant) => _repo.AddAsync(restaurant);

        public async Task<bool> UpdateRestaurantAsync(Guid id, string name, string? imageUrl)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant is null) return false;
            restaurant.Name = name.Trim();
            restaurant.ImageUrl = imageUrl;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRestaurantAsync(Guid id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant is null) return false;
            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<MenuItem?> AddMenuItemAsync(Guid restaurantId, string name, decimal price, string? imageUrl)
        {
            var exists = await _context.Restaurants.AnyAsync(r => r.Id == restaurantId);
            if (!exists) return null;
            var item = new MenuItem { RestaurantId = restaurantId, Name = name.Trim(), Price = price, ImageUrl = imageUrl };
            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> UpdateMenuItemAsync(Guid restaurantId, Guid menuItemId, string name, decimal price, string? imageUrl)
        {
            var item = await _context.MenuItems
                .SingleOrDefaultAsync(m => m.Id == menuItemId && m.RestaurantId == restaurantId);
            if (item is null) return false;
            item.Name = name.Trim();
            item.Price = price;
            item.ImageUrl = imageUrl;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMenuItemAsync(Guid restaurantId, Guid menuItemId)
        {
            var item = await _context.MenuItems
                .SingleOrDefaultAsync(m => m.Id == menuItemId && m.RestaurantId == restaurantId);
            if (item is null) return false;
            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
