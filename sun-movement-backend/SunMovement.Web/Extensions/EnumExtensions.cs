using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace SunMovement.Web.Extensions
{
    public static class EnumExtensions
    {
        public static string GetDisplayName(this Enum enumValue)
        {
            var displayAttribute = enumValue.GetType()
                .GetMember(enumValue.ToString())[0]
                .GetCustomAttribute<DisplayAttribute>();
            
            return displayAttribute?.Name ?? enumValue.ToString();
        }
    }
}
