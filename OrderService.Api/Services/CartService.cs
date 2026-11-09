using Microsoft.EntityFrameworkCore;
using OrderService.Api.Contracts;
using OrderService.Api.Data;
using OrderService.Api.Models;

namespace OrderService.Api.Services
{
    public enum CartOperationStatus
    {
        Success,
        MenuItemNotFound,
        ItemNotFound,
        DifferentRestaurant,
        QuantityLimitExceeded
    }

    public class CartService
    {
        private const int MaximumQuantity = 99;
        private readonly OrderDbContext _context;

        public CartService(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<CartResponse> GetCartAsync(Guid customerId)
        {
            var entries = await _context.CartEntries
                .AsNoTracking()
                .Include(item => item.MenuItem)
                .Where(item => item.CustomerId == customerId)
                .OrderBy(item => item.MenuItem.Name)
                .ToListAsync();

            var restaurantId = entries.Select(item => item.MenuItem.RestaurantId).FirstOrDefault();
            var restaurantName = restaurantId == Guid.Empty
                ? null
                : await _context.Restaurants
                    .Where(restaurant => restaurant.Id == restaurantId)
                    .Select(restaurant => restaurant.Name)
                    .SingleOrDefaultAsync();

            var lines = entries.Select(item => new CartLineResponse(
                item.MenuItemId,
                item.MenuItem.Name,
                item.MenuItem.Price,
                item.Quantity,
                item.MenuItem.Price * item.Quantity)).ToArray();

            return new CartResponse(
                restaurantId == Guid.Empty ? null : restaurantId,
                restaurantName,
                lines,
                lines.Sum(item => item.Subtotal));
        }

        public async Task<CartOperationStatus> AddItemAsync(
            Guid customerId,
            Guid menuItemId,
            int quantity)
        {
            var menuItem = await _context.MenuItems
                .SingleOrDefaultAsync(item => item.Id == menuItemId);
            if (menuItem is null)
                return CartOperationStatus.MenuItemNotFound;

            var cartItems = await _context.CartEntries
                .Include(item => item.MenuItem)
                .Where(item => item.CustomerId == customerId)
                .ToListAsync();

            if (cartItems.Any(item => item.MenuItem.RestaurantId != menuItem.RestaurantId))
                return CartOperationStatus.DifferentRestaurant;

            var existingItem = cartItems.SingleOrDefault(item => item.MenuItemId == menuItemId);
            if (existingItem is not null)
            {
                if (existingItem.Quantity + quantity > MaximumQuantity)
                    return CartOperationStatus.QuantityLimitExceeded;

                existingItem.Quantity += quantity;
            }
            else
            {
                _context.CartEntries.Add(new CartEntry
                {
                    CustomerId = customerId,
                    MenuItemId = menuItemId,
                    Quantity = quantity
                });
            }

            await _context.SaveChangesAsync();
            return CartOperationStatus.Success;
        }

        public async Task<CartOperationStatus> UpdateQuantityAsync(
            Guid customerId,
            Guid menuItemId,
            int quantity)
        {
            var cartItem = await _context.CartEntries.SingleOrDefaultAsync(
                item => item.CustomerId == customerId && item.MenuItemId == menuItemId);
            if (cartItem is null)
                return CartOperationStatus.ItemNotFound;

            cartItem.Quantity = quantity;
            await _context.SaveChangesAsync();
            return CartOperationStatus.Success;
        }

        public async Task<CartOperationStatus> RemoveItemAsync(Guid customerId, Guid menuItemId)
        {
            var cartItem = await _context.CartEntries.SingleOrDefaultAsync(
                item => item.CustomerId == customerId && item.MenuItemId == menuItemId);
            if (cartItem is null)
                return CartOperationStatus.ItemNotFound;

            _context.CartEntries.Remove(cartItem);
            await _context.SaveChangesAsync();
            return CartOperationStatus.Success;
        }
    }
}
