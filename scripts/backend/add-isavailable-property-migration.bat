@echo off
cd sun-movement-backend
echo Creating migration to add IsAvailable property to Products...
dotnet ef migrations add AddIsAvailableToProducts -p SunMovement.Infrastructure -s SunMovement.Web
echo Running database update...
dotnet ef database update -p SunMovement.Infrastructure -s SunMovement.Web
echo Migration completed successfully!
pause
