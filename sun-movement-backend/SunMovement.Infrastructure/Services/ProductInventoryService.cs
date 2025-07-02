using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    public class ProductInventoryService : IProductInventoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;
        private readonly ICouponService _couponService;
        private readonly ILogger<ProductInventoryService> _logger;

        public ProductInventoryService(
            IUnitOfWork unitOfWork,
            IProductService productService,
            IInventoryService inventoryService,
            ICouponService couponService,
            ILogger<ProductInventoryService> logger)
        {
            _unitOfWork = unitOfWork;
            _productService = productService;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _logger = logger;
        }

        /// <summary>
        /// Tạo sản phẩm và tùy chọn nhập kho ban đầu
        /// </summary>
        public async Task<Product> CreateProductWithInventoryAsync(
            Product product, 
            int initialQuantity = 0, 
            decimal? unitCost = null, 
            int? supplierId = null, 
            string referenceNumber = "", 
            string notes = "")
        {
            try
            {
                // Nếu không cung cấp giá vốn, sử dụng 70% giá bán hoặc giá trị mặc định
                decimal costPrice = unitCost ?? (product.Price * 0.7m);
                product.CostPrice = costPrice;
                
                // Tạo sản phẩm trước (độc lập với kho)
                var createdProduct = await _productService.CreateProductAsync(product);
                
                // Nếu có thông tin kho ban đầu, tạo giao dịch nhập kho
                if (initialQuantity > 0)
                {
                    await _inventoryService.AddStockAsync(
                        createdProduct.Id,
                        initialQuantity,
                        costPrice,
                        supplierId,
                        referenceNumber,
                        notes);
                    
                    // Cập nhật thông tin tồn kho cho sản phẩm
                    createdProduct.StockQuantity = initialQuantity;
                    await _unitOfWork.Products.UpdateAsync(createdProduct);
                    await _unitOfWork.CompleteAsync();
                }
                
                // Cập nhật trạng thái sản phẩm dựa trên tồn kho
                await UpdateProductStatusBasedOnInventoryAsync(createdProduct.Id);
                
                _logger.LogInformation("Đã tạo sản phẩm mới với ID {ProductId} và nhập kho {Quantity} sản phẩm", 
                    createdProduct.Id, initialQuantity);
                
                return createdProduct;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo sản phẩm với tồn kho ban đầu");
                throw;
            }
        }

        /// <summary>
        /// Cập nhật trạng thái sản phẩm dựa trên tồn kho
        /// </summary>
        public async Task UpdateProductStatusBasedOnInventoryAsync(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    _logger.LogWarning("Không tìm thấy sản phẩm có ID {ProductId}", productId);
                    return;
                }

                var oldStatus = product.Status;
                
                // Xác định trạng thái mới dựa trên tồn kho
                if (product.StockQuantity <= 0)
                {
                    product.Status = ProductStatus.OutOfStock;
                }
                else if (product.StockQuantity <= product.MinimumStockLevel)
                {
                    // Vẫn còn hàng nhưng ở mức thấp, giữ trạng thái Active nhưng có thể gửi cảnh báo
                    if (product.Status == ProductStatus.OutOfStock)
                    {
                        product.Status = ProductStatus.Active;
                    }
                }
                else if (product.Status == ProductStatus.OutOfStock)
                {
                    product.Status = ProductStatus.Active;
                }
                
                // Chỉ cập nhật nếu trạng thái thay đổi
                if (oldStatus != product.Status)
                {
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    _logger.LogInformation("Đã cập nhật trạng thái sản phẩm {ProductId} từ {OldStatus} thành {NewStatus}", 
                        productId, oldStatus, product.Status);
                    
                    // Nếu sản phẩm hết hàng, vô hiệu hóa các mã giảm giá liên quan
                    if (product.Status == ProductStatus.OutOfStock)
                    {
                        await DisableCouponsForOutOfStockProductAsync(productId);
                    }
                    else if (oldStatus == ProductStatus.OutOfStock && product.Status == ProductStatus.Active)
                    {
                        await ReactivateCouponsForProductAsync(productId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật trạng thái sản phẩm {ProductId} dựa trên tồn kho", productId);
                throw;
            }
        }

        /// <summary>
        /// Cập nhật trạng thái cho tất cả các sản phẩm dựa trên tồn kho
        /// </summary>
        public async Task UpdateAllProductStatusesBasedOnInventoryAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                foreach (var product in products)
                {
                    await UpdateProductStatusBasedOnInventoryAsync(product.Id);
                }
                
                _logger.LogInformation("Đã cập nhật trạng thái cho tất cả các sản phẩm dựa trên tồn kho");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật trạng thái cho tất cả các sản phẩm dựa trên tồn kho");
                throw;
            }
        }

        /// <summary>
        /// Lấy thông tin sản phẩm và kho hàng
        /// </summary>
        public async Task<ProductWithInventoryViewModel> GetProductWithInventoryAsync(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    return new ProductWithInventoryViewModel();
                }

                // Lấy lịch sử giao dịch kho
                var transactions = await _inventoryService.GetProductTransactionHistoryAsync(productId);
                
                // Lấy các mã giảm giá đang áp dụng cho sản phẩm
                var coupons = await _couponService.GetProductCouponsAsync(productId);
                
                // Lấy thông tin biến thể
                var variants = await _unitOfWork.ProductVariants.FindAsync(v => v.ProductId == productId);
                var variantInventories = new List<ProductVariantInventory>();
                
                foreach (var variant in variants)
                {
                    var lastRestockTx = transactions
                        .Where(t => t.ProductVariantId == variant.Id && t.Quantity > 0)
                        .OrderByDescending(t => t.TransactionDate)
                        .FirstOrDefault();
                    
                    variantInventories.Add(new ProductVariantInventory
                    {
                        Variant = variant,
                        CurrentStock = variant.StockQuantity,
                        CostPrice = variant.CostPrice,
                        IsLowStock = variant.StockQuantity <= variant.MinimumStockLevel && variant.StockQuantity > 0,
                        IsOutOfStock = variant.StockQuantity <= 0,
                        LastRestockDate = lastRestockTx?.TransactionDate
                    });
                }
                
                // Tính toán các chỉ số
                var lastRestockTransaction = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Purchase)
                    .OrderByDescending(t => t.TransactionDate)
                    .FirstOrDefault();

                // Tính toán số ngày kể từ lần nhập hàng đầu tiên
                int daysInStock = 0;
                if (product.FirstStockDate != default)
                {
                    daysInStock = (DateTime.UtcNow - product.FirstStockDate).Days;
                }

                // Tính toán lượng bán trung bình mỗi ngày
                double averageDailySales = 0;
                if (daysInStock > 0)
                {
                    var totalSold = transactions
                        .Where(t => t.TransactionType == InventoryTransactionType.Sale)
                        .Sum(t => -t.Quantity); // Đổi dấu vì giao dịch bán có số lượng âm

                    averageDailySales = (double)totalSold / daysInStock;
                }

                // Ước tính số ngày còn lại trước khi hết hàng
                int estimatedDaysToOutOfStock = 999; // Giá trị mặc định cao
                if (averageDailySales > 0)
                {
                    estimatedDaysToOutOfStock = (int)Math.Ceiling(product.StockQuantity / averageDailySales);
                }

                // Tính toán số lượng đề xuất nhập thêm
                int suggestedReorderQuantity = 0;
                if (product.StockQuantity <= product.MinimumStockLevel)
                {
                    // Dựa trên lượng bán trong 30 ngày tiếp theo hoặc tối thiểu để đạt mức tồn kho tối ưu
                    suggestedReorderQuantity = Math.Max(
                        (int)(averageDailySales * 30) - product.StockQuantity,
                        product.OptimalStockLevel - product.StockQuantity
                    );
                }

                var viewModel = new ProductWithInventoryViewModel
                {
                    Product = product,
                    InventoryTransactions = transactions.ToList(),
                    AppliedCoupons = coupons.ToList(),
                    CurrentStock = product.StockQuantity,
                    TotalCost = product.CostPrice * product.StockQuantity,
                    ReorderPoint = product.MinimumStockLevel,
                    LastRestock = lastRestockTransaction?.TransactionDate,
                    AverageCostPrice = product.CostPrice,
                    OptimalStockLevel = product.OptimalStockLevel,
                    SuggestedReorderQuantity = suggestedReorderQuantity,
                    DaysInStock = daysInStock,
                    AverageDailySales = averageDailySales,
                    EstimatedDaysToOutOfStock = estimatedDaysToOutOfStock,
                    Variants = variantInventories
                };

                return viewModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin sản phẩm và kho hàng cho sản phẩm {ProductId}", productId);
                throw;
            }
        }

        /// <summary>
        /// Lấy danh sách sản phẩm với thông tin kho hàng
        /// </summary>
        public async Task<IEnumerable<ProductWithInventoryViewModel>> GetAllProductsWithInventoryAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var result = new List<ProductWithInventoryViewModel>();
                
                foreach (var product in products)
                {
                    var productViewModel = await GetProductWithInventoryAsync(product.Id);
                    result.Add(productViewModel);
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách sản phẩm với thông tin kho hàng");
                throw;
            }
        }

        /// <summary>
        /// Đồng bộ hóa thông tin tồn kho và trạng thái sản phẩm
        /// </summary>
        public async Task SyncProductWithInventoryAsync(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    _logger.LogWarning("Không tìm thấy sản phẩm có ID {ProductId}", productId);
                    return;
                }
                
                // Lấy tổng số lượng từ các giao dịch
                var transactions = await _inventoryService.GetProductTransactionHistoryAsync(productId);
                int calculatedStock = transactions.Sum(t => t.Quantity);
                
                // Cập nhật lại tồn kho nếu có sai lệch
                if (product.StockQuantity != calculatedStock)
                {
                    product.StockQuantity = calculatedStock;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    _logger.LogInformation("Đã đồng bộ hóa tồn kho cho sản phẩm {ProductId}: {Stock}", 
                        productId, calculatedStock);
                }
                
                // Cập nhật trạng thái sản phẩm dựa trên tồn kho mới
                await UpdateProductStatusBasedOnInventoryAsync(productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đồng bộ hóa thông tin tồn kho và trạng thái sản phẩm {ProductId}", productId);
                throw;
            }
        }

        /// <summary>
        /// Cập nhật thông tin tồn kho cho nhiều sản phẩm cùng lúc
        /// </summary>
        public async Task BatchUpdateInventoryAsync(List<InventoryUpdateItem> updates)
        {
            try
            {
                foreach (var update in updates)
                {
                    var product = await _unitOfWork.Products.GetByIdAsync(update.ProductId);
                    if (product == null)
                    {
                        _logger.LogWarning("Không tìm thấy sản phẩm có ID {ProductId}", update.ProductId);
                        continue;
                    }
                    
                    // Tính chênh lệch số lượng để tạo giao dịch phù hợp
                    int quantityDifference = update.NewQuantity - product.StockQuantity;
                    
                    if (quantityDifference != 0)
                    {
                        // Nếu tăng số lượng, tạo giao dịch nhập kho
                        if (quantityDifference > 0)
                        {
                            decimal costPrice = update.NewCostPrice ?? product.CostPrice;
                            
                            await _inventoryService.AddStockAsync(
                                update.ProductId,
                                quantityDifference,
                                costPrice,
                                notes: update.Reason);
                        }
                        // Nếu giảm số lượng, tạo giao dịch điều chỉnh kho
                        else
                        {
                            await _inventoryService.AdjustStockAsync(
                                update.ProductId,
                                update.NewQuantity,
                                update.Reason);
                        }
                    }
                    
                    // Nếu cập nhật giá vốn mà không thay đổi số lượng
                    if (quantityDifference == 0 && update.NewCostPrice.HasValue && update.NewCostPrice != product.CostPrice)
                    {
                        product.CostPrice = update.NewCostPrice.Value;
                        await _unitOfWork.Products.UpdateAsync(product);
                    }
                }
                
                await _unitOfWork.CompleteAsync();
                
                // Cập nhật trạng thái sản phẩm dựa trên tồn kho mới
                foreach (var update in updates)
                {
                    await UpdateProductStatusBasedOnInventoryAsync(update.ProductId);
                }
                
                _logger.LogInformation("Đã cập nhật thông tin tồn kho cho {Count} sản phẩm", updates.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật thông tin tồn kho hàng loạt");
                throw;
            }
        }

        /// <summary>
        /// Tính toán giá vốn mới dựa trên phương pháp bình quân gia quyền
        /// </summary>
        public async Task<decimal> CalculateWeightedAverageCostAsync(int productId, int newQuantity, decimal newCost)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");
                }
                
                // Nếu sản phẩm chưa có tồn kho, sử dụng giá mới
                if (product.StockQuantity == 0)
                {
                    return newCost;
                }
                
                // Tính giá vốn bình quân gia quyền
                decimal totalValue = (product.StockQuantity * product.CostPrice) + (newQuantity * newCost);
                int totalQuantity = product.StockQuantity + newQuantity;
                
                if (totalQuantity == 0)
                {
                    return product.CostPrice; // Giữ nguyên giá vốn nếu không còn hàng
                }
                
                decimal weightedAverageCost = totalValue / totalQuantity;
                
                return weightedAverageCost;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tính toán giá vốn bình quân gia quyền cho sản phẩm {ProductId}", productId);
                throw;
            }
        }

        /// <summary>
        /// Lấy danh sách sản phẩm cần nhập hàng
        /// </summary>
        public async Task<IEnumerable<Core.Interfaces.ProductReorderSuggestion>> GetProductsForReorderAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var result = new List<Core.Interfaces.ProductReorderSuggestion>();
                
                foreach (var product in products)
                {
                    // Chỉ quan tâm đến sản phẩm có số lượng dưới mức tối thiểu
                    if (product.StockQuantity <= product.MinimumStockLevel && product.Status != ProductStatus.Discontinued)
                    {
                        var productInventory = await GetProductWithInventoryAsync(product.Id);
                        
                        var suggestion = new Core.Interfaces.ProductReorderSuggestion
                        {
                            Product = product,
                            CurrentStock = product.StockQuantity,
                            ReorderPoint = product.MinimumStockLevel,
                            OptimalQuantity = product.OptimalStockLevel,
                            SuggestedOrderQuantity = productInventory.SuggestedReorderQuantity,
                            EstimatedCost = productInventory.SuggestedReorderQuantity * product.CostPrice,
                            LastRestockDate = productInventory.LastRestock ?? DateTime.MinValue,
                            DaysToOutOfStock = productInventory.EstimatedDaysToOutOfStock,
                            AverageDailySales = (int)Math.Ceiling(productInventory.AverageDailySales)
                        };
                        
                        result.Add(suggestion);
                    }
                }
                
                // Sắp xếp theo mức độ ưu tiên: hết hàng trước, sắp hết hàng sau
                return result.OrderBy(p => p.CurrentStock).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách sản phẩm cần nhập hàng");
                throw;
            }
        }
        
        /// <summary>
        /// Cảnh báo tồn kho thấp
        /// </summary>
        public async Task<IEnumerable<Core.Interfaces.LowStockAlert>> GetLowStockAlertsAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var alerts = new List<Core.Interfaces.LowStockAlert>();
                
                foreach (var product in products)
                {
                    if (product.StockQuantity <= 0 && product.Status != ProductStatus.Discontinued)
                    {
                        alerts.Add(new Core.Interfaces.LowStockAlert
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            SKU = product.Sku ?? "",
                            CurrentStock = product.StockQuantity,
                            MinimumStockLevel = product.MinimumStockLevel,
                            OptimalStockLevel = product.OptimalStockLevel,
                            AlertType = "OutOfStock",
                            LastUpdated = product.LastStockUpdateDate
                        });
                    }
                    else if (product.StockQuantity <= product.MinimumStockLevel / 2 && product.Status != ProductStatus.Discontinued)
                    {
                        alerts.Add(new Core.Interfaces.LowStockAlert
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            SKU = product.Sku ?? "",
                            CurrentStock = product.StockQuantity,
                            MinimumStockLevel = product.MinimumStockLevel,
                            OptimalStockLevel = product.OptimalStockLevel,
                            AlertType = "Critical",
                            LastUpdated = product.LastStockUpdateDate
                        });
                    }
                    else if (product.StockQuantity <= product.MinimumStockLevel && product.Status != ProductStatus.Discontinued)
                    {
                        alerts.Add(new Core.Interfaces.LowStockAlert
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            SKU = product.Sku ?? "",
                            CurrentStock = product.StockQuantity,
                            MinimumStockLevel = product.MinimumStockLevel,
                            OptimalStockLevel = product.OptimalStockLevel,
                            AlertType = "Low",
                            LastUpdated = product.LastStockUpdateDate
                        });
                    }
                }
                
                return alerts.OrderBy(a => 
                    a.AlertType == "OutOfStock" ? 0 : 
                    a.AlertType == "Critical" ? 1 : 2
                ).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy cảnh báo tồn kho thấp");
                throw;
            }
        }

        /// <summary>
        /// Đồng bộ tồn kho từ các biến thể sản phẩm với sản phẩm chính
        /// </summary>
        public async Task SyncProductStockFromVariantsAsync(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    _logger.LogWarning("Không tìm thấy sản phẩm có ID {ProductId}", productId);
                    return;
                }
                
                var variants = await _unitOfWork.ProductVariants.FindAsync(v => v.ProductId == productId);
                
                // Tính tổng tồn kho từ tất cả các biến thể
                int totalStock = variants.Sum(v => v.StockQuantity);
                
                // Cập nhật tồn kho cho sản phẩm chính
                if (product.StockQuantity != totalStock)
                {
                    product.StockQuantity = totalStock;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    _logger.LogInformation("Đã đồng bộ tồn kho từ các biến thể cho sản phẩm {ProductId}: {Stock}", 
                        productId, totalStock);
                }
                
                // Cập nhật trạng thái sản phẩm dựa trên tồn kho mới
                await UpdateProductStatusBasedOnInventoryAsync(productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đồng bộ tồn kho từ các biến thể sản phẩm {ProductId}", productId);
                throw;
            }
        }

        /// <summary>
        /// Vô hiệu hóa mã giảm giá cho sản phẩm hết hàng
        /// </summary>
        private async Task DisableCouponsForOutOfStockProductAsync(int productId)
        {
            try
            {
                // Lấy các mã giảm giá áp dụng cho sản phẩm này
                var coupons = await _couponService.GetProductCouponsAsync(productId);
                
                foreach (var coupon in coupons)
                {
                    // Lấy danh sách sản phẩm áp dụng mã giảm giá này
                    var products = await _couponService.GetProductsWithCouponAsync(coupon.Id);
                    
                    // Nếu mã chỉ áp dụng cho sản phẩm này, vô hiệu hóa mã
                    if (products.Count() == 1 && products.First().Id == productId)
                    {
                        await _couponService.DeactivateCouponAsync(coupon.Id);
                        _logger.LogInformation("Đã vô hiệu hóa mã giảm giá {CouponCode} do sản phẩm {ProductId} hết hàng", 
                            coupon.Code, productId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi vô hiệu hóa mã giảm giá cho sản phẩm hết hàng {ProductId}", productId);
            }
        }

        /// <summary>
        /// Kích hoạt lại mã giảm giá khi sản phẩm có hàng trở lại
        /// </summary>
        private async Task ReactivateCouponsForProductAsync(int productId)
        {
            try
            {
                // Lấy các mã giảm giá áp dụng cho sản phẩm này (bao gồm cả đang không active)
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                
                foreach (var couponProduct in couponProducts)
                {
                    var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponProduct.CouponId);
                    
                    // Chỉ kích hoạt lại nếu mã giảm giá đang không active nhưng vẫn còn thời hạn
                    if (coupon != null && !coupon.IsActive && coupon.EndDate >= DateTime.UtcNow)
                    {
                        // Kiểm tra xem tất cả các sản phẩm liên quan đến mã này đều còn hàng
                        var relatedProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == coupon.Id);
                        bool allProductsInStock = true;
                        
                        foreach (var relatedCouponProduct in relatedProducts)
                        {
                            var relatedProduct = await _unitOfWork.Products.GetByIdAsync(relatedCouponProduct.ProductId);
                            if (relatedProduct == null || relatedProduct.StockQuantity <= 0)
                            {
                                allProductsInStock = false;
                                break;
                            }
                        }
                        
                        // Nếu tất cả sản phẩm liên quan đều còn hàng, kích hoạt lại mã giảm giá
                        if (allProductsInStock)
                        {
                            coupon.IsActive = true;
                            coupon.UpdatedAt = DateTime.UtcNow;
                            await _unitOfWork.Coupons.UpdateAsync(coupon);
                            await _unitOfWork.CompleteAsync();
                            
                            _logger.LogInformation("Đã kích hoạt lại mã giảm giá {CouponCode} do sản phẩm {ProductId} có hàng trở lại", 
                                coupon.Code, productId);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi kích hoạt lại mã giảm giá cho sản phẩm {ProductId}", productId);
            }
        }
    }
}
