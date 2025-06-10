using System;

namespace SunMovement.Web.ViewModels
{
    public class ServiceScheduleViewModel
    {
        public int Id { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Location { get; set; }
        public string Instructor { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
    }
}
