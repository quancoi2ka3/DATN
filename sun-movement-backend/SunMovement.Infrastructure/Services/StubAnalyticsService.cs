using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Phiên bản đơn giản của AnalyticsService để fix lỗi biên dịch
    /// Trả về dữ liệu giả lập cho các API analytics
    /// </summary>
    public partial class StubAnalyticsService : IAnalyticsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<StubAnalyticsService> _logger;

        public StubAnalyticsService(
            IUnitOfWork unitOfWork,
            ILogger<StubAnalyticsService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<DashboardMetrics> GetDashboardMetricsAsync(DateTime from, DateTime to)
        {
            _logger.LogInformation("Stub GetDashboardMetricsAsync called");
            
            // Add a small delay to make this truly async
            await Task.Delay(1);
            
            var randomGenerator = new Random();
            var metrics = new DashboardMetrics
            {
                TotalOrders = randomGenerator.Next(100, 1000),
                TotalVisits = randomGenerator.Next(1000, 10000),
                ConversionRate = (decimal)(randomGenerator.NextDouble() * 10),
                AverageOrderValue = randomGenerator.Next(50, 200),
                NewCustomers = randomGenerator.Next(10, 100),
                ReturningCustomers = randomGenerator.Next(50, 200)
            };
            
            // Dummy order status data
            metrics.OrdersByStatus = new Dictionary<string, int>
            {
                { OrderStatus.Pending.ToString(), new Random().Next(5, 20) },
                { OrderStatus.Processing.ToString(), new Random().Next(10, 30) },
                { OrderStatus.Shipped.ToString(), new Random().Next(20, 50) },
                { OrderStatus.Completed.ToString(), new Random().Next(30, 100) }
            };
            
            // Dummy sales by category data
            metrics.SalesByCategory = new Dictionary<string, decimal>
            {
                { "Sportswear", new Random().Next(1000, 5000) },
                { "Shoes", new Random().Next(800, 3000) },
                { "Accessories", new Random().Next(500, 2000) }
            };
            
            // Dummy visits by source data
            metrics.VisitsBySource = new Dictionary<string, int>
            {
                { "Direct", new Random().Next(100, 500) },
                { "Search", new Random().Next(200, 800) },
                { "Social", new Random().Next(50, 300) },
                { "Referral", new Random().Next(30, 150) }
            };
            
            // Calculate total sales based on sales by category
            metrics.TotalSales = metrics.SalesByCategory.Values.Sum();
            
            return metrics;
        }

        public async Task<ProductMetrics> GetProductMetricsAsync(int productId, DateTime from, DateTime to)
        {
            _logger.LogInformation("Stub GetProductMetricsAsync called for product {ProductId}", productId);
            
            // Add a small delay to make this truly async
            await Task.Delay(1);
            
            var randomGenerator = new Random();
            var viewsByDevice = new Dictionary<string, int>
            {
                { "Mobile", randomGenerator.Next(50, 300) },
                { "Desktop", randomGenerator.Next(30, 200) },
                { "Tablet", randomGenerator.Next(10, 50) }
            };
            
            return new ProductMetrics
            {
                ProductId = productId,
                ProductName = "Product " + productId,
                TotalViews = randomGenerator.Next(100, 1000),
                AddToCarts = randomGenerator.Next(20, 200),
                Purchases = randomGenerator.Next(5, 50),
                ConversionRate = (decimal)(randomGenerator.NextDouble() * 15),
                AbandonmentRate = (decimal)(randomGenerator.NextDouble() * 50),
                ViewsByDevice = viewsByDevice,
                ViewsBySource = new Dictionary<string, int>
                {
                    { "Direct", randomGenerator.Next(20, 100) },
                    { "Search", randomGenerator.Next(30, 150) }
                },
                ViewsOverTime = new Dictionary<DateTime, int>(),
                SalesOverTime = new Dictionary<DateTime, int>()
            };
        }

        public async Task<Core.Interfaces.InventoryMetrics> GetInventoryMetricsAsync(DateTime from, DateTime to)
        {
            _logger.LogInformation("Stub GetInventoryMetricsAsync called");
            
            var products = await _unitOfWork.Products.GetAllAsync();
            var inStockCount = products.Count(p => p.StockQuantity > 0);
            var randomGenerator = new Random();
            
            var metrics = new Core.Interfaces.InventoryMetrics
            {
                ProductsInStock = inStockCount,
                ProductsOutOfStock = products.Count() - inStockCount,
                ProductsLowStock = randomGenerator.Next(5, 20),
                TotalInventoryValue = products.Sum(p => p.StockQuantity * p.CostPrice),
                AverageDaysInInventory = (decimal)(randomGenerator.Next(10, 60)),
                TotalStockIn = randomGenerator.Next(50, 200),
                TotalStockOut = randomGenerator.Next(30, 150),
                TotalCostOfGoodsSold = randomGenerator.Next(1000, 5000)
            };
            
            metrics.InventoryValueByCategory = new Dictionary<string, decimal>
            {
                { "Sportswear", randomGenerator.Next(500, 3000) },
                { "Shoes", randomGenerator.Next(400, 2000) },
                { "Accessories", randomGenerator.Next(200, 1000) }
            };
            
            metrics.StockLevelsByCategory = new Dictionary<string, int>
            {
                { "Sportswear", randomGenerator.Next(20, 100) },
                { "Shoes", randomGenerator.Next(15, 80) },
                { "Accessories", randomGenerator.Next(10, 50) }
            };
            
            return metrics;
        }

        public async Task<CouponMetrics> GetCouponMetricsAsync(int? couponId = null, DateTime? from = null, DateTime? to = null)
        {
            _logger.LogInformation("Stub GetCouponMetricsAsync called for coupon {CouponId}", couponId);
            
            var randomGenerator = new Random();
            var result = new CouponMetrics
            {
                TotalCouponsUsed = randomGenerator.Next(10, 100),
                TotalDiscountAmount = randomGenerator.Next(100, 1000),
                AverageDiscountPerOrder = randomGenerator.Next(10, 50),
                AverageDailyUsage = randomGenerator.Next(1, 10),
                ActiveCoupons = randomGenerator.Next(5, 20),
                ExpiredCoupons = randomGenerator.Next(0, 5)
            };
            
            result.UsageByCode = new Dictionary<string, int>
            {
                { "SUMMER10", randomGenerator.Next(5, 30) },
                { "WELCOME20", randomGenerator.Next(10, 40) },
                { "HOLIDAY15", randomGenerator.Next(3, 25) }
            };
            
            result.DiscountByCode = new Dictionary<string, decimal>
            {
                { "SUMMER10", randomGenerator.Next(100, 500) },
                { "WELCOME20", randomGenerator.Next(200, 800) },
                { "HOLIDAY15", randomGenerator.Next(50, 300) }
            };
            
            result.UsageOverTime = new Dictionary<DateTime, int>();
            for (int i = 0; i < 7; i++)
            {
                result.UsageOverTime[DateTime.Now.AddDays(-i)] = randomGenerator.Next(1, 10);
            }
            
            // Add async operation to make this method truly async
            await Task.Delay(1);
            
            return result;
        }

        public async Task<InventoryForecast> GetInventoryForecastAsync()
        {
            _logger.LogInformation("Stub GetInventoryForecastAsync called");
            
            var products = await _unitOfWork.Products.GetAllAsync();
            var forecast = new InventoryForecast
            {
                GeneratedAt = DateTime.UtcNow,
                Products = new List<ProductForecast>()
            };
            
            var randomGenerator = new Random();
            
            foreach (var product in products.Take(10))
            {
                forecast.Products.Add(new ProductForecast
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    SKU = product.Sku ?? "",
                    CurrentStock = product.StockQuantity,
                    DailySalesRate = Math.Round(randomGenerator.NextDouble() * 5, 2),
                    DaysUntilOutOfStock = randomGenerator.Next(5, 60),
                    StockStatus = product.StockQuantity > 20 ? "Healthy" : (product.StockQuantity > 5 ? "Warning" : "Critical"),
                    ReorderQuantity = randomGenerator.Next(10, 50),
                    EstimatedReorderCost = randomGenerator.Next(50, 500)
                });
            }
            
            return forecast;
        }

        public async Task<CouponAnalytics> GetCouponAnalyticsAsync(DateTime from, DateTime to)
        {
            _logger.LogInformation("Stub GetCouponAnalyticsAsync called");
            
            var coupons = await _unitOfWork.Coupons.GetAllAsync();
            var randomGenerator = new Random();
            
            var analytics = new CouponAnalytics
            {
                TotalDiscountAmount = randomGenerator.Next(500, 5000),
                TotalUsage = randomGenerator.Next(20, 200),
                GeneratedAt = DateTime.UtcNow,
                Coupons = new List<CouponStats>()
            };
            
            foreach (var coupon in coupons.Take(5))
            {
                var couponStats = new CouponStats
                {
                    CouponId = coupon.Id,
                    CouponCode = coupon.Code ?? "CODE" + coupon.Id,
                    UsageCount = randomGenerator.Next(5, 50),
                    TotalDiscountAmount = randomGenerator.Next(100, 1000),
                    AverageOrderValue = randomGenerator.Next(50, 200),
                    ConversionRate = (decimal)(randomGenerator.NextDouble() * 30),
                    UsageByDay = new Dictionary<DateTime, int>()
                };
                
                // Add some daily usage data
                for (int i = 0; i < 7; i++)
                {
                    couponStats.UsageByDay[DateTime.Today.AddDays(-i)] = randomGenerator.Next(0, 5);
                }
                
                analytics.Coupons.Add(couponStats);
            }
            
            return analytics;
        }

        public async Task<IEnumerable<TopSellingProduct>> GetTopSellingProductsAsync(int count = 10, DateTime? from = null, DateTime? to = null)
        {
            _logger.LogInformation("Stub GetTopSellingProductsAsync called");
            
            var products = await _unitOfWork.Products.GetAllAsync();
            var result = new List<TopSellingProduct>();
            var randomGenerator = new Random();
            
            foreach (var product in products.Take(count))
            {
                result.Add(new TopSellingProduct
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    SKU = product.Sku ?? string.Empty,
                    QuantitySold = randomGenerator.Next(5, 50),
                    Revenue = randomGenerator.Next(100, 2000),
                    Profit = randomGenerator.Next(50, 1000),
                    Views = randomGenerator.Next(50, 500),
                    ConversionRate = (decimal)(randomGenerator.NextDouble() * 10)
                });
            }
            
            return result.OrderByDescending(p => p.Revenue);
        }

        // Implementation moved to StubAnalyticsService.extended.cs
    }
}
