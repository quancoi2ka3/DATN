using System;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using SunMovement.Core.Interfaces;
using System.Collections.Concurrent;

namespace SunMovement.Core.Services
{
    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ConcurrentDictionary<string, bool> _keys;

        public CacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
            _keys = new ConcurrentDictionary<string, bool>();
        }
        
        public T? Get<T>(string key)
        {
            _memoryCache.TryGetValue(key, out T? value);
            return value;
        }

        public void Set<T>(string key, T value, TimeSpan? absoluteExpiration = null)
        {
            var cacheOptions = new MemoryCacheEntryOptions();
            
            if (absoluteExpiration.HasValue)
            {
                cacheOptions.SetAbsoluteExpiration(absoluteExpiration.Value);
            }
            else
            {
                cacheOptions.SetAbsoluteExpiration(TimeSpan.FromMinutes(30)); // Default expiration
            }
            
            cacheOptions.SetSlidingExpiration(TimeSpan.FromMinutes(2));
            
            _memoryCache.Set(key, value, cacheOptions);
            _keys.TryAdd(key, true);
        }

        public void Remove(string key)
        {
            _memoryCache.Remove(key);
            _keys.TryRemove(key, out _);
        }

        public void Clear()
        {
            foreach (var key in _keys.Keys)
            {
                _memoryCache.Remove(key);
            }
            _keys.Clear();
        }

        public void RemoveByPrefix(string prefix)
        {
            // Find all keys starting with the given prefix
            var keysToRemove = _keys.Keys.Where(key => key.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)).ToList();
            
            // Remove each matching key
            foreach (var key in keysToRemove)
            {
                _memoryCache.Remove(key);
                _keys.TryRemove(key, out _);
            }
        }
    }
}