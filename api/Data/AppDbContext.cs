using Microsoft.EntityFrameworkCore;
using ProductStockApi.Models;

namespace ProductStockApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Name).IsRequired().HasMaxLength(150);
            entity.Property(product => product.Price).HasPrecision(18, 2);
            entity.Property(product => product.StockQuantity).IsRequired();
        });
    }
}