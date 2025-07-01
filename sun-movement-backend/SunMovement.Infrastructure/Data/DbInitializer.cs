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
                };                context.FAQs.AddRange(faqs);
                await context.SaveChangesAsync();
            }

            // Seed Articles if there are none
            if (!context.Articles.Any())
            {
                await SeedArticlesAsync(context);
            }
            
            // Seed Sportswear Products
            await SeedProducts.SeedSportswearProductsAsync(context);
        }

        private static async Task SeedArticlesAsync(ApplicationDbContext context)
        {
            var articles = new List<Article>
            {
                new Article
                {
                    Title = "Hướng dẫn Calisthenics cho người mới bắt đầu",
                    Content = "<h2>Giới thiệu về Calisthenics</h2><p>Calisthenics là một hình thức tập luyện sử dụng trọng lượng cơ thể để phát triển sức mạnh, sự linh hoạt và thể lực tổng thể. Đây là phương pháp tập luyện lý tưởng cho những người mới bắt đầu.</p><h3>Lợi ích của Calisthenics</h3><ul><li>Không cần thiết bị phức tạp</li><li>Có thể tập luyện mọi lúc, mọi nơi</li><li>Phát triển sức mạnh chức năng</li><li>Cải thiện sự linh hoạt và thăng bằng</li></ul><h3>Các bài tập cơ bản</h3><p>1. <strong>Push-ups (Hít đất)</strong> - Phát triển cơ ngực, vai và tay</p><p>2. <strong>Pull-ups (Kéo xà)</strong> - Tăng cường cơ lưng và tay</p><p>3. <strong>Squats (Gánh tạ)</strong> - Rèn luyện cơ chân và mông</p><p>4. <strong>Planks</strong> - Tăng cường cơ core</p>",
                    Summary = "Hướng dẫn chi tiết về Calisthenics dành cho người mới bắt đầu, bao gồm các bài tập cơ bản và lợi ích.",
                    Type = ArticleType.Guide,
                    Category = ArticleCategory.Calisthenics,
                    Tags = "calisthenics, người mới bắt đầu, hướng dẫn, tập luyện",
                    Author = "Sun Movement Team",
                    IsPublished = true,
                    IsFeatured = true,
                    DisplayOrder = 1,
                    MetaTitle = "Hướng dẫn Calisthenics cho người mới bắt đầu - Sun Movement",
                    MetaDescription = "Học cách tập Calisthenics từ cơ bản đến nâng cao. Hướng dẫn chi tiết các bài tập và kỹ thuật cho người mới bắt đầu.",
                    MetaKeywords = "calisthenics, hướng dẫn, người mới bắt đầu, tập luyện",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    PublishedAt = DateTime.UtcNow.AddDays(-10),
                    ViewCount = 125
                },

                new Article
                {
                    Title = "10 Lợi ích tuyệt vời của việc tập Yoga",
                    Content = "<h2>Yoga - Nghệ thuật sống khỏe mạnh</h2><p>Yoga không chỉ là một bài tập thể dục mà còn là một lối sống giúp cân bằng giữa cơ thể, tâm trí và tinh thần.</p><h3>10 Lợi ích chính của Yoga:</h3><ol><li><strong>Tăng cường sự linh hoạt</strong> - Các tư thế yoga giúp kéo giãn và tăng độ linh hoạt cho cơ thể</li><li><strong>Cải thiện sức mạnh cơ bắp</strong> - Nhiều tư thế yoga đòi hỏi sức mạnh để duy trì</li><li><strong>Giảm căng thẳng</strong> - Yoga giúp thư giãn và giảm stress hiệu quả</li><li><strong>Cải thiện giấc ngủ</strong> - Thực hành yoga đều đặn giúp ngủ ngon hơn</li><li><strong>Tăng cường thăng bằng</strong> - Các tư thế cân bằng giúp cải thiện khả năng điều phối</li></ol>",
                    Summary = "Khám phá 10 lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe thể chất và tinh thần của bạn.",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Yoga,
                    Tags = "yoga, sức khỏe, thể dục, tinh thần",
                    Author = "Yoga Master",
                    IsPublished = true,
                    IsFeatured = false,
                    DisplayOrder = 2,
                    MetaTitle = "10 Lợi ích tuyệt vời của Yoga - Sun Movement",
                    MetaDescription = "Tìm hiểu về những lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe và tinh thần của bạn.",
                    MetaKeywords = "yoga, lợi ích, sức khỏe, thể dục",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    PublishedAt = DateTime.UtcNow.AddDays(-7),
                    ViewCount = 89
                },

                new Article
                {
                    Title = "Chào mừng đến với Sun Movement - Nơi bắt đầu hành trình khỏe mạnh",
                    Content = "<h1>Sun Movement - Nơi khởi đầu cho sự thay đổi</h1><p>Chào mừng bạn đến với Sun Movement - trung tâm thể dục thể thao hàng đầu, nơi chúng tôi cam kết mang đến cho bạn trải nghiệm tập luyện tuyệt vời nhất.</p><h2>Tại sao chọn Sun Movement?</h2><ul><li>Đội ngũ huấn luyện viên chuyên nghiệp với kinh nghiệm quốc tế</li><li>Cơ sở vật chất hiện đại, trang thiết bị tiên tiến</li><li>Chương trình tập luyện đa dạng phù hợp mọi độ tuổi</li><li>Môi trường tập luyện thân thiện và tích cực</li></ul>",
                    Summary = "Sun Movement là điểm đến lý tưởng cho những ai muốn bắt đầu hành trình rèn luyện sức khỏe và thể hình.",
                    Type = ArticleType.HeroBanner,
                    Category = ArticleCategory.Homepage,
                    Tags = "sun movement, giới thiệu, fitness, gym",
                    Author = "Admin",
                    IsPublished = true,
                    IsFeatured = true,
                    DisplayOrder = 0,
                    MetaTitle = "Sun Movement - Trung tâm thể dục thể thao hàng đầu",
                    MetaDescription = "Sun Movement - Trung tâm thể dục thể thao chuyên nghiệp với đội ngũ huấn luyện viên giàu kinh nghiệm và trang thiết bị hiện đại.",
                    MetaKeywords = "sun movement, gym, fitness, thể dục",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    PublishedAt = DateTime.UtcNow.AddDays(-15),                    ViewCount = 256
                },

                // Additional English articles for frontend sections
                new Article
                {
                    Title = "Modern Yoga Practice: A Beginner's Guide",
                    Content = @"<h2>Introduction to Modern Yoga</h2>
                    <p>Yoga is an ancient practice that has evolved to meet the needs of modern practitioners. This comprehensive guide will help you understand the fundamentals of yoga and how to start your practice.</p>
                    
                    <h3>Benefits of Yoga</h3>
                    <ul>
                        <li>Improved flexibility and strength</li>
                        <li>Better mental clarity and focus</li>
                        <li>Stress reduction and relaxation</li>
                        <li>Enhanced balance and coordination</li>
                    </ul>
                    
                    <h3>Getting Started</h3>
                    <p>Begin with basic poses such as Mountain Pose, Downward Dog, and Child's Pose. Focus on proper breathing and alignment rather than achieving perfect poses.</p>",
                    Summary = "A comprehensive guide to starting your yoga journey, covering basic poses, breathing techniques, and the numerous benefits of regular practice.",
                    Slug = "modern-yoga-practice-beginners-guide",
                    ImageUrl = "/uploads/articles/yoga-beginner.jpg",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Homepage,
                    Tags = "[\"yoga\", \"beginner\", \"wellness\", \"meditation\", \"health\"]",
                    Author = "Sarah Johnson",
                    IsPublished = true,
                    IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-7),
                    DisplayOrder = 10,
                    MetaTitle = "Modern Yoga Practice: Complete Beginner's Guide",
                    MetaDescription = "Learn yoga from scratch with our comprehensive beginner's guide. Discover poses, breathing techniques, and health benefits.",
                    MetaKeywords = "yoga, beginner yoga, yoga practice, meditation, wellness, health",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    ViewCount = 89
                },
                
                new Article
                {
                    Title = "Calisthenics: Building Strength with Bodyweight",
                    Content = @"<h2>What is Calisthenics?</h2>
                    <p>Calisthenics is a form of strength training that uses your own body weight as resistance. It's an effective way to build muscle, improve flexibility, and increase endurance without the need for expensive equipment.</p>
                    
                    <h3>Basic Movements</h3>
                    <ul>
                        <li><strong>Push-ups:</strong> Build chest, shoulders, and triceps</li>
                        <li><strong>Pull-ups:</strong> Strengthen back and biceps</li>
                        <li><strong>Squats:</strong> Develop leg and glute strength</li>
                        <li><strong>Dips:</strong> Target triceps and chest</li>
                    </ul>
                    
                    <h3>Progression Techniques</h3>
                    <p>Start with basic variations and gradually increase difficulty. For example, begin with knee push-ups before progressing to full push-ups, then to one-arm push-ups.</p>",
                    Summary = "Discover the power of bodyweight training with calisthenics. Learn fundamental movements and progression techniques for building strength naturally.",
                    Slug = "calisthenics-bodyweight-strength-training",
                    ImageUrl = "/uploads/articles/calisthenics-training.jpg",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Homepage,
                    Tags = "[\"calisthenics\", \"bodyweight\", \"strength training\", \"fitness\", \"workout\"]",
                    Author = "Mike Chen",
                    IsPublished = true,
                    IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    DisplayOrder = 11,
                    MetaTitle = "Calisthenics Training: Master Bodyweight Exercises",
                    MetaDescription = "Master the art of calisthenics with our comprehensive guide to bodyweight training and strength building exercises.",
                    MetaKeywords = "calisthenics, bodyweight training, strength training, fitness, pull-ups, push-ups",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    ViewCount = 134
                },
                
                new Article
                {
                    Title = "Strength Training Fundamentals for Beginners",
                    Content = @"<h2>Introduction to Strength Training</h2>
                    <p>Strength training is one of the most effective ways to build muscle, increase bone density, and improve overall health. This guide covers everything beginners need to know to start their strength training journey safely and effectively.</p>
                    
                    <h3>Basic Principles</h3>
                    <ul>
                        <li><strong>Progressive Overload:</strong> Gradually increase weight, reps, or sets</li>
                        <li><strong>Proper Form:</strong> Focus on technique over heavy weights</li>
                        <li><strong>Rest and Recovery:</strong> Allow muscles time to repair and grow</li>
                        <li><strong>Consistency:</strong> Regular training yields the best results</li>
                    </ul>
                    
                    <h3>Essential Exercises</h3>
                    <p>Focus on compound movements that work multiple muscle groups:</p>
                    <ul>
                        <li>Squats - Lower body power</li>
                        <li>Deadlifts - Posterior chain strength</li>
                        <li>Bench Press - Upper body pushing</li>
                        <li>Rows - Upper body pulling</li>
                    </ul>",
                    Summary = "Master the fundamentals of strength training with our beginner-friendly guide covering essential exercises, proper form, and progressive training principles.",
                    Slug = "strength-training-fundamentals-beginners",
                    ImageUrl = "/uploads/articles/strength-training.jpg",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Homepage,
                    Tags = "[\"strength training\", \"weightlifting\", \"beginner\", \"fitness\", \"muscle building\"]",
                    Author = "Alex Rodriguez",
                    IsPublished = true,
                    IsFeatured = true,
                    PublishedAt = DateTime.UtcNow.AddDays(-3),
                    DisplayOrder = 12,
                    MetaTitle = "Strength Training for Beginners: Complete Guide",
                    MetaDescription = "Learn strength training basics with our comprehensive beginner's guide. Master essential exercises and build muscle safely.",
                    MetaKeywords = "strength training, weightlifting, beginner fitness, muscle building, gym workouts",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    ViewCount = 76
                }
            };

            await context.Articles.AddRangeAsync(articles);
            await context.SaveChangesAsync();
        }
    }
}
