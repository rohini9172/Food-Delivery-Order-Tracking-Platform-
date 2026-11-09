namespace OrderService.Api.Models
{
    public class Order
    {
        public const string PendingStatus = "Pending";
        public const string ConfirmedStatus = "Confirmed";
        public const string CancelledStatus = "Cancelled";

        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public Guid? RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = PendingStatus;
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
