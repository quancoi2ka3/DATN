using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{    public interface IUnitOfWork
    {
        IProductRepository Products { get; }
        IServiceRepository Services { get; }
        IRepository<Event> Events { get; }
        IRepository<FAQ> FAQs { get; }
        IRepository<ContactMessage> ContactMessages { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        IArticleRepository Articles { get; }
        
        // Thêm repositories mới cho quản lý kho và mã giảm giá
        ISupplierRepository Suppliers { get; }
        IInventoryTransactionRepository InventoryTransactions { get; }
        IProductSupplierRepository ProductSuppliers { get; }
        ICouponRepository Coupons { get; }
        ICouponUsageHistoryRepository CouponUsageHistories { get; }
        
        // Thêm repository cho integrated system
        IRepository<CouponProduct> CouponProducts { get; }
        IRepository<InventoryItem> InventoryItems { get; }
        
        // Thêm repositories cho product enhancement
        IRepository<ProductVariant> ProductVariants { get; }
        IRepository<ProductReview> ProductReviews { get; }
        IRepository<ProductImage> ProductImages { get; }
        IRepository<Tag> Tags { get; }
        IRepository<ProductTag> ProductTags { get; }
        IRepository<OrderStatusHistory> OrderStatusHistories { get; }
        
        Task<int> CompleteAsync();
        Task<int> CommitAsync(); // Alias cho CompleteAsync

        /// <summary>
        /// Clears all repository caches
        /// </summary>
        void ClearCache();
    }
}
