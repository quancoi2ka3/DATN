#!/bin/bash
# Mixpanel Setup Verification Script

echo "🔍 VERIFYING MIXPANEL SETUP..."
echo "================================"

# Check Backend Config
echo "📁 Checking Backend Configuration..."
BACKEND_CONFIG="d:/DATN/DATN/sun-movement-backend/SunMovement.Web/appsettings.json"

if grep -q "PASTE_YOUR_PROJECT_TOKEN_HERE" "$BACKEND_CONFIG" 2>/dev/null; then
    echo "❌ Backend: Project Token not updated"
else
    echo "✅ Backend: Project Token updated"
fi

if grep -q "PASTE_YOUR_API_SECRET_HERE" "$BACKEND_CONFIG" 2>/dev/null; then
    echo "❌ Backend: API Secret not updated"
else
    echo "✅ Backend: API Secret updated"
fi

# Check Frontend Config
echo ""
echo "📁 Checking Frontend Configuration..."
FRONTEND_CONFIG="d:/DATN/DATN/sun-movement-frontend/.env.local"

if grep -q "PASTE_YOUR_PROJECT_TOKEN_HERE" "$FRONTEND_CONFIG" 2>/dev/null; then
    echo "❌ Frontend: Project Token not updated"
else
    echo "✅ Frontend: Project Token updated"
fi

# Check Admin Layout
echo ""
echo "📁 Checking Admin Layout..."
ADMIN_LAYOUT="d:/DATN/DATN/sun-movement-backend/SunMovement.Web/Views/Shared/_AdminLayout.cshtml"

if grep -q "PASTE_YOUR_PROJECT_TOKEN_HERE" "$ADMIN_LAYOUT" 2>/dev/null; then
    echo "❌ Admin Layout: Project Token not updated"
else
    echo "✅ Admin Layout: Project Token updated"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Start backend: cd sun-movement-backend/SunMovement.Web && dotnet run"
echo "2. Start frontend: cd sun-movement-frontend && npm run dev"
echo "3. Browse website to generate events"
echo "4. Check Mixpanel Dashboard Live View"
echo ""
echo "🔗 Quick Links:"
echo "- Frontend: http://localhost:3000"
echo "- Admin: http://localhost:5000/admin"
echo "- Mixpanel: https://mixpanel.com"
