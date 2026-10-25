using OrderService.Api.Models;
using OrderService.Api.Repositories;

namespace OrderService.Api.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _repo;
        public RestaurantService(IRestaurantRepository repo) => _repo = repo;

        public Task<IEnumerable<Restaurant>> GetRestaurantsAsync() => _repo.GetAllAsync();
        public Task<Restaurant?> GetRestaurantAsync(Guid id) => _repo.GetByIdAsync(id);
        public Task AddRestaurantAsync(Restaurant restaurant) => _repo.AddAsync(restaurant);
    }
}
