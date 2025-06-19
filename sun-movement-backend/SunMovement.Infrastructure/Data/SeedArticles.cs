using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Data
{
    public static class SeedArticles
    {
        public static void SeedSampleArticles(ApplicationDbContext context)
        {
            // Check if articles already exist
            if (context.Articles.Any())
            {
                return; // Database has been seeded
            }

            var articles = new List<Article>
            {
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
                    <p>Begin with basic poses such as Mountain Pose, Downward Dog, and Child's Pose. Focus on proper breathing and alignment rather than achieving perfect poses.</p>
                    
                    <h3>Essential Equipment</h3>
                    <p>All you need is a yoga mat and comfortable clothing. Props like blocks and straps can be helpful but aren't necessary for beginners.</p>",
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
                    DisplayOrder = 1,
                    MetaTitle = "Modern Yoga Practice: Complete Beginner's Guide",
                    MetaDescription = "Learn yoga from scratch with our comprehensive beginner's guide. Discover poses, breathing techniques, and health benefits.",
                    MetaKeywords = "yoga, beginner yoga, yoga practice, meditation, wellness, health"
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
                    <p>Start with basic variations and gradually increase difficulty. For example, begin with knee push-ups before progressing to full push-ups, then to one-arm push-ups.</p>
                    
                    <h3>Creating a Routine</h3>
                    <p>Aim for 3-4 workouts per week, focusing on different muscle groups each session. Allow adequate rest between workouts for muscle recovery.</p>",
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
                    DisplayOrder = 2,
                    MetaTitle = "Calisthenics Training: Master Bodyweight Exercises",
                    MetaDescription = "Master the art of calisthenics with our comprehensive guide to bodyweight training and strength building exercises.",
                    MetaKeywords = "calisthenics, bodyweight training, strength training, fitness, pull-ups, push-ups"
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
                    </ul>
                    
                    <h3>Getting Started</h3>
                    <p>Begin with lighter weights to master proper form. Consider working with a qualified trainer for your first few sessions to ensure safe technique.</p>",
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
                    DisplayOrder = 3,
                    MetaTitle = "Strength Training for Beginners: Complete Guide",
                    MetaDescription = "Learn strength training basics with our comprehensive beginner's guide. Master essential exercises and build muscle safely.",
                    MetaKeywords = "strength training, weightlifting, beginner fitness, muscle building, gym workouts"
                },
                
                new Article
                {
                    Title = "Nutrition for Active Lifestyles",
                    Content = @"<h2>Fueling Your Active Life</h2>
                    <p>Proper nutrition is the foundation of any successful fitness program. Whether you're practicing yoga, doing calisthenics, or strength training, what you eat directly impacts your performance and recovery.</p>
                    
                    <h3>Macronutrient Balance</h3>
                    <ul>
                        <li><strong>Proteins:</strong> 0.8-1.2g per kg body weight for muscle repair</li>
                        <li><strong>Carbohydrates:</strong> Primary energy source for workouts</li>
                        <li><strong>Fats:</strong> Essential for hormone production and joint health</li>
                    </ul>
                    
                    <h3>Pre-Workout Nutrition</h3>
                    <p>Eat a balanced meal 2-3 hours before exercising, or a light snack 30-60 minutes before. Focus on easily digestible carbohydrates and moderate protein.</p>
                    
                    <h3>Post-Workout Recovery</h3>
                    <p>Within 30 minutes after exercise, consume a combination of protein and carbohydrates to optimize muscle recovery and replenish energy stores.</p>
                    
                    <h3>Hydration</h3>
                    <p>Maintain proper hydration throughout the day. Drink water before, during, and after exercise to support performance and recovery.</p>",
                    Summary = "Optimize your fitness results with proper nutrition. Learn about macronutrients, meal timing, and hydration strategies for active individuals.",
                    Slug = "nutrition-for-active-lifestyles",
                    ImageUrl = "/uploads/articles/nutrition-fitness.jpg",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Homepage,
                    Tags = "[\"nutrition\", \"fitness\", \"diet\", \"health\", \"recovery\"]",
                    Author = "Dr. Lisa Thompson",
                    IsPublished = true,
                    IsFeatured = false,
                    PublishedAt = DateTime.UtcNow.AddDays(-1),
                    DisplayOrder = 4,
                    MetaTitle = "Nutrition Guide for Active Lifestyles",
                    MetaDescription = "Fuel your fitness journey with proper nutrition. Learn about macronutrients, meal timing, and hydration for optimal performance.",
                    MetaKeywords = "nutrition, fitness diet, sports nutrition, healthy eating, workout nutrition"
                }
            };

            context.Articles.AddRange(articles);
            context.SaveChanges();
        }
    }
}
