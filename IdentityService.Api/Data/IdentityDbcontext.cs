using Microsoft.EntityFrameworkCore;
using IdentityService.Api.Models;

namespace IdentityService.Api.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options) { }

        public DbSet<ApplicationUser> Users { get; set; }
    }
}
