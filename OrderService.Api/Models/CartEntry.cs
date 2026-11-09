namespace OrderService.Api.Models
{
    public class CartEntry
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public Guid MenuItemId { get; set; }
        public int Quantity { get; set; }
        public MenuItem MenuItem { get; set; } = null!;
    }
}
