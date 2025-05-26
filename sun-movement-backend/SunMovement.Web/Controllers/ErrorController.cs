using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using SunMovement.Web.Models;

namespace SunMovement.Web.Controllers
{
    public class ErrorController : Controller
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [Route("Error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index()
        {
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            var exception = exceptionHandlerPathFeature?.Error;
            
            if (exception != null)
            {
                _logger.LogError(exception, "Unhandled exception occurred");
            }

            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [Route("Error/{statusCode}")]
        public IActionResult StatusCodeHandler(int statusCode)
        {
            var statusCodeData = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            
            switch (statusCode)
            {
                case 404:
                    ViewBag.ErrorMessage = "Sorry, the resource you requested could not be found";
                    _logger.LogWarning($"404 error occurred. Path: {statusCodeData?.OriginalPath}");
                    break;
                case 401:
                    ViewBag.ErrorMessage = "You are not authorized to access this resource";
                    _logger.LogWarning($"401 error occurred. Path: {statusCodeData?.OriginalPath}");
                    break;
                case 403:
                    ViewBag.ErrorMessage = "You don't have permission to access this resource";
                    _logger.LogWarning($"403 error occurred. Path: {statusCodeData?.OriginalPath}");
                    break;
                default:
                    ViewBag.ErrorMessage = $"An error occurred. Status code: {statusCode}";
                    _logger.LogWarning($"Status code {statusCode} error occurred. Path: {statusCodeData?.OriginalPath}");
                    break;
            }
            
            return View("Error", new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
