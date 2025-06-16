using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Web.ViewModels
{
    public class CustomerAnalyticsViewModel
    {
        public int TotalCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public int InactiveCustomers { get; set; }
        public int NewCustomersThisMonth { get; set; }
        public int NewCustomersThisWeek { get; set; }
        public int NewCustomersToday { get; set; }

        // Customer demographics
        public Dictionary<string, int> CustomersByAge { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> CustomersByLocation { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> CustomersByRegistrationMonth { get; set; } = new Dictionary<string, int>();

        // Customer behavior
        public decimal AverageOrderValue { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; } // Added missing property
        public Dictionary<string, int> TopCustomersByOrders { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, decimal> TopCustomersByRevenue { get; set; } = new Dictionary<string, decimal>();
        public List<ApplicationUser> TopCustomers { get; set; } = new List<ApplicationUser>(); // Added missing property

        // Additional properties for the controller
        public int CustomersWithOrders { get; set; }
        public int AverageAge { get; set; }
        public List<ApplicationUser> RecentCustomers { get; set; } = new List<ApplicationUser>();
        public List<MonthlyRegistrationData> MonthlyRegistrations { get; set; } = new List<MonthlyRegistrationData>();

        // Engagement metrics
        public double AverageSessionDuration { get; set; }
        public int TotalPageViews { get; set; }
        public double BounceRate { get; set; }
        public Dictionary<string, int> MostViewedProducts { get; set; } = new Dictionary<string, int>();

        // Retention metrics
        public double CustomerRetentionRate { get; set; }
        public double CustomerChurnRate { get; set; }
        public Dictionary<string, int> CustomerRetentionByMonth { get; set; } = new Dictionary<string, int>();
    }
}
