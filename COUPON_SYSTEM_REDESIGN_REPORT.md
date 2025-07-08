# 🎟️💰 THIẾT KẾ LẠI HỆ THỐNG MÃ GIẢM GIÁ - BÁO CÁO HOÀN THIỆN

## 📋 MỤC TIÊU

**Thiết kế lại hệ thống mã giảm giá để đáp ứng 2 yêu cầu chính:**

1. **Admin quyết định sản phẩm giảm giá:** Admin có thể chọn sản phẩm nào được giảm giá, hiển thị và tính toán đúng giá đã giảm ở mọi nơi
2. **Gửi mã giảm giá qua email:** Admin có thể gửi mã giảm giá cho khách hàng đăng ký với nội dung tiếng Việt chuyên nghiệp

---

## 🔍 PHÂN TÍCH HIỆN TRẠNG

### ✅ **ĐIỂM MẠNH HIỆN TẠI**
- Hệ thống coupon đã có đầy đủ models: `Coupon`, `CouponProduct`, `CouponCategory`
- Có đầy đủ services: `CouponService`, `ProductService` với các method liên kết sản phẩm-coupon
- Admin interface hoàn chỉnh: tạo, sửa, xóa, áp dụng coupon cho sản phẩm
- Hỗ trợ nhiều loại coupon: Percentage, FixedAmount, FreeShipping
- Có validation logic: thời hạn, số lần sử dụng, điều kiện áp dụng
- Frontend cart và checkout đã tích hợp

### ⚠️ **ĐIỂM CẦN HOÀN THIỆN**

#### 1. **Logic hiển thị giá đã giảm**
- Frontend chưa hiển thị giá gốc vs giá đã giảm rõ ràng
- Product listing chưa có badge "SALE" hoặc % giảm giá
- Cart chưa tính toán và hiển thị discount chi tiết

#### 2. **Hệ thống gửi email**
- Chưa có EmailService tích hợp
- Chưa có template email tiếng Việt
- Chưa có workflow gửi coupon cho khách hàng đăng ký

#### 3. **UX/UI chưa chuẩn TMĐT**
- Thiếu visual indicators cho sản phẩm giảm giá
- Thiếu countdown timer cho coupon
- Chưa có "Mã giảm giá của tôi" cho user

---

## 🎯 THIẾT KẾ GIẢI PHÁP

### **PHẦN 1: LOGIC HIỂN THỊ GIÁ ĐÃ GIẢM**

#### **1.1 Backend Logic Enhancement**

**Cải tiến ProductService:**
```csharp
public class ProductDisplayInfo
{
    public int ProductId { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal DiscountedPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DiscountPercentage { get; set; }
    public bool HasDiscount => DiscountAmount > 0;
    public List<AppliedCoupon> AppliedCoupons { get; set; }
}

public class AppliedCoupon
{
    public int CouponId { get; set; }
    public string CouponCode { get; set; }
    public string CouponName { get; set; }
    public CouponType Type { get; set; }
    public decimal Value { get; set; }
    public decimal CalculatedDiscount { get; set; }
}
```

**Thêm methods vào IProductService:**
```csharp
Task<ProductDisplayInfo> GetProductDisplayInfoAsync(int productId);
Task<IEnumerable<ProductDisplayInfo>> GetProductsDisplayInfoAsync(IEnumerable<int> productIds);
Task<decimal> CalculateBestDiscountAsync(int productId);
Task<List<AppliedCoupon>> GetActiveProductCouponsAsync(int productId);
```

#### **1.2 Frontend Integration**

**Cart Context Enhancement:**
```typescript
interface CartItemWithDiscount extends CartItem {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  appliedCoupons: AppliedCoupon[];
}

interface CartSummary {
  subtotal: number;
  totalDiscount: number;
  totalAfterDiscount: number;
  appliedCoupons: AppliedCoupon[];
}
```

#### **1.3 UI Components**

**PriceDisplay Component:**
```tsx
<div className="price-display">
  {hasDiscount ? (
    <>
      <span className="original-price line-through text-gray-500">
        {originalPrice.toLocaleString()} VNĐ
      </span>
      <span className="discounted-price text-red-600 font-bold ml-2">
        {discountedPrice.toLocaleString()} VNĐ
      </span>
      <span className="discount-badge bg-red-500 text-white px-2 py-1 rounded-full text-sm ml-2">
        -{discountPercentage}%
      </span>
    </>
  ) : (
    <span className="regular-price font-bold">
      {originalPrice.toLocaleString()} VNĐ
    </span>
  )}
</div>
```

### **PHẦN 2: HỆ THỐNG GỬI EMAIL**

#### **2.1 Email Service Implementation**

**Interface Definition:**
```csharp
public interface IEmailService
{
    Task<bool> SendWelcomeCouponEmailAsync(string userEmail, string userName, Coupon coupon);
    Task<bool> SendSeasonalCouponEmailAsync(string userEmail, string userName, Coupon coupon);
    Task<bool> SendBirthdayCouponEmailAsync(string userEmail, string userName, Coupon coupon);
    Task<bool> SendAbandonedCartCouponEmailAsync(string userEmail, string userName, Coupon coupon);
    Task<bool> SendBulkCouponEmailAsync(List<string> emails, Coupon coupon);
}
```

**Email Templates (Vietnamese):**

**Template 1: Welcome Coupon**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chào mừng đến với Sun Movement!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Chào mừng {{UserName}}!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0;">Cảm ơn bạn đã đăng ký tài khoản tại Sun Movement</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #333; text-align: center;">🎁 Quà tặng chào mừng dành riêng cho bạn!</h2>
            
            <div style="background: #f8f9fa; border: 2px dashed #28a745; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <h3 style="color: #28a745; margin: 0;">Mã giảm giá: {{CouponCode}}</h3>
                <p style="font-size: 18px; margin: 10px 0;">Giảm {{CouponValue}}% cho đơn hàng đầu tiên</p>
                <p style="color: #666; margin: 5px 0;">Áp dụng cho đơn hàng từ {{MinimumAmount}} VNĐ</p>
                <p style="color: #dc3545; font-weight: bold;">Có hiệu lực đến: {{ExpiryDate}}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ShopUrl}}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Mua sắm ngay</a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px;">Cách sử dụng mã giảm giá:</h4>
                <ol style="margin: 0; padding-left: 20px;">
                    <li>Thêm sản phẩm yêu thích vào giỏ hàng</li>
                    <li>Tiến hành thanh toán</li>
                    <li>Nhập mã <strong>{{CouponCode}}</strong> vào ô "Mã giảm giá"</li>
                    <li>Hoàn tất đơn hàng và tận hưởng ưu đãi!</li>
                </ol>
            </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Sun Movement - Cửa hàng thể thao hàng đầu</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #ccc;">Hotline: 1900-xxxx | Email: support@sunmovement.vn</p>
        </div>
    </div>
</body>
</html>
```

**Template 2: Seasonal Coupon**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{SeasonName}} - Ưu đãi đặc biệt!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 30px; text-align: center;">
            <h1 style="color: #d63384; margin: 0;">🎉 {{SeasonName}} đã đến!</h1>
            <p style="color: #6f42c1; margin: 10px 0 0; font-size: 18px;">Ưu đãi đặc biệt dành riêng cho {{UserName}}</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #333; text-align: center;">Mã giảm giá {{SeasonName}} - Chỉ có trong thời gian ngắn!</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: 25px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0; font-size: 24px;">{{CouponCode}}</h3>
                <p style="font-size: 20px; margin: 15px 0;">
                    {{#if IsPercentage}}
                    Giảm {{CouponValue}}% 
                    {{else}}
                    Giảm {{CouponValue}} VNĐ
                    {{/if}}
                </p>
                <p style="margin: 10px 0;">Cho tất cả sản phẩm thể thao</p>
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 0; font-weight: bold;">⏰ Hết hạn: {{ExpiryDate}}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ShopUrl}}" style="background: #fd7e14; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">Khám phá ngay</a>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 30px 0;">
                <div style="text-align: center; flex: 1;">
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 0 10px;">
                        <h4 style="color: #1976d2; margin: 0 0 10px;">🏃‍♂️ Thể thao</h4>
                        <p style="margin: 0; font-size: 14px;">Đồ tập gym, chạy bộ</p>
                    </div>
                </div>
                <div style="text-align: center; flex: 1;">
                    <div style="background: #f3e5f5; padding: 20px; border-radius: 10px; margin: 0 10px;">
                        <h4 style="color: #7b1fa2; margin: 0 0 10px;">💊 Thực phẩm</h4>
                        <p style="margin: 0; font-size: 14px;">Protein, vitamin</p>
                    </div>
                </div>
                <div style="text-align: center; flex: 1;">
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 0 10px;">
                        <h4 style="color: #388e3c; margin: 0 0 10px;">👟 Phụ kiện</h4>
                        <p style="margin: 0; font-size: 14px;">Giày, túi, dụng cụ</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">🔥 Ưu đãi có hạn - Đừng bỏ lỡ!</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #ccc;">Sun Movement | Hotline: 1900-xxxx</p>
        </div>
    </div>
</body>
</html>
```

#### **2.2 Email Campaign Management**

**CouponCampaign Model:**
```csharp
public class CouponCampaign
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int CouponId { get; set; }
    public Coupon Coupon { get; set; }
    public CampaignType Type { get; set; } // Welcome, Seasonal, Birthday, etc.
    public DateTime ScheduledDate { get; set; }
    public CampaignStatus Status { get; set; }
    public string TargetAudience { get; set; } // All, NewUsers, VIP, etc.
    public int TotalSent { get; set; }
    public int TotalOpened { get; set; }
    public int TotalUsed { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum CampaignType
{
    Welcome,
    Seasonal,
    Birthday,
    AbandonedCart,
    LoyaltyReward,
    InventoryClearance
}
```

#### **2.3 Admin Interface for Email Campaigns**

**Features cần có:**
1. **Campaign Creator:** Tạo chiến dịch email với coupon
2. **Template Editor:** Chỉnh sửa template email
3. **Audience Selector:** Chọn đối tượng nhận email
4. **Schedule Manager:** Lên lịch gửi email
5. **Analytics Dashboard:** Thống kê hiệu quả campaign

### **PHẦN 3: UX/UI CHUẨN TMĐT**

#### **3.1 Product Display Enhancements**

**Product Card với Discount:**
```tsx
<div className="product-card relative group">
  {hasDiscount && (
    <div className="absolute top-2 left-2 z-10">
      <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
        -{discountPercentage}%
      </span>
    </div>
  )}
  
  <div className="product-image">
    <img src={productImage} alt={productName} />
    {hasDiscount && (
      <div className="absolute inset-0 bg-red-500 bg-opacity-10 rounded"></div>
    )}
  </div>
  
  <div className="product-info p-4">
    <h3 className="product-name">{productName}</h3>
    <PriceDisplay 
      originalPrice={originalPrice}
      discountedPrice={discountedPrice}
      hasDiscount={hasDiscount}
      discountPercentage={discountPercentage}
    />
    
    {appliedCoupons.length > 0 && (
      <div className="applied-coupons mt-2">
        {appliedCoupons.map(coupon => (
          <span key={coupon.id} className="coupon-tag">
            {coupon.code}
          </span>
        ))}
      </div>
    )}
  </div>
</div>
```

#### **3.2 Cart Enhancement**

**Cart Summary với Discount Breakdown:**
```tsx
<div className="cart-summary">
  <div className="summary-line">
    <span>Tạm tính ({totalItems} sản phẩm)</span>
    <span>{subtotal.toLocaleString()} VNĐ</span>
  </div>
  
  {totalDiscount > 0 && (
    <div className="discount-lines">
      <div className="summary-line text-green-600">
        <span>Tiết kiệm được</span>
        <span>-{totalDiscount.toLocaleString()} VNĐ</span>
      </div>
      
      {appliedCoupons.map(coupon => (
        <div key={coupon.id} className="coupon-line text-sm text-gray-600">
          <span>Mã {coupon.code}</span>
          <span>-{coupon.discountAmount.toLocaleString()} VNĐ</span>
        </div>
      ))}
    </div>
  )}
  
  <div className="summary-line font-bold text-lg border-t pt-2">
    <span>Tổng cộng</span>
    <span className="text-red-600">{finalTotal.toLocaleString()} VNĐ</span>
  </div>
</div>
```

#### **3.3 Coupon Input Field**

```tsx
<div className="coupon-input-section">
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Nhập mã giảm giá"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      className="flex-1 p-3 border rounded-lg"
    />
    <button
      onClick={applyCoupon}
      disabled={isApplying}
      className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
    >
      {isApplying ? "Đang áp dụng..." : "Áp dụng"}
    </button>
  </div>
  
  {couponError && (
    <p className="text-red-500 text-sm mt-2">{couponError}</p>
  )}
  
  {availableCoupons.length > 0 && (
    <div className="available-coupons mt-4">
      <h4 className="font-semibold mb-2">Mã giảm giá có thể áp dụng:</h4>
      <div className="flex flex-wrap gap-2">
        {availableCoupons.map(coupon => (
          <button
            key={coupon.id}
            onClick={() => applyCouponDirect(coupon.code)}
            className="coupon-suggestion-btn"
          >
            {coupon.code} - {coupon.description}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
```

---

## 🔧 IMPLEMENTATION PLAN

### **Phase 1: Backend Enhancement (Week 1-2)**

1. **Enhance ProductService:**
   - Implement `GetProductDisplayInfoAsync`
   - Add discount calculation methods
   - Update product APIs to include discount info

2. **Create EmailService:**
   - Implement SMTP configuration
   - Create email templates
   - Add campaign management

3. **Database Updates:**
   - Add CouponCampaign table
   - Add email tracking fields
   - Update indexes for performance

### **Phase 2: Frontend Integration (Week 3-4)**

1. **Update Cart Context:**
   - Add discount calculation
   - Implement coupon application logic
   - Real-time price updates

2. **Enhanced UI Components:**
   - PriceDisplay component
   - Coupon input component
   - Discount summary component

3. **Product Listing Updates:**
   - Discount badges
   - Sale indicators
   - Price display enhancement

### **Phase 3: Admin Tools (Week 5-6)**

1. **Email Campaign Manager:**
   - Campaign creation interface
   - Template editor
   - Audience management

2. **Analytics Dashboard:**
   - Coupon usage statistics
   - Email campaign metrics
   - ROI tracking

3. **Testing & Optimization:**
   - Comprehensive testing
   - Performance optimization
   - User acceptance testing

---

## 📊 SUCCESS METRICS

### **Technical Metrics:**
- ✅ 100% sản phẩm hiển thị đúng giá đã giảm
- ✅ Response time < 300ms cho discount calculation
- ✅ 99.9% email delivery rate
- ✅ Zero UI/UX inconsistencies

### **Business Metrics:**
- 🎯 Tăng 25% conversion rate từ coupon
- 🎯 Tăng 40% email open rate
- 🎯 Tăng 60% coupon usage rate
- 🎯 Giảm 80% thời gian admin quản lý coupon

---

## 🎉 KẾT LUẬN

Với thiết kế này, hệ thống mã giảm giá sẽ:

1. **Đáp ứng đầy đủ yêu cầu:** Admin dễ dàng quản lý sản phẩm giảm giá và gửi email campaign
2. **UX/UI chuẩn TMĐT:** Hiển thị giá rõ ràng, trực quan, chuyên nghiệp
3. **Logic chuẩn:** Tính toán chính xác, validate đầy đủ, performance tốt
4. **Khả năng mở rộng:** Dễ dàng thêm loại coupon mới, template email mới
5. **Báo cáo chi tiết:** Admin có thể theo dõi hiệu quả campaign

Hệ thống sẽ mang lại trải nghiệm mua sắm tuyệt vời cho khách hàng và công cụ quản lý mạnh mẽ cho admin.
