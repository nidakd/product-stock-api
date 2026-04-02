using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductStockApi.Data;
using ProductStockApi.Dtos;
using ProductStockApi.Models;

namespace ProductStockApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        _logger.LogInformation("Fetching all products");
        var products = await _context.Products.AsNoTracking().OrderBy(product => product.Id).ToListAsync();
        _logger.LogInformation("Retrieved {ProductCount} products", products.Count);
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        _logger.LogInformation("Fetching product with Id={ProductId}", id);
        var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(product => product.Id == id);
        if (product is null)
        {
            _logger.LogWarning("Product not found: Id={ProductId}", id);
            return NotFound(new { message = "Product not found." });
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] CreateProductRequest request)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid product creation request: {Errors}", ModelState.Values.SelectMany(v => v.Errors));
            return ValidationProblem(ModelState);
        }

        var product = new Product
        {
            Name = request.Name,
            Price = request.Price,
            StockQuantity = request.StockQuantity
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Product created: Id={ProductId}, Name={ProductName}", product.Id, product.Name);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting product with Id={ProductId}", id);
        var product = await _context.Products.FirstOrDefaultAsync(product => product.Id == id);
        if (product is null)
        {
            _logger.LogWarning("Product not found for deletion: Id={ProductId}", id);
            return NotFound(new { message = "Product not found." });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Product deleted: Id={ProductId}, Name={ProductName}", product.Id, product.Name);
        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> Update(int id, [FromBody] UpdateProductRequest request)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid product update request for Id={ProductId}: {Errors}", id, ModelState.Values.SelectMany(v => v.Errors));
            return ValidationProblem(ModelState);
        }

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            _logger.LogWarning("Product not found for update: Id={ProductId}", id);
            return NotFound(new { message = "Product not found." });
        }

        product.Name = request.Name;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;

        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Product updated: Id={ProductId}, Name={ProductName}", product.Id, product.Name);
        return Ok(product);
    }
}
