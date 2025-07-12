using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;

namespace SunMovement.Web.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Ensure this controller requires authentication
    public class CartController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IServiceService _serviceService;
        private readonly IShoppingCartService _cartService;
        private readonly ILogger<CartController> _logger;

        public CartController(
            IProductService productService,
            IServiceService serviceService,
            IShoppingCartService cartService,
            ILogger<CartController> logger)
        {
            _productService = productService;
            _serviceService = serviceService;
            _cartService = cartService;
            _logger = logger;
        }

        private string? GetUserId()
        {
            return User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetCartItems()
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                var cart = await _cartService.GetCartByUserIdAsync(userId); // Ensure this method returns the cart object
                return Ok(cart);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cart items");
                return StatusCode(500, new { error = "An error occurred while retrieving cart items" });
            }
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            try
            {
                var userId = GetUserId();
                _logger.LogInformation($"[ADD TO CART] UserId: {userId}, DTO: {System.Text.Json.JsonSerializer.Serialize(dto)}");
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                if (dto.ProductId == null && dto.ServiceId == null)
                {
                    return BadRequest(new { error = "Either ProductId or ServiceId must be provided" });
                }

                if (dto.Quantity <= 0)
                {
                    dto.Quantity = 1;
                }

                // Validate product or service existence
                if (dto.ProductId.HasValue)
                {
                    var product = await _productService.GetProductByIdAsync(dto.ProductId.Value);
                    if (product == null)
                    {
                        return NotFound(new { error = "Product not found" });
                    }
                }
                else if (dto.ServiceId.HasValue)
                {
                    var service = await _serviceService.GetServiceByIdAsync(dto.ServiceId.Value);
                    if (service == null)
                    {
                        return NotFound(new { error = "Service not found" });
                    }
                }

                await _cartService.AddToCartAsync(userId, dto);
                // Lấy lại giỏ hàng mới nhất và trả về cho frontend
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                if (cart == null)
                {
                    return StatusCode(500, new { error = "Cart not found after adding item" });
                }
                return Ok(new { success = true, message = "Item added to cart successfully", items = cart.Items, totalQuantity = cart.TotalQuantity, totalPrice = cart.TotalPrice });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to cart");
                return StatusCode(500, new { error = "An error occurred while adding item to cart" });
            }
        }

        [HttpPut("items")]
        public async Task<IActionResult> UpdateCartItem([FromBody] UpdateCartItemDto dto)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                if (dto.Quantity <= 0)
                {
                    dto.Quantity = 1;
                }

                await _cartService.UpdateCartItemQuantityAsync(userId, dto.ItemId, dto.Quantity);
                return Ok(new { success = true, message = "Cart item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item");
                return StatusCode(500, new { error = "An error occurred while updating cart item" });
            }
        }

        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> RemoveCartItem(int itemId)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                await _cartService.RemoveItemFromCartAsync(userId, itemId);
                return Ok(new { success = true, message = "Item removed from cart successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from cart");
                return StatusCode(500, new { error = "An error occurred while removing item from cart" });
            }
        }
    }
}
