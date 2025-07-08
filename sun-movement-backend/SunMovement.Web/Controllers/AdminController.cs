using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SunMovement.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            // Redirect to the main admin dashboard instead of showing hardcoded data
            return RedirectToAction("Index", "AdminDashboard", new { area = "Admin" });
        }
    }
}
