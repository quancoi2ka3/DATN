# PHÂN TÍCH CHI TIẾT CƠ SỞ DỮ LIỆU SUN MOVEMENT

## 1. TỔNG QUAN KIẾN TRÚC

### Hệ thống Authentication
- **Base**: Microsoft Identity Framework
- **User Entity**: ApplicationUser (kế thừa IdentityUser)
- **Tables**: AspNetUsers, AspNetRoles, AspNetUserRoles, etc.

### Số lượng bảng chính: 24 bảng cốt lõi

---

## 2. PHÂN LOẠI CÁC BẢNG THEO CHỨC NĂNG

### A. QUẢN LÝ NGƯỜI DÙNG & XÁC THỰC (4 bảng)
1. **ApplicationUser** (NguoiDung)
2. **OtpVerification** (XacThucOTP)
3. **PendingUserRegistration** (DangKyChoXuLy)
4. **CustomerSearchStatistic** (ThongKeTuKhoa)

### B. QUẢN LÝ SẢN PHẨM & DỊCH VỤ (8 bảng)
1. **Product** (SanPham)
2. **ProductImage** (HinhAnhSanPham)
3. **ProductVariant** (PhienBanSanPham)
4. **ProductVariantImage** (HinhAnhPhienBan)
5. **ProductReview** (DanhGiaSanPham)
6. **Tag** (NhanSanPham)
7. **ProductTag** (SanPham_Nhan)
8. **Service** (DichVu)
9. **ServiceSchedule** (LichTrinhDichVu)

### C. QUẢN LÝ ĐỨN HÀNG & GIỎ HÀNG (5 bảng)
1. **Order** (DonHang)
2. **OrderItem** (ChiTietDonHang)
3. **OrderStatusHistory** (LichSuTrangThai)
4. **ShoppingCart** (GioHang)
5. **CartItem** (ChiTietGioHang)

### D. HỆ THỐNG KHUYẾN MÃI & GIẢM GIÁ (4 bảng)
1. **Coupon** (PhieuGiamGia)
2. **CouponProduct** (PhieuGiamGia_SanPham)
3. **CouponCategory** (PhieuGiamGia_DanhMuc)
4. **CouponUsageHistory** (LichSuSuDung)

### E. QUẢN LÝ KHO & NHÀ CUNG CẤP (3 bảng)
1. **Supplier** (NhaCungCap)
2. **ProductSupplier** (SanPham_NhaCungCap)
3. **InventoryTransaction** (GiaoDichKho)

### F. HỆ THỐNG PHÂN TÍCH & ĐỀ XUẤT (2 bảng)
1. **UserInteraction** (TuongTacNguoiDung)
2. **ProductRecommendation** (DeXuatSanPham)

### G. HỖ TRỢ & NỘI DUNG (4 bảng)
1. **ContactMessage** (TinNhanLienHe)
2. **FAQ** (CauHoiThuongGap)
3. **Event** (SuKien)
4. **Article** (BaiViet)

---

## 3. CHI TIẾT CÁC BẢNG CỐT LÕI

### 3.1. ApplicationUser (NguoiDung)
**Mục đích**: Quản lý thông tin người dùng, kế thừa IdentityUser

**Thuộc tính chính**:
- `Id` (string, PK) - Khóa chính
- `Email` (string, UK) - Email đăng nhập
- `UserName` (string, UK) - Tên đăng nhập
- `FirstName` (string) - Họ
- `LastName` (string) - Tên
- `PhoneNumber` (string) - Số điện thoại
- `DateOfBirth` (DateTime?) - Ngày sinh
- `Address` (string?) - Địa chỉ
- `CreatedAt` (DateTime) - Ngày tạo
- `LastLogin` (DateTime?) - Lần đăng nhập cuối
- `IsActive` (bool) - Trạng thái hoạt động

**Navigation Properties**:
- `Orders` (1:n) - Danh sách đơn hàng
- `UserInteractions` (1:n) - Tương tác với sản phẩm
- `Recommendations` (1:n) - Đề xuất cho người dùng

**Relationships**:
- 1:n với Order (Aggregation)
- 1:1 với ShoppingCart (Composition)
- 1:n với ProductReview (Aggregation)
- 1:n với UserInteraction (Composition)

### 3.2. Product (SanPham)
**Mục đích**: Quản lý thông tin sản phẩm

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `Name` (string) - Tên sản phẩm
- `Description` (string) - Mô tả
- `Price` (decimal(18,2)) - Giá bán
- `DiscountPrice` (decimal(18,2)?) - Giá giảm
- `CostPrice` (decimal(18,2)) - Giá vốn
- `Sku` (string?, UK) - Mã sản phẩm
- `Slug` (string?, UK) - URL thân thiện
- `Category` (ProductCategory) - Danh mục
- `SubCategory` (string) - Danh mục con
- `StockQuantity` (int) - Số lượng tồn kho
- `Weight` (decimal(18,3)?) - Khối lượng
- `AverageRating` (decimal(3,2)) - Điểm đánh giá TB
- `TotalReviews` (int) - Tổng số đánh giá
- `IsActive` (bool) - Trạng thái hoạt động
- `Status` (ProductStatus) - Trạng thái sản phẩm
- `MinimumStockLevel` (int) - Ngưỡng tồn kho tối thiểu

**Navigation Properties**:
- `Images` (1:n) - Hình ảnh sản phẩm
- `Variants` (1:n) - Phiên bản sản phẩm
- `Reviews` (1:n) - Đánh giá
- `OrderItems` (1:n) - Chi tiết đơn hàng
- `UserInteractions` (1:n) - Tương tác người dùng
- `ProductTags` (n:m) - Tags
- `ProductSuppliers` (n:m) - Nhà cung cấp
- `InventoryTransactions` (1:n) - Giao dịch kho

**Enums**:
```csharp
ProductCategory { Sportswear, Supplements, Equipment, Accessories, Nutrition }
ProductStatus { Active, Inactive, OutOfStock, Discontinued }
```

### 3.3. Order (DonHang)
**Mục đích**: Quản lý đơn hàng

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `UserId` (string?, FK) - ID người dùng
- `OrderNumber` (string) - Mã đơn hàng
- `OrderDate` (DateTime) - Ngày đặt hàng
- `TotalAmount` (decimal(18,2)) - Tổng tiền
- `SubtotalAmount` (decimal(18,2)) - Tiền hàng
- `ShippingCost` (decimal(18,2)) - Phí vận chuyển
- `DiscountAmount` (decimal(18,2)) - Tiền giảm giá
- `TaxAmount` (decimal(18,2)) - Thuế
- `Status` (OrderStatus) - Trạng thái đơn hàng
- `PaymentStatus` (PaymentStatus) - Trạng thái thanh toán
- `PaymentMethod` (string?) - Phương thức thanh toán
- `ShippingAddress` (string) - Địa chỉ giao hàng
- `BillingAddress` (string?) - Địa chỉ thanh toán
- `ShippedDate` (DateTime?) - Ngày giao hàng
- `DeliveredDate` (DateTime?) - Ngày nhận hàng

**Navigation Properties**:
- `User` (n:1) - Người dùng
- `Items` (1:n) - Chi tiết đơn hàng
- `StatusHistory` (1:n) - Lịch sử trạng thái

**Enums**:
```csharp
OrderStatus { 
  Pending, AwaitingPayment, Paid, Processing, 
  AwaitingFulfillment, Shipped, PartiallyShipped, 
  Delivered, Completed, Cancelled, Refunded, 
  ReturnRequested, ReturnProcessed, Failed, OnHold 
}

PaymentStatus { 
  Pending, Paid, PartiallyPaid, Refunded, 
  PartiallyRefunded, Failed, Cancelled 
}
```

### 3.4. OrderItem (ChiTietDonHang)
**Mục đích**: Chi tiết sản phẩm trong đơn hàng

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `OrderId` (int, FK) - ID đơn hàng
- `ProductId` (int, FK) - ID sản phẩm
- `ProductVariantId` (int?, FK) - ID phiên bản sản phẩm
- `Quantity` (int) - Số lượng
- `UnitPrice` (decimal(18,2)) - Đơn giá
- `Subtotal` (decimal(18,2)) - Thành tiền
- `DiscountAmount` (decimal(18,2)) - Tiền giảm giá

**Relationships**:
- n:1 với Order (Composition)
- n:1 với Product (Association)
- n:1 với ProductVariant (Association)

### 3.5. ShoppingCart (GioHang)
**Mục đích**: Quản lý giỏ hàng người dùng

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `UserId` (string, FK) - ID người dùng
- `CreatedAt` (DateTime) - Ngày tạo
- `UpdatedAt` (DateTime) - Ngày cập nhật

**Navigation Properties**:
- `User` (1:1) - Người dùng
- `Items` (1:n) - Chi tiết giỏ hàng

### 3.6. CartItem (ChiTietGioHang)
**Mục đích**: Chi tiết sản phẩm trong giỏ hàng

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `ShoppingCartId` (int, FK) - ID giỏ hàng
- `ProductId` (int?, FK) - ID sản phẩm
- `ServiceId` (int?, FK) - ID dịch vụ
- `ProductVariantId` (int?, FK) - ID phiên bản
- `Quantity` (int) - Số lượng
- `UnitPrice` (decimal(18,2)) - Đơn giá
- `AddedAt` (DateTime) - Ngày thêm

### 3.7. Service (DichVu)
**Mục đích**: Quản lý dịch vụ

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `Name` (string) - Tên dịch vụ
- `Description` (string?) - Mô tả
- `Price` (decimal(18,2)) - Giá dịch vụ
- `Duration` (int) - Thời gian (phút)
- `Category` (string) - Danh mục
- `IsActive` (bool) - Trạng thái hoạt động

**Navigation Properties**:
- `Schedules` (1:n) - Lịch trình dịch vụ

### 3.8. UserInteraction (TuongTacNguoiDung)
**Mục đích**: Theo dõi hành vi người dùng để đề xuất sản phẩm

**Thuộc tính chính**:
- `Id` (int, PK) - Khóa chính
- `UserId` (string, FK) - ID người dùng
- `ProductId` (int, FK) - ID sản phẩm
- `InteractionType` (UserInteractionType) - Loại tương tác
- `ViewTimeSeconds` (int?) - Thời gian xem (giây)
- `CreatedAt` (DateTime) - Thời gian tương tác
- `IpAddress` (string?) - Địa chỉ IP
- `UserAgent` (string?) - Thông tin trình duyệt

**Enums**:
```csharp
UserInteractionType { 
  View, AddToCart, RemoveFromCart, Purchase, 
  Review, Share, Wishlist, Compare 
}
```

---

## 4. QUAN HỆ GIỮA CÁC BẢNG

### 4.1. Composition Relationships (◆——)
- `ApplicationUser` *-- `ShoppingCart` (1:1)
- `ShoppingCart` *-- `CartItem` (1:n)
- `Order` *-- `OrderItem` (1:n)
- `Order` *-- `OrderStatusHistory` (1:n)
- `Product` *-- `ProductImage` (1:n)
- `Product` *-- `ProductVariant` (1:n)
- `ProductVariant` *-- `ProductVariantImage` (1:n)
- `Product` *-- `UserInteraction` (1:n)
- `ApplicationUser` *-- `UserInteraction` (1:n)

### 4.2. Aggregation Relationships (◇——)
- `ApplicationUser` o-- `Order` (1:n)
- `ApplicationUser` o-- `ProductReview` (1:n)
- `Product` o-- `OrderItem` (1:n)
- `Product` o-- `CartItem` (1:n)
- `Product` o-- `ProductReview` (1:n)
- `Service` o-- `CartItem` (1:n)

### 4.3. Many-to-Many Relationships (n:m)
- `Product` <--> `Tag` (qua ProductTag)
- `Product` <--> `Supplier` (qua ProductSupplier)
- `Coupon` <--> `Product` (qua CouponProduct)

### 4.4. Association Relationships (——)
- `ProductReview` -- `ApplicationUser` (admin approver)
- `InventoryTransaction` -- `Supplier`
- `InventoryTransaction` -- `Product`

---

## 5. INDEXES VÀ CONSTRAINTS

### 5.1. Unique Indexes
- `ApplicationUser.Email`
- `ApplicationUser.UserName`
- `Product.Sku`
- `Product.Slug`
- `Coupon.Code`
- `Tag.Name`
- `Tag.Slug`

### 5.2. Performance Indexes
- `Product.Category`
- `Product.IsActive`
- `ProductReview.ProductId`
- `ProductReview.UserId`
- `ProductReview.IsApproved`
- `ProductReview.CreatedAt`
- `InventoryTransaction.TransactionDate`
- `InventoryTransaction.ProductId`
- `UserInteraction.UserId`
- `UserInteraction.ProductId`
- `UserInteraction.CreatedAt`

### 5.3. Composite Indexes
- `Coupon(StartDate, EndDate)`
- `Order(UserId, OrderDate)`
- `UserInteraction(UserId, ProductId, CreatedAt)`

---

## 6. DATA TYPES VÀ CONSTRAINTS

### 6.1. Decimal Fields
- `decimal(18,2)`: Price, TotalAmount, UnitPrice, Subtotal
- `decimal(18,3)`: Weight
- `decimal(3,2)`: AverageRating

### 6.2. String Length Constraints
- `nvarchar(450)`: UserId, Email (for indexing)
- `nvarchar(256)`: UserName
- `nvarchar(200)`: Product.Name
- `nvarchar(2000)`: Product.Description
- `nvarchar(50)`: Sku, Barcode
- `nvarchar(100)`: SubCategory
- `nvarchar(max)`: Address, Notes, Comments

### 6.3. Required Fields
- `ApplicationUser`: Email, FirstName, LastName
- `Product`: Name, Description, Price, CostPrice
- `Order`: TotalAmount, ShippingAddress
- `OrderItem`: Quantity, UnitPrice, Subtotal

---

## 7. BUSINESS LOGIC VÀ RULES

### 7.1. Inventory Management
- `Product.StockQuantity >= 0`
- `Product.MinimumStockLevel > 0`
- Auto-update stock when order completed
- Low stock alerts when `StockQuantity <= MinimumStockLevel`

### 7.2. Pricing Rules
- `Product.Price > 0`
- `Product.DiscountPrice < Product.Price` (nếu có)
- `OrderItem.Subtotal = Quantity * UnitPrice`
- `Order.TotalAmount = Sum(OrderItems.Subtotal) + ShippingCost + TaxAmount - DiscountAmount`

### 7.3. Order Workflow
1. Pending → AwaitingPayment
2. AwaitingPayment → Paid
3. Paid → Processing
4. Processing → Shipped
5. Shipped → Delivered
6. Delivered → Completed

### 7.4. User Interaction Tracking
- Track all user interactions for recommendation
- Clean up old interactions (> 1 year)
- Calculate recommendation scores based on interaction weights

---

## 8. KẾT LUẬN

### Điểm mạnh của thiết kế:
1. **Tách biệt rõ ràng**: Mỗi bảng có trách nhiệm cụ thể
2. **Linh hoạt**: Hỗ trợ nhiều loại sản phẩm, dịch vụ, thanh toán
3. **Khả năng mở rộng**: Dễ dàng thêm tính năng mới
4. **Performance**: Có đủ indexes cần thiết
5. **Data integrity**: Constraints và relationships đầy đủ

### Các bảng cốt lõi nhất để vẽ sơ đồ:
1. **ApplicationUser** - Trung tâm của hệ thống
2. **Product** - Thực thể chính của e-commerce
3. **Order & OrderItem** - Quy trình nghiệp vụ chính
4. **ShoppingCart & CartItem** - Tương tác người dùng
5. **UserInteraction** - Phân tích hành vi
6. **ProductReview** - Tương tác và feedback
7. **Service** - Dịch vụ bổ sung

Các bảng này đủ để thể hiện toàn bộ luồng nghiệp vụ chính của hệ thống e-commerce Sun Movement.
