using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class EventsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;

        public EventsAdminController(IUnitOfWork unitOfWork, IFileUploadService fileUploadService)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
        }

        // GET: Admin/Events
        public async Task<IActionResult> Index(string searchString, int page = 1, int pageSize = 10)
        {
            var events = await _unitOfWork.Events.GetAllAsync();

            if (!string.IsNullOrEmpty(searchString))
            {
                events = events.Where(e => e.Title.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                                          e.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase));
            }

            events = events.OrderByDescending(e => e.CreatedAt);

            var totalCount = events.Count();
            var pagedEvents = events.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            ViewBag.SearchString = searchString;

            return View(pagedEvents);
        }

        // GET: Admin/Events/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            return View(eventItem);
        }

        // GET: Admin/Events/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Admin/Events/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Event eventItem, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                        var fileExtension = Path.GetExtension(imageFile.FileName).ToLower();
                        
                        if (allowedExtensions.Contains(fileExtension))
                        {
                            eventItem.ImageUrl = await _fileUploadService.UploadFileAsync(imageFile, "events");
                        }
                        else
                        {
                            ModelState.AddModelError("ImageFile", "Please upload a valid image file (jpg, jpeg, png, gif).");
                            return View(eventItem);
                        }
                    }

                    eventItem.CreatedAt = DateTime.UtcNow;
                    eventItem.UpdatedAt = DateTime.UtcNow;

                    await _unitOfWork.Events.AddAsync(eventItem);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Event created successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "An error occurred while creating the event: " + ex.Message);
                }
            }

            return View(eventItem);
        }

        // GET: Admin/Events/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            return View(eventItem);
        }

        // POST: Admin/Events/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Event eventItem, IFormFile? imageFile)
        {
            if (id != eventItem.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingEvent = await _unitOfWork.Events.GetByIdAsync(id);
                    if (existingEvent == null)
                    {
                        return NotFound();
                    }

                    // Handle image upload
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                        var fileExtension = Path.GetExtension(imageFile.FileName).ToLower();
                        
                        if (allowedExtensions.Contains(fileExtension))
                        {
                            // Delete old image if exists
                            if (!string.IsNullOrEmpty(existingEvent.ImageUrl))
                            {
                                await _fileUploadService.DeleteFileAsync(existingEvent.ImageUrl);
                            }
                            
                            eventItem.ImageUrl = await _fileUploadService.UploadFileAsync(imageFile, "events");
                        }
                        else
                        {
                            ModelState.AddModelError("ImageFile", "Please upload a valid image file (jpg, jpeg, png, gif).");
                            return View(eventItem);
                        }
                    }
                    else
                    {
                        // Keep existing image if no new image uploaded
                        eventItem.ImageUrl = existingEvent.ImageUrl;
                    }                    // Update properties
                    existingEvent.Title = eventItem.Title;
                    existingEvent.Description = eventItem.Description;
                    existingEvent.EventDate = eventItem.EventDate;
                    existingEvent.StartTime = eventItem.StartTime;
                    existingEvent.EndTime = eventItem.EndTime;
                    existingEvent.Location = eventItem.Location;
                    existingEvent.Capacity = eventItem.Capacity;
                    existingEvent.RegistrationLink = eventItem.RegistrationLink;
                    existingEvent.OrganizedBy = eventItem.OrganizedBy;
                    existingEvent.IsActive = eventItem.IsActive;
                    existingEvent.IsFeatured = eventItem.IsFeatured;
                    existingEvent.ImageUrl = eventItem.ImageUrl;
                    existingEvent.UpdatedAt = DateTime.UtcNow;

                    await _unitOfWork.Events.UpdateAsync(existingEvent);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Event updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "An error occurred while updating the event: " + ex.Message);
                }
            }

            return View(eventItem);
        }

        // GET: Admin/Events/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            return View(eventItem);
        }

        // POST: Admin/Events/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
                if (eventItem != null)
                {
                    // Delete associated image if exists
                    if (!string.IsNullOrEmpty(eventItem.ImageUrl))
                    {
                        await _fileUploadService.DeleteFileAsync(eventItem.ImageUrl);
                    }

                    await _unitOfWork.Events.DeleteAsync(eventItem);
                    await _unitOfWork.CompleteAsync();

                    TempData["SuccessMessage"] = "Event deleted successfully!";
                }
                else
                {
                    TempData["ErrorMessage"] = "Event not found.";
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "An error occurred while deleting the event: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: Admin/Events/ToggleFeatured/5
        [HttpPost]
        public async Task<IActionResult> ToggleFeatured(int id)
        {
            try
            {
                var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
                if (eventItem != null)
                {
                    eventItem.IsFeatured = !eventItem.IsFeatured;
                    eventItem.UpdatedAt = DateTime.UtcNow;

                    await _unitOfWork.Events.UpdateAsync(eventItem);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, isFeatured = eventItem.IsFeatured });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Event not found" });
        }

        // POST: Admin/Events/ToggleActive/5
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
                if (eventItem != null)
                {
                    eventItem.IsActive = !eventItem.IsActive;
                    eventItem.UpdatedAt = DateTime.UtcNow;

                    await _unitOfWork.Events.UpdateAsync(eventItem);
                    await _unitOfWork.CompleteAsync();

                    return Json(new { success = true, isActive = eventItem.IsActive });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

            return Json(new { success = false, message = "Event not found" });
        }
    }
}