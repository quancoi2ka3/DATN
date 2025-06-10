using System.Collections.Generic;

namespace SunMovement.Web.ViewModels
{
    public class ProductsIndexViewModel
    {
        public IEnumerable<ProductViewModel> Products { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public string CurrentCategory { get; set; }
        public string CurrentSearch { get; set; }
        public string CurrentSort { get; set; }
    }
}
