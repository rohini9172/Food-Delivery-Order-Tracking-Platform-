using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using OrderService.Api.Models;
using OrderService.Api.Services;

namespace OrderService.Api.Messaging
{
    public class RabbitMqConsumer : BackgroundService
    {
        private readonly IOrderService _orderService;
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly string _queueName = "order-status";

        public RabbitMqConsumer(IOrderService orderService)
        {
            _orderService = orderService;

            var factory = new ConnectionFactory() { HostName = "localhost" };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.QueueDeclare(queue: _queueName,
                                  durable: false,
                                  exclusive: false,
                                  autoDelete: false,
                                  arguments: null);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                var result = JsonSerializer.Deserialize<PaymentResult>(message);

                if (result != null)
                {
                    var status = result.Success ? "Paid" : "PaymentFailed";
                    await _orderService.UpdateOrderStatusAsync(result.OrderId, status);
                }
            };

            _channel.BasicConsume(queue: _queueName,
                                  autoAck: true,
                                  consumer: consumer);

            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _channel.Close();
            _connection.Close();
            base.Dispose();
        }
    }
}
