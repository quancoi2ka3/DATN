# 🔧 API URL FIX - COMPLETE SOLUTION

## 🎯 PROBLEM IDENTIFIED
**Frontend was calling wrong API endpoints:**
- ❌ `http://localhost:3000/api/auth/login` (Next.js server - doesn't exist)
- ✅ `https://localhost:5001/api/auth/login` (Backend server - correct)

## 🔧 FIXES APPLIED

### 1. Environment Variable Configuration
**File:** `d:\DATN\DATN\sun-movement-frontend\.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### 2. Updated Frontend API Calls

#### ✅ Auth Context (`src/lib/auth-context.tsx`)
```typescript
// OLD: fetch("/api/auth/login", ...)
// NEW: 
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/auth/login`, ...)
```

#### ✅ Customer Login (`src/components/auth/CustomerLogin.tsx`)
```typescript
// OLD: fetch("/api/auth/check-user-status", ...)
// NEW:
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/auth/check-user-status`, ...)
```

#### ✅ Customer Register (`src/components/auth/CustomerRegister.tsx`)
```typescript
// OLD: "/api/auth/register"
// NEW: 
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const endpoint = `${apiUrl}/api/auth/register`;
```

#### ✅ Email Verification Modal (`src/components/auth/EmailVerificationModal.tsx`)
```typescript
// OLD: "/api/auth/verify-email" and "/api/auth/resend-verification"
// NEW:
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const apiUrl = `${apiBaseUrl}/api/auth/verify-email`;
```

#### ✅ Login Error Helper (`src/components/auth/LoginErrorHelper.tsx`)
```typescript
// OLD: fetch("/api/auth/resend-verification", ...)
// NEW:
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/auth/resend-verification`, ...)
```

#### ✅ Debug Page (`src/app/debug/login/page.tsx`)
```typescript
// OLD: fetch("/api/auth/login", ...) and fetch("/api/auth/check-user-status", ...)
// NEW: 
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
// All endpoints updated
```

#### ✅ Cart Service (`src/lib/cart-service.ts`)
```typescript
// OLD: fetch("/api/cart/merge-guest-cart", ...)
// NEW:
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/cart/merge-guest-cart`, ...)
```

## 🧪 VERIFICATION TESTS

### ✅ Backend API Working
```bash
# Login test - SUCCESS ✅
curl -k -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenmanhan17072003@gmail.com","password":"ManhQuan2003@"}'

# Result: Status 200, Login successful!
# User: Quan Nguyen Manh
# Token: eyJhbGciOiJIUzI1NiIs...
```

### ✅ Test Files Created
1. **`test-login-credentials.js`** - Node.js API test (SUCCESS)
2. **`test-frontend-api-fix.bat`** - Frontend restart script
3. **`src/app/test-env/page.tsx`** - Environment variable test page

## 🎯 TESTING INSTRUCTIONS

### 1. Restart Frontend
```bash
cd d:\DATN\DATN
test-frontend-api-fix.bat
```

### 2. Test Environment Variables
- Open: `http://localhost:3000/test-env`
- Verify: `NEXT_PUBLIC_API_BASE_URL = https://localhost:5001`
- Click: "Test API Call" button
- Check: Browser console for results

### 3. Test Login
- Open: `http://localhost:3000`
- Email: `nguyenmanhan17072003@gmail.com`
- Password: `ManhQuan2003@`
- Should work without 500 errors

## 🔍 TROUBLESHOOTING

### If Still Getting 500 Errors:

1. **Check Browser Network Tab:**
   - Requests should go to `https://localhost:5001`
   - Not to `http://localhost:3000/api/`

2. **SSL Certificate Issues:**
   - Browser might block HTTPS requests to localhost
   - Check browser console for SSL errors
   - Try: Advanced → "Proceed to localhost (unsafe)"

3. **Environment Variables Not Loading:**
   - Restart frontend server completely
   - Clear browser cache
   - Check `.env.local` file exists

4. **CORS Issues:**
   - Backend should allow `localhost:3000` origin
   - Check backend CORS configuration

## 📋 SUMMARY

| Component | Status | Endpoint |
|-----------|--------|----------|
| Backend API | ✅ Working | `https://localhost:5001/api/auth/login` |
| Frontend Auth Context | ✅ Fixed | Uses `NEXT_PUBLIC_API_BASE_URL` |
| Customer Login | ✅ Fixed | Uses correct backend URL |
| Customer Register | ✅ Fixed | Uses correct backend URL |
| Email Verification | ✅ Fixed | Uses correct backend URL |
| Cart Service | ✅ Fixed | Uses correct backend URL |
| Environment Config | ✅ Set | `.env.local` configured |

## 🎉 EXPECTED RESULT

After frontend restart, login should work with:
- ✅ No more 500 Internal Server Error
- ✅ Successful authentication
- ✅ Proper redirect after login
- ✅ Cart preservation
- ✅ User session management

**The authentication system is now properly connected to the backend API!** 🚀
