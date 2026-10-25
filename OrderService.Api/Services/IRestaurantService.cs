using OrderService.Api.Models;

namespace OrderService.Api.Services
{
    public interface IRestaurantService
    {
        Task<IEnumerable<Restaurant>> GetRestaurantsAsync();
        Task<Restaurant?> GetRestaurantAsync(Guid id);
        Task AddRestaurantAsync(Restaurant restaurant);
    }
}
