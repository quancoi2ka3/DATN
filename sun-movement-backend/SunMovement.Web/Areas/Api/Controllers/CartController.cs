using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Services;
using System.Security.Claims;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly IShoppingCartService _cartService;
        private readonly ICouponService _couponService;
        private readonly ILogger<CartController> _logger;

        public CartController(
            IShoppingCartService cartService,
            ICouponService couponService,
            ILogger<CartController> logger)
        {
            _cartService = cartService;
            _couponService = couponService;
            _logger = logger;
        }

        [HttpPost("validate-coupon")]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                // Convert request items to CartItem objects
                var cartItems = request.Items.Select(item => new CartItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price
                }).ToList();

                var result = await _couponService.ValidateCouponAsync(
                    request.CouponCode, 
                    request.OrderTotal, 
                    userId, 
                    cartItems);

                return Ok(new
                {
                    isValid = result.IsValid,
                    discountAmount = result.DiscountAmount,
                    error = result.ErrorMessage,
                    couponDetails = result.IsValid && result.Coupon != null ? new
                    {
                        code = request.CouponCode,
                        type = result.Coupon.Type.ToString(),
                        value = result.DiscountAmount,
                        description = result.Coupon.Description ?? ""
                    } : null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating coupon {CouponCode}", request.CouponCode);
                return StatusCode(500, new { 
                    isValid = false, 
                    discountAmount = 0, 
                    error = "Lỗi hệ thống khi xác thực mã giảm giá" 
                });
            }
        }

        [HttpPost("apply-coupon")]
        public async Task<IActionResult> ApplyCoupon([FromBody] ApplyCouponRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                // Get current cart
                var cart = await _cartService.GetCartWithItemsAsync(userId);
                if (cart == null || !cart.Items.Any())
                {
                    return BadRequest(new { 
                        success = false, 
                        error = "Giỏ hàng trống" 
                    });
                }

                // Validate coupon first
                var cartItems = cart.Items.Select(item => new CartItem
                {
                    ProductId = item.ProductId ?? 0,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList();

                var orderTotal = cart.Items.Sum(item => item.Subtotal);
                var validation = await _couponService.ValidateCouponAsync(
                    request.CouponCode, 
                    orderTotal, 
                    userId, 
                    cartItems);

                if (!validation.IsValid)
                {
                    return BadRequest(new { 
                        success = false, 
                        error = validation.ErrorMessage ?? "Mã giảm giá không hợp lệ" 
                    });
                }

                // Apply coupon to cart items and return enhanced cart items
                var enhancedItems = new List<object>();
                foreach (var item in cart.Items)
                {
                    var discountAmount = await _couponService.CalculateProductDiscountAsync(
                        item.ProductId ?? 0, 
                        validation.Coupon?.Id ?? 0);

                    enhancedItems.Add(new
                    {
                        id = item.Id.ToString(),
                        productId = item.ProductId?.ToString() ?? "",
                        name = item.ItemName,
                        imageUrl = item.ItemImageUrl ?? "",
                        originalPrice = item.UnitPrice,
                        finalPrice = Math.Max(0, item.UnitPrice - discountAmount),
                        discountAmount = discountAmount,
                        couponCode = discountAmount > 0 ? request.CouponCode : null,
                        couponType = discountAmount > 0 && validation.Coupon != null ? validation.Coupon.Type.ToString() : null,
                        quantity = item.Quantity,
                        size = (string?)null, // Add if you have size info
                        color = (string?)null, // Add if you have color info
                        addedAt = item.CreatedAt
                    });
                }

                return Ok(new { 
                    success = true, 
                    items = enhancedItems 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying coupon {CouponCode}", request.CouponCode);
                return StatusCode(500, new { 
                    success = false, 
                    error = "Lỗi hệ thống khi áp dụng mã giảm giá" 
                });
            }
        }

        [HttpPost("remove-coupon")]
        public async Task<IActionResult> RemoveCoupon([FromBody] RemoveCouponRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                // Get current cart
                var cart = await _cartService.GetCartWithItemsAsync(userId);
                if (cart == null || !cart.Items.Any())
                {
                    return BadRequest(new { 
                        success = false, 
                        error = "Giỏ hàng trống" 
                    });
                }

                // Return cart items without coupon discounts
                var enhancedItems = cart.Items.Select(item => new
                {
                    id = item.Id.ToString(),
                    productId = item.ProductId?.ToString() ?? "",
                    name = item.ItemName,
                    imageUrl = item.ItemImageUrl ?? "",
                    originalPrice = item.UnitPrice,
                    finalPrice = item.UnitPrice,
                    discountAmount = 0,
                    couponCode = (string?)null,
                    couponType = (string?)null,
                    quantity = item.Quantity,
                    size = (string?)null,
                    color = (string?)null,
                    addedAt = item.CreatedAt
                }).ToList();

                return Ok(new { 
                    success = true, 
                    items = enhancedItems 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing coupon {CouponCode}", request.CouponCode);
                return StatusCode(500, new { 
                    success = false, 
                    error = "Lỗi hệ thống khi gỡ bỏ mã giảm giá" 
                });
            }
        }
    }

    // Request models
    public class ValidateCouponRequest
    {
        public string CouponCode { get; set; } = "";
        public decimal OrderTotal { get; set; }
        public List<CartItemRequest> Items { get; set; } = new();
    }

    public class ApplyCouponRequest
    {
        public string CouponCode { get; set; } = "";
        public List<CartItemRequest> Items { get; set; } = new();
    }

    public class RemoveCouponRequest
    {
        public string CouponCode { get; set; } = "";
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
