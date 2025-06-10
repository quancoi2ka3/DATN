using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using SunMovement.Core.Interfaces;

namespace SunMovement.Core.Services
{public class FileUploadService : IFileUploadService
    {
        private readonly IHostEnvironment _environment;
        private readonly ILogger<FileUploadService> _logger;

        public FileUploadService(IHostEnvironment environment, ILogger<FileUploadService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                // Create folder if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", folder);
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Generate a unique filename
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return the relative path to be stored in the database
                // Ensure we use forward slashes for web paths
                return $"/uploads/{folder}/{fileName}";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading file: {ex.Message}");
                throw;
            }
        }

        public Task<bool> DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return Task.FromResult(false);
            }

            try
            {                // Get physical path from relative URL
                var relativePath = filePath.TrimStart('/');
                var fullPath = Path.Combine(_environment.ContentRootPath, "wwwroot", relativePath);

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    _logger.LogInformation($"File deleted successfully: {filePath}");
                    return Task.FromResult(true);
                }
                
                _logger.LogWarning($"File not found for deletion: {filePath}");
                return Task.FromResult(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting file: {ex.Message}");                return Task.FromResult(false);
            }
        }

        public async Task<string> UploadProductImageAsync(IFormFile imageFile)
        {
            return await UploadFileAsync(imageFile, "products");
        }

        public async Task<string> UploadServiceImageAsync(IFormFile imageFile)
        {
            return await UploadFileAsync(imageFile, "services");
        }

        public async Task<string> UploadEventImageAsync(IFormFile imageFile)
        {
            return await UploadFileAsync(imageFile, "events");
        }
    }
}
