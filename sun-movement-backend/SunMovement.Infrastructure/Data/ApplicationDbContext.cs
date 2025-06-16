using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceSchedule> ServiceSchedules { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<CustomerReview> CustomerReviews { get; set; }
        public DbSet<CustomerSearchStatistic> CustomerSearchStatistics { get; set; }
        public DbSet<CustomerActivity> CustomerActivities { get; set; }
        public DbSet<PendingUserRegistration> PendingUserRegistrations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Service>()
                .HasMany(s => s.Schedules)
                .WithOne(ss => ss.Service)
                .HasForeignKey(ss => ss.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);            builder.Entity<Product>()
                .HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
                
                  builder.Entity<Product>()
                .HasMany<CartItem>()
                .WithOne(ci => ci.Product)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure ShoppingCart relationships
            builder.Entity<ShoppingCart>()
                .HasMany(sc => sc.Items)
                .WithOne()
                .HasForeignKey(ci => ci.ShoppingCartId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CartItem>()
                .HasOne(ci => ci.Service)
                .WithMany()
                .HasForeignKey(ci => ci.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure entity properties
            builder.Entity<Service>()
                .Property(s => s.Price)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Product>()
                .Property(p => p.DiscountPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<OrderItem>()
                .Property(oi => oi.Subtotal)
                .HasColumnType("decimal(18,2)");            builder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            builder.Entity<CartItem>()
                .Property(ci => ci.UnitPrice)
                .HasColumnType("decimal(18,2)");

            // Configure CustomerReview relationships
            builder.Entity<CustomerReview>()
                .HasOne(cr => cr.User)
                .WithMany()
                .HasForeignKey(cr => cr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CustomerReview>()
                .HasOne(cr => cr.Product)
                .WithMany()
                .HasForeignKey(cr => cr.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CustomerReview>()
                .HasOne(cr => cr.Service)
                .WithMany()
                .HasForeignKey(cr => cr.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CustomerReview>()
                .HasOne(cr => cr.Order)
                .WithMany()
                .HasForeignKey(cr => cr.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CustomerReview>()
                .HasOne(cr => cr.Admin)
                .WithMany()
                .HasForeignKey(cr => cr.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure CustomerSearchStatistic relationships
            builder.Entity<CustomerSearchStatistic>()
                .HasOne(css => css.User)
                .WithMany()
                .HasForeignKey(css => css.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure CustomerActivity relationships
            builder.Entity<CustomerActivity>()
                .HasOne(ca => ca.User)
                .WithMany()
                .HasForeignKey(ca => ca.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
