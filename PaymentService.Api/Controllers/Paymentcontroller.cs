using Microsoft.AspNetCore.Mvc;
using PaymentService.Api.Models;
using PaymentService.Api.Services;

namespace PaymentService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;
        public PaymentsController(IPaymentService service) => _service = service;

        [HttpPost]
        public IActionResult Pay(PaymentRequest request)
        {
            var result = _service.ProcessPayment(request);
            return Ok(result);
        }
    }
}
