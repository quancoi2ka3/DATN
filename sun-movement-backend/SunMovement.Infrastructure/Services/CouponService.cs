using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    public class CouponService : ICouponService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CouponService> _logger;

        public CouponService(IUnitOfWork unitOfWork, ILogger<CouponService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<IEnumerable<Coupon>> GetAllActiveCouponsAsync()
        {
            return await _unitOfWork.Coupons.GetActiveCouponsAsync();
        }

        public async Task<Coupon?> GetCouponByCodeAsync(string code)
        {
            return await _unitOfWork.Coupons.GetCouponByCodeAsync(code);
        }

        public async Task<Coupon> CreateCouponAsync(Coupon coupon)
        {
            // Validate unique code
            if (!await IsCouponCodeUniqueAsync(coupon.Code))
            {
                throw new InvalidOperationException($"Mã giảm giá '{coupon.Code}' đã tồn tại");
            }

            // Validate dates
            if (coupon.EndDate <= coupon.StartDate)
            {
                throw new InvalidOperationException("Ngày kết thúc phải sau ngày bắt đầu");
            }

            // Validate values
            if (coupon.Type == CouponType.Percentage && coupon.Value > 100)
            {
                throw new InvalidOperationException("Giá trị giảm giá theo phần trăm không thể vượt quá 100%");
            }

            coupon.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Coupons.AddAsync(coupon);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã tạo mã giảm giá mới: {CouponCode}", coupon.Code);
            return coupon;
        }

        public async Task<bool> UpdateCouponAsync(Coupon coupon)
        {
            coupon.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.Coupons.UpdateAsync(coupon);
            var result = await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã cập nhật mã giảm giá: {CouponCode}", coupon.Code);
            return result > 0;
        }

        public async Task<bool> DeactivateCouponAsync(int couponId)
        {
            var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
            if (coupon == null)
                return false;

            coupon.IsActive = false;
            coupon.UpdatedAt = DateTime.UtcNow;
            
            await _unitOfWork.Coupons.UpdateAsync(coupon);
            var result = await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã vô hiệu hóa mã giảm giá: {CouponCode}", coupon.Code);
            return result > 0;
        }

        public async Task<bool> DeleteCouponAsync(int couponId)
        {
            var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
            if (coupon == null)
                return false;

            await _unitOfWork.Coupons.DeleteAsync(coupon);
            var result = await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã xóa mã giảm giá: {CouponCode}", coupon.Code);
            return result > 0;
        }

        public async Task<CouponValidationResult> ValidateCouponAsync(string code, decimal orderTotal, string userId, IEnumerable<CartItem> items)
        {
            var result = new CouponValidationResult();

            var coupon = await GetCouponByCodeAsync(code);
            if (coupon == null)
            {
                result.ErrorMessage = "Mã giảm giá không tồn tại";
                return result;
            }

            // Basic validation
            if (!coupon.IsValid)
            {
                result.ErrorMessage = "Mã giảm giá không hợp lệ";
                return result;
            }

            if (orderTotal < coupon.MinimumOrderAmount)
            {
                result.ErrorMessage = $"Đơn hàng tối thiểu {coupon.MinimumOrderAmount:N0} VNĐ để sử dụng mã này";
                return result;
            }

            result.IsValid = true;
            result.Coupon = coupon;
            result.DiscountAmount = CalculateDiscount(coupon, orderTotal);
            
            return result;
        }

        public async Task<decimal> CalculateDiscountAsync(string code, decimal orderTotal, IEnumerable<CartItem> items)
        {
            var coupon = await GetCouponByCodeAsync(code);
            if (coupon == null)
                return 0;

            return CalculateDiscount(coupon, orderTotal);
        }

        public async Task<bool> ApplyCouponAsync(string code, int orderId, string userId, decimal discountAmount)
        {
            var coupon = await GetCouponByCodeAsync(code);
            if (coupon == null)
                return false;

            // Tăng số lần sử dụng
            coupon.CurrentUsageCount++;
            await _unitOfWork.Coupons.UpdateAsync(coupon);

            // Tạo lịch sử sử dụng
            var usage = new CouponUsageHistory
            {
                CouponId = coupon.Id,
                OrderId = orderId,
                UserId = userId,
                DiscountAmount = discountAmount,
                UsedAt = DateTime.UtcNow
            };

            await _unitOfWork.CouponUsageHistories.AddAsync(usage);
            var result = await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã áp dụng mã giảm giá {CouponCode} cho đơn hàng {OrderId}", code, orderId);
            return result > 0;
        }

        public async Task<IEnumerable<Coupon>> GetApplicableCouponsAsync(decimal orderTotal, IEnumerable<CartItem> items)
        {
            var activeCoupons = await GetAllActiveCouponsAsync();
            return activeCoupons.Where(c => orderTotal >= c.MinimumOrderAmount && c.IsValid);
        }

        public Task<IEnumerable<Coupon>> GenerateAgedInventoryCouponsAsync(int daysThreshold, decimal discountPercentage, int validityDays)
        {
            // TODO: Implement when inventory system is complete
            var result = new List<Coupon>();
            return Task.FromResult<IEnumerable<Coupon>>(result);
        }

        public async Task<Coupon> GenerateWelcomeCouponAsync(string newUserId, decimal discountPercentage = 10)
        {
            var code = await GenerateUniqueCouponCodeAsync("WELCOME");
            var coupon = new Coupon
            {
                Code = code,
                Name = "Mã chào mừng thành viên mới",
                Description = $"Chào mừng khách hàng mới - Giảm {discountPercentage}%",
                Type = CouponType.Percentage,
                Value = discountPercentage,
                MinimumOrderAmount = 100000,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(30),
                IsActive = true,
                UsageLimit = 1,
                ApplicationType = DiscountApplicationType.All
            };

            return await CreateCouponAsync(coupon);
        }

        public async Task<Coupon> GenerateSeasonalCouponAsync(string occasion, decimal discountValue, CouponType type, int validityDays = 30)
        {
            var code = await GenerateUniqueCouponCodeAsync(occasion.ToUpper());
            var coupon = new Coupon
            {
                Code = code,
                Name = $"Khuyến mãi {occasion}",
                Description = $"Khuyến mãi đặc biệt dịp {occasion}",
                Type = type,
                Value = discountValue,
                MinimumOrderAmount = type == CouponType.FixedAmount ? discountValue * 2 : 50000,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(validityDays),
                IsActive = true,
                UsageLimit = 0,
                ApplicationType = DiscountApplicationType.All
            };

            return await CreateCouponAsync(coupon);
        }

        public async Task<CouponStatistics> GetCouponStatisticsAsync(int couponId)
        {
            var usageHistory = await _unitOfWork.Coupons.GetCouponUsageHistoryAsync(couponId);
            
            return new CouponStatistics
            {
                TotalUsageCount = usageHistory.Count(),
                TotalDiscountAmount = usageHistory.Sum(h => h.DiscountAmount),
                UniqueUsersCount = usageHistory.Select(h => h.UserId).Distinct().Count()
            };
        }

        public async Task<IEnumerable<CouponUsageHistory>> GetCouponUsageHistoryAsync(int couponId)
        {
            return await _unitOfWork.Coupons.GetCouponUsageHistoryAsync(couponId);
        }

        public async Task<IEnumerable<Coupon>> GetExpiredCouponsAsync()
        {
            return await _unitOfWork.Coupons.GetExpiredCouponsAsync();
        }

        public async Task<IEnumerable<Coupon>> GetMostUsedCouponsAsync(int count = 10)
        {
            var allCoupons = await _unitOfWork.Coupons.GetAllAsync();
            return allCoupons.OrderByDescending(c => c.CurrentUsageCount).Take(count);
        }

        public async Task<bool> IsCouponCodeUniqueAsync(string code, int? excludeId = null)
        {
            return await _unitOfWork.Coupons.IsCouponCodeUniqueAsync(code, excludeId);
        }

        public async Task<string> GenerateUniqueCouponCodeAsync(string prefix = "")
        {
            string code;
            int attempts = 0;
            const int maxAttempts = 10;

            do
            {
                if (attempts >= maxAttempts)
                {
                    throw new InvalidOperationException("Không thể tạo mã giảm giá duy nhất sau nhiều lần thử.");
                }

                var randomSuffix = new Random().Next(1000, 9999);
                code = string.IsNullOrEmpty(prefix) ? $"COUPON{randomSuffix}" : $"{prefix}{randomSuffix}";
                attempts++;
            }
            while (await _unitOfWork.Coupons.GetCouponByCodeAsync(code) != null);

            return code;
        }

        public async Task CleanupExpiredCouponsAsync()
        {
            var expiredCoupons = await GetExpiredCouponsAsync();
            var deletedCount = 0;

            foreach (var coupon in expiredCoupons.Where(c => c.CurrentUsageCount == 0))
            {
                await _unitOfWork.Coupons.DeleteAsync(coupon);
                deletedCount++;
            }

            if (deletedCount > 0)
            {
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Đã dọn dẹp {Count} mã giảm giá hết hạn chưa sử dụng", deletedCount);
            }
        }

        // Integrated System Methods - Product-Coupon Integration

        public async Task<IEnumerable<Coupon>> GetActiveCouponsAsync()
        {
            return await _unitOfWork.Coupons.GetActiveCouponsAsync();
        }
        
        public async Task ApplyCouponsToProductAsync(int productId, List<int> couponIds)
        {
            try
            {
                // Validate product exists
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    _logger.LogWarning("Failed to apply coupons: Product with ID {ProductId} not found", productId);
                    return;
                }

                // Get existing coupon associations to avoid duplicates
                var existingCouponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                var existingCouponIds = existingCouponProducts.Select(cp => cp.CouponId).ToList();

                // Add new associations for coupons that aren't already associated
                var addedCount = 0;
                foreach (var couponId in couponIds.Except(existingCouponIds))
                {
                    // Validate coupon exists and is active
                    var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                    if (coupon == null || !coupon.IsActive)
                    {
                        _logger.LogWarning("Skipping invalid or inactive coupon ID {CouponId}", couponId);
                        continue;
                    }

                    var couponProduct = new CouponProduct
                    {
                        CouponId = couponId,
                        ProductId = productId,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _unitOfWork.CouponProducts.AddAsync(couponProduct);
                    addedCount++;
                }

                if (addedCount > 0)
                {
                    await _unitOfWork.CompleteAsync();
                    _logger.LogInformation("Applied {Count} coupons to product {ProductId}", addedCount, productId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying coupons to product {ProductId}", productId);
            }
        }

        public async Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds)
        {
            try
            {
                // Get existing coupon associations
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(
                    cp => cp.ProductId == productId && couponIds.Contains(cp.CouponId));

                if (!couponProducts.Any())
                {
                    return;
                }

                // Remove associations
                foreach (var couponProduct in couponProducts)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(couponProduct);
                }

                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Removed {Count} coupons from product {ProductId}", 
                    couponProducts.Count(), productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing coupons from product {ProductId}", productId);
            }
        }

        public async Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId)
        {
            try
            {
                // Get coupon IDs associated with this product
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                var couponIds = couponProducts.Select(cp => cp.CouponId).ToList();

                if (!couponIds.Any())
                {
                    return Enumerable.Empty<Coupon>();
                }

                // Get the actual coupon objects
                var coupons = await Task.WhenAll(
                    couponIds.Select(id => _unitOfWork.Coupons.GetByIdAsync(id)));

                // Filter out any nulls and return active coupons only
                return coupons.Where(c => c != null && c.IsActive).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coupons for product {ProductId}", productId);
                return Enumerable.Empty<Coupon>();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsWithCouponAsync(int couponId)
        {
            try
            {
                // Get product IDs associated with this coupon
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                var productIds = couponProducts.Select(cp => cp.ProductId).ToList();

                if (!productIds.Any())
                {
                    return Enumerable.Empty<Product>();
                }

                // Get the actual product objects
                var products = await Task.WhenAll(
                    productIds.Select(id => _unitOfWork.Products.GetByIdAsync(id)));

                // Filter out any nulls and return active products only
                return products.Where(p => p != null && p.IsActive).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products for coupon {CouponId}", couponId);
                return Enumerable.Empty<Product>();
            }
        }

        public async Task<bool> IsProductEligibleForCouponAsync(int productId, int couponId)
        {
            try
            {
                // Get the coupon and product
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                var product = await _unitOfWork.Products.GetByIdAsync(productId);

                if (coupon == null || product == null || !coupon.IsValid)
                {
                    return false;
                }

                // Check if the coupon applies to this product category
                if (coupon.ApplicationType == DiscountApplicationType.Category)
                {
                    // Check if the product category matches allowed categories in the coupon
                    bool categoryMatches = false;
                    if (!string.IsNullOrEmpty(coupon.ApplicationValue))
                    {
                        var allowedCategories = coupon.ApplicationValue
                            .Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => s.Trim())
                            .ToList();
                            
                        categoryMatches = allowedCategories.Contains(product.Category.ToString());
                    }
                    return categoryMatches;
                }
                
                // Check if the coupon is specific to certain products
                if (coupon.ApplicationType == DiscountApplicationType.Product)
                {
                    // Check if there's an existing association between this product and coupon
                    var couponProducts = await _unitOfWork.CouponProducts.FindAsync(
                        cp => cp.ProductId == productId && cp.CouponId == couponId);
                    return couponProducts.Any();
                }
                
                // For DiscountApplicationType.All, all products are eligible
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking product {ProductId} eligibility for coupon {CouponId}", 
                    productId, couponId);
                return false;
            }
        }

        public async Task<decimal> CalculateProductDiscountAsync(int productId, int couponId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                
                if (product == null || coupon == null || !coupon.IsValid)
                    return 0;
                
                // Check if the product is eligible for this coupon
                if (!await IsProductEligibleForCouponAsync(productId, couponId))
                    return 0;
                
                var originalPrice = product.Price;
                decimal discountAmount = 0;
                
                switch (coupon.Type)
                {
                    case CouponType.Percentage:
                        discountAmount = originalPrice * (coupon.Value / 100);
                        break;
                    case CouponType.FixedAmount:
                        discountAmount = Math.Min(coupon.Value, originalPrice);
                        break;
                    case CouponType.FreeShipping:
                        // For products, free shipping doesn't affect the product price
                        discountAmount = 0;
                        break;
                }
                
                // Apply maximum discount limit if set
                if (coupon.MaximumDiscountAmount > 0)
                {
                    discountAmount = Math.Min(discountAmount, coupon.MaximumDiscountAmount);
                }
                
                return Math.Round(discountAmount, 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating discount for product {ProductId} with coupon {CouponId}", 
                    productId, couponId);
                return 0;
            }
        }

        private decimal CalculateDiscount(Coupon coupon, decimal orderTotal)
        {
            decimal discountAmount = coupon.Type switch
            {
                CouponType.Percentage => orderTotal * (coupon.Value / 100),
                CouponType.FixedAmount => Math.Min(coupon.Value, orderTotal),
                CouponType.FreeShipping => 30000, // Fixed shipping cost
                _ => 0
            };

            // Apply maximum discount limit if set
            if (coupon.MaximumDiscountAmount > 0)
            {
                discountAmount = Math.Min(discountAmount, coupon.MaximumDiscountAmount);
            }

            return Math.Round(discountAmount, 0);
        }
    }
}
