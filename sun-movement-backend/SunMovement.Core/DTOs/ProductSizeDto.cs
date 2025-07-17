using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Core.DTOs
{
    public class ProductSizeDto
    {
        public int Id { get; set; }
        public string SizeLabel { get; set; }
        public int StockQuantity { get; set; }
    }
}