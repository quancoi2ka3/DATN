using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SunMovement.Core.Models;
using SunMovement.Core.Interfaces;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class CouponsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICouponService _couponService;
        private readonly ILogger<CouponsAdminController> _logger;

        public CouponsAdminController(
            IUnitOfWork unitOfWork, 
            ICouponService couponService,
            ILogger<CouponsAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _couponService = couponService;
            _logger = logger;
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
