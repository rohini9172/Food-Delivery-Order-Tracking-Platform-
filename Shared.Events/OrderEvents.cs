namespace Shared.Events
{
    public record OrderCreated(Guid OrderId, Guid CustomerId, decimal TotalAmount);
    public record PaymentCompleted(Guid OrderId, Guid PaymentId);
    public record PaymentFailed(Guid OrderId, string Reason);
}
