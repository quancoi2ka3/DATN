using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<InventoryService> _logger;

        public InventoryService(IUnitOfWork unitOfWork, ILogger<InventoryService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<InventoryTransaction> AddStockAsync(int productId, int quantity, decimal unitCost, int? supplierId = null, string referenceNumber = "", string notes = "")
        {
            if (quantity <= 0)
                throw new ArgumentException("Số lượng phải lớn hơn 0", nameof(quantity));

            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");

            // TÙYCHỌN: Tính giá vốn trung bình theo phương pháp bình quân gia quyền
            // Comment dòng này nếu muốn giữ nguyên giá vốn ban đầu
            await RecalculateAverageCostWithNewStock(product, quantity, unitCost);
            
            // TÙYCHỌN: Hoặc cập nhật giá vốn bằng giá nhập mới nhất
            // product.CostPrice = unitCost;

            // Cập nhật số lượng tồn kho
            product.StockQuantity += quantity;
            product.LastStockUpdateDate = DateTime.UtcNow;
            
            if (product.FirstStockDate == default)
                product.FirstStockDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);

            // Tạo giao dịch nhập kho
            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                TransactionType = InventoryTransactionType.Purchase,
                Quantity = quantity,
                UnitPrice = unitCost,
                SupplierId = supplierId,
                ReferenceNumber = referenceNumber,
                Notes = notes,
                CreatedBy = "Admin", // TODO: Lấy từ current user
                TransactionDate = DateTime.UtcNow
            };

            await _unitOfWork.InventoryTransactions.AddAsync(transaction);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã nhập {Quantity} {ProductName} với giá {UnitCost}", 
                quantity, product.Name, unitCost);

            return transaction;
        }

        public async Task<InventoryTransaction> ReduceStockAsync(int productId, int quantity, string referenceNumber = "", string notes = "")
        {
            if (quantity <= 0)
                throw new ArgumentException("Số lượng phải lớn hơn 0", nameof(quantity));

            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");

            if (product.StockQuantity < quantity)
                throw new InvalidOperationException($"Không đủ hàng tồn kho. Hiện có: {product.StockQuantity}, cần: {quantity}");

            // Cập nhật số lượng tồn kho
            product.StockQuantity -= quantity;
            product.LastStockUpdateDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);

            // Tạo giao dịch xuất kho
            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                TransactionType = InventoryTransactionType.Sale,
                Quantity = -quantity, // Số âm để biểu thị xuất kho
                UnitPrice = product.CostPrice,
                ReferenceNumber = referenceNumber,
                Notes = notes,
                CreatedBy = "System",
                TransactionDate = DateTime.UtcNow
            };

            await _unitOfWork.InventoryTransactions.AddAsync(transaction);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã xuất {Quantity} {ProductName}", quantity, product.Name);

            return transaction;
        }

        public async Task<InventoryTransaction> AdjustStockAsync(int productId, int newQuantity, string reason = "")
        {
            if (newQuantity < 0)
                throw new ArgumentException("Số lượng không thể âm", nameof(newQuantity));

            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");

            int adjustment = newQuantity - product.StockQuantity;
            
            if (adjustment == 0)
                return new InventoryTransaction(); // Trả về một đối tượng rỗng khi không có thay đổi

            // Cập nhật số lượng tồn kho
            product.StockQuantity = newQuantity;
            product.LastStockUpdateDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);

            // Tạo giao dịch điều chỉnh
            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                TransactionType = InventoryTransactionType.Adjustment,
                Quantity = adjustment,
                UnitPrice = product.CostPrice,
                Notes = $"Điều chỉnh kho: {reason}",
                CreatedBy = "Admin",
                TransactionDate = DateTime.UtcNow
            };

            await _unitOfWork.InventoryTransactions.AddAsync(transaction);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã điều chỉnh kho {ProductName} từ {OldQuantity} thành {NewQuantity}. Lý do: {Reason}", 
                product.Name, product.StockQuantity - adjustment, newQuantity, reason);

            return transaction;
        }

        public async Task<InventoryTransaction> ProcessReturnAsync(int productId, int quantity, int? orderId = null, string notes = "")
        {
            if (quantity <= 0)
                throw new ArgumentException("Số lượng phải lớn hơn 0", nameof(quantity));

            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                throw new ArgumentException($"Không tìm thấy sản phẩm có ID {productId}");

            // Cập nhật số lượng tồn kho
            product.StockQuantity += quantity;
            product.LastStockUpdateDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);

            // Tạo giao dịch trả hàng
            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                TransactionType = InventoryTransactionType.Return,
                Quantity = quantity,
                UnitPrice = product.CostPrice,
                OrderId = orderId,
                Notes = notes,
                CreatedBy = "System",
                TransactionDate = DateTime.UtcNow
            };

            await _unitOfWork.InventoryTransactions.AddAsync(transaction);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Đã xử lý trả hàng {Quantity} {ProductName}", quantity, product.Name);

            return transaction;
        }

        public async Task<IEnumerable<InventoryTransaction>> GetProductTransactionHistoryAsync(int productId)
        {
            return await _unitOfWork.InventoryTransactions.GetProductTransactionHistoryAsync(productId);
        }

        public async Task<IEnumerable<Product>> GetLowStockProductsAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return products.Where(p => p.IsActive && 
                                      p.MinimumStockLevel > 0 && 
                                      p.StockQuantity <= p.MinimumStockLevel);
        }

        public async Task<IEnumerable<Product>> GetOverstockProductsAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return products.Where(p => p.IsActive && 
                                      p.OptimalStockLevel > 0 && 
                                      p.StockQuantity > p.OptimalStockLevel * 1.5m); // 150% của mức tối ưu
        }

        public async Task<IEnumerable<Product>> GetAgedInventoryAsync(int daysThreshold = 90)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-daysThreshold);
            var products = await _unitOfWork.Products.GetAllAsync();
            return products.Where(p => p.IsActive && 
                                      p.StockQuantity > 0 && 
                                      p.LastStockUpdateDate <= cutoffDate);
        }

        public async Task<IEnumerable<Product>> GetOutOfStockProductsAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return products.Where(p => p.IsActive && p.StockQuantity == 0);
        }

        public async Task<decimal> GetTotalInventoryValueAsync()
        {
            return await _unitOfWork.InventoryTransactions.GetTotalInventoryValueAsync();
        }

        public async Task<Dictionary<string, decimal>> GetInventoryValueByCategoryAsync()
        {
            return await _unitOfWork.InventoryTransactions.GetInventoryValueByCategoryAsync();
        }

        public async Task<decimal> GetProductProfitMarginAsync(int productId)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null || product.CostPrice == 0)
                return 0;

            decimal sellingPrice = product.DiscountPrice ?? product.Price;
            return ((sellingPrice - product.CostPrice) / product.CostPrice) * 100;
        }

        public async Task<decimal> GetAverageProfitMarginAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            var activeProducts = products.Where(p => p.IsActive && p.CostPrice > 0).ToList();
            
            if (!activeProducts.Any())
                return 0;

            decimal totalMargin = 0;
            foreach (var product in activeProducts)
            {
                decimal sellingPrice = product.DiscountPrice ?? product.Price;
                decimal margin = ((sellingPrice - product.CostPrice) / product.CostPrice) * 100;
                totalMargin += margin;
            }

            return totalMargin / activeProducts.Count;
        }

        public async Task<IEnumerable<InventoryTransaction>> GetRecentTransactionsAsync(int count = 10)
        {
            return await _unitOfWork.InventoryTransactions.GetRecentTransactionsAsync(count);
        }

        public async Task<IEnumerable<Product>> GetProductsNeedingReorderAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            var needReorder = new List<Product>();

            foreach (var product in products.Where(p => p.IsActive))
            {
                if (await ShouldReorderProductAsync(product.Id))
                    needReorder.Add(product);
            }

            return needReorder;
        }

        public async Task<bool> ShouldReorderProductAsync(int productId)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null || !product.IsActive)
                return false;

            // Nếu có thiết lập ngưỡng tối thiểu thì so sánh với ngưỡng đó
            if (product.MinimumStockLevel > 0)
                return product.StockQuantity <= product.MinimumStockLevel;

            // Nếu không có ngưỡng, cảnh báo khi còn ít hơn 10% mức tối ưu
            if (product.OptimalStockLevel > 0)
                return product.StockQuantity <= product.OptimalStockLevel * 0.1m;

            // Mặc định cảnh báo khi hết hàng
            return product.StockQuantity == 0;
        }

        public async Task<int> CalculateOptimalOrderQuantityAsync(int productId)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                return 0;

            // Nếu có thiết lập mức tối ưu thì đặt hàng để đạt mức đó
            if (product.OptimalStockLevel > 0)
                return Math.Max(0, product.OptimalStockLevel - product.StockQuantity);

            // Nếu không có mức tối ưu, tính toán dựa trên lịch sử bán hàng
            // TODO: Implement logic phức tạp hơn dựa trên trend bán hàng
            
            // Tạm thời return số lượng để đạt 50 sản phẩm
            return Math.Max(0, 50 - product.StockQuantity);
        }

        public async Task UpdateLastStockDateAsync(int productId)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product != null)
            {
                product.LastStockUpdateDate = DateTime.UtcNow;
                await _unitOfWork.Products.UpdateAsync(product);
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task RecalculateAverageCostAsync(int productId)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
                return;

            // Lấy các giao dịch nhập hàng gần đây
            var transactions = await _unitOfWork.InventoryTransactions.GetProductTransactionHistoryAsync(productId);
            var purchaseTransactions = transactions
                .Where(t => t.TransactionType == InventoryTransactionType.Purchase)
                .OrderByDescending(t => t.TransactionDate)
                .Take(10) // 10 giao dịch gần nhất
                .ToList();

            if (purchaseTransactions.Any())
            {
                // Tính giá trung bình có trọng số
                decimal totalValue = 0;
                int totalQuantity = 0;

                foreach (var transaction in purchaseTransactions)
                {
                    totalValue += transaction.Quantity * transaction.UnitPrice;
                    totalQuantity += transaction.Quantity;
                }

                if (totalQuantity > 0)
                {
                    product.CostPrice = totalValue / totalQuantity;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                }
            }
        }

        private Task RecalculateAverageCostWithNewStock(Product product, int newQuantity, decimal newUnitCost)
        {
            decimal currentInventoryValue = product.StockQuantity * product.CostPrice;
            decimal newInventoryValue = currentInventoryValue + (newQuantity * newUnitCost);
            int totalQuantity = product.StockQuantity + newQuantity;

            if (totalQuantity > 0)
            {
                product.CostPrice = newInventoryValue / totalQuantity;
            }
            
            // No async operations, return completed task
            return Task.CompletedTask;
        }

        public Task<bool> AdjustStockAfterOrderAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        // Implement missing methods
        public async Task<dynamic> RecordStockOutAsync(int productId, int quantity, string notes = "")
        {
            try
            {
                if (quantity <= 0)
                    return new { Success = false, Message = "Số lượng phải lớn hơn 0" };

                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                    return new { Success = false, Message = $"Không tìm thấy sản phẩm có ID {productId}" };

                if (product.StockQuantity < quantity)
                    return new { Success = false, Message = $"Không đủ hàng tồn kho. Hiện có: {product.StockQuantity}, cần: {quantity}" };

                // Cập nhật số lượng tồn kho
                product.StockQuantity -= quantity;
                product.LastStockUpdateDate = DateTime.UtcNow;

                await _unitOfWork.Products.UpdateAsync(product);

                // Tạo giao dịch xuất kho
                var transaction = new InventoryTransaction
                {
                    ProductId = productId,
                    TransactionType = InventoryTransactionType.Sale,
                    Quantity = -quantity, // Số âm để biểu thị xuất kho
                    UnitPrice = product.CostPrice,
                    Notes = notes,
                    CreatedBy = "System", // TODO: Replace with current user
                    TransactionDate = DateTime.UtcNow
                };

                await _unitOfWork.InventoryTransactions.AddAsync(transaction);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Đã xuất {Quantity} {ProductName}", quantity, product.Name);

                return new { Success = true, Message = $"Đã xuất {quantity} {product.Name} thành công", Transaction = transaction };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RecordStockOutAsync");
                return new { Success = false, Message = $"Lỗi khi xuất kho: {ex.Message}" };
            }
        }

        public async Task<dynamic> RecordStockAdjustmentAsync(int productId, int quantity, string notes = "")
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                    return new { Success = false, Message = $"Không tìm thấy sản phẩm có ID {productId}" };

                int adjustment = quantity - product.StockQuantity;
                
                if (adjustment == 0)
                    return new { Success = true, Message = "Không có thay đổi", AdjustmentQuantity = 0 };

                // Cập nhật số lượng tồn kho
                product.StockQuantity = quantity;
                product.LastStockUpdateDate = DateTime.UtcNow;

                await _unitOfWork.Products.UpdateAsync(product);

                // Tạo giao dịch điều chỉnh
                var transaction = new InventoryTransaction
                {
                    ProductId = productId,
                    TransactionType = InventoryTransactionType.Adjustment,
                    Quantity = adjustment,
                    UnitPrice = product.CostPrice,
                    Notes = $"Điều chỉnh kho: {notes}",
                    CreatedBy = "Admin", // TODO: Replace with current user
                    TransactionDate = DateTime.UtcNow
                };

                await _unitOfWork.InventoryTransactions.AddAsync(transaction);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Đã điều chỉnh kho {ProductName} từ {OldQuantity} thành {NewQuantity}. Lý do: {Reason}", 
                    product.Name, product.StockQuantity - adjustment, quantity, notes);

                return new { 
                    Success = true, 
                    Message = $"Đã điều chỉnh kho {product.Name} từ {product.StockQuantity - adjustment} thành {quantity}", 
                    AdjustmentQuantity = adjustment,
                    Transaction = transaction
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RecordStockAdjustmentAsync");
                return new { Success = false, Message = $"Lỗi khi điều chỉnh kho: {ex.Message}" };
            }
        }

        public async Task<IEnumerable<dynamic>> GetReorderSuggestionsAsync()
        {
            try
            {
                var lowStockProducts = await GetLowStockProductsAsync();
                var suggestions = new List<dynamic>();
                
                foreach (var product in lowStockProducts)
                {
                    var optimalOrderQuantity = await CalculateOptimalOrderQuantityAsync(product.Id);
                    
                    // Instead of using PreferredSupplierId which doesn't exist, use the first supplier from ProductSuppliers
                    var preferredSupplier = product.ProductSuppliers?.FirstOrDefault();
                    var supplierInfo = preferredSupplier != null 
                        ? await _unitOfWork.Suppliers.GetByIdAsync(preferredSupplier.SupplierId)
                        : null;

                    suggestions.Add(new {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        CurrentStock = product.StockQuantity,
                        MinimumStock = product.MinimumStockLevel,
                        OptimalStock = product.OptimalStockLevel,
                        RecommendedOrderQuantity = optimalOrderQuantity,
                        PreferredSupplierId = preferredSupplier?.SupplierId,
                        PreferredSupplierName = supplierInfo?.Name,
                        EstimatedCost = optimalOrderQuantity * product.CostPrice,
                        LastOrderDate = await GetLastOrderDate(product.Id)
                    });
                }

                return suggestions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetReorderSuggestionsAsync");
                return new List<dynamic>();
            }
        }

        private async Task<DateTime?> GetLastOrderDate(int productId)
        {
            var lastPurchase = (await _unitOfWork.InventoryTransactions.FindAsync(t => 
                t.ProductId == productId && t.TransactionType == InventoryTransactionType.Purchase))
                .OrderByDescending(t => t.TransactionDate)
                .FirstOrDefault();
                
            return lastPurchase?.TransactionDate;
        }

        public async Task<dynamic> CalculateProfitAsync(DateTime fromDate, DateTime toDate)
        {
            try
            {
                // Lấy tất cả giao dịch trong khoảng thời gian
                var transactions = (await _unitOfWork.InventoryTransactions.GetAllWithDetailsAsync())
                    .Where(t => t.TransactionDate >= fromDate && t.TransactionDate <= toDate)
                    .ToList();

                // Giao dịch nhập kho
                var purchaseTransactions = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Purchase)
                    .ToList();

                // Giao dịch bán hàng
                var saleTransactions = transactions
                    .Where(t => t.TransactionType == InventoryTransactionType.Sale)
                    .ToList();

                // Tính tổng chi phí nhập hàng
                decimal totalPurchaseCost = purchaseTransactions.Sum(t => t.Quantity * t.UnitPrice);

                // Tính tổng doanh thu
                decimal totalRevenue = 0;
                foreach (var sale in saleTransactions)
                {
                    // Lấy giá bán thực tế từ đơn hàng
                    var orderItem = await GetOrderItemForTransaction(sale.Id);
                    if (orderItem != null)
                    {
                        totalRevenue += Math.Abs(sale.Quantity) * orderItem.UnitPrice;
                    }
                    else
                    {
                        // Nếu không tìm thấy đơn hàng, sử dụng giá bán mặc định của sản phẩm
                        var product = await _unitOfWork.Products.GetByIdAsync(sale.ProductId);
                        if (product != null)
                        {
                            totalRevenue += Math.Abs(sale.Quantity) * product.Price;
                        }
                    }
                }

                // Tính tổng chi phí vốn của hàng đã bán
                decimal totalCostOfGoodsSold = Math.Abs(saleTransactions.Sum(t => t.Quantity * t.UnitPrice));

                // Tính lợi nhuận
                decimal grossProfit = totalRevenue - totalCostOfGoodsSold;
                decimal netProfit = grossProfit - totalPurchaseCost;
                decimal profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

                // Tính thông tin theo sản phẩm
                var productProfitDetails = await CalculateProductProfitDetails(saleTransactions, fromDate, toDate);

                return new {
                    FromDate = fromDate,
                    ToDate = toDate,
                    TotalPurchaseCost = totalPurchaseCost,
                    TotalRevenue = totalRevenue,
                    TotalCostOfGoodsSold = totalCostOfGoodsSold,
                    GrossProfit = grossProfit,
                    NetProfit = netProfit,
                    ProfitMargin = profitMargin,
                    ProductProfitDetails = productProfitDetails
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CalculateProfitAsync");
                return new { 
                    Success = false,
                    Message = $"Lỗi khi tính toán lợi nhuận: {ex.Message}"
                };
            }
        }

        private async Task<OrderItem?> GetOrderItemForTransaction(int transactionId)
        {
            // Giả định: Transaction có một trường ReferenceNumber lưu OrderItemId
            var transaction = await _unitOfWork.InventoryTransactions.GetByIdAsync(transactionId);
            if (transaction == null || string.IsNullOrEmpty(transaction.ReferenceNumber))
                return null;

            if (int.TryParse(transaction.ReferenceNumber, out int orderItemId))
            {
                // Thực hiện tìm kiếm OrderItem bằng repository
                try 
                {
                    // Giả định: Có thêm phương thức GetOrderItemByIdAsync trong UnitOfWork
                    // Lấy OrderItem theo Id từ database
                    var orderItems = await _unitOfWork.OrderItems.FindAsync(oi => oi.Id == orderItemId);
                    return orderItems.FirstOrDefault();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error getting OrderItem for transaction {TransactionId}", transactionId);
                    return null;
                }
            }

            return null;
        }

        private async Task<IEnumerable<dynamic>> CalculateProductProfitDetails(
            List<InventoryTransaction> saleTransactions, DateTime fromDate, DateTime toDate)
        {
            var productProfits = new List<dynamic>();

            // Gộp các giao dịch theo sản phẩm
            var productGroups = saleTransactions.GroupBy(t => t.ProductId);

            foreach (var group in productGroups)
            {
                int productId = group.Key;
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                
                if (product == null) continue;

                // Tổng số lượng bán
                int totalQuantitySold = Math.Abs(group.Sum(t => t.Quantity));
                
                // Tổng chi phí vốn
                decimal totalCost = Math.Abs(group.Sum(t => t.Quantity * t.UnitPrice));
                
                // Tổng doanh thu (giá bán thực tế từ đơn hàng hoặc giá mặc định)
                decimal totalRevenue = totalQuantitySold * product.Price; // Giả sử sử dụng giá mặc định
                
                // Lợi nhuận
                decimal profit = totalRevenue - totalCost;
                decimal margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

                productProfits.Add(new {
                    ProductId = productId,
                    ProductName = product.Name,
                    QuantitySold = totalQuantitySold,
                    Revenue = totalRevenue,
                    Cost = totalCost,
                    Profit = profit,
                    ProfitMargin = margin
                });
            }

            return productProfits.OrderByDescending(p => ((dynamic)p).Profit);
        }

        // Integrated System Methods - Added for Product-Inventory Integration
        
        public async Task<IEnumerable<InventoryItem>> GetAvailableInventoryItemsAsync()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var inventoryItems = new List<InventoryItem>();

                foreach (var product in products.Where(p => p.IsActive && p.StockQuantity > 0))
                {
                    var lastTransaction = (await _unitOfWork.InventoryTransactions.FindAsync(t => 
                        t.ProductId == product.Id && t.TransactionType == InventoryTransactionType.Purchase))
                        .OrderByDescending(t => t.TransactionDate)
                        .FirstOrDefault();

                    var supplierInfo = lastTransaction?.Supplier ?? 
                        (product.ProductSuppliers?.FirstOrDefault() != null 
                            ? await _unitOfWork.Suppliers.GetByIdAsync(product.ProductSuppliers.First().SupplierId) 
                            : null);

                    inventoryItems.Add(new InventoryItem
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Sku = product.Sku ?? $"PROD-{product.Id:D6}",
                        Quantity = product.StockQuantity,
                        CostPrice = product.CostPrice,
                        SupplierId = supplierInfo?.Id ?? 0,
                        Supplier = supplierInfo,
                        ReceiptDate = lastTransaction?.TransactionDate ?? product.CreatedAt,
                        ExpiryDate = null, // Can be extended if needed
                        Location = "Main Warehouse", // Default location
                        Status = product.StockQuantity > 0 ? InventoryStatus.Available : InventoryStatus.Available,
                        Notes = $"Auto-generated from Product ID: {product.Id}",
                        CreatedAt = product.CreatedAt,
                        CreatedBy = "System"
                    });
                }

                return inventoryItems.OrderBy(i => i.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAvailableInventoryItemsAsync");
                return new List<InventoryItem>();
            }
        }

        public async Task<InventoryItem?> GetInventoryItemByIdAsync(int inventoryItemId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(inventoryItemId);
                if (product == null || !product.IsActive || product.StockQuantity <= 0)
                    return null;

                var lastTransaction = (await _unitOfWork.InventoryTransactions.FindAsync(t => 
                    t.ProductId == product.Id && t.TransactionType == InventoryTransactionType.Purchase))
                    .OrderByDescending(t => t.TransactionDate)
                    .FirstOrDefault();

                var supplierInfo = lastTransaction?.Supplier ?? 
                    (product.ProductSuppliers?.FirstOrDefault() != null 
                        ? await _unitOfWork.Suppliers.GetByIdAsync(product.ProductSuppliers.First().SupplierId) 
                        : null);

                return new InventoryItem
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Sku = product.Sku ?? $"PROD-{product.Id:D6}",
                    Quantity = product.StockQuantity,
                    CostPrice = product.CostPrice,
                    SupplierId = supplierInfo?.Id ?? 0,
                    Supplier = supplierInfo,
                    ReceiptDate = lastTransaction?.TransactionDate ?? product.CreatedAt,
                    ExpiryDate = null,
                    Location = "Main Warehouse",
                    Status = product.StockQuantity > 0 ? InventoryStatus.Available : InventoryStatus.Available,
                    Notes = $"Auto-generated from Product ID: {product.Id}",
                    CreatedAt = product.CreatedAt,
                    CreatedBy = "System"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetInventoryItemByIdAsync");
                return null;
            }
        }

        public async Task<bool> ReserveInventoryAsync(int inventoryItemId, int quantity)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(inventoryItemId);
                if (product == null || !product.IsActive)
                    return false;

                if (product.StockQuantity < quantity)
                    return false;

                // For now, we'll just check availability. 
                // In a more complex system, we might have a separate reservation table
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ReserveInventoryAsync");
                return false;
            }
        }

        public async Task<bool> ReleaseInventoryReservationAsync(int inventoryItemId, int quantity)
        {
            try
            {
                // For now, this is a placeholder
                // In a more complex system, we would release reservations from a reservation table
                await Task.CompletedTask;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ReleaseInventoryReservationAsync");
                return false;
            }
        }

        public async Task<bool> ConsumeInventoryAsync(int inventoryItemId, int quantity, string reason = "Product Creation")
        {
            try
            {
                var result = await RecordStockOutAsync(inventoryItemId, quantity, reason);
                return ((dynamic)result).Success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ConsumeInventoryAsync");
                return false;
            }
        }

        public async Task<IEnumerable<InventoryItem>> SearchInventoryItemsAsync(string searchTerm)
        {
            try
            {
                var allItems = await GetAvailableInventoryItemsAsync();
                
                if (string.IsNullOrWhiteSpace(searchTerm))
                    return allItems;

                searchTerm = searchTerm.ToLower();
                return allItems.Where(i => 
                    i.Name.ToLower().Contains(searchTerm) ||
                    i.Sku.ToLower().Contains(searchTerm) ||
                    (i.Description?.ToLower().Contains(searchTerm) ?? false)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchInventoryItemsAsync");
                return new List<InventoryItem>();
            }
        }

        // Additional integrated methods required by the interface
        
        public async Task<InventoryItem> GetInventoryItemDetailsAsync(int inventoryItemId)
        {
            var result = await GetInventoryItemByIdAsync(inventoryItemId);
            return result ?? new InventoryItem(); // Return empty object instead of null to match interface
        }

        public async Task<bool> TransferInventoryToProductAsync(int inventoryItemId, int productId, int quantity)
        {
            try
            {
                var inventoryItem = await GetInventoryItemByIdAsync(inventoryItemId);
                if (inventoryItem == null || inventoryItem.Quantity < quantity)
                    return false;

                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                    return false;

                // Record the transfer
                var result = await ConsumeInventoryAsync(inventoryItemId, quantity, $"Transfer to Product {productId}");
                if (result)
                {
                    // Update the target product's stock
                    product.StockQuantity += quantity;
                    product.LastStockUpdateDate = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TransferInventoryToProductAsync");
                return false;
            }
        }

        public async Task<bool> CanCreateProductFromInventoryAsync(int inventoryItemId, int requiredQuantity)
        {
            try
            {
                var inventoryItem = await GetInventoryItemByIdAsync(inventoryItemId);
                return inventoryItem != null && 
                       inventoryItem.IsAvailable && 
                       inventoryItem.Quantity >= requiredQuantity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CanCreateProductFromInventoryAsync");
                return false;
            }
        }

        public async Task<InventoryTransaction> CreateProductFromInventoryTransactionAsync(int inventoryItemId, int quantity, int targetProductId, string notes)
        {
            try
            {
                var inventoryItem = await GetInventoryItemByIdAsync(inventoryItemId);
                if (inventoryItem == null || inventoryItem.Quantity < quantity)
                    return new InventoryTransaction(); // Return empty object instead of null

                // Create the transaction record
                var transaction = new InventoryTransaction
                {
                    ProductId = targetProductId,
                    TransactionType = InventoryTransactionType.Adjustment,
                    Quantity = -quantity, // Negative for consumption
                    UnitPrice = inventoryItem.CostPrice,
                    Notes = notes,
                    CreatedBy = "System",
                    TransactionDate = DateTime.UtcNow
                };

                await _unitOfWork.InventoryTransactions.AddAsync(transaction);
                
                // Update inventory item quantity
                var product = await _unitOfWork.Products.GetByIdAsync(inventoryItemId);
                if (product != null)
                {
                    product.StockQuantity -= quantity;
                    product.LastStockUpdateDate = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                }

                await _unitOfWork.CompleteAsync();
                return transaction;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateProductFromInventoryTransactionAsync");
                return new InventoryTransaction(); // Return empty object instead of null
            }
        }
    }
}
