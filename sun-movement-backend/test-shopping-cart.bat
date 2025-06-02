@echo off
echo Testing Shopping Cart Functionality...
echo.

cd /d "d:\SunMoveMent\DATN\sun-movement-backend"

echo Running unit tests for shopping cart...
dotnet test SunMovement.Tests/SunMovement.Tests.csproj --filter "FullyQualifiedName~ShoppingCart" --verbosity normal

echo.
echo Done testing shopping cart functionality!
pause
