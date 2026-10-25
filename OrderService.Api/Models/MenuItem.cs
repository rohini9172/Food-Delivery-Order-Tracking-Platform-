namespace OrderService.Api.Models
{
    public class MenuItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public Guid RestaurantId { get; set; }
    }
}
