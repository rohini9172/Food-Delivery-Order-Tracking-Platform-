namespace PaymentService.Api.Models
{
    public class PaymentResult
    {
        public Guid OrderId { get; set; }
        public bool Success { get; set; }
        public string TransactionId { get; set; } = Guid.NewGuid().ToString();
        public string Message { get; set; } = string.Empty;
    }
}
