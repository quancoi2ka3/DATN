using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _unitOfWork.Products.GetAllAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _unitOfWork.Products.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            try
            {
                var products = await _unitOfWork.Products.GetProductsByCategoryAsync(category);
                return products ?? Enumerable.Empty<Product>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ProductService.GetProductsByCategoryAsync: {ex.Message}");
                throw new Exception($"Failed to retrieve products for category {category}", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            return await _unitOfWork.Products.GetFeaturedProductsAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            try
            {
                var searchQuery = string.IsNullOrEmpty(query) ? string.Empty : query;
                return await _unitOfWork.Products.SearchProductsAsync(searchQuery);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchProductsAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product != null)
            {
                await _unitOfWork.Products.DeleteAsync(product);
                await _unitOfWork.CompleteAsync();
            }
        }

        // New integrated methods for Product-Inventory-Coupon integration
        
        public async Task<Product> CreateProductFromInventoryAsync(
            int inventoryItemId, 
            string name, 
            decimal price, 
            string description, 
            ProductCategory category, 
            string subCategory,
            decimal? discountPrice = null,
            string? sku = null,
            string? barcode = null,
            decimal weight = 0,
            string? dimensions = null,
            int minimumStockLevel = 5,
            int optimalStockLevel = 50,
            bool isFeatured = false,
            bool trackInventory = true,
            bool allowBackorder = false)
        {
            try
            {
                // Get inventory service (would need dependency injection)
                // For now, we'll create a basic product and let the controller handle inventory integration
                
                var product = new Product
                {
                    Name = name,
                    Description = description,
                    Price = price,
                    DiscountPrice = discountPrice,
                    Category = category,
                    SubCategory = subCategory,
                    Sku = sku ?? $"PROD-{DateTime.Now.Ticks}",
                    Barcode = barcode,
                    Weight = weight,
                    Dimensions = dimensions,
                    MinimumStockLevel = minimumStockLevel,
                    OptimalStockLevel = optimalStockLevel,
                    IsFeatured = isFeatured,
                    TrackInventory = trackInventory,
                    AllowBackorder = allowBackorder,
                    IsActive = true,
                    StockQuantity = 0, // Will be updated by inventory transfer
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _unitOfWork.Products.AddAsync(product);
                await _unitOfWork.CompleteAsync();
                
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateProductFromInventoryAsync: {ex.Message}");
                throw;
            }
        }

        public async Task ApplyCouponsToProductAsync(int productId, List<int> couponIds)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                    throw new ArgumentException($"Product with ID {productId} not found");

                // Remove existing coupon relationships
                var existingCouponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                foreach (var existing in existingCouponProducts)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(existing);
                }

                // Add new coupon relationships
                foreach (var couponId in couponIds)
                {
                    var couponProduct = new CouponProduct
                    {
                        ProductId = productId,
                        CouponId = couponId,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.CouponProducts.AddAsync(couponProduct);
                }

                await _unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ApplyCouponsToProductAsync: {ex.Message}");
                throw;
            }
        }

        public async Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds)
        {
            try
            {
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => 
                    cp.ProductId == productId && couponIds.Contains(cp.CouponId));

                foreach (var couponProduct in couponProducts)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(couponProduct);
                }

                await _unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in RemoveCouponsFromProductAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId)
        {
            try
            {
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                var couponIds = couponProducts.Select(cp => cp.CouponId).ToList();
                
                var coupons = new List<Coupon>();
                foreach (var couponId in couponIds)
                {
                    var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                    if (coupon != null)
                        coupons.Add(coupon);
                }

                return coupons;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductCouponsAsync: {ex.Message}");
                return Enumerable.Empty<Coupon>();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsWithLowStockAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                return products.Where(p => p.IsActive && 
                                          p.TrackInventory && 
                                          p.StockQuantity <= p.MinimumStockLevel);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductsWithLowStockAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId)
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                return products.Where(p => p.ProductSuppliers?.Any(ps => ps.SupplierId == supplierId) == true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductsBySupplierAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }

        public async Task UpdateProductStockAsync(int productId, int newQuantity, string reason)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                    throw new ArgumentException($"Product with ID {productId} not found");

                int oldQuantity = product.StockQuantity;
                product.StockQuantity = newQuantity;
                product.LastStockUpdateDate = DateTime.UtcNow;

                await _unitOfWork.Products.UpdateAsync(product);
                await _unitOfWork.CompleteAsync();

                Console.WriteLine($"Updated stock for {product.Name} from {oldQuantity} to {newQuantity}. Reason: {reason}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateProductStockAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<decimal> CalculateProductProfitAsync(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null || product.CostPrice == 0)
                    return 0;

                decimal sellingPrice = product.DiscountPrice ?? product.Price;
                return ((sellingPrice - product.CostPrice) / product.CostPrice) * 100;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CalculateProductProfitAsync: {ex.Message}");
                return 0;
            }
        }

        public async Task<IEnumerable<Product>> GetProductsCreatedFromInventoryAsync(int inventoryItemId)
        {
            try
            {
                // This would require tracking the relationship between inventory items and products
                // For now, return empty collection
                // In a full implementation, we'd have a table to track this relationship
                await Task.CompletedTask;
                return Enumerable.Empty<Product>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductsCreatedFromInventoryAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }
    }
}
