using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/diagnostics")]
    [ApiController]
    public class DiagnosticsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _dbContext;
        
        public DiagnosticsController(IUnitOfWork unitOfWork, ApplicationDbContext dbContext)
        {
            _unitOfWork = unitOfWork;
            _dbContext = dbContext;
        }
        
        [HttpGet("test")]
        public async Task<IActionResult> TestApi()
        {
            var result = new
            {
                timestamp = DateTime.UtcNow,
                status = "success",
                serverInfo = new 
                {
                    dateTime = DateTime.Now.ToString(),
                    serverTimeUtc = DateTime.UtcNow.ToString(),
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
                },
                apiStatus = "operational"
            };
            
            return Ok(result);
        }
        
        [HttpGet("database")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                // Test database connection with basic query
                bool canConnect = await _dbContext.Database.CanConnectAsync();
                
                // Try to get counts of various entities
                int productCount = 0;
                int serviceCount = 0;
                int faqCount = 0;
                int eventCount = 0;
                
                if (canConnect)
                {
                    try { productCount = await _unitOfWork.Products.CountAsync(); } catch { }
                    try { serviceCount = await _unitOfWork.Services.CountAsync(); } catch { }
                    try { faqCount = await _unitOfWork.FAQs.CountAsync(); } catch { }
                }
                
                var result = new
                {
                    timestamp = DateTime.UtcNow,
                    databaseConnection = canConnect ? "success" : "failed",
                    entities = new
                    {
                        products = productCount,
                        services = serviceCount,
                        faqs = faqCount
                    }
                };
                
                if (!canConnect)
                {
                    return StatusCode(500, new { error = "Database connection failed", details = result });
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    error = "Database test failed", 
                    message = ex.Message,
                    innerException = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
        
        [HttpGet("clear-cache")]
        public IActionResult ClearCache()
        {
            try
            {
                // Clear all repository caches
                _unitOfWork.ClearCache();
                
                return Ok(new { status = "success", message = "Cache cleared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to clear cache", message = ex.Message });
            }
        }
    }
}
