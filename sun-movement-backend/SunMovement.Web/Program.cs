using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using SunMovement.Core.Mappings;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;
using SunMovement.Infrastructure.Services;
using Microsoft.Extensions.Caching.Memory;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using Microsoft.AspNetCore.StaticFiles;
using SunMovement.Web.Middleware;
using System.Globalization;

// Cấu hình timezone GMT+7 cho toàn bộ ứng dụng
AppContext.SetSwitch("System.Globalization.InvariantGlobalization", false);
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("vi-VN");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("vi-VN");

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel with explicit HTTPS port as primary
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    try {
        // Set up HTTPS endpoint as primary (port 5001)
        serverOptions.ListenAnyIP(5001, listenOptions =>
        {
            listenOptions.UseHttps();
        });
        Console.WriteLine("✅ HTTPS configured successfully on port 5001");
    }
    catch (Exception ex)
    {
        // Log the exception and fallback to HTTP
        Console.WriteLine($"⚠️ Failed to configure HTTPS: {ex.Message}");
        Console.WriteLine("🔄 Attempting to set up HTTP on port 5001...");
        serverOptions.ListenAnyIP(5001);
    }
    
    // Also set up HTTP endpoint on port 5000 as backup
    serverOptions.ListenAnyIP(5000);
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
    // Set default authentication scheme to MultiScheme
    options.DefaultScheme = "MultiScheme";
    options.DefaultChallengeScheme = "MultiScheme";
    options.DefaultAuthenticateScheme = "MultiScheme";
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
        var path = context.Request.Path.Value?.ToLower() ?? "";
        // Ưu tiên cookie cho admin/backend
        if (path.StartsWith("/admin") || path.StartsWith("/account"))
        {
            return IdentityConstants.ApplicationScheme;
        }
        // Ưu tiên JWT cho API và frontend
        if (context.Request.Headers.ContainsKey("Authorization") && 
            context.Request.Headers["Authorization"].ToString().StartsWith("Bearer "))
        {
            return JwtBearerDefaults.AuthenticationScheme;
        }
        // Nếu không có JWT thì fallback về cookie
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

// Add memory cache
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ICacheService, CacheService>();

// Add session support for anonymous user carts
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IShoppingCartService, ShoppingCartService>();
builder.Services.AddScoped<IVNPayService, VNPayService>();

// Register new inventory, coupon, and integration services
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IProductInventoryService, ProductInventoryService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Configure Email Service based on provider and environment
EmailServiceFactory.ConfigureEmailService(builder.Services, builder.Configuration);

builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
builder.Services.AddScoped<IFileUploadService, FileUploadService>();

// Register recommendation and user interaction services
builder.Services.AddScoped<IUserInteractionService, UserInteractionService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<MixpanelService>();

// Register AutoMapper profiles
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly, typeof(SunMovement.Web.Mappings.WebMappingProfile).Assembly);

// Add CORS with proper configuration for frontend with credentials
builder.Services.AddCors(options =>
{    options.AddPolicy("AllowFrontend",
        corsBuilder => corsBuilder
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:5000", 
                "http://localhost:5500",  // Add Live Server default port
                "http://localhost:8080",  // Add HTTP server port
                "https://localhost:3000",
                "https://localhost:5001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5000",
                "http://127.0.0.1:5500",   // Add 127.0.0.1 with port 5500
                "http://127.0.0.1:8080",   // Add 127.0.0.1 with port 8080
                "https://127.0.0.1:3000",
                "https://127.0.0.1:5001",
                "file://") // Add file:// protocol for local HTML files
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Allow credentials for session management
    
    // Add a permissive policy for development/testing
    // options.AddPolicy("AllowAll",
    //     corsBuilder => corsBuilder
    //         .AllowAnyOrigin()
    //         .AllowAnyMethod()
    //         .AllowAnyHeader());
    
    // // Also add a more specific policy for frontend if needed
    // options.AddPolicy("AllowSpecificOrigins",
    //     corsBuilder => corsBuilder
    //         .WithOrigins(
    //             "http://localhost:3000",
    //             "http://localhost:5000",
    //             "https://localhost:5001",
    //             "http://127.0.0.1:3000",
    //             "https://127.0.0.1:3000",
    //             "file://") // Allow file:// protocol for local HTML files
    //         .AllowAnyMethod()
    //         .AllowAnyHeader()
    //         .AllowCredentials());
});

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add localization support and set default culture to Vietnamese
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "vi-VN" };
    options.SetDefaultCulture(supportedCultures[0])
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures);
});

// Add support for WebP MIME type
builder.Services.Configure<StaticFileOptions>(options =>
{
    var provider = new FileExtensionContentTypeProvider();
    provider.Mappings[".webp"] = "image/webp";
    options.ContentTypeProvider = provider;
});

var app = builder.Build();

// Migrate and seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Apply any pending migrations
        Console.WriteLine("Applying pending database migrations...");
        try
        {
            context.Database.Migrate();
            Console.WriteLine("Database migration completed successfully.");
        }
        catch (Exception migrationEx) when (migrationEx.Message.Contains("already an object named"))
        {
            Console.WriteLine("⚠️ Migration conflict detected - some tables already exist. This is normal during development.");
            Console.WriteLine("🔄 Attempting to continue with existing database structure...");
            
            // Try to ensure the database exists without forcing migrations
            context.Database.EnsureCreated();
            Console.WriteLine("✅ Database structure verified.");
        }
        
        // Seed initial data
        Console.WriteLine("Initializing database with seed data...");
        DbInitializer.Initialize(services).Wait();
        Console.WriteLine("Database seeding completed successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
        Console.WriteLine($"ERROR: Database setup failed: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Add API-specific exception handling for development
    app.Use(async (context, next) =>
    {
        try
        {
            await next.Invoke();
        }
        catch (Exception ex)
        {
            // For API requests, return JSON error
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync($"{{\"success\": false, \"error\": \"Internal server error\", \"details\": \"{ex.Message}\"}}");
                return;
            }
            throw; // Re-throw for non-API requests
        }
    });
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            // Nếu là API request thì trả về JSON, ngược lại redirect về trang lỗi
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.ContentType = "application/json";
                var errorFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
                var errorMessage = errorFeature?.Error?.Message ?? "Internal server error";
                // Có thể trả thêm stacktrace nếu muốn debug
                await context.Response.WriteAsync($"{{\"success\": false, \"error\": \"{errorMessage}\"}}");
            }
            else
            {
                context.Response.Redirect("/Home/Error");
            }
        });
    });
    app.UseHsts();
}

// Skip HTTPS redirection in development to avoid CORS preflight issues
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
// In development, allow HTTP requests without redirection
app.UseStaticFiles();

app.UseRouting();

// Add session middleware
app.UseSession();
app.Use(async (context, next) =>
{
    await next();

    if (
        context.Request.Path.StartsWithSegments("/api") &&
        context.Response.StatusCode >= 400 &&
        !context.Response.HasStarted &&
        (context.Response.ContentType == null || !context.Response.ContentType.Contains("application/json"))
    )
    {
        context.Response.ContentType = "application/json";
        var message = context.Response.StatusCode switch
        {
            404 => "Not found",
            401 => "Unauthorized",
            403 => "Forbidden",
            400 => "Bad request",
            405 => "Method not allowed",
            _ => "Internal server error"
        };
        await context.Response.WriteAsync($"{{\"success\": false, \"error\": \"{message}\", \"status\": {context.Response.StatusCode}}}");
    }
});
// Use more permissive CORS in development for testing
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowFrontend");
}
else
{
    app.UseCors("AllowFrontend");
}

app.UseApiResponseHeaders();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
// Add localization middleware right after app.UseRouting()
app.UseRequestLocalization();

// Define route for account
app.MapControllerRoute(
    name: "account",
    pattern: "account/{action=Index}/{id?}",
    defaults: new { controller = "Account", area = "" });

// Define route for admin dashboard shortcut
app.MapControllerRoute(
    name: "trang-quan-tri",
    pattern: "admin",
    defaults: new { controller = "AdminDashboard", action = "Index", area = "Admin" });

// API area route - IMPORTANT: This must come first to match API requests
app.MapAreaControllerRoute(
    name: "api",
    areaName: "Api",
    pattern: "api/{controller}/{action=Index}/{id?}");

// Admin area route (only one definition for admin routes)
app.MapAreaControllerRoute(
    name: "quan-tri",
    areaName: "Admin",
    pattern: "admin/{controller=AdminDashboard}/{action=Index}/{id?}");

// Default route 
app.MapControllerRoute(
    name: "mac-dinh",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Add SPA routing support - redirect API requests to API controllers,
// but forward unmatched requests to the frontend


app.Run();
