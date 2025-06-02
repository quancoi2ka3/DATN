using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ServicesAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;
        private readonly ICacheService _cacheService;

        public ServicesAdminController(IUnitOfWork unitOfWork, IFileUploadService fileUploadService, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
            _cacheService = cacheService;
        }

        // GET: Admin/ServicesAdmin
        public async Task<IActionResult> Index(string searchString)
        {
            try
            {
                var services = await _unitOfWork.Services.GetAllAsync();
                
                if (!string.IsNullOrEmpty(searchString))
                {
                    services = services.Where(s => 
                        s.Name.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        s.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        s.Type.ToString().Contains(searchString, StringComparison.OrdinalIgnoreCase));
                }

                ViewBag.SearchString = searchString;
                return View(services.OrderByDescending(s => s.CreatedAt));
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading services: " + ex.Message;
                return View(new List<Service>());
            }
        }

        // GET: Admin/ServicesAdmin/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var service = await _unitOfWork.Services.GetServiceWithSchedulesAsync(id.Value);
                if (service == null)
                {
                    return NotFound();
                }

                return View(service);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading service details: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/ServicesAdmin/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Admin/ServicesAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Description,Price,Type,Features,IsActive")] Service service, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var imagePath = await _fileUploadService.UploadFileAsync(imageFile, "services");
                        service.ImageUrl = imagePath;
                    }                    service.CreatedAt = DateTime.UtcNow;
                    await _unitOfWork.Services.AddAsync(service);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache after successful service creation
                    _cacheService.Clear();
                    
                    TempData["Success"] = "Service created successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error creating service: " + ex.Message);
                }
            }

            return View(service);
        }

        // GET: Admin/ServicesAdmin/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(id.Value);
                if (service == null)
                {
                    return NotFound();
                }

                return View(service);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading service for editing: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ServicesAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,Price,Type,Features,IsActive,CreatedAt,ImageUrl")] Service service, IFormFile? imageFile)
        {
            if (id != service.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var imagePath = await _fileUploadService.UploadFileAsync(imageFile, "services");
                        service.ImageUrl = imagePath;
                    }                    service.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Services.UpdateAsync(service);
                    await _unitOfWork.CompleteAsync();

                    // Clear cache after successful service update
                    _cacheService.Clear();

                    TempData["Success"] = "Service updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error updating service: " + ex.Message);
                }
            }

            return View(service);
        }

        // GET: Admin/ServicesAdmin/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(id.Value);
                if (service == null)
                {
                    return NotFound();
                }

                return View(service);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading service for deletion: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ServicesAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(id);
                if (service != null)
                {                    await _unitOfWork.Services.DeleteAsync(service);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache after successful service deletion
                    _cacheService.Clear();
                    
                    TempData["Success"] = "Service deleted successfully!";
                }
                else
                {
                    TempData["Error"] = "Service not found.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error deleting service: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/ServicesAdmin/ToggleActive/5
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(id);
                if (service != null)
                {
                    service.IsActive = !service.IsActive;
                    service.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.Services.UpdateAsync(service);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, isActive = service.IsActive });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Service not found" });
        }

        // Service Schedule Management

        // GET: Admin/ServicesAdmin/Schedules/5
        public async Task<IActionResult> Schedules(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var service = await _unitOfWork.Services.GetServiceWithSchedulesAsync(id.Value);
                if (service == null)
                {
                    return NotFound();
                }

                ViewBag.ServiceId = id.Value;
                ViewBag.ServiceName = service.Name;
                return View(service.Schedules ?? new List<ServiceSchedule>());
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading service schedules: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/ServicesAdmin/CreateSchedule/5
        public async Task<IActionResult> CreateSchedule(int? serviceId)
        {
            if (serviceId == null)
            {
                return NotFound();
            }

            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(serviceId.Value);
                if (service == null)
                {
                    return NotFound();
                }

                ViewBag.ServiceId = serviceId.Value;
                ViewBag.ServiceName = service.Name;
                
                var schedule = new ServiceSchedule 
                { 
                    ServiceId = serviceId.Value,
                    StartTime = new TimeSpan(9, 0, 0),  // 9:00 AM
                    EndTime = new TimeSpan(10, 0, 0),   // 10:00 AM
                    IsActive = true
                };

                return View(schedule);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading service for schedule creation: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ServicesAdmin/CreateSchedule
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateSchedule([Bind("ServiceId,DayOfWeek,StartTime,EndTime,MaxCapacity,IsActive,Location,Notes,Capacity,Instructor,TrainerName")] ServiceSchedule schedule)
        {
            if (ModelState.IsValid)
            {
                try
                {                    await _unitOfWork.Services.AddScheduleAsync(schedule);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache after adding a schedule
                    _cacheService.Clear();

                    TempData["Success"] = "Schedule created successfully!";
                    return RedirectToAction(nameof(Schedules), new { id = schedule.ServiceId });
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error creating schedule: " + ex.Message);
                }
            }

            // Reload service info if model state is invalid
            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(schedule.ServiceId);
                ViewBag.ServiceId = schedule.ServiceId;
                ViewBag.ServiceName = service?.Name ?? "Unknown Service";
            }
            catch
            {
                ViewBag.ServiceName = "Unknown Service";
            }

            return View(schedule);
        }

        // GET: Admin/ServicesAdmin/EditSchedule/5
        public async Task<IActionResult> EditSchedule(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                // For simplicity, we'll get the schedule via service
                var services = await _unitOfWork.Services.GetAllServicesWithSchedulesAsync();
                var schedule = services.SelectMany(s => s.Schedules ?? new List<ServiceSchedule>())
                                     .FirstOrDefault(sch => sch.Id == id.Value);

                if (schedule == null)
                {
                    return NotFound();
                }

                var service = await _unitOfWork.Services.GetByIdAsync(schedule.ServiceId);
                ViewBag.ServiceName = service?.Name ?? "Unknown Service";
                ViewBag.ServiceId = schedule.ServiceId;

                return View(schedule);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error loading schedule for editing: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ServicesAdmin/EditSchedule/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditSchedule(int id, [Bind("Id,ServiceId,DayOfWeek,StartTime,EndTime,MaxCapacity,IsActive,Location,Notes,Capacity,Instructor,TrainerName")] ServiceSchedule schedule)
        {
            if (id != schedule.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {                    await _unitOfWork.Services.UpdateScheduleAsync(schedule);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache after updating a schedule
                    _cacheService.Clear();

                    TempData["Success"] = "Schedule updated successfully!";
                    return RedirectToAction(nameof(Schedules), new { id = schedule.ServiceId });
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error updating schedule: " + ex.Message);
                }
            }

            // Reload service info if model state is invalid
            try
            {
                var service = await _unitOfWork.Services.GetByIdAsync(schedule.ServiceId);
                ViewBag.ServiceName = service?.Name ?? "Unknown Service";
                ViewBag.ServiceId = schedule.ServiceId;
            }
            catch
            {
                ViewBag.ServiceName = "Unknown Service";
            }

            return View(schedule);
        }

        // POST: Admin/ServicesAdmin/DeleteSchedule/5
        [HttpPost]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            try
            {
                // Get all services with schedules to find the schedule
                var services = await _unitOfWork.Services.GetAllServicesWithSchedulesAsync();
                var schedule = services.SelectMany(s => s.Schedules ?? new List<ServiceSchedule>())
                                     .FirstOrDefault(sch => sch.Id == id);

                if (schedule != null)
                {                    await _unitOfWork.Services.DeleteScheduleAsync(schedule);
                    await _unitOfWork.CompleteAsync();
                    
                    // Clear cache after deleting a schedule
                    _cacheService.Clear();

                    return Json(new { success = true, message = "Schedule deleted successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Schedule not found." });
                }
            }
            catch (Exception ex)
            {                return Json(new { success = false, message = "Error deleting schedule: " + ex.Message });
            }
        }
        
        // POST: Admin/ServicesAdmin/ClearCache
        [HttpPost]
        public IActionResult ClearCache()
        {
            try
            {
                _cacheService.Clear();
                TempData["Success"] = "Service cache cleared successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error clearing cache: " + ex.Message;
            }
            
            return RedirectToAction(nameof(Index));
        }
    }
}