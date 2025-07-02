@echo off
echo Optimizing recommendation system performance...

cd sun-movement-backend

echo Setting up caching for recommendation system...
dotnet add SunMovement.Web package Microsoft.Extensions.Caching.Memory
dotnet add SunMovement.Web package Microsoft.Extensions.Caching.StackExchangeRedis

echo Creating background job for recommendation calculation...
dotnet add SunMovement.Web package Hangfire

echo Updating database schema for optimization...
dotnet ef migrations add OptimizeRecommendationSystem -p SunMovement.Infrastructure -s SunMovement.Web
dotnet ef database update -p SunMovement.Infrastructure -s SunMovement.Web

echo Creating indexes for faster recommendation queries...
dotnet run -p SunMovement.Web/SunMovement.Web.csproj -- --create-indexes

echo Optimization complete! Recommendation system will now perform faster.
pause
