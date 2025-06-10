using System;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;

namespace SunMovement.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool _disposed = false;

        private IProductRepository _productRepository;
        private IServiceRepository _serviceRepository;
        private IRepository<Event> _eventRepository;
        private IRepository<FAQ> _faqRepository;        private IRepository<ContactMessage> _contactMessageRepository;
        private IRepository<Order> _orderRepository;
        private IRepository<OrderItem> _orderItemRepository;
        private readonly ICacheService _cacheService;

        public UnitOfWork(ApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
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
            _orderRepository ??= new Repository<Order>(_context);        public IRepository<OrderItem> OrderItems => 
            _orderItemRepository ??= new Repository<OrderItem>(_context);
            
       

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
    }
}
