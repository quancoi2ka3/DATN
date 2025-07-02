using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    /// <summary>
    /// Interface for product recommendation services
    /// </summary>
    public interface IRecommendationService
    {
        Task<List<Product>> GetPersonalizedRecommendationsAsync(string userId, int count = 10);
        Task<List<Product>> GetSimilarProductsAsync(int productId, int count = 10);
        Task<List<Product>> GetTrendingProductsAsync(int count = 10);
        Task<List<Product>> GetFrequentlyBoughtTogetherAsync(int productId, int count = 5);
        Task<List<Product>> GetRecentlyViewedProductsAsync(string userId, int count = 10);
        Task TrackRecommendationShownAsync(string userId, int productId, string recommendationType, int? sourceProductId = null);
        Task TrackRecommendationClickAsync(string userId, int productId, string recommendationType);
        Task TrackRecommendationPurchaseAsync(string userId, int productId, string recommendationType);
        Task<Dictionary<string, double>> GetRecommendationMetricsAsync();
    }
}
