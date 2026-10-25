namespace OrderService.Api.Models
{
    public class PaymentResult
    {
        public Guid OrderId { get; set; }
        public bool Success { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
