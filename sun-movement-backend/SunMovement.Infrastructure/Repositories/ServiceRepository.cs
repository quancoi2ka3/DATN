using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Repositories
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
            _dbContext = context;
        }

        public async Task<Service> GetServiceWithSchedulesAsync(int id)
        {
            return await _dbSet
                .Include(s => s.Schedules)
                .FirstOrDefaultAsync(s => s.Id == id) ?? new Service();
        }

        public async Task<IEnumerable<Service>> GetServicesByTypeAsync(ServiceType type)
        {
            return await _dbSet
                .Where(s => s.IsActive && s.Type == type)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> GetAllServicesWithSchedulesAsync()
        {
            return await _dbSet
                .Where(s => s.IsActive)
                .Include(s => s.Schedules.Where(ss => ss.IsActive))
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<Service> GetWithSchedulesAsync(int id)
        {
            return await _dbSet
                .Include(s => s.Schedules)
                .FirstOrDefaultAsync(s => s.Id == id) ?? new Service();
        }        public async Task<ServiceSchedule> AddScheduleAsync(ServiceSchedule schedule)
        {
            await _dbContext.ServiceSchedules.AddAsync(schedule);
            return schedule;
        }        public Task<ServiceSchedule> UpdateScheduleAsync(ServiceSchedule schedule)
        {
            _dbContext.Entry(schedule).State = EntityState.Modified;
            return Task.FromResult(schedule);
        }        public Task DeleteScheduleAsync(ServiceSchedule schedule)
        {
            _dbContext.ServiceSchedules.Remove(schedule);
            return Task.CompletedTask;
        }
    }
}
