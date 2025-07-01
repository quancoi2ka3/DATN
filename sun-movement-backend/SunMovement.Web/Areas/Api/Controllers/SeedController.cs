using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunMovement.Infrastructure.Data;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Area("Api")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("sportswear")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedSportswear()
        {
            try
            {
                await SeedProducts.SeedSportswearProductsAsync(_context);
                return Ok(new { success = true, message = "Thêm dữ liệu sportswear thành công." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = $"Lỗi khi thêm dữ liệu: {ex.Message}" });
            }
        }

        [HttpGet("sportswear/force")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ForceSeedSportswear()
        {
            try
            {
                // Bỏ qua việc kiểm tra sản phẩm đã tồn tại
                var products = await _context.Products
                    .Where(p => p.Name == "Áo Polo Sun Movement" || p.Name == "Short da cá Sun Movement")
                    .ToListAsync();
                
                if (products.Any())
                {
                    _context.Products.RemoveRange(products);
                    await _context.SaveChangesAsync();
                }

                await SeedProducts.SeedSportswearProductsAsync(_context);
                return Ok(new { success = true, message = "Thêm dữ liệu sportswear thành công (đã xóa dữ liệu cũ)." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, message = $"Lỗi khi thêm dữ liệu: {ex.Message}" });
            }
        }
    }
}
