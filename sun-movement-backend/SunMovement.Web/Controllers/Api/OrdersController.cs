using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrdersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            IEnumerable<Order> orders;

            if (User.IsInRole("Admin"))
            {
                orders = await _unitOfWork.Orders.GetAllAsync();
            }
            else
            {
                orders = await _unitOfWork.Orders.FindAsync(o => o.UserId == userId);
            }

            return Ok(orders);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (order.UserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            return Ok(order);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            order.UserId = userId;
            order.OrderDate = DateTime.UtcNow;
            order.Status = OrderStatus.Pending;
            
            // Calculate total amount
            order.TotalAmount = order.Items?.Sum(item => item.Subtotal) ?? 0;

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/orders/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatus status)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;
            
            // Set dates based on status
            if (status == OrderStatus.Shipped && !order.ShippedDate.HasValue)
            {
                order.ShippedDate = DateTime.UtcNow;
            }
            else if (status == OrderStatus.Delivered && !order.DeliveredDate.HasValue)
            {
                order.DeliveredDate = DateTime.UtcNow;
            }

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // PUT: api/orders/5/tracking
        [HttpPut("{id}/tracking")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTrackingNumber(int id, [FromBody] string trackingNumber)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.TrackingNumber = trackingNumber;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // PUT: api/orders/5/payment
        [HttpPut("{id}/payment")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePaymentInfo(int id, [FromBody] PaymentInfo paymentInfo)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.PaymentMethod = paymentInfo.PaymentMethod;
            order.PaymentTransactionId = paymentInfo.TransactionId;
            order.IsPaid = paymentInfo.IsPaid;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }

    public class PaymentInfo
    {
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public bool IsPaid { get; set; }
    }
}
