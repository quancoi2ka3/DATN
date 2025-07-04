# 📊 BẢNG PHÂN TÍCH CƠ SỞ DỮ LIỆU SUNMOVEMENT

## 🎯 TÓM TẮT DƯỚI ÁN
**SunMovement** là nền tảng thương mại điện tử chuyên về thể thao và sức khỏe, cung cấp:
- **Sản phẩm thể thao**: Sportswear, Equipment, Supplements, Accessories, Nutrition
- **Dịch vụ tập luyện**: Calisthenics, Strength Training, Yoga  
- **Hệ thống quản lý**: Inventory, Orders, Users, Analytics

---

## 📋 DANH SÁCH TẤT CẢ 43 BẢNG TRONG CƠ SỞ DỮ LIỆU

### 🔵 **NHÓM 1: QUẢN LÝ NGƯỜI DÙNG VÀ QUYỀN HẠN (8 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 1 | **AspNetUsers** | **NguoiDung** | ⭐⭐⭐⭐⭐ | ✅ GIỮ LẠI | Bảng người dùng chính (Admin/Customer/Staff) |
| 2 | AspNetRoles | VaiTro | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Định nghĩa vai trò |
| 3 | AspNetUserRoles | NguoiDung_VaiTro | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Liên kết người dùng với vai trò |
| 4 | AspNetUserClaims | QuyenNguoiDung | ⭐⭐⭐ | ✅ GIỮ LẠI | Quyền cụ thể của người dùng |
| 5 | AspNetRoleClaims | QuyenVaiTro | ⭐⭐⭐ | ✅ GIỮ LẠI | Quyền của vai trò |
| 6 | AspNetUserLogins | DangNhapNgoai | ⭐⭐ | ✅ GIỮ LẠI | Đăng nhập qua mạng xã hội |
| 7 | AspNetUserTokens | TokenNguoiDung | ⭐⭐ | ✅ GIỮ LẠI | Token xác thực |
| 8 | OtpVerifications | XacThucOTP | ⭐⭐⭐ | ✅ GIỮ LẠI | Xác thực OTP |

### 🟢 **NHÓM 2: SẢN PHẨM VÀ DỊCH VỤ (12 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 9 | **Products** | **SanPham** | ⭐⭐⭐⭐⭐ | ✅ GIỮ LẠI | Sản phẩm chính |
| 10 | **Services** | **DichVu** | ⭐⭐⭐⭐⭐ | ✅ GIỮ LẠI | Dịch vụ tập luyện |
| 11 | ProductVariants | BienTheSanPham | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Biến thể sản phẩm (size, màu) |
| 12 | ProductImages | HinhAnhSanPham | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Hình ảnh sản phẩm |
| 13 | ProductVariantImages | HinhAnhBienThe | ⭐⭐⭐ | ⚠️ CÂN NHẮC | Hình ảnh biến thể (có thể tích hợp vào HinhAnhSanPham) |
| 14 | ServiceSchedules | LichDichVu | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Lịch học/tập |
| 15 | Tags | NhanSanPham | ⭐⭐⭐ | ✅ GIỮ LẠI | Nhãn/tag |
| 16 | ProductTags | SanPham_Nhan | ⭐⭐⭐ | ✅ GIỮ LẠI | Liên kết sản phẩm với nhãn |
| 17 | ProductReviews | DanhGiaSanPham | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Đánh giá sản phẩm |
| 18 | ProductReviewImages | HinhAnhDanhGia | ⭐⭐ | ❌ XÓA | Hình ảnh trong đánh giá (không cần thiết cho MVP) |
| 19 | ProductReviewHelpfuls | LuotHuuIch | ⭐⭐ | ❌ XÓA | Đánh giá hữu ích (không cần thiết cho MVP) |
| 20 | CustomerReviews | DanhGiaKhachHang | ⭐⭐⭐ | ❌ XÓA | Trùng lặp với ProductReviews |

### 🟡 **NHÓM 3: ĐƠN HÀNG VÀ THANH TOÁN (6 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 21 | **Orders** | **DonHang** | ⭐⭐⭐⭐⭐ | ✅ GIỮ LẠI | Đơn hàng chính |
| 22 | **OrderItems** | **ChiTietDonHang** | ⭐⭐⭐⭐⭐ | ✅ GIỮ LẠI | Chi tiết sản phẩm trong đơn |
| 23 | OrderStatusHistory | LichSuTrangThaiDon | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Theo dõi trạng thái đơn hàng |
| 24 | ShoppingCarts | GioHang | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Giỏ hàng |
| 25 | CartItems | ChiTietGioHang | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Sản phẩm trong giỏ |
| 26 | OrderPayments | ThanhToanDonHang | ⭐⭐⭐⭐ | ⚠️ THIẾU | Bảng thanh toán (cần tạo) |

### 🟠 **NHÓM 4: QUẢN LÝ KHO VÀ NHÀ CUNG CẤP (4 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 27 | **Suppliers** | **NhaCungCap** | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Nhà cung cấp |
| 28 | **InventoryTransactions** | **GiaoDichKho** | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Giao dịch nhập/xuất kho |
| 29 | ProductSuppliers | SanPham_NhaCungCap | ⭐⭐⭐ | ✅ GIỮ LẠI | Liên kết sản phẩm với NCC |
| 30 | InventoryItems | HangTonKho | ⭐⭐⭐ | ❌ XÓA | Trùng lặp với Products (StockQuantity) |

### 🔴 **NHÓM 5: MÃ GIẢM GIÁ VÀ KHUYẾN MÃI (4 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 31 | **Coupons** | **MaGiamGia** | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Mã giảm giá |
| 32 | CouponUsageHistory | LichSuSuDungMa | ⭐⭐⭐ | ✅ GIỮ LẠI | Lịch sử sử dụng mã |
| 33 | CouponProducts | MaGiamGia_SanPham | ⭐⭐⭐ | ✅ GIỮ LẠI | Mã áp dụng cho sản phẩm |
| 34 | CouponCategories | MaGiamGia_DanhMuc | ⭐⭐⭐ | ✅ GIỮ LẠI | Mã áp dụng cho danh mục |

### 🟣 **NHÓM 6: HỆ THỐNG ĐỀ XUẤT VÀ PHÂN TÍCH (3 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 35 | **UserInteractions** | **TuongTacNguoiDung** | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Theo dõi hành vi người dùng |
| 36 | ProductRecommendations | DeXuatSanPham | ⭐⭐⭐ | ✅ GIỮ LẠI | Đề xuất sản phẩm |
| 37 | CustomerSearchStatistics | ThongKeTiemKiem | ⭐⭐⭐ | ✅ GIỮ LẠI | Thống kê tìm kiếm |

### ⚪ **NHÓM 7: NỘI DUNG VÀ HỖ TRỢ (6 bảng)**

| STT | Tên bảng gốc | Tên tiếng Việt đề xuất | Mức độ quan trọng | Trạng thái | Mô tả |
|-----|--------------|------------------------|-------------------|------------|-------|
| 38 | **ContactMessages** | **TinNhanLienHe** | ⭐⭐⭐⭐ | ✅ GIỮ LẠI | Tin nhắn liên hệ |
| 39 | Articles | BaiViet | ⭐⭐⭐ | ✅ GIỮ LẠI | Bài viết/tin tức |
| 40 | Events | SuKien | ⭐⭐⭐ | ✅ GIỮ LẠI | Sự kiện |
| 41 | FAQs | CauHoiThuongGap | ⭐⭐⭐ | ✅ GIỮ LẠI | Câu hỏi thường gặp |
| 42 | CustomerActivities | HoatDongKhachHang | ⭐⭐ | ❌ XÓA | Trùng lặp với UserInteractions |
| 43 | PendingUserRegistrations | DangKyChoXuLy | ⭐⭐ | ❌ XÓA | Có thể tích hợp vào AspNetUsers |

---

## 🎯 KẾT LUẬN VÀ KHUYẾN NGHỊ

### ✅ **CÁC BẢNG CỐT LÕI (CORE TABLES) - 20 bảng:**
1. **NguoiDung** (AspNetUsers) - ⭐⭐⭐⭐⭐
2. **SanPham** (Products) - ⭐⭐⭐⭐⭐  
3. **DichVu** (Services) - ⭐⭐⭐⭐⭐
4. **DonHang** (Orders) - ⭐⭐⭐⭐⭐
5. **ChiTietDonHang** (OrderItems) - ⭐⭐⭐⭐⭐
6. **GioHang** (ShoppingCarts) - ⭐⭐⭐⭐⭐
7. **BienTheSanPham** (ProductVariants) - ⭐⭐⭐⭐
8. **LichDichVu** (ServiceSchedules) - ⭐⭐⭐⭐
9. **NhaCungCap** (Suppliers) - ⭐⭐⭐⭐
10. **GiaoDichKho** (InventoryTransactions) - ⭐⭐⭐⭐
11. **MaGiamGia** (Coupons) - ⭐⭐⭐⭐
12. **TuongTacNguoiDung** (UserInteractions) - ⭐⭐⭐⭐
13. **TinNhanLienHe** (ContactMessages) - ⭐⭐⭐⭐
14. **DanhGiaSanPham** (ProductReviews) - ⭐⭐⭐⭐
15. **LichSuTrangThaiDon** (OrderStatusHistory) - ⭐⭐⭐⭐
16. **HinhAnhSanPham** (ProductImages) - ⭐⭐⭐⭐
17. **ChiTietGioHang** (CartItems) - ⭐⭐⭐⭐
18. **VaiTro** (AspNetRoles) - ⭐⭐⭐⭐
19. **NguoiDung_VaiTro** (AspNetUserRoles) - ⭐⭐⭐⭐
20. **XacThucOTP** (OtpVerifications) - ⭐⭐⭐

### ❌ **CÁC BẢNG NÊN XÓA (6 bảng):**
1. **ProductReviewImages** - Không cần thiết cho MVP
2. **ProductReviewHelpfuls** - Chức năng phụ
3. **CustomerReviews** - Trùng lặp với ProductReviews
4. **InventoryItems** - Trùng lặp với Products.StockQuantity
5. **CustomerActivities** - Trùng lặp với UserInteractions
6. **PendingUserRegistrations** - Tích hợp vào AspNetUsers

### ⚠️ **CÁC BẢNG CẦN CÂN NHẮC (2 bảng):**
1. **ProductVariantImages** - Có thể tích hợp vào ProductImages
2. **OrderPayments** - Cần tạo bảng này cho hệ thống thanh toán

### 📊 **THỐNG KÊ CUỐI CÙNG:**
- **Tổng số bảng hiện tại**: 43 bảng
- **Bảng cần giữ lại**: 35 bảng (81%)
- **Bảng nên xóa**: 6 bảng (14%)
- **Bảng cần cân nhắc**: 2 bảng (5%)
- **Bảng cần tạo thêm**: 1 bảng (OrderPayments)

---

## 🚀 HÀNH ĐỘNG TIẾP THEO

1. **Xóa các bảng dư thừa** để tối ưu hóa cơ sở dữ liệu
2. **Tạo bảng OrderPayments** cho hệ thống thanh toán
3. **Cập nhật tên bảng sang tiếng Việt** để dễ quản lý
4. **Tối ưu hóa indexes** cho các bảng quan trọng
5. **Tạo documentation** chi tiết cho từng bảng

Dự án của bạn có cấu trúc cơ sở dữ liệu khá hoàn chỉnh và chuyên nghiệp! 🎉
