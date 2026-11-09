using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OrderService.Api.Data;
using OrderService.Api.Repositories;
using OrderService.Api.Services;
using OrderService.Api.Hubs;
using OrderService.Api.Messaging;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience is not configured.");

if (jwtKey.Length < 32)
    throw new InvalidOperationException("Jwt:Key must be at least 32 characters long.");

builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken)
                    && context.HttpContext.Request.Path.StartsWithSegments("/orderHub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderServiceService>();
builder.Services.AddScoped<CartService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSignalR();

builder.Services.AddMassTransit(configuration =>
{
    configuration.AddConsumer<PaymentResultConsumer>();
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

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<OrderHub>("/orderHub").RequireAuthorization();

app.Run();
