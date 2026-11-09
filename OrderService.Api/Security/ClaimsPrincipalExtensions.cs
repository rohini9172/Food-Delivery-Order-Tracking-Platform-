using System.Security.Claims;

namespace OrderService.Api.Security
{
    public static class ClaimsPrincipalExtensions
    {
        public static bool TryGetCustomerId(this ClaimsPrincipal principal, out Guid customerId)
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub");

            return Guid.TryParse(userId, out customerId);
        }
    }
}
