using System.Collections.Generic;

namespace SunMovement.Web.ViewModels
{
    public class CustomerSearchStatsViewModel
    {
        public int TotalSearches { get; set; }
        public int UniqueCustomers { get; set; }
        public double AverageSearchesPerCustomer { get; set; }

        // Search patterns
        public Dictionary<string, int> SearchesByHour { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> SearchesByDay { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> SearchesByCategory { get; set; } = new Dictionary<string, int>();

        // Properties using proper list types
        public List<SearchTermData> TopSearchTerms { get; set; } = new List<SearchTermData>();
        public List<SearchTrendData> SearchTrends { get; set; } = new List<SearchTrendData>();
        public int UniqueSearchers { get; set; }
        public double AverageClickThroughRate { get; set; }
        public int NoResultsSearches { get; set; }

        // Search results and success rates
        public Dictionary<string, double> SearchSuccessRates { get; set; } = new Dictionary<string, double>();
        public Dictionary<string, int> ResultsPerSearch { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, double> ClickThroughRates { get; set; } = new Dictionary<string, double>();

        // Customer behavior after search
        public Dictionary<string, int> ConversionsBySearchTerm { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, decimal> RevenueBySearchTerm { get; set; } = new Dictionary<string, decimal>();
        public double OverallConversionRate { get; set; }

        // Time-based analytics
        public Dictionary<string, int> SearchesByMonth { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> TrendingSearchTerms { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> PopularProductSearches { get; set; } = new Dictionary<string, int>();
        public Dictionary<string, int> PopularServiceSearches { get; set; } = new Dictionary<string, int>();
    }
}
