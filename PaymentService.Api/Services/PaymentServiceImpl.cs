using PaymentService.Api.Models;
using PaymentService.Api.Messaging;

namespace PaymentService.Api.Services
{
    public class PaymentServiceImpl : IPaymentService
    {
        private readonly RabbitMqPublisher _publisher;

        public PaymentServiceImpl(RabbitMqPublisher publisher)
        {
            _publisher = publisher;
        }

        public PaymentResult ProcessPayment(PaymentRequest request)
        {
            // Mock payment logic
            var success = request.Amount > 0; // simple rule: positive amount succeeds

            var result = new PaymentResult
            {
                OrderId = request.OrderId,
                Success = success,
                Message = success ? "Payment successful" : "Payment failed"
            };

            // Publish event to RabbitMQ
            _publisher.Publish(result);

            return result;
        }
    }
}
