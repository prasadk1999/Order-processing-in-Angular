using System;
using System.Collections.Generic;

namespace OrderProcessingAPI;

public partial class Product
{
    public long ProductId { get; set; }

    public string? Name { get; set; }

    public long Price { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; } = new List<OrderDetail>();
}
