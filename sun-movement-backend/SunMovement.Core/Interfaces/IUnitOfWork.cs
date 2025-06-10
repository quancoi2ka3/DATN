using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IUnitOfWork
    {
        IProductRepository Products { get; }
        IServiceRepository Services { get; }
        IRepository<Event> Events { get; }
        IRepository<FAQ> FAQs { get; }
        IRepository<ContactMessage> ContactMessages { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        
        Task<int> CompleteAsync();

        /// <summary>
        /// Clears all repository caches
        /// </summary>
        void ClearCache();
    }
}
