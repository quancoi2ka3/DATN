using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    public class PaymentsAdminController : BaseAdminController
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
            order.UpdatedAt = DateTime.UtcNow;
            
            // Logic cập nhật thanh toán theo trạng thái đơn hàng
            switch (status)
            {
                case OrderStatus.Completed:
                case OrderStatus.Delivered:
                case OrderStatus.Shipped:
                case OrderStatus.Processing:
                    // Các trạng thái này yêu cầu đã thanh toán
                    order.IsPaid = true;
                    order.PaymentStatus = PaymentStatus.Paid;
                    if (order.PaymentDate == null)
                    {
                        order.PaymentDate = DateTime.UtcNow;
                    }
                    break;
                    
                case OrderStatus.Cancelled:
                    // Đơn hàng bị hủy - có thể cần hoàn tiền
                    if (order.IsPaid)
                    {
                        order.PaymentStatus = PaymentStatus.Refunded;
                    }
                    else
                    {
                        order.PaymentStatus = PaymentStatus.Cancelled;
                    }
                    break;
                    
                case OrderStatus.Pending:
                case OrderStatus.AwaitingPayment:
                    // Trạng thái chờ - chưa thanh toán
                    order.IsPaid = isPaid; // Sử dụng giá trị được truyền vào
                    order.PaymentStatus = isPaid ? PaymentStatus.Paid : PaymentStatus.Pending;
                    break;
                    
                default:
                    // Giữ nguyên trạng thái thanh toán hiện tại hoặc sử dụng giá trị được truyền
                    order.IsPaid = isPaid;
                    break;
            }
            
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
            order.PaymentStatus = PaymentStatus.Paid; // Đồng bộ PaymentStatus
            order.Status = OrderStatus.Processing;
            order.UpdatedAt = DateTime.UtcNow;
            order.PaymentDate = DateTime.UtcNow; // Cập nhật thời gian thanh toán
            
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
