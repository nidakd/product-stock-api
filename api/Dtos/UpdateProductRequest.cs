using System.ComponentModel.DataAnnotations;

namespace ProductStockApi.Dtos;

public class UpdateProductRequest
{
    [Required(ErrorMessage = "Ürün adı zorunludur")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Ürün adı 2-150 karakter arası olmalıdır")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fiyat zorunludur")]
    [Range(0.01, 1_000_000, ErrorMessage = "Fiyat 0.01 ile 1.000.000 arasında olması gerekir")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Stok miktarı zorunludur")]
    [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı 0 veya daha büyük olmalıdır")]
    public int StockQuantity { get; set; }
}
