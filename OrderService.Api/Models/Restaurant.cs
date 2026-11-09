using System.ComponentModel.DataAnnotations;

namespace OrderService.Api.Models
{
    public class Restaurant
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}
