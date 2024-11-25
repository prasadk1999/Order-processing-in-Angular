using System;
using System.Collections.Generic;

namespace OrderProcessingAPI;

public partial class Order
{
    public long OrderId { get; set; }

    public long? OrderAmount { get; set; }

    public string? OrderStatus { get; set; }

    public DateTime OrderDate {get;set;}

    public virtual ICollection<OrderDetail> OrderDetails { get; } = new List<OrderDetail>();
}
