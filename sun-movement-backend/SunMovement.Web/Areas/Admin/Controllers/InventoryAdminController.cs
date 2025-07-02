using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using SunMovement.Web.Areas.Admin.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class InventoryAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInventoryService _inventoryService;
        private readonly IProductInventoryService _productInventoryService;
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<InventoryAdminController> _logger;

        public InventoryAdminController(
            IUnitOfWork unitOfWork, 
            IInventoryService inventoryService,
            IProductInventoryService productInventoryService,
            IAnalyticsService analyticsService,
            ILogger<InventoryAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _inventoryService = inventoryService;
            _productInventoryService = productInventoryService;
            _analyticsService = analyticsService;
            _logger = logger;
        }

        // GET: Admin/InventoryAdmin
        public async Task<IActionResult> Index(int page = 1, int pageSize = 10, string searchTerm = "", InventoryTransactionType? transactionType = null)
        {
            try
            {
                var transactionsQuery = await _unitOfWork.InventoryTransactions.GetAllWithDetailsAsync();
                
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    transactionsQuery = transactionsQuery.Where(t => 
                        (t.Product != null && t.Product.Name != null && t.Product.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) ||
                        (t.Notes != null && t.Notes.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)));
                }

                if (transactionType.HasValue)
                {
                    transactionsQuery = transactionsQuery.Where(t => t.TransactionType == transactionType.Value);
                }

                var totalCount = transactionsQuery.Count();
                var transactions = transactionsQuery
                    .OrderByDescending(t => t.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                ViewBag.CurrentPage = page;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
                ViewBag.SearchTerm = searchTerm;
                ViewBag.SelectedTransactionType = transactionType;
                ViewBag.TotalCount = totalCount;
                ViewBag.TransactionTypes = Enum.GetValues<InventoryTransactionType>()
                    .Select(t => new SelectListItem
                    {
                        Value = ((int)t).ToString(),
                        Text = GetTransactionTypeDisplayName(t),
                        Selected = transactionType == t
                    });

                return View(transactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading inventory transactions");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải danh sách giao dịch kho.";
                return View(new List<InventoryTransaction>());
            }
        }

        // GET: Admin/InventoryAdmin/StockIn
        public async Task<IActionResult> StockIn()
        {
            try
            {
                await LoadProductsAndSuppliersToViewBag();
                return View(new InventoryTransaction { TransactionType = InventoryTransactionType.Purchase });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading stock in form");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải form nhập kho.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/InventoryAdmin/StockIn
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StockIn(InventoryTransaction transaction)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    transaction.TransactionType = InventoryTransactionType.Purchase;
                    transaction.TransactionDate = DateTime.Now;

                    var result = await _inventoryService.AddStockAsync(
                        transaction.ProductId,
                        transaction.Quantity,
                        transaction.UnitPrice,
                        transaction.SupplierId,
                        transaction.ReferenceNumber ?? string.Empty,
                        transaction.Notes ?? string.Empty);

                    // Success if transaction was created
                    TempData["SuccessMessage"] = "Nhập kho thành công!";
                    return RedirectToAction(nameof(Index));
                }

                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing stock in");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi nhập kho.";
                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
        }

        // GET: Admin/InventoryAdmin/StockOut
        public async Task<IActionResult> StockOut()
        {
            try
            {
                await LoadProductsAndSuppliersToViewBag();
                return View(new InventoryTransaction { TransactionType = InventoryTransactionType.Sale });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading stock out form");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải form xuất kho.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/InventoryAdmin/StockOut
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StockOut(InventoryTransaction transaction)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    transaction.TransactionType = InventoryTransactionType.Sale;
                    transaction.TransactionDate = DateTime.Now;

                    var result = await _inventoryService.RecordStockOutAsync(
                        transaction.ProductId,
                        transaction.Quantity,
                        transaction.Notes ?? string.Empty);

                    if (result.Success)
                    {
                        TempData["SuccessMessage"] = "Xuất kho thành công!";
                        return RedirectToAction(nameof(Index));
                    }
                    else
                    {
                        TempData["ErrorMessage"] = result.Message;
                    }
                }

                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing stock out");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi xuất kho.";
                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
        }

        // GET: Admin/InventoryAdmin/Adjustment
        public async Task<IActionResult> Adjustment()
        {
            try
            {
                await LoadProductsAndSuppliersToViewBag();
                return View(new InventoryTransaction { TransactionType = InventoryTransactionType.Adjustment });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading adjustment form");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải form điều chỉnh kho.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/InventoryAdmin/Adjustment
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Adjustment(InventoryTransaction transaction)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    transaction.TransactionType = InventoryTransactionType.Adjustment;
                    transaction.TransactionDate = DateTime.Now;

                    var result = await _inventoryService.RecordStockAdjustmentAsync(
                        transaction.ProductId,
                        transaction.Quantity,
                        transaction.Notes ?? string.Empty);

                    if (result.Success)
                    {
                        TempData["SuccessMessage"] = "Điều chỉnh kho thành công!";
                        return RedirectToAction(nameof(Index));
                    }
                    else
                    {
                        TempData["ErrorMessage"] = result.Message;
                    }
                }

                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing stock adjustment");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi điều chỉnh kho.";
                await LoadProductsAndSuppliersToViewBag();
                return View(transaction);
            }
        }

        // GET: Admin/InventoryAdmin/LowStock
        public async Task<IActionResult> LowStock()
        {
            try
            {
                var lowStockProducts = await _inventoryService.GetLowStockProductsAsync();
                return View(lowStockProducts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading low stock products");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải danh sách sản phẩm sắp hết hàng.";
                return View(new List<Product>());
            }
        }

        // GET: Admin/InventoryAdmin/ReorderSuggestions
        public async Task<IActionResult> ReorderSuggestions()
        {
            try
            {
                var suggestions = await _inventoryService.GetReorderSuggestionsAsync();
                return View(suggestions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading reorder suggestions");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải đề xuất đặt hàng.";
                return View(new List<dynamic>());
            }
        }

        // GET: Admin/InventoryAdmin/ProfitReport
        public async Task<IActionResult> ProfitReport(DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                fromDate ??= DateTime.Now.AddMonths(-1);
                toDate ??= DateTime.Now;

                var profitData = await _inventoryService.CalculateProfitAsync(fromDate.Value, toDate.Value);
                
                ViewBag.FromDate = fromDate.Value.ToString("yyyy-MM-dd");
                ViewBag.ToDate = toDate.Value.ToString("yyyy-MM-dd");
                
                return View(profitData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading profit report");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải báo cáo lợi nhuận.";
                return View();
            }
        }

        // GET: Admin/InventoryAdmin/GetProductStock
        [HttpGet]
        public async Task<IActionResult> GetProductStock(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy sản phẩm." });
                }

                return Json(new { 
                    success = true, 
                    stock = product.StockQuantity,
                    costPrice = product.CostPrice,
                    minStock = product.MinimumStockLevel,
                    optimalStock = product.OptimalStockLevel
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product stock: {ProductId}", productId);
                return Json(new { success = false, message = "Có lỗi xảy ra khi lấy thông tin tồn kho." });
            }
        }

        // GET: Admin/InventoryAdmin/Insights
        public async Task<IActionResult> Insights()
        {
            try
            {
                // Get enhanced inventory insights directly from the stub service
                var viewModel = await _analyticsService.GetInventoryInsightsAsync();
                
                // If needed, we can still get additional data from the product inventory service
                var lowStockAlerts = await _productInventoryService.GetLowStockAlertsAsync();
                var reorderSuggestions = await _productInventoryService.GetProductsForReorderAsync();
                
                // Use the view model directly since it's already of the correct type
                if (viewModel is Core.ViewModels.InventoryInsightsViewModel modelWithInsights)
                {
                    // Just update the low stock alerts and reorder suggestions from the product inventory service
                    modelWithInsights.LowStockAlerts = lowStockAlerts.Select(alert => new Core.ViewModels.LowStockAlert
                    {
                        ProductId = alert.ProductId,
                        ProductName = alert.ProductName,
                        SKU = alert.SKU,
                        CurrentStock = alert.CurrentStock,
                        MinimumStockLevel = alert.MinimumStockLevel,
                        ReorderPoint = alert.MinimumStockLevel + 5, // Estimated reorder point
                        LastRestock = alert.LastUpdated
                    }).ToList();

                    modelWithInsights.ReorderSuggestions = reorderSuggestions.Select(suggestion => new Core.ViewModels.ProductReorderSuggestion
                    {
                        ProductId = suggestion.Product.Id,
                        ProductName = suggestion.Product.Name,
                        SKU = suggestion.Product.Sku ?? string.Empty,
                        CurrentStock = suggestion.CurrentStock,
                        SuggestedReorderQuantity = suggestion.SuggestedOrderQuantity,
                        EstimatedCost = suggestion.EstimatedCost,
                        OptimalReorderDate = DateTime.Now.AddDays(Math.Max(1, suggestion.DaysToOutOfStock - 5)),
                        AverageDailySales = suggestion.AverageDailySales,
                        DaysUntilStockout = suggestion.DaysToOutOfStock
                    }).ToList();
                    
                    return View(modelWithInsights);
                }
                
                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading inventory insights");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải phân tích tồn kho.";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/InventoryAdmin/BatchUpdateInventory
        public async Task<IActionResult> BatchUpdateInventory()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var model = new BatchInventoryUpdateViewModel();
                model.Products = products.Where(p => p.TrackInventory).ToList();
                
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading batch inventory update form");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải form cập nhật hàng loạt.";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // POST: Admin/InventoryAdmin/BatchUpdateInventory
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BatchUpdateInventory(BatchInventoryUpdateViewModel model)
        {
            try
            {
                if (ModelState.IsValid && model.Updates != null && model.Updates.Any())
                {
                    // Convert view model to domain model
                    var updates = model.Updates.Select(u => new Core.Interfaces.InventoryUpdateItem
                    {
                        ProductId = u.ProductId,
                        NewQuantity = u.NewQuantity,
                        NewCostPrice = u.NewCostPrice,
                        Reason = u.Reason
                    }).ToList();
                    
                    // Use product inventory service to batch update
                    await _productInventoryService.BatchUpdateInventoryAsync(updates);
                    
                    TempData["SuccessMessage"] = "Cập nhật hàng loạt thành công.";
                    return RedirectToAction(nameof(Index));
                }
                
                // If we got this far, something failed, redisplay form
                var products = await _unitOfWork.Products.GetAllAsync();
                model.Products = products.Where(p => p.TrackInventory).ToList();
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing batch inventory update");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi cập nhật hàng loạt.";
                
                var products = await _unitOfWork.Products.GetAllAsync();
                model.Products = products.Where(p => p.TrackInventory).ToList();
                return View(model);
            }
        }

        // Helper Methods
        private async Task LoadProductsAndSuppliersToViewBag()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            var suppliers = await _unitOfWork.Suppliers.GetActiveAsync();

            ViewBag.Products = products.Select(p => new SelectListItem
            {
                Value = p.Id.ToString(),
                Text = $"{p.Name} (Tồn: {p.StockQuantity})"
            });

            ViewBag.Suppliers = suppliers.Select(s => new SelectListItem
            {
                Value = s.Id.ToString(),
                Text = s.Name
            });
        }

        private string GetTransactionTypeDisplayName(InventoryTransactionType type)
        {
            return type switch
            {
                InventoryTransactionType.Purchase => "Nhập kho",
                InventoryTransactionType.Sale => "Bán hàng",
                InventoryTransactionType.Return => "Trả hàng",
                InventoryTransactionType.Adjustment => "Điều chỉnh",
                InventoryTransactionType.Transfer => "Chuyển kho",
                _ => type.ToString()
            };
        }
    }
}
