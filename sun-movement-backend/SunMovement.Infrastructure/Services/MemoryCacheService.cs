using System;
using System.Collections.Concurrent;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using SunMovement.Core.Interfaces;

namespace SunMovement.Infrastructure.Services
{
    public class MemoryCacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ConcurrentDictionary<string, bool> _cacheKeys;

        public MemoryCacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
            _cacheKeys = new ConcurrentDictionary<string, bool>();
        }

        public T Get<T>(string key)
        {
            if (_memoryCache.TryGetValue(key, out T value))
            {
                return value;
            }
            return default;
        }

        public void Set<T>(string key, T value, TimeSpan? absoluteExpiration = null)
        {
            var options = new MemoryCacheEntryOptions();
            if (absoluteExpiration.HasValue)
            {
                options.AbsoluteExpirationRelativeToNow = absoluteExpiration;
            }
            else
            {
                options.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            }
            
            // Track the cache key
            _cacheKeys.TryAdd(key, true);
            
            _memoryCache.Set(key, value, options);
        }

        public void Remove(string key)
        {
            _memoryCache.Remove(key);
            _cacheKeys.TryRemove(key, out _);
        }

        public void Clear()
        {
            foreach (var key in _cacheKeys.Keys.ToList())
            {
                _memoryCache.Remove(key);
                _cacheKeys.TryRemove(key, out _);
            }
        }
        
        public void RemoveByPrefix(string prefix)
        {
            foreach (var key in _cacheKeys.Keys.Where(k => k.StartsWith(prefix)).ToList())
            {
                _memoryCache.Remove(key);
                _cacheKeys.TryRemove(key, out _);
            }
        }
    }
}
