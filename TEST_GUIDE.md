# 🧪 Hướng dẫn Test các sửa đổi

## 🚀 Khởi động hệ thống

### 1. Backend
```bash
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
dotnet run
```
Backend sẽ chạy trên: `https://localhost:5001` và `http://localhost:5000`

### 2. Frontend  
```bash
cd d:\DATN\DATN\sun-movement-frontend
npm run dev
```
Frontend sẽ chạy trên: `http://localhost:3000`

## 🔍 Test Case 1: Auto-login sau đăng ký

### Bước test:
1. **Mở trình duyệt mới** (incognito mode để đảm bảo session sạch)
2. **Truy cập** `http://localhost:3000`
3. **Click vào nút "Đăng ký"** ở header
4. **Điền đầy đủ thông tin đăng ký:**
   - Tên, Họ
   - Email (sử dụng email thật để nhận mã)
   - Mật khẩu (phải đủ 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt)
   - Số điện thoại, địa chỉ (tùy chọn)
5. **Submit form đăng ký**
6. **Kiểm tra email** để lấy mã xác thực (hoặc xem console backend)
7. **Nhập mã xác thực** trong modal popup
8. **Click "Xác thực"**

### ✅ Kết quả mong đợi:
- Modal đóng lại
- Header hiển thị thông tin người dùng (tên, avatar dropdown)
- Không cần đăng nhập lại
- Console hiển thị: `[AUTH] Auto-login successful for user: email@example.com`

## 🔍 Test Case 2: Giỏ hàng trống cho người dùng mới

### Bước test:
1. **Mở trình duyệt mới** (incognito mode)
2. **Truy cập** `http://localhost:3000`
3. **Kiểm tra giỏ hàng** (icon giỏ hàng ở header) - phải hiển thị (0)
4. **Đăng ký tài khoản mới** theo Test Case 1
5. **Sau khi đăng ký xong, kiểm tra lại giỏ hàng** - vẫn phải (0)
6. **Thêm 1 sản phẩm vào giỏ hàng**
7. **Kiểm tra giỏ hàng** - phải hiển thị (1)

### ✅ Kết quả mong đợi:
- Giỏ hàng ban đầu: (0)
- Sau đăng ký: (0) 
- Sau thêm sản phẩm: (1)
- KHÔNG có 3 sản phẩm bí ẩn nào

## 🔍 Test Case 3: Giỏ hàng độc lập giữa sessions

### Bước test:
1. **Mở 2 tab incognito** khác nhau
2. **Tab 1:**
   - Truy cập trang chủ
   - Thêm 2 sản phẩm vào giỏ hàng
   - Kiểm tra giỏ hàng: (2)
3. **Tab 2:**
   - Truy cập trang chủ
   - Kiểm tra giỏ hàng: phải là (0)
   - Thêm 1 sản phẩm vào giỏ hàng
   - Kiểm tra giỏ hàng: (1)
4. **Quay lại Tab 1:**
   - Kiểm tra giỏ hàng: vẫn phải là (2)

### ✅ Kết quả mong đợi:
- Tab 1: (2) sản phẩm
- Tab 2: (1) sản phẩm  
- Hai giỏ hàng hoàn toàn độc lập

## 🔍 Test Case 4: Giỏ hàng được bảo toàn sau đăng nhập

### Bước test:
1. **Mở trình duyệt mới** (incognito mode)
2. **Thêm 2 sản phẩm vào giỏ hàng** (chưa đăng nhập)
3. **Đăng nhập** bằng tài khoản có sẵn
4. **Kiểm tra giỏ hàng** sau đăng nhập

### ✅ Kết quả mong đợi:
- Giỏ hàng vẫn có 2 sản phẩm đã thêm trước khi đăng nhập
- Hoặc được merge với giỏ hàng của user (tùy logic business)

## 🐛 Debugging

### Kiểm tra Console:
- **Frontend Console:** Mở DevTools (F12) → Console
- **Backend Console:** Xem terminal chạy `dotnet run`

### Logs quan trọng:
```javascript
// Frontend - Auto-login thành công
[AUTH] Auto-login successful for user: email@example.com

// Frontend - Cart operations
[CART DEBUG] Getting cart through proxy API...
[CART DEBUG] Add to cart response status: 200

// Backend - Session management
[ADD TO CART] UserId: anonymous-12345-6789-abcd
[GET CART] UserId: user-id-after-login
```

### Kiểm tra Network Tab:
1. Mở DevTools → Network
2. Thực hiện actions
3. Kiểm tra requests:
   - `/api/auth/register` → 200 OK
   - `/api/auth/verify-email` → 200 OK với `autoLogin: true`
   - `/api/cart` → 200 OK với đúng userId

## 📋 Checklist hoàn thành:

- [ ] Backend build và chạy không lỗi
- [ ] Frontend build và chạy không lỗi  
- [ ] Auto-login sau đăng ký hoạt động
- [ ] Giỏ hàng trống cho user mới
- [ ] Giỏ hàng độc lập giữa sessions
- [ ] Không còn 3 sản phẩm bí ẩn
- [ ] Console không có error nghiêm trọng

## 🎯 Kết luận

Nếu tất cả test cases đều PASS, thì các vấn đề đã được khắc phục thành công:

1. ✅ **Auto-login sau đăng ký:** Người dùng không cần đăng nhập lại
2. ✅ **Giỏ hàng sạch:** Không còn 3 sản phẩm bí ẩn
3. ✅ **Session độc lập:** Mỗi người dùng có giỏ hàng riêng biệt
