# Hướng Dẫn Chatbot Thông Minh Sun Movement

## 🎯 Tổng Quan

Chatbot Sun Movement đã được nâng cấp để có thể:
- **Trả lời dựa trên dữ liệu thực** từ backend API
- **Hiểu ngữ cảnh** và đưa ra câu trả lời phù hợp
- **Fallback thông minh** khi Rasa không hiểu
- **Tương tác tự nhiên** với người dùng

## 🚀 Các Tính Năng Mới

### 1. Hệ Thống Hybrid AI
- **Rasa NLU**: Xử lý ngôn ngữ tự nhiên chính
- **Smart Fallback**: Xử lý dữ liệu backend khi Rasa không hiểu
- **Context Awareness**: Hiểu ngữ cảnh câu hỏi

### 2. Truy Vấn Dữ Liệu Thực
```typescript
// Tự động lấy dữ liệu từ backend
- Products API: /api/Products
- Services API: /api/Services  
- Real-time pricing
- Contact information
```

### 3. Các Chủ Đề Chatbot Có Thể Xử Lý

#### 🏋️ Sản Phẩm
- "Có sản phẩm gì?"
- "Thiết bị tập luyện nào tốt?"
- "Sản phẩm mới nhất"
- "Dụng cụ yoga"

#### 🧘 Dịch Vụ
- "Có lớp học nào?"
- "Dịch vụ yoga"
- "Personal training"
- "Lớp tập nhóm"

#### 💰 Giá Cả
- "Giá bao nhiều?"
- "Bảng giá dịch vụ"
- "Chi phí tham gia"
- "Ưu đãi hiện tại"

#### 📞 Liên Hệ
- "Địa chỉ ở đâu?"
- "Số điện thoại"
- "Thông tin liên hệ"
- "Email"

#### ⏰ Lịch Hoạt Động
- "Mở cửa khi nào?"
- "Lịch tập"
- "Giờ hoạt động"
- "Thời gian biểu"

## 🔧 Cách Hoạt Động

### Flow Xử Lý Message:
```
1. User gửi message
2. Frontend → API Proxy (/api/chatbot)
3. API Proxy → Rasa Server (localhost:5005)
4. Nếu Rasa trả lời tốt → Return response
5. Nếu không → Smart Fallback
6. Smart Fallback → Backend APIs
7. Return processed response
```

### Smart Fallback Logic:
```typescript
// Phân tích từ khóa
if (message.includes('sản phẩm')) {
  → Call Products API
} else if (message.includes('dịch vụ')) {
  → Call Services API  
} else if (message.includes('giá')) {
  → Return pricing info
}
```

## 🎨 Responses Mẫu

### Sản Phẩm Response:
```
🏋️ **Sản phẩm nổi bật của Sun Movement:**

1. **Máy tập đa năng Premium**
   💰 Giá: 15,000,000đ
   📝 Thiết bị gym chuyên nghiệp...

2. **Bộ dụng cụ Yoga Complete**
   💰 Giá: 1,500,000đ
   📝 Thảm yoga + phụ kiện...

Bạn có thể xem thêm sản phẩm khác trên website!
```

### Dịch Vụ Response:
```
🧘 **Dịch vụ tại Sun Movement:**

1. **Lớp Yoga Hatha**
   💰 Giá: 200,000đ/buổi
   📝 Yoga cơ bản cho người mới...

2. **Personal Training 1-1**
   💰 Giá: 500,000đ/buổi
   📝 Huấn luyện cá nhân chuyên sâu...

Đăng ký ngay để nhận ưu đãi đặc biệt!
```

## 🛠️ Cách Deploy & Retrain

### 1. Retrain Model:
```bash
# Chạy script tự động
d:\DATN\DATN\retrain-smart-chatbot.bat

# Hoặc thủ công
cd d:\DATN\DATN\sun-movement-chatbot
rasa train --force
rasa run --cors "*" --enable-api -p 5005
rasa run actions
```

### 2. Kiểm Tra Hoạt Động:
```bash
# Test connection
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"test","message":"xin chào"}'

# Test API proxy
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"sender":"test","message":"có sản phẩm gì"}'
```

## 🐛 Troubleshooting

### Vấn Đề Thường Gặp:

1. **Rasa không khởi động:**
   ```bash
   # Kiểm tra port 5005
   netstat -ano | findstr :5005
   
   # Kill process và restart
   taskkill /f /im python.exe
   ```

2. **Action server lỗi:**
   ```bash
   # Kiểm tra port 5055
   netstat -ano | findstr :5055
   
   # Restart action server
   rasa run actions
   ```

3. **Backend API không kết nối:**
   ```bash
   # Kiểm tra backend
   curl http://localhost:5000/api/Products
   
   # Kiểm tra CORS settings
   ```

4. **Chatbot trả lời sai:**
   ```bash
   # Retrain với dữ liệu mới
   rasa train --force
   
   # Thêm NLU examples mới
   # Cập nhật stories.yml
   ```

## 📊 Metrics & Analytics

### Debug Logs:
- Rasa logs: Check Rasa server console
- API logs: Check browser Network tab
- Backend logs: Check backend server console

### Performance Monitoring:
- Response time: < 3 seconds
- Accuracy: Monitor wrong responses
- Fallback rate: Smart fallback usage

## 🔮 Tính Năng Tương Lai

1. **Learning từ conversations**
2. **Sentiment analysis** 
3. **Multi-language support**
4. **Voice interaction**
5. **Integration với CRM**

## 🎯 Best Practices

### Cho Developers:
1. Thường xuyên retrain model
2. Monitor chatbot performance
3. Thu thập feedback từ users
4. Cập nhật responses dựa trên data

### Cho Users:
1. Hỏi câu hỏi rõ ràng
2. Sử dụng từ khóa liên quan
3. Phản hồi khi chatbot trả lời sai
4. Explore các tính năng mới

---

> **Lưu ý**: Chatbot sẽ liên tục học và cải thiện dựa trên tương tác với users. Hãy cung cấp feedback để giúp chatbot trở nên thông minh hơn!
