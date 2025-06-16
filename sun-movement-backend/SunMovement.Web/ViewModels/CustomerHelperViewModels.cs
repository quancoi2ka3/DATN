using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Web.ViewModels
{
    public class CustomerSearchResultViewModel
    {
        public List<ApplicationUser> Customers { get; set; } = new List<ApplicationUser>();
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public string Query { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class MonthlyRegistrationData
    {
        public string Month { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class SearchTermData
    {
        public string Term { get; set; } = string.Empty;
        public int Count { get; set; }
        public double ClickRate { get; set; }
    }

    public class SearchTrendData
    {
        public DateTime Date { get; set; }
        public int TotalSearches { get; set; }
    }
}
