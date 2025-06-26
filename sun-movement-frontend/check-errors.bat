@echo off
echo Checking for TypeScript compilation errors...
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Running TypeScript check...
npx tsc --noEmit --project tsconfig.json
echo.

echo Running ESLint...
npx eslint src --ext .ts,.tsx --quiet
echo.

echo Done checking errors.
pause
