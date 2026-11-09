using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Api.Contracts;
using OrderService.Api.Security;
using OrderService.Api.Services;

namespace OrderService.Api.Controller
{
    [ApiController]
    [Route("api/cart")]
    [Authorize(Roles = "Customer")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            return Ok(await _cartService.GetCartAsync(customerId));
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem(AddCartItemRequest request)
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            var result = await _cartService.AddItemAsync(customerId, request.MenuItemId, request.Quantity);
            return await CreateCartResponse(customerId, result);
        }

        [HttpPut("items/{menuItemId:guid}")]
        public async Task<IActionResult> UpdateQuantity(Guid menuItemId, UpdateCartItemRequest request)
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            var result = await _cartService.UpdateQuantityAsync(customerId, menuItemId, request.Quantity);
            return await CreateCartResponse(customerId, result);
        }

        [HttpDelete("items/{menuItemId:guid}")]
        public async Task<IActionResult> RemoveItem(Guid menuItemId)
        {
            if (!User.TryGetCustomerId(out var customerId))
                return Unauthorized();

            var result = await _cartService.RemoveItemAsync(customerId, menuItemId);
            return await CreateCartResponse(customerId, result);
        }

        private async Task<IActionResult> CreateCartResponse(
            Guid customerId,
            CartOperationStatus result)
        {
            return result switch
            {
                CartOperationStatus.Success => Ok(await _cartService.GetCartAsync(customerId)),
                CartOperationStatus.MenuItemNotFound => NotFound(new { message = "Menu item not found." }),
                CartOperationStatus.ItemNotFound => NotFound(new { message = "Cart item not found." }),
                CartOperationStatus.DifferentRestaurant => Conflict(new
                {
                    message = "A cart can contain items from only one restaurant."
                }),
                CartOperationStatus.QuantityLimitExceeded => Conflict(new
                {
                    message = "A maximum of 99 of each menu item can be added."
                }),
                _ => throw new InvalidOperationException($"Unknown cart operation result: {result}.")
            };
        }
    }
}
