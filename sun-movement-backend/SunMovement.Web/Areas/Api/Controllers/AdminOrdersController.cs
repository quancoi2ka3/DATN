using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Route("api/admin/orders")]
    [ApiController]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminOrdersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{id}/update-status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { success = false, error = "Order not found" });
                }

                var oldStatus = order.Status;
                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;

                // Đồng bộ trạng thái thanh toán theo trạng thái đơn hàng (chuẩn TMĐT)
                switch (request.Status)
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
                        // Đơn hàng bị hủy - xử lý hoàn tiền
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
                        // Trạng thái chờ - giữ nguyên trạng thái thanh toán hiện tại
                        break;
                }

                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.CompleteAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = $"Order status updated from {oldStatus} to {request.Status}",
                    order = new 
                    {
                        id = order.Id,
                        status = order.Status.ToString().ToLower(),
                        paymentStatus = order.PaymentStatus.ToString().ToLower(),
                        isPaid = order.IsPaid,
                        updatedAt = order.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }

    public class UpdateOrderStatusRequest
    {
        public OrderStatus Status { get; set; }
    }
}
