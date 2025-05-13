using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<Service> GetServiceWithSchedulesAsync(int id);
        Task<IEnumerable<Service>> GetServicesByTypeAsync(ServiceType type);
        Task<IEnumerable<Service>> GetAllServicesWithSchedulesAsync();
        Task<Service> GetWithSchedulesAsync(int id);
        Task<ServiceSchedule> AddScheduleAsync(ServiceSchedule schedule);
        Task<ServiceSchedule> UpdateScheduleAsync(ServiceSchedule schedule);
        Task DeleteScheduleAsync(ServiceSchedule schedule);
    }
}
