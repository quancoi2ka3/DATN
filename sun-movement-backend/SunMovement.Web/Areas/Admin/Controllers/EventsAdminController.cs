using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    [Route("admin/events")]
    public class EventsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;

        public EventsAdminController(IUnitOfWork unitOfWork, IFileUploadService fileUploadService)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var events = await _unitOfWork.Events.GetAllAsync();
            return View(events);
        }

        [HttpGet("create")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Event eventItem, IFormFile imageFile)
        {
            if (ModelState.IsValid)
            {
                if (imageFile != null)
                {
                    eventItem.ImageUrl = await _fileUploadService.UploadEventImageAsync(imageFile);
                }

                eventItem.CreatedAt = System.DateTime.UtcNow;
                await _unitOfWork.Events.AddAsync(eventItem);
                await _unitOfWork.CompleteAsync();
                
                return RedirectToAction(nameof(Index));
            }
            return View(eventItem);
        }

        [HttpGet("edit/{id}")]
        public async Task<IActionResult> Edit(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }
            return View(eventItem);
        }

        [HttpPost("edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Event eventItem, IFormFile imageFile)
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

                    if (imageFile != null)
                    {
                        eventItem.ImageUrl = await _fileUploadService.UploadEventImageAsync(imageFile);
                    }
                    else
                    {
                        eventItem.ImageUrl = existingEvent.ImageUrl;
                    }

                    eventItem.UpdatedAt = System.DateTime.UtcNow;
                    await _unitOfWork.Events.UpdateAsync(eventItem);
                    await _unitOfWork.CompleteAsync();
                    
                    return RedirectToAction(nameof(Index));
                }
                catch (System.Exception)
                {
                    if (!await EventExists(eventItem.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return View(eventItem);
        }

        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }
            return View(eventItem);
        }

        [HttpPost("delete/{id}")]
        [ValidateAntiForgeryToken]
        [ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            await _unitOfWork.Events.DeleteAsync(eventItem);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }
            return View(eventItem);
        }

        private async Task<bool> EventExists(int id)
        {
            var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
            return eventItem != null;
        }
    }
}
