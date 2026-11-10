using MassTransit;
using Microsoft.EntityFrameworkCore;
using PaymentService.Api.Data;
using PaymentService.Api.Models;
using Shared.Events;

namespace PaymentService.Api.Messaging;

public class OrderCreatedConsumer : IConsumer<OrderCreated>
{
    private readonly PaymentDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;

    public OrderCreatedConsumer(PaymentDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<OrderCreated> context)
    {
        var order = context.Message;
        var payment = await _context.Payments.SingleOrDefaultAsync(
            item => item.OrderId == order.OrderId);

        if (payment is null)
        {
            var succeeded = Random.Shared.Next(0, 10) < 8;
            payment = new PaymentRecord
            {
                OrderId = order.OrderId,
                CustomerId = order.CustomerId,
                Amount = order.TotalAmount,
                Status = succeeded ? "Succeeded" : "Failed",
                FailureReason = succeeded ? null : "The mock payment was declined."
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
        }

        if (payment.Status == "Succeeded")
        {
            await _publishEndpoint.Publish(new PaymentCompleted(payment.OrderId, payment.Id));
        }
        else
        {
            await _publishEndpoint.Publish(new PaymentFailed(
                payment.OrderId,
                payment.FailureReason ?? "The payment failed."));
        }
    }
}
