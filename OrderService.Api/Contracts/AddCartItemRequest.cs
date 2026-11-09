using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Contracts
{
    public class AddCartItemRequest
    {
        public Guid MenuItemId { get; set; }

        [Range(1, 99)]
        public int Quantity { get; set; }
    }
}
