using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SunMovement.Web.Models;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public HomeController(
        ILogger<HomeController> logger,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
    }    public IActionResult Index()
    {        // If user is logged in and is an admin, redirect to admin dashboard
        if (User.Identity != null && User.Identity.IsAuthenticated && User.IsInRole("Admin"))
        {
            return Redirect("/admin");
        }
        
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error(int? statusCode = null)
    {
        var errorViewModel = new ErrorViewModel 
        { 
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
        };

        if (statusCode.HasValue)
        {
            _logger.LogWarning($"Error with status code: {statusCode} occurred. Request ID: {errorViewModel.RequestId}");
            ViewBag.StatusCode = statusCode;
            Response.StatusCode = statusCode.Value;
        }
        else
        {
            _logger.LogError($"An unexpected error occurred. Request ID: {errorViewModel.RequestId}");
        }

        return View(errorViewModel);
    }
}
