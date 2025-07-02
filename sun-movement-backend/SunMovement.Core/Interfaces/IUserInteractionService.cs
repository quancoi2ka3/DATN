using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    /// <summary>
    /// Interface for tracking user interactions with products
    /// </summary>
    public interface IUserInteractionService
    {
        Task TrackProductViewAsync(string userId, int productId);
        Task TrackAddToCartAsync(string userId, int productId);
        Task TrackAddToWishlistAsync(string userId, int productId);
        Task TrackPurchaseAsync(string userId, int productId);
        Task TrackProductRatingAsync(string userId, int productId, int rating);
        Task UpdateViewTimeAsync(string userId, int productId, int seconds);
        Task<List<UserInteraction>> GetUserInteractionsAsync(string userId, int count = 100);
        Task<Dictionary<int, float>> GetUserProductScoresAsync(string userId);
    }
}
