using Microsoft.AspNetCore.Mvc;  
using Microsoft.AspNetCore.Identity;  
using System.Threading.Tasks;  
using SunMovement.Core.Models;  
using SunMovement.Web.Models;  
  
namespace SunMovement.Web.Controllers  
{  
    public class AccountController : Controller  
    {  
        private readonly SignInManager<ApplicationUser> _signInManager;  
        private readonly UserManager<ApplicationUser> _userManager;  
  
        public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)  
        {  
            _signInManager = signInManager;  
            _userManager = userManager;  
        }  
  
        [HttpGet]  
        public IActionResult Login(string? returnUrl = null)  
        {  
            ViewData["ReturnUrl"] = returnUrl;  
            return View();  
        }        [HttpPost]  
        [ValidateAntiForgeryToken]  
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)  
        {  
            ViewData["ReturnUrl"] = returnUrl;  
            if (ModelState.IsValid)  
            {  
                // Use cookie authentication for web login
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);  
                if (result.Succeeded)  
                {  
                    var user = await _userManager.FindByEmailAsync(model.Email);  
                    if (user != null && await _userManager.IsInRoleAsync(user, "Admin"))  
                    {  
                        // Always use an absolute path for admin redirect
                        return Redirect("/admin");  
                    }  
  
                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))  
                    {  
                        return Redirect(returnUrl);  
                    }  
                    else  
                    {  
                        return RedirectToAction(nameof(HomeController.Index), "Home");  
                    }  
                }  
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");  
            }  
  
            return View(model);  
        }
  
        [HttpPost]  
        [ValidateAntiForgeryToken]  
        public async Task<IActionResult> Logout()  
        {  
            await _signInManager.SignOutAsync();  
            return RedirectToAction(nameof(HomeController.Index), "Home");  
        }  
    }  
}  
