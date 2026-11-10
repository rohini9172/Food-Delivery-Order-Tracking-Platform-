using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Contracts
{
    public class UpdateRestaurantRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }
    }
}
