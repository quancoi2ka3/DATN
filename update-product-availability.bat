@echo off
cd sun-movement-backend
echo Updating product availability status...

rem Execute SQL to update IsAvailable based on existing product status
dotnet ef database update -p SunMovement.Infrastructure -s SunMovement.Web -- --sql "UPDATE Products SET IsAvailable = CASE WHEN IsActive = 1 AND Status != 3 THEN 1 ELSE 0 END WHERE IsAvailable IS NULL"

echo Product availability updated successfully!
pause
