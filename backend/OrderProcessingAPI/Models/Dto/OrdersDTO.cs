
namespace OrderProcessingAPI.Models.Dto; 
public class OrdersDTO{
    public long order_id { get; set; }
    public DateTime order_date { get; set; }
    public long? total_amount { get; set; }
}