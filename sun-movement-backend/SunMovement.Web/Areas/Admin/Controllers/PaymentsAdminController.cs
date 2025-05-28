using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class PaymentsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentsAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            // Get all orders with payment information
            var orders = await _unitOfWork.Orders.GetAllAsync();
              ViewBag.TotalRevenue = orders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount);
            ViewBag.PendingPayments = orders.Count(o => o.Status == OrderStatus.Pending);
            ViewBag.CompletedPayments = orders.Count(o => o.Status == OrderStatus.Delivered);
            ViewBag.FailedPayments = orders.Count(o => o.Status == OrderStatus.Cancelled);

            return View(orders.OrderByDescending(o => o.OrderDate));
        }

        public async Task<IActionResult> Details(int id)
        {
            var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return View(order);
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePaymentStatus(int id, OrderStatus status)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            TempData["Success"] = "Payment status updated successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}
