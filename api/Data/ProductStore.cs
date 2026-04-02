using ProductStockApi.Models;

namespace ProductStockApi.Data;

public static class ProductStore
{
    private static readonly List<Product> Products = new();
    private static int _nextId = 1;
    private static bool _seeded;
    private static readonly object Sync = new();

    public static IReadOnlyList<Product> GetAll()
    {
        lock (Sync)
        {
            return Products.Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity
            }).ToList();
        }
    }

    public static Product? GetById(int id)
    {
        lock (Sync)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product is null)
            {
                return null;
            }

            return new Product
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                StockQuantity = product.StockQuantity
            };
        }
    }

    public static Product Add(Product product)
    {
        lock (Sync)
        {
            var created = new Product
            {
                Id = _nextId++,
                Name = product.Name,
                Price = product.Price,
                StockQuantity = product.StockQuantity
            };

            Products.Add(created);
            return created;
        }
    }

    public static bool Delete(int id)
    {
        lock (Sync)
        {
            var product = Products.FirstOrDefault(p => p.Id == id);
            if (product is null)
            {
                return false;
            }

            Products.Remove(product);
            return true;
        }
    }

    public static void Seed()
    {
        lock (Sync)
        {
            if (_seeded)
            {
                return;
            }

            Products.AddRange(
            [
                new Product { Id = _nextId++, Name = "Laptop", Price = 49999, StockQuantity = 4 },
                new Product { Id = _nextId++, Name = "Kulaklik", Price = 2499, StockQuantity = 15 },
                new Product { Id = _nextId++, Name = "Klavye", Price = 1299, StockQuantity = 20 }
            ]);

            _seeded = true;
        }
    }
}
