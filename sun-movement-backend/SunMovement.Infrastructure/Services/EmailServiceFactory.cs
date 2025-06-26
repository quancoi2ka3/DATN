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
    /// - Production: SendGridEmailService, MailgunEmailService, hoặc ZohoEmailService
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
                case "sendgrid":
                    services.AddSingleton<HttpClient>();
                    services.AddScoped<IEmailService, SendGridEmailService>();
                    Console.WriteLine("✅ Configured SendGrid Email Service for production");
                    break;

                case "mailgun":
                    services.AddSingleton<HttpClient>();
                    services.AddScoped<IEmailService, MailgunEmailService>();
                    Console.WriteLine("✅ Configured Mailgun Email Service for production");
                    break;

                case "zoho":
                    services.AddSingleton<HttpClient>();
                    services.AddScoped<IEmailService, ZohoEmailService>();
                    Console.WriteLine("✅ Configured Zoho Mail API Service for business");
                    break;

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
                        // Check if SendGrid is configured
                        if (!string.IsNullOrEmpty(configuration["SendGrid:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, SendGridEmailService>();
                            Console.WriteLine("🔄 Auto-configured SendGrid for development");
                        }
                        // Check if Mailgun is configured
                        else if (!string.IsNullOrEmpty(configuration["Mailgun:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, MailgunEmailService>();
                            Console.WriteLine("🔄 Auto-configured Mailgun for development");
                        }
                        // Check if Zoho is configured
                        else if (!string.IsNullOrEmpty(configuration["Zoho:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, ZohoEmailService>();
                            Console.WriteLine("🔄 Auto-configured Zoho Mail for development");
                        }
                        // Check if SMTP is configured
                        else if (!string.IsNullOrEmpty(configuration["Email:SmtpServer"]))
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
                        // Production prioritizes professional email services
                        if (!string.IsNullOrEmpty(configuration["SendGrid:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, SendGridEmailService>();
                            Console.WriteLine("🚀 Auto-configured SendGrid for production");
                        }
                        else if (!string.IsNullOrEmpty(configuration["Mailgun:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, MailgunEmailService>();
                            Console.WriteLine("🚀 Auto-configured Mailgun for production");
                        }
                        else if (!string.IsNullOrEmpty(configuration["Zoho:ApiKey"]))
                        {
                            services.AddSingleton<HttpClient>();
                            services.AddScoped<IEmailService, ZohoEmailService>();
                            Console.WriteLine("🚀 Auto-configured Zoho Mail for production");
                        }
                        else if (!string.IsNullOrEmpty(configuration["Email:SmtpServer"]))
                        {
                            services.AddScoped<IEmailService, EmailService>();
                            Console.WriteLine("⚠️ Using SMTP in production (consider SendGrid/Mailgun/Zoho for better deliverability)");
                        }
                        else
                        {
                            throw new InvalidOperationException(
                                "No email service configured for production. Please configure SendGrid, Mailgun, Zoho, or SMTP settings.");
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
                case "sendgrid":
                    if (string.IsNullOrEmpty(configuration["SendGrid:ApiKey"]))
                        issues.Add("SendGrid:ApiKey is missing");
                    else if (!configuration["SendGrid:ApiKey"]!.StartsWith("SG."))
                        issues.Add("SendGrid:ApiKey format is invalid (should start with 'SG.')");
                    
                    if (string.IsNullOrEmpty(configuration["SendGrid:FromEmail"]))
                        issues.Add("SendGrid:FromEmail is missing");
                    break;

                case "mailgun":
                    if (string.IsNullOrEmpty(configuration["Mailgun:ApiKey"]))
                        issues.Add("Mailgun:ApiKey is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Mailgun:Domain"]))
                        issues.Add("Mailgun:Domain is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Mailgun:FromEmail"]))
                        issues.Add("Mailgun:FromEmail is missing");
                    break;                case "zoho":
                    if (string.IsNullOrEmpty(configuration["Zoho:ApiKey"]))
                        issues.Add("Zoho:ApiKey is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Zoho:FromEmail"]))
                        issues.Add("Zoho:FromEmail is missing");
                    
                    if (string.IsNullOrEmpty(configuration["Zoho:AccountId"]))
                        issues.Add("Zoho:AccountId is missing");
                    
                    // Optional: Validate OAuth token format
                    var zohoToken = configuration["Zoho:ApiKey"];
                    if (!string.IsNullOrEmpty(zohoToken) && zohoToken.Length < 50)
                        issues.Add("Zoho:ApiKey appears to be too short (should be OAuth token)");
                    break;

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
