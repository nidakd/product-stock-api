using ProductStockApi.Models;

namespace ProductStockApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Products.Any())
        {
            return;
        }

        context.Products.AddRange(
            new Product { Name = "Laptop", Price = 49999, StockQuantity = 4 },
            new Product { Name = "Kulaklik", Price = 2499, StockQuantity = 15 },
            new Product { Name = "Klavye", Price = 1299, StockQuantity = 20 }
        );

        context.SaveChanges();
    }
}