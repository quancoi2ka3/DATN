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
        }        public async Task<IActionResult> Index()
        {
            // Get all orders with payment information
            var orders = await _unitOfWork.Orders.GetAllAsync();
            
            ViewBag.TotalRevenue = orders.Where(o => o.IsPaid).Sum(o => o.TotalAmount);
            ViewBag.PendingPayments = orders.Count(o => o.Status == OrderStatus.Pending && !o.IsPaid);
            ViewBag.CompletedPayments = orders.Count(o => o.IsPaid);
            ViewBag.FailedPayments = orders.Count(o => o.Status == OrderStatus.Cancelled);
            ViewBag.VNPayPayments = orders.Count(o => o.PaymentMethod == "vnpay");
            ViewBag.CODPayments = orders.Count(o => o.PaymentMethod == "cash_on_delivery");
            ViewBag.BankTransferPayments = orders.Count(o => o.PaymentMethod == "bank_transfer");

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
        }        [HttpPost]
        public async Task<IActionResult> UpdatePaymentStatus(int id, OrderStatus status, bool isPaid = false)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;
            order.IsPaid = isPaid;
            order.UpdatedAt = DateTime.UtcNow;
            
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            TempData["Success"] = "Payment status updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmPayment(int id, string? transactionId = null)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.IsPaid = true;
            order.Status = OrderStatus.Processing;
            order.UpdatedAt = DateTime.UtcNow;
            
            if (!string.IsNullOrEmpty(transactionId))
            {
                order.PaymentTransactionId = transactionId;
            }
            
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            TempData["Success"] = "Payment confirmed successfully.";
            return RedirectToAction(nameof(Details), new { id });
        }
    }
}
