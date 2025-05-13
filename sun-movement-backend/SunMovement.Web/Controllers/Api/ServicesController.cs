using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            var serviceDtos = services.Select(MapToDto);
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
            }

            var services = await _serviceService.GetServicesByTypeAsync(serviceType);
            var serviceDtos = services.Select(MapToDto);
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
        }

        private static ServiceDto MapToDto(Service service)
        {
            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                ImageUrl = service.ImageUrl,
                Price = service.Price,
                Type = service.Type,
                Features = service.Features,
                IsActive = service.IsActive
            };
        }

        private static Service MapToEntity(ServiceDto dto, Service existingService = null)
        {
            var service = existingService ?? new Service();
            service.Name = dto.Name;
            service.Description = dto.Description;
            service.ImageUrl = dto.ImageUrl;
            service.Price = dto.Price;
            service.Type = dto.Type;
            service.Features = dto.Features;
            service.IsActive = dto.IsActive;
            return service;
        }
    }
}
