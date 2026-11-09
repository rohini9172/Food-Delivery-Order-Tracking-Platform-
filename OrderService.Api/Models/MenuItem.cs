using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Models
{
    public class MenuItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "100000")]
        public decimal Price { get; set; }

        public Guid RestaurantId { get; set; }
    }
}
