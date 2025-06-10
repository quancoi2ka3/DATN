using System.Collections.Generic;

namespace SunMovement.Web.ViewModels
{
    public class ServicesIndexViewModel
    {
        public IEnumerable<ServiceViewModel> Services { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public string CurrentType { get; set; }
        public string CurrentSearch { get; set; }
    }
}
