using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/services")]
    [ApiController]    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        private readonly ICacheService _cacheService;

        public ServicesController(IServiceService serviceService, ICacheService cacheService)
        {
            _serviceService = serviceService;
            _cacheService = cacheService;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {            var services = await _serviceService.GetAllServicesAsync();
            var serviceDtos = services.Select(s => MapToDto(s));
            return Ok(serviceDtos);
        }

        // GET: api/services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return MapToDto(service);
        }

        // GET: api/services/5/schedules
        [HttpGet("{id}/schedules")]
        public async Task<ActionResult<ServiceDto>> GetServiceWithSchedules(int id)
        {
            var service = await _serviceService.GetServiceWithSchedulesAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return MapToDto(service);
        }

        // GET: api/services/type/calisthenics
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByType(string type)
        {
            if (!Enum.TryParse<ServiceType>(type, true, out var serviceType))
            {
                return BadRequest("Invalid service type");
            }            var services = await _serviceService.GetServicesByTypeAsync(serviceType);
            var serviceDtos = services.Select(s => MapToDto(s));
            return Ok(serviceDtos);
        }

        // POST: api/services
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceDto>> CreateService(ServiceDto serviceDto)
        {
            var service = MapToEntity(serviceDto);
            service = await _serviceService.CreateServiceAsync(service);
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, MapToDto(service));
        }

        // PUT: api/services/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService(int id, ServiceDto serviceDto)
        {
            if (id != serviceDto.Id)
            {
                return BadRequest();
            }

            var existingService = await _serviceService.GetServiceByIdAsync(id);
            if (existingService == null)
            {
                return NotFound();
            }

            var service = MapToEntity(serviceDto, existingService);
            await _serviceService.UpdateServiceAsync(service);
            return NoContent();
        }

        // DELETE: api/services/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            await _serviceService.DeleteServiceAsync(id);
            return NoContent();
        }        private ServiceDto MapToDto(Service service)
        {
            // Convert relative image URLs to absolute URLs
            string imageUrl = string.Empty;
            if (!string.IsNullOrEmpty(service.ImageUrl))
            {
                if (service.ImageUrl.StartsWith("http"))
                {
                    // Already an absolute URL
                    imageUrl = service.ImageUrl;
                }
                else
                {
                    // Convert relative URL to absolute URL
                    var scheme = Request.Scheme;
                    var host = Request.Host;
                    imageUrl = $"{scheme}://{host}{service.ImageUrl}";
                }
            }

            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                ImageUrl = imageUrl,
                Price = service.Price,
                Type = service.Type,
                Features = service.Features ?? string.Empty,
                IsActive = service.IsActive
            };
        }
        
        private static Service MapToEntity(ServiceDto dto, Service? existingService = null)
        {
            var service = existingService ?? new Service();
            service.Name = dto.Name ?? string.Empty;
            service.Description = dto.Description ?? string.Empty;
            service.ImageUrl = dto.ImageUrl;
            service.Price = dto.Price;
            service.Type = dto.Type;
            service.Features = dto.Features ?? string.Empty;
            service.IsActive = dto.IsActive;
            return service;
        }

        // POST: api/services/clear-cache
        [HttpPost("clear-cache")]
        [Authorize(Roles = "Admin")]
        public ActionResult ClearCache()
        {
            try
            {
                _cacheService.Clear();
                return Ok(new { message = "Service cache cleared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error clearing cache", error = ex.Message });
            }
        }
    }
}
