using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class OrdersAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInventoryService _inventoryService;
        private readonly ILogger<OrdersAdminController> _logger;

        public OrdersAdminController(
            IUnitOfWork unitOfWork, 
            IInventoryService inventoryService,
            ILogger<OrdersAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _inventoryService = inventoryService;
            _logger = logger;
        }

        // GET: Admin/Orders
        public async Task<IActionResult> Index(string searchString, OrderStatus? status, int page = 1, int pageSize = 20)
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();

            if (!string.IsNullOrEmpty(searchString))
            {
                orders = orders.Where(o => o.Id.ToString().Contains(searchString) ||
                                          o.Email.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                                          o.PhoneNumber.Contains(searchString, StringComparison.OrdinalIgnoreCase));
            }

            if (status.HasValue)
            {
                orders = orders.Where(o => o.Status == status.Value);
            }

            orders = orders.OrderByDescending(o => o.OrderDate);

            var totalCount = orders.Count();
            var pagedOrders = orders.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            ViewBag.SearchString = searchString;
            ViewBag.Status = status;
            ViewBag.OrderStatuses = Enum.GetValues<OrderStatus>();

            return View(pagedOrders);
        }

        // GET: Admin/Orders/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // GET: Admin/Orders/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            ViewBag.OrderStatuses = Enum.GetValues<OrderStatus>();
            return View(order);
        }

        // POST: Admin/Orders/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Order order)
        {
            if (id != order.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingOrder = await _unitOfWork.Orders.GetByIdAsync(id);
                    if (existingOrder == null)
                    {
                        return NotFound();
                    }

                    // Kiểm tra thay đổi trạng thái đơn hàng
                    var oldStatus = existingOrder.Status;
                    var newStatus = order.Status;
                    
                    // Update properties
                    existingOrder.Status = order.Status;
                    existingOrder.ShippingAddress = order.ShippingAddress;
                    existingOrder.PhoneNumber = order.PhoneNumber;
                    existingOrder.Email = order.Email;
                    existingOrder.PaymentMethod = order.PaymentMethod;

                    await _unitOfWork.Orders.UpdateAsync(existingOrder);
                    await _unitOfWork.CompleteAsync();

                    // Nếu chuyển sang trạng thái Đã giao, Đã thanh toán hoặc Hoàn thành, tự động giảm tồn kho
                    if ((newStatus == OrderStatus.Delivered || newStatus == OrderStatus.Completed || newStatus == OrderStatus.Paid) 
                        && oldStatus != OrderStatus.Delivered && oldStatus != OrderStatus.Completed && oldStatus != OrderStatus.Paid)
                    {
                        try
                        {
                            var inventoryResult = await _inventoryService.AdjustStockAfterOrderAsync(existingOrder.Id);
                            if (inventoryResult)
                            {
                                TempData["SuccessMessage"] = "Cập nhật đơn hàng thành công và đã điều chỉnh tồn kho.";
                            }
                            else
                            {
                                TempData["WarningMessage"] = "Cập nhật đơn hàng thành công nhưng có lỗi khi điều chỉnh tồn kho.";
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Lỗi khi điều chỉnh tồn kho cho đơn hàng {OrderId}", id);
                            TempData["WarningMessage"] = "Cập nhật đơn hàng thành công nhưng có lỗi khi điều chỉnh tồn kho.";
                        }
                    }
                    else
                    {
                        TempData["SuccessMessage"] = "Cập nhật đơn hàng thành công.";
                    }

                    return RedirectToAction(nameof(Details), new { id = order.Id });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi khi cập nhật đơn hàng {OrderId}", id);
                    ModelState.AddModelError("", "Có lỗi xảy ra khi cập nhật đơn hàng. " + ex.Message);
                }
            }

            ViewBag.OrderStatuses = Enum.GetValues<OrderStatus>();
            return View(order);
        }

        // POST: Admin/Orders/UpdateStatus/5
        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int id, OrderStatus status)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(id);
                if (order != null)
                {
                    var oldStatus = order.Status;
                    order.Status = status;
                    order.UpdatedAt = DateTime.UtcNow;

                    // Update status-specific dates
                    if (status == OrderStatus.Shipped && order.ShippedDate == null)
                    {
                        order.ShippedDate = DateTime.UtcNow;
                    }
                    else if (status == OrderStatus.Delivered && order.DeliveredDate == null)
                    {
                        order.DeliveredDate = DateTime.UtcNow;
                    }

                    await _unitOfWork.Orders.UpdateAsync(order);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, message = $"Order status updated from {oldStatus} to {status}" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Order not found" });
        }

        // GET: Admin/Orders/Search
        public async Task<IActionResult> Search(string query)
        {
            try
            {
                var orders = await _unitOfWork.Orders.GetAllAsync();

                if (!string.IsNullOrEmpty(query))
                {
                    orders = orders.Where(o => o.Id.ToString().Contains(query) ||
                                              o.Email.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                                              o.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                                              o.TrackingNumber != null && o.TrackingNumber.Contains(query, StringComparison.OrdinalIgnoreCase));
                }

                var searchResults = orders.OrderByDescending(o => o.OrderDate).Take(10).Select(o => new
                {
                    id = o.Id,
                    orderDate = o.OrderDate.ToString("yyyy-MM-dd HH:mm"),
                    email = o.Email,
                    totalAmount = o.TotalAmount.ToString("C"),
                    status = o.Status.ToString()
                });

                return Json(searchResults);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        // GET: Admin/Orders/Statistics
        public async Task<IActionResult> Statistics()
        {
            try
            {
                var orders = await _unitOfWork.Orders.GetAllAsync();
                var today = DateTime.Today;
                var thirtyDaysAgo = today.AddDays(-30);

                var stats = new
                {
                    TotalOrders = orders.Count(),
                    TodayOrders = orders.Count(o => o.OrderDate.Date == today),
                    MonthlyOrders = orders.Count(o => o.OrderDate >= thirtyDaysAgo),
                    TotalRevenue = orders.Where(o => o.IsPaid).Sum(o => o.TotalAmount),
                    MonthlyRevenue = orders.Where(o => o.IsPaid && o.OrderDate >= thirtyDaysAgo).Sum(o => o.TotalAmount),
                    PendingOrders = orders.Count(o => o.Status == OrderStatus.Pending),
                    ProcessingOrders = orders.Count(o => o.Status == OrderStatus.Processing),
                    ShippedOrders = orders.Count(o => o.Status == OrderStatus.Shipped),
                    DeliveredOrders = orders.Count(o => o.Status == OrderStatus.Delivered),
                    StatusBreakdown = orders.GroupBy(o => o.Status)
                                           .ToDictionary(g => g.Key.ToString(), g => g.Count())
                };

                return Json(stats);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        // GET: Admin/Orders/Dashboard
        public async Task<IActionResult> Dashboard()
        {
            try
            {
                var orders = await _unitOfWork.Orders.GetAllAsync();
                var recentOrders = orders.OrderByDescending(o => o.OrderDate).Take(10).ToList();

                ViewBag.RecentOrders = recentOrders;
                return View();
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Error loading dashboard: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/Orders/PrintInvoice/5
        public async Task<IActionResult> PrintInvoice(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // POST: Admin/Orders/Delete/5
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(id);
                if (order != null)
                {
                    // Only allow deletion of cancelled orders
                    if (order.Status != OrderStatus.Cancelled)
                    {
                        return Json(new { success = false, message = "Only cancelled orders can be deleted" });
                    }

                    await _unitOfWork.Orders.DeleteAsync(order);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, message = "Order deleted successfully" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Order not found" });
        }

        // GET: Admin/Orders/UpdateTracking/5
        public async Task<IActionResult> UpdateTracking(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // POST: Admin/Orders/UpdateTracking/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTracking(int id, string trackingNumber, string shippingMethod)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Cập nhật thông tin vận chuyển
            order.TrackingNumber = trackingNumber;
            order.ShippingMethod = shippingMethod;
            order.UpdatedAt = DateTime.UtcNow;

            // Nếu thêm mã vận đơn và đơn hàng chưa ở trạng thái vận chuyển, cập nhật trạng thái
            if (!string.IsNullOrEmpty(trackingNumber) && order.Status == OrderStatus.Processing)
            {
                order.Status = OrderStatus.Shipped;
                order.ShippedDate = DateTime.UtcNow;
            }

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            TempData["SuccessMessage"] = "Cập nhật thông tin vận chuyển thành công.";
            return RedirectToAction(nameof(Details), new { id = order.Id });
        }

        // GET: Admin/Orders/SendOrderNotification/5
        public async Task<IActionResult> SendOrderNotification(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // POST: Admin/Orders/SendOrderNotification
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendOrderNotification(int orderId, string emailSubject, string emailContent)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }

            try
            {
                // Xử lý gửi email thông báo (giả định có IEmailService được inject)
                // await _emailService.SendEmailAsync(order.Email, emailSubject, emailContent);

                // Nếu không có email service, hiển thị thông báo giả lập
                TempData["SuccessMessage"] = "Email thông báo đã được gửi đến khách hàng. (DEMO - Email chưa được gửi thực tế)";
                _logger.LogInformation("Email notification for order {OrderId} would be sent to {Email}", orderId, order.Email);

                return RedirectToAction(nameof(Details), new { id = orderId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gửi email thông báo cho đơn hàng {OrderId}", orderId);
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi gửi email thông báo: " + ex.Message;
                return RedirectToAction(nameof(SendOrderNotification), new { id = orderId });
            }
        }
    }
}