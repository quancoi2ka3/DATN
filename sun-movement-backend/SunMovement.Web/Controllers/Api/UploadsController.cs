using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Services;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/uploads")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UploadsController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public UploadsController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        // POST: api/uploads/product
        [HttpPost("product")]
        public async Task<ActionResult<UploadResult>> UploadProductImage(IFormFile file)
        {
            return await UploadFile(file, "products");
        }

        // POST: api/uploads/service
        [HttpPost("service")]
        public async Task<ActionResult<UploadResult>> UploadServiceImage(IFormFile file)
        {
            return await UploadFile(file, "services");
        }

        // POST: api/uploads/event
        [HttpPost("event")]
        public async Task<ActionResult<UploadResult>> UploadEventImage(IFormFile file)
        {
            return await UploadFile(file, "events");
        }

        // DELETE: api/uploads
        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromQuery] string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return BadRequest("File path is required");
            }

            var result = await _fileUploadService.DeleteFileAsync(filePath);
            if (result)
            {
                return NoContent();
            }
            else
            {
                return NotFound("File not found or could not be deleted");
            }
        }

        private async Task<ActionResult<UploadResult>> UploadFile(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            try
            {
                var filePath = await _fileUploadService.UploadFileAsync(file, folder);
                return new UploadResult
                {
                    FileName = Path.GetFileName(filePath),
                    FilePath = filePath,
                    FileSize = file.Length,
                    Success = true
                };
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new UploadResult
                {
                    Error = ex.Message,
                    Success = false
                });
            }
            catch (IOException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new UploadResult
                {
                    Error = "An error occurred while uploading the file",
                    Success = false
                });
            }
        }
    }

    public class UploadResult
    {
        public bool Success { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public string Error { get; set; }
    }
}
