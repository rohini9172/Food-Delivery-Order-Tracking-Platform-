using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Contracts
{
    public class CreateMenuItemRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 100000)]
        public decimal Price { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }
    }
}
