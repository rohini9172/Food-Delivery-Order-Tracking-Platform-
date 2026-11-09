namespace OrderService.Api.Contracts
{
    public record OrderResponse(
        Guid Id,
        string? RestaurantName,
        decimal TotalAmount,
        string Status,
        DateTime CreatedAt,
        IReadOnlyList<OrderLineResponse> Items);

    public record OrderLineResponse(
        string Name,
        decimal UnitPrice,
        int Quantity,
        decimal Subtotal);
}
