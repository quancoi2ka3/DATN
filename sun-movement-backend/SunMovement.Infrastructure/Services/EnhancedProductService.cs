using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    public class EnhancedProductService : IProductService
    {
        private readonly IProductService _baseProductService;
        private readonly ICouponService _couponService;
        private readonly ILogger<EnhancedProductService> _logger;

        public EnhancedProductService(
            IProductService baseProductService,
            ICouponService couponService,
            ILogger<EnhancedProductService> logger)
        {
            _baseProductService = baseProductService;
            _couponService = couponService;
            _logger = logger;
        }

        // Enhanced method that includes coupon calculation
        public async Task<Product?> GetProductWithDiscountAsync(int id)
        {
            try
            {
                var product = await _baseProductService.GetProductByIdAsync(id);
                if (product == null)
                    return null;

                return await CalculateProductDiscountAsync(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product with discount for ID {ProductId}", id);
                return await _baseProductService.GetProductByIdAsync(id);
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsWithDiscountAsync()
        {
            try
            {
                var products = await _baseProductService.GetAllProductsAsync();
                var enhancedProducts = new List<Product>();

                foreach (var product in products)
                {
                    var enhancedProduct = await CalculateProductDiscountAsync(product);
                    enhancedProducts.Add(enhancedProduct);
                }

                return enhancedProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products with discount");
                return await _baseProductService.GetAllProductsAsync();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryWithDiscountAsync(ProductCategory category)
        {
            try
            {
                var products = await _baseProductService.GetProductsByCategoryAsync(category);
                var enhancedProducts = new List<Product>();

                foreach (var product in products)
                {
                    var enhancedProduct = await CalculateProductDiscountAsync(product);
                    enhancedProducts.Add(enhancedProduct);
                }

                return enhancedProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category with discount");
                return await _baseProductService.GetProductsByCategoryAsync(category);
            }
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsWithDiscountAsync()
        {
            try
            {
                var products = await _baseProductService.GetFeaturedProductsAsync();
                var enhancedProducts = new List<Product>();

                foreach (var product in products)
                {
                    var enhancedProduct = await CalculateProductDiscountAsync(product);
                    enhancedProducts.Add(enhancedProduct);
                }

                return enhancedProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting featured products with discount");
                return await _baseProductService.GetFeaturedProductsAsync();
            }
        }

        public async Task<IEnumerable<Product>> SearchProductsWithDiscountAsync(string query)
        {
            try
            {
                var products = await _baseProductService.SearchProductsAsync(query);
                var enhancedProducts = new List<Product>();

                foreach (var product in products)
                {
                    var enhancedProduct = await CalculateProductDiscountAsync(product);
                    enhancedProducts.Add(enhancedProduct);
                }

                return enhancedProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with discount");
                return await _baseProductService.SearchProductsAsync(query);
            }
        }

        private async Task<Product> CalculateProductDiscountAsync(Product product)
        {
            try
            {
                // Get all active coupons for this product
                var productCoupons = await _couponService.GetProductCouponsAsync(product.Id);
                
                if (!productCoupons.Any())
                {
                    // No coupons, return original product
                    return product;
                }

                decimal bestDiscount = 0;
                Coupon? bestCoupon = null;

                // Find the best discount among all applicable coupons
                foreach (var coupon in productCoupons.Where(c => c.IsActive && c.IsValid))
                {
                    var discount = await _couponService.CalculateProductDiscountAsync(product.Id, coupon.Id);
                    if (discount > bestDiscount)
                    {
                        bestDiscount = discount;
                        bestCoupon = coupon;
                    }
                }

                if (bestDiscount > 0 && bestCoupon != null)
                {
                    // Create enhanced product with discount information
                    var enhancedProduct = new Product
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        DiscountPrice = product.Price - bestDiscount, // Calculate discounted price
                        Category = product.Category,
                        SubCategory = product.SubCategory,
                        ImageUrl = product.ImageUrl,
                        Sku = product.Sku,
                        Barcode = product.Barcode,
                        Weight = product.Weight,
                        Dimensions = product.Dimensions,
                        IsActive = product.IsActive,
                        IsFeatured = product.IsFeatured,
                        CreatedAt = product.CreatedAt,
                        UpdatedAt = product.UpdatedAt,
                        StockQuantity = product.StockQuantity,
                        MinimumStockLevel = product.MinimumStockLevel,
                        OptimalStockLevel = product.OptimalStockLevel,
                        TrackInventory = product.TrackInventory,
                        AllowBackorder = product.AllowBackorder,
                        // Add discount information to specifications if needed
                        Specifications = $"{product.Specifications ?? ""};DISCOUNT:{bestDiscount};COUPON:{bestCoupon.Code};TYPE:{bestCoupon.Type};VALUE:{bestCoupon.Value}"
                    };

                    return enhancedProduct;
                }

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating discount for product {ProductId}", product.Id);
                return product;
            }
        }

        // Delegate all other methods to the base service
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _baseProductService.GetAllProductsAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _baseProductService.GetProductByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            return await _baseProductService.GetProductsByCategoryAsync(category);
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            return await _baseProductService.GetFeaturedProductsAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            return await _baseProductService.SearchProductsAsync(query);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            return await _baseProductService.CreateProductAsync(product);
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            return await _baseProductService.UpdateProductAsync(product);
        }

        public async Task DeleteProductAsync(int id)
        {
            await _baseProductService.DeleteProductAsync(id);
        }

        public async Task<Product> CreateProductFromInventoryAsync(int inventoryItemId, string name, decimal price, string description, ProductCategory category, string subCategory, decimal? discountPrice = null, string? sku = null, string? barcode = null, decimal weight = 0, string? dimensions = null, int minimumStockLevel = 5, int optimalStockLevel = 50, bool isFeatured = false, bool trackInventory = true, bool allowBackorder = false)
        {
            return await _baseProductService.CreateProductFromInventoryAsync(inventoryItemId, name, price, description, category, subCategory, discountPrice, sku, barcode, weight, dimensions, minimumStockLevel, optimalStockLevel, isFeatured, trackInventory, allowBackorder);
        }

        public async Task ApplyCouponsToProductAsync(int productId, List<int> couponIds)
        {
            await _baseProductService.ApplyCouponsToProductAsync(productId, couponIds);
        }

        public async Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds)
        {
            await _baseProductService.RemoveCouponsFromProductAsync(productId, couponIds);
        }

        public async Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId)
        {
            return await _baseProductService.GetProductCouponsAsync(productId);
        }

        public async Task<IEnumerable<Product>> GetProductsWithLowStockAsync()
        {
            return await _baseProductService.GetProductsWithLowStockAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId)
        {
            return await _baseProductService.GetProductsBySupplierAsync(supplierId);
        }

        public async Task UpdateProductStockAsync(int productId, int newQuantity, string reason)
        {
            await _baseProductService.UpdateProductStockAsync(productId, newQuantity, reason);
        }

        public async Task<decimal> CalculateProductProfitAsync(int productId)
        {
            return await _baseProductService.CalculateProductProfitAsync(productId);
        }

        public async Task<IEnumerable<Product>> GetProductsCreatedFromInventoryAsync(int inventoryItemId)
        {
            return await _baseProductService.GetProductsCreatedFromInventoryAsync(inventoryItemId);
        }
    }
}
