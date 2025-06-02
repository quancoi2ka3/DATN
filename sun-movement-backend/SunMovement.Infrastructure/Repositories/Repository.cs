using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        // Removed SaveChangesAsync as this should be handled by UnitOfWork
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        // Removed SaveChangesAsync as this should be handled by UnitOfWork
        return entity;
    }

    public async Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        // Removed SaveChangesAsync as this should be handled by UnitOfWork
    }

        public async Task<int> CountAsync()
        {
            return await _dbSet.CountAsync();
        }        public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.CountAsync(predicate);
        }        public async Task<bool> ExistsAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            return entity != null;
        }

        public virtual async Task<T> GetOrderWithDetailsAsync(int id)
        {
            // This is a base implementation that should be overridden in OrderRepository
            // For generic repositories, just return the entity by ID
            return await GetByIdAsync(id);
        }

        public virtual async Task<IEnumerable<SunMovement.Core.Models.Order>> GetOrdersByUserIdAsync(string userId)
        {
            // This is a base implementation that should be overridden in OrderRepository
            // For generic repositories, return an empty list
            return new List<SunMovement.Core.Models.Order>();
        }
    }
}
