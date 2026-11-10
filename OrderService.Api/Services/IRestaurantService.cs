using OrderService.Api.Models;

namespace OrderService.Api.Services
{
    public interface IRestaurantService
    {
        Task<IEnumerable<Restaurant>> GetRestaurantsAsync();
        Task<Restaurant?> GetRestaurantAsync(Guid id);
        Task AddRestaurantAsync(Restaurant restaurant);
        Task<bool> UpdateRestaurantAsync(Guid id, string name, string? imageUrl);
        Task<bool> DeleteRestaurantAsync(Guid id);
        Task<MenuItem?> AddMenuItemAsync(Guid restaurantId, string name, decimal price, string? imageUrl);
        Task<bool> UpdateMenuItemAsync(Guid restaurantId, Guid menuItemId, string name, decimal price, string? imageUrl);
        Task<bool> DeleteMenuItemAsync(Guid restaurantId, Guid menuItemId);
    }
}
