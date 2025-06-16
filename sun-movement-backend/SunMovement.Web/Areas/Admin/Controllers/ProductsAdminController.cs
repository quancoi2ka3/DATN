using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ProductsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;
        private readonly ICacheService _cacheService;

        public ProductsAdminController(IUnitOfWork unitOfWork, IFileUploadService fileUploadService, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
            _cacheService = cacheService;
        }// GET: Admin/ProductsAdmin
        public async Task<IActionResult> Index(string searchString)
        {
            try
            {
                Console.WriteLine("Loading ProductsAdmin Index page");
                var products = await _unitOfWork.Products.GetAllAsync();
                
                if (!string.IsNullOrEmpty(searchString))
                {
                    products = products.Where(p => 
                        p.Name.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        p.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        p.Category.ToString().Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        p.SubCategory.Contains(searchString, StringComparison.OrdinalIgnoreCase));
                }

                Console.WriteLine($"Found {products.Count()} products");
                ViewBag.SearchString = searchString;
                return View(products.OrderByDescending(p => p.CreatedAt));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading products: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                TempData["Error"] = "Error loading products: " + ex.Message;
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
                var product = await _unitOfWork.Products.GetByIdAsync(id.Value);
                if (product == null)
                {
                    return NotFound();
                }

                return View(product);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading product details: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/ProductsAdmin/Create
        public IActionResult Create()
        {
            return View();
        }        // POST: Admin/ProductsAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Description,Price,DiscountPrice,StockQuantity,Category,SubCategory,Specifications,IsFeatured,IsActive")] Product product, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                try
                {
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

            return View(product);
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

                return View(product);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading product for editing: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ProductsAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,Price,DiscountPrice,StockQuantity,Category,SubCategory,Specifications,IsFeatured,IsActive,CreatedAt,ImageUrl")] Product product, IFormFile? imageFile)
        {
            if (id != product.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var imagePath = await _fileUploadService.UploadFileAsync(imageFile, "products");
                        product.ImageUrl = imagePath;
                    }
                    
                    product.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache to ensure frontend gets updated data
                    _cacheService.Clear();

                    TempData["Success"] = "Sản phẩm đã được cập nhật thành công!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi cập nhật sản phẩm: " + ex.Message);
                }
            }

            return View(product);
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
                TempData["Error"] = "Error loading product for deletion: " + ex.Message;
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
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product != null)
                {
                    await _unitOfWork.Products.DeleteAsync(product);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache to ensure frontend updates
                    _cacheService.Clear();
                    
                    TempData["Success"] = "Sản phẩm đã được xóa thành công!";
                }
                else
                {
                    TempData["Error"] = "Không tìm thấy sản phẩm.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi xóa sản phẩm: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
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
    }
}