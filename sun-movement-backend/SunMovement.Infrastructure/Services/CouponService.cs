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
        private readonly IEmailService _emailService;

        public CouponService(IUnitOfWork unitOfWork, ILogger<CouponService> logger, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<IEnumerable<Coupon>> GetAllActiveCouponsAsync()
        {
            return await _unitOfWork.Coupons.GetActiveCouponsAsync();
        }

        public async Task<Coupon?> GetCouponByCodeAsync(string code)
        {
            _logger.LogInformation("[GET COUPON] Tìm kiếm coupon với code: '{Code}' (Length: {Length})", code, code?.Length);
            
            // Kiểm tra case sensitivity
            var normalizedCode = code?.Trim().ToUpper();
            _logger.LogInformation("[GET COUPON] Code sau khi normalize: '{NormalizedCode}'", normalizedCode);
            
            var coupon = await _unitOfWork.Coupons.GetCouponByCodeAsync(code);
            if (coupon == null)
            {
                _logger.LogWarning("[GET COUPON] Không tìm thấy coupon với code: '{Code}'", code);
                
                // Thử tìm với case khác
                var allCoupons = await _unitOfWork.Coupons.GetAllAsync();
                var similarCodes = allCoupons.Where(c => c.Code.Contains(code, StringComparison.OrdinalIgnoreCase)).Select(c => c.Code).ToList();
                if (similarCodes.Any())
                {
                    _logger.LogWarning("[GET COUPON] Tìm thấy các code tương tự: {SimilarCodes}", string.Join(", ", similarCodes));
                }
            }
            else
            {
                _logger.LogInformation("[GET COUPON] Tìm thấy coupon: '{Code}', IsActive: {IsActive}, IsValid: {IsValid}", 
                    coupon.Code, coupon.IsActive, coupon.IsValid);
            }
            return coupon;
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
                _logger.LogWarning("[VALIDATE COUPON] Coupon not found: {Code}", code);
                result.ErrorMessage = "Mã giảm giá không tồn tại";
                return result;
            }

            _logger.LogInformation("[VALIDATE COUPON] Validating coupon: {Code}, IsActive: {IsActive}, StartDate: {StartDate}, EndDate: {EndDate}, UsageLimit: {UsageLimit}, CurrentUsage: {CurrentUsage}", 
                coupon.Code, coupon.IsActive, coupon.StartDate, coupon.EndDate, coupon.UsageLimit, coupon.CurrentUsageCount);

            // Basic validation
            if (!coupon.IsValid)
            {
                var now = DateTime.Now; // Local time (GMT+7)
                var reasons = new List<string>();
                
                // Sử dụng DateTime.Now (GMT+7) trực tiếp để so sánh
                // StartDate và EndDate trong database cũng là GMT+7
                _logger.LogInformation("[VALIDATE COUPON] Time check - Local Now (GMT+7): {LocalNow}, StartDate (GMT+7): {StartDate}, EndDate (GMT+7): {EndDate}", 
                    now, coupon.StartDate, coupon.EndDate);
                
                if (!coupon.IsActive)
                    reasons.Add("Coupon is not active");
                if (now < coupon.StartDate)
                    reasons.Add($"Coupon not started yet (StartDate: {coupon.StartDate}, Now: {now})");
                if (now > coupon.EndDate)
                    reasons.Add($"Coupon expired (EndDate: {coupon.EndDate}, Now: {now})");
                if (coupon.UsageLimit > 0 && coupon.CurrentUsageCount >= coupon.UsageLimit)
                    reasons.Add($"Usage limit reached (Limit: {coupon.UsageLimit}, Used: {coupon.CurrentUsageCount})");
                
                _logger.LogWarning("[VALIDATE COUPON] Coupon validation failed: {Code}, Reasons: {Reasons}", coupon.Code, string.Join(", ", reasons));
                result.ErrorMessage = "Mã giảm giá không hợp lệ";
                return result;
            }

            if (orderTotal < coupon.MinimumOrderAmount)
            {
                _logger.LogWarning("[VALIDATE COUPON] Order total too low: {OrderTotal} < {MinimumAmount} (Type: {OrderTotalType}, MinType: {MinType})", 
                    orderTotal, coupon.MinimumOrderAmount, orderTotal.GetType(), coupon.MinimumOrderAmount.GetType());
                result.ErrorMessage = $"Đơn hàng tối thiểu {coupon.MinimumOrderAmount:N0} VNĐ để sử dụng mã này";
                return result;
            }

            _logger.LogInformation("[VALIDATE COUPON] Coupon validation successful: {Code}, OrderTotal: {OrderTotal}, DiscountAmount: {DiscountAmount}", 
                coupon.Code, orderTotal, CalculateDiscount(coupon, orderTotal));

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

        public async Task<decimal> CalculateProductDiscountAsync(int productId, int couponId, decimal orderTotal)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
            
            _logger.LogInformation("[CALCULATE DISCOUNT] ProductId: {ProductId}, CouponId: {CouponId}, OrderTotal: {OrderTotal}", 
                productId, couponId, orderTotal);
            
            if (product == null || coupon == null || !coupon.IsValid)
            {
                _logger.LogWarning("[CALCULATE DISCOUNT] Invalid product or coupon - Product: {Product}, Coupon: {Coupon}, IsValid: {IsValid}", 
                    product?.Id, coupon?.Id, coupon?.IsValid);
                return 0;
            }
            
            _logger.LogInformation("[CALCULATE DISCOUNT] Product: {ProductName}, Price: {Price}, Coupon: {CouponCode}, Type: {Type}, Value: {Value}, ApplicationType: {ApplicationType}", 
                product.Name, product.Price, coupon.Code, coupon.Type, coupon.Value, coupon.ApplicationType);
            
            // Chỉ kiểm tra IsProductEligibleForCouponAsync khi coupon có ApplicationType = Product
            // và có mapping sản phẩm cụ thể
            if (coupon.ApplicationType == DiscountApplicationType.Product)
            {
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                if (couponProducts.Any()) // Nếu có mapping sản phẩm cụ thể
                {
                    var isEligible = await IsProductEligibleForCouponAsync(productId, couponId);
                    _logger.LogInformation("[CALCULATE DISCOUNT] Product eligibility check: {IsEligible}", isEligible);
                    if (!isEligible)
                        return 0;
                }
                // Nếu không có mapping sản phẩm cụ thể, cho phép áp dụng cho tất cả sản phẩm
            }
            
            var originalPrice = product.Price;
            decimal discountAmount = 0;
            switch (coupon.Type)
            {
                case CouponType.Percentage:
                    discountAmount = originalPrice * (coupon.Value / 100);
                    break;
                case CouponType.FixedAmount:
                    // Phân bổ giảm giá cố định cho từng sản phẩm theo tỷ lệ giá trị sản phẩm
                    if (orderTotal > 0)
                        discountAmount = Math.Min(coupon.Value * (originalPrice / orderTotal), originalPrice);
                    else
                        discountAmount = 0;
                    break;
                case CouponType.FreeShipping:
                    discountAmount = 0;
                    break;
            }
            
            if (coupon.MaximumDiscountAmount > 0)
            {
                discountAmount = Math.Min(discountAmount, coupon.MaximumDiscountAmount);
            }
            
            var finalDiscount = Math.Round(discountAmount, 0);
            _logger.LogInformation("[CALCULATE DISCOUNT] Final discount amount: {DiscountAmount}", finalDiscount);
            
            return finalDiscount;
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

        public async Task<IEnumerable<int>> GetCouponProductIdsAsync(int couponId)
        {
            try
            {
                // Get product IDs associated with this coupon
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                return couponProducts.Select(cp => cp.ProductId).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product IDs for coupon {CouponId}", couponId);
                return Enumerable.Empty<int>();
            }
        }

        public async Task<bool> UpdateCouponProductsAsync(int couponId, IEnumerable<int> productIds)
        {
            try
            {
                // Validate coupon exists
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                if (coupon == null)
                {
                    _logger.LogWarning("Attempted to update products for non-existent coupon {CouponId}", couponId);
                    return false;
                }

                // Get existing product associations
                var existingAssociations = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                var existingProductIds = existingAssociations.Select(cp => cp.ProductId).ToList();

                // Determine which associations to add and which to remove
                var productIdsToAdd = productIds.Where(id => !existingProductIds.Contains(id)).ToList();
                var associationsToRemove = existingAssociations.Where(cp => !productIds.Contains(cp.ProductId)).ToList();

                // Remove associations that are no longer needed
                foreach (var association in associationsToRemove)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(association);
                }

                // Add new associations
                foreach (var productId in productIdsToAdd)
                {
                    var product = await _unitOfWork.Products.GetByIdAsync(productId);
                    if (product != null)
                    {
                        await _unitOfWork.CouponProducts.AddAsync(new CouponProduct
                        {
                            CouponId = couponId,
                            ProductId = productId,
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "System"
                        });
                    }
                    else
                    {
                        _logger.LogWarning("Skipping association with non-existent product {ProductId}", productId);
                    }
                }

                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Updated products for coupon {CouponId}, added {AddCount}, removed {RemoveCount}", 
                    couponId, productIdsToAdd.Count, associationsToRemove.Count);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating products for coupon {CouponId}", couponId);
                return false;
            }
        }

        public async Task<bool> ApplyCouponToProductAsync(int couponId, int productId)
        {
            try
            {
                // Check if association already exists
                var existingAssociation = await _unitOfWork.CouponProducts.FindAsync(
                    cp => cp.CouponId == couponId && cp.ProductId == productId);
                
                if (existingAssociation.Any())
                {
                    _logger.LogInformation("Coupon {CouponId} is already applied to product {ProductId}", couponId, productId);
                    return true; // Already applied, consider it a success
                }

                // Verify both coupon and product exist
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                
                if (coupon == null || product == null)
                {
                    _logger.LogWarning("Failed to apply coupon {CouponId} to product {ProductId}: One or both entities don't exist", 
                        couponId, productId);
                    return false;
                }

                // Create association
                await _unitOfWork.CouponProducts.AddAsync(new CouponProduct
                {
                    CouponId = couponId,
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                });

                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Applied coupon {CouponId} to product {ProductId}", couponId, productId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying coupon {CouponId} to product {ProductId}", couponId, productId);
                return false;
            }
        }

        public async Task<bool> RemoveCouponFromProductAsync(int couponId, int productId)
        {
            try
            {
                // Find the association
                var association = await _unitOfWork.CouponProducts.FindAsync(
                    cp => cp.CouponId == couponId && cp.ProductId == productId);

                if (!association.Any())
                {
                    _logger.LogInformation("No association found between coupon {CouponId} and product {ProductId}", 
                        couponId, productId);
                    return false;
                }

                // Remove the association
                await _unitOfWork.CouponProducts.DeleteAsync(association.First());
                await _unitOfWork.CompleteAsync();
                
                _logger.LogInformation("Removed coupon {CouponId} from product {ProductId}", couponId, productId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing coupon {CouponId} from product {ProductId}", couponId, productId);
                return false;
            }
        }

        // ================== EMAIL CAMPAIGN METHODS ==================

        public async Task<bool> SendWelcomeCouponEmailAsync(string email, string customerName)
        {
            try
            {
                // Tạo mã giảm giá chào mừng
                var welcomeCoupon = await GenerateWelcomeCouponAsync(email, 15); // 15% discount for new customers
                
                // Gửi email với mã giảm giá
                var emailSent = await _emailService.SendWelcomeCouponEmailAsync(email, customerName, welcomeCoupon);
                
                if (emailSent)
                {
                    _logger.LogInformation("Welcome coupon email sent successfully to {Email} with coupon {CouponCode}", 
                        email, welcomeCoupon.Code);
                }
                
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending welcome coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendSeasonalCouponCampaignAsync(string occasion, IEnumerable<string> customerEmails)
        {
            try
            {
                // Tạo mã giảm giá theo mùa
                var seasonalCoupon = await GenerateSeasonalCouponAsync(occasion, 20, CouponType.Percentage, 15); // 20% discount for 15 days
                
                var successCount = 0;
                var totalCount = customerEmails.Count();
                
                foreach (var email in customerEmails)
                {
                    try
                    {
                        var emailSent = await _emailService.SendSeasonalCouponEmailAsync(
                            email, 
                            GetCustomerNameFromEmail(email), 
                            seasonalCoupon, 
                            occasion
                        );
                        
                        if (emailSent)
                        {
                            successCount++;
                        }
                        
                        // Delay để tránh spam email
                        await Task.Delay(100);
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogWarning(emailEx, "Failed to send seasonal coupon to {Email}", email);
                    }
                }
                
                _logger.LogInformation("Seasonal coupon campaign '{Occasion}' sent to {SuccessCount}/{TotalCount} customers", 
                    occasion, successCount, totalCount);
                
                return successCount > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending seasonal coupon campaign for {Occasion}", occasion);
                return false;
            }
        }

        public async Task<bool> SendBirthdayCouponEmailAsync(string email, string customerName)
        {
            try
            {
                // Tạo mã giảm giá sinh nhật đặc biệt
                var birthdayCoupon = new Coupon
                {
                    Code = await GenerateUniqueCouponCodeAsync("BIRTHDAY"),
                    Name = "Mã giảm giá sinh nhật",
                    Description = $"Chúc mừng sinh nhật {customerName} - Ưu đãi đặc biệt 25%!",
                    Type = CouponType.Percentage,
                    Value = 25,
                    MinimumOrderAmount = 200000,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(7), // 7 days to use
                    IsActive = true,
                    UsageLimit = 1,
                    UsageLimitPerCustomer = 1,
                    ApplicationType = DiscountApplicationType.All,
                    CreatedBy = "System"
                };
                
                await CreateCouponAsync(birthdayCoupon);
                
                // Gửi email sinh nhật
                var emailSent = await _emailService.SendBirthdayCouponEmailAsync(email, customerName, birthdayCoupon);
                
                if (emailSent)
                {
                    _logger.LogInformation("Birthday coupon email sent successfully to {Email} with coupon {CouponCode}", 
                        email, birthdayCoupon.Code);
                }
                
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending birthday coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendLoyaltyRewardCouponAsync(string email, string customerName, int orderCount, decimal totalSpent)
        {
            try
            {
                // Tính toán mức giảm giá dựa trên độ loyal
                var discountPercentage = CalculateLoyaltyDiscount(orderCount, totalSpent);
                
                var loyaltyCoupon = new Coupon
                {
                    Code = await GenerateUniqueCouponCodeAsync("VIP"),
                    Name = "Mã giảm giá khách hàng thân thiết",
                    Description = $"Tri ân khách hàng VIP - Giảm {discountPercentage}% cho đơn hàng tiếp theo",
                    Type = CouponType.Percentage,
                    Value = discountPercentage,
                    MinimumOrderAmount = totalSpent >= 5000000 ? 0 : 500000, // VIP customers get no minimum order
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(30),
                    IsActive = true,
                    UsageLimit = 1,
                    UsageLimitPerCustomer = 1,
                    ApplicationType = DiscountApplicationType.All,
                    CreatedBy = "System"
                };
                
                await CreateCouponAsync(loyaltyCoupon);
                
                // Gửi email tri ân
                var emailSent = await _emailService.SendCustomerLoyaltyCouponEmailAsync(
                    email, 
                    customerName, 
                    loyaltyCoupon, 
                    orderCount, 
                    totalSpent
                );
                
                if (emailSent)
                {
                    _logger.LogInformation("Loyalty reward coupon sent to {Email} (Orders: {OrderCount}, Spent: {TotalSpent})", 
                        email, orderCount, totalSpent);
                }
                
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending loyalty reward coupon to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendAbandonedCartCouponAsync(string email, string customerName, decimal cartValue)
        {
            try
            {
                // Tạo mã giảm giá cho giỏ hàng bỏ lỡ
                var discountValue = Math.Min(cartValue * 0.1m, 200000); // 10% of cart value, max 200k VND
                
                var abandonedCartCoupon = new Coupon
                {
                    Code = await GenerateUniqueCouponCodeAsync("COMEBACK"),
                    Name = "Mã giảm giá hoàn tất đơn hàng",
                    Description = "Đừng bỏ lỡ sản phẩm yêu thích - Ưu đãi đặc biệt để hoàn tất đơn hàng!",
                    Type = CouponType.FixedAmount,
                    Value = discountValue,
                    MinimumOrderAmount = cartValue * 0.8m, // Must be at least 80% of original cart value
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddHours(48), // 48 hours urgency
                    IsActive = true,
                    UsageLimit = 1,
                    UsageLimitPerCustomer = 1,
                    ApplicationType = DiscountApplicationType.All,
                    CreatedBy = "System"
                };
                
                await CreateCouponAsync(abandonedCartCoupon);
                
                // Gửi email nhắc nhở giỏ hàng
                var emailSent = await _emailService.SendAbandonedCartCouponEmailAsync(
                    email, 
                    customerName, 
                    abandonedCartCoupon, 
                    cartValue
                );
                
                if (emailSent)
                {
                    _logger.LogInformation("Abandoned cart coupon sent to {Email} (Cart Value: {CartValue})", 
                        email, cartValue);
                }
                
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending abandoned cart coupon to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendCustomCouponCampaignAsync(int couponId, IEnumerable<string> customerEmails, string campaignName, string campaignDescription)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                if (coupon == null)
                {
                    _logger.LogWarning("Coupon {CouponId} not found for campaign {CampaignName}", couponId, campaignName);
                    return false;
                }
                
                var successCount = 0;
                var totalCount = customerEmails.Count();
                
                foreach (var email in customerEmails)
                {
                    try
                    {
                        var customerName = GetCustomerNameFromEmail(email);
                        var emailSent = await _emailService.SendCouponEmailAsync(email, customerName, coupon, "campaign");
                        
                        if (emailSent)
                        {
                            successCount++;
                        }
                        
                        // Delay để tránh spam email
                        await Task.Delay(200);
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogWarning(emailEx, "Failed to send custom coupon campaign to {Email}", email);
                    }
                }
                
                _logger.LogInformation("Custom coupon campaign '{CampaignName}' sent to {SuccessCount}/{TotalCount} customers", 
                    campaignName, successCount, totalCount);
                
                return successCount > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending custom coupon campaign {CampaignName}", campaignName);
                return false;
            }
        }

        // ================== HELPER METHODS ==================

        private decimal CalculateLoyaltyDiscount(int orderCount, decimal totalSpent)
        {
            // Tính toán mức giảm giá dựa trên số đơn hàng và tổng chi tiêu
            if (totalSpent >= 10000000 || orderCount >= 20) // 10M VND or 20+ orders
                return 30; // VIP tier: 30%
            else if (totalSpent >= 5000000 || orderCount >= 10) // 5M VND or 10+ orders  
                return 25; // Gold tier: 25%
            else if (totalSpent >= 2000000 || orderCount >= 5) // 2M VND or 5+ orders
                return 20; // Silver tier: 20%
            else
                return 15; // Bronze tier: 15%
        }

        private string GetCustomerNameFromEmail(string email)
        {
            // Extract name from email (simple implementation)
            // In real implementation, you should query customer database
            if (string.IsNullOrEmpty(email)) return "Khách hàng";
            
            var localPart = email.Split('@')[0];
            var name = localPart.Replace(".", " ").Replace("_", " ");
            
            // Capitalize first letter of each word
            return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.ToLower());
        }
    }
}
