using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Service for providing product recommendations based on collaborative filtering
    /// </summary>
    public class RecommendationService : IRecommendationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserInteractionService _userInteractionService;
        private readonly IMemoryCache _cache;
        private readonly ILogger<RecommendationService> _logger;
        
        // Cache keys
        private const string SIMILARITY_MATRIX_KEY = "ProductSimilarityMatrix";
        private const string TRENDING_PRODUCTS_KEY = "TrendingProducts";
        private const int CACHE_EXPIRATION_HOURS = 6;

        public RecommendationService(
            ApplicationDbContext context,
            IUserInteractionService userInteractionService,
            IMemoryCache cache,
            ILogger<RecommendationService> logger)
        {
            _context = context;
            _userInteractionService = userInteractionService;
            _cache = cache;
            _logger = logger;
        }

        public async Task<List<Product>> GetPersonalizedRecommendationsAsync(string userId, int count = 10)
        {
            try
            {
                // Get user's interactions
                var userScores = await _userInteractionService.GetUserProductScoresAsync(userId);
                
                // If new user or no interactions, return trending products
                if (userScores.Count == 0)
                {
                    _logger.LogInformation("No user interactions found for {UserId}, returning trending products", userId);
                    return await GetTrendingProductsAsync(count);
                }

                // Get user-based recommendations (find similar users and their liked products)
                var userInteractedProductIds = userScores.Keys.ToHashSet();
                var similarUserProducts = await GetSimilarUserProductsAsync(userId, userInteractedProductIds);
                
                // Get item-based recommendations (find similar products to ones the user liked)
                var itemBasedRecommendations = await GetItemBasedRecommendationsAsync(userScores, userInteractedProductIds);
                
                // Combine both approaches with weights
                var combinedScores = new Dictionary<int, float>();
                
                // Add user-based scores (weight: 0.7)
                foreach (var kvp in similarUserProducts)
                {
                    combinedScores[kvp.Key] = kvp.Value * 0.7f;
                }
                
                // Add item-based scores (weight: 0.3)
                foreach (var kvp in itemBasedRecommendations)
                {
                    if (combinedScores.ContainsKey(kvp.Key))
                    {
                        combinedScores[kvp.Key] += kvp.Value * 0.3f;
                    }
                    else
                    {
                        combinedScores[kvp.Key] = kvp.Value * 0.3f;
                    }
                }
                
                // Get the top N product IDs
                var recommendedProductIds = combinedScores
                    .OrderByDescending(kvp => kvp.Value)
                    .Take(count)
                    .Select(kvp => kvp.Key)
                    .ToList();
                
                // Fetch the full product details
                var products = await _context.Products
                    .Where(p => recommendedProductIds.Contains(p.Id))
                    .ToListAsync();
                
                // Order the products according to the recommendation scores
                return products
                    .OrderBy(p => recommendedProductIds.IndexOf(p.Id))
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating personalized recommendations for user {UserId}", userId);
                // Fallback to trending products in case of error
                return await GetTrendingProductsAsync(count);
            }
        }

        public async Task<List<Product>> GetSimilarProductsAsync(int productId, int count = 10)
        {
            try
            {
                // Get or calculate product similarity matrix
                var similarityMatrix = await GetProductSimilarityMatrixAsync();
                
                // If product is not in the matrix, return trending products
                if (!similarityMatrix.ContainsKey(productId))
                {
                    _logger.LogInformation("No similarity data for product {ProductId}, returning trending products", productId);
                    return await GetTrendingProductsAsync(count);
                }
                
                // Get similar product IDs sorted by similarity score
                var similarProductIds = similarityMatrix[productId]
                    .OrderByDescending(kvp => kvp.Value)
                    .Take(count)
                    .Select(kvp => kvp.Key)
                    .ToList();
                
                // Fetch the full product details
                var products = await _context.Products
                    .Where(p => similarProductIds.Contains(p.Id))
                    .ToListAsync();
                
                // Order the products according to the similarity scores
                return products
                    .OrderBy(p => similarProductIds.IndexOf(p.Id))
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting similar products for product {ProductId}", productId);
                // Fallback to trending products in case of error
                return await GetTrendingProductsAsync(count);
            }
        }

        public async Task<List<Product>> GetTrendingProductsAsync(int count = 10)
        {
            try
            {
                // Try to get from cache first
                List<int> trendingProductIds;
                if (!_cache.TryGetValue(TRENDING_PRODUCTS_KEY, out List<int>? cachedProductIds) || cachedProductIds == null)
                {
                    // Calculate trending products based on recent interactions
                    var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
                    
                    trendingProductIds = await _context.UserInteractions
                        .Where(ui => ui.UpdatedAt >= thirtyDaysAgo)
                        .GroupBy(ui => ui.ProductId)
                        .Select(g => new
                        {
                            ProductId = g.Key,
                            ViewCount = g.Count(ui => ui.Viewed),
                            CartCount = g.Count(ui => ui.AddedToCart) * 3, // Weight cart additions higher
                            PurchaseCount = g.Count(ui => ui.Purchased) * 5, // Weight purchases highest
                            Score = g.Sum(ui => ui.InteractionScore)
                        })
                        .OrderByDescending(x => x.Score)
                        .Select(x => x.ProductId)
                        .Take(count * 2) // Get more than needed to filter
                        .ToListAsync();
                    
                    // Store in cache
                    _cache.Set(TRENDING_PRODUCTS_KEY, trendingProductIds, TimeSpan.FromHours(CACHE_EXPIRATION_HOURS));
                }
                else
                {
                    trendingProductIds = cachedProductIds;
                }
                
                // Fetch the full product details
                var products = await _context.Products
                    .Where(p => trendingProductIds.Contains(p.Id) && p.IsAvailable)
                    .Take(count)
                    .ToListAsync();
                
                // Order the products according to the trending scores
                return products
                    .OrderBy(p => trendingProductIds.IndexOf(p.Id))
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting trending products");
                // Fallback to recently added products in case of error
                return await _context.Products
                    .Where(p => p.IsAvailable)
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(count)
                    .ToListAsync();
            }
        }

        public async Task<List<Product>> GetFrequentlyBoughtTogetherAsync(int productId, int count = 5)
        {
            try
            {
                // Find users who purchased this product
                var userIds = await _context.UserInteractions
                    .Where(ui => ui.ProductId == productId && ui.Purchased)
                    .Select(ui => ui.UserId)
                    .ToListAsync();
                
                if (userIds.Count == 0)
                {
                    _logger.LogInformation("No purchase data for product {ProductId}, returning similar products", productId);
                    return await GetSimilarProductsAsync(productId, count);
                }
                
                // Find other products these users purchased
                var frequentlyBoughtProductIds = await _context.UserInteractions
                    .Where(ui => userIds.Contains(ui.UserId) && ui.Purchased && ui.ProductId != productId)
                    .GroupBy(ui => ui.ProductId)
                    .Select(g => new
                    {
                        ProductId = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Count)
                    .Select(x => x.ProductId)
                    .Take(count)
                    .ToListAsync();
                
                // Fetch the full product details
                return await _context.Products
                    .Where(p => frequentlyBoughtProductIds.Contains(p.Id))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting frequently bought together products for product {ProductId}", productId);
                // Fallback to similar products in case of error
                return await GetSimilarProductsAsync(productId, count);
            }
        }

        public async Task<List<Product>> GetRecentlyViewedProductsAsync(string userId, int count = 10)
        {
            try
            {
                // Get recently viewed product IDs
                var recentlyViewedProductIds = await _context.UserInteractions
                    .Where(ui => ui.UserId == userId && ui.Viewed)
                    .OrderByDescending(ui => ui.UpdatedAt)
                    .Select(ui => ui.ProductId)
                    .Take(count)
                    .ToListAsync();
                
                // Fetch the full product details
                return await _context.Products
                    .Where(p => recentlyViewedProductIds.Contains(p.Id))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recently viewed products for user {UserId}", userId);
                throw;
            }
        }

        public async Task TrackRecommendationShownAsync(string userId, int productId, string recommendationType, int? sourceProductId = null)
        {
            try
            {
                // Fetch user and product entities to satisfy required navigation properties
                var user = await _context.Users.FindAsync(userId);
                var product = await _context.Products.FindAsync(productId);
                
                if (user == null || product == null)
                {
                    _logger.LogWarning("User {UserId} or Product {ProductId} not found", userId, productId);
                    return;
                }
                
                // Fetch source product if provided
                Product? sourceProduct = null;
                if (sourceProductId.HasValue)
                {
                    sourceProduct = await _context.Products.FindAsync(sourceProductId.Value);
                }
                
                var recommendation = new ProductRecommendation
                {
                    UserId = userId,
                    ProductId = productId,
                    RecommendationType = recommendationType,
                    SourceProductId = sourceProductId,
                    Score = 0, // Score will be set by the recommendation algorithm
                    Shown = true,
                    Clicked = false,
                    Purchased = false,
                    CreatedAt = DateTime.UtcNow,
                    Algorithm = "collaborative_filtering", // Default algorithm
                    User = user,
                    Product = product,
                    SourceProduct = sourceProduct
                };
                
                _context.ProductRecommendations.Add(recommendation);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation shown for user {UserId} and product {ProductId}", userId, productId);
                // Don't throw - tracking errors shouldn't affect user experience
            }
        }

        public async Task TrackRecommendationClickAsync(string userId, int productId, string recommendationType)
        {
            try
            {
                var recommendation = await _context.ProductRecommendations
                    .Where(r => r.UserId == userId && r.ProductId == productId && r.RecommendationType == recommendationType && r.Shown && !r.Clicked)
                    .OrderByDescending(r => r.CreatedAt)
                    .FirstOrDefaultAsync();
                
                if (recommendation != null)
                {
                    recommendation.Clicked = true;
                    recommendation.ClickedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation click for user {UserId} and product {ProductId}", userId, productId);
                // Don't throw - tracking errors shouldn't affect user experience
            }
        }

        public async Task TrackRecommendationPurchaseAsync(string userId, int productId, string recommendationType)
        {
            try
            {
                var recommendation = await _context.ProductRecommendations
                    .Where(r => r.UserId == userId && r.ProductId == productId && r.RecommendationType == recommendationType && r.Clicked && !r.Purchased)
                    .OrderByDescending(r => r.ClickedAt)
                    .FirstOrDefaultAsync();
                
                if (recommendation != null)
                {
                    recommendation.Purchased = true;
                    recommendation.PurchasedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation purchase for user {UserId} and product {ProductId}", userId, productId);
                // Don't throw - tracking errors shouldn't affect user experience
            }
        }

        public async Task<Dictionary<string, double>> GetRecommendationMetricsAsync()
        {
            try
            {
                var metrics = new Dictionary<string, double>();
                
                // Calculate impression count
                var impressionCount = await _context.ProductRecommendations
                    .CountAsync(r => r.Shown);
                metrics["impression_count"] = impressionCount;
                
                // Calculate click count and CTR
                var clickCount = await _context.ProductRecommendations
                    .CountAsync(r => r.Clicked);
                metrics["click_count"] = clickCount;
                metrics["click_through_rate"] = impressionCount > 0 
                    ? (double)clickCount / impressionCount * 100 
                    : 0;
                
                // Calculate purchase count and conversion rate
                var purchaseCount = await _context.ProductRecommendations
                    .CountAsync(r => r.Purchased);
                metrics["purchase_count"] = purchaseCount;
                metrics["conversion_rate"] = clickCount > 0 
                    ? (double)purchaseCount / clickCount * 100 
                    : 0;
                
                // Calculate metrics by recommendation type
                var recommendationTypes = await _context.ProductRecommendations
                    .Select(r => r.RecommendationType)
                    .Distinct()
                    .ToListAsync();
                
                foreach (var type in recommendationTypes)
                {
                    var typeImpressions = await _context.ProductRecommendations
                        .CountAsync(r => r.RecommendationType == type && r.Shown);
                    var typeClicks = await _context.ProductRecommendations
                        .CountAsync(r => r.RecommendationType == type && r.Clicked);
                    var typePurchases = await _context.ProductRecommendations
                        .CountAsync(r => r.RecommendationType == type && r.Purchased);
                    
                    metrics[$"{type}_impression_count"] = typeImpressions;
                    metrics[$"{type}_click_count"] = typeClicks;
                    metrics[$"{type}_purchase_count"] = typePurchases;
                    metrics[$"{type}_ctr"] = typeImpressions > 0 
                        ? (double)typeClicks / typeImpressions * 100 
                        : 0;
                    metrics[$"{type}_conversion_rate"] = typeClicks > 0 
                        ? (double)typePurchases / typeClicks * 100 
                        : 0;
                }
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating recommendation metrics");
                throw;
            }
        }

        #region Helper Methods

        private async Task<Dictionary<int, Dictionary<int, float>>> GetProductSimilarityMatrixAsync()
        {
            // Try to get from cache first
            if (_cache.TryGetValue(SIMILARITY_MATRIX_KEY, out Dictionary<int, Dictionary<int, float>>? cachedMatrix) && cachedMatrix != null)
            {
                return cachedMatrix;
            }
            
            // If not in cache, calculate the matrix
            _logger.LogInformation("Calculating product similarity matrix");
            
            // Get all user interactions
            var allInteractions = await _context.UserInteractions.ToListAsync();
            
            // Create user-product matrix
            var userProductMatrix = new Dictionary<string, Dictionary<int, float>>();
            foreach (var interaction in allInteractions)
            {
                if (!userProductMatrix.ContainsKey(interaction.UserId))
                {
                    userProductMatrix[interaction.UserId] = new Dictionary<int, float>();
                }
                
                userProductMatrix[interaction.UserId][interaction.ProductId] = interaction.InteractionScore;
            }
            
            // Get all product IDs
            var productIds = await _context.Products
                .Where(p => p.IsAvailable)
                .Select(p => p.Id)
                .ToListAsync();
            
            // Calculate similarity matrix
            var similarityMatrix = new Dictionary<int, Dictionary<int, float>>();
            foreach (var productId1 in productIds)
            {
                similarityMatrix[productId1] = new Dictionary<int, float>();
                
                foreach (var productId2 in productIds)
                {
                    if (productId1 == productId2)
                    {
                        continue;
                    }
                    
                    float similarity = CalculateProductSimilarity(productId1, productId2, userProductMatrix);
                    similarityMatrix[productId1][productId2] = similarity;
                }
            }
            
            // Store in cache
            _cache.Set(SIMILARITY_MATRIX_KEY, similarityMatrix, TimeSpan.FromHours(CACHE_EXPIRATION_HOURS));
            
            return similarityMatrix;
        }

        private float CalculateProductSimilarity(
            int productId1,
            int productId2,
            Dictionary<string, Dictionary<int, float>> userProductMatrix)
        {
            var usersWhoRatedBoth = userProductMatrix
                .Where(kvp => kvp.Value.ContainsKey(productId1) && kvp.Value.ContainsKey(productId2))
                .ToList();
            
            if (usersWhoRatedBoth.Count == 0)
            {
                return 0;
            }
            
            // Use cosine similarity
            float dotProduct = 0;
            float norm1 = 0;
            float norm2 = 0;
            
            foreach (var userRatings in usersWhoRatedBoth)
            {
                float rating1 = userRatings.Value[productId1];
                float rating2 = userRatings.Value[productId2];
                
                dotProduct += rating1 * rating2;
                norm1 += rating1 * rating1;
                norm2 += rating2 * rating2;
            }
            
            if (norm1 == 0 || norm2 == 0)
            {
                return 0;
            }
            
            return dotProduct / (float)Math.Sqrt(norm1 * norm2);
        }

        private async Task<Dictionary<int, float>> GetSimilarUserProductsAsync(string userId, HashSet<int> userInteractedProductIds)
        {
            // Get all user interactions
            var allUserInteractions = await _context.UserInteractions
                .Where(ui => ui.UserId != userId) // Exclude current user
                .ToListAsync();
            
            // Group by user
            var userInteractions = allUserInteractions
                .GroupBy(ui => ui.UserId)
                .ToDictionary(
                    g => g.Key,
                    g => g.ToDictionary(ui => ui.ProductId, ui => ui.InteractionScore)
                );
            
            // Get current user's interactions
            var currentUserInteractions = await _context.UserInteractions
                .Where(ui => ui.UserId == userId)
                .ToDictionaryAsync(ui => ui.ProductId, ui => ui.InteractionScore);
            
            // Calculate user similarities
            var userSimilarities = new Dictionary<string, float>();
            foreach (var otherUser in userInteractions)
            {
                userSimilarities[otherUser.Key] = CalculateUserSimilarity(currentUserInteractions, otherUser.Value);
            }
            
            // Get recommendations from similar users
            var recommendedProducts = new Dictionary<int, float>();
            foreach (var otherUser in userInteractions)
            {
                float userSimilarity = userSimilarities[otherUser.Key];
                if (userSimilarity <= 0)
                {
                    continue;
                }
                
                foreach (var productRating in otherUser.Value)
                {
                    if (userInteractedProductIds.Contains(productRating.Key))
                    {
                        continue; // Skip products the user already interacted with
                    }
                    
                    float weightedRating = productRating.Value * userSimilarity;
                    
                    if (recommendedProducts.ContainsKey(productRating.Key))
                    {
                        recommendedProducts[productRating.Key] += weightedRating;
                    }
                    else
                    {
                        recommendedProducts[productRating.Key] = weightedRating;
                    }
                }
            }
            
            return recommendedProducts;
        }

        private float CalculateUserSimilarity(
            Dictionary<int, float> user1Ratings,
            Dictionary<int, float> user2Ratings)
        {
            var commonProducts = user1Ratings.Keys.Intersect(user2Ratings.Keys).ToList();
            
            if (commonProducts.Count == 0)
            {
                return 0;
            }
            
            // Use cosine similarity
            float dotProduct = 0;
            float norm1 = 0;
            float norm2 = 0;
            
            foreach (var productId in commonProducts)
            {
                float rating1 = user1Ratings[productId];
                float rating2 = user2Ratings[productId];
                
                dotProduct += rating1 * rating2;
                norm1 += rating1 * rating1;
                norm2 += rating2 * rating2;
            }
            
            if (norm1 == 0 || norm2 == 0)
            {
                return 0;
            }
            
            return dotProduct / (float)Math.Sqrt(norm1 * norm2);
        }

        private async Task<Dictionary<int, float>> GetItemBasedRecommendationsAsync(
            Dictionary<int, float> userProductScores,
            HashSet<int> userInteractedProductIds)
        {
            var similarityMatrix = await GetProductSimilarityMatrixAsync();
            var recommendations = new Dictionary<int, float>();
            
            // Get all product IDs
            var allProductIds = await _context.Products
                .Where(p => p.IsAvailable)
                .Select(p => p.Id)
                .ToListAsync();
            
            // For each candidate product
            foreach (var candidateProductId in allProductIds)
            {
                if (userInteractedProductIds.Contains(candidateProductId))
                {
                    continue; // Skip products the user already interacted with
                }
                
                float score = 0;
                
                // For each product the user interacted with
                foreach (var interactedProduct in userProductScores)
                {
                    int interactedProductId = interactedProduct.Key;
                    float interactionScore = interactedProduct.Value;
                    
                    if (similarityMatrix.ContainsKey(interactedProductId) && 
                        similarityMatrix[interactedProductId].ContainsKey(candidateProductId))
                    {
                        float similarity = similarityMatrix[interactedProductId][candidateProductId];
                        score += interactionScore * similarity;
                    }
                }
                
                if (score > 0)
                {
                    recommendations[candidateProductId] = score;
                }
            }
            
            return recommendations;
        }

        #endregion
    }
}
