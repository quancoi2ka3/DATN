using SunMovement.Core.Models;
using Microsoft.AspNetCore.Http;

namespace SunMovement.Core.Interfaces
{
    public interface IVNPayService
    {
        Task<string> CreatePaymentUrl(Order order, HttpContext httpContext);
        Task<VNPayPaymentResult> ProcessPaymentReturn(IQueryCollection queryParams);
        Task<bool> ValidatePaymentCallback(IQueryCollection queryParams);
    }

    public class VNPayPaymentResult
    {
        public bool IsSuccess { get; set; }
        public string OrderId { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
    }
}
