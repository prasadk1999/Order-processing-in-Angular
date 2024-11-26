using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderProcessingAPI.DatabaseContext;
using OrderProcessingAPI.Models.Dto;

namespace OrderProcessingAPI.Controllers;

[ApiController]
[Route("/api/v1/order")]
public class OrderController : ControllerBase
{

    private readonly ILogger<OrderController> _logger;
    private readonly OrderProcessingContext _dbContext;

    public OrderController(ILogger<OrderController> logger, OrderProcessingContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet("order/{orderId}")]
    public IEnumerable<OrderDetailsDTO> GetOrderDetails(int orderId)
    {
        var orderDetailsObj = _dbContext.Orders
                                .Where(o => o.OrderId == orderId)   // Filter Orders based on OrderId
                                .Include(o => o.OrderDetails)        // Eagerly load OrderDetails
                                .ThenInclude(od => od.Product)       // If you need Product details, include Product
                                .Select(o => new OrderDetailsDTO
                                {
                                    order_id = o.OrderId,
                                    order_date = o.OrderDate,
                                    total_amount = o.OrderAmount,
                                    order_details = o.OrderDetails.Select(od => new OrderInfoDTO
                                    {
                                        product_id = od.ProductId,
                                        product_name = od.Product.Name, 
                                        quantity = od.Quantity,
                                        amount = od.Amount
                                    }).ToList()
                                })
                                .ToList();  // Ensure you execute the query and return a list



        return orderDetailsObj;

    }

    [HttpGet("orders/details")]
    public IEnumerable<OrderDetailsDTO> GetAllOrdersDetails()
    {
         var orderDetailsObj = _dbContext.Orders
                                .Include(o => o.OrderDetails)        // Eagerly load OrderDetails
                                .ThenInclude(od => od.Product)       // If you need Product details, include Product
                                .Select(o => new OrderDetailsDTO
                                {
                                    order_id = o.OrderId,
                                    order_date = o.OrderDate,
                                    total_amount = o.OrderAmount,
                                    order_details = o.OrderDetails.Select(od => new OrderInfoDTO
                                    {
                                        product_id = od.ProductId,
                                        product_name = od.Product.Name, 
                                        quantity = od.Quantity,
                                        amount = od.Amount
                                    }).ToList()
                                })
                                .ToList();  // Ensure you execute the query and return a list


        return orderDetailsObj;

    }

    [HttpGet("orders")]
    public IEnumerable<OrdersDTO> GetAllOrders()
    {
         var orderDetailsObj = _dbContext.Orders
                                .Select(o => new OrdersDTO
                                {
                                    order_id = o.OrderId,
                                    order_date = o.OrderDate,
                                    total_amount = o.OrderAmount
                                })
                                .ToList(); 

        return orderDetailsObj;

    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] List<OrderRequestDTO> orderRequests)
    {
        if (orderRequests == null || !orderRequests.Any()) { 
            return BadRequest("Order request cannot be empty"); 
        } 
        int orderId = SequenceService.GetNextSequenceValue(_dbContext.Database.GetConnectionString(),"order_id_seq");
        var order = new Order { 
            OrderId = orderId,
            OrderAmount = 0, // This will be calculated 
            OrderStatus = "Pending",
            OrderDate = DateTime.Now
        }; 
        _dbContext.Orders.Add(order); 


        int totalAmount = 0; 
        foreach (var orderRequest in orderRequests) { 
            var product = await _dbContext.Products.FindAsync(orderRequest.ProductId); 
            if (product == null) {
                return NotFound($"Product with ID {orderRequest.ProductId} not found"); 
            } 
            int amount = (int)(product.Price * orderRequest.Quantity); 
            totalAmount += amount; 
            var orderDetailsId = SequenceService.GetNextSequenceValue(_dbContext.Database.GetConnectionString(),"order_id_seq");
            var orderDetail = new OrderDetail { 
                OrderDetailId = orderDetailsId,
                OrderId = orderId, 
                ProductId = orderRequest.ProductId, 
                Quantity = orderRequest.Quantity, 
                Amount = amount, 
                Status = "Ordered" 
            };
            _dbContext.OrderDetails.Add(orderDetail); 
        } 
        order.OrderAmount = totalAmount; 
        await _dbContext.SaveChangesAsync(); 
        
        return Ok(new { orderId = order.OrderId, orderAmount = order.OrderAmount });
    }

    // DELETE: api/orders/{orderId}
        [HttpDelete("delete/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            // Find the order with its related order details
            var order = await _dbContext.Orders
                                        .Include(o => o.OrderDetails) // Ensure related OrderDetails are included
                                        .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                // Order not found
                return NotFound(new { message = $"Order with ID {orderId} not found." });
            }

            // Remove related order details first (optional if cascading delete is set up)
            _dbContext.OrderDetails.RemoveRange(order.OrderDetails);
            
            // Now remove the order
            _dbContext.Orders.Remove(order);

            try
            {
                // Save the changes in the database
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Order and its details have been deleted successfully." });
            }
            catch (DbUpdateException ex)
            {
                // Handle any errors (e.g., foreign key issues or DB update problems)
                return StatusCode(500, new { message = "Error occurred while deleting the order.", details = ex.Message });
            }
        }
}
