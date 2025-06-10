using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;

namespace SunMovement.Web.Controllers
{
    public class ServicesController : Controller
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // GET: /Services
        public async Task<IActionResult> Index(string type = null, string search = null, int page = 1)
        {
            try
            {
                var services = await _serviceService.GetAllServicesAsync();
                services = services.Where(s => s.IsActive);

                // Apply type filter if specified
                if (!string.IsNullOrEmpty(type) && Enum.TryParse<ServiceType>(type, true, out var serviceType))
                {
                    services = services.Where(s => s.Type == serviceType);
                }

                // Apply search filter if specified
                if (!string.IsNullOrEmpty(search))
                {
                    services = services.Where(s =>
                        s.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        s.Description.Contains(search, StringComparison.OrdinalIgnoreCase));
                }

                // Generate ETag for caching purposes
                var etag = GenerateETag(services.ToList());
                
                // Check if client has the same version
                var requestETag = Request.Headers[HeaderNames.IfNoneMatch];
                if (!string.IsNullOrEmpty(requestETag) && requestETag.ToString() == etag)
                {
                    return StatusCode(304); // Not Modified
                }
                
                // Set ETag and cache control headers
                Response.Headers[HeaderNames.ETag] = etag;
                Response.Headers[HeaderNames.CacheControl] = "no-cache";

                // Pagination
                int pageSize = 9;
                var pagedServices = services.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                var viewModel = new ServicesIndexViewModel
                {
                    Services = pagedServices.Select(s => new ServiceViewModel
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Description = s.Description,
                        Price = s.Price,
                        ImageUrl = s.ImageUrl,
                        Type = s.Type.ToString(),
                        Features = s.Features
                    }),
                    CurrentPage = page,
                    TotalPages = (int)Math.Ceiling(services.Count() / (double)pageSize),
                    CurrentType = type,
                    CurrentSearch = search
                };

                // Set very short cache duration to ensure fresh content
                Response.Headers["Cache-Control"] = "public, max-age=10";

                return View(viewModel);
            }
            catch (Exception ex)
            {
                // Log the error
                return View("Error", ex);
            }
        }

        // GET: /Services/Details/5
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var service = await _serviceService.GetServiceByIdAsync(id);
                if (service == null || !service.IsActive)
                {
                    return NotFound();
                }

                // Generate ETag for this specific service
                var etag = $"W/\"service-{id}-{service.UpdatedAt?.Ticks ?? service.CreatedAt.Ticks}\"";
                
                // Check if client has the same version
                var requestETag = Request.Headers[HeaderNames.IfNoneMatch];
                if (!string.IsNullOrEmpty(requestETag) && requestETag.ToString() == etag)
                {
                    return StatusCode(304); // Not Modified
                }
                
                // Set ETag and cache control headers
                Response.Headers[HeaderNames.ETag] = etag;
                Response.Headers[HeaderNames.CacheControl] = "no-cache";

                var viewModel = new ServiceViewModel
                {
                    Id = service.Id,
                    Name = service.Name,
                    Description = service.Description,
                    Price = service.Price,
                    ImageUrl = service.ImageUrl,
                    Type = service.Type.ToString(),
                    Features = service.Features,
                    Schedules = service.Schedules?.Select(s => new ServiceScheduleViewModel
                    {
                        Id = s.Id,
                        DayOfWeek = s.DayOfWeek,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime,
                        Location = s.Location,
                        Instructor = s.Instructor,
                        Capacity = s.Capacity,
                        IsActive = s.IsActive
                    }).ToList()
                };

                // Set very short cache duration to ensure fresh content
                Response.Headers["Cache-Control"] = "public, max-age=10";

                return View(viewModel);
            }
            catch (Exception ex)
            {
                // Log the error
                return View("Error", ex);
            }
        }
        
        // Helper method to generate ETag for service collections
        private string GenerateETag(IEnumerable<Service> services)
        {
            // Use the latest UpdatedAt timestamp from any service as the ETag
            var latestUpdate = services.Max(s => s.UpdatedAt ?? s.CreatedAt);
            return $"W/\"services-{latestUpdate.Ticks}-{services.Count()}\"";
        }
    }
}
