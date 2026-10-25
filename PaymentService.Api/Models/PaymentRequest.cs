namespace PaymentService.Api.Models
{
    public class PaymentRequest
    {
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = "Card"; // Card, UPI, Wallet
    }
}
