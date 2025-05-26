using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Api.Models
{
    /// <summary>
    /// A mock implementation of IFileUploadService that doesn't actually save files
    /// but returns mock URLs for API testing purposes.
    /// </summary>
    public class MockFileUploadService : IFileUploadService
    {
        private readonly ILogger<MockFileUploadService> _logger;

        public MockFileUploadService(ILogger<MockFileUploadService> logger)
        {
            _logger = logger;
        }

        public Task<bool> DeleteFileAsync(string fileName)
        {
            _logger.LogInformation($"Mock deleting file: {fileName}");
            return Task.FromResult(true);
        }

        public Task<string> UploadEventImageAsync(IFormFile imageFile)
        {
            return GenerateMockUrl(imageFile, "events");
        }

        public Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            return GenerateMockUrl(file, folder);
        }

        public Task<string> UploadProductImageAsync(IFormFile imageFile)
        {
            return GenerateMockUrl(imageFile, "products");
        }

        public Task<string> UploadServiceImageAsync(IFormFile imageFile)
        {
            return GenerateMockUrl(imageFile, "services");
        }        private Task<string> GenerateMockUrl(IFormFile file, string folder)
        {
            if (file == null)
            {
                _logger.LogWarning("Mock file upload attempted with null file");
                return Task.FromResult(string.Empty);
            }

            string fileName = file.FileName;
            string mockUrl = $"/uploads/{folder}/{Guid.NewGuid()}_{fileName}";
            _logger.LogInformation($"Mock file upload: {mockUrl}");
            
            return Task.FromResult(mockUrl);
        }
    }
}
