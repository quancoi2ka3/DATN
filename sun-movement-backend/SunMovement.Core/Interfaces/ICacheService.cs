using System;

namespace SunMovement.Core.Interfaces
{    public interface ICacheService
    {
        T Get<T>(string key);
        void Set<T>(string key, T value, TimeSpan? absoluteExpiration = null);
        void Remove(string key);
        void Clear();
        void RemoveByPrefix(string prefix);
    }
}
