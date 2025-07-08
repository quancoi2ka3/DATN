# 📊 Mô Tả Cơ Sở Dữ Liệu Sun Movement - File Excel

## 📄 Thông Tin File

- **File Excel**: `Database_Tables_Description.xlsx`
- **File CSV**: `Database_Tables_Description.csv`
- **Ngày tạo**: 07/01/2025
- **Tổng số bảng**: 14 bảng
- **Tổng số cột**: 210 cột

## 📋 Cấu Trúc File Excel

File Excel được tổ chức thành 2 sheet chính:

### 1. 📊 Sheet "Tóm tắt"
- Thông tin tổng quan về cơ sở dữ liệu
- Danh sách tất cả bảng và số lượng cột
- Thống kê tổng thể

### 2. 📑 Sheet "Tất cả bảng"
- Toàn bộ dữ liệu chi tiết của tất cả bảng
- Định dạng bảng với border và màu sắc
- Các cột thông tin:
  - **STT**: Số thứ tự
  - **Tên Bảng**: Tên bảng trong database
  - **Tên Cột**: Tên cột trong bảng
  - **Kiểu Dữ Liệu**: Kiểu dữ liệu của cột
  - **Độ Dài**: Độ dài tối đa (nếu có)
  - **Null**: Có cho phép NULL không
  - **Khóa**: Loại khóa (PK, FK, UQ)
  - **Mặc Định**: Giá trị mặc định
  - **Mô Tả**: Mô tả chức năng của cột

## 🗃️ Danh Sách Bảng

| STT | Tên Bảng | Số Cột | Mô Tả |
|-----|-----------|---------|-------|
| 1 | AspNetUsers | 22 | Quản lý người dùng và xác thực |
| 2 | Products | 33 | Quản lý sản phẩm |
| 3 | Orders | 32 | Quản lý đơn hàng |
| 4 | OrderItems | 9 | Chi tiết món hàng trong đơn |
| 5 | ShoppingCarts | 4 | Giỏ hàng của người dùng |
| 6 | CartItems | 10 | Món hàng trong giỏ |
| 7 | Services | 10 | Quản lý dịch vụ |
| 8 | Suppliers | 11 | Quản lý nhà cung cấp |
| 9 | InventoryTransactions | 17 | Giao dịch kho hàng |
| 10 | Coupons | 25 | Quản lý mã giảm giá |
| 11 | Events | 15 | Quản lý sự kiện |
| 12 | Articles | 7 | Quản lý bài viết |
| 13 | FAQs | 6 | Câu hỏi thường gặp |
| 14 | ContactMessages | 9 | Tin nhắn liên hệ |

## 🎨 Định Dạng File Excel

- **Header**: Nền xanh đậm, chữ trắng, in đậm
- **Border**: Tất cả ô đều có viền
- **Alignment**: Header căn giữa, dữ liệu căn trái
- **Column Width**: Tự động điều chỉnh theo nội dung

## 📖 Cách Sử Dụng

1. **Mở file Excel**: Double-click vào `Database_Tables_Description.xlsx`
2. **Xem tổng quan**: Chuyển đến sheet "Tóm tắt"
3. **Tìm kiếm bảng**: Sử dụng Ctrl+F để tìm kiếm tên bảng hoặc cột
4. **Filter dữ liệu**: Sử dụng AutoFilter của Excel để lọc theo bảng
5. **Export**: Có thể copy/paste hoặc export sang các format khác

## 🔍 Ký Hiệu Trong File

### Cột "Khóa":
- **PK**: Primary Key (Khóa chính)
- **FK**: Foreign Key (Khóa ngoại)
- **UQ**: Unique Key (Khóa duy nhất)
- **(trống)**: Không có ràng buộc khóa

### Cột "Null":
- **NO**: Không cho phép NULL
- **YES**: Cho phép NULL

### Kiểu Dữ Liệu Thường Gặp:
- **nvarchar**: Chuỗi Unicode có độ dài biến đổi
- **int**: Số nguyên 32-bit
- **decimal**: Số thập phân có độ chính xác cao
- **datetime2**: Ngày giờ với độ chính xác cao
- **bit**: Boolean (true/false)
- **uniqueidentifier**: GUID

## 🚀 Cách Cập Nhật

Để cập nhật file Excel khi có thay đổi database:

1. Cập nhật file CSV từ database mới
2. Chạy script `final_excel_export.py`:
   ```bash
   cd "d:\DATN\DATN\scripts"
   d:/DATN/DATN/.venv/Scripts/python.exe final_excel_export.py
   ```

## 📁 File Liên Quan

- `Database_Tables_Description.csv`: File CSV gốc
- `scripts/final_excel_export.py`: Script tạo file Excel
- `diagrams/`: Thư mục chứa các sơ đồ PlantUML
- `docs/`: Thư mục chứa tài liệu dự án

## 📞 Hỗ Trợ

Nếu có vấn đề với file Excel hoặc cần cập nhật, vui lòng:
1. Kiểm tra file CSV gốc
2. Chạy lại script Python
3. Liên hệ team phát triển

---
*File được tạo tự động từ cơ sở dữ liệu Sun Movement*
