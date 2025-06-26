# SUN MOVEMENT - CONNECTION TROUBLESHOOTING GUIDE
## 🔧 Giải quyết lỗi "fail to fetch" trong test interface

---

## 🎯 VẤN ĐỀ HIỆN TẠI

Bạn đang gặp lỗi "fail to fetch" khi test connection trong HTML test interface, mặc dù backend server đã được khởi chạy.

## 🔍 NGUYÊN NHÂN CÓ THỂ

### 1. **CORS Issues với file:// protocol**
- HTML file được mở trực tiếp (`file://`) có thể bị block bởi CORS policy
- Browser security ngăn cản requests từ file:// tới http://

### 2. **Backend chưa hoàn toàn ready**
- Server có thể đang start nhưng chưa load xong tất cả services
- Database connection issues
- Port conflicts

### 3. **Firewall/Antivirus blocking**
- Windows Defender hoặc antivirus block local connections
- Corporate firewall restrictions

---

## 🚀 GIẢI PHÁP TỪNG BƯỚC

### ✅ **BƯỚC 1: KIỂM TRA BACKEND STATUS**

1. **Chạy diagnostic tool**:
   ```bash
   # Double-click file này:
   d:\DATN\DATN\backend-diagnostic-tool.bat
   ```

2. **Kiểm tra backend console**:
   - Đảm bảo thấy message: "Now listening on: http://localhost:5000"
   - Không có error messages về database, email config, etc.

3. **Test trực tiếp trong browser**:
   - Mở browser và go to: `http://localhost:5000`
   - Nếu thấy trang web hoặc error page = backend running
   - Nếu "This site can't be reached" = backend not running

### ✅ **BƯỚC 2: KHẮC PHỤC CORS ISSUES**

**Option A: Sử dụng HTTP Server (Khuyến nghị)**
```bash
# 1. Start HTTP server cho test files
d:\DATN\DATN\start-test-server.bat

# 2. Mở browser tới:
http://localhost:8080/simple-backend-test.html

# Thay vì file:// protocol
```

**Option B: Update backend CORS (Đã làm)**
- Backend đã được cập nhật để support file:// protocol
- Restart backend để áp dụng thay đổi:
  ```bash
  # Stop backend (Ctrl+C)
  # Start lại: dotnet run
  ```

### ✅ **BƯỚC 3: TEST MANUAL**

Nếu HTML interface vẫn không work, test manual:

1. **Test với Postman hoặc curl**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/check-user-status \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"nguyenmanhquan17072003@gmail.com\"}"
   ```

2. **Test registration trực tiếp**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test@gmail.com\",\"password\":\"Test123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phoneNumber\":\"0123456789\"}"
   ```

### ✅ **BƯỚC 4: TEST QUA FRONTEND**

Nếu API tests work nhưng HTML không work:

1. **Start frontend**:
   ```bash
   cd d:\DATN\DATN\sun-movement-frontend
   npm run dev
   ```

2. **Test registration flow**:
   - Go to: http://localhost:3000
   - Register với email: `nguyenmanhquan17072003@gmail.com`
   - Check email inbox cho verification code

---

## 🛠️ DEBUGGING STEPS

### 1. **Check Browser Console**
- F12 → Console tab
- Look for CORS errors, network errors
- Note exact error messages

### 2. **Check Backend Console**
- Look for incoming requests logs
- Check for email service logs
- Note any error messages

### 3. **Network Tab Analysis**
- F12 → Network tab
- Try connection test
- Check if requests are being sent
- Check response status codes

---

## 🎯 QUICK FIX CHECKLIST

### ✅ **30-Second Quick Check**
```bash
# 1. Check if backend is really running
netstat -an | findstr ":5000"

# 2. Quick HTTP test
curl http://localhost:5000

# 3. Quick API test  
curl -X POST http://localhost:5000/api/auth/check-user-status -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\"}"
```

### ✅ **If Above Works But HTML Doesn't**
- Problem = CORS with file:// protocol
- Solution = Use HTTP server (start-test-server.bat)

### ✅ **If Above Doesn't Work**
- Problem = Backend not fully running
- Solution = Check backend console for errors

---

## 📋 FALLBACK TESTING METHODS

### Method 1: Browser Direct Test
```
1. Open browser
2. Go to: http://localhost:5000/api/auth/check-user-status
3. Should see some response (even if error)
```

### Method 2: PowerShell Test
```powershell
Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing
```

### Method 3: Registration via Frontend
```
1. Start frontend: npm run dev
2. Go to localhost:3000
3. Try to register with your email
4. Check for verification email
```

---

## 🚨 COMMON SOLUTIONS

### Issue: "net::ERR_FAILED"
**Solution**: Backend not running or wrong port
```bash
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
dotnet run
```

### Issue: "CORS policy error"
**Solution**: Use HTTP server instead of file://
```bash
d:\DATN\DATN\start-test-server.bat
```

### Issue: "Connection refused"
**Solution**: Check port conflicts
```bash
netstat -an | findstr ":5000"
# If port in use by other app, kill it or use different port
```

---

## 🎉 SUCCESS INDICATORS

### ✅ **Connection Working**:
- HTML test shows ✅ status codes
- API endpoints return responses (even errors are OK)
- Browser can reach http://localhost:5000

### ✅ **Email System Working**:
- Registration sends verification email
- Forgot password sends reset email
- Emails arrive in Gmail inbox

### ✅ **Ready for Production**:
- All tests pass
- No console errors
- Email delivery confirmed

---

## 📞 NEXT STEPS

1. **Run diagnostic tool**: `backend-diagnostic-tool.bat`
2. **If backend OK**: Use HTTP server (`start-test-server.bat`)
3. **If still issues**: Test directly via registration on frontend
4. **Success**: Verify email delivery to your Gmail

**The goal is email system working, not necessarily the HTML test interface! 🎯**
