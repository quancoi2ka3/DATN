using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Administrator")]
    public class AnalyticsController : Controller
    {
        private readonly IRecommendationService _recommendationService;
        private readonly MixpanelService _mixpanelService;
        private readonly IUserInteractionService _userInteractionService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(
            IRecommendationService recommendationService,
            MixpanelService mixpanelService,
            IUserInteractionService userInteractionService,
            ApplicationDbContext context,
            ILogger<AnalyticsController> logger)
        {
            _recommendationService = recommendationService;
            _mixpanelService = mixpanelService;
            _userInteractionService = userInteractionService;
            _context = context;
            _logger = logger;
        }

        public async Task<IActionResult> Dashboard()
        {
            try
            {
                var metrics = await _recommendationService.GetRecommendationMetricsAsync();
                ViewBag.RecommendationMetrics = metrics;
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading analytics dashboard");
                TempData["ErrorMessage"] = "An error occurred while loading the analytics dashboard. Please try again later.";
                return RedirectToAction("Index", "HomeAdmin");
            }
        }

        public async Task<IActionResult> RecommendationPerformance()
        {
            try
            {
                var metrics = await _recommendationService.GetRecommendationMetricsAsync();
                
                return View(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading recommendation performance data");
                TempData["ErrorMessage"] = "An error occurred while loading the recommendation performance data. Please try again later.";
                return RedirectToAction("Dashboard");
            }
        }
        
        public async Task<IActionResult> UserBehavior()
        {
            try
            {
                // Get data for engagement chart - past 30 days
                var startDate = DateTime.Now.AddDays(-30);
                var endDate = DateTime.Now;
                
                // Get date labels
                var dateRange = Enumerable.Range(0, 31)
                    .Select(i => startDate.AddDays(i))
                    .ToList();
                ViewBag.EngagementDates = dateRange.Select(d => d.ToString("MM/dd")).ToList();
                
                // Get page views from Mixpanel
                var pageViewsData = await _mixpanelService.GetEventCountByDayAsync("Page View", startDate, endDate);
                var pageViews = new List<int>();
                
                // Get interactions from our database
                var interactionsByDay = await _context.UserInteractions
                    .Where(i => i.CreatedAt >= startDate && i.CreatedAt <= endDate)
                    .GroupBy(i => i.CreatedAt.Date)
                    .Select(g => new { Date = g.Key, Count = g.Count() })
                    .ToDictionaryAsync(k => k.Date, v => v.Count);
                
                var interactions = new List<int>();
                
                // Fill in data for all days
                foreach (var date in dateRange)
                {
                    var dateKey = date.Date;
                    
                    // Get page view count for this day from Mixpanel data or use 0
                    var pageViewCount = 0;
                    if (pageViewsData.TryGetValue(dateKey, out var count))
                    {
                        pageViewCount = count;
                    }
                    pageViews.Add(pageViewCount);
                    
                    // Get interaction count for this day from our database or use 0
                    var interactionCount = 0;
                    if (interactionsByDay.TryGetValue(dateKey, out var count2))
                    {
                        interactionCount = count2;
                    }
                    interactions.Add(interactionCount);
                }
                
                ViewBag.PageViews = pageViews;
                ViewBag.Interactions = interactions;
                
                // Get category view data
                var categoryViews = await _context.UserInteractions
                    .Where(i => i.Viewed)
                    .Include(i => i.Product)
                    .GroupBy(i => i.Product.Category)
                    .Select(g => new { Category = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .Take(6)
                    .ToDictionaryAsync(k => k.Category, v => v.Count);
                
                ViewBag.Categories = categoryViews.Keys.ToList();
                ViewBag.CategoryViews = categoryViews.Values.ToList();
                
                // Get user segments based on interaction patterns
                var userSegments = await GetUserSegmentsAsync();
                ViewBag.Segments = userSegments.Keys.ToList();
                ViewBag.SegmentCounts = userSegments.Values.ToList();
                
                // Get average time spent by category
                var timeSpentByCategory = await _context.UserInteractions
                    .Where(i => i.ViewTimeSeconds > 0)
                    .Include(i => i.Product)
                    .GroupBy(i => i.Product.Category)
                    .Select(g => new { 
                        Category = g.Key, 
                        AvgTimeSpent = g.Average(i => i.ViewTimeSeconds)
                    })
                    .OrderByDescending(x => x.AvgTimeSpent)
                    .Take(8)
                    .ToDictionaryAsync(k => k.Category, v => v.AvgTimeSpent);
                
                ViewBag.TimeCategories = timeSpentByCategory.Keys.ToList();
                ViewBag.AvgTimeSpent = timeSpentByCategory.Values.ToList();
                
                // Get top user interactions
                ViewBag.TopInteractions = await _context.UserInteractions
                    .Include(i => i.User)
                    .Include(i => i.Product)
                    .OrderByDescending(i => i.CreatedAt)
                    .Take(50)
                    .Select(i => new {
                        UserEmail = i.User.Email,
                        ProductName = i.Product.Name,
                        i.Viewed,
                        i.AddedToCart,
                        i.AddedToWishlist,
                        i.Purchased,
                        i.ViewTimeSeconds,
                        i.CreatedAt,
                        i.InteractionScore
                    })
                    .ToListAsync();
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading user behavior data");
                TempData["ErrorMessage"] = "An error occurred while loading the user behavior data. Please try again later.";
                return RedirectToAction("Dashboard");
            }
        }
        
        public async Task<IActionResult> ConversionFunnel()
        {
            try
            {
                // Get funnel data
                var thirtyDaysAgo = DateTime.Now.AddDays(-30);
                
                // Get page views from Mixpanel
                var pageViews = await _mixpanelService.GetTotalEventCountAsync("Page View", thirtyDaysAgo, DateTime.Now);
                
                // Get other funnel steps from our database
                var productViews = await _context.UserInteractions
                    .Where(i => i.CreatedAt >= thirtyDaysAgo && i.Viewed)
                    .CountAsync();
                
                var addToCarts = await _context.UserInteractions
                    .Where(i => i.CreatedAt >= thirtyDaysAgo && i.AddedToCart)
                    .CountAsync();
                
                // Get checkout starts from Mixpanel
                var checkoutStarts = await _mixpanelService.GetTotalEventCountAsync("Checkout Started", thirtyDaysAgo, DateTime.Now);
                
                var purchases = await _context.UserInteractions
                    .Where(i => i.CreatedAt >= thirtyDaysAgo && i.Purchased)
                    .CountAsync();
                
                // Build funnel object
                ViewBag.FunnelSteps = new {
                    PageViews = pageViews,
                    ProductViews = productViews,
                    AddToCarts = addToCarts,
                    CheckoutStarts = checkoutStarts,
                    Purchases = purchases
                };
                
                // Get conversion rate trends - past 10 weeks
                var trendStartDate = DateTime.Now.AddDays(-70); // 10 weeks
                var trendWeeks = Enumerable.Range(0, 10)
                    .Select(i => trendStartDate.AddDays(i * 7))
                    .ToList();
                
                ViewBag.ConversionTrendDates = trendWeeks.Select(d => d.ToString("MM/dd")).ToList();
                
                // Calculate weekly conversion rates
                var viewToCartTrend = new List<double>();
                var cartToPurchaseTrend = new List<double>();
                var overallConversionTrend = new List<double>();
                
                foreach (var weekStart in trendWeeks)
                {
                    var weekEnd = weekStart.AddDays(7);
                    
                    // Get metrics for this week
                    var weekViews = await _context.UserInteractions
                        .Where(i => i.CreatedAt >= weekStart && i.CreatedAt < weekEnd && i.Viewed)
                        .CountAsync();
                    
                    var weekCarts = await _context.UserInteractions
                        .Where(i => i.CreatedAt >= weekStart && i.CreatedAt < weekEnd && i.AddedToCart)
                        .CountAsync();
                    
                    var weekPurchases = await _context.UserInteractions
                        .Where(i => i.CreatedAt >= weekStart && i.CreatedAt < weekEnd && i.Purchased)
                        .CountAsync();
                    
                    // Calculate rates (handle division by zero)
                    var vtc = weekViews > 0 ? (double)weekCarts / weekViews : 0;
                    var ctp = weekCarts > 0 ? (double)weekPurchases / weekCarts : 0;
                    var overall = weekViews > 0 ? (double)weekPurchases / weekViews : 0;
                    
                    viewToCartTrend.Add(vtc);
                    cartToPurchaseTrend.Add(ctp);
                    overallConversionTrend.Add(overall);
                }
                
                ViewBag.ViewToCartTrend = viewToCartTrend;
                ViewBag.CartToPurchaseTrend = cartToPurchaseTrend;
                ViewBag.OverallConversionTrend = overallConversionTrend;
                
                // Get dropoff reasons (simulated data - would come from user surveys or exit tracking)
                ViewBag.DropoffReasons = new List<string> { 
                    "Price too high", 
                    "Shipping costs", 
                    "Payment issues", 
                    "Changed mind", 
                    "Technical errors" 
                };
                
                ViewBag.DropoffCounts = new List<int> { 42, 38, 25, 18, 12 };
                
                // Get product conversion metrics
                ViewBag.ProductConversions = await _context.Products
                    .Where(p => p.UserInteractions.Any())
                    .Select(p => new {
                        ProductName = p.Name,
                        Views = p.UserInteractions.Count(i => i.Viewed),
                        AddToCarts = p.UserInteractions.Count(i => i.AddedToCart),
                        Purchases = p.UserInteractions.Count(i => i.Purchased),
                        ViewToCartRate = p.UserInteractions.Any(i => i.Viewed) 
                            ? (double)p.UserInteractions.Count(i => i.AddedToCart) / p.UserInteractions.Count(i => i.Viewed)
                            : 0,
                        CartToPurchaseRate = p.UserInteractions.Any(i => i.AddedToCart)
                            ? (double)p.UserInteractions.Count(i => i.Purchased) / p.UserInteractions.Count(i => i.AddedToCart)
                            : 0,
                        OverallConversionRate = p.UserInteractions.Any(i => i.Viewed)
                            ? (double)p.UserInteractions.Count(i => i.Purchased) / p.UserInteractions.Count(i => i.Viewed)
                            : 0
                    })
                    .OrderByDescending(p => p.OverallConversionRate)
                    .Take(20)
                    .ToListAsync();
                
                // Get category conversion metrics
                ViewBag.CategoryConversions = await _context.Products
                    .Where(p => p.UserInteractions.Any())
                    .GroupBy(p => p.Category)
                    .Select(g => new {
                        CategoryName = g.Key,
                        Views = g.SelectMany(p => p.UserInteractions).Count(i => i.Viewed),
                        AddToCarts = g.SelectMany(p => p.UserInteractions).Count(i => i.AddedToCart),
                        Purchases = g.SelectMany(p => p.UserInteractions).Count(i => i.Purchased),
                        ViewToCartRate = g.SelectMany(p => p.UserInteractions).Any(i => i.Viewed) 
                            ? (double)g.SelectMany(p => p.UserInteractions).Count(i => i.AddedToCart) / 
                              g.SelectMany(p => p.UserInteractions).Count(i => i.Viewed)
                            : 0,
                        CartToPurchaseRate = g.SelectMany(p => p.UserInteractions).Any(i => i.AddedToCart)
                            ? (double)g.SelectMany(p => p.UserInteractions).Count(i => i.Purchased) / 
                              g.SelectMany(p => p.UserInteractions).Count(i => i.AddedToCart)
                            : 0,
                        OverallConversionRate = g.SelectMany(p => p.UserInteractions).Any(i => i.Viewed)
                            ? (double)g.SelectMany(p => p.UserInteractions).Count(i => i.Purchased) / 
                              g.SelectMany(p => p.UserInteractions).Count(i => i.Viewed)
                            : 0
                    })
                    .OrderByDescending(c => c.OverallConversionRate)
                    .ToListAsync();
                
                // Get recommendation impact data
                var recommendedPurchaseRate = await _context.ProductRecommendations
                    .Where(r => r.Shown && r.Clicked)
                    .GroupBy(r => 1) // Group all together
                    .Select(g => (double)g.Count(r => r.Purchased) / g.Count())
                    .FirstOrDefaultAsync();
                
                // Compare with non-recommendation purchase rate (direct navigation)
                var nonRecommendedPurchaseRate = await _mixpanelService.GetConversionRateAsync(
                    "Product View", "Purchase", thirtyDaysAgo, DateTime.Now, 
                    new Dictionary<string, string> { { "source", "direct" } });
                
                ViewBag.RecommendationConversionRate = recommendedPurchaseRate;
                ViewBag.NonRecommendationConversionRate = nonRecommendedPurchaseRate;
                ViewBag.ConversionImprovement = recommendedPurchaseRate - nonRecommendedPurchaseRate;
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading conversion funnel data");
                TempData["ErrorMessage"] = "An error occurred while loading the conversion funnel data. Please try again later.";
                return RedirectToAction("Dashboard");
            }
        }
        
        private async Task<Dictionary<string, int>> GetUserSegmentsAsync()
        {
            // Define segments based on user behavior
            var segments = new Dictionary<string, int>();
            
            // Get all users with interactions
            var userInteractions = await _context.UserInteractions
                .GroupBy(i => i.UserId)
                .Select(g => new {
                    UserId = g.Key,
                    InteractionCount = g.Count(),
                    ViewCount = g.Count(i => i.Viewed),
                    CartCount = g.Count(i => i.AddedToCart),
                    WishlistCount = g.Count(i => i.AddedToWishlist),
                    PurchaseCount = g.Count(i => i.Purchased)
                })
                .ToListAsync();
            
            // Categorize users into segments
            int browsersCount = 0;
            int researchersCount = 0;
            int wishlistersCount = 0;
            int abandonersCount = 0;
            int buyersCount = 0;
            
            foreach (var user in userInteractions)
            {
                // Simple segmentation rules
                if (user.PurchaseCount > 0)
                {
                    buyersCount++;
                }
                else if (user.CartCount > 0)
                {
                    abandonersCount++;
                }
                else if (user.WishlistCount > 0)
                {
                    wishlistersCount++;
                }
                else if (user.ViewCount > 5)
                {
                    researchersCount++;
                }
                else
                {
                    browsersCount++;
                }
            }
            
            segments.Add("Purchasers", buyersCount);
            segments.Add("Cart Abandoners", abandonersCount);
            segments.Add("Wishlisters", wishlistersCount);
            segments.Add("Researchers", researchersCount);
            segments.Add("Browsers", browsersCount);
            
            return segments;
        }
    }
}
