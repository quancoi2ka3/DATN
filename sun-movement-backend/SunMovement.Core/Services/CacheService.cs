using System;
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
        }        public T? Get<T>(string key)
        {
            _memoryCache.TryGetValue(key, out T? value);
            return value;
        }

        public void Set<T>(string key, T value, TimeSpan timeSpan)
        {
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(timeSpan)
                .SetSlidingExpiration(TimeSpan.FromMinutes(2));
            
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
    }
}