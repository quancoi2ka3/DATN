using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel with explicit HTTPS port
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Set up HTTP endpoint
    serverOptions.ListenAnyIP(5000);
    
    try {
        // Set up HTTPS endpoint
        serverOptions.ListenAnyIP(5001, listenOptions =>
        {
            listenOptions.UseHttps();
        });
    }
    catch (Exception ex)
    {
        // Log the exception but continue with HTTP
        Console.WriteLine($"Failed to configure HTTPS: {ex.Message}");
        Console.WriteLine("Continuing with HTTP only. To use HTTPS, run 'dotnet dev-certs https --trust' to install the development certificate.");
    }
});

// This helps ensure the development certificate is created
if (builder.Environment.IsDevelopment())
{
    // Try to create development certificate if it doesn't exist
    try
    {
        var process = new System.Diagnostics.Process
        {
            StartInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = "dev-certs https --check",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();
        var output = process.StandardOutput.ReadToEnd();
        process.WaitForExit();

        if (!output.Contains("valid"))
        {
            Console.WriteLine("Creating development certificate...");
            System.Diagnostics.Process.Start("dotnet", "dev-certs https --trust");
        }
    }
    catch
    {
        Console.WriteLine("Warning: Could not check or create the development certificate.");
        Console.WriteLine("To use HTTPS, run 'dotnet dev-certs https --trust' to install the development certificate.");
    }
}

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Add Area support
builder.Services.AddMvc()
    .AddRazorPagesOptions(options =>
    {
        options.Conventions.AuthorizeAreaFolder("Admin", "/");
    });

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false; // Changed to false to allow login without email confirmation
    options.SignIn.RequireConfirmedEmail = false;   // Also disable email confirmation requirement
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    // Set default authentication scheme to Cookies
    options.DefaultAuthenticateScheme = "MultiScheme";
    options.DefaultChallengeScheme = "MultiScheme";
    options.DefaultScheme = "MultiScheme";
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "ThisIsMySecretKeyForSunMovementApp2025")),
        ClockSkew = TimeSpan.Zero
    };
})
// Add support for authentication scheme that can handle both cookies and JWT
.AddPolicyScheme("MultiScheme", "Cookie or JWT", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        // Check for JWT Bearer token
        if (context.Request.Headers.ContainsKey("Authorization") && 
            context.Request.Headers["Authorization"].ToString().StartsWith("Bearer "))
        {
            return JwtBearerDefaults.AuthenticationScheme;
        }
        
        // Otherwise use cookies
        return IdentityConstants.ApplicationScheme;
    };
});

// Configure application cookie
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
});

// Register repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFileUploadService, FileUploadService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp",
        corsBuilder => corsBuilder
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:5000",
                "https://localhost:5001") // Add all possible frontend URLs
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        DbInitializer.Initialize(services).Wait();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Safe HTTPS redirection that first checks if development environment 
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
else
{
    // In development, handle HTTPS redirection manually
    // to prevent errors if developer certificate isn't set up
    app.Use(async (context, next) =>
    {
        if (context.Request.IsHttps || context.Request.Headers["X-Forwarded-Proto"] == "https")
        {
            // Already HTTPS
            await next();
            return;
        }

        // Try HTTPS redirect, but gracefully handle if not available
        try
        {
            var httpsPort = 5001;
            var httpsUrl = $"https://{context.Request.Host.Host}:{httpsPort}{context.Request.Path}{context.Request.QueryString}";
            context.Response.Redirect(httpsUrl);
        }
        catch
        {
            // If redirection fails, continue with HTTP
            await next();
        }
    });
}
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowNextJsApp");

app.UseAuthentication();
app.UseAuthorization();

// Define route for admin area and controllers
app.MapControllerRoute(
    name: "account",
    pattern: "account/{action=Index}/{id?}",
    defaults: new { controller = "Account", area = "" });

app.MapControllerRoute(
    name: "admin-area",
    pattern: "admin/{controller=AdminDashboard}/{action=Index}/{id?}",
    defaults: new { area = "Admin" });

// Define route for admin dashboard
app.MapControllerRoute(
    name: "admin-dashboard",
    pattern: "admin",
    defaults: new { controller = "AdminDashboard", action = "Index", area = "Admin" });

app.MapControllerRoute(
    name: "admin-manage",
    pattern: "admin/manage/{action=Index}/{id?}",
    defaults: new { controller = "Admin" });

// Create area-specific routes
app.MapAreaControllerRoute(
    name: "admin",
    areaName: "Admin",
    pattern: "admin/{controller=AdminDashboard}/{action=Index}/{id?}");

// Default route 
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();
