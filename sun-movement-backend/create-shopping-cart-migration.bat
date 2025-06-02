@echo off
echo Creating migration for Shopping Cart functionality...
echo.

cd /d "d:\SunMoveMent\DATN\sun-movement-backend"

dotnet ef migrations add AddShoppingCartEntities --project SunMovement.Infrastructure --startup-project SunMovement.Web --context ApplicationDbContext

echo.
echo Migration created! Now applying the migration...
echo.

dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web --context ApplicationDbContext

echo.
echo Migration applied successfully!
pause
