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
        }        [HttpPost]  
        [ValidateAntiForgeryToken]  
        public async Task<IActionResult> Logout()  
        {  
            await _signInManager.SignOutAsync();  
            return RedirectToAction(nameof(HomeController.Index), "Home");  
        }        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    DateOfBirth = model.DateOfBirth ?? DateTime.UtcNow,
                    Address = model.Address ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = false // Require email confirmation for public registration
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // Add user to Customer role by default
                    await _userManager.AddToRoleAsync(user, "Customer");

                    // Generate email confirmation token
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    
                    // For now, we'll auto-confirm the email (you can implement email service later)
                    await _userManager.ConfirmEmailAsync(user, token);
                    
                    // Sign in the user
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    
                    TempData["Success"] = "Đăng ký thành công! Chào mừng bạn đến với Sun Movement.";
                    return RedirectToAction("Index", "Home");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            return View(model);
        }
    }  
}
