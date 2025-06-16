using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IEmailVerificationService
    {
        Task<string> GenerateVerificationCodeAsync(string email, UserRegistrationData userData);
        Task<bool> VerifyCodeAsync(string email, string code);
        Task<PendingUserRegistration?> GetVerificationDataAsync(string email);
        Task<bool> ResendVerificationCodeAsync(string email);
        Task CleanupExpiredVerificationsAsync();
        Task<bool> MarkVerificationCompletedAsync(string email);
    }
}
