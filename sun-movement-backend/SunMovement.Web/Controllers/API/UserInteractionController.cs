using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace SunMovement.Web.Controllers.API
{
    [Route("api/interactions")]
    [ApiController]
    public class UserInteractionController : ControllerBase
    {
        private readonly IUserInteractionService _interactionService;
        private readonly ILogger<UserInteractionController> _logger;

        public UserInteractionController(
            IUserInteractionService interactionService,
            ILogger<UserInteractionController> logger)
        {
            _interactionService = interactionService;
            _logger = logger;
        }

        [HttpPost("view")]
        public async Task<IActionResult> TrackProductView([FromBody] UserInteractionRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                await _interactionService.TrackProductViewAsync(request.UserId, request.ProductId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking product view");
                return StatusCode(500, "An error occurred while tracking the product view");
            }
        }

        [HttpPost("cart")]
        public async Task<IActionResult> TrackAddToCart([FromBody] UserInteractionRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                await _interactionService.TrackAddToCartAsync(request.UserId, request.ProductId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking add to cart");
                return StatusCode(500, "An error occurred while tracking the add to cart action");
            }
        }

        [HttpPost("wishlist")]
        public async Task<IActionResult> TrackAddToWishlist([FromBody] UserInteractionRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                await _interactionService.TrackAddToWishlistAsync(request.UserId, request.ProductId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking add to wishlist");
                return StatusCode(500, "An error occurred while tracking the add to wishlist action");
            }
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> TrackPurchase([FromBody] UserInteractionRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                await _interactionService.TrackPurchaseAsync(request.UserId, request.ProductId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking purchase");
                return StatusCode(500, "An error occurred while tracking the purchase");
            }
        }

        [HttpPost("rating")]
        public async Task<IActionResult> TrackRating([FromBody] ProductRatingRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                if (request.Rating < 0 || request.Rating > 5)
                {
                    return BadRequest("Rating must be between 0 and 5");
                }

                await _interactionService.TrackProductRatingAsync(request.UserId, request.ProductId, request.Rating);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking product rating");
                return StatusCode(500, "An error occurred while tracking the product rating");
            }
        }

        [HttpPost("view-time")]
        public async Task<IActionResult> UpdateViewTime([FromBody] ViewTimeRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId) || request.ProductId <= 0)
                {
                    return BadRequest("User ID and Product ID are required");
                }

                if (request.Seconds < 0)
                {
                    return BadRequest("View time cannot be negative");
                }

                await _interactionService.UpdateViewTimeAsync(request.UserId, request.ProductId, request.Seconds);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating view time");
                return StatusCode(500, "An error occurred while updating the view time");
            }
        }
    }

    public class UserInteractionRequest
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
    }

    public class ProductRatingRequest : UserInteractionRequest
    {
        public int Rating { get; set; }
    }

    public class ViewTimeRequest : UserInteractionRequest
    {
        public int Seconds { get; set; }
    }
}
