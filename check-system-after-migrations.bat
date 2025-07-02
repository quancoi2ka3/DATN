@echo off
echo Checking system status after migrations...

cd sun-movement-backend

echo Testing database connections...
dotnet run -p SunMovement.Web/SunMovement.Web.csproj -- --test-db

echo Testing recommendation service...
dotnet run -p SunMovement.Web/SunMovement.Web.csproj -- --test-recommendations

echo Testing Mixpanel integration...
dotnet run -p SunMovement.Web/SunMovement.Web.csproj -- --test-mixpanel

echo System check completed! Please review any warnings or errors above.
pause
