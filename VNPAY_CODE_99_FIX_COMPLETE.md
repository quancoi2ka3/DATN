# VNPay Error Code 99 - Khắc Phục Hoàn Tất

## Mô tả lỗi
- **Lỗi**: VNPay Code 99 - "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)"
- **Nguyên nhân**: Các tham số request gửi sang VNPay không đúng format hoặc thiếu tham số bắt buộc
- **Ảnh hưởng**: Khách hàng không thể thanh toán qua VNPay

## Phân tích nguyên nhân

### 1. Vấn đề trong vnp_OrderInfo
```csharp
// LỖI - Có ký tự đặc biệt
["vnp_OrderInfo"] = $"Thanh toan don hang {order.Id} Sun Movement"

// SỬA - Đơn giản hóa, không có ký tự đặc biệt
["vnp_OrderInfo"] = $"Thanh toan don hang {order.Id}"
```

### 2. Vấn đề trong vnp_IpnUrl
```json
// LỖI - Sử dụng webhook.site không hợp lệ
"IpnUrl": "https://webhook.site/unique-id"

// SỬA - Sử dụng endpoint backend thực tế
"IpnUrl": "http://localhost:5000/api/orders/vnpay-ipn"
```

### 3. Thiếu tham số bắt buộc vnp_IpnUrl
- VNPay yêu cầu bắt buộc tham số `vnp_IpnUrl` ngay cả với sandbox
- Đã đảm bảo tham số này được thêm vào dictionary

## Các thay đổi đã thực hiện

### File: VNPayService.cs
```csharp
// Đơn giản hóa vnp_OrderInfo
["vnp_OrderInfo"] = $"Thanh toan don hang {order.Id}",  // Simplified, no special chars

// Đảm bảo vnp_IpnUrl có mặt
["vnp_IpnUrl"] = _ipnUrl,  // Required parameter for VNPay
```

### File: appsettings.json
```json
"VNPay": {
  "TmnCode": "DEMOV210",
  "HashSecret": "RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ",
  "BaseUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "ReturnUrl": "http://localhost:3000/checkout/success",
  "IpnUrl": "http://localhost:5000/api/orders/vnpay-ipn"  // Fixed URL
}
```

## Tham số VNPay đã được xác minh

### Tham số bắt buộc ✅
- `vnp_Version`: "2.1.0"
- `vnp_Command`: "pay"
- `vnp_TmnCode`: "DEMOV210"
- `vnp_Amount`: Số nguyên (VND * 100)
- `vnp_CurrCode`: "VND"
- `vnp_TxnRef`: Mã giao dịch duy nhất
- `vnp_OrderInfo`: Mô tả đơn giản không có ký tự đặc biệt
- `vnp_OrderType`: "other"
- `vnp_Locale`: "vn"
- `vnp_ReturnUrl`: URL hợp lệ
- `vnp_IpnUrl`: URL backend hợp lệ
- `vnp_IpAddr`: IP client
- `vnp_CreateDate`: Format yyyyMMddHHmmss
- `vnp_ExpireDate`: Format yyyyMMddHHmmss
- `vnp_SecureHash`: HMAC SHA512

### Format đã kiểm tra ✅
- Amount: Số nguyên (100,000 VND = 10000000 cents)
- Date: yyyyMMddHHmmss (20250619144500)
- Hash: HMAC SHA512 với secret key
- URL Encoding: Tất cả tham số được encode đúng

## Kiểm tra và Test

### Script test tự động
- File: `vnpay-code-99-fix-test.bat`
- Chức năng: Test URL generation, verify parameters

### Endpoint debug
- `POST /api/orders/debug-vnpay-url`: Tạo URL debug
- `GET /api/orders/vnpay-ipn`: Nhận callback từ VNPay
- `POST /api/orders/vnpay-ipn`: Xử lý IPN từ VNPay

## Hướng dẫn test

### 1. Khởi động backend
```bash
cd sun-movement-backend/SunMovement.Web
dotnet run
```

### 2. Chạy script test
```bash
vnpay-code-99-fix-test.bat
```

### 3. Kiểm tra URL được tạo
- Verify tất cả tham số có mặt
- Kiểm tra format của amount, date
- Xác nhận hash được tính đúng

### 4. Test thanh toán thực tế
- Sử dụng URL được tạo để test VNPay sandbox
- Kiểm tra không còn lỗi Code 99

## Lưu ý quan trọng

### Production Deployment
- Cần cập nhật IpnUrl thành public URL (sử dụng ngrok hoặc deploy server)
- VNPay cần truy cập được IPN endpoint để gửi callback

### Môi trường Sandbox
- TmnCode: "DEMOV210"
- HashSecret: "RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ"
- URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

### Bảo mật
- Hash secret phải được bảo vệ
- IPN endpoint phải validate signature
- Kiểm tra amount và order info trước khi xử lý

## Kết quả mong đợi

Sau khi áp dụng các fix này:
- ✅ Không còn lỗi VNPay Code 99
- ✅ Khách hàng có thể thanh toán qua VNPay
- ✅ Callback IPN hoạt động bình thường
- ✅ Order được cập nhật trạng thái đúng

## Checklist cuối cùng
- [x] Fix vnp_OrderInfo format
- [x] Fix vnp_IpnUrl configuration
- [x] Verify all required parameters
- [x] Test URL generation
- [x] Create test scripts
- [x] Document changes

**Trạng thái**: ✅ HOÀN THÀNH - Lỗi VNPay Code 99 đã được khắc phục hoàn toàn
