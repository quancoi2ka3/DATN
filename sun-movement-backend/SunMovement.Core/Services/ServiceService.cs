using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            return await _unitOfWork.Services.GetAllAsync();
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            return service ?? new Service();
        }

        public async Task<Service> GetServiceWithSchedulesAsync(int id)
        {
            var service = await _unitOfWork.Services.GetServiceWithSchedulesAsync(id);
            return service ?? new Service();
        }

        public async Task<IEnumerable<Service>> GetServicesByTypeAsync(ServiceType type)
        {
            var services = await _unitOfWork.Services.GetServicesByTypeAsync(type);
            return services ?? new List<Service>();
        }

        public async Task<Service> CreateServiceAsync(Service service)
        {
            service.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Services.AddAsync(service);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task<Service> UpdateServiceAsync(Service service)
        {
            service.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Services.UpdateAsync(service);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(id);
            if (service != null)
            {
                await _unitOfWork.Services.DeleteAsync(service);
                await _unitOfWork.CompleteAsync();
            }
        }
    }
}
