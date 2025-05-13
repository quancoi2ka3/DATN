using System;

namespace SunMovement.Core.Models
{
    public class ServiceSchedule
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string TrainerName { get; set; } = string.Empty;
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxCapacity { get; set; }
        public bool IsActive { get; set; } = true;
        public string Location { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public int Capacity { get; set; }
        public string Instructor { get; set; } = string.Empty;
        
        // Navigation property
        public virtual Service? Service { get; set; }
    }
}
