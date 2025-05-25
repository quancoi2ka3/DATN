using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    [Route("admin")]
    public class AdminDashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminDashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        [HttpGet("")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> Index()
        {
            try
            {
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

                var model = new AdminDashboardViewModel
                {
                    ProductCount = await _unitOfWork.Products.CountAsync(),
                    ServiceCount = await _unitOfWork.Services.CountAsync(),
                    OrderCount = await _unitOfWork.Orders.CountAsync(),
                    EventCount = await _unitOfWork.Events.CountAsync(),
                    FAQCount = await _unitOfWork.FAQs.CountAsync(),
                    UnreadMessageCount = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead),
                    TotalMessageCount = await _unitOfWork.ContactMessages.CountAsync(),                    UserCount = 0, // Will need to inject UserManager to get this count
                    RecentOrders = recentOrders
                };
                
                return View("Index", model); // Explicitly specify the view name
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error in AdminDashboardController.Index: {ex.Message}");
                // Return an error view or redirect to an error page
                return View("Error", new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }
        }
    }
}
