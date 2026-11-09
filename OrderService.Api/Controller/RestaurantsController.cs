using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Api.Contracts;
using OrderService.Api.Models;
using OrderService.Api.Services;

namespace OrderService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly IRestaurantService _service;
        public RestaurantsController(IRestaurantService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetRestaurantsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var restaurant = await _service.GetRestaurantAsync(id);
            return restaurant == null ? NotFound() : Ok(restaurant);
        }

        [HttpGet("{id:guid}/menu")]
        public async Task<IActionResult> GetMenu(Guid id)
        {
            var restaurant = await _service.GetRestaurantAsync(id);
            return restaurant == null ? NotFound() : Ok(restaurant.MenuItems);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add(CreateRestaurantRequest request)
        {
            var restaurant = new Restaurant { Name = request.Name.Trim() };
            await _service.AddRestaurantAsync(restaurant);
            return CreatedAtAction(nameof(Get), new { id = restaurant.Id }, restaurant);
        }
    }
}
