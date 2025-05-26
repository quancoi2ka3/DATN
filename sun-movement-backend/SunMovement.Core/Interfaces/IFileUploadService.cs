using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string fileName);
        Task<string> UploadProductImageAsync(IFormFile imageFile);
        Task<string> UploadServiceImageAsync(IFormFile imageFile);
        Task<string> UploadEventImageAsync(IFormFile imageFile);
    }
}
