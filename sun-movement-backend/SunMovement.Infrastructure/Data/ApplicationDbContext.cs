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
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<CustomerReview> CustomerReviews { get; set; }
        public DbSet<CustomerSearchStatistic> CustomerSearchStatistics { get; set; }
        public DbSet<CustomerActivity> CustomerActivities { get; set; }
        public DbSet<PendingUserRegistration> PendingUserRegistrations { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }
        public DbSet<Article> Articles { get; set; }
        
        // Thêm các DbSet mới cho quản lý kho và mã giảm giá
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<InventoryTransaction> InventoryTransactions { get; set; }
        public DbSet<ProductSupplier> ProductSuppliers { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<CouponUsageHistory> CouponUsageHistory { get; set; }
        public DbSet<CouponProduct> CouponProducts { get; set; }
        public DbSet<CouponCategory> CouponCategories { get; set; }
        
        // Thêm các DbSet cho product variants và reviews
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }
        public DbSet<ProductReviewHelpful> ProductReviewHelpfuls { get; set; }
        public DbSet<ProductReviewImage> ProductReviewImages { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductVariantImage> ProductVariantImages { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ProductTag> ProductTags { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Service>()
                .HasMany(s => s.Schedules)
                .WithOne(ss => ss.Service)
                .HasForeignKey(ss => ss.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false); // Allow orders without user for anonymous checkouts

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

            // Configure Product decimal properties
            builder.Entity<Product>()
                .Property(p => p.CostPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Product>()
                .Property(p => p.Weight)
                .HasColumnType("decimal(18,3)");

            builder.Entity<Product>()
                .Property(p => p.AverageRating)
                .HasColumnType("decimal(3,2)");

            // Configure ProductVariant decimal properties
            builder.Entity<ProductVariant>()
                .Property(pv => pv.Price)
                .HasColumnType("decimal(18,2)");

            builder.Entity<ProductVariant>()
                .Property(pv => pv.DiscountPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<ProductVariant>()
                .Property(pv => pv.CostPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<ProductVariant>()
                .Property(pv => pv.Weight)
                .HasColumnType("decimal(18,3)");

            // Configure Coupon decimal properties
            builder.Entity<Coupon>()
                .Property(c => c.Value)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Coupon>()
                .Property(c => c.MinimumOrderAmount)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Coupon>()
                .Property(c => c.MaximumDiscountAmount)
                .HasColumnType("decimal(18,2)");

            // Configure InventoryTransaction decimal properties
            builder.Entity<InventoryTransaction>()
                .Property(it => it.UnitPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<InventoryTransaction>()
                .Property(it => it.TotalCost)
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

            // Configure Inventory Management relationships
            builder.Entity<InventoryTransaction>()
                .HasOne(it => it.Product)
                .WithMany(p => p.InventoryTransactions)
                .HasForeignKey(it => it.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<InventoryTransaction>()
                .HasOne(it => it.Supplier)
                .WithMany(s => s.InventoryTransactions)
                .HasForeignKey(it => it.SupplierId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            builder.Entity<InventoryTransaction>()
                .HasOne(it => it.Order)
                .WithMany()
                .HasForeignKey(it => it.OrderId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            // Configure ProductSupplier relationships
            builder.Entity<ProductSupplier>()
                .HasOne(ps => ps.Product)
                .WithMany(p => p.ProductSuppliers)
                .HasForeignKey(ps => ps.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductSupplier>()
                .HasOne(ps => ps.Supplier)
                .WithMany(s => s.ProductSuppliers)
                .HasForeignKey(ps => ps.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Coupon relationships
            builder.Entity<CouponUsageHistory>()
                .HasOne(cuh => cuh.Coupon)
                .WithMany(c => c.UsageHistory)
                .HasForeignKey(cuh => cuh.CouponId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CouponUsageHistory>()
                .HasOne(cuh => cuh.Order)
                .WithMany()
                .HasForeignKey(cuh => cuh.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure CouponProduct relationships
            builder.Entity<CouponProduct>()
                .HasOne(cp => cp.Coupon)
                .WithMany(c => c.CouponProducts)
                .HasForeignKey(cp => cp.CouponId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CouponProduct>()
                .HasOne(cp => cp.Product)
                .WithMany()
                .HasForeignKey(cp => cp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure CouponCategory relationships
            builder.Entity<CouponCategory>()
                .HasOne(cc => cc.Coupon)
                .WithMany(c => c.CouponCategories)
                .HasForeignKey(cc => cc.CouponId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductVariant relationships
            builder.Entity<ProductVariant>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductVariantImage relationships
            builder.Entity<ProductVariantImage>()
                .HasOne(pvi => pvi.ProductVariant)
                .WithMany(pv => pv.Images)
                .HasForeignKey(pvi => pvi.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductReview relationships
            builder.Entity<ProductReview>()
                .HasOne(pr => pr.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(pr => pr.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductReview>()
                .HasOne(pr => pr.User)
                .WithMany()
                .HasForeignKey(pr => pr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProductReview>()
                .HasOne(pr => pr.Admin)
                .WithMany()
                .HasForeignKey(pr => pr.AdminId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            // Configure ProductReviewHelpful relationships
            builder.Entity<ProductReviewHelpful>()
                .HasOne(prh => prh.ProductReview)
                .WithMany(pr => pr.HelpfulVotes)
                .HasForeignKey(prh => prh.ProductReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductReviewHelpful>()
                .HasOne(prh => prh.User)
                .WithMany()
                .HasForeignKey(prh => prh.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure ProductReviewImage relationships
            builder.Entity<ProductReviewImage>()
                .HasOne(pri => pri.ProductReview)
                .WithMany(pr => pr.Images)
                .HasForeignKey(pri => pri.ProductReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductImage relationships
            builder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductTag relationships
            builder.Entity<ProductTag>()
                .HasOne(pt => pt.Product)
                .WithMany(p => p.ProductTags)
                .HasForeignKey(pt => pt.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductTag>()
                .HasOne(pt => pt.Tag)
                .WithMany(t => t.ProductTags)
                .HasForeignKey(pt => pt.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure indexes for performance
            builder.Entity<InventoryTransaction>()
                .HasIndex(it => it.TransactionDate);

            builder.Entity<InventoryTransaction>()
                .HasIndex(it => it.ProductId);

            builder.Entity<Coupon>()
                .HasIndex(c => c.Code)
                .IsUnique();

            builder.Entity<Coupon>()
                .HasIndex(c => new { c.StartDate, c.EndDate });

            // Additional indexes for better performance
            builder.Entity<Product>()
                .HasIndex(p => p.Sku)
                .IsUnique()
                .HasFilter("[Sku] IS NOT NULL");

            builder.Entity<Product>()
                .HasIndex(p => p.Slug)
                .IsUnique()
                .HasFilter("[Slug] IS NOT NULL");

            builder.Entity<Product>()
                .HasIndex(p => p.Category);

            builder.Entity<Product>()
                .HasIndex(p => p.IsActive);

            builder.Entity<ProductVariant>()
                .HasIndex(pv => pv.Sku)
                .IsUnique()
                .HasFilter("[Sku] IS NOT NULL");

            builder.Entity<ProductVariant>()
                .HasIndex(pv => pv.ProductId);

            builder.Entity<ProductReview>()
                .HasIndex(pr => pr.ProductId);

            builder.Entity<ProductReview>()
                .HasIndex(pr => pr.IsApproved);

            builder.Entity<ProductReview>()
                .HasIndex(pr => pr.UserId);

            builder.Entity<ProductReview>()
                .HasIndex(pr => pr.CreatedAt);

            builder.Entity<ProductReviewHelpful>()
                .HasIndex(prh => new { prh.ProductReviewId, prh.UserId })
                .IsUnique();

            builder.Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();

            builder.Entity<Tag>()
                .HasIndex(t => t.Slug)
                .IsUnique()
                .HasFilter("[Slug] IS NOT NULL");
        }
    }
}
