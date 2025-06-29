using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Web.Areas.Admin.Models;
using System;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class IntegratedSystemController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;
        private readonly ICouponService _couponService;
        private readonly ILogger<IntegratedSystemController> _logger;
        
        public IntegratedSystemController(
            IUnitOfWork unitOfWork,
            IProductService productService,
            IInventoryService inventoryService,
            ICouponService couponService,
            ILogger<IntegratedSystemController> logger)
        {
            _unitOfWork = unitOfWork;
            _productService = productService;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _logger = logger;
        }
        
        // GET: Admin/IntegratedSystem/Index
        public async Task<IActionResult> Index()
        {
            try
            {
                var viewModel = new IntegratedSystemViewModel
                {
                    TotalProducts = await _unitOfWork.Products.CountAsync(),
                    TotalOrders = await _unitOfWork.Orders.CountAsync(),
                    LowStockProducts = await _inventoryService.GetLowStockProductsAsync(),
                    OutOfStockProducts = await _inventoryService.GetOutOfStockProductsAsync(),
                    TotalInventoryValue = await _inventoryService.GetTotalInventoryValueAsync(),
                    ActiveCoupons = await _couponService.GetAllActiveCouponsAsync()
                };
                
                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tải trang tích hợp hệ thống");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dữ liệu";
                return View(new IntegratedSystemViewModel());
            }
        }
        
        // GET: Admin/IntegratedSystem/InventoryDashboard
        public async Task<IActionResult> InventoryDashboard()
        {
            try
            {
                var lowStockProducts = await _inventoryService.GetLowStockProductsAsync();
                var inventoryValue = await _inventoryService.GetTotalInventoryValueAsync();
                
                ViewBag.LowStockCount = lowStockProducts.Count();
                ViewBag.TotalInventoryValue = inventoryValue.ToString("N0");
                
                return View(lowStockProducts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tải trang tổng quan kho hàng");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dữ liệu kho hàng";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/IntegratedSystem/ProductCoupons
        public async Task<IActionResult> ProductCoupons()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                var coupons = await _couponService.GetAllActiveCouponsAsync();
                
                var viewModel = new ProductCouponMappingViewModel
                {
                    Products = products.Take(20).ToList(),
                    Coupons = coupons.ToList()
                };
                
                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tải trang quản lý mã giảm giá và sản phẩm");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dữ liệu";
                return RedirectToAction(nameof(Index));
            }
        }
        
        // GET: Admin/IntegratedSystem/BatchInventoryUpdate
        public async Task<IActionResult> BatchInventoryUpdate()
        {
            try
            {
                var products = await _unitOfWork.Products.GetAllAsync();
                return View(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tải trang cập nhật kho hàng hàng loạt");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dữ liệu";
                return RedirectToAction(nameof(Index));
            }
        }
    }
}
