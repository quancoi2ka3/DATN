using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public OrdersController(IUnitOfWork unitOfWork, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            IEnumerable<Order> orders;

            if (User.IsInRole("Admin"))
            {
                // Admins can see all orders
                orders = await _unitOfWork.Orders.GetAllAsync();
            }
            else
            {
                // Regular users can only see their own orders
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                orders = await _unitOfWork.Orders.GetOrdersByUserIdAsync(userId);
            }

            return Ok(orders);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            // Only allow admins or the user who placed the order to view it
            if (!User.IsInRole("Admin") && order.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return Forbid();
            }

            return order;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderCreateModel orderModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate product availability and prices
            foreach (var item in orderModel.Items)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {item.ProductId} not found");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest($"Not enough stock for product {product.Name}");
                }

                // Deduct from inventory
                product.StockQuantity -= item.Quantity;
                await _unitOfWork.Products.UpdateAsync(product);
            }            // Create the order
            var order = new Order
            {
                UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,
                Email = orderModel.Email,
                PhoneNumber = orderModel.Phone, // Changed from Phone to PhoneNumber to match the Order model
                ShippingAddress = orderModel.ShippingAddress,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                TotalAmount = orderModel.TotalAmount
            };

            await _unitOfWork.Orders.AddAsync(order);

            // Create order items
            foreach (var item in orderModel.Items)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    UnitPrice = product.DiscountPrice ?? product.Price,
                    Subtotal = (product.DiscountPrice ?? product.Price) * item.Quantity
                };

                await _unitOfWork.OrderItems.AddAsync(orderItem);
            }

            // Send confirmation email
            try
            {
                await _emailService.SendOrderConfirmationAsync(order);
            }
            catch (Exception)
            {
                // Log error but don't return it to client
            }

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/orders/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, OrderStatusUpdateModel model)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = model.Status;
            order.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Orders.UpdateAsync(order);

            // Send status update email
            try
            {
                await _emailService.SendOrderStatusUpdateAsync(order);
            }
            catch (Exception)
            {
                // Log error but don't return it to client
            }

            return NoContent();
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            await _unitOfWork.Orders.DeleteAsync(order);

            return NoContent();
        }
    }
}
