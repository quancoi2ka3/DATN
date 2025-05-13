using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SunMovement.Web.Utilities;

namespace SunMovement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseTestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public DatabaseTestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> TestConnection()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                return BadRequest("Connection string is not configured");
            }

            var result = await DbConnectionTester.TestConnection(connectionString);
            
            if (result)
            {
                return Ok("Successfully connected to the database");
            }
            else
            {
                return StatusCode(500, "Failed to connect to the database");
            }
        }
    }
}
