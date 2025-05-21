using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Models;
using System.Threading.Tasks;

namespace SunMovement.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("admin/manage")] // Changed route to avoid conflicts
    public class AdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet("")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> Index()
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
        public async Task<IActionResult> Products()
        {
            // Get the products but provide the URL for actions that should use the proper ProductsAdmin controller
            var products = await _unitOfWork.Products.GetAllAsync();
            ViewBag.CreateProductUrl = "/admin/products/create";
            ViewBag.EditProductUrl = "/admin/products/edit/";
            ViewBag.DeleteProductUrl = "/admin/products/delete/";
            ViewBag.DetailsProductUrl = "/admin/products/details/";
            return View("~/Views/Admin/Products.cshtml", products);
        }

        [HttpGet("services")]
        public async Task<IActionResult> Services()
        {
            var services = await _unitOfWork.Services.GetAllAsync();
            return View("~/Views/Admin/Services.cshtml", services);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> Orders()
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();
            return View("~/Views/Admin/Orders.cshtml", orders);
        }

        [HttpGet("messages")]
        public async Task<IActionResult> Messages()
        {
            var messages = await _unitOfWork.ContactMessages.GetAllAsync();
            return View("~/Views/Admin/Messages.cshtml", messages);
        }

        [HttpGet("events")]
        public async Task<IActionResult> Events()
        {
            var events = await _unitOfWork.Events.GetAllAsync();
            return View("~/Views/Admin/Events.cshtml", events);
        }

        [HttpGet("faqs")]
        public async Task<IActionResult> FAQs()
        {
            var faqs = await _unitOfWork.FAQs.GetAllAsync();
            return View("~/Views/Admin/FAQs.cshtml", faqs);
        }

        [HttpGet("users")]
        public IActionResult Users()
        {
            var users = _userManager.Users;
            return View("~/Views/Admin/Users.cshtml", users);
        }
    }
}
