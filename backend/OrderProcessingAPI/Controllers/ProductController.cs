using Microsoft.AspNetCore.Mvc;
using OrderProcessingAPI.DatabaseContext;

namespace OrderProcessingAPI.Controllers;

[ApiController]
[Route("/api/v1/product")]
public class ProductController : ControllerBase
{

    private readonly ILogger<ProductController> _logger;
    private readonly OrderProcessingContext _dbContext;

    public ProductController(ILogger<ProductController> logger, OrderProcessingContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet("all")]
    public IEnumerable<Product> GetAll()
    {
        return _dbContext.Products.ToList();
    }
}
