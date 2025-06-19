using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/[controller]")]
    [ApiController]
    public class VNPayController : ControllerBase
    {
        private readonly IVNPayService _vnpayService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<VNPayController> _logger;

        public VNPayController(
            IVNPayService vnpayService,
            IUnitOfWork unitOfWork,
            ILogger<VNPayController> logger)
        {
            _vnpayService = vnpayService;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("return")]
        public async Task<IActionResult> PaymentReturn()
        {
            try
            {
                var result = await _vnpayService.ProcessPaymentReturn(Request.Query);
                
                if (result.IsSuccess)
                {
                    // Update order status
                    if (int.TryParse(result.OrderId, out var orderId))
                    {
                        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
                        if (order != null)
                        {
                            order.IsPaid = true;
                            order.PaymentTransactionId = result.TransactionId;
                            order.Status = OrderStatus.Processing;
                            order.UpdatedAt = DateTime.UtcNow;
                            
                            await _unitOfWork.Orders.UpdateAsync(order);
                            
                            _logger.LogInformation($"Order {orderId} payment confirmed via VNPay. Transaction ID: {result.TransactionId}");
                        }
                    }
                    
                    // Redirect to success page
                    return Redirect($"/payment/success?orderId={result.OrderId}&transactionId={result.TransactionId}");
                }
                else
                {
                    _logger.LogWarning($"VNPay payment failed for order {result.OrderId}: {result.Message}");
                    return Redirect($"/payment/failed?orderId={result.OrderId}&message={Uri.EscapeDataString(result.Message)}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing VNPay payment return");
                return Redirect("/payment/error");
            }
        }

        [HttpPost("ipn")]
        public async Task<IActionResult> PaymentIPN()
        {
            try
            {
                var isValid = await _vnpayService.ValidatePaymentCallback(Request.Query);
                
                if (isValid)
                {
                    var result = await _vnpayService.ProcessPaymentReturn(Request.Query);
                    
                    if (result.IsSuccess && int.TryParse(result.OrderId, out var orderId))
                    {
                        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
                        if (order != null && !order.IsPaid)
                        {
                            order.IsPaid = true;
                            order.PaymentTransactionId = result.TransactionId;
                            order.Status = OrderStatus.Processing;
                            order.UpdatedAt = DateTime.UtcNow;
                            
                            await _unitOfWork.Orders.UpdateAsync(order);
                            
                            _logger.LogInformation($"Order {orderId} payment confirmed via VNPay IPN. Transaction ID: {result.TransactionId}");
                        }
                    }
                    
                    return Ok(new { RspCode = "00", Message = "Confirm Success" });
                }
                else
                {
                    _logger.LogWarning("Invalid VNPay IPN callback received");
                    return Ok(new { RspCode = "97", Message = "Invalid Signature" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing VNPay IPN");
                return Ok(new { RspCode = "99", Message = "Unknown Error" });
            }
        }
    }
}
