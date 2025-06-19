# VNPay Integration Complete Guide

## TỔNG QUAN
Hệ thống thanh toán VNPay đã được tích hợp thành công vào dự án Sun Movement với các tính năng:
- Thanh toán VNPay thông thường
- Thanh toán VNPay QR Code  
- Xử lý callback và IPN từ VNPay
- Cập nhật trạng thái đơn hàng tự động
- Redirect đến trang thành công/thất bại

## CẤU TRÚC FILES ĐÃ THAY ĐỔI

### Backend Files:
1. **OrdersController.cs** - Tích hợp VNPay service, xử lý callback
2. **VNPayService.cs** - Service xử lý VNPay payment
3. **Order.cs** - Thêm fields cho VNPay (PaymentDate, TransactionId, OrderStatus.Paid)
4. **appsettings.json** - Cấu hình VNPay sandbox
5. **Program.cs** - Thêm health endpoint

### Frontend Files:
1. **checkout-service.ts** - Xử lý paymentUrl redirect
2. **checkout/success/page.tsx** - Trang thành công thanh toán
3. **checkout/failed/page.tsx** - Trang thất bại thanh toán
4. **checkout/page.tsx** - Có sẵn option VNPay

### Test Files:
1. **vnpay-integration-test.html** - Trang test VNPay
2. **vnpay-integration-test.bat** - Script test đầy đủ
3. **quick-vnpay-test.bat** - Script test nhanh

## FLOW THANH TOÁN VNPAY

### 1. User Flow:
```
Khách hàng → Chọn sản phẩm → Checkout → Chọn VNPay → Click "Đặt hàng"
    ↓
Backend tạo Order → Gọi VNPayService.CreatePaymentUrl() → Trả về paymentUrl
    ↓  
Frontend nhận paymentUrl → Redirect sang VNPay Sandbox
    ↓
Khách hàng nhập thông tin thẻ → VNPay xử lý → Redirect về ReturnUrl
    ↓
Backend xử lý callback → Cập nhật Order status → Redirect đến success/failed page
```

### 2. Technical Flow:
```
POST /api/orders/checkout { paymentMethod: "vnpay" }
    ↓
OrdersController.ProcessCheckout()
    ↓
VNPayService.CreatePaymentUrl(order, httpContext)
    ↓
Return { success: true, order: {...}, paymentUrl: "https://sandbox.vnpayment.vn/..." }
    ↓
Frontend redirects to paymentUrl
    ↓
VNPay processes payment → Calls ReturnUrl: GET /api/orders/vnpay-return
    ↓
OrdersController.VNPayReturn() → Update order status → Redirect to frontend
    ↓
VNPay also calls IPN: GET/POST /api/orders/vnpay-ipn (for server confirmation)
```

## CẤU HÌNH VNPAY

### Current Sandbox Config (appsettings.json):
```json
"VNPay": {
  "TmnCode": "DEMOV210",
  "HashSecret": "RAOEXHYVSDDIIENYWSLDIIZENXUXZFJ", 
  "BaseUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "ReturnUrl": "http://localhost:5001/api/orders/vnpay-return",
  "IpnUrl": "http://localhost:5001/api/orders/vnpay-ipn"
}
```

### VNPay Parameters Sent:
- vnp_Version: "2.1.0"
- vnp_Command: "pay"  
- vnp_TmnCode: Merchant code
- vnp_Amount: Amount * 100 (VNPay uses cents)
- vnp_TxnRef: Order ID
- vnp_OrderInfo: Order description
- vnp_ReturnUrl: Callback URL
- vnp_CreateDate: Current timestamp
- vnp_ExpireDate: 15 minutes from now
- vnp_BankCode: "VNPAYQR" (for QR payments)
- vnp_SecureHash: HMAC-SHA512 signature

## TEST DATA

### VNPay Sandbox Test Card:
- **Card Number:** 9704198526191432198
- **Cardholder Name:** NGUYEN VAN A
- **Issue Date:** 07/15  
- **OTP:** 123456
- **Result:** Always success

### Test URLs:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001
- **VNPay Test Page:** d:\DATN\DATN\vnpay-integration-test.html

## TESTING STEPS

### Automated Test:
1. Run `quick-vnpay-test.bat`
2. Sử dụng VNPay test page để test nhanh
3. Hoặc test full flow qua frontend

### Manual Test:
1. Start backend: `dotnet run --urls=http://localhost:5001`
2. Start frontend: `npm run dev`
3. Go to http://localhost:3000/store
4. Add products to cart
5. Go to checkout, select VNPay payment
6. Fill shipping info, click "Đặt hàng"
7. Should redirect to VNPay sandbox
8. Use test card info above
9. Complete payment
10. Should redirect back to success page

## ENDPOINTS

### Backend Endpoints:
- `POST /api/orders/checkout` - Process checkout (includes VNPay)
- `GET /api/orders/vnpay-return` - VNPay return callback
- `GET|POST /api/orders/vnpay-ipn` - VNPay IPN callback
- `GET /health` - Health check

### Frontend Routes:
- `/checkout` - Checkout page
- `/checkout/success` - Payment success page
- `/checkout/failed` - Payment failed page

## ERROR HANDLING

### Common VNPay Error Codes:
- **00:** Success
- **07:** Fraud suspected
- **09:** Card not registered for internet banking  
- **10:** Wrong card info 3 times
- **11:** Payment timeout
- **12:** Card locked
- **24:** User cancelled
- **51:** Insufficient balance
- **99:** Other errors

### Backend Error Handling:
- Invalid signature → Return error
- Order not found → Return error  
- Amount mismatch → Return error
- Database errors → Log and return generic error

## PRODUCTION SETUP

### Required Changes for Production:
1. **Register VNPay Merchant Account:**
   - Go to https://vnpay.vn
   - Register merchant account
   - Get real TmnCode and HashSecret

2. **Update Configuration:**
   ```json
   "VNPay": {
     "TmnCode": "YOUR_REAL_TMN_CODE",
     "HashSecret": "YOUR_REAL_HASH_SECRET",
     "BaseUrl": "https://pay.vnpay.vn/vpcpay.html",
     "ReturnUrl": "https://yourdomain.com/api/orders/vnpay-return",
     "IpnUrl": "https://yourdomain.com/api/orders/vnpay-ipn"
   }
   ```

3. **SSL Certificate:**
   - IPN URL must have valid SSL certificate
   - VNPay requires HTTPS for production

4. **Database Migration:**
   - Run migration to add new Order fields
   - Update existing orders if needed

## TROUBLESHOOTING

### Common Issues:

1. **"Invalid signature" Error:**
   - Check HashSecret configuration
   - Ensure parameters are sorted correctly
   - Verify HMAC-SHA512 calculation

2. **Payment URL not generated:**
   - Check VNPayService registration in DI
   - Verify configuration values
   - Check logs for exceptions

3. **Callback not working:**
   - Ensure ReturnUrl is accessible from internet
   - Check CORS configuration
   - Verify endpoint routing

4. **Order not updated:**
   - Check IPN endpoint logs
   - Verify database connection
   - Check order ID matching

### Debug Tips:
- Use browser devtools to check network requests
- Check backend console logs for detailed errors
- Use VNPay test page for isolated testing
- Verify VNPay sandbox is accessible

## STATUS: ✅ COMPLETE

VNPay integration đã hoàn tất với đầy đủ tính năng:
- ✅ Tạo URL thanh toán VNPay
- ✅ Redirect sang VNPay sandbox
- ✅ Xử lý callback (Return URL)
- ✅ Xử lý IPN notification
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Error handling
- ✅ Success/Failed pages
- ✅ Test tools và documentation

Hệ thống sẵn sàng để test và deploy!
