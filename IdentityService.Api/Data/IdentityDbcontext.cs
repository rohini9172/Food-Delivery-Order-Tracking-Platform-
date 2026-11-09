using Microsoft.EntityFrameworkCore;
using IdentityService.Api.Models;

namespace IdentityService.Api.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options) { }

        public DbSet<ApplicationUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(user => user.Username).HasMaxLength(50);
                entity.Property(user => user.Role).HasMaxLength(20);
                entity.HasIndex(user => user.Username).IsUnique();
            });
        }
    }
}
