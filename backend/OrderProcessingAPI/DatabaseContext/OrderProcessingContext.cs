using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace OrderProcessingAPI.DatabaseContext;

public partial class OrderProcessingContext : DbContext
{
    public OrderProcessingContext()
    {
    }

    public OrderProcessingContext(DbContextOptions<OrderProcessingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=.\\\\\\\\database\\\\\\\\OrderProcessing.db;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");

            entity.Property(e => e.OrderId)
                .ValueGeneratedNever()
                .HasColumnName("order_id");
            entity.Property(e => e.OrderAmount).HasColumnName("order_amount");
            entity.Property(e => e.OrderStatus)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("order_status");
            entity.Property(e => e.OrderDate).HasColumnName("order_date").HasColumnType("DATETIME");
            
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("order_details");

            entity.Property(e => e.OrderDetailId)
                .ValueGeneratedNever()
                .HasColumnName("order_detail_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Status)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("status");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails).HasForeignKey(d => d.OrderId);

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails).HasForeignKey(d => d.ProductId);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");

            entity.Property(e => e.ProductId)
                .ValueGeneratedNever()
                .HasColumnName("product_id");
            entity.Property(e => e.Name)
                .HasColumnType("VARCHAR(1000)")
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Status)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
