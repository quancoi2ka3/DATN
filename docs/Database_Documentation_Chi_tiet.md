# Bảng Mô Tả Chi Tiết Cơ Sở Dữ Liệu - Hệ Thống Sun Movement

## Tổng Quan
Hệ thống Sun Movement sử dụng Entity Framework Core với SQL Server, bao gồm 30+ bảng được tổ chức theo 6 nhóm chức năng chính.

---

## 1. NHÓM QUẢN LÝ NGƯỜI DÙNG (Identity & User Management)

### 1.1. AspNetUsers (Bảng Người Dùng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | nvarchar | 450 | NO | | Khóa chính, định danh duy nhất |
| UserName | nvarchar | 256 | YES | | Tên đăng nhập |
| NormalizedUserName | nvarchar | 256 | YES | | Tên đăng nhập chuẩn hóa (uppercase) |
| Email | nvarchar | 256 | YES | | Địa chỉ email |
| NormalizedEmail | nvarchar | 256 | YES | | Email chuẩn hóa (uppercase) |
| EmailConfirmed | bit | 1 | NO | 0 | Trạng thái xác nhận email |
| PasswordHash | nvarchar | max | YES | | Mật khẩu đã hash |
| SecurityStamp | nvarchar | max | YES | | Tem bảo mật (để invalidate tokens) |
| ConcurrencyStamp | nvarchar | max | YES | | Tem đồng thời (optimistic concurrency) |
| PhoneNumber | nvarchar | max | YES | | Số điện thoại |
| PhoneNumberConfirmed | bit | 1 | NO | 0 | Trạng thái xác nhận số điện thoại |
| TwoFactorEnabled | bit | 1 | NO | 0 | Bật xác thực 2 yếu tố |
| LockoutEnd | datetimeoffset | 7 | YES | | Thời gian kết thúc khóa tài khoản |
| LockoutEnabled | bit | 1 | NO | 0 | Cho phép khóa tài khoản |
| AccessFailedCount | int | 4 | NO | 0 | Số lần đăng nhập thất bại |
| FirstName | nvarchar | max | NO | '' | Tên |
| LastName | nvarchar | max | NO | '' | Họ |
| DateOfBirth | datetime2 | 7 | NO | | Ngày sinh |
| Address | nvarchar | max | NO | '' | Địa chỉ |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo tài khoản |
| LastLogin | datetime2 | 7 | YES | | Lần đăng nhập cuối |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |

**Indexes:**
- PK_AspNetUsers (Id)
- IX_AspNetUsers_NormalizedUserName (UNIQUE)
- IX_AspNetUsers_NormalizedEmail

### 1.2. AspNetRoles (Bảng Vai Trò)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | nvarchar | 450 | NO | | Khóa chính vai trò |
| Name | nvarchar | 256 | YES | | Tên vai trò |
| NormalizedName | nvarchar | 256 | YES | | Tên vai trò chuẩn hóa |
| ConcurrencyStamp | nvarchar | max | YES | | Tem đồng thời |

**Indexes:**
- PK_AspNetRoles (Id)
- IX_AspNetRoles_NormalizedName (UNIQUE)

### 1.3. AspNetUserRoles (Bảng Người Dùng - Vai Trò)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| UserId | nvarchar | 450 | NO | | Khóa ngoại đến AspNetUsers |
| RoleId | nvarchar | 450 | NO | | Khóa ngoại đến AspNetRoles |

**Khóa Chính:** Composite (UserId, RoleId)
**Foreign Keys:**
- FK_AspNetUserRoles_AspNetUsers_UserId
- FK_AspNetUserRoles_AspNetRoles_RoleId

### 1.4. PendingUserRegistrations (Bảng Đăng Ký Chờ Xác Thực)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Email | nvarchar | 256 | NO | | Email đăng ký |
| FirstName | nvarchar | 100 | NO | | Tên |
| LastName | nvarchar | 100 | NO | | Họ |
| PhoneNumber | nvarchar | 20 | NO | | Số điện thoại |
| Password | nvarchar | 256 | NO | | Mật khẩu tạm thời |
| VerificationCode | nvarchar | 10 | NO | | Mã xác thực |
| ExpiryTime | datetime2 | 7 | NO | | Thời gian hết hạn |
| IsVerified | bit | 1 | NO | 0 | Trạng thái xác thực |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 1.5. OtpVerifications (Bảng Xác Thực OTP)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Email | nvarchar | 256 | YES | | Email nhận OTP |
| PhoneNumber | nvarchar | 20 | YES | | Số điện thoại nhận OTP |
| OtpCode | nvarchar | 10 | NO | | Mã OTP |
| Purpose | nvarchar | 50 | NO | | Mục đích sử dụng OTP |
| ExpiryTime | datetime2 | 7 | NO | | Thời gian hết hạn |
| IsUsed | bit | 1 | NO | 0 | Trạng thái đã sử dụng |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

---

## 2. NHÓM QUẢN LÝ SẢN PHẨM (Product Management)

### 2.1. Products (Bảng Sản Phẩm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Name | nvarchar | 200 | NO | | Tên sản phẩm |
| Description | nvarchar | 2000 | NO | | Mô tả sản phẩm |
| ImageUrl | nvarchar | max | YES | | URL hình ảnh chính |
| Price | decimal | 18,2 | NO | | Giá bán |
| DiscountPrice | decimal | 18,2 | YES | | Giá sau giảm |
| CostPrice | decimal | 18,2 | NO | 0 | Giá gốc/nhập |
| StockQuantity | int | 4 | NO | 0 | Số lượng tồn kho |
| FirstStockDate | datetime2 | 7 | NO | GETUTCDATE() | Ngày nhập kho đầu tiên |
| LastStockUpdateDate | datetime2 | 7 | NO | GETUTCDATE() | Ngày cập nhật kho cuối |
| MinimumStockLevel | int | 4 | NO | 5 | Ngưỡng cảnh báo hết hàng |
| OptimalStockLevel | int | 4 | NO | 50 | Mức tồn kho tối ưu |
| Sku | nvarchar | 50 | YES | | Mã SKU |
| Barcode | nvarchar | 50 | YES | | Mã vạch |
| Category | int | 4 | NO | 0 | Danh mục (enum) |
| SubCategory | nvarchar | 100 | NO | '' | Danh mục con |
| Specifications | nvarchar | max | YES | | Thông số kỹ thuật (JSON) |
| IsFeatured | bit | 1 | NO | 0 | Sản phẩm nổi bật |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| Status | int | 4 | NO | 0 | Trạng thái sản phẩm (enum) |
| SortOrder | int | 4 | NO | 0 | Thứ tự sắp xếp |
| Weight | decimal | 18,3 | NO | 0 | Trọng lượng (gram) |
| Dimensions | nvarchar | 100 | YES | | Kích thước (L x W x H cm) |
| MetaTitle | nvarchar | 200 | YES | | Tiêu đề SEO |
| MetaDescription | nvarchar | 500 | YES | | Mô tả SEO |
| MetaKeywords | nvarchar | 200 | YES | | Từ khóa SEO |
| Slug | nvarchar | 200 | YES | | URL thân thiện |
| TrackInventory | bit | 1 | NO | 1 | Theo dõi tồn kho |
| AllowBackorder | bit | 1 | NO | 0 | Cho phép đặt trước |
| AverageRating | decimal | 3,2 | NO | 0 | Điểm đánh giá trung bình |
| ReviewCount | int | 4 | NO | 0 | Số lượng đánh giá |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

**Indexes:**
- PK_Products (Id)
- IX_Products_Sku (UNIQUE, filtered)
- IX_Products_Slug (UNIQUE, filtered)
- IX_Products_Category
- IX_Products_IsActive

**Check Constraints:**
- CK_Products_Price_Positive: Price > 0
- CK_Products_StockQuantity_NonNegative: StockQuantity >= 0

### 2.2. ProductVariants (Bảng Biến Thể Sản Phẩm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| Name | nvarchar | 200 | NO | | Tên biến thể |
| Sku | nvarchar | 50 | YES | | Mã SKU biến thể |
| Price | decimal | 18,2 | NO | | Giá bán biến thể |
| DiscountPrice | decimal | 18,2 | YES | | Giá giảm biến thể |
| CostPrice | decimal | 18,2 | NO | 0 | Giá nhập biến thể |
| StockQuantity | int | 4 | NO | 0 | Tồn kho biến thể |
| Weight | decimal | 18,3 | NO | 0 | Trọng lượng |
| Dimensions | nvarchar | 100 | YES | | Kích thước |
| Attributes | nvarchar | max | YES | | Thuộc tính (JSON: màu, size...) |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| SortOrder | int | 4 | NO | 0 | Thứ tự sắp xếp |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

**Foreign Keys:**
- FK_ProductVariants_Products_ProductId (CASCADE DELETE)

### 2.3. ProductImages (Bảng Hình Ảnh Sản Phẩm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| ImageUrl | nvarchar | 500 | NO | | URL hình ảnh |
| AltText | nvarchar | 200 | YES | | Văn bản thay thế |
| IsPrimary | bit | 1 | NO | 0 | Hình ảnh chính |
| SortOrder | int | 4 | NO | 0 | Thứ tự hiển thị |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 2.4. ProductReviews (Bảng Đánh Giá Sản Phẩm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| UserId | nvarchar | 450 | NO | | Khóa ngoại đến AspNetUsers |
| AdminId | nvarchar | 450 | YES | | Admin duyệt đánh giá |
| Rating | int | 4 | NO | | Điểm đánh giá (1-5) |
| ReviewText | nvarchar | 2000 | YES | | Nội dung đánh giá |
| IsApproved | bit | 1 | NO | 0 | Trạng thái duyệt |
| ApprovedAt | datetime2 | 7 | YES | | Thời gian duyệt |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

**Check Constraints:**
- CK_ProductReviews_Rating: Rating >= 1 AND Rating <= 5

### 2.5. Tags (Bảng Thẻ Tag)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Name | nvarchar | 100 | NO | | Tên tag |
| Slug | nvarchar | 100 | YES | | URL thân thiện |
| Description | nvarchar | 500 | YES | | Mô tả tag |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 2.6. ProductTags (Bảng Liên Kết Sản Phẩm - Tag)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| TagId | int | 4 | NO | | Khóa ngoại đến Tags |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

---

## 3. NHÓM QUẢN LÝ ĐỂN HÀNG (Order Management)

### 3.1. Orders (Bảng Đơn Hàng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| UserId | nvarchar | 450 | YES | | Khóa ngoại đến AspNetUsers |
| OrderDate | datetime2 | 7 | NO | GETUTCDATE() | Ngày đặt hàng |
| TotalAmount | decimal | 18,2 | NO | | Tổng tiền |
| SubtotalAmount | decimal | 18,2 | NO | 0 | Tiền hàng |
| TaxAmount | decimal | 18,2 | NO | 0 | Tiền thuế |
| ShippingAmount | decimal | 18,2 | NO | 0 | Phí vận chuyển |
| DiscountAmount | decimal | 18,2 | NO | 0 | Tiền giảm giá |
| Status | int | 4 | NO | 0 | Trạng thái đơn hàng (enum) |
| PaymentStatus | int | 4 | NO | 0 | Trạng thái thanh toán (enum) |
| ShippingAddress | nvarchar | 500 | NO | | Địa chỉ giao hàng |
| BillingAddress | nvarchar | 500 | YES | | Địa chỉ thanh toán |
| PhoneNumber | nvarchar | 20 | NO | | Số điện thoại |
| Email | nvarchar | 100 | NO | | Email liên hệ |
| CouponCode | nvarchar | 50 | YES | | Mã giảm giá sử dụng |
| PaymentMethod | nvarchar | 50 | YES | | Phương thức thanh toán |
| IsPaid | bit | 1 | NO | 0 | Trạng thái đã thanh toán |
| PaymentTransactionId | nvarchar | 100 | YES | | Mã giao dịch thanh toán |
| PaymentDate | datetime2 | 7 | YES | | Ngày thanh toán |
| TransactionId | nvarchar | 100 | YES | | Mã giao dịch |
| TrackingNumber | nvarchar | 100 | YES | | Mã vận đơn |
| ShippingMethod | nvarchar | 100 | YES | | Phương thức vận chuyển |
| ShippedDate | datetime2 | 7 | YES | | Ngày gửi hàng |
| DeliveredDate | datetime2 | 7 | YES | | Ngày giao hàng |
| EstimatedDeliveryDate | datetime2 | 7 | YES | | Ngày giao dự kiến |
| Notes | nvarchar | 1000 | YES | | Ghi chú |
| InternalNotes | nvarchar | 1000 | YES | | Ghi chú nội bộ |
| CustomerName | nvarchar | 200 | YES | | Tên khách hàng (guest order) |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian cập nhật |
| IsUrgent | bit | 1 | NO | 0 | Đơn hàng gấp |
| Priority | int | 4 | NO | 0 | Độ ưu tiên |

### 3.2. OrderItems (Bảng Chi Tiết Đơn Hàng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| OrderId | int | 4 | NO | | Khóa ngoại đến Orders |
| ProductId | int | 4 | YES | | Khóa ngoại đến Products |
| ServiceId | int | 4 | YES | | Khóa ngoại đến Services |
| ProductName | nvarchar | 200 | NO | | Tên sản phẩm tại thời điểm đặt |
| Quantity | int | 4 | NO | | Số lượng |
| UnitPrice | decimal | 18,2 | NO | | Đơn giá |
| Subtotal | decimal | 18,2 | NO | | Thành tiền |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 3.3. OrderStatusHistories (Bảng Lịch Sử Trạng Thái Đơn Hàng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| OrderId | int | 4 | NO | | Khóa ngoại đến Orders |
| OldStatus | int | 4 | NO | | Trạng thái cũ |
| NewStatus | int | 4 | NO | | Trạng thái mới |
| ChangedBy | nvarchar | 450 | YES | | Người thay đổi |
| ChangeReason | nvarchar | 500 | YES | | Lý do thay đổi |
| Notes | nvarchar | 1000 | YES | | Ghi chú |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian thay đổi |

### 3.4. ShoppingCarts (Bảng Giỏ Hàng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| UserId | nvarchar | 450 | NO | | Khóa ngoại đến AspNetUsers |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian cập nhật |

### 3.5. CartItems (Bảng Chi Tiết Giỏ Hàng)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ShoppingCartId | int | 4 | NO | | Khóa ngoại đến ShoppingCarts |
| ProductId | int | 4 | YES | | Khóa ngoại đến Products |
| ServiceId | int | 4 | YES | | Khóa ngoại đến Services |
| ItemName | nvarchar | max | NO | | Tên mặt hàng |
| ItemImageUrl | nvarchar | max | NO | | URL hình ảnh |
| Quantity | int | 4 | NO | | Số lượng |
| UnitPrice | decimal | 18,2 | NO | | Đơn giá |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian cập nhật |

---

## 4. NHÓM QUẢN LÝ KHO HÀNG (Inventory Management)

### 4.1. Suppliers (Bảng Nhà Cung Cấp)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Name | nvarchar | 200 | NO | | Tên nhà cung cấp |
| ContactPerson | nvarchar | 100 | NO | | Người liên hệ |
| Email | nvarchar | 100 | NO | | Email |
| PhoneNumber | nvarchar | 20 | NO | | Số điện thoại |
| Address | nvarchar | 500 | NO | | Địa chỉ |
| Website | nvarchar | max | NO | '' | Website |
| Description | nvarchar | 1000 | NO | '' | Mô tả |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

### 4.2. ProductSuppliers (Bảng Liên Kết Sản Phẩm - Nhà Cung Cấp)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| SupplierId | int | 4 | NO | | Khóa ngoại đến Suppliers |
| SupplierProductCode | nvarchar | 100 | YES | | Mã sản phẩm của nhà cung cấp |
| LeadTimeDays | int | 4 | NO | 0 | Thời gian giao hàng (ngày) |
| MinimumOrderQuantity | int | 4 | NO | 0 | Số lượng đặt tối thiểu |
| UnitCost | decimal | 18,2 | NO | 0 | Giá nhập |
| IsPreferred | bit | 1 | NO | 0 | Nhà cung cấp ưu tiên |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

### 4.3. InventoryTransactions (Bảng Giao Dịch Kho)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| ProductVariantId | int | 4 | YES | | Khóa ngoại đến ProductVariants |
| SupplierId | int | 4 | YES | | Khóa ngoại đến Suppliers |
| OrderId | int | 4 | YES | | Khóa ngoại đến Orders |
| TransactionType | int | 4 | NO | | Loại giao dịch (enum) |
| Quantity | int | 4 | NO | | Số lượng (+/-) |
| UnitPrice | decimal | 18,2 | NO | 0 | Đơn giá |
| TotalCost | decimal | 18,2 | NO | 0 | Tổng chi phí |
| ReferenceNumber | nvarchar | 100 | YES | | Số tham chiếu |
| TransactionDate | datetime2 | 7 | NO | GETUTCDATE() | Ngày giao dịch |
| Notes | nvarchar | 500 | YES | | Ghi chú |
| CreatedBy | nvarchar | 100 | YES | | Người tạo |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| BatchNumber | nvarchar | 50 | YES | | Số lô |
| ExpiryDate | datetime2 | 7 | YES | | Ngày hết hạn |
| Location | nvarchar | 100 | YES | | Vị trí kho |

**Indexes:**
- IX_InventoryTransactions_ProductId
- IX_InventoryTransactions_TransactionDate
- IX_InventoryTransactions_TransactionType

### 4.4. CustomerSearchStatistics (Bảng Thống Kê Tìm Kiếm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| UserId | nvarchar | 450 | YES | | Khóa ngoại đến AspNetUsers |
| SearchTerm | nvarchar | 200 | NO | | Từ khóa tìm kiếm |
| SearchDate | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tìm kiếm |
| ResultsCount | int | 4 | NO | 0 | Số kết quả trả về |
| ClickedProductId | int | 4 | YES | | Sản phẩm được click |
| ClickedAt | datetime2 | 7 | YES | | Thời gian click |
| SearchSource | nvarchar | 50 | YES | | Nguồn tìm kiếm |
| UserAgent | nvarchar | 500 | YES | | Thông tin trình duyệt |
| IpAddress | nvarchar | 45 | YES | | Địa chỉ IP |
| SessionId | nvarchar | 100 | YES | | ID phiên |

---

## 5. NHÓM QUẢN LÝ MÃ GIẢM GIÁ (Coupon Management)

### 5.1. Coupons (Bảng Mã Giảm Giá)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Code | nvarchar | 50 | NO | | Mã giảm giá |
| Name | nvarchar | 200 | NO | | Tên chương trình |
| Description | nvarchar | 500 | NO | '' | Mô tả |
| Type | int | 4 | NO | 0 | Loại giảm giá (enum) |
| Value | decimal | 18,2 | NO | | Giá trị giảm |
| MinimumOrderAmount | decimal | 18,2 | NO | 0 | Giá trị đơn hàng tối thiểu |
| MaximumDiscountAmount | decimal | 18,2 | NO | 0 | Giảm tối đa |
| StartDate | datetime2 | 7 | NO | GETUTCDATE() | Ngày bắt đầu |
| EndDate | datetime2 | 7 | NO | | Ngày kết thúc |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| UsageLimit | int | 4 | NO | 0 | Giới hạn sử dụng |
| CurrentUsageCount | int | 4 | NO | 0 | Số lần đã sử dụng |
| UsageLimitPerCustomer | int | 4 | NO | 1 | Giới hạn/khách hàng |
| ApplicationType | int | 4 | NO | 0 | Kiểu áp dụng (enum) |
| ApplicationValue | nvarchar | 500 | YES | | Giá trị áp dụng |
| IsFirstOrderOnly | bit | 1 | NO | 0 | Chỉ đơn đầu tiên |
| RequiresEmail | bit | 1 | NO | 0 | Yêu cầu email |
| IsPublic | bit | 1 | NO | 1 | Hiển thị công khai |
| CreatedBy | nvarchar | 200 | YES | | Người tạo |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |
| CanStackWithOthers | bit | 1 | NO | 0 | Kết hợp với mã khác |
| AutoApply | bit | 1 | NO | 0 | Tự động áp dụng |
| AutoApplyPriority | int | 4 | NO | 0 | Độ ưu tiên tự động |

**Indexes:**
- IX_Coupons_Code (UNIQUE)
- IX_Coupons_StartDate_EndDate
- IX_Coupons_IsActive

### 5.2. CouponUsageHistory (Bảng Lịch Sử Sử Dụng Mã Giảm Giá)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| CouponId | int | 4 | NO | | Khóa ngoại đến Coupons |
| OrderId | int | 4 | NO | | Khóa ngoại đến Orders |
| UserId | nvarchar | 450 | YES | | Khóa ngoại đến AspNetUsers |
| DiscountAmount | decimal | 18,2 | NO | | Số tiền được giảm |
| OrderTotal | decimal | 18,2 | NO | | Tổng giá trị đơn hàng |
| UsedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian sử dụng |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 5.3. CouponProducts (Bảng Áp Dụng Mã Cho Sản Phẩm)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| CouponId | int | 4 | NO | | Khóa ngoại đến Coupons |
| ProductId | int | 4 | NO | | Khóa ngoại đến Products |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 5.4. CouponCategories (Bảng Áp Dụng Mã Cho Danh Mục)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| CouponId | int | 4 | NO | | Khóa ngoại đến Coupons |
| Category | int | 4 | NO | | Danh mục sản phẩm (enum) |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

---

## 6. NHÓM QUẢN LÝ DỊCH VỤ & SỰ KIỆN (Service & Event Management)

### 6.1. Services (Bảng Dịch Vụ)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Name | nvarchar | max | NO | | Tên dịch vụ |
| Description | nvarchar | max | NO | | Mô tả dịch vụ |
| ImageUrl | nvarchar | max | YES | | URL hình ảnh |
| Price | decimal | 18,2 | NO | | Giá dịch vụ |
| Type | int | 4 | NO | 0 | Loại dịch vụ (enum) |
| Features | nvarchar | max | YES | | Tính năng (JSON) |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

### 6.2. ServiceSchedules (Bảng Lịch Dịch Vụ)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| ServiceId | int | 4 | NO | | Khóa ngoại đến Services |
| ScheduleDate | datetime2 | 7 | NO | | Ngày lịch |
| StartTime | time | 7 | NO | | Giờ bắt đầu |
| EndTime | time | 7 | NO | | Giờ kết thúc |
| MaxParticipants | int | 4 | NO | 0 | Số người tối đa |
| CurrentParticipants | int | 4 | NO | 0 | Số người hiện tại |
| Location | nvarchar | max | YES | | Địa điểm |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

### 6.3. Events (Bảng Sự Kiện)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Title | nvarchar | max | NO | | Tiêu đề sự kiện |
| Description | nvarchar | max | NO | | Mô tả sự kiện |
| ImageUrl | nvarchar | max | YES | | URL hình ảnh |
| EventDate | datetime2 | 7 | NO | | Ngày sự kiện |
| Location | nvarchar | max | NO | | Địa điểm |
| OrganizedBy | nvarchar | max | NO | | Người tổ chức |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |
| RegistrationLink | nvarchar | max | YES | | Link đăng ký |
| IsFeatured | bit | 1 | NO | 0 | Sự kiện nổi bật |
| StartTime | time | 7 | YES | | Giờ bắt đầu |
| EndTime | time | 7 | YES | | Giờ kết thúc |
| Capacity | int | 4 | YES | | Sức chứa |

### 6.4. Articles (Bảng Bài Viết)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Title | nvarchar | max | NO | | Tiêu đề bài viết |
| Content | nvarchar | max | NO | | Nội dung |
| Summary | nvarchar | max | YES | | Tóm tắt |
| ImageUrl | nvarchar | max | YES | | URL hình ảnh |
| AuthorId | nvarchar | 450 | NO | | Khóa ngoại đến AspNetUsers |
| Category | nvarchar | max | YES | | Danh mục |
| Tags | nvarchar | max | YES | | Thẻ tag |
| IsPublished | bit | 1 | NO | 0 | Trạng thái xuất bản |
| PublishedAt | datetime2 | 7 | YES | | Thời gian xuất bản |
| ViewCount | int | 4 | NO | 0 | Số lượt xem |
| LikeCount | int | 4 | NO | 0 | Số lượt thích |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

### 6.5. FAQs (Bảng Câu Hỏi Thường Gặp)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Question | nvarchar | max | NO | | Câu hỏi |
| Answer | nvarchar | max | NO | | Câu trả lời |
| Category | nvarchar | max | YES | | Danh mục |
| SortOrder | int | 4 | NO | 0 | Thứ tự hiển thị |
| IsActive | bit | 1 | NO | 1 | Trạng thái hoạt động |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |
| UpdatedAt | datetime2 | 7 | YES | | Thời gian cập nhật |

### 6.6. ContactMessages (Bảng Tin Nhắn Liên Hệ)
| Cột | Kiểu Dữ Liệu | Độ Dài | Null? | Mặc Định | Mô Tả |
|-----|-------------|---------|-------|----------|-------|
| Id | int | 4 | NO | IDENTITY(1,1) | Khóa chính |
| Name | nvarchar | max | NO | | Tên người gửi |
| Email | nvarchar | max | NO | | Email người gửi |
| PhoneNumber | nvarchar | max | YES | | Số điện thoại |
| Subject | nvarchar | max | NO | | Chủ đề |
| Message | nvarchar | max | NO | | Nội dung tin nhắn |
| IsRead | bit | 1 | NO | 0 | Trạng thái đã đọc |
| IsReplied | bit | 1 | NO | 0 | Trạng thái đã trả lời |
| RepliedAt | datetime2 | 7 | YES | | Thời gian trả lời |
| RepliedBy | nvarchar | 450 | YES | | Người trả lời |
| CreatedAt | datetime2 | 7 | NO | GETUTCDATE() | Thời gian tạo |

---

## 7. CÁC ENUM VÀ RÀNG BUỘC

### 7.1. Enums Chính
```csharp
// Product Category
public enum ProductCategory {
    Sportswear = 0,
    Supplements = 1,
    Equipment = 2,
    Accessories = 3,
    Nutrition = 4
}

// Product Status
public enum ProductStatus {
    Active = 0,
    Inactive = 1,
    OutOfStock = 2,
    Discontinued = 3
}

// Order Status
public enum OrderStatus {
    Pending = 0,
    AwaitingPayment = 1,
    Paid = 2,
    Processing = 3,
    AwaitingFulfillment = 4,
    Shipped = 5,
    PartiallyShipped = 6,
    Delivered = 7,
    Completed = 8,
    Cancelled = 9,
    Refunded = 10,
    ReturnRequested = 11,
    ReturnProcessed = 12,
    Failed = 13,
    OnHold = 14
}

// Payment Status
public enum PaymentStatus {
    Pending = 0,
    Paid = 1,
    PartiallyPaid = 2,
    Refunded = 3,
    PartiallyRefunded = 4,
    Failed = 5,
    Cancelled = 6
}

// Inventory Transaction Type
public enum InventoryTransactionType {
    Purchase = 0,
    Sale = 1,
    Return = 2,
    Adjustment = 3,
    Transfer = 4,
    Damaged = 5,
    Expired = 6,
    Promotion = 7
}

// Coupon Type
public enum CouponType {
    Percentage = 0,
    FixedAmount = 1,
    FreeShipping = 2,
    BuyOneGetOne = 3,
    FixedPriceDiscount = 4
}

// Service Type
public enum ServiceType {
    Calisthenics = 0,
    Strength = 1,
    Yoga = 2
}
```

### 7.2. Ràng Buộc Database
- **Check Constraints**: Rating (1-5), Price > 0, Quantity >= 0
- **Unique Constraints**: Email, UserName, Coupon Code, Product SKU
- **Foreign Key Constraints**: Cascade/Restrict tùy theo logic business
- **Default Values**: CreatedAt = GETUTCDATE(), IsActive = 1

### 7.3. Indexes Quan Trọng
- **Performance**: ProductId, UserId, OrderDate, Category
- **Unique**: SKU, Email, CouponCode
- **Composite**: (StartDate, EndDate), (ProductId, UserId)

---

## 8. THỐNG KÊ TỔNG QUAN

| Thông Số | Giá Trị |
|-----------|---------|
| **Tổng số bảng** | 32 bảng |
| **Bảng Identity** | 8 bảng |
| **Bảng Business Logic** | 24 bảng |
| **Tổng số cột** | 400+ cột |
| **Foreign Keys** | 45+ mối quan hệ |
| **Indexes** | 60+ indexes |
| **Check Constraints** | 15+ ràng buộc |
| **Enums** | 8 enums chính |

Hệ thống được thiết kế với độ chuẩn hóa cao, hỗ trợ đầy đủ các tính năng e-commerce hiện đại và có khả năng mở rộng tốt.
