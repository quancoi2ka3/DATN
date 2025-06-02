using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class OrdersAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrdersAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

                    // Update properties
                    existingOrder.Status = order.Status;
                    existingOrder.ShippingAddress = order.ShippingAddress;
                    existingOrder.PhoneNumber = order.PhoneNumber;
                    existingOrder.Email = order.Email;
                    existingOrder.PaymentMethod = order.PaymentMethod;
                    existingOrder.IsPaid = order.IsPaid;
                    existingOrder.TrackingNumber = order.TrackingNumber;
                    existingOrder.Notes = order.Notes;
                    existingOrder.UpdatedAt = DateTime.UtcNow;

                    // Update status-specific dates
                    if (order.Status == OrderStatus.Shipped && existingOrder.ShippedDate == null)
                    {
                        existingOrder.ShippedDate = DateTime.UtcNow;
                    }
                    else if (order.Status == OrderStatus.Delivered && existingOrder.DeliveredDate == null)
                    {
                        existingOrder.DeliveredDate = DateTime.UtcNow;
                    }

                    await _unitOfWork.Orders.UpdateAsync(existingOrder);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Order updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "An error occurred while updating the order: " + ex.Message);
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
    }
}