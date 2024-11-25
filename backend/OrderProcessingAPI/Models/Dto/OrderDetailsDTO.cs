public class OrderDetailsDTO{
    public long order_id { get; set; }
    public DateTime order_date { get; set; }
    public long? total_amount { get; set; }
    public IEnumerable<OrderInfoDTO>? order_details{get; set;}

}

public class OrderInfoDTO{
    public long? product_id { get;set;}
    public string? product_name { get;set;}
    public long? quantity {get; set;}
    public long? amount {get; set;}
}