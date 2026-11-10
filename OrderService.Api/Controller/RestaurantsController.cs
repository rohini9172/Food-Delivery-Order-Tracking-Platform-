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

        [HttpGet("{id:guid}")]
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
            var restaurant = new Restaurant { Name = request.Name.Trim(), ImageUrl = request.ImageUrl };
            await _service.AddRestaurantAsync(restaurant);
            return CreatedAtAction(nameof(Get), new { id = restaurant.Id }, restaurant);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, UpdateRestaurantRequest request)
        {
            var updated = await _service.UpdateRestaurantAsync(id, request.Name, request.ImageUrl);
            return updated ? NoContent() : NotFound();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteRestaurantAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        // ── Menu item endpoints ──────────────────────────────────────────

        [HttpPost("{id:guid}/menu")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMenuItem(Guid id, CreateMenuItemRequest request)
        {
            var item = await _service.AddMenuItemAsync(id, request.Name, request.Price, request.ImageUrl);
            return item is null ? NotFound() : CreatedAtAction(nameof(GetMenu), new { id }, item);
        }

        [HttpPut("{id:guid}/menu/{menuItemId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMenuItem(Guid id, Guid menuItemId, UpdateMenuItemRequest request)
        {
            var updated = await _service.UpdateMenuItemAsync(id, menuItemId, request.Name, request.Price, request.ImageUrl);
            return updated ? NoContent() : NotFound();
        }

        [HttpDelete("{id:guid}/menu/{menuItemId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMenuItem(Guid id, Guid menuItemId)
        {
            var deleted = await _service.DeleteMenuItemAsync(id, menuItemId);
            return deleted ? NoContent() : NotFound();
        }
    }
}
