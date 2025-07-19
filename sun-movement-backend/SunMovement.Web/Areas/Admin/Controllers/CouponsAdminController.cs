using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using SunMovement.Core.Interfaces;
using SunMovement.Web.Areas.Admin.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class CouponsAdminController : BaseAdminController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICouponService _couponService;
        private readonly IProductInventoryService _productInventoryService;
        private readonly IAnalyticsService _analyticsService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<CouponsAdminController> _logger;
        private readonly IConfiguration _configuration;

        public CouponsAdminController(
            IUnitOfWork unitOfWork, 
            ICouponService couponService,
            IProductInventoryService productInventoryService,
            IAnalyticsService analyticsService,
            IEmailService emailService,
            UserManager<ApplicationUser> userManager,
            ILogger<CouponsAdminController> logger,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _couponService = couponService;
            _productInventoryService = productInventoryService;
            _analyticsService = analyticsService;
            _emailService = emailService;
            _userManager = userManager;
            _logger = logger;
            _configuration = configuration;
        }

        // GET: Admin/CouponsAdmin
        public async Task<IActionResult> Index(int page = 1, int pageSize = 10, string searchTerm = "", bool? isActive = null)
        {
            try
            {
                var couponsQuery = await _unitOfWork.Coupons.GetAllAsync();
                
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    couponsQuery = couponsQuery.Where(c => 
                        c.Code.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                        c.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
                }

                if (isActive.HasValue)
                {
                    couponsQuery = couponsQuery.Where(c => c.IsActive == isActive.Value);
                }

                var totalCount = couponsQuery.Count();
                var coupons = couponsQuery
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                ViewBag.CurrentPage = page;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);
                ViewBag.SearchTerm = searchTerm;
                ViewBag.IsActiveFilter = isActive;
                ViewBag.TotalCount = totalCount;

                return View(coupons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupons list");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải danh sách mã giảm giá.";
                return View(new List<Coupon>());
            }
        }

        // GET: Admin/CouponsAdmin/Details/5
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(Index));
                }

                return View(coupon);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon details for ID: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/CouponsAdmin/Create
        public IActionResult Create()
        {
            LoadCouponTypesToViewBag();
            LoadApplicationTypesToViewBag();
            return View(new Coupon());
        }

        // POST: Admin/CouponsAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Coupon coupon)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Check if code is unique
                    if (!await IsCouponCodeUniqueAsync(coupon.Code))
                    {
                        ModelState.AddModelError("Code", "Mã giảm giá đã tồn tại.");
                        LoadCouponTypesToViewBag();
                        LoadApplicationTypesToViewBag();
                        return View(coupon);
                    }

                    // Validate percentage coupon
                    if (coupon.Type == CouponType.Percentage && coupon.Value > 100)
                    {
                        ModelState.AddModelError("Value", "Phần trăm giảm giá không được vượt quá 100%.");
                        LoadCouponTypesToViewBag();
                        LoadApplicationTypesToViewBag();
                        return View(coupon);
                    }

                    // Validate dates
                    if (coupon.EndDate <= coupon.StartDate)
                    {
                        ModelState.AddModelError("EndDate", "Ngày kết thúc phải sau ngày bắt đầu.");
                        LoadCouponTypesToViewBag();
                        LoadApplicationTypesToViewBag();
                        return View(coupon);
                    }

                    await _unitOfWork.Coupons.AddAsync(coupon);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Thêm mã giảm giá thành công!";
                    return RedirectToAction(nameof(Index));
                }

                LoadCouponTypesToViewBag();
                LoadApplicationTypesToViewBag();
                return View(coupon);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating coupon");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi thêm mã giảm giá.";
                LoadCouponTypesToViewBag();
                LoadApplicationTypesToViewBag();
                return View(coupon);
            }
        }

        // GET: Admin/CouponsAdmin/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(Index));
                }

                LoadCouponTypesToViewBag();
                LoadApplicationTypesToViewBag();
                return View(coupon);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon for edit: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/CouponsAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Coupon coupon)
        {
            if (id != coupon.Id)
            {
                TempData["ErrorMessage"] = "ID không hợp lệ.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                if (ModelState.IsValid)
                {
                    // Validate percentage coupon
                    if (coupon.Type == CouponType.Percentage && coupon.Value > 100)
                    {
                        ModelState.AddModelError("Value", "Phần trăm giảm giá không được vượt quá 100%.");
                        LoadCouponTypesToViewBag();
                        LoadApplicationTypesToViewBag();
                        return View(coupon);
                    }

                    // Validate dates
                    if (coupon.EndDate <= coupon.StartDate)
                    {
                        ModelState.AddModelError("EndDate", "Ngày kết thúc phải sau ngày bắt đầu.");
                        LoadCouponTypesToViewBag();
                        LoadApplicationTypesToViewBag();
                        return View(coupon);
                    }

                    coupon.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Coupons.UpdateAsync(coupon);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Cập nhật mã giảm giá thành công!";
                    return RedirectToAction(nameof(Index));
                }

                LoadCouponTypesToViewBag();
                LoadApplicationTypesToViewBag();
                return View(coupon);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating coupon: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi cập nhật mã giảm giá.";
                LoadCouponTypesToViewBag();
                LoadApplicationTypesToViewBag();
                return View(coupon);
            }
        }

        // GET: Admin/CouponsAdmin/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(Index));
                }

                return View(coupon);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon for delete: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/CouponsAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(Index));
                }

                await _unitOfWork.Coupons.DeleteAsync(coupon);
                await _unitOfWork.CompleteAsync();

                TempData["SuccessMessage"] = "Xóa mã giảm giá thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting coupon: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi xóa mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/CouponsAdmin/GenerateCode
        [HttpPost]
        public async Task<IActionResult> GenerateCode(string prefix = "SALE")
        {
            try
            {
                var code = await _couponService.GenerateUniqueCouponCodeAsync(prefix);
                return Json(new { success = true, code = code });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating coupon code");
                return Json(new { success = false, message = "Có lỗi xảy ra khi tạo mã giảm giá." });
            }
        }

        // POST: Admin/CouponsAdmin/ToggleStatus/5
        [HttpPost]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy mã giảm giá." });
                }

                coupon.IsActive = !coupon.IsActive;
                coupon.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.Coupons.UpdateAsync(coupon);
                await _unitOfWork.CompleteAsync();

                return Json(new { 
                    success = true, 
                    message = coupon.IsActive ? "Kích hoạt mã giảm giá thành công!" : "Vô hiệu hóa mã giảm giá thành công!",
                    isActive = coupon.IsActive
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling coupon status: {CouponId}", id);
                return Json(new { success = false, message = "Có lỗi xảy ra khi thay đổi trạng thái mã giảm giá." });
            }
        }

        // GET: Admin/CouponsAdmin/GenerateAgedInventoryCoupons
        public async Task<IActionResult> GenerateAgedInventoryCoupons()
        {
            try
            {
                var agedInventoryCoupons = await _couponService.GenerateAgedInventoryCouponsAsync(90, 15, 30);
                
                if (agedInventoryCoupons.Any())
                {
                    TempData["SuccessMessage"] = $"Đã tạo {agedInventoryCoupons.Count()} mã giảm giá cho sản phẩm tồn kho lâu.";
                }
                else
                {
                    TempData["InfoMessage"] = "Không có sản phẩm tồn kho lâu nào cần tạo mã giảm giá.";
                }
                
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating aged inventory coupons");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tạo mã giảm giá cho hàng tồn kho lâu.";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/CouponsAdmin/CreateCouponForProduct
        public async Task<IActionResult> CreateCouponForProduct(int productId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId);
                if (product == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy sản phẩm.";
                    return RedirectToAction("Index", "InventoryDashboard");
                }
                
                // Tạo mã giảm giá 15% cho sản phẩm này, có hiệu lực 30 ngày
                var productPrefix = product.Name.Length > 5 
                    ? product.Name.Substring(0, 5).ToUpper().Replace(" ", "") 
                    : product.Name.ToUpper().Replace(" ", "");
                
                var code = $"SALE{productPrefix}{DateTime.Now.ToString("MMdd")}";

                var coupon = new Coupon
                {
                    Code = code,
                    Name = $"Giảm giá - {product.Name}",
                    Description = $"Giảm 15% cho sản phẩm {product.Name}",
                    Type = CouponType.Percentage,
                    Value = 15,
                    MinimumOrderAmount = 0,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(30),
                    IsActive = true,
                    UsageLimit = Math.Max(1, product.StockQuantity),
                    ApplicationType = DiscountApplicationType.Product,
                    ApplicationValue = product.Id.ToString(),
                    AutoApply = true,
                    IsPublic = true,
                    CreatedBy = "Admin",
                    CreatedAt = DateTime.Now
                };
                
                var createdCoupon = await _couponService.CreateCouponAsync(coupon);
                
                TempData["SuccessMessage"] = $"Đã tạo mã giảm giá {createdCoupon.Code} cho sản phẩm {product.Name}.";
                return RedirectToAction("Index", "InventoryDashboard");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating coupon for product {ProductId}", productId);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tạo mã giảm giá cho sản phẩm.";
                return RedirectToAction("Index", "InventoryDashboard");
            }
        }

        // GET: Admin/CouponsAdmin/Activate/5
        public async Task<IActionResult> Activate(int id)
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(id);
                if (coupon == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(Index));
                }

                coupon.IsActive = true;
                coupon.UpdatedAt = DateTime.UtcNow;
                
                await _unitOfWork.Coupons.UpdateAsync(coupon);
                await _unitOfWork.CompleteAsync();
                
                TempData["SuccessMessage"] = $"Đã kích hoạt mã giảm giá {coupon.Code}.";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating coupon with ID: {CouponId}", id);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi kích hoạt mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // POST: Admin/CouponsAdmin/GenerateSeasonalCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GenerateSeasonalCoupon(string occasion, int type, decimal discountValue, int validityDays)
        {
            try
            {
                if (string.IsNullOrEmpty(occasion) || discountValue <= 0 || validityDays <= 0)
                {
                    TempData["ErrorMessage"] = "Thông tin không hợp lệ.";
                    return RedirectToAction(nameof(Index));
                }
                
                var couponType = (CouponType)type;
                if (couponType == CouponType.Percentage && discountValue > 100)
                {
                    TempData["ErrorMessage"] = "Giá trị % giảm giá không được vượt quá 100%.";
                    return RedirectToAction(nameof(Index));
                }
                
                var coupon = await _couponService.GenerateSeasonalCouponAsync(occasion, discountValue, couponType, validityDays);
                
                TempData["SuccessMessage"] = $"Đã tạo mã giảm giá theo mùa {coupon.Code} thành công.";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating seasonal coupon");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tạo mã giảm giá theo mùa.";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/CouponsAdmin/CouponStatistics
        public async Task<IActionResult> CouponStatistics()
        {
            try
            {
                var activeCoupons = await _unitOfWork.Coupons.GetActiveCouponsAsync();
                var statistics = new List<CouponStatistics>();
                
                foreach (var coupon in activeCoupons)
                {
                    var stat = await _couponService.GetCouponStatisticsAsync(coupon.Id);
                    stat.Coupon = coupon;
                    statistics.Add(stat);
                }
                
                return View(statistics.OrderByDescending(s => s.TotalUsageCount));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon statistics");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thống kê mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/CouponsAdmin/ApplyCoupons?productId=5
        [HttpGet]
        public async Task<IActionResult> ApplyCoupons(int? productId)
        {
            ViewBag.ProductId = productId;
            ViewBag.PageTitle = productId.HasValue ? "Gán Mã Giảm Giá Cho Sản Phẩm" : "Quản Lý Mã Giảm Giá - Sản Phẩm";
            
            var viewModel = new CouponProductsViewModel();
            
            // Lấy tất cả mã giảm giá đang hoạt động
            viewModel.AllCoupons = await _couponService.GetAllActiveCouponsAsync();
            
            // Nếu có product ID, lấy thông tin sản phẩm và các mã giảm giá đã gán
            if (productId.HasValue)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(productId.Value);
                if (product != null)
                {
                    viewModel.Product = product;
                    viewModel.SelectedCouponIds = await GetAppliedCouponIdsForProduct(productId.Value);
                }
                else
                {
                    TempData["ErrorMessage"] = "Không tìm thấy sản phẩm";
                    return RedirectToAction(nameof(Index));
                }
            }
            else
            {
                // Lấy tất cả sản phẩm nếu không có product ID cụ thể
                viewModel.AllProducts = await _unitOfWork.Products.GetAllAsync();
                // Dùng coupon đầu tiên làm mặc định nếu có
                var firstCoupon = viewModel.AllCoupons.FirstOrDefault();
                if (firstCoupon != null)
                {
                    viewModel.SelectedCouponId = firstCoupon.Id;
                    viewModel.SelectedProductIds = await GetAppliedProductIdsForCoupon(firstCoupon.Id);
                }
            }
            
            return View(viewModel);
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApplyCoupons(CouponProductsViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                if (viewModel.Product != null)
                {
                    viewModel.AllCoupons = await _couponService.GetAllActiveCouponsAsync();
                }
                else if (viewModel.SelectedCouponId > 0)
                {
                    viewModel.AllCoupons = await _couponService.GetAllActiveCouponsAsync();
                    viewModel.AllProducts = await _unitOfWork.Products.GetAllAsync();
                }
                return View(viewModel);
            }
            
            try
            {
                if (viewModel.Product != null && viewModel.Product.Id > 0)
                {
                    // Cập nhật mã giảm giá cho sản phẩm cụ thể
                    await UpdateCouponsForProduct(viewModel.Product.Id, viewModel.SelectedCouponIds);
                    TempData["SuccessMessage"] = "Cập nhật mã giảm giá cho sản phẩm thành công";
                    return RedirectToAction("ProductWithInventory", "ProductsAdmin", new { id = viewModel.Product.Id });
                }
                else if (viewModel.SelectedCouponId > 0)
                {
                    // Cập nhật sản phẩm cho mã giảm giá cụ thể
                    await UpdateProductsForCoupon(viewModel.SelectedCouponId, viewModel.SelectedProductIds);
                    TempData["SuccessMessage"] = "Cập nhật sản phẩm cho mã giảm giá thành công";
                    return RedirectToAction("Details", new { id = viewModel.SelectedCouponId });
                }
                
                TempData["ErrorMessage"] = "Không đủ thông tin để cập nhật";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật mã giảm giá cho sản phẩm");
                TempData["ErrorMessage"] = "Đã xảy ra lỗi khi cập nhật: " + ex.Message;
                
                viewModel.AllCoupons = await _couponService.GetAllActiveCouponsAsync();
                if (viewModel.SelectedCouponId > 0)
                {
                    viewModel.AllProducts = await _unitOfWork.Products.GetAllAsync();
                }
                
                return View(viewModel);
            }
        }
        
        private async Task<List<int>> GetAppliedCouponIdsForProduct(int productId)
        {
            // Lấy các mã giảm giá đã áp dụng cho sản phẩm
            if (_unitOfWork.CouponProducts != null)
            {
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                return couponProducts.Select(cp => cp.CouponId).ToList();
            }
            
            // Nếu không có bảng mapping, giả định tất cả coupon đều áp dụng cho sản phẩm
            return (await _couponService.GetAllActiveCouponsAsync()).Select(c => c.Id).ToList();
        }
        
        private async Task<List<int>> GetAppliedProductIdsForCoupon(int couponId)
        {
            // Lấy các sản phẩm đã áp dụng cho mã giảm giá
            if (_unitOfWork.CouponProducts != null)
            {
                var couponProducts = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                return couponProducts.Select(cp => cp.ProductId).ToList();
            }
            
            // Nếu không có bảng mapping, có thể cần triển khai cách khác để lưu thông tin này
            return (await _unitOfWork.Products.GetAllAsync()).Select(p => p.Id).ToList();
        }
        
        private async Task UpdateCouponsForProduct(int productId, List<int> couponIds)
        {
            if (_unitOfWork.CouponProducts != null)
            {
                // Xóa tất cả mapping hiện tại
                var existingMappings = await _unitOfWork.CouponProducts.FindAsync(cp => cp.ProductId == productId);
                foreach (var mapping in existingMappings)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(mapping);
                }
                
                // Thêm mappings mới
                if (couponIds != null)
                {
                    foreach (var couponId in couponIds)
                    {
                        await _unitOfWork.CouponProducts.AddAsync(new CouponProduct
                        {
                            CouponId = couponId,
                            ProductId = productId
                        });
                    }
                }
                
                await _unitOfWork.CompleteAsync();
            }
            
            // Nếu không có bảng mapping, có thể cần triển khai cách khác để lưu thông tin này
        }
        
        private async Task UpdateProductsForCoupon(int couponId, List<int> productIds)
        {
            if (_unitOfWork.CouponProducts != null)
            {
                // Xóa tất cả mapping hiện tại
                var existingMappings = await _unitOfWork.CouponProducts.FindAsync(cp => cp.CouponId == couponId);
                foreach (var mapping in existingMappings)
                {
                    await _unitOfWork.CouponProducts.DeleteAsync(mapping);
                }
                
                // Thêm mappings mới
                if (productIds != null)
                {
                    foreach (var productId in productIds)
                    {
                        await _unitOfWork.CouponProducts.AddAsync(new CouponProduct
                        {
                            CouponId = couponId,
                            ProductId = productId
                        });
                    }
                }
                
                await _unitOfWork.CompleteAsync();
            }
            
            // Nếu không có bảng mapping, có thể cần triển khai cách khác để lưu thông tin này
        }

        // GET: Admin/CouponsAdmin/Analytics
        public async Task<IActionResult> Analytics(DateTime? from = null, DateTime? to = null)
        {
            try
            {
                from ??= DateTime.Now.AddMonths(-1);
                to ??= DateTime.Now;

                var couponAnalytics = await _analyticsService.GetCouponAnalyticsAsync(from.Value, to.Value);
                
                ViewBag.FromDate = from.Value.ToString("yyyy-MM-dd");
                ViewBag.ToDate = to.Value.ToString("yyyy-MM-dd");
                
                return View(couponAnalytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading coupon analytics");
                ShowError("Có lỗi xảy ra khi tải phân tích mã giảm giá");
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/CouponsAdmin/ApplyCouponToProducts
        public async Task<IActionResult> ApplyCouponToProducts(int? couponId)
        {
            try
            {
                if (!couponId.HasValue)
                {
                    // Hiển thị danh sách mã giảm giá để chọn
                    var coupons = await _unitOfWork.Coupons.GetAllAsync();
                    var activeCoupons = coupons.Where(c => c.IsActive && c.EndDate >= DateTime.Now).ToList();
                    
                    if (!activeCoupons.Any())
                    {
                        ShowInfo("Không có mã giảm giá nào đang hoạt động. Hãy tạo mã giảm giá trước.");
                        return RedirectToAction(nameof(Create));
                    }
                    
                    ViewBag.Coupons = new SelectList(activeCoupons, "Id", "Code");
                    return View();
                }
                else
                {
                    // Hiển thị form để chọn sản phẩm áp dụng cho mã giảm giá đã chọn
                    var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId.Value);
                    if (coupon == null)
                    {
                        ShowError("Không tìm thấy mã giảm giá");
                        return RedirectToAction(nameof(Index));
                    }
                    
                    var products = await _unitOfWork.Products.GetAllAsync();
                    var activeProducts = products.Where(p => p.IsActive).ToList();
                    
                    // Lấy danh sách sản phẩm đã áp dụng mã giảm giá này
                    var appliedProductIds = await _couponService.GetCouponProductIdsAsync(couponId.Value);
                    
                    var model = new ApplyCouponViewModel
                    {
                        CouponId = coupon.Id,
                        CouponCode = coupon.Code,
                        CouponDescription = coupon.Description,
                        Products = activeProducts.Select(p => new ProductSelectionItem
                        {
                            ProductId = p.Id,
                            ProductName = p.Name,
                            ProductSku = p.Sku ?? string.Empty,
                            ProductCategory = p.Category.ToString(),
                            IsSelected = appliedProductIds.Contains(p.Id)
                        }).ToList()
                    };
                    
                    return View("SelectProducts", model);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading apply coupon to products form");
                ShowError("Có lỗi xảy ra khi tải form áp dụng mã giảm giá cho sản phẩm");
                return RedirectToAction(nameof(Index));
            }
        }
        
        // POST: Admin/CouponsAdmin/ApplyCouponToProducts
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApplyCouponToProducts(ApplyCouponViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var selectedProductIds = model.Products
                        .Where(p => p.IsSelected)
                        .Select(p => p.ProductId)
                        .ToList();
                    
                    // Cập nhật danh sách sản phẩm áp dụng mã giảm giá
                    await _couponService.UpdateCouponProductsAsync(model.CouponId, selectedProductIds);
                    
                    ShowSuccess($"Đã áp dụng mã giảm giá {model.CouponCode} cho {selectedProductIds.Count} sản phẩm");
                    return RedirectToAction(nameof(Details), new { id = model.CouponId });
                }
                
                return View("SelectProducts", model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying coupon to products");
                ShowError("Có lỗi xảy ra khi áp dụng mã giảm giá cho sản phẩm");
                return View("SelectProducts", model);
            }
        }
        
        // POST: Admin/CouponsAdmin/SelectCoupon
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SelectCoupon(int couponId)
        {
            return RedirectToAction(nameof(ApplyCouponToProducts), new { couponId });
        }

        // GET: Admin/CouponsAdmin/SendCouponNotification
        public async Task<IActionResult> SendCouponNotification()
        {
            try
            {
                var activeCoupons = await _unitOfWork.Coupons.GetActiveCouponsAsync();
                var customers = _userManager.Users.Where(u => !string.IsNullOrEmpty(u.Email)).ToList();
                
                ViewBag.ActiveCoupons = activeCoupons;
                ViewBag.Customers = customers;
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading send coupon notification page");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải trang gửi thông báo mã giảm giá.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/CouponsAdmin/SendCouponNotification
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendCouponNotification(SendCouponNotificationViewModel model)
        {
            try
            {
                _logger.LogInformation("📧 Starting coupon notification process...");
                _logger.LogInformation("📧 Model validation: {IsValid}", ModelState.IsValid);
                _logger.LogInformation("📧 Coupon ID: {CouponId}", model.CouponId);
                _logger.LogInformation("📧 Customer emails count: {EmailCount}", model.CustomerEmails?.Count ?? 0);
                _logger.LogInformation("📧 Campaign type: {CampaignType}", model.CampaignType);
                _logger.LogInformation("📧 Send to all customers: {SendToAll}", model.SendToAllCustomers);

                // Remove TestEmail validation errors if TestEmail is empty
                if (string.IsNullOrEmpty(model.TestEmail))
                {
                    ModelState.Remove("TestEmail");
                }

                // Log validation errors if any
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("📧 Model validation failed");
                    foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        _logger.LogWarning("📧 Validation error: {Error}", error.ErrorMessage);
                    }
                    
                    var activeCoupons = await _unitOfWork.Coupons.GetActiveCouponsAsync();
                    var customers = _userManager.Users.Where(u => !string.IsNullOrEmpty(u.Email)).ToList();
                    
                    ViewBag.ActiveCoupons = activeCoupons;
                    ViewBag.Customers = customers;
                    
                    // Add error message to TempData
                    TempData["ErrorMessage"] = "Vui lòng kiểm tra lại thông tin và thử lại.";
                    return View(model);
                }

                // Manual validation
                if (model.CouponId <= 0)
                {
                    TempData["ErrorMessage"] = "Vui lòng chọn mã giảm giá.";
                    return RedirectToAction(nameof(SendCouponNotification));
                }

                var coupon = await _unitOfWork.Coupons.GetByIdAsync(model.CouponId);
                if (coupon == null)
                {
                    _logger.LogError("📧 Coupon not found with ID: {CouponId}", model.CouponId);
                    TempData["ErrorMessage"] = "Không tìm thấy mã giảm giá.";
                    return RedirectToAction(nameof(SendCouponNotification));
                }

                _logger.LogInformation("📧 Found coupon: {CouponCode} - {CouponName}", coupon.Code, coupon.Name);

                // Get customer emails
                List<string> emailsToSend = new List<string>();
                
                if (model.SendToAllCustomers)
                {
                    // Send to all customers with email
                    emailsToSend = _userManager.Users
                        .Where(u => !string.IsNullOrEmpty(u.Email))
                        .Select(u => u.Email)
                        .ToList();
                    _logger.LogInformation("📧 Sending to all customers: {Count} emails", emailsToSend.Count);
                }
                else if (model.CustomerEmails != null && model.CustomerEmails.Any())
                {
                    // Send to selected customers
                    emailsToSend = model.CustomerEmails.Where(e => !string.IsNullOrEmpty(e)).ToList();
                    _logger.LogInformation("📧 Sending to selected customers: {Count} emails", emailsToSend.Count);
                }
                else
                {
                    TempData["ErrorMessage"] = "Vui lòng chọn ít nhất một khách hàng hoặc chọn 'Gửi cho tất cả khách hàng'.";
                    return RedirectToAction(nameof(SendCouponNotification));
                }

                if (!emailsToSend.Any())
                {
                    TempData["ErrorMessage"] = "Không có email khách hàng nào để gửi.";
                    return RedirectToAction(nameof(SendCouponNotification));
                }

                int successCount = 0;
                int failCount = 0;

                foreach (var customerEmail in emailsToSend)
                {
                    try
                    {
                        _logger.LogInformation("📧 Processing email: {Email}", customerEmail);
                        
                        var customer = await _userManager.FindByEmailAsync(customerEmail);
                        var customerName = customer?.FirstName ?? customer?.UserName ?? "Khách hàng";

                        _logger.LogInformation("📧 Customer name: {CustomerName}", customerName);

                        var emailSent = await _emailService.SendCouponEmailAsync(
                            customerEmail, 
                            customerName, 
                            coupon, 
                            model.CampaignType
                        );

                        if (emailSent)
                        {
                            successCount++;
                            _logger.LogInformation("✅ Coupon notification sent successfully to {Email} for coupon {CouponCode}", 
                                customerEmail, coupon.Code);
                        }
                        else
                        {
                            failCount++;
                            _logger.LogWarning("❌ Failed to send coupon notification to {Email} for coupon {CouponCode}", 
                                customerEmail, coupon.Code);
                        }
                    }
                    catch (Exception ex)
                    {
                        failCount++;
                        _logger.LogError(ex, "❌ Error sending coupon notification to {Email} for coupon {CouponCode}", 
                            customerEmail, coupon.Code);
                    }
                }

                _logger.LogInformation("📧 Email sending completed. Success: {SuccessCount}, Failed: {FailCount}", successCount, failCount);

                if (successCount > 0)
                {
                    TempData["SuccessMessage"] = $"Đã gửi thông báo mã giảm giá {coupon.Code} thành công cho {successCount} khách hàng.";
                }
                
                if (failCount > 0)
                {
                    TempData["ErrorMessage"] = $"Có {failCount} email không gửi được. Vui lòng kiểm tra lại cấu hình email.";
                }

                return RedirectToAction(nameof(SendCouponNotification));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in SendCouponNotification action");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi gửi thông báo mã giảm giá.";
                return RedirectToAction(nameof(SendCouponNotification));
            }
        }

        // POST: Admin/CouponsAdmin/SendBulkCouponNotification
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendBulkCouponNotification(int couponId, string campaignType = "general")
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                if (coupon == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy mã giảm giá." });
                }

                // Lấy tất cả khách hàng có email
                var customers = _userManager.Users.Where(u => !string.IsNullOrEmpty(u.Email)).ToList();

                int successCount = 0;
                int failCount = 0;

                foreach (var customer in customers)
                {
                    try
                    {
                        var customerName = customer.FirstName ?? customer.UserName ?? "Khách hàng";
                        
                        var emailSent = await _emailService.SendCouponEmailAsync(
                            customer.Email, 
                            customerName, 
                            coupon, 
                            campaignType
                        );

                        if (emailSent)
                        {
                            successCount++;
                        }
                        else
                        {
                            failCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        failCount++;
                        _logger.LogError(ex, "Error sending bulk coupon notification to {Email}", customer.Email);
                    }
                }

                return Json(new { 
                    success = true, 
                    message = $"Đã gửi thông báo mã giảm giá {coupon.Code} cho {successCount} khách hàng thành công.",
                    successCount = successCount,
                    failCount = failCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending bulk coupon notifications");
                return Json(new { success = false, message = "Có lỗi xảy ra khi gửi thông báo hàng loạt." });
            }
        }

        // POST: Admin/CouponsAdmin/SendTestCouponEmail
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendTestCouponEmail(int couponId, string testEmail, string campaignType = "general")
        {
            try
            {
                var coupon = await _unitOfWork.Coupons.GetByIdAsync(couponId);
                if (coupon == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy mã giảm giá." });
                }

                var emailSent = await _emailService.SendCouponEmailAsync(
                    testEmail, 
                    "Test User", 
                    coupon, 
                    campaignType
                );

                if (emailSent)
                {
                    _logger.LogInformation("Test coupon email sent successfully to {Email} for coupon {CouponCode}", 
                        testEmail, coupon.Code);
                    return Json(new { success = true, message = "Email test đã được gửi thành công!" });
                }
                else
                {
                    _logger.LogWarning("Failed to send test coupon email to {Email} for coupon {CouponCode}", 
                        testEmail, coupon.Code);
                    return Json(new { success = false, message = "Không thể gửi email test. Vui lòng kiểm tra cấu hình email." });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test coupon email to {Email} for coupon {CouponId}", 
                    testEmail, couponId);
                return Json(new { success = false, message = "Có lỗi xảy ra khi gửi email test." });
            }
        }

        // GET: Admin/CouponsAdmin/TestEmailConfig
        public IActionResult TestEmailConfig()
        {
            try
            {
                var config = new
                {
                    Provider = _configuration["Email:Provider"] ?? "not specified",
                    SmtpServer = _configuration["Email:SmtpServer"] ?? "not configured",
                    Sender = _configuration["Email:Sender"] ?? "not specified",
                    SenderName = _configuration["Email:SenderName"] ?? "not specified",
                    SmtpPort = _configuration["Email:SmtpPort"] ?? "not configured",
                    Username = _configuration["Email:Username"] ?? "not configured",
                    HasPassword = !string.IsNullOrEmpty(_configuration["Email:Password"]),
                    EnableSsl = _configuration["Email:EnableSsl"] ?? "not specified"
                };

                _logger.LogInformation("📧 Email Configuration Test:");
                _logger.LogInformation("  Provider: {Provider}", config.Provider);
                _logger.LogInformation("  SMTP Server: {SmtpServer}", config.SmtpServer);
                _logger.LogInformation("  Sender: {Sender}", config.Sender);
                _logger.LogInformation("  Sender Name: {SenderName}", config.SenderName);
                _logger.LogInformation("  SMTP Port: {SmtpPort}", config.SmtpPort);
                _logger.LogInformation("  Username: {Username}", config.Username);
                _logger.LogInformation("  Has Password: {HasPassword}", config.HasPassword);
                _logger.LogInformation("  Enable SSL: {EnableSsl}", config.EnableSsl);

                return Json(new { success = true, config = config });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error testing email configuration");
                return Json(new { success = false, error = ex.Message });
            }
        }

        // Helper Methods
        private async Task<bool> IsCouponCodeUniqueAsync(string code)
        {
            var existingCoupon = await _unitOfWork.Coupons.GetCouponByCodeAsync(code);
            return existingCoupon == null;
        }

        private void LoadCouponTypesToViewBag()
        {
            ViewBag.CouponTypes = Enum.GetValues<CouponType>()
                .Select(t => new SelectListItem
                {
                    Value = ((int)t).ToString(),
                    Text = GetCouponTypeDisplayName(t)
                });
        }

        private void LoadApplicationTypesToViewBag()
        {
            ViewBag.ApplicationTypes = Enum.GetValues<DiscountApplicationType>()
                .Select(t => new SelectListItem
                {
                    Value = ((int)t).ToString(),
                    Text = GetApplicationTypeDisplayName(t)
                });
        }

        private string GetCouponTypeDisplayName(CouponType type)
        {
            return type switch
            {
                CouponType.Percentage => "Giảm theo phần trăm (%)",
                CouponType.FixedAmount => "Giảm số tiền cố định (VNĐ)",
                CouponType.FreeShipping => "Miễn phí vận chuyển",
                CouponType.BuyOneGetOne => "Mua 1 tặng 1",
                CouponType.FixedPriceDiscount => "Giảm giá cố định cho sản phẩm",
                _ => type.ToString()
            };
        }

        private string GetApplicationTypeDisplayName(DiscountApplicationType type)
        {
            return type switch
            {
                DiscountApplicationType.All => "Toàn bộ đơn hàng",
                DiscountApplicationType.Category => "Theo danh mục",
                DiscountApplicationType.Product => "Sản phẩm cụ thể",
                DiscountApplicationType.AgedInventory => "Hàng tồn kho lâu",
                DiscountApplicationType.FirstTimeCustomer => "Khách hàng mới",
                DiscountApplicationType.LoyalCustomer => "Khách hàng thân thiết",
                _ => type.ToString()
            };
        }
    }
}
