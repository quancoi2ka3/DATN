using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    public class CachedServiceService : IServiceService
    {
        private readonly IServiceService _serviceService;
        private readonly ICacheService _cacheService;
        private const string AllServicesCacheKey = "AllServices";
        private const string ServiceCachePrefix = "Service_";
        private const string ServiceWithSchedulesPrefix = "Service_WithSchedules_";
        private const string ServiceTypePrefix = "ServiceType_";

        public CachedServiceService(IServiceService serviceService, ICacheService cacheService)
        {
            _serviceService = serviceService;
            _cacheService = cacheService;
        }

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            var cachedServices = _cacheService.Get<IEnumerable<Service>>(AllServicesCacheKey);
            if (cachedServices != null)
            {
                return cachedServices;
            }

            var services = await _serviceService.GetAllServicesAsync();
            _cacheService.Set(AllServicesCacheKey, services, TimeSpan.FromMinutes(10));
            return services;
        }        public async Task<Service> GetServiceByIdAsync(int id)
        {
            var cacheKey = $"{ServiceCachePrefix}{id}";
            var cachedService = _cacheService.Get<Service>(cacheKey);
            if (cachedService != null)
            {
                return cachedService;
            }

            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service != null)
            {
                _cacheService.Set(cacheKey, service, TimeSpan.FromMinutes(10));
            }
            return service ?? new Service();
        }

        public async Task<Service> GetServiceWithSchedulesAsync(int id)
        {
            var cacheKey = $"{ServiceWithSchedulesPrefix}{id}";
            var cachedService = _cacheService.Get<Service>(cacheKey);
            if (cachedService != null)
            {
                return cachedService;
            }

            var service = await _serviceService.GetServiceWithSchedulesAsync(id);
            if (service != null)
            {
                _cacheService.Set(cacheKey, service, TimeSpan.FromMinutes(10));
            }
            return service ?? new Service();
        }

        public async Task<IEnumerable<Service>> GetServicesByTypeAsync(ServiceType type)
        {
            var cacheKey = $"{ServiceTypePrefix}{type}";
            var cachedServices = _cacheService.Get<IEnumerable<Service>>(cacheKey);
            if (cachedServices != null)
            {
                return cachedServices;
            }

            var services = await _serviceService.GetServicesByTypeAsync(type);
            if (services != null)
            {
                _cacheService.Set(cacheKey, services, TimeSpan.FromMinutes(10));
            }
            return services ?? new List<Service>();
        }

        public async Task<Service> CreateServiceAsync(Service service)
        {
            var result = await _serviceService.CreateServiceAsync(service);
            _cacheService.Clear();
            return result;
        }

        public async Task<Service> UpdateServiceAsync(Service service)
        {
            var result = await _serviceService.UpdateServiceAsync(service);
            InvalidateServiceCaches(service);
            return result;
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            await _serviceService.DeleteServiceAsync(id);
            if (service != null)
            {
                InvalidateServiceCaches(service);
            }
        }

        private void InvalidateServiceCaches(Service service)
        {
            _cacheService.Remove($"{ServiceCachePrefix}{service.Id}");
            _cacheService.Remove($"{ServiceWithSchedulesPrefix}{service.Id}");
            _cacheService.Remove(AllServicesCacheKey);
            _cacheService.Remove($"{ServiceTypePrefix}{service.Type}");
        }
    }
}
