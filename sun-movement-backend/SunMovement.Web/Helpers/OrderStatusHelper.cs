using SunMovement.Core.Models;

namespace SunMovement.Web.Helpers
{
    public static class OrderStatusHelper
    {
        public static string GetVietnameseStatus(OrderStatus status)
        {
            return status switch
            {
                OrderStatus.Pending => "Chờ xử lý",
                OrderStatus.AwaitingPayment => "Chờ thanh toán", 
                OrderStatus.Paid => "Đã thanh toán",
                OrderStatus.Processing => "Đang xử lý",
                OrderStatus.AwaitingFulfillment => "Đang đóng gói",
                OrderStatus.Shipped => "Đã giao vận",
                OrderStatus.PartiallyShipped => "Giao một phần",
                OrderStatus.Delivered => "Đã giao hàng",
                OrderStatus.Completed => "Hoàn thành",
                OrderStatus.Cancelled => "Đã hủy",
                OrderStatus.Refunded => "Đã hoàn tiền",
                OrderStatus.ReturnRequested => "Yêu cầu trả hàng",
                OrderStatus.ReturnProcessed => "Đã xử lý trả hàng",
                OrderStatus.Failed => "Thất bại",
                OrderStatus.OnHold => "Tạm giữ",
                _ => status.ToString()
            };
        }

        public static string GetVietnamesePaymentStatus(PaymentStatus paymentStatus)
        {
            return paymentStatus switch
            {
                PaymentStatus.Pending => "Chờ thanh toán",
                PaymentStatus.Paid => "Đã thanh toán", 
                PaymentStatus.Failed => "Thanh toán thất bại",
                PaymentStatus.Cancelled => "Đã hủy thanh toán",
                PaymentStatus.Refunded => "Đã hoàn tiền",
                PaymentStatus.PartiallyRefunded => "Hoàn tiền một phần",
                _ => paymentStatus.ToString()
            };
        }

        public static string GetStatusCssClass(OrderStatus status)
        {
            return status switch
            {
                OrderStatus.Pending => "bg-secondary text-white",
                OrderStatus.AwaitingPayment => "bg-warning",
                OrderStatus.Paid => "bg-info",
                OrderStatus.Processing => "bg-primary text-white",
                OrderStatus.AwaitingFulfillment => "bg-primary text-white",
                OrderStatus.Shipped => "bg-primary text-white",
                OrderStatus.PartiallyShipped => "bg-info text-white",
                OrderStatus.Delivered => "bg-success text-white",
                OrderStatus.Completed => "bg-success text-white",
                OrderStatus.Cancelled => "bg-danger text-white",
                OrderStatus.Refunded => "bg-warning text-dark",
                OrderStatus.Failed => "bg-danger text-white",
                OrderStatus.OnHold => "bg-secondary text-white",
                _ => "bg-secondary"
            };
        }
    }
}
