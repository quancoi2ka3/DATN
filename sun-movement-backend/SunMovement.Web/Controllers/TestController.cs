using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;

namespace SunMovement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICouponService _couponService;
        private readonly IInventoryService _inventoryService;

        public TestController(
            IUnitOfWork unitOfWork,
            ICouponService couponService,
            IInventoryService inventoryService)
        {
            _unitOfWork = unitOfWork;
            _couponService = couponService;
            _inventoryService = inventoryService;
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { Status = "OK", Message = "All services injected successfully" });
        }
    }
}
