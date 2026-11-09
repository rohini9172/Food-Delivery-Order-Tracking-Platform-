using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Hubs;
using OrderService.Api.Models;
using Shared.Events;

namespace OrderService.Api.Messaging;

public class PaymentResultConsumer :
    IConsumer<PaymentCompleted>,
    IConsumer<PaymentFailed>
{
    private readonly OrderDbContext _context;
    private readonly IHubContext<OrderHub> _hub;
    private readonly ILogger<PaymentResultConsumer> _logger;

    public PaymentResultConsumer(
        OrderDbContext context,
        IHubContext<OrderHub> hub,
        ILogger<PaymentResultConsumer> logger)
    {
        _context = context;
        _hub = hub;
        _logger = logger;
    }

    public Task Consume(ConsumeContext<PaymentCompleted> context) =>
        UpdateOrderAsync(context.Message.OrderId, Order.ConfirmedStatus);

    public Task Consume(ConsumeContext<PaymentFailed> context) =>
        UpdateOrderAsync(context.Message.OrderId, Order.CancelledStatus);

    private async Task UpdateOrderAsync(Guid orderId, string status)
    {
        var order = await _context.Orders.SingleOrDefaultAsync(item => item.Id == orderId);
        if (order is null)
        {
            throw new InvalidOperationException($"Payment result references unknown order {orderId}.");
        }

        if (order.Status != Order.PendingStatus && order.Status != status)
        {
            _logger.LogWarning(
                "Ignoring conflicting payment status {Status} for completed order {OrderId}.",
                status,
                orderId);
            return;
        }

        if (order.Status == Order.PendingStatus)
        {
            order.Status = status;
            await _context.SaveChangesAsync();
        }

        await _hub.Clients.Group(order.CustomerId.ToString()).SendAsync(
            "ReceiveOrderUpdate",
            order.Id.ToString(),
            order.Status);
    }
}
