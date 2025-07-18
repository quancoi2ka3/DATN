using System;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace SunMovement.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool _disposed = false;        private IProductRepository? _productRepository;
        private IServiceRepository? _serviceRepository;
        private IRepository<Event>? _eventRepository;
        private IRepository<FAQ>? _faqRepository;
        private IRepository<ContactMessage>? _contactMessageRepository;
        private OrderRepository? _orderRepository;
        private IRepository<OrderItem>? _orderItemRepository;
        private IArticleRepository? _articleRepository;
        
        // Thêm private fields cho repositories mới
        private ISupplierRepository? _supplierRepository;
        private IInventoryTransactionRepository? _inventoryTransactionRepository;
        private IProductSupplierRepository? _productSupplierRepository;
        private ICouponRepository? _couponRepository;
        private ICouponUsageHistoryRepository? _couponUsageHistoryRepository;
        
        // Thêm private fields cho integrated system repositories
        private IRepository<CouponProduct>? _couponProductRepository;
        private IRepository<InventoryItem>? _inventoryItemRepository;
        
        // Thêm private fields cho product enhancement repositories
        private IRepository<ProductVariant>? _productVariantRepository;
        private IRepository<ProductReview>? _productReviewRepository;
        private IRepository<ProductImage>? _productImageRepository;
        private IRepository<Tag>? _tagRepository;
        private IRepository<ProductTag>? _productTagRepository;
        private IRepository<OrderStatusHistory>? _orderStatusHistoryRepository;
        
        private readonly ICacheService _cacheService;
        private readonly ILogger<CouponRepository> _couponLogger;

        public UnitOfWork(ApplicationDbContext context, ICacheService cacheService, ILogger<CouponRepository> couponLogger)
        {
            _context = context;
            _cacheService = cacheService;
            _couponLogger = couponLogger;
        }

        public IProductRepository Products => 
            _productRepository ??= new ProductRepository(_context);

        public IServiceRepository Services => 
            _serviceRepository ??= new ServiceRepository(_context);

        public IRepository<Event> Events => 
            _eventRepository ??= new Repository<Event>(_context);

        public IRepository<FAQ> FAQs => 
            _faqRepository ??= new Repository<FAQ>(_context);

        public IRepository<ContactMessage> ContactMessages => 
            _contactMessageRepository ??= new Repository<ContactMessage>(_context);

        public IRepository<Order> Orders => 
            _orderRepository ??= new OrderRepository(_context);

        public IRepository<OrderItem> OrderItems => 
            _orderItemRepository ??= new Repository<OrderItem>(_context);

        public IArticleRepository Articles => 
            _articleRepository ??= new ArticleRepository(_context);
            
        // Implement các repositories mới
        public ISupplierRepository Suppliers =>
            _supplierRepository ??= new SupplierRepository(_context);

        public IInventoryTransactionRepository InventoryTransactions =>
            _inventoryTransactionRepository ??= new InventoryTransactionRepository(_context);

        public IProductSupplierRepository ProductSuppliers =>
            _productSupplierRepository ??= new ProductSupplierRepository(_context);

        public ICouponRepository Coupons =>
            _couponRepository ??= new CouponRepository(_context, _couponLogger);

        public ICouponUsageHistoryRepository CouponUsageHistories =>
            _couponUsageHistoryRepository ??= new CouponUsageHistoryRepository(_context);
            
        // Implement integrated system repositories
        public IRepository<CouponProduct> CouponProducts =>
            _couponProductRepository ??= new Repository<CouponProduct>(_context);
            
        public IRepository<InventoryItem> InventoryItems =>
            _inventoryItemRepository ??= new Repository<InventoryItem>(_context);

        // Implement các repositories cho product enhancement
        public IRepository<ProductVariant> ProductVariants =>
            _productVariantRepository ??= new Repository<ProductVariant>(_context);

        public IRepository<ProductReview> ProductReviews =>
            _productReviewRepository ??= new Repository<ProductReview>(_context);

        public IRepository<ProductImage> ProductImages =>
            _productImageRepository ??= new Repository<ProductImage>(_context);

        public IRepository<Tag> Tags =>
            _tagRepository ??= new Repository<Tag>(_context);

        public IRepository<ProductTag> ProductTags =>
            _productTagRepository ??= new Repository<ProductTag>(_context);

        public IRepository<OrderStatusHistory> OrderStatusHistories =>
            _orderStatusHistoryRepository ??= new Repository<OrderStatusHistory>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void ClearCache()
        {
            _cacheService.Clear();
        }

        public async Task<int> CommitAsync()
        {
            return await CompleteAsync();
        }

        public object GetDbContext()
        {
            throw new NotImplementedException();
        }
    }
}
