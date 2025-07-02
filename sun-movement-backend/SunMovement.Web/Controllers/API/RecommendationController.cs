using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Web.Controllers.API
{
    [Route("api/recommendations")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;
        private readonly ILogger<RecommendationController> _logger;

        public RecommendationController(
            IRecommendationService recommendationService,
            ILogger<RecommendationController> logger)
        {
            _recommendationService = recommendationService;
            _logger = logger;
        }

        [HttpGet("personal/{userId}")]
        public async Task<ActionResult<List<Product>>> GetPersonalizedRecommendations(
            string userId, [FromQuery] int count = 10)
        {
            try
            {
                var recommendations = await _recommendationService.GetPersonalizedRecommendationsAsync(userId, count);
                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting personalized recommendations for user {UserId}", userId);
                return StatusCode(500, "An error occurred while getting personalized recommendations");
            }
        }

        [HttpGet("similar/{productId}")]
        public async Task<ActionResult<List<Product>>> GetSimilarProducts(
            int productId, [FromQuery] int count = 10)
        {
            try
            {
                var similarProducts = await _recommendationService.GetSimilarProductsAsync(productId, count);
                return Ok(similarProducts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting similar products for product {ProductId}", productId);
                return StatusCode(500, "An error occurred while getting similar products");
            }
        }

        [HttpGet("trending")]
        public async Task<ActionResult<List<Product>>> GetTrendingProducts([FromQuery] int count = 10)
        {
            try
            {
                var trendingProducts = await _recommendationService.GetTrendingProductsAsync(count);
                return Ok(trendingProducts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting trending products");
                return StatusCode(500, "An error occurred while getting trending products");
            }
        }

        [HttpGet("frequently-bought-together/{productId}")]
        public async Task<ActionResult<List<Product>>> GetFrequentlyBoughtTogether(
            int productId, [FromQuery] int count = 5)
        {
            try
            {
                var frequentlyBoughtTogether = await _recommendationService.GetFrequentlyBoughtTogetherAsync(productId, count);
                return Ok(frequentlyBoughtTogether);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting frequently bought together products for product {ProductId}", productId);
                return StatusCode(500, "An error occurred while getting frequently bought together products");
            }
        }

        [HttpGet("recently-viewed/{userId}")]
        public async Task<ActionResult<List<Product>>> GetRecentlyViewedProducts(
            string userId, [FromQuery] int count = 10)
        {
            try
            {
                var recentlyViewed = await _recommendationService.GetRecentlyViewedProductsAsync(userId, count);
                return Ok(recentlyViewed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recently viewed products for user {UserId}", userId);
                return StatusCode(500, "An error occurred while getting recently viewed products");
            }
        }

        [HttpPost("track/shown")]
        public async Task<IActionResult> TrackRecommendationShown([FromBody] RecommendationTrackingRequest request)
        {
            try
            {
                await _recommendationService.TrackRecommendationShownAsync(
                    request.UserId,
                    request.ProductId,
                    request.RecommendationType,
                    request.SourceProductId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation shown");
                return StatusCode(500, "An error occurred while tracking the recommendation shown");
            }
        }

        [HttpPost("track/clicked")]
        public async Task<IActionResult> TrackRecommendationClicked([FromBody] RecommendationTrackingRequest request)
        {
            try
            {
                await _recommendationService.TrackRecommendationClickAsync(
                    request.UserId,
                    request.ProductId,
                    request.RecommendationType);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation click");
                return StatusCode(500, "An error occurred while tracking the recommendation click");
            }
        }

        [HttpPost("track/purchased")]
        public async Task<IActionResult> TrackRecommendationPurchased([FromBody] RecommendationTrackingRequest request)
        {
            try
            {
                await _recommendationService.TrackRecommendationPurchaseAsync(
                    request.UserId,
                    request.ProductId,
                    request.RecommendationType);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking recommendation purchase");
                return StatusCode(500, "An error occurred while tracking the recommendation purchase");
            }
        }
    }

    public class RecommendationTrackingRequest
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public string RecommendationType { get; set; }
        public int? SourceProductId { get; set; }
    }
}
