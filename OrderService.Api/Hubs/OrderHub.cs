using Microsoft.AspNetCore.SignalR;

namespace OrderService.Api.Hubs
{
    public class OrderHub : Hub
    {
        // Called when a client connects
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        // Optional: allow clients to join a group per customer
        public async Task JoinCustomerGroup(string customerId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, customerId);
        }
    }
}
