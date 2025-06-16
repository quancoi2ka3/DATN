using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Ensure database is created
            context.Database.EnsureCreated();            // Create roles if they don't exist
            string[] roles = { "Admin", "Customer", "Staff" };
            foreach (string role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }// Create admin user if it doesn't exist
            var adminEmail = "admin@sunmovement.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            
            if (adminUser == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    LockoutEnabled = false,
                    PhoneNumber = "1234567890",
                    CreatedAt = DateTime.UtcNow,
                    DateOfBirth = new DateTime(1990, 1, 1),
                    Address = "Admin Address",
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await userManager.CreateAsync(admin, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
                else
                {
                    // Log or handle the error
                    Console.WriteLine("Failed to create admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                // Check if existing admin is in admin role
                if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
                
                // Ensure email is confirmed and other properties are set
                if (!adminUser.EmailConfirmed || !adminUser.PhoneNumberConfirmed || adminUser.LockoutEnabled)
                {
                    adminUser.EmailConfirmed = true;
                    adminUser.PhoneNumberConfirmed = true;
                    adminUser.LockoutEnabled = false;
                    await userManager.UpdateAsync(adminUser);
                }
            }

            // Seed products if there are none
            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product
                    {                        Name = "Sun Movement T-Shirt",
                        Description = "High-quality athletic t-shirt with the Sun Movement logo",
                        Category = ProductCategory.Sportswear,
                        Price = 25.99m,
                        ImageUrl = "/images/products/t-shirt.jpg",
                        IsActive = true,
                        IsFeatured = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {                        Name = "Protein Powder (1kg)",
                        Description = "Premium whey protein for optimal recovery",
                        Category = ProductCategory.Supplements,
                        Price = 45.99m,
                        ImageUrl = "/images/products/protein.jpg",
                        IsActive = true,
                        IsFeatured = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {                        Name = "Training Shorts",
                        Description = "Breathable, lightweight shorts for any workout",
                        Category = ProductCategory.Sportswear,
                        Price = 29.99m,
                        ImageUrl = "/images/products/shorts.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {                        Name = "Pre-Workout Formula",
                        Description = "Energy-boosting formula for intense training sessions",
                        Category = ProductCategory.Supplements,
                        Price = 35.99m,
                        ImageUrl = "/images/products/pre-workout.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }

            // Seed services if there are none
            if (!context.Services.Any())
            {
                var services = new List<Service>
                {
                    new Service
                    {                        Name = "Yoga Classes",
                        Description = "Rejuvenate your mind and body with our expert-led yoga sessions",
                        Type = ServiceType.Yoga,
                        Price = 15.99m,
                        ImageUrl = "/images/services/yoga.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Service
                    {                        Name = "Strength Training",
                        Description = "Build muscle and increase strength with our specialized training programs",
                        Type = ServiceType.Strength,
                        Price = 25.99m,
                        ImageUrl = "/images/services/strength.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Service
                    {                        Name = "Calisthenics",
                        Description = "Master bodyweight exercises and achieve functional fitness",
                        Type = ServiceType.Calisthenics,
                        Price = 20.99m,
                        ImageUrl = "/images/services/calisthenics.jpg",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Services.AddRange(services);
                await context.SaveChangesAsync();
            }

            // Seed events if there are none
            if (!context.Events.Any())
            {
                var events = new List<Event>
                {
                    new Event
                    {
                        Title = "Summer Fitness Challenge",
                        Description = "Join our 30-day challenge to transform your body and mind",
                        EventDate = DateTime.UtcNow.AddDays(14),
                        Location = "Sun Movement Main Studio",
                        OrganizedBy = "Sun Movement Team",
                        ImageUrl = "/images/events/challenge.jpg",
                        RegistrationLink = "/register/summer-challenge",
                        IsActive = true,
                        IsFeatured = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Event
                    {
                        Title = "Nutrition Workshop",
                        Description = "Learn about optimal nutrition for athletic performance",
                        EventDate = DateTime.UtcNow.AddDays(7),
                        Location = "Sun Movement Conference Room",
                        OrganizedBy = "Nutrition Specialists",
                        ImageUrl = "/images/events/nutrition.jpg",
                        RegistrationLink = "/register/nutrition-workshop",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Events.AddRange(events);
                await context.SaveChangesAsync();
            }

            // Seed FAQs if there are none
            if (!context.FAQs.Any())
            {
                var faqs = new List<FAQ>
                {
                    new FAQ
                    {
                        Question = "What are your operating hours?",
                        Answer = "We are open Monday to Friday from 6:00 AM to 10:00 PM, and weekends from 8:00 AM to 8:00 PM.",
                        Category = FAQCategory.General,
                        IsActive = true,
                        DisplayOrder = 1,
                        CreatedAt = DateTime.UtcNow
                    },
                    new FAQ
                    {
                        Question = "Do you offer personal training?",
                        Answer = "Yes, we offer one-on-one personal training with our certified trainers. You can book a session through our website or at the front desk.",
                        Category = FAQCategory.Services,
                        IsActive = true,
                        DisplayOrder = 1,
                        CreatedAt = DateTime.UtcNow
                    },
                    new FAQ
                    {                        Question = "How do I cancel my membership?",
                        Answer = "You can cancel your membership by visiting our facility and speaking with a staff member, or by sending an email to cancel@sunmovement.com with your membership details.",
                        Category = FAQCategory.Services,
                        IsActive = true,
                        DisplayOrder = 1,
                        CreatedAt = DateTime.UtcNow
                    },
                    new FAQ
                    {                        Question = "What payment methods do you accept?",
                        Answer = "We accept all major credit cards, bank transfers, and cash payments at our facility.",
                        Category = FAQCategory.Payment,
                        IsActive = true,
                        DisplayOrder = 1,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.FAQs.AddRange(faqs);
                await context.SaveChangesAsync();
            }
        }
    }
}
