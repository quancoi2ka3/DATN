using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount);
        Task SendOrderConfirmationAsync(Order order);
        Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber);
        Task SendOrderStatusUpdateAsync(Order order);
        Task SendContactNotificationAsync(ContactMessage message);
        Task SendContactResponseAsync(string to, string subject, string message);
    }
}
