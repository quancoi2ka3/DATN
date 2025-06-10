using System.Collections.Generic;

namespace SunMovement.Web.ViewModels
{
    public class ServiceViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Type { get; set; }
        public string Features { get; set; }
        public List<ServiceScheduleViewModel> Schedules { get; set; }
    }
}
