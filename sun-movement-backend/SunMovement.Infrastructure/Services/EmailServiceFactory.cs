using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using System;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Factory pattern để chọn Email Service phù hợp cho từng environment
    /// - Development: EmailService (SMTP Gmail) hoặc MockEmailService
    /// - Production: EmailService (SMTP Gmail)
    /// </summary>
    public class EmailServiceFactory
    {
        public static void ConfigureEmailService(IServiceCollection services, IConfiguration configuration)
        {
            var emailProvider = configuration["Email:Provider"]?.ToLower() ?? "smtp";
            var environment = configuration["ASPNETCORE_ENVIRONMENT"]?.ToLower() ?? "development";

            Console.WriteLine($"📧 Configuring Email Service - Provider: {emailProvider}, Environment: {environment}");
            
            switch (emailProvider)
            {
                case "smtp":
                    services.AddScoped<IEmailService, EmailService>();
                    Console.WriteLine("✅ Configured SMTP Email Service (Gmail/Outlook)");
                    break;

                case "mock":
                    services.AddScoped<IEmailService, MockEmailService>();
                    Console.WriteLine("⚠️ Configured Mock Email Service (for testing only)");
                    break;

                default:
                    // Auto-detect based on environment and available configuration
                    if (environment == "development")
                    {
                        // Check if SMTP is configured
                        if (!string.IsNullOrEmpty(configuration["Email:SmtpServer"]))
                        {
                            services.AddScoped<IEmailService, EmailService>();
                            Console.WriteLine("🔄 Auto-configured SMTP for development");
                        }
                        else
                        {
                            services.AddScoped<IEmailService, MockEmailService>();
                            Console.WriteLine("🔄 Auto-configured Mock Email Service (no email config found)");
                        }
                    }
                    else // Production
                    {
                        // Production prioritizes SMTP
                        if (!string.IsNullOrEmpty(configuration["Email:SmtpServer"]))
                        {
                            services.AddScoped<IEmailService, EmailService>();
                            Console.WriteLine("🚀 Auto-configured SMTP for production");
                        }
                        else
                        {
                            throw new InvalidOperationException(
                                "No email service configured for production. Please configure SMTP settings.");
                        }
                    }
                    break;
            }
        }

        /// <summary>
        /// Validate email configuration based on selected provider
        /// </summary>
        public static bool ValidateEmailConfiguration(IConfiguration configuration, ILogger logger)
        {
            var emailProvider = configuration["Email:Provider"]?.ToLower() ?? "smtp";
            var issues = new System.Collections.Generic.List<string>();

            switch (emailProvider)
            {
                case "smtp":
                    if (string.IsNullOrEmpty(configuration["Email:SmtpServer"]))
                        issues.Add("Email:SmtpServer is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Email:Username"]))
                        issues.Add("Email:Username is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Email:Password"]))
                        issues.Add("Email:Password is missing");
                    else if (configuration["Email:Password"]!.Contains("YOUR_"))
                        issues.Add("Email:Password contains placeholder value");
                    break;
                    
                case "mock":
                    // Mock service doesn't need configuration validation
                    break;
            }

            if (issues.Count > 0)
            {
                logger.LogError("Email configuration validation failed for provider '{Provider}':", emailProvider);
                foreach (var issue in issues)
                {
                    logger.LogError("  - {Issue}", issue);
                }
                return false;
            }

            logger.LogInformation("✅ Email configuration validated successfully for provider: {Provider}", emailProvider);
            return true;
        }
    }
}
