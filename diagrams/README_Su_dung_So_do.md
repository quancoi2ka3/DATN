# Sơ đồ Hệ thống Sun Movement - Hướng dẫn sử dụng

## Tổng quan

Tập tin này chứa đầy đủ các sơ đồ PlantUML cho hệ thống Sun Movement, được tổ chức theo từng package chức năng và được tiếng Việt hóa theo yêu cầu. Các sơ đồ được chia thành 3 loại chính:

1. **ERD (Entity Relationship Diagrams)** - Sơ đồ quan hệ thực thể
2. **Class Diagrams** - Sơ đồ lớp
3. **Database Schema** - Sơ đồ cấu trúc cơ sở dữ liệu

## Cấu trúc Thư mục

```
diagrams/
├── ERD/
│   ├── SunMovement_ERD_Tong_quan_He_thong.puml
│   ├── SunMovement_ERD_Quan_ly_Nguoi_dung.puml
│   ├── SunMovement_ERD_Quan_ly_San_pham.puml
│   ├── SunMovement_ERD_Quan_ly_Don_hang.puml
│   ├── SunMovement_ERD_Quan_ly_Kho_hang.puml
│   ├── SunMovement_ERD_Quan_ly_Ma_giam_gia.puml
│   └── SunMovement_ERD_Quan_ly_Dich_vu_va_Su_kien.puml
├── Class_Diagrams/
│   ├── SunMovement_Class_Diagram_Quan_ly_Nguoi_dung.puml
│   ├── SunMovement_Class_Diagram_Quan_ly_San_pham.puml
│   ├── SunMovement_Class_Diagram_Quan_ly_Don_hang.puml
│   ├── SunMovement_Class_Diagram_Quan_ly_Kho_hang.puml
│   └── SunMovement_Class_Diagram_Quan_ly_Ma_giam_gia.puml
└── Database_Schema/
    ├── SunMovement_Database_Schema_Tong_quan.puml
    └── SunMovement_Database_Schema_Chi_tiet_San_pham.puml
```

## Các Package Chức năng

### 1. Quản lý Người dùng (User Management)
- **Mô tả**: Quản lý thông tin người dùng, xác thực, phân quyền
- **Entities chính**: NguoiDung, DangKyChoXacThuc, XacThucOTP, VaiTro
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_Nguoi_dung.puml`
  - Class: `SunMovement_Class_Diagram_Quan_ly_Nguoi_dung.puml`

### 2. Quản lý Sản phẩm (Product Management)
- **Mô tả**: Quản lý sản phẩm, biến thể, hình ảnh, đánh giá, tags
- **Entities chính**: SanPham, BienTheSanPham, DanhGiaSanPham, TheTag
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_San_pham.puml`
  - Class: `SunMovement_Class_Diagram_Quan_ly_San_pham.puml`
  - Schema: `SunMovement_Database_Schema_Chi_tiet_San_pham.puml`

### 3. Quản lý Đơn hàng (Order Management)
- **Mô tả**: Quản lý đơn hàng, giỏ hàng, thanh toán, trạng thái
- **Entities chính**: DonHang, ChiTietDonHang, GioHang, ChiTietGioHang
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_Don_hang.puml`
  - Class: `SunMovement_Class_Diagram_Quan_ly_Don_hang.puml`

### 4. Quản lý Kho hàng (Inventory Management)
- **Mô tả**: Quản lý kho, nhà cung cấp, giao dịch nhập/xuất
- **Entities chính**: NhaCungCap, GiaoDichKho, VatPhamKho
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_Kho_hang.puml`
  - Class: `SunMovement_Class_Diagram_Quan_ly_Kho_hang.puml`

### 5. Quản lý Mã giảm giá (Coupon Management)
- **Mô tả**: Quản lý mã giảm giá, lịch sử sử dụng, thống kê
- **Entities chính**: MaGiamGia, LichSuSuDungMaGiamGia, ThongKeMaGiamGia
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_Ma_giam_gia.puml`
  - Class: `SunMovement_Class_Diagram_Quan_ly_Ma_giam_gia.puml`

### 6. Quản lý Dịch vụ và Sự kiện (Service & Event Management)
- **Mô tả**: Quản lý dịch vụ, lịch trình, sự kiện, bài viết, FAQ
- **Entities chính**: DichVu, LichDichVu, SuKien, BaiViet, CauHoiThuongGap
- **File liên quan**:
  - ERD: `SunMovement_ERD_Quan_ly_Dich_vu_va_Su_kien.puml`

## Cách sử dụng

### 1. Xem sơ đồ bằng PlantUML

**Online:**
- Truy cập [PlantUML Online](http://www.plantuml.com/plantuml/uml/)
- Copy nội dung file `.puml` và paste vào editor
- Click "Generate" để xem sơ đồ

**Offline:**
- Cài đặt PlantUML extension cho VS Code
- Mở file `.puml` trong VS Code
- Sử dụng lệnh `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"

### 2. Export sang định dạng khác

```bash
# Export sang PNG
java -jar plantuml.jar -tpng *.puml

# Export sang SVG
java -jar plantuml.jar -tsvg *.puml

# Export sang PDF
java -jar plantuml.jar -tpdf *.puml
```

### 3. Integration với Documentation

Các file này có thể được tích hợp vào:
- Confluence (hỗ trợ PlantUML macro)
- GitLab/GitHub (auto-render PlantUML)
- Sphinx documentation
- MkDocs với PlantUML plugin

## Quy ước đặt tên

### Tiếng Việt hóa Entities
- `User` → `NguoiDung`
- `Product` → `SanPham`
- `Order` → `DonHang`
- `Supplier` → `NhaCungCap`
- `Coupon` → `MaGiamGia`
- `Service` → `DichVu`
- `Event` → `SuKien`

### Quy ước thuộc tính
- Khóa chính: `Id`
- Khóa ngoại: `[Entity]Id` (VD: `ProductId`, `UserId`)
- Timestamp: `CreatedAt`, `UpdatedAt`
- Trạng thái: `IsActive`, `IsApproved`, `IsFeatured`

### Quy ước mối quan hệ
- One-to-Many: `||--o{`
- Many-to-Many: `}o--o{`
- Optional: `||--o|`
- Composition: `||--*`

## Mô tả Chi tiết từng loại sơ đồ

### ERD (Entity Relationship Diagrams)
- **Mục đích**: Hiển thị các entity và mối quan hệ giữa chúng
- **Nội dung**: Bảng, cột, khóa chính, khóa ngoại, mối quan hệ
- **Sử dụng**: Thiết kế database, hiểu cấu trúc dữ liệu

### Class Diagrams
- **Mục đích**: Hiển thị cấu trúc lớp, phương thức, thuộc tính
- **Nội dung**: Classes, Interfaces, Methods, Properties, Relationships
- **Sử dụng**: Thiết kế OOP, architecture, code structure

### Database Schema
- **Mục đích**: Chi tiết cấu trúc database với constraints, indexes
- **Nội dung**: Tables, Columns với data types, Constraints, Indexes
- **Sử dụng**: Database implementation, migration scripts

## Best Practices

### 1. Khi cập nhật sơ đồ
- Luôn cập nhật cả ERD và Class diagram tương ứng
- Đảm bảo consistency giữa các sơ đồ
- Update version và ghi chú thay đổi

### 2. Khi thêm entity mới
- Thêm vào package phù hợp
- Cập nhật sơ đồ tổng quan
- Thêm mối quan hệ với entities có sẵn

### 3. Naming conventions
- Sử dụng tiếng Việt cho entity names
- Giữ nguyên tiếng Anh cho technical terms
- Consistent formatting across all diagrams

## Troubleshooting

### Lỗi thường gặp:
1. **Syntax Error**: Kiểm tra cú pháp PlantUML
2. **Missing Relationships**: Đảm bảo có khai báo đầy đủ entities trước khi tạo relationship
3. **Encoding Issues**: Sử dụng UTF-8 encoding cho tiếng Việt

### Performance:
- Các sơ đồ lớn có thể render chậm
- Chia nhỏ thành multiple files nếu cần
- Sử dụng `!include` để tái sử dụng components

## Liên hệ và Đóng góp

- **Maintainer**: Development Team
- **Last Updated**: Tháng 7, 2025
- **Version**: 1.0

Để đóng góp hoặc báo lỗi, vui lòng tạo issue trong repository project.
