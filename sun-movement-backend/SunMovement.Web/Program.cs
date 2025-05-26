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

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Add Area support
builder.Services.AddMvc()
    .AddRazorPagesOptions(options =>
    {
        options.Conventions.AuthorizeAreaFolder("Admin", "/");
    });

// Configure routing to support Areas
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
    options.AppendTrailingSlash = false;
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
    
    // Get JWT values with fallbacks
    string jwtKey = builder.Configuration["Jwt:Key"] ?? "ThisIsMySecretKeyForSunMovementApp2025";
    string issuer = builder.Configuration["Jwt:Issuer"] ?? "SunMovement.Web";
    string audience = builder.Configuration["Jwt:Audience"] ?? "SunMovement.Client";
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
    
    // Handle JWT validation errors
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context => 
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Append("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
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
    options.LoginPath = "/Identity/Account/Login";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.SlidingExpiration = true;
});

// Register repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IServiceService, ServiceService>();

// Register real services for production use, but conditionally use mocks for development/testing
if (builder.Environment.IsDevelopment())
{
    // Use mock services for development/testing
    builder.Services.AddScoped<IEmailService, SunMovement.Web.Areas.Api.Models.NoOpEmailService>();
    builder.Services.AddTransient<IFileUploadService, SunMovement.Web.Areas.Api.Models.MockFileUploadService>();
}
else
{
    // Use real services for production
    builder.Services.AddScoped<IEmailService, EmailService>();
    builder.Services.AddTransient<IFileUploadService, FileUploadService>();
}

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp",
        corsBuilder => corsBuilder
            .WithOrigins("http://localhost:3000") // Add your frontend URL
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
    // Use our custom error handler
    app.UseExceptionHandler("/Error");
    // Add detailed status code pages for common errors
    app.UseStatusCodePagesWithReExecute("/Error/{0}");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
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

// Create area-specific routes for Admin area
app.MapAreaControllerRoute(
    name: "admin",
    areaName: "Admin",
    pattern: "admin/{controller=AdminDashboard}/{action=Index}/{id?}");

// Create area-specific routes for API area
app.MapAreaControllerRoute(
    name: "api",
    areaName: "Api",
    pattern: "api/{controller=Home}/{action=Index}/{id?}");

// Default route 
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();
