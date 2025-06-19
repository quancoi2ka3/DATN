using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/uploads")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UploadsController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public UploadsController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }        // POST: api/uploads/product
        [HttpPost("product")]
        public async Task<ActionResult<UploadResult>> UploadProductImage(IFormFile file)
        {
            var result = await UploadFile(file, "products");
            if (result == null)
            {
                return BadRequest("No file uploaded or invalid file");
            }
            return result;
        }        // POST: api/uploads/service
        [HttpPost("service")]
        public async Task<ActionResult<UploadResult>> UploadServiceImage(IFormFile file)
        {
            var result = await UploadFile(file, "services");
            if (result == null)
            {
                return BadRequest("No file uploaded or invalid file");
            }
            return result;
        }        // POST: api/uploads/event
        [HttpPost("event")]
        public async Task<ActionResult<UploadResult>> UploadEventImage(IFormFile file)
        {
            var result = await UploadFile(file, "events");
            if (result == null)
            {
                return BadRequest("No file uploaded or invalid file");
            }
            return result;
        }        // POST: api/uploads/article
        [HttpPost("article")]
        public async Task<ActionResult<UploadResult>> UploadArticleImage(IFormFile file)
        {
            var result = await UploadFile(file, "articles");
            if (result == null)
            {
                return BadRequest("No file uploaded or invalid file");
            }
            return result;
        }

        // POST: api/uploads/gallery
        [HttpPost("gallery")]
        public async Task<ActionResult<List<UploadResult>>> UploadGalleryImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files uploaded");
            }

            var results = new List<UploadResult>();

            foreach (var file in files)
            {
                var result = await UploadFile(file, "gallery");
                if (result != null)
                {
                    results.Add(result);
                }
            }

            return results;
        }

        // DELETE: api/uploads
        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("File name is required");
            }

            var result = await _fileUploadService.DeleteFileAsync(fileName);

            if (result)
            {
                return Ok();
            }
            
            return NotFound("File not found or could not be deleted");
        }        private async Task<UploadResult?> UploadFile(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!Array.Exists(allowedExtensions, ext => ext == fileExtension))
            {
                throw new InvalidOperationException("Invalid file type. Only image files are allowed.");
            }
            
            // Upload file
            var fileName = await _fileUploadService.UploadFileAsync(file, folder);
            
            return new UploadResult
            {
                FileName = fileName,
                FileUrl = $"/uploads/{folder}/{fileName}"
            };
        }
    }
}
