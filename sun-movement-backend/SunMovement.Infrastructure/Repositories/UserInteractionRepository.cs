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
    /// <summary>
    /// Repository for tracking user interactions with products
    /// Replaces the old CustomerActivity functionality
    /// </summary>
    public class UserInteractionRepository : Repository<UserInteraction>, IUserInteractionRepository
    {
        public UserInteractionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<UserInteraction>> GetInteractionsByUserIdAsync(string userId, int skip = 0, int take = 50)
        {
            return await _context.Set<UserInteraction>()
                .Where(ui => ui.UserId == userId)
                .OrderByDescending(ui => ui.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(ui => ui.User)
                .Include(ui => ui.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserInteraction>> GetInteractionsByProductIdAsync(int productId, int skip = 0, int take = 50)
        {
            return await _context.Set<UserInteraction>()
                .Where(ui => ui.ProductId == productId)
                .OrderByDescending(ui => ui.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(ui => ui.User)
                .Include(ui => ui.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserInteraction>> GetInteractionsByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50)
        {
            return await _context.Set<UserInteraction>()
                .Where(ui => ui.CreatedAt >= startDate && ui.CreatedAt <= endDate)
                .OrderByDescending(ui => ui.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(ui => ui.User)
                .Include(ui => ui.Product)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetInteractionStatisticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Set<UserInteraction>()
                .Where(ui => ui.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(ui => ui.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(ui => ui.CreatedAt <= endDate.Value);

            var interactions = await query.ToListAsync();

            return new Dictionary<string, int>
            {
                ["TotalViews"] = interactions.Count(ui => ui.Viewed),
                ["AddedToCart"] = interactions.Count(ui => ui.AddedToCart),
                ["AddedToWishlist"] = interactions.Count(ui => ui.AddedToWishlist),
                ["Purchases"] = interactions.Count(ui => ui.Purchased),
                ["TotalInteractions"] = interactions.Count,
                ["AverageRating"] = interactions.Where(ui => ui.Rating > 0).Any() 
                    ? (int)interactions.Where(ui => ui.Rating > 0).Average(ui => ui.Rating)
                    : 0
            };
        }

        public async Task<IEnumerable<UserInteraction>> GetRecentInteractionsAsync(int count = 20)
        {
            return await _context.Set<UserInteraction>()
                .OrderByDescending(ui => ui.CreatedAt)
                .Take(count)
                .Include(ui => ui.User)
                .Include(ui => ui.Product)
                .ToListAsync();
        }

        public async Task LogViewAsync(string userId, int productId, int viewTimeSeconds = 0)
        {
            var interaction = await GetOrCreateInteractionAsync(userId, productId);
            interaction.Viewed = true;
            interaction.ViewTimeSeconds = Math.Max(interaction.ViewTimeSeconds, viewTimeSeconds);
            interaction.UpdatedAt = DateTime.UtcNow;

            await UpdateInteractionAsync(interaction);
        }

        public async Task LogAddToCartAsync(string userId, int productId)
        {
            var interaction = await GetOrCreateInteractionAsync(userId, productId);
            interaction.AddedToCart = true;
            interaction.UpdatedAt = DateTime.UtcNow;

            await UpdateInteractionAsync(interaction);
        }

        public async Task LogAddToWishlistAsync(string userId, int productId)
        {
            var interaction = await GetOrCreateInteractionAsync(userId, productId);
            interaction.AddedToWishlist = true;
            interaction.UpdatedAt = DateTime.UtcNow;

            await UpdateInteractionAsync(interaction);
        }

        public async Task LogPurchaseAsync(string userId, int productId, int rating = 0)
        {
            var interaction = await GetOrCreateInteractionAsync(userId, productId);
            interaction.Purchased = true;
            if (rating > 0)
                interaction.Rating = rating;
            interaction.UpdatedAt = DateTime.UtcNow;

            await UpdateInteractionAsync(interaction);
        }

        public async Task<UserInteraction?> GetUserProductInteractionAsync(string userId, int productId)
        {
            return await _context.Set<UserInteraction>()
                .FirstOrDefaultAsync(ui => ui.UserId == userId && ui.ProductId == productId);
        }

        public async Task UpdateInteractionAsync(UserInteraction interaction)
        {
            _context.Set<UserInteraction>().Update(interaction);
            await _context.SaveChangesAsync();
        }

        private async Task<UserInteraction> GetOrCreateInteractionAsync(string userId, int productId)
        {
            var interaction = await GetUserProductInteractionAsync(userId, productId);
            
            if (interaction == null)
            {
                interaction = new UserInteraction
                {
                    UserId = userId,
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Set<UserInteraction>().AddAsync(interaction);
                await _context.SaveChangesAsync();
            }

            return interaction;
        }
    }
}
