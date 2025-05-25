using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Models;
using System.Threading.Tasks;

namespace SunMovement.Web.Controllers
{    [Authorize(Roles = "Admin")]
    [Route("admin/manage")] // Legacy route that will redirect to the new admin area
    public class AdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }        [HttpGet("")]
        [HttpGet("dashboard")]
        public IActionResult Index()
        {
            // Redirect to the new admin area dashboard
            return RedirectPermanent("/admin");
        }
        
        // Legacy method kept for reference
        private async Task<IActionResult> LegacyIndex()
        {
            // Create a model for the dashboard
            var model = new AdminDashboardViewModel
            {
                ProductCount = await _unitOfWork.Products.CountAsync(),
                ServiceCount = await _unitOfWork.Services.CountAsync(),
                OrderCount = await _unitOfWork.Orders.CountAsync(),
                FAQCount = await _unitOfWork.FAQs.CountAsync(),
                UnreadMessageCount = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead),
                UserCount = _userManager.Users.Count()
            };

            // Get recent orders
            var recentOrders = (await _unitOfWork.Orders.GetAllAsync())
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    Id = o.Id,
                    CustomerName = o.CustomerName,
                    Date = o.OrderDate,
                    Total = o.TotalAmount,
                    Status = o.Status.ToString()
                })
                .ToList();
            
            ViewBag.RecentOrders = recentOrders;

            return View("~/Views/Admin/Index.cshtml", model);
        }        [HttpGet("products")]
        public IActionResult Products()
        {
            // Redirect to the new area-based products admin controller
            return RedirectPermanent("/admin/products");
        }        [HttpGet("services")]
        public IActionResult Services()
        {
            return RedirectPermanent("/admin/services");
        }        [HttpGet("orders")]
        public IActionResult Orders()
        {
            return RedirectPermanent("/admin/orders");
        }        [HttpGet("messages")]
        public IActionResult Messages()
        {
            return RedirectPermanent("/admin/contactmessages");
        }        [HttpGet("events")]
        public IActionResult Events()
        {
            return RedirectPermanent("/admin/events");
        }        [HttpGet("faqs")]
        public IActionResult FAQs()
        {
            return RedirectPermanent("/admin/faqs");
        }        [HttpGet("users")]
        public IActionResult Users()
        {
            // Note: You may need to create a UsersAdminController in the Admin area
            // For now, redirect to admin dashboard
            return RedirectPermanent("/admin");
        }
    }
}
