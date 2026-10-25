using OrderService.Api.Models;

namespace OrderService.Api.Repositories
{
    public interface IRestaurantRepository
    {
        Task<IEnumerable<Restaurant>> GetAllAsync();
        Task<Restaurant?> GetByIdAsync(Guid id);
        Task AddAsync(Restaurant restaurant);
    }
}
