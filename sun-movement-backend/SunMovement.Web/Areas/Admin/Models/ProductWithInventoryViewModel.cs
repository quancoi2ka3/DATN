using System;
using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Models
{
    public class ProductWithInventoryViewModel
    {
        public Product? Product { get; set; }
        public List<InventoryTransaction> InventoryTransactions { get; set; }
        public List<Coupon> AppliedCoupons { get; set; }
        public int CurrentStock { get; set; }
        public decimal TotalCost { get; set; }
        public int ReorderPoint { get; set; }
        public DateTime? LastRestock { get; set; }
        
        public ProductWithInventoryViewModel()
        {
            InventoryTransactions = new List<InventoryTransaction>();
            AppliedCoupons = new List<Coupon>();
        }
    }
}
