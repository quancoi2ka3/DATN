using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using SunMovement.Web.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using SunMovement.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using SunMovement.Web.Areas.Admin.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ProductsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;
        private readonly ICacheService _cacheService;
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;
        private readonly ICouponService _couponService;
        private readonly IProductInventoryService _productInventoryService;
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<ProductsAdminController> _logger;

        public ProductsAdminController(
            IUnitOfWork unitOfWork, 
            IFileUploadService fileUploadService, 
            ICacheService cacheService,
            IProductService productService,
            IInventoryService inventoryService,
            ICouponService couponService,
            IProductInventoryService productInventoryService,
            IAnalyticsService analyticsService,
            ILogger<ProductsAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
            _cacheService = cacheService;
            _productService = productService;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _productInventoryService = productInventoryService;
            _analyticsService = analyticsService;
            _logger = logger;
        }

        // GET: Admin/ProductsAdmin
        public async Task<IActionResult> Index(string searchString, ProductCategory? category, bool? isActive)
        {
            try
            {
                _logger.LogInformation("Loading ProductsAdmin Index page");
                var products = await _unitOfWork.Products.GetAllAsync();
                
                if (!string.IsNullOrEmpty(searchString))
                {
                    products = products.Where(p => 
                        p.Name.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        p.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        p.Sku != null && p.Sku.Contains(searchString, StringComparison.OrdinalIgnoreCase));
                }

                if (category.HasValue)
                {
                    products = products.Where(p => p.Category == category.Value);
                }

                if (isActive.HasValue)
                {
                    products = products.Where(p => p.IsActive == isActive.Value);
                }

                _logger.LogInformation($"Found {products.Count()} products");
                ViewBag.SearchString = searchString;
                ViewBag.Category = category;
                ViewBag.IsActive = isActive;
                
                return View(products.OrderByDescending(p => p.CreatedAt));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading products");
                TempData["ErrorMessage"] = "Có lỗi khi tải danh sách sản phẩm: " + ex.Message;
                return View(new List<Product>());
            }
        }

        // GET: Admin/ProductsAdmin/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                // Sử dụng ProductInventoryService để lấy thông tin đầy đủ về sản phẩm và kho hàng
                var productWithInventory = await _productInventoryService.GetProductWithInventoryAsync(id.Value);
                if (productWithInventory.Product == null)
                {
                    return NotFound();
                }

                // Load thông tin phân tích sản phẩm
                var today = DateTime.Today;
                var startOfMonth = new DateTime(today.Year, today.Month, 1);
                var productMetrics = await _analyticsService.GetProductMetricsAsync(id.Value, startOfMonth, today);
                
                // Thêm thông tin phân tích vào ProductWithInventoryViewModel
                productWithInventory.ViewCount = productMetrics.TotalViews;
                productWithInventory.CartAddCount = productMetrics.AddToCarts;
                productWithInventory.PurchaseCount = productMetrics.Purchases;
                productWithInventory.ConversionRate = productMetrics.ConversionRate;
                
                // Load related coupons
                productWithInventory.AppliedCoupons = (await _couponService.GetProductCouponsAsync(id.Value)).ToList();
                
                // Pass ViewBag for backward compatibility
                ViewBag.ProductCoupons = productWithInventory.AppliedCoupons;
                ViewBag.Product = productWithInventory.Product;
                ViewBag.HasInventoryData = true;
                
                return View(productWithInventory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading product details for ID: {ProductId}", id);
                TempData["ErrorMessage"] = "Có lỗi khi tải thông tin sản phẩm: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/ProductsAdmin/Create
        public async Task<IActionResult> Create()
        {
            try
            {
                // Lấy danh sách hàng tồn kho có sẵn
                var inventoryItems = await _inventoryService.GetAvailableInventoryItemsAsync();
                if (!inventoryItems.Any())
                {
                    TempData["ErrorMessage"] = "Không có hàng trong kho. Vui lòng nhập kho trước khi tạo sản phẩm.";
                    return RedirectToAction("StockIn", "InventoryAdmin");
                }
                
                // Lấy danh sách mã giảm giá đang hoạt động
                var activeCoupons = await _couponService.GetActiveCouponsAsync();
                
                ViewBag.InventoryItems = new SelectList(
                    inventoryItems.Select(i => new { 
                        Id = i.Id, 
                        Text = $"{i.Name} - SL: {i.Quantity} - Giá: {i.CostPrice:N0} VNĐ" 
                    }), "Id", "Text");
                    
                ViewBag.Coupons = new MultiSelectList(activeCoupons, "Id", "Name");
                ViewBag.Categories = new SelectList(Enum.GetValues(typeof(ProductCategory))
                    .Cast<ProductCategory>()
                    .Select(c => new { Value = (int)c, Text = GetCategoryDisplayName(c) }), "Value", "Text");
                
                return View(new ProductViewModel());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading create product page");
                TempData["ErrorMessage"] = "Có lỗi khi tải trang tạo sản phẩm: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionName("CreateOld")]
        public async Task<IActionResult> CreateOldProduct([Bind("Name,Description,Price,DiscountPrice,StockQuantity,Category,SubCategory,Specifications,IsFeatured,IsActive,CostPrice,SupplierId")] Product product, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Kiểm tra tồn kho trước khi tạo sản phẩm mới
                    if (product.StockQuantity <= 0)
                    {
                        ModelState.AddModelError("StockQuantity", "Không thể tạo sản phẩm khi không có tồn kho. Vui lòng nhập kho trước.");
                        var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
                        ViewBag.Suppliers = suppliers.Select(s => new SelectListItem
                        {
                            Value = s.Id.ToString(),
                            Text = s.Name
                        });
                        return View("Create_Old", product);
                    }

                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        // Validate allowed image formats
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                        var fileExtension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                        
                        if (!allowedExtensions.Contains(fileExtension))
                        {
                            ModelState.AddModelError("ImageFile", "Chỉ chấp nhận các định dạng ảnh: jpg, jpeg, png, gif, webp");
                            return View(product);
                        }
                        
                        // Log image information
                        Console.WriteLine($"Processing image: {imageFile.FileName}, Type: {imageFile.ContentType}, Size: {imageFile.Length} bytes");
                        
                        var imagePath = await _fileUploadService.UploadFileAsync(imageFile, "products");
                        product.ImageUrl = imagePath;
                        
                        // Log the saved path
                        Console.WriteLine($"Image saved to path: {imagePath}");
                    }

                    // Make sure required fields have values
                    product.CreatedAt = DateTime.UtcNow;
                    if (string.IsNullOrEmpty(product.SubCategory))
                    {
                        product.SubCategory = string.Empty;
                    }
                    // Add debug information
                    Console.WriteLine($"Adding product: {product.Name}, Category: {product.Category}, Price: {product.Price}");
                    
                    // First attempt: Add product using repository pattern
                    await _unitOfWork.Products.AddAsync(product);
                    
                    // Save changes to database
                    int changesResult = await _unitOfWork.CompleteAsync();
                    
                    // Log result
                    Console.WriteLine($"Database SaveChanges result: {changesResult} changes saved");
                    if (changesResult > 0)
                    {
                        // Clear cache to ensure frontend gets updated data
                        _cacheService.Clear();
                        
                        TempData["Success"] = "Sản phẩm đã được tạo thành công!";
                        return RedirectToAction(nameof(Index));
                    }
                    else
                    {
                        // First attempt failed, try direct database access as fallback
                        Console.WriteLine("First save attempt failed. Trying direct database access...");
                        
                        // Create a new product instance to avoid tracking issues
                        var newProduct = new Product
                        {
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            DiscountPrice = product.DiscountPrice,
                            StockQuantity = product.StockQuantity,
                            Category = product.Category,
                            SubCategory = product.SubCategory ?? string.Empty,
                            Specifications = product.Specifications,
                            IsFeatured = product.IsFeatured,
                            IsActive = product.IsActive,
                            ImageUrl = product.ImageUrl,
                            CreatedAt = DateTime.UtcNow
                        };
                        
                        bool directSaveResult = await SaveProductDirectlyToDatabase(newProduct);
                          if (directSaveResult)
                        {
                            // Clear cache after successful product creation
                            _cacheService.Clear();
                            
                            TempData["Success"] = "Sản phẩm đã được tạo thành công bằng truy cập trực tiếp cơ sở dữ liệu!";
                            return RedirectToAction(nameof(Index));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error creating product: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    ModelState.AddModelError("", $"Lỗi khi tạo sản phẩm: {ex.Message}");
                    TempData["Error"] = $"Không thể tạo sản phẩm: {ex.Message}";
                }
            }
            else
            {
                // Log model state errors
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                Console.WriteLine($"Validation errors: {string.Join(", ", errors)}");
            }

            return View("Create_Old", product);
        }

        // POST: Admin/ProductsAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProductViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Kiểm tra xem có thể tạo sản phẩm từ hàng tồn kho không
                    if (!await _inventoryService.CanCreateProductFromInventoryAsync(model.InventoryItemId))
                    {
                        ModelState.AddModelError("InventoryItemId", "Không thể tạo sản phẩm từ hàng tồn kho này.");
                        await LoadCreatePageData(model);
                        return View(model);
                    }

                    // Tạo Product object từ model
                    var product = new Product
                    {
                        Name = model.Name,
                        Price = model.Price,
                        Description = model.Description,
                        Category = model.Category,
                        SubCategory = model.SubCategory,
                        DiscountPrice = model.DiscountPrice,
                        Sku = model.Sku,
                        Barcode = model.Barcode,
                        Weight = model.Weight,
                        Dimensions = model.Dimensions,
                        MinimumStockLevel = model.MinimumStockLevel,
                        OptimalStockLevel = model.OptimalStockLevel,
                        IsFeatured = model.IsFeatured,
                        TrackInventory = model.TrackInventory,
                        AllowBackorder = model.AllowBackorder,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    
                    // Sử dụng ProductInventoryService để tạo sản phẩm với tồn kho ban đầu
                    var inventoryItem = await _unitOfWork.InventoryItems.GetByIdAsync(model.InventoryItemId);
                    product = await _productInventoryService.CreateProductWithInventoryAsync(
                        product,
                        inventoryItem?.Quantity ?? 0,
                        inventoryItem?.CostPrice,
                        null, // Không có thông tin SupplierId trong InventoryItem
                        inventoryItem?.BatchNumber ?? "",
                        "Created from existing inventory item");

                    // Áp dụng mã giảm giá nếu có
                    if (model.SelectedCouponIds != null && model.SelectedCouponIds.Any())
                    {
                        await _couponService.ApplyCouponsToProductAsync(product.Id, model.SelectedCouponIds);
                    }

                    // Xử lý upload hình ảnh nếu có
                    if (model.ImageFile != null)
                    {
                        try
                        {
                            var imagePath = await _fileUploadService.UploadFileAsync(model.ImageFile, "products");
                            product.ImageUrl = imagePath;
                            await _unitOfWork.Products.UpdateAsync(product);
                            await _unitOfWork.CompleteAsync();
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to upload image for product {ProductId}", product.Id);
                            // Không fail toàn bộ process vì hình ảnh
                        }
                    }

                    TempData["SuccessMessage"] = "Đã tạo sản phẩm thành công từ hàng tồn kho!";
                    return RedirectToAction(nameof(Details), new { id = product.Id });
                }

                await LoadCreatePageData(model);
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product from inventory");
                ModelState.AddModelError("", "Có lỗi khi tạo sản phẩm: " + ex.Message);
                await LoadCreatePageData(model);
                return View(model);
            }
        }

        // GET: Admin/ProductsAdmin/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id.Value);
                if (product == null)
                {
                    return NotFound();
                }

                var model = new ProductViewModel
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    DiscountPrice = product.DiscountPrice,
                    Category = product.Category,
                    SubCategory = product.SubCategory,
                    Sku = product.Sku,
                    Barcode = product.Barcode,
                    Weight = product.Weight,
                    Dimensions = product.Dimensions,
                    MinimumStockLevel = product.MinimumStockLevel,
                    OptimalStockLevel = product.OptimalStockLevel,
                    IsFeatured = product.IsFeatured,
                    TrackInventory = product.TrackInventory,
                    AllowBackorder = product.AllowBackorder,
                    IsActive = product.IsActive,
                    ImageUrl = product.ImageUrl,
                    CostPrice = product.CostPrice
                };

                // Load current coupons
                var productCoupons = await _couponService.GetProductCouponsAsync(id.Value);
                model.SelectedCouponIds = productCoupons.Select(c => c.Id).ToList();

                await LoadEditPageData(model);
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading edit page for product {ProductId}", id);
                TempData["ErrorMessage"] = "Có lỗi khi tải thông tin sản phẩm để chỉnh sửa.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ProductsAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProductViewModel model)
        {
            if (id != model.Id)
            {
                return NotFound();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    var product = await _unitOfWork.Products.GetByIdAsync(id);
                    if (product == null)
                    {
                        return NotFound();
                    }

                    // Update product properties
                    product.Name = model.Name;
                    product.Description = model.Description;
                    product.Price = model.Price;
                    product.DiscountPrice = model.DiscountPrice;
                    product.Category = model.Category;
                    product.SubCategory = model.SubCategory;
                    product.Sku = model.Sku;
                    product.Barcode = model.Barcode;
                    product.Weight = model.Weight;
                    product.Dimensions = model.Dimensions;
                    product.MinimumStockLevel = model.MinimumStockLevel;
                    product.OptimalStockLevel = model.OptimalStockLevel;
                    product.IsFeatured = model.IsFeatured;
                    product.TrackInventory = model.TrackInventory;
                    product.AllowBackorder = model.AllowBackorder;
                    product.IsActive = model.IsActive;
                    product.UpdatedAt = DateTime.UtcNow;

                    // Handle image upload
                    if (model.ImageFile != null)
                    {
                        try
                        {
                            var imagePath = await _fileUploadService.UploadFileAsync(model.ImageFile, "products");
                            product.ImageUrl = imagePath;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to upload image for product {ProductId}", product.Id);
                        }
                    }

                    await _unitOfWork.Products.UpdateAsync(product);

                    // Update coupon associations
                    var currentCoupons = await _couponService.GetProductCouponsAsync(id);
                    var currentCouponIds = currentCoupons.Select(c => c.Id).ToList();
                    var newCouponIds = model.SelectedCouponIds ?? new List<int>();

                    // Remove coupons that are no longer selected
                    var couponsToRemove = currentCouponIds.Except(newCouponIds).ToList();
                    if (couponsToRemove.Any())
                    {
                        await _couponService.RemoveCouponsFromProductAsync(id, couponsToRemove);
                    }

                    // Add new coupons
                    var couponsToAdd = newCouponIds.Except(currentCouponIds).ToList();
                    if (couponsToAdd.Any())
                    {
                        await _couponService.ApplyCouponsToProductAsync(id, couponsToAdd);
                    }

                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Đã cập nhật sản phẩm thành công!";
                    return RedirectToAction(nameof(Details), new { id = product.Id });
                }

                await LoadEditPageData(model);
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {ProductId}", id);
                ModelState.AddModelError("", "Có lỗi khi cập nhật sản phẩm: " + ex.Message);
                await LoadEditPageData(model);
                return View(model);
            }
        }

        // GET: Admin/ProductsAdmin/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id.Value);
                if (product == null)
                {
                    return NotFound();
                }

                return View(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading delete confirmation for product {ProductId}", id);
                TempData["ErrorMessage"] = "Có lỗi khi tải thông tin sản phẩm.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ProductsAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                await _productService.DeleteProductAsync(id);
                TempData["SuccessMessage"] = "Đã xóa sản phẩm thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {ProductId}", id);
                TempData["ErrorMessage"] = "Có lỗi khi xóa sản phẩm: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ProductsAdmin/ToggleFeatured/5
        [HttpPost]
        public async Task<IActionResult> ToggleFeatured(int id)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product != null)
                {
                    product.IsFeatured = !product.IsFeatured;
                    product.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache to reflect updated featured status
                    _cacheService.Clear();

                    return Json(new { success = true, isFeatured = product.IsFeatured });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Product not found" });
        }

        // POST: Admin/ProductsAdmin/ToggleActive/5
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product != null)
                {                    product.IsActive = !product.IsActive;
                    product.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache to reflect updated active status
                    _cacheService.Clear();

                    return Json(new { success = true, isActive = product.IsActive });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Product not found" });
        }

        // GET: Admin/ProductsAdmin/Search
        [HttpGet]
        public async Task<IActionResult> Search(string query)
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                
                if (!string.IsNullOrEmpty(query))
                {
                    products = products.Where(p => 
                        p.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.Description.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.Category.ToString().Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.SubCategory.Contains(query, StringComparison.OrdinalIgnoreCase));
                }

                return Json(products.Select(p => new 
                {
                    id = p.Id,
                    name = p.Name,
                    price = p.Price,
                    category = p.Category.ToString(),
                    isActive = p.IsActive,
                    isFeatured = p.IsFeatured
                }));
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        // POST: Admin/ProductsAdmin/ClearCache
        [HttpPost]
        public IActionResult ClearCache()
        {
            try
            {
                _cacheService.Clear();
                TempData["Success"] = "Đã xóa bộ nhớ đệm sản phẩm thành công!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi xóa bộ nhớ đệm: " + ex.Message;
            }
            
            return RedirectToAction(nameof(Index));
        }

        // Helper method for direct database saving
        private async Task<bool> SaveProductDirectlyToDatabase(Product product)
        {
            try
            {
                using (var scope = HttpContext.RequestServices.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    await context.Products.AddAsync(product);
                    int result = await context.SaveChangesAsync();
                    Console.WriteLine($"Direct save result: {result} changes saved");
                    return result > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Direct save error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }

        // Helper Methods
        private async Task LoadCreatePageData(ProductViewModel model)
        {
            var inventoryItems = await _inventoryService.GetAvailableInventoryItemsAsync();
            var activeCoupons = await _couponService.GetActiveCouponsAsync();

            ViewBag.InventoryItems = new SelectList(
                inventoryItems.Select(i => new { 
                    Id = i.Id, 
                    Text = $"{i.Name} - SL: {i.Quantity} - Giá: {i.CostPrice:N0} VNĐ" 
                }), "Id", "Text", model.InventoryItemId);
                
            ViewBag.Coupons = new MultiSelectList(activeCoupons, "Id", "Name", model.SelectedCouponIds);
            ViewBag.Categories = new SelectList(Enum.GetValues(typeof(ProductCategory))
                .Cast<ProductCategory>()
                .Select(c => new { Value = (int)c, Text = GetCategoryDisplayName(c) }), "Value", "Text", (int)model.Category);
        }

        private async Task LoadEditPageData(ProductViewModel model)
        {
            var activeCoupons = await _couponService.GetActiveCouponsAsync();

            ViewBag.Coupons = new MultiSelectList(activeCoupons, "Id", "Name", model.SelectedCouponIds);
            ViewBag.Categories = new SelectList(Enum.GetValues(typeof(ProductCategory))
                .Cast<ProductCategory>()
                .Select(c => new { Value = (int)c, Text = GetCategoryDisplayName(c) }), "Value", "Text", (int)model.Category);
        }

        private string GetCategoryDisplayName(ProductCategory category)
        {
            return category switch
            {
                ProductCategory.Sportswear => "Đồ thể thao",
                ProductCategory.Supplements => "Thực phẩm bổ sung",
                ProductCategory.Equipment => "Thiết bị",
                ProductCategory.Accessories => "Phụ kiện",
                ProductCategory.Nutrition => "Dinh dưỡng",
                _ => category.ToString()
            };
        }

        private List<string> GetSubCategoriesForCategory(ProductCategory category)
        {
            return category switch
            {
                ProductCategory.Sportswear => new List<string> { "Áo thun", "Quần short", "Giày thể thao", "Áo khoác" },
                ProductCategory.Supplements => new List<string> { "Protein", "Vitamin", "Khoáng chất", "Pre-workout" },
                ProductCategory.Equipment => new List<string> { "Tạ", "Máy tập", "Dây nhảy", "Thảm yoga" },
                ProductCategory.Accessories => new List<string> { "Găng tay", "Đai lưng", "Bình nước", "Túi tập" },
                ProductCategory.Nutrition => new List<string> { "Thức ăn năng lượng", "Đồ uống thể thao", "Protein bar" },
                _ => new List<string>()
            };
        }

        // GET: Admin/ProductsAdmin/WithInventory/5
        [HttpGet("WithInventory/{id}")]
        public async Task<IActionResult> ProductWithInventory(int id)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null)
                    return NotFound();
                
                // Lấy thông tin inventory
                var inventoryTransactions = await _inventoryService.GetProductTransactionHistoryAsync(id);
                
                // Lấy các mã giảm giá đang áp dụng cho sản phẩm
                var allActiveCoupons = await _couponService.GetAllActiveCouponsAsync();
                var appliedCoupons = new List<Coupon>();
                
                // Điều chỉnh logic này dựa trên cấu trúc thực tế của ứng dụng
                // Giả sử tất cả coupon đều có thể áp dụng cho tất cả sản phẩm
                appliedCoupons.AddRange(allActiveCoupons);
                
                // TODO: Cập nhật logic lọc coupon theo sản phẩm khi có phương thức hỗ trợ

                // Tạo view model tích hợp cho sản phẩm
                var viewModel = new ProductWithInventoryViewModel
                {
                    Product = product,
                    InventoryTransactions = inventoryTransactions.ToList(),
                    AppliedCoupons = appliedCoupons,
                    CurrentStock = product.StockQuantity,
                    // Giả định giá trị mặc định vì không có trường cost trong transaction
                    TotalCost = product.Price * product.StockQuantity * 0.7M, // Giả định giá vốn bằng 70% giá bán
                    ReorderPoint = 10, // Giá trị mặc định nếu không có trong model
                    LastRestock = inventoryTransactions
                        .Where(t => t.TransactionType == 0) // 0 = StockIn (nhập kho)
                        .OrderByDescending(t => t.TransactionDate)
                        .FirstOrDefault()?.TransactionDate
                };

                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting product with inventory details");
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi lấy thông tin sản phẩm và kho hàng";
                return RedirectToAction(nameof(Index));
            }
        }
    }
}