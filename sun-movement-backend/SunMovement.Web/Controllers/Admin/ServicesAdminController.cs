using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    [Route("admin/services")]
    public class ServicesAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;

        public ServicesAdminController(IUnitOfWork unitOfWork, IFileUploadService fileUploadService)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var services = await _unitOfWork.Services.GetAllAsync();
            return View(services);
        }

        [HttpGet("create")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Service service, IFormFile imageFile)
        {
            if (ModelState.IsValid)
            {
                if (imageFile != null)
                {
                    service.ImageUrl = await _fileUploadService.UploadServiceImageAsync(imageFile);
                }

                service.CreatedAt = System.DateTime.UtcNow;
                await _unitOfWork.Services.AddAsync(service);
                await _unitOfWork.CompleteAsync();
                
                return RedirectToAction(nameof(Index));
            }
            return View(service);
        }

        [HttpGet("edit/{id}")]
        public async Task<IActionResult> Edit(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return View(service);
        }

        [HttpPost("edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Service service, IFormFile imageFile)
        {
            if (id != service.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingService = await _unitOfWork.Services.GetByIdAsync(id);
                    if (existingService == null)
                    {
                        return NotFound();
                    }

                    if (imageFile != null)
                    {
                        service.ImageUrl = await _fileUploadService.UploadServiceImageAsync(imageFile);
                    }
                    else
                    {
                        service.ImageUrl = existingService.ImageUrl;
                    }

                    service.UpdatedAt = System.DateTime.UtcNow;
                    await _unitOfWork.Services.UpdateAsync(service);
                    await _unitOfWork.CompleteAsync();
                    
                    return RedirectToAction(nameof(Index));
                }
                catch (System.Exception)
                {
                    if (!await ServiceExists(service.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return View(service);
        }

        [HttpGet("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return View(service);
        }

        [HttpPost("delete/{id}")]
        [ValidateAntiForgeryToken]
        [ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            await _unitOfWork.Services.DeleteAsync(service);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var service = await _unitOfWork.Services.GetWithSchedulesAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return View(service);
        }        [HttpGet("{serviceId}/schedules")]
        public async Task<IActionResult> Schedules(int serviceId)
        {
            var service = await _unitOfWork.Services.GetWithSchedulesAsync(serviceId);
            if (service == null)
            {
                return NotFound();
            }
            ViewBag.ServiceId = serviceId;
            ViewBag.ServiceName = service.Name;
            return View(service.Schedules ?? new List<ServiceSchedule>());
        }

        [HttpGet("{serviceId}/schedules/create")]
        public IActionResult CreateSchedule(int serviceId)
        {
            ViewBag.ServiceId = serviceId;
            return View(new ServiceSchedule { ServiceId = serviceId });
        }

        [HttpPost("{serviceId}/schedules/create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateSchedule(int serviceId, ServiceSchedule schedule)
        {
            if (serviceId != schedule.ServiceId)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var service = await _unitOfWork.Services.GetByIdAsync(serviceId);
                if (service == null)
                {
                    return NotFound();
                }

                await _unitOfWork.Services.AddScheduleAsync(schedule);
                await _unitOfWork.CompleteAsync();
                
                return RedirectToAction(nameof(Schedules), new { serviceId });
            }
            ViewBag.ServiceId = serviceId;
            return View(schedule);
        }        [HttpGet("{serviceId}/schedules/edit/{id}")]
        public async Task<IActionResult> EditSchedule(int serviceId, int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(serviceId);
            if (service == null || service.Schedules == null)
            {
                return NotFound();
            }

            var schedule = service.Schedules.FirstOrDefault(s => s.Id == id);
            if (schedule == null)
            {
                return NotFound();
            }

            ViewBag.ServiceId = serviceId;
            ViewBag.ServiceName = service.Name;
            return View(schedule);
        }

        [HttpPost("{serviceId}/schedules/edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditSchedule(int serviceId, int id, ServiceSchedule schedule)
        {
            if (id != schedule.Id || serviceId != schedule.ServiceId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                await _unitOfWork.Services.UpdateScheduleAsync(schedule);
                await _unitOfWork.CompleteAsync();
                
                return RedirectToAction(nameof(Schedules), new { serviceId });
            }
            ViewBag.ServiceId = serviceId;
            return View(schedule);
        }        [HttpGet("{serviceId}/schedules/delete/{id}")]
        public async Task<IActionResult> DeleteSchedule(int serviceId, int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(serviceId);
            if (service == null || service.Schedules == null)
            {
                return NotFound();
            }

            var schedule = service.Schedules.FirstOrDefault(s => s.Id == id);
            if (schedule == null)
            {
                return NotFound();
            }

            ViewBag.ServiceId = serviceId;
            ViewBag.ServiceName = service.Name;
            return View(schedule);
        }        [HttpPost("{serviceId}/schedules/delete/{id}")]
        [ValidateAntiForgeryToken]
        [ActionName("DeleteSchedule")]
        public async Task<IActionResult> DeleteScheduleConfirmed(int serviceId, int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(serviceId);
            if (service == null || service.Schedules == null)
            {
                return NotFound();
            }

            var schedule = service.Schedules.FirstOrDefault(s => s.Id == id);
            if (schedule == null)
            {
                return NotFound();
            }

            await _unitOfWork.Services.DeleteScheduleAsync(schedule);
            await _unitOfWork.CompleteAsync();
            
            return RedirectToAction(nameof(Schedules), new { serviceId });
        }

        private async Task<bool> ServiceExists(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            return service != null;
        }
    }
}
