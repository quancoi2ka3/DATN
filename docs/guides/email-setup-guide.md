# Hướng dẫn cấu hình Email cho Sun Movement

## 🎯 Mục tiêu
Đảm bảo OTP xác thực đăng ký được gửi đến email thật (Gmail/Outlook) thay vì mock service.

## ⚙️ Cấu hình Gmail App Password

### Bước 1: Bật 2-Factor Authentication cho Gmail
1. Truy cập [Google Account Settings](https://myaccount.google.com/security)
2. Chọn "2-Step Verification" và làm theo hướng dẫn để bật
3. Xác nhận 2FA đã được bật thành công

### Bước 2: Tạo App Password cho Sun Movement
1. Vào [App Passwords](https://myaccount.google.com/apppasswords)
2. Chọn "Mail" và "Windows Computer" (hoặc "Other" và nhập "Sun Movement")
3. Google sẽ tạo App Password 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)
4. **Lưu lại password này**, sẽ không thể xem lại

### Bước 3: Cập nhật appsettings.Development.json
```json
{
  "Email": {
    "Sender": "your-gmail@gmail.com",
    "SenderName": "Sun Movement Fitness Center",
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-gmail@gmail.com",
    "Password": "abcd efgh ijkl mnop",
    "ContactNotifications": "your-gmail@gmail.com"
  }
}
```

## 🔧 Cấu hình Outlook (nếu dùng)
```json
{
  "Email": {
    "Sender": "your-email@outlook.com",
    "SenderName": "Sun Movement Fitness Center", 
    "SmtpServer": "smtp-mail.outlook.com",
    "SmtpPort": 587,
    "Username": "your-email@outlook.com",
    "Password": "your-outlook-password",
    "ContactNotifications": "your-email@outlook.com"
  }
}
```

## 🧪 Test Email Configuration

### Test 1: Backend SMTP Test
```bash
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
dotnet run --environment Development
```

### Test 2: API Registration với Email thật
1. Chạy backend trên port 5000
2. Mở `email-otp-test.html` trong browser
3. Nhập email Gmail thật của bạn
4. Kiểm tra inbox Gmail xem có nhận OTP không

## 🚨 Xử lý lỗi thường gặp

### Lỗi: "Username and Password not accepted"
- **Nguyên nhân**: Chưa bật 2FA hoặc App Password sai
- **Giải pháp**: Tạo lại App Password từ Google Account

### Lỗi: "SMTP server requires a secure connection"
- **Nguyên nhân**: Cấu hình SSL/TLS sai
- **Giải pháp**: Đảm bảo `EnableSsl = true` và port 587

### Lỗi: "Mailbox unavailable"
- **Nguyên nhân**: Email không tồn tại hoặc chặn email spam
- **Giải pháp**: Kiểm tra folder Spam/Junk

## ✅ Checklist đồng bộ Frontend-Backend

### Backend Ready ✅
- [x] EmailService thật đã được inject thay vì MockEmailService
- [x] SMTP configuration đã setup trong appsettings.Development.json
- [x] SendVerificationCodeAsync method đã implement đầy đủ
- [x] Error logging chi tiết cho debug

### Frontend Ready ✅  
- [x] CustomerRegister.tsx gọi đúng API `/api/auth/register`
- [x] Modal xác thực OTP đã được implement
- [x] Error handling cho các trường hợp lỗi
- [x] AuthContext đồng bộ với backend JWT

### Test Cases 🧪
- [ ] Đăng ký với email Gmail thật → Nhận OTP trong inbox
- [ ] Xác thực OTP đúng → Tạo tài khoản thành công  
- [ ] Xác thực OTP sai → Thông báo lỗi rõ ràng
- [ ] OTP hết hạn → Có thể gửi lại OTP
- [ ] Email đã tồn tại → Thông báo lỗi phù hợp

## 📋 Next Steps
1. Cấu hình Gmail App Password trong appsettings.Development.json
2. Chạy script test `email-otp-comprehensive-test.bat`
3. Verify email OTP đến Gmail thật
4. Test toàn bộ authentication flow
5. Đồng bộ UI/UX frontend với backend responses
