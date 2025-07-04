using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    /// <summary>
    /// Repository interface for tracking user interactions with products
    /// Replaces the old CustomerActivity functionality with UserInteraction
    /// </summary>
    public interface IUserInteractionRepository : IRepository<UserInteraction>
    {
        Task<IEnumerable<UserInteraction>> GetInteractionsByUserIdAsync(string userId, int skip = 0, int take = 50);
        Task<IEnumerable<UserInteraction>> GetInteractionsByProductIdAsync(int productId, int skip = 0, int take = 50);
        Task<IEnumerable<UserInteraction>> GetInteractionsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50);
        Task<Dictionary<string, int>> GetInteractionStatisticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<UserInteraction>> GetRecentInteractionsAsync(int count = 20);
        Task LogViewAsync(string userId, int productId, int viewTimeSeconds = 0);
        Task LogAddToCartAsync(string userId, int productId);
        Task LogAddToWishlistAsync(string userId, int productId);
        Task LogPurchaseAsync(string userId, int productId, int rating = 0);
        Task<UserInteraction?> GetUserProductInteractionAsync(string userId, int productId);
        Task UpdateInteractionAsync(UserInteraction interaction);
    }
}
