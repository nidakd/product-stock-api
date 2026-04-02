using Microsoft.EntityFrameworkCore;
using ProductStockApi.Models;

namespace ProductStockApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Products.AnyAsync())
        {
            return;
        }

        await context.Products.AddRangeAsync(
            new Product { Name = "Laptop", Price = 49999, StockQuantity = 4 },
            new Product { Name = "Kulaklik", Price = 2499, StockQuantity = 15 },
            new Product { Name = "Klavye", Price = 1299, StockQuantity = 20 }
        );

        await context.SaveChangesAsync();
    }
}