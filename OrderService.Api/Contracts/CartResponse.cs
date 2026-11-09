namespace OrderService.Api.Contracts
{
    public record CartResponse(
        Guid? RestaurantId,
        string? RestaurantName,
        IReadOnlyList<CartLineResponse> Items,
        decimal TotalAmount);

    public record CartLineResponse(
        Guid MenuItemId,
        string Name,
        decimal Price,
        int Quantity,
        decimal Subtotal);
}
