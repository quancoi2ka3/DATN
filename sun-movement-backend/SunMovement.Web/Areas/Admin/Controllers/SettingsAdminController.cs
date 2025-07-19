using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using SunMovement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class SettingsAdminController : BaseAdminController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SettingsAdminController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public SettingsAdminController(
            IUnitOfWork unitOfWork,
            ILogger<SettingsAdminController> logger,
            UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _userManager = userManager;
        }

        // GET: Admin/SettingsAdmin
        public async Task<IActionResult> Index()
        {
            try
            {
                // Load system statistics
                var totalProducts = await _unitOfWork.Products.CountAsync();
                var totalServices = await _unitOfWork.Services.CountAsync();
                var totalOrders = await _unitOfWork.Orders.CountAsync();
                var totalCustomers = await _userManager.Users.CountAsync();

                ViewBag.TotalProducts = totalProducts;
                ViewBag.TotalServices = totalServices;
                ViewBag.TotalOrders = totalOrders;
                ViewBag.TotalCustomers = totalCustomers;

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading settings page");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải trang cài đặt.";
                return RedirectToAction("Index", "AdminDashboard", new { area = "Admin" });
            }
        }

        // GET: Admin/SettingsAdmin/DatabaseInfo
        public async Task<IActionResult> DatabaseInfo()
        {
            try
            {
                // Get database statistics
                var productCount = await _unitOfWork.Products.CountAsync();
                var serviceCount = await _unitOfWork.Services.CountAsync();
                var orderCount = await _unitOfWork.Orders.CountAsync();
                var userCount = await _userManager.Users.CountAsync();
                var supplierCount = await _unitOfWork.Suppliers.CountAsync();

                var dbInfo = new
                {
                    Products = productCount,
                    Services = serviceCount,
                    Orders = orderCount,
                    Users = userCount,
                    Suppliers = supplierCount,
                    LastUpdated = DateTime.UtcNow
                };

                ViewBag.DatabaseInfo = dbInfo;
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading database info");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin cơ sở dữ liệu.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/SettingsAdmin/ClearCache
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ClearCache()
        {
            try
            {
                _unitOfWork.ClearCache();
                TempData["SuccessMessage"] = "Đã xóa cache thành công.";
                _logger.LogInformation("Cache cleared by admin");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi xóa cache.";
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: Admin/SettingsAdmin/SystemInfo
        public IActionResult SystemInfo()
        {
            try
            {
                var systemInfo = new
                {
                    ServerTime = DateTime.UtcNow,
                    TimeZone = TimeZoneInfo.Local.DisplayName,
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                    Framework = Environment.Version.ToString(),
                    OS = Environment.OSVersion.ToString(),
                    MachineName = Environment.MachineName
                };

                ViewBag.SystemInfo = systemInfo;
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading system info");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải thông tin hệ thống.";
                return RedirectToAction(nameof(Index));
            }
        }
    }
} 