// Test file to check compilation
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Repositories;

namespace TestBuild
{
    public class TestClass
    {
        public void TestMethod()
        {
            // Test if we can reference the interfaces
            IProductSupplierRepository? ps = null;
            ICouponUsageHistoryRepository? ch = null;
            
            // Test if we can reference the implementations
            ProductSupplierRepository? psr = null;
            CouponUsageHistoryRepository? chr = null;
        }
    }
}
