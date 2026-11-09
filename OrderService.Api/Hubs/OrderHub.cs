using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using OrderService.Api.Security;

namespace OrderService.Api.Hubs
{
    [Authorize(Roles = "Customer")]
    public class OrderHub : Hub
    {
        public async Task JoinCustomerGroup()
        {
            if (!Context.User!.TryGetCustomerId(out var customerId))
                throw new HubException("A valid customer identity is required.");

            await Groups.AddToGroupAsync(Context.ConnectionId, customerId.ToString());
        }
    }
}
