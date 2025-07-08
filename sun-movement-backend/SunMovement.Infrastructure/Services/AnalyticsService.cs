using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(
            IUnitOfWork unitOfWork,
            MixpanelService mixpanelService,
            ILogger<AnalyticsService> logger)
        {
            _unitOfWork = unitOfWork;
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        /// <summary>
        /// Get inventory insights with more detailed analysis
        /// </summary>
        public async Task<Core.ViewModels.InventoryInsightsViewModel> GetInventoryInsightsAsync()
        {
            try
            {
                // Fetch base inventory metrics
                var metrics = await GetInventoryMetricsAsync(DateTime.UtcNow.AddDays(-30), DateTime.UtcNow);
                
                var insights = new Core.ViewModels.InventoryInsightsViewModel
                {
                    InventoryMetrics = new Core.Models.InventoryMetrics
                    {
                        ProductsInStock = metrics.ProductsInStock,
                        ProductsOutOfStock = metrics.ProductsOutOfStock,
                        ProductsLowStock = metrics.ProductsLowStock,
                        TotalInventoryValue = metrics.TotalInventoryValue,
                        AverageDaysInInventory = metrics.AverageDaysInInventory,
                        TotalSalesThisMonth = metrics.TotalStockOut,
                        ServiceLevel = metrics.ProductsInStock > 0 
                            ? (decimal)metrics.ProductsInStock / (metrics.ProductsInStock + metrics.ProductsOutOfStock) * 100 
                            : 0
                    }
                };
                
                // Get all products for detailed analysis
                var products = await _unitOfWork.Products.GetAllAsync();
                
                // Generate low stock alerts
                foreach (var product in products.Where(p => 
                    p.StockQuantity <= p.MinimumStockLevel || p.StockQuantity <= 0))
                {
                    // Get last restock date from inventory transactions
                    var lastRestock = await _unitOfWork.InventoryTransactions.FindAsync(t => 
                        t.ProductId == product.Id && t.TransactionType == InventoryTransactionType.Purchase);
                    
                    var lastRestockDate = lastRestock.Any() 
                        ? lastRestock.Max(t => t.TransactionDate) 
                        : DateTime.MinValue;
                        
                    insights.LowStockAlerts.Add(new Core.ViewModels.LowStockAlert
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        SKU = product.Sku ?? string.Empty,
                        CurrentStock = product.StockQuantity,
                        MinimumStockLevel = product.MinimumStockLevel,
                        ReorderPoint = product.MinimumStockLevel + 5, // Using MinimumStockLevel as a base for reorder point
                        LastRestock = lastRestockDate
                    });
                }

                // Generate reorder suggestions
                var forecast = await GetInventoryForecastAsync();
                foreach (var productForecast in forecast.Products.Where(p => 
                    p.StockStatus == "Warning" || p.StockStatus == "Critical"))
                {
                    insights.ReorderSuggestions.Add(new Core.ViewModels.ProductReorderSuggestion
                    {
                        ProductId = productForecast.ProductId,
                        ProductName = productForecast.ProductName,
                        SKU = productForecast.SKU,
                        CurrentStock = productForecast.CurrentStock,
                        SuggestedReorderQuantity = productForecast.ReorderQuantity,
                        EstimatedCost = productForecast.EstimatedReorderCost,
                        OptimalReorderDate = DateTime.UtcNow.AddDays(Math.Max(0, productForecast.DaysUntilOutOfStock - 7)),
                        AverageDailySales = productForecast.DailySalesRate,
                        DaysUntilStockout = productForecast.DaysUntilOutOfStock
                    });
                }
                
                return insights;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phân tích chi tiết cho kho hàng");
                return new Core.ViewModels.InventoryInsightsViewModel();
            }
        }

        /// <summary>
        /// Lấy số liệu thống kê tổng quan cho trang Dashboard
        /// </summary>
        public async Task<DashboardMetrics> GetDashboardMetricsAsync(DateTime from, DateTime to)
        {
            try
            {
                var metrics = new DashboardMetrics();
                
                // Lấy dữ liệu từ Mixpanel
                var purchaseEvents = await _mixpanelService.GetEventCountByDayAsync("purchase", from, to);
                var pageViewEvents = await _mixpanelService.GetEventCountByDayAsync("page_view", from, to);
                var productViewEvents = await _mixpanelService.GetEventCountByDayAsync("view_product", from, to);
                var newUserEvents = await _mixpanelService.GetEventCountByDayAsync("new_user_registered", from, to);
                var cartAddEvents = await _mixpanelService.GetEventCountByDayAsync("add_to_cart", from, to);
                var checkoutEvents = await _mixpanelService.GetEventCountByDayAsync("start_checkout", from, to);
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var orders = await _unitOfWork.Orders.FindAsync(o => 
                    o.CreatedAt >= from && o.CreatedAt <= to);
                
                var products = await _unitOfWork.Products.GetAllAsync();
                
                // Tổng hợp dữ liệu
                metrics.TotalOrders = orders.Count();
                metrics.TotalSales = orders.Sum(o => o.SubtotalAmount + o.ShippingAmount + o.TaxAmount - o.DiscountAmount);
                metrics.AverageOrderValue = orders.Any() 
                    ? orders.Average(o => o.SubtotalAmount + o.ShippingAmount + o.TaxAmount - o.DiscountAmount) 
                    : 0;
                
                metrics.TotalVisits = pageViewEvents.Values.Sum();
                metrics.ConversionRate = pageViewEvents.Values.Sum() > 0
                    ? (decimal)purchaseEvents.Values.Sum() / pageViewEvents.Values.Sum() * 100
                    : 0;
                
                metrics.NewCustomers = newUserEvents.Values.Sum();
                
                // Lấy thông tin đơn hàng theo trạng thái
                metrics.OrdersByStatus = orders
                    .GroupBy(o => o.Status)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Count()
                    );
                
                // Lấy thông tin doanh thu theo danh mục
                metrics.SalesByCategory = orders
                    .SelectMany(o => o.OrderItems)
                    .GroupBy(i => i.Product?.Category.ToString() ?? "Unknown")
                    .ToDictionary(
                        g => g.Key,
                        g => g.Sum(i => i.UnitPrice * i.Quantity)
                    );
                
                // Lấy thông tin tồn kho
                metrics.ProductsOutOfStock = products.Count(p => p.StockQuantity <= 0);
                metrics.ProductsLowStock = products.Count(p => 
                    p.StockQuantity > 0 && p.StockQuantity <= p.MinimumStockLevel);
                
                // Thông tin về nguồn truy cập (giả định từ Mixpanel)
                metrics.VisitsBySource = new Dictionary<string, int>
                {
                    { "Direct", (int)(pageViewEvents.Values.Sum() * 0.4) },
                    { "Organic Search", (int)(pageViewEvents.Values.Sum() * 0.3) },
                    { "Social Media", (int)(pageViewEvents.Values.Sum() * 0.2) },
                    { "Referral", (int)(pageViewEvents.Values.Sum() * 0.1) }
                };
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy số liệu thống kê tổng quan cho trang Dashboard");
                return new DashboardMetrics();
            }
        }

        /// <summary>
        /// Lấy thông tin phân tích cho sản phẩm
        /// </summary>
        public async Task<ProductMetrics> GetProductMetricsAsync(int productId, DateTime from, DateTime to)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");
                }
                
                var metrics = new ProductMetrics
                {
                    ProductId = productId,
                    ProductName = product.Name
                };
                
                // Lấy dữ liệu từ Mixpanel
                var productViewEvents = await _mixpanelService.GetEventsByPropertyAsync(
                    "view_product",
                    "product_id",
                    productId.ToString(),
                    from, to);
                
                var addToCartEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                    "add_to_cart",
                    "product_id",
                    productId.ToString(),
                    from, to);
                
                var purchaseEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                    "purchase_item",
                    "product_id",
                    productId.ToString(),
                    from, to);
                
                // Tổng hợp dữ liệu
                metrics.TotalViews = productViewEvents.Count();
                metrics.AddToCarts = addToCartEvents.Count();
                metrics.Purchases = purchaseEvents.Count();
                
                // Tính tỷ lệ chuyển đổi
                metrics.ConversionRate = metrics.TotalViews > 0
                    ? (decimal)metrics.Purchases / metrics.TotalViews * 100
                    : 0;
                
                // Tính tỷ lệ bỏ giỏ hàng
                metrics.AbandonmentRate = metrics.AddToCarts > 0
                    ? (decimal)(metrics.AddToCarts - metrics.Purchases) / metrics.AddToCarts * 100
                    : 0;
                
                // Phân tích theo thiết bị
                // Process device type using JsonElement parsing
                var viewsByDeviceDict = new Dictionary<string, int>();
                foreach (var eventData in productViewEvents)
                {
                    string deviceType = "Unknown";
                    // Extract from dictionary properly
                    if (eventData.TryGetValue("properties", out var propertiesObj) &&
                        propertiesObj is JsonElement propertiesElement &&
                        propertiesElement.TryGetProperty("device_type", out var deviceTypeElement))
                    {
                        deviceType = deviceTypeElement.ToString();
                    }
                    
                    if (!viewsByDeviceDict.ContainsKey(deviceType))
                        viewsByDeviceDict[deviceType] = 0;
                    viewsByDeviceDict[deviceType]++;
                }
                metrics.ViewsByDevice = viewsByDeviceDict;
                
                // Phân tích theo nguồn
                metrics.ViewsBySource = new Dictionary<string, int>();
                foreach (var eventData in productViewEvents)
                {
                    string source = "Direct";
                    if (eventData.TryGetValue("properties", out var propertiesObj) &&
                        propertiesObj is JsonElement propertiesElement &&
                        propertiesElement.TryGetProperty("utm_source", out var sourceElement))
                    {
                        source = sourceElement.ToString();
                    }
                    
                    if (!metrics.ViewsBySource.ContainsKey(source))
                        metrics.ViewsBySource[source] = 0;
                    metrics.ViewsBySource[source]++;
                }
                
                // Phân tích theo thời gian
                metrics.ViewsOverTime = new Dictionary<DateTime, int>();
                foreach (var eventData in productViewEvents)
                {
                    DateTime eventDate = DateTime.UtcNow;
                    if (eventData.TryGetValue("time", out var timeObj) && 
                        timeObj is JsonElement timeElement &&
                        timeElement.TryGetInt64(out long unixTime))
                    {
                        eventDate = DateTimeOffset.FromUnixTimeSeconds(unixTime).DateTime.Date;
                    }
                    
                    if (!metrics.ViewsOverTime.ContainsKey(eventDate))
                        metrics.ViewsOverTime[eventDate] = 0;
                    metrics.ViewsOverTime[eventDate]++;
                }
                
                metrics.SalesOverTime = new Dictionary<DateTime, int>();
                foreach (var eventData in purchaseEvents)
                {
                    DateTime eventDate = DateTime.UtcNow;
                    if (eventData.TryGetValue("time", out var timeObj) && 
                        timeObj is JsonElement timeElement &&
                        timeElement.TryGetInt64(out long unixTime))
                    {
                        eventDate = DateTimeOffset.FromUnixTimeSeconds(unixTime).DateTime.Date;
                    }
                    
                    if (!metrics.SalesOverTime.ContainsKey(eventDate))
                        metrics.SalesOverTime[eventDate] = 0;
                    metrics.SalesOverTime[eventDate]++;
                }
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phân tích cho sản phẩm {ProductId}", productId);
                return new ProductMetrics { ProductId = productId };
            }
        }

        /// <summary>
        /// Lấy thông tin phân tích cho kho hàng
        /// </summary>
        public async Task<Core.Interfaces.InventoryMetrics> GetInventoryMetricsAsync(DateTime from, DateTime to)
        {
            try
            {
                var metrics = new Core.Interfaces.InventoryMetrics();
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var products = await _unitOfWork.Products.GetAllAsync();
                var transactions = await _unitOfWork.InventoryTransactions.FindAsync(t => 
                    t.TransactionDate >= from && t.TransactionDate <= to);
                
                // Tổng hợp dữ liệu tồn kho
                metrics.TotalInventoryValue = products.Sum(p => p.StockQuantity * p.CostPrice);
                metrics.ProductsInStock = products.Count(p => p.StockQuantity > 0);
                metrics.ProductsOutOfStock = products.Count(p => p.StockQuantity <= 0);
                metrics.ProductsLowStock = products.Count(p => 
                    p.StockQuantity > 0 && p.StockQuantity <= p.MinimumStockLevel);
                
                // Tính số ngày trung bình trong kho
                var productsWithStock = products.Where(p => p.StockQuantity > 0 && p.FirstStockDate != default);
                metrics.AverageDaysInInventory = productsWithStock.Any()
                    ? (decimal)productsWithStock.Average(p => (DateTime.UtcNow - p.FirstStockDate).TotalDays)
                    : 0;
                
                // Phân tích giá trị tồn kho theo danh mục
                metrics.InventoryValueByCategory = products
                    .GroupBy(p => p.Category)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Sum(p => p.StockQuantity * p.CostPrice)
                    );
                
                // Phân tích số lượng tồn kho theo danh mục
                metrics.StockLevelsByCategory = products
                    .GroupBy(p => p.Category)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Sum(p => p.StockQuantity)
                    );
                
                // Tổng hợp dữ liệu giao dịch kho
                metrics.TotalStockIn = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Purchase)
                    .Sum(t => t.Quantity);
                
                metrics.TotalStockOut = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Sale)
                    .Sum(t => -t.Quantity); // Đổi dấu vì giao dịch bán có số lượng âm
                
                metrics.TotalCostOfGoodsSold = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Sale)
                    .Sum(t => -t.Quantity * t.UnitPrice);
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phân tích cho kho hàng");
                return new Core.Interfaces.InventoryMetrics();
            }
        }

        /// <summary>
        /// Lấy thông tin phân tích cho mã giảm giá
        /// </summary>
        public async Task<CouponMetrics> GetCouponMetricsAsync(int? couponId = null, DateTime? from = null, DateTime? to = null)
        {
            try
            {
                var metrics = new CouponMetrics();
                
                // Nếu không cung cấp thời gian, sử dụng 30 ngày gần đây
                from = from ?? DateTime.UtcNow.AddDays(-30);
                to = to ?? DateTime.UtcNow;
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var coupons = couponId.HasValue
                    ? new[] { await _unitOfWork.Coupons.GetByIdAsync(couponId.Value) }.Where(c => c != null)
                    : await _unitOfWork.Coupons.GetAllAsync();
                
                var usageHistory = await _unitOfWork.CouponUsageHistories.FindAsync(h => 
                    h.UsedAt >= from && h.UsedAt <= to);
                
                if (couponId.HasValue)
                {
                    usageHistory = usageHistory.Where(h => h.CouponId == couponId.Value);
                }
                
                // Tổng hợp dữ liệu
                metrics.TotalCouponsUsed = usageHistory.Count();
                metrics.TotalDiscountAmount = usageHistory.Sum(h => h.DiscountAmount);
                metrics.AverageDiscountPerOrder = usageHistory.Any()
                    ? usageHistory.Average(h => h.DiscountAmount)
                    : 0;
                
                // Phân tích theo mã giảm giá
                metrics.UsageByCode = usageHistory
                    .GroupBy(h => h.Coupon?.Code ?? "Unknown")
                    .ToDictionary(
                        g => g.Key,
                        g => g.Count()
                    );
                
                metrics.DiscountByCode = usageHistory
                    .GroupBy(h => h.Coupon?.Code ?? "Unknown")
                    .ToDictionary(
                        g => g.Key,
                        g => g.Sum(h => h.DiscountAmount)
                    );
                
                // Phân tích theo thời gian
                metrics.UsageOverTime = usageHistory
                    .GroupBy(h => h.UsedAt.Date)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Count()
                    );
                
                // Tính trung bình sử dụng hàng ngày
                int dayCount = Math.Max(1, (to.Value - from.Value).Days);
                metrics.AverageDailyUsage = metrics.TotalCouponsUsed / dayCount;
                
                // Đếm số lượng mã giảm giá đang hoạt động và hết hạn
                metrics.ActiveCoupons = coupons.Count(c => c.IsActive && c.EndDate > DateTime.UtcNow);
                metrics.ExpiredCoupons = coupons.Count(c => c.EndDate < DateTime.UtcNow);
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phân tích cho mã giảm giá");
                return new CouponMetrics();
            }
        }

        /// <summary>
        /// Lấy thông tin dự báo tồn kho
        /// </summary>
        public async Task<InventoryForecast> GetInventoryForecastAsync()
        {
            try
            {
                var forecast = new InventoryForecast
                {
                    GeneratedAt = DateTime.UtcNow
                };
                
                // Lấy tất cả sản phẩm
                var products = await _unitOfWork.Products.GetAllAsync();
                
                // Lấy dữ liệu bán hàng từ Mixpanel trong 30 ngày qua
                var from = DateTime.UtcNow.AddDays(-30);
                var to = DateTime.UtcNow;
                
                foreach (var product in products)
                {
                    // Lấy dữ liệu bán hàng cho sản phẩm
                    var purchaseEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                        "purchase_item",
                        "product_id",
                        product.Id.ToString(),
                        from, to);
                    
                    // Tính tổng số lượng bán
                    int totalSold = 0;
                    foreach (var purchaseEvent in purchaseEvents)
                    {
                        if (purchaseEvent.TryGetValue("properties", out var propertiesObj) &&
                            propertiesObj is JsonElement propertiesElement &&
                            propertiesElement.TryGetProperty("quantity", out var quantityElement))
                        {
                            if (int.TryParse(quantityElement.ToString(), out int quantity))
                            {
                                totalSold += quantity;
                            }
                        }
                        else
                        {
                            totalSold += 1; // Mặc định là 1 nếu không có thông tin số lượng
                        }
                    }
                    
                    // Tính tốc độ bán hàng trung bình mỗi ngày
                    double dailySalesRate = (double)totalSold / 30;
                    
                    // Ước tính số ngày còn lại trước khi hết hàng
                    int daysUntilOutOfStock = dailySalesRate > 0
                        ? (int)Math.Ceiling(product.StockQuantity / dailySalesRate)
                        : 999; // Giá trị mặc định cao nếu không có dữ liệu bán hàng
                    
                    // Xác định trạng thái tồn kho
                    string stockStatus = "Healthy";
                    if (daysUntilOutOfStock <= 7)
                        stockStatus = "Critical";
                    else if (daysUntilOutOfStock <= 14)
                        stockStatus = "Warning";
                    
                    // Tính toán số lượng đề xuất nhập thêm
                    int reorderQuantity = 0;
                    if (product.StockQuantity <= product.MinimumStockLevel)
                    {
                        // Số lượng nhập = Doanh số dự kiến 30 ngày tới - Số tồn hiện tại
                        reorderQuantity = Math.Max(0, (int)Math.Ceiling(dailySalesRate * 30) - product.StockQuantity);
                    }
                    
                    // Ước tính chi phí nhập hàng
                    decimal estimatedCost = reorderQuantity * product.CostPrice;
                    
                    forecast.Products.Add(new ProductForecast
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        SKU = product.Sku ?? "",
                        CurrentStock = product.StockQuantity,
                        DailySalesRate = dailySalesRate,
                        DaysUntilOutOfStock = daysUntilOutOfStock,
                        StockStatus = stockStatus,
                        ReorderQuantity = reorderQuantity,
                        EstimatedReorderCost = estimatedCost
                    });
                }
                
                // Sắp xếp theo mức độ ưu tiên
                forecast.Products = forecast.Products
                    .OrderBy(p => p.StockStatus == "Critical" ? 0 : p.StockStatus == "Warning" ? 1 : 2)
                    .ThenBy(p => p.DaysUntilOutOfStock)
                    .ToList();
                
                return forecast;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin dự báo tồn kho");
                return new InventoryForecast { GeneratedAt = DateTime.UtcNow };
            }
        }

        /// <summary>
        /// Lấy thông tin phân tích hiệu quả mã giảm giá
        /// </summary>
        public async Task<CouponAnalytics> GetCouponAnalyticsAsync(DateTime from, DateTime to)
        {
            try
            {
                var analytics = new CouponAnalytics
                {
                    GeneratedAt = DateTime.UtcNow
                };
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var usageHistory = await _unitOfWork.CouponUsageHistories.FindAsync(h => 
                    h.UsedAt >= from && h.UsedAt <= to);
                
                // Lấy dữ liệu từ Mixpanel
                var couponEvents = await _mixpanelService.GetEventCountByDayAsync("use_coupon", from, to);
                
                // Phân tích theo mã giảm giá
                var couponStats = usageHistory
                    .GroupBy(h => h.CouponId)
                    .Select(async g => {
                        var coupon = await _unitOfWork.Coupons.GetByIdAsync(g.Key);
                        if (coupon == null) return null;
                        
                        // Lấy dữ liệu chuyển đổi từ Mixpanel
                        var viewEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                            "view_coupon",
                            "coupon_code",
                            coupon.Code,
                            from, to);
                        
                        var useEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                            "use_coupon",
                            "coupon_code",
                            coupon.Code,
                            from, to);
                        
                        decimal conversionRate = viewEvents.Any()
                            ? (decimal)useEvents.Count() / viewEvents.Count() * 100
                            : 0;
                        
                        // Phân tích sử dụng theo ngày
                        var usageByDay = g
                            .GroupBy(h => h.UsedAt.Date)
                            .ToDictionary(
                                dayGroup => dayGroup.Key,
                                dayGroup => dayGroup.Count()
                            );
                        
                        return new CouponStats
                        {
                            CouponId = coupon.Id,
                            CouponCode = coupon.Code,
                            UsageCount = g.Count(),
                            TotalDiscountAmount = g.Sum(h => h.DiscountAmount),
                            AverageOrderValue = g.Average(h => h.DiscountAmount),
                            ConversionRate = conversionRate,
                            UsageByDay = usageByDay
                        };
                    })
                    .Where(task => task.Result != null)
                    .Select(task => task.Result)
                    .ToList();
                
                analytics.Coupons = couponStats.Where(s => s != null).Select(s => s!).ToList();
                analytics.TotalUsage = analytics.Coupons.Sum(c => c.UsageCount);
                analytics.TotalDiscountAmount = analytics.Coupons.Sum(c => c.TotalDiscountAmount);
                
                return analytics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phân tích hiệu quả mã giảm giá");
                return new CouponAnalytics { GeneratedAt = DateTime.UtcNow };
            }
        }
        
        /// <summary>
        /// Lấy dữ liệu sản phẩm bán chạy
        /// </summary>
        public async Task<IEnumerable<TopSellingProduct>> GetTopSellingProductsAsync(int count = 10, DateTime? from = null, DateTime? to = null)
        {
            try
            {
                // Nếu không cung cấp thời gian, sử dụng 30 ngày gần đây
                from = from ?? DateTime.UtcNow.AddDays(-30);
                to = to ?? DateTime.UtcNow;
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var orders = await _unitOfWork.Orders.FindAsync(o => 
                    o.CreatedAt >= from && o.CreatedAt <= to && o.Status != OrderStatus.Cancelled);
                
                var orderItems = orders.SelectMany(o => o.OrderItems);
                
                // Tổng hợp dữ liệu theo sản phẩm
                var productSales = orderItems
                    .GroupBy(i => i.ProductId)
                    .Select(async g => {
                        var product = await _unitOfWork.Products.GetByIdAsync(g.Key);
                        if (product == null) return null;
                        
                        int quantitySold = g.Sum(i => i.Quantity);
                        decimal revenue = g.Sum(i => i.UnitPrice * i.Quantity);
                        decimal costOfGoods = g.Sum(i => product.CostPrice * i.Quantity);
                        decimal profit = revenue - costOfGoods;
                        
                        // Lấy dữ liệu xem sản phẩm từ Mixpanel
                        var viewEvents = await _mixpanelService.GetEventDataByPropertyAsync(
                            "view_product",
                            "product_id",
                            g.Key.ToString(),
                            from.Value, to.Value);
                        
                        int views = viewEvents.Count();
                        decimal conversionRate = views > 0
                            ? (decimal)quantitySold / views * 100
                            : 0;
                        
                        return new TopSellingProduct
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            SKU = product.Sku ?? "",
                            QuantitySold = quantitySold,
                            Revenue = revenue,
                            Profit = profit,
                            Views = views,
                            ConversionRate = conversionRate
                        };
                    })
                    .Where(task => task.Result != null)
                    .Select(task => task.Result)
                    .Where(p => p != null)
                    .OrderByDescending(p => p!.Revenue)
                    .Take(count)
                    .ToList();
                
                return productSales.Where(p => p != null).Select(p => p!);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu sản phẩm bán chạy");
                return new List<TopSellingProduct>();
            }
        }

        /// <summary>
        /// Lấy dữ liệu khách hàng thân thiết
        /// </summary>
        public async Task<IEnumerable<TopCustomer>> GetTopCustomersAsync(int count = 10, DateTime? from = null, DateTime? to = null)
        {
            try
            {
                // Nếu không cung cấp thời gian, sử dụng 30 ngày gần đây
                from = from ?? DateTime.UtcNow.AddDays(-30);
                to = to ?? DateTime.UtcNow;
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var orders = await _unitOfWork.Orders.FindAsync(o => 
                    o.CreatedAt >= from && o.CreatedAt <= to && o.Status != OrderStatus.Cancelled);
                
                // Tổng hợp dữ liệu theo khách hàng
                var customerOrders = orders
                    .Where(o => !string.IsNullOrEmpty(o.UserId))
                    .GroupBy(o => o.UserId)
                    .Select(g => {
                        var firstOrder = g.OrderBy(o => o.CreatedAt).FirstOrDefault();
                        var lastOrder = g.OrderByDescending(o => o.CreatedAt).FirstOrDefault();
                        
                        // Kiểm tra xem có sử dụng mã giảm giá không
                        bool hasUsedCoupons = g.Any(o => !string.IsNullOrEmpty(o.CouponCode));
                        
                        // Use UserManager to get user information instead of repository
                        string customerName = "Unknown";
                        string email = "Unknown";
                        // We already have initialized these variables
                        
                        return new TopCustomer
                        {
                            CustomerId = g.Key ?? string.Empty,
                            CustomerName = customerName,
                            Email = email,
                            OrderCount = g.Count(),
                            TotalSpent = g.Sum(o => o.TotalAmount),
                            FirstPurchase = firstOrder?.CreatedAt ?? DateTime.MinValue,
                            LastPurchase = lastOrder?.CreatedAt ?? DateTime.MinValue,
                            HasUsedCoupons = hasUsedCoupons,
                            AverageOrderValue = g.Average(o => o.TotalAmount)
                        };
                    })
                    .ToList();
                
                // No need for Task.WhenAll since we're not using async lambda
                var result = customerOrders;
                
                return result
                    .OrderByDescending(c => c.TotalSpent)
                    .Take(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu khách hàng thân thiết");
                return new List<TopCustomer>();
            }
        }
        
        /// <summary>
        /// Lấy dữ liệu xu hướng bán hàng theo thời gian
        /// </summary>
        public async Task<SalesTrend> GetSalesTrendAsync(string period = "day", int days = 30)
        {
            try
            {
                var trend = new SalesTrend();
                
                // Xác định khoảng thời gian
                var to = DateTime.UtcNow;
                var from = to.AddDays(-days);
                
                // Lấy dữ liệu từ cơ sở dữ liệu
                var orders = await _unitOfWork.Orders.FindAsync(o => 
                    o.CreatedAt >= from && o.CreatedAt <= to && o.Status != OrderStatus.Cancelled);
                
                // Xác định hàm nhóm theo thời gian
                Func<DateTime, DateTime> groupByFunc;
                switch (period.ToLower())
                {
                    case "month":
                        groupByFunc = d => new DateTime(d.Year, d.Month, 1);
                        break;
                    case "week":
                        // Nhóm theo tuần (bắt đầu từ Chủ nhật)
                        groupByFunc = d => d.Date.AddDays(-(int)d.DayOfWeek);
                        break;
                    default: // day
                        groupByFunc = d => d.Date;
                        break;
                }
                
                // Tính toán doanh thu theo thời gian
                trend.Revenue = orders
                    .GroupBy(o => groupByFunc(o.CreatedAt))
                    .ToDictionary(
                        g => g.Key,
                        g => g.Sum(o => o.TotalAmount)
                    );
                
                // Tính toán số đơn hàng theo thời gian
                trend.Orders = orders
                    .GroupBy(o => groupByFunc(o.CreatedAt))
                    .ToDictionary(
                        g => g.Key,
                        g => g.Count()
                    );
                
                // Tính toán giá trị đơn hàng trung bình theo thời gian
                trend.AverageOrderValue = orders
                    .GroupBy(o => groupByFunc(o.CreatedAt))
                    .ToDictionary(
                        g => g.Key,
                        g => g.Average(o => o.TotalAmount)
                    );
                
                // Tính toán doanh thu theo danh mục và thời gian
                var orderItems = orders.SelectMany(o => o.OrderItems.Select(i => new { Order = o, Item = i }));
                
                // Nhóm theo danh mục và thời gian
                var categoryData = orderItems
                    .GroupBy(oi => new { 
                        Category = oi.Item.Product?.Category.ToString() ?? "Unknown",
                        Date = groupByFunc(oi.Order.CreatedAt)
                    })
                    .Select(g => new {
                        Category = g.Key.Category,
                        Date = g.Key.Date,
                        Revenue = g.Sum(oi => oi.Item.UnitPrice * oi.Item.Quantity)
                    })
                    .ToList();
                
                // Chuyển đổi thành từ điển lồng nhau
                trend.RevenueByCategory = categoryData
                    .GroupBy(cd => cd.Category)
                    .ToDictionary(
                        g => g.Key,
                        g => g.ToDictionary(
                            cd => cd.Date,
                            cd => cd.Revenue
                        )
                    );
                
                return trend;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu xu hướng bán hàng theo thời gian");
                return new SalesTrend();
            }
        }
        
        /// <summary>
        /// Get top search queries from Mixpanel analytics
        /// </summary>
        public async Task<List<Core.ViewModels.SearchQueryAnalytics>> GetTopSearchQueriesAsync(int limit = 10)
        {
            try
            {
                var result = new List<Core.ViewModels.SearchQueryAnalytics>();
                
                // Try to get search data from Mixpanel
                var searchData = await _mixpanelService.GetEventDataAsync("search", DateTime.UtcNow.AddDays(-30), DateTime.UtcNow);
                
                if (searchData != null && searchData.Count > 0)
                {
                    var searchAnalytics = ProcessSearchAnalytics(searchData);
                    result = searchAnalytics.Take(limit).ToList();
                }
                
                // If no Mixpanel data, return empty list
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get top search queries from Mixpanel");
                return new List<Core.ViewModels.SearchQueryAnalytics>();
            }
        }
        
        private List<Core.ViewModels.SearchQueryAnalytics> ProcessSearchAnalytics(List<Dictionary<string, object>> searchData)
        {
            var searchQueries = new Dictionary<string, Core.ViewModels.SearchQueryAnalytics>();
            
            try
            {
                foreach (var item in searchData)
                {
                    if (item.TryGetValue("properties", out var properties) && properties is Dictionary<string, object> propDict)
                    {
                        if (propDict.TryGetValue("search_query", out var queryObj))
                        {
                            var query = queryObj?.ToString()?.ToLower()?.Trim();
                            if (!string.IsNullOrEmpty(query))
                            {
                                if (searchQueries.ContainsKey(query))
                                {
                                    searchQueries[query].Count++;
                                }
                                else
                                {
                                    searchQueries[query] = new Core.ViewModels.SearchQueryAnalytics
                                    {
                                        Query = query,
                                        Count = 1,
                                        ResultCount = 0 // Would need additional logic to determine result count
                                    };
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error processing search analytics data");
            }
            
            return searchQueries.Values.OrderByDescending(x => x.Count).ToList();
        }
    }
}
