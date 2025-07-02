using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    // Extended functionality for StubAnalyticsService
    public partial class StubAnalyticsService : IAnalyticsService
    {
        public async Task<IEnumerable<TopCustomer>> GetTopCustomersAsync(int count = 10, DateTime? from = null, DateTime? to = null)
        {
            _logger.LogInformation("Stub GetTopCustomersAsync called");
            
            var result = new List<TopCustomer>();
            var randomGenerator = new Random();
            
            // Create some sample data
            for (int i = 0; i < count; i++)
            {
                result.Add(new TopCustomer
                {
                    CustomerId = $"user{i}",
                    CustomerName = $"Customer {i}",
                    Email = $"customer{i}@example.com",
                    OrderCount = randomGenerator.Next(2, 20),
                    TotalSpent = randomGenerator.Next(200, 5000),
                    FirstPurchase = DateTime.UtcNow.AddDays(-randomGenerator.Next(30, 365)),
                    LastPurchase = DateTime.UtcNow.AddDays(-randomGenerator.Next(0, 30)),
                    HasUsedCoupons = randomGenerator.Next(0, 2) == 1,
                    AverageOrderValue = randomGenerator.Next(50, 500)
                });
            }
            
            // Add a small delay to make this truly async
            await Task.Delay(1);
            
            return result.OrderByDescending(c => c.TotalSpent);
        }

        public async Task<SalesTrend> GetSalesTrendAsync(string period = "day", int days = 30)
        {
            _logger.LogInformation("Stub GetSalesTrendAsync called with period {Period}", period);
            
            var endDate = DateTime.UtcNow;
            var startDate = period.ToLower() switch
            {
                "month" => endDate.AddMonths(-days / 30),
                "week" => endDate.AddDays(-days),
                _ => endDate.AddDays(-days)
            };
            
            // Add a small delay to make this truly async
            await Task.Delay(1);
            
            var trend = new SalesTrend();
            var dates = new List<DateTime>();
            
            // Generate dates based on the period
            for (var date = startDate; date <= endDate; date = period.ToLower() switch
            {
                "month" => date.AddMonths(1),
                "week" => date.AddDays(7),
                _ => date.AddDays(1)
            })
            {
                dates.Add(date);
            }
            
            // Generate revenue data
            trend.Revenue = dates.ToDictionary(
                d => d,
                d => (decimal)new Random().Next(500, 5000)
            );
            
            // Generate order count data
            trend.Orders = dates.ToDictionary(
                d => d,
                d => new Random().Next(5, 50)
            );
            
            // Generate average order value data
            trend.AverageOrderValue = dates.ToDictionary(
                d => d,
                d => (decimal)new Random().Next(50, 300)
            );
            
            // Generate data for top 3 categories
            var categories = new[] { "Clothing", "Shoes", "Accessories" };
            trend.RevenueByCategory = new Dictionary<string, Dictionary<DateTime, decimal>>();
            
            foreach (var category in categories)
            {
                trend.RevenueByCategory[category] = dates.ToDictionary(
                    d => d,
                    d => (decimal)new Random().Next(100, 2000)
                );
            }
            
            return trend;
        }

        public async Task<Core.ViewModels.InventoryInsightsViewModel> GetInventoryInsightsAsync()
        {
            _logger.LogInformation("Stub GetInventoryInsightsAsync called");
            
            var products = await _unitOfWork.Products.GetAllAsync();
            var insights = new Core.ViewModels.InventoryInsightsViewModel
            {
                InventoryMetrics = new Core.Models.InventoryMetrics
                {
                    ProductsInStock = products.Count(p => p.StockQuantity > 0),
                    ProductsOutOfStock = products.Count(p => p.StockQuantity <= 0),
                    ProductsLowStock = new Random().Next(5, 20),
                    TotalInventoryValue = products.Sum(p => p.StockQuantity * p.CostPrice),
                    AverageDaysInInventory = 30, // Default value
                    // Other metrics are not in the current model, using only available properties
                    TotalSuppliers = new Random().Next(3, 10),
                    AverageCostPerItem = products.Any() ? products.Average(p => p.CostPrice) : 0
                },
                LowStockAlerts = new List<Core.ViewModels.LowStockAlert>(),
                ReorderSuggestions = new List<Core.ViewModels.ProductReorderSuggestion>()
            };
            
            // Add top selling products
            insights.TopSellingProducts = new List<TopSellingProductViewModel>();
            foreach (var product in products.OrderBy(p => Guid.NewGuid()).Take(5)) // Random order since SoldCount doesn't exist
            {
                insights.TopSellingProducts.Add(new TopSellingProductViewModel
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ImageUrl = product.ImageUrl ?? string.Empty,
                    StockQuantity = product.StockQuantity,
                    UnitsSold = new Random().Next(10, 100), // Random value since SoldCount doesn't exist
                    ReorderPoint = Math.Max(5, new Random().Next(10, 100) / 10)
                });
            }
            
            // Add low stock products
            insights.LowStockItems = new List<LowStockItemViewModel>();
            foreach (var product in products.Where(p => p.StockQuantity > 0 && p.StockQuantity < 10).Take(5))
            {
                insights.LowStockItems.Add(new LowStockItemViewModel
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    CurrentStock = product.StockQuantity,
                    ReorderPoint = Math.Max(5, new Random().Next(10, 100) / 10),
                    EstimatedDaysUntilOutOfStock = Math.Max(1, new Random().Next(1, 10))
                });
            }
            
            // Add recent transactions
            insights.RecentTransactions = new List<InventoryTransactionViewModel>();
            for (int i = 0; i < 5; i++)
            {
                var product = products.Skip(i).FirstOrDefault() ?? products.FirstOrDefault();
                if (product != null)
                {
                    insights.RecentTransactions.Add(new InventoryTransactionViewModel
                    {
                        TransactionId = i + 1,
                        ProductId = product.Id,
                        ProductName = product.Name,
                        TransactionType = i % 2 == 0 ? "IN" : "OUT",
                        Quantity = new Random().Next(1, 20),
                        TransactionDate = DateTime.UtcNow.AddDays(-i),
                        TransactionBy = $"User{i + 1}",
                        Notes = $"Sample transaction {i + 1}"
                    });
                }
            }
            
            return insights;
        }
    }
}
