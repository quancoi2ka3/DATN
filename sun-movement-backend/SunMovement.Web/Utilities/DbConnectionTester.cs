using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Web.Utilities
{
    public class DbConnectionTester
    {
        public static async Task<bool> TestConnection(string connectionString)
        {
            try
            {
                var serviceProvider = new ServiceCollection()
                    .AddDbContext<ApplicationDbContext>(options =>
                        options.UseSqlServer(connectionString))
                    .BuildServiceProvider();

                using (var scope = serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    
                    // Test connection
                    var canConnect = await dbContext.Database.CanConnectAsync();
                    Console.WriteLine($"Connection test result: {(canConnect ? "Success" : "Failed")}");
                    
                    // Get database info
                    if (canConnect)
                    {
                        Console.WriteLine($"Database provider: {dbContext.Database.ProviderName}");
                        Console.WriteLine($"Connection string: {dbContext.Database.GetConnectionString()}");
                    }
                    
                    return canConnect;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error testing database connection: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }
    }
}
