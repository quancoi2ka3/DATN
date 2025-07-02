@echo off
cd sun-movement-backend
echo Running migrations for UserInteractions and ProductRecommendations...
dotnet ef migrations add AddRecommendationSystem -p SunMovement.Infrastructure -s SunMovement.Web
echo Running database update...
dotnet ef database update -p SunMovement.Infrastructure -s SunMovement.Web
echo Migration completed successfully!
pause
