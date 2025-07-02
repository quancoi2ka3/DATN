using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Service for tracking user interactions with products
    /// </summary>
    public class UserInteractionService : IUserInteractionService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserInteractionService> _logger;

        public UserInteractionService(ApplicationDbContext context, ILogger<UserInteractionService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task TrackProductViewAsync(string userId, int productId)
        {
            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.Viewed = true;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking product view for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task TrackAddToCartAsync(string userId, int productId)
        {
            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.AddedToCart = true;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking add to cart for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task TrackAddToWishlistAsync(string userId, int productId)
        {
            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.AddedToWishlist = true;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking add to wishlist for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task TrackPurchaseAsync(string userId, int productId)
        {
            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.Purchased = true;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking purchase for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task TrackProductRatingAsync(string userId, int productId, int rating)
        {
            if (rating < 0 || rating > 5)
            {
                throw new ArgumentException("Rating must be between 0 and 5");
            }

            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.Rating = rating;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking product rating for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task UpdateViewTimeAsync(string userId, int productId, int seconds)
        {
            if (seconds < 0)
            {
                throw new ArgumentException("View time cannot be negative");
            }

            try
            {
                var interaction = await GetOrCreateInteractionAsync(userId, productId);
                interaction.ViewTimeSeconds += seconds;
                interaction.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating view time for user {UserId} and product {ProductId}", userId, productId);
                throw;
            }
        }

        public async Task<List<UserInteraction>> GetUserInteractionsAsync(string userId, int count = 100)
        {
            try
            {
                return await _context.UserInteractions
                    .Include(ui => ui.Product)
                    .Where(ui => ui.UserId == userId)
                    .OrderByDescending(ui => ui.UpdatedAt)
                    .Take(count)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user interactions for user {UserId}", userId);
                throw;
            }
        }

        public async Task<Dictionary<int, float>> GetUserProductScoresAsync(string userId)
        {
            try
            {
                var interactions = await _context.UserInteractions
                    .Where(ui => ui.UserId == userId)
                    .ToListAsync();

                return interactions.ToDictionary(
                    ui => ui.ProductId,
                    ui => ui.InteractionScore
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user product scores for user {UserId}", userId);
                throw;
            }
        }

        private async Task<UserInteraction> GetOrCreateInteractionAsync(string userId, int productId)
        {
            var interaction = await _context.UserInteractions
                .FirstOrDefaultAsync(ui => ui.UserId == userId && ui.ProductId == productId);

            if (interaction == null)
            {
                interaction = new UserInteraction
                {
                    UserId = userId,
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                await _context.UserInteractions.AddAsync(interaction);
            }

            return interaction;
        }
    }
}
