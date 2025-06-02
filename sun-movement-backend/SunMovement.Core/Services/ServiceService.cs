using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{    public class ServiceService : IServiceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private const string AllServicesCacheKey = "AllServices";
        private const string ServiceTypePrefix = "ServiceType_";

        public ServiceService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            // Try to get from cache first
            var cachedServices = _cacheService.Get<IEnumerable<Service>>(AllServicesCacheKey);
            if (cachedServices != null)
            {
                return cachedServices;
            }

            // If not in cache, get from database
            var services = await _unitOfWork.Services.GetAllAsync();
            
            // Store in cache for future requests
            _cacheService.Set(AllServicesCacheKey, services, TimeSpan.FromMinutes(10));
            
            return services;
        }        public async Task<Service> GetServiceByIdAsync(int id)
        {
            var cacheKey = $"Service_{id}";
            var cachedService = _cacheService.Get<Service>(cacheKey);
            if (cachedService != null)
            {
                return cachedService;
            }

            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service != null)
            {
                _cacheService.Set(cacheKey, service, TimeSpan.FromMinutes(10));
            }
            return service ?? new Service();
        }        public async Task<Service> GetServiceWithSchedulesAsync(int id)
        {
            var cacheKey = $"Service_WithSchedules_{id}";
            var cachedService = _cacheService.Get<Service>(cacheKey);
            if (cachedService != null)
            {
                return cachedService;
            }

            var service = await _unitOfWork.Services.GetServiceWithSchedulesAsync(id);
            if (service != null)
            {
                _cacheService.Set(cacheKey, service, TimeSpan.FromMinutes(10));
            }
            return service ?? new Service();
        }        public async Task<IEnumerable<Service>> GetServicesByTypeAsync(ServiceType type)
        {
            var cacheKey = $"{ServiceTypePrefix}{type}";
            var cachedServices = _cacheService.Get<IEnumerable<Service>>(cacheKey);
            if (cachedServices != null)
            {
                return cachedServices;
            }

            var services = await _unitOfWork.Services.GetServicesByTypeAsync(type);
            if (services != null)
            {
                _cacheService.Set(cacheKey, services, TimeSpan.FromMinutes(10));
            }
            return services ?? new List<Service>();
        }        public async Task<Service> CreateServiceAsync(Service service)
        {
            service.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Services.AddAsync(service);
            await _unitOfWork.CompleteAsync();
            
            // Clear cache when adding a new service
            _cacheService.Clear();
            
            return result;
        }        public async Task<Service> UpdateServiceAsync(Service service)
        {
            service.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Services.UpdateAsync(service);
            await _unitOfWork.CompleteAsync();
            
            // Clear relevant cache keys
            _cacheService.Remove($"Service_{service.Id}");
            _cacheService.Remove($"Service_WithSchedules_{service.Id}");
            _cacheService.Remove(AllServicesCacheKey);
            _cacheService.Remove($"{ServiceTypePrefix}{service.Type}");
            
            return result;
        }        public async Task DeleteServiceAsync(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service != null)
            {
                await _unitOfWork.Services.DeleteAsync(service);
                await _unitOfWork.CompleteAsync();
                
                // Clear relevant cache keys
                _cacheService.Remove($"Service_{id}");
                _cacheService.Remove($"Service_WithSchedules_{id}");
                _cacheService.Remove(AllServicesCacheKey);
                _cacheService.Remove($"{ServiceTypePrefix}{service.Type}");
            }
        }
    }
}
