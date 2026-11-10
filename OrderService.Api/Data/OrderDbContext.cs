using Microsoft.EntityFrameworkCore;
using OrderService.Api.Models;

namespace OrderService.Api.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<CartEntry> CartEntries { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Restaurant>(entity =>
            {
                entity.Property(r => r.Name).HasMaxLength(100);
                entity.Property(r => r.ImageUrl).HasMaxLength(500);
            });

            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.Property(menuItem => menuItem.Name).HasMaxLength(100);
                entity.Property(menuItem => menuItem.Price).HasPrecision(18, 2);
                entity.Property(menuItem => menuItem.ImageUrl).HasMaxLength(500);
                entity.HasOne<Restaurant>()
                    .WithMany(restaurant => restaurant.MenuItems)
                    .HasForeignKey(menuItem => menuItem.RestaurantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CartEntry>(entity =>
            {
                entity.HasIndex(cartItem => new { cartItem.CustomerId, cartItem.MenuItemId })
                    .IsUnique();
                entity.HasOne(cartItem => cartItem.MenuItem)
                    .WithMany()
                    .HasForeignKey(cartItem => cartItem.MenuItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(order => order.Status).HasMaxLength(20);
                entity.Property(order => order.TotalAmount).HasPrecision(18, 2);
                entity.HasIndex(order => order.CustomerId);
                entity.HasOne(order => order.Restaurant)
                    .WithMany()
                    .HasForeignKey(order => order.RestaurantId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("CartItems");
                entity.Property(item => item.Name).HasMaxLength(100);
                entity.Property(item => item.UnitPrice).HasPrecision(18, 2);
                entity.HasOne<Order>()
                    .WithMany(order => order.Items)
                    .HasForeignKey(item => item.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            var greenBowlId = Guid.Parse("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d101");
            var pizzaCornerId = Guid.Parse("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d102");

            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant
                {
                    Id = greenBowlId,
                    Name = "Green Bowl Kitchen",
                    ImageUrl = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop"
                },
                new Restaurant
                {
                    Id = pizzaCornerId,
                    Name = "Pizza Corner",
                    ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop"
                });

            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    Id = Guid.Parse("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d201"),
                    RestaurantId = greenBowlId,
                    Name = "Roasted Veggie Bowl",
                    Price = 249m,
                    ImageUrl = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop"
                },
                new MenuItem
                {
                    Id = Guid.Parse("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d202"),
                    RestaurantId = greenBowlId,
                    Name = "Paneer Protein Bowl",
                    Price = 289m,
                    ImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop"
                },
                new MenuItem
                {
                    Id = Guid.Parse("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d203"),
                    RestaurantId = pizzaCornerId,
                    Name = "Margherita Pizza",
                    Price = 299m,
                    ImageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop"
                },
                new MenuItem
                {
                    Id = Guid.Parse("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d204"),
                    RestaurantId = pizzaCornerId,
                    Name = "Farmhouse Pizza",
                    Price = 379m,
                    ImageUrl = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop"
                });
        }
    }
}
