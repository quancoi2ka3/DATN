using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Services;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

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
        private string? GetUserId()
        {
            return User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        [HttpPost("apply-coupon")]
        public async Task<IActionResult> ApplyCoupon([FromBody] CouponRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("[APPLY COUPON] Người dùng chưa đăng nhập");
                    return Unauthorized(new { success = false, error = "Bạn cần đăng nhập để sử dụng mã giảm giá." });
                }

                _logger.LogInformation("[APPLY COUPON] Bắt đầu áp dụng mã giảm giá: {CouponCode} cho user: {UserId}", request.CouponCode, userId);

                // Lấy giỏ hàng thực tế
                var cart = await _cartService.GetCartWithItemsAsync(userId);
                if (cart == null || !cart.Items.Any())
                {
                    _logger.LogWarning("[APPLY COUPON] Giỏ hàng trống cho user {UserId}", userId);
                    return BadRequest(new {
                        success = false,
                        error = "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi áp dụng mã giảm giá."
                    });
                }

                _logger.LogInformation("[APPLY COUPON] Giỏ hàng có {ItemCount} sản phẩm", cart.Items.Count);

                // Chuẩn bị dữ liệu cho validate
                var cartItems = cart.Items.Select(item => new CartItem
                {
                    ProductId = item.ProductId ?? 0,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList();

                var orderTotal = cart.Items.Sum(item => {
                    var unitPrice = item.UnitPrice > 0 ? item.UnitPrice : (item.Product?.Price ?? 0);
                    return unitPrice * item.Quantity;
                });

                _logger.LogInformation("[APPLY COUPON] Tổng giá trị đơn hàng: {OrderTotal}", orderTotal);

                var validation = await _couponService.ValidateCouponAsync(
                    request.CouponCode,
                    orderTotal,
                    userId,
                    cartItems);

                _logger.LogInformation("[APPLY COUPON] Kết quả validate: IsValid={IsValid}, Error={Error}", 
                    validation.IsValid, validation.ErrorMessage);

                if (!validation.IsValid)
                {
                    _logger.LogWarning("[APPLY COUPON] Coupon validation failed: {Error}", validation.ErrorMessage);
                    return BadRequest(new {
                        success = false,
                        isValid = false,
                        error = validation.ErrorMessage ?? "Mã giảm giá không hợp lệ hoặc không áp dụng được cho đơn hàng này.",
                        discountAmount = 0,
                        couponDetails = (object?)null
                    });
                }

                _logger.LogInformation("[APPLY COUPON] Coupon hợp lệ, bắt đầu tính toán giảm giá");

                // Tính giảm giá cho từng sản phẩm
                var enhancedItems = new List<object>();
                decimal totalDiscount = 0;
                foreach (var item in cart.Items)
                {
                    var itemUnitPrice = item.UnitPrice > 0 ? item.UnitPrice : (item.Product?.Price ?? 0);
                    var discountAmount = await _couponService.CalculateProductDiscountAsync(
                        item.ProductId ?? 0,
                        validation.Coupon?.Id ?? 0,
                        orderTotal // truyền tổng giá trị đơn hàng
                    );
                    totalDiscount += discountAmount * item.Quantity;
                    
                    _logger.LogInformation("[APPLY COUPON] Sản phẩm {ProductId}: UnitPrice={UnitPrice}, DiscountAmount={DiscountAmount}, Quantity={Quantity}", 
                        item.ProductId, itemUnitPrice, discountAmount, item.Quantity);
                    
                    enhancedItems.Add(new
                    {
                        id = item.Id.ToString(),
                        productId = item.ProductId?.ToString() ?? "",
                        name = item.ItemName ?? (item.Product?.Name ?? "Unknown Product"),
                        imageUrl = item.ItemImageUrl ?? (item.Product?.ImageUrl ?? ""),
                        originalPrice = itemUnitPrice,
                        finalPrice = Math.Max(0, itemUnitPrice - discountAmount),
                        discountAmount = discountAmount,
                        couponCode = discountAmount > 0 ? request.CouponCode : null,
                        couponType = discountAmount > 0 && validation.Coupon != null ? validation.Coupon.Type.ToString() : null,
                        quantity = item.Quantity,
                        size = (string?)null,
                        color = (string?)null,
                        addedAt = item.CreatedAt
                    });
                }
                var orderTotalValue = cart.Items.Sum(i => {
                    var unitPrice = i.UnitPrice > 0 ? i.UnitPrice : (i.Product?.Price ?? 0);
                    return unitPrice * i.Quantity;
                });
                var finalTotal = orderTotalValue - totalDiscount;

                _logger.LogInformation("[APPLY COUPON] Hoàn thành: OrderTotal={OrderTotal}, TotalDiscount={TotalDiscount}, FinalTotal={FinalTotal}", 
                    orderTotalValue, totalDiscount, finalTotal);

                return Ok(new {
                    success = true,
                    isValid = true,
                    items = enhancedItems,
                    orderTotal = orderTotalValue,
                    totalDiscount = totalDiscount,
                    finalTotal = finalTotal,
                    couponDetails = validation.Coupon != null ? new {
                        code = validation.Coupon.Code,
                        type = validation.Coupon.Type.ToString(),
                        value = validation.Coupon.Value,
                        description = validation.Coupon.Description ?? "",
                        minimumOrderAmount = validation.Coupon.MinimumOrderAmount
                    } : null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[APPLY COUPON] Lỗi hệ thống khi áp dụng mã giảm giá {CouponCode}", request.CouponCode);
                return StatusCode(500, new {
                    success = false,
                    isValid = false,
                    discountAmount = 0,
                    error = "Lỗi hệ thống khi áp dụng mã giảm giá. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
                    couponDetails = (object?)null
                });
            }
        }

        [HttpPost("remove-coupon")]
        public async Task<IActionResult> RemoveCoupon([FromBody] RemoveCouponRequest request)
        {
            try
            {
                var userId = GetUserId();
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
                var enhancedItems = cart.Items.Select(item => {
                    var unitPrice = item.UnitPrice > 0 ? item.UnitPrice : (item.Product?.Price ?? 0);
                    return new {
                        id = item.Id.ToString(),
                        productId = item.ProductId?.ToString() ?? "",
                        itemName = item.ItemName ?? (item.ProductId != null ? (item.Product?.Name ?? "") : ""),
                        itemImageUrl = item.ItemImageUrl ?? (item.ProductId != null ? (item.Product?.ImageUrl ?? "") : ""),
                        unitPrice = unitPrice,
                        finalPrice = unitPrice,
                        discountAmount = 0,
                        quantity = item.Quantity,
                        addedAt = item.CreatedAt
                    };
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
    public class CouponRequest
    {
        public string CouponCode { get; set; } = "";
    }

    public class RemoveCouponRequest
    {
        public string CouponCode { get; set; } = "";
    }
}
