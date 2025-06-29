using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IInventoryTransactionRepository : IRepository<InventoryTransaction>
    {
        Task<IEnumerable<InventoryTransaction>> GetAllWithDetailsAsync();
        Task<IEnumerable<InventoryTransaction>> GetProductTransactionHistoryAsync(int productId);
        Task<IEnumerable<InventoryTransaction>> GetTransactionsByTypeAsync(InventoryTransactionType type);
        Task<IEnumerable<InventoryTransaction>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<InventoryTransaction>> GetRecentTransactionsAsync(int count = 10);
        Task<IEnumerable<InventoryTransaction>> GetRecentAsync(int days);
        Task<decimal> GetTotalInventoryValueAsync();
        Task<Dictionary<string, decimal>> GetInventoryValueByCategoryAsync();
    }
}
