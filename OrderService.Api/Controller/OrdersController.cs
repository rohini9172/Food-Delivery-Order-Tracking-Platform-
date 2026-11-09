using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Api.Security;
using OrderService.Api.Services;

namespace OrderService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrdersController(IOrderService service) => _service = service;

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            return Ok(await _service.GetMyOrdersAsync(customerId));
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            var order = await _service.GetOrderAsync(id, customerId);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Place()
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            var order = await _service.PlaceOrderAsync(customerId);
            return order is null
                ? BadRequest(new { message = "Add at least one item to your cart before placing an order." })
                : CreatedAtAction(nameof(Get), new { id = order.Id }, order);
        }
    }
}
