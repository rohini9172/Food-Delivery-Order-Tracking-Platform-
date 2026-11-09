using Microsoft.EntityFrameworkCore;
using MassTransit;
using PaymentService.Api.Data;
using PaymentService.Api.Messaging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PaymentDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMassTransit(configuration =>
{
    configuration.AddConsumer<OrderCreatedConsumer>();
    configuration.UsingRabbitMq((context, rabbitMq) =>
    {
        rabbitMq.Host("localhost", "/", host =>
        {
            host.Username("guest");
            host.Password("guest");
        });

        rabbitMq.UseMessageRetry(retry =>
            retry.Intervals(TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(3), TimeSpan.FromSeconds(5)));
        rabbitMq.ConfigureEndpoints(context);
    });
});

var app = builder.Build();
app.Run();
