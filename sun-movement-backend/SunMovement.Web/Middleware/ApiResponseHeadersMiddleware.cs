using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SunMovement.Web.Middleware
{
    public class ApiResponseHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public ApiResponseHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // If this is an API request, add the appropriate headers
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                // Add headers to prevent caching for API responses
                context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
                context.Response.Headers.Append("Pragma", "no-cache");
                context.Response.Headers.Append("Expires", "0");
            }

            await _next(context);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline
    public static class ApiResponseHeadersMiddlewareExtensions
    {
        public static IApplicationBuilder UseApiResponseHeaders(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ApiResponseHeadersMiddleware>();
        }
    }
}
