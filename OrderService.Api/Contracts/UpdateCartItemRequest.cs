using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Contracts
{
    public class UpdateCartItemRequest
    {
        [Range(1, 99)]
        public int Quantity { get; set; }
    }
}
