using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Repositories
{
    public class InventoryTransactionRepository : Repository<InventoryTransaction>, IInventoryTransactionRepository
    {
        public InventoryTransactionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<InventoryTransaction>> GetProductTransactionHistoryAsync(int productId)
        {
            return await _context.InventoryTransactions
                .Include(it => it.Supplier)
                .Include(it => it.Order)
                .Where(it => it.ProductId == productId)
                .OrderByDescending(it => it.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetTransactionsByTypeAsync(InventoryTransactionType type)
        {
            return await _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .Where(it => it.TransactionType == type)
                .OrderByDescending(it => it.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .Where(it => it.TransactionDate >= startDate && it.TransactionDate <= endDate)
                .OrderByDescending(it => it.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetRecentTransactionsAsync(int count = 10)
        {
            return await _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .OrderByDescending(it => it.TransactionDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalInventoryValueAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive)
                .SumAsync(p => p.StockQuantity * p.CostPrice);
        }

        public async Task<Dictionary<string, decimal>> GetInventoryValueByCategoryAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive && p.StockQuantity > 0)
                .GroupBy(p => p.Category)
                .ToDictionaryAsync(
                    g => g.Key.ToString(),
                    g => g.Sum(p => p.StockQuantity * p.CostPrice)
                );
        }

        public async Task<IEnumerable<InventoryTransaction>> GetAllWithDetailsAsync()
        {
            return await _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .Include(it => it.Order)
                .OrderByDescending(it => it.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetRecentAsync(int days)
        {
            var cutoffDate = DateTime.Now.AddDays(-days);
            return await _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .Where(it => it.TransactionDate >= cutoffDate)
                .OrderByDescending(it => it.TransactionDate)
                .ToListAsync();
        }
    }
}
