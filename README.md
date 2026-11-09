# Food Delivery & Order Tracking Platform

A small, local-first microservices project built with .NET 10, React, SQL Server, RabbitMQ, MassTransit, JWT, and SignalR. The API Gateway is the entry point for the browser. The Payment Service is event-driven and does not expose a customer-facing HTTP API.

## Architecture

```text
React (http://localhost:5173)
  | REST + SignalR
  v
API Gateway (http://localhost:5082)
  |-- /api/auth/*       -> Identity Service (http://localhost:5007) -> IdentityDb
  |-- /api/restaurants/*, /api/cart/*, /api/orders/*, /orderHub
  |                      -> Order Service (http://localhost:5214) -> OrderDb
  |
  +-- RabbitMQ + MassTransit
       OrderCreated      -> Payment Service (PaymentDb)
       PaymentCompleted / PaymentFailed -> Order Service -> SignalR
```

Each service owns its database. RabbitMQ carries events between Order and Payment; neither service reads the other's database. The Payment Service is a mock: it randomly succeeds or fails and stores one payment outcome per order.

## Prerequisites

- .NET 10 SDK
- EF Core CLI (`dotnet-ef`; install with `dotnet tool install --global dotnet-ef` if needed)
- Node.js and npm
- SQL Server or SQL Server LocalDB
- RabbitMQ and Erlang/OTP

No Docker, Redis, or cache is used.

Check the local dependencies in PowerShell:

```powershell
Get-Service *SQL*
Get-Service *RabbitMQ*
rabbitmq-diagnostics ping
Test-NetConnection localhost -Port 5672
```

Start SQL Server and RabbitMQ from Windows Services if they are installed but stopped. The default connection strings use `Server=localhost` and RabbitMQ uses `localhost`, user `guest`, password `guest`. If your SQL Server instance differs, update the connection strings in each service's `appsettings.json`.

## Databases

From the repository root, apply each service's EF Core migrations:

```powershell
dotnet ef database update --project IdentityService.Api\IdentityService.Api.csproj
dotnet ef database update --project OrderService.Api\OrderService.Api.csproj
dotnet ef database update --project PaymentService.Api\PaymentService.Api.csproj
```

The Order database migration seeds two sample restaurants and four menu items. PaymentDb stores payment outcomes and has a unique index on `OrderId` for idempotent event handling.

## Run locally

Open four terminals at the repository root and start each backend project:

```powershell
dotnet run --project IdentityService.Api\IdentityService.Api.csproj --launch-profile http
```

```powershell
dotnet run --project OrderService.Api\OrderService.Api.csproj --launch-profile http
```

```powershell
dotnet run --project PaymentService.Api\PaymentService.Api.csproj --launch-profile http
```

```powershell
dotnet run --project ApiGateway\ApiGateway.csproj --launch-profile http
```

In another terminal:

```powershell
Set-Location food-delivery-frontend
npm install
npm run dev
```

Open <http://localhost:5173>. In Visual Studio, set Identity Service, Order Service, Payment Service, and API Gateway as multiple startup projects. Start RabbitMQ and SQL Server separately.

Fixed HTTP ports:

| Project | Port |
|---|---:|
| Identity Service | 5007 |
| Order Service | 5214 |
| Payment Service | 5176 |
| API Gateway | 5082 |
| React / Vite | 5173 |

The frontend's API and SignalR URLs are in `food-delivery-frontend/.env`. SignalR is routed through the Gateway at `/orderHub`.

## Try the order flow

1. Register a customer and log in.
2. Browse a restaurant, add menu items to the cart, and select **Place Order**.
3. The Order Service saves a Pending order, then publishes `OrderCreated`.
4. The Payment Service consumes the event, records a random success/failure outcome, and publishes the corresponding result.
5. The Order Service changes the order to Confirmed or Cancelled and sends a SignalR update to the customer's browser.
6. Visit **My Orders** to view past orders.

The mock payment's result is intentionally random. Try more than one order to see both outcomes.

## Main API routes

All browser REST calls go through `http://localhost:5082`:

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a Customer |
| POST | `/api/auth/login` | Get a JWT |
| GET | `/api/restaurants` | List restaurants |
| GET | `/api/restaurants/{id}/menu` | Read a restaurant menu |
| GET / POST | `/api/cart`, `/api/cart/items` | Read or add cart items |
| PUT / DELETE | `/api/cart/items/{menuItemId}` | Change or remove a cart item |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my` | List the signed-in customer's orders |
| GET | `/api/orders/{id}` | Read an owned order |
| WebSocket | `/orderHub` | Receive live order status updates |

Payment is initiated by the order event, not by a public payment endpoint. The Payment Service's RabbitMQ consumer retries transient failures with MassTransit's configured retry intervals. Duplicate `OrderCreated` delivery reuses the existing payment record instead of creating another one.

## Build checks

From the repository root:

```powershell
dotnet build FoodDeliverySolution.slnx
```

From the frontend directory:

```powershell
npm run lint
npm run build
```

## Interview practice

1. **Why use an API Gateway?** It gives the frontend one address and routes requests to the right service.
2. **Why separate databases?** Each service owns its data and can change it without directly depending on another service's schema.
3. **Why RabbitMQ?** It lets Order and Payment communicate asynchronously instead of waiting on a direct service-to-service HTTP request.
4. **What does MassTransit do?** It provides typed message publishing/consuming, RabbitMQ setup, and retry configuration.
5. **How is a duplicate payment event handled?** PaymentDb has a unique OrderId index, and the consumer checks for an existing record before creating one.
6. **Why is a new order Pending first?** Payment is processed asynchronously, so the final result is not known at order creation time.
7. **How does the browser get a live status change?** Order Service sends a SignalR event to the group for that authenticated customer's ID.
8. **How does the app protect a customer's orders?** It reads the customer ID from the validated JWT and filters order queries by that ID.
9. **Why store order item name and price in the order?** They are snapshots, so later menu edits do not change the customer's order history.
10. **Is the payment integration production-ready?** No. It is a mock for learning; a real provider would need secure provider calls, stronger idempotency, and reconciliation.

## Resume bullets

- Built a .NET 10 food ordering platform with separate Identity, Order, and Payment microservices and an API Gateway.
- Implemented customer authentication with JWT, role-based authorization, and customer-scoped order access.
- Integrated RabbitMQ and MassTransit for asynchronous order-payment events, retry handling, and idempotent mock payment records.
- Delivered a React frontend with restaurant browsing, cart and order history, plus SignalR live order status updates.
