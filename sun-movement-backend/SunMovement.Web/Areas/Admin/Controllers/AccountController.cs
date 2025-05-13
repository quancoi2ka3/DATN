using Microsoft.AspNetCore.Mvc;  
using Microsoft.AspNetCore.Identity;  
using System.Threading.Tasks;  
using SunMovement.Core.Models;  
using SunMovement.Web.Models;  
  
namespace SunMovement.Web.Areas.Admin.Controllers  
{  
    [Area("Admin")]
    public class AccountController : Controller  
    {  
        private readonly SignInManager<ApplicationUser> _signInManager;  
        private readonly UserManager<ApplicationUser> _userManager;  
  
        public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)  
        {  
            _signInManager = signInManager;  
            _userManager = userManager;  
        }        [HttpGet]  
        public IActionResult Login(string? returnUrl = null)  
        {  
            // Redirect to the non-area Account controller's login action
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = "/admin";
            }
            return RedirectToAction("Login", "Account", new { area = "", returnUrl });
        }  
    }  
}
