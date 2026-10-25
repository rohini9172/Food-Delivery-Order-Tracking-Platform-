using PaymentService.Api.Models;

namespace PaymentService.Api.Services
{
    public interface IPaymentService
    {
        PaymentResult ProcessPayment(PaymentRequest request);
    }
}
