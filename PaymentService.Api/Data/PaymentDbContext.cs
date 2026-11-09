using Microsoft.EntityFrameworkCore;
using PaymentService.Api.Models;

namespace PaymentService.Api.Data;

public class PaymentDbContext(DbContextOptions<PaymentDbContext> options) : DbContext(options)
{
    public DbSet<PaymentRecord> Payments => Set<PaymentRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PaymentRecord>(entity =>
        {
            entity.HasKey(payment => payment.Id);
            entity.HasIndex(payment => payment.OrderId).IsUnique();
            entity.Property(payment => payment.Amount).HasPrecision(18, 2);
            entity.Property(payment => payment.Status).HasMaxLength(20);
            entity.Property(payment => payment.FailureReason).HasMaxLength(250);
        });
    }
}
