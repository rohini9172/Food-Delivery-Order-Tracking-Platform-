using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<IActionResult> Add(Restaurant restaurant)
        {
            await _service.AddRestaurantAsync(restaurant);
            return Ok("Restaurant added");
        }
    }
}
