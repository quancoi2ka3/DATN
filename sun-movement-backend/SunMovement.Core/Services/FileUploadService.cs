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
            {
                throw new ArgumentException("File is empty or null");
            }

            // Validate file extension
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!Array.Exists(allowedExtensions, ext => ext.Equals(fileExtension)))
            {
                throw new ArgumentException("Invalid file type. Only image files are allowed.");
            }            // Create uploads folder structure if it doesn't exist
            var wwwrootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadsPath = Path.Combine(wwwrootPath, "uploads");
            var uploadsFolder = Path.Combine(uploadsPath, folder);
            
            // Make sure all directories in the path exist
            if (!Directory.Exists(wwwrootPath))
            {
                Directory.CreateDirectory(wwwrootPath);
                _logger.LogInformation("Created wwwroot directory");
            }
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
                _logger.LogInformation("Created uploads directory");
            }
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                _logger.LogInformation($"Created {folder} uploads directory");
            }

            // Generate unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file
            try
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                
                _logger.LogInformation($"File uploaded successfully: {uniqueFileName}");
                
                // Return relative path for storage in database
                return $"/uploads/{folder}/{uniqueFileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading file: {ex.Message}");
                throw new IOException("Error uploading file", ex);
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
