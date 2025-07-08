# Hướng Dẫn Tích Hợp Mixpanel Tracking Events

## Tổng Quan
Để admin dashboard hiển thị dữ liệu thực thay vì dữ liệu ảo, cần implement các Mixpanel tracking events trong frontend.

## Events Cần Tracking

### 1. Page View Events
**Event Name:** `page_view`  
**Properties:**
- `page_url`: URL của trang
- `page_title`: Tiêu đề trang
- `user_id`: ID người dùng (nếu đã đăng nhập)
- `timestamp`: Thời gian xem trang

```javascript
// Example implementation
mixpanel.track('page_view', {
    page_url: window.location.href,
    page_title: document.title,
    user_id: getCurrentUserId(), // implement this function
    timestamp: new Date().toISOString()
});
```

### 2. Search Events
**Event Name:** `search`  
**Properties:**
- `search_term`: Từ khóa tìm kiếm
- `results_count`: Số kết quả tìm được
- `clicked_result`: true/false nếu user click vào kết quả
- `search_category`: Danh mục tìm kiếm (nếu có)

```javascript
// When user performs search
function trackSearch(searchTerm, resultsCount) {
    mixpanel.track('search', {
        search_term: searchTerm.toLowerCase(),
        results_count: resultsCount,
        search_category: getSearchCategory(), // implement this
        timestamp: new Date().toISOString()
    });
}

// When user clicks on search result
function trackSearchResultClick(searchTerm) {
    mixpanel.track('search', {
        search_term: searchTerm.toLowerCase(),
        clicked_result: true,
        timestamp: new Date().toISOString()
    });
}
```

### 3. Product View Events
**Event Name:** `view_product`  
**Properties:**
- `product_id`: ID sản phẩm
- `product_name`: Tên sản phẩm
- `product_category`: Danh mục sản phẩm
- `product_price`: Giá sản phẩm

```javascript
// When user views product detail page
function trackProductView(productId, productName, category, price) {
    mixpanel.track('view_product', {
        product_id: productId,
        product_name: productName,
        product_category: category,
        product_price: price,
        timestamp: new Date().toISOString()
    });
}
```

### 4. Purchase Events
**Event Name:** `purchase`  
**Properties:**
- `order_id`: ID đơn hàng
- `total_amount`: Tổng tiền
- `product_ids`: Danh sách ID sản phẩm
- `payment_method`: Phương thức thanh toán

```javascript
// When user completes purchase
function trackPurchase(orderId, totalAmount, productIds, paymentMethod) {
    mixpanel.track('purchase', {
        order_id: orderId,
        total_amount: totalAmount,
        product_ids: productIds,
        payment_method: paymentMethod,
        timestamp: new Date().toISOString()
    });
}
```

### 5. User Registration Events  
**Event Name:** `new_user_registered`  
**Properties:**
- `user_id`: ID người dùng mới
- `registration_method`: Phương thức đăng ký (email, social, etc.)

### 6. Cart Events
**Event Name:** `add_to_cart`  
**Properties:**
- `product_id`: ID sản phẩm
- `quantity`: Số lượng
- `cart_value`: Giá trị giỏ hàng sau khi thêm

**Event Name:** `start_checkout`  
**Properties:**
- `cart_value`: Tổng giá trị giỏ hàng
- `product_count`: Số sản phẩm trong giỏ

## Frontend Implementation

### 1. Initialize Mixpanel
Thêm vào layout chính (như `_Layout.cshtml`):

```html
<script>
(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

// Replace 'YOUR_PROJECT_TOKEN' with your actual Mixpanel project token
mixpanel.init('YOUR_PROJECT_TOKEN', {debug: true});
</script>
```

### 2. Track Page Views
Thêm vào cuối `_Layout.cshtml`:

```html
<script>
// Track page view on every page load
mixpanel.track('page_view', {
    page_url: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString()
});
</script>
```

### 3. Track Search (trong search form/component)

```html
<script>
document.getElementById('search-form').addEventListener('submit', function(e) {
    const searchTerm = document.getElementById('search-input').value;
    
    // Track the search
    mixpanel.track('search', {
        search_term: searchTerm.toLowerCase(),
        timestamp: new Date().toISOString()
    });
});

// Track search results count after search is performed
function trackSearchResults(searchTerm, resultsCount) {
    mixpanel.track('search', {
        search_term: searchTerm.toLowerCase(),
        results_count: resultsCount,
        timestamp: new Date().toISOString()
    });
}
</script>
```

### 4. Track Product Views (trong product detail page)

```html
<script>
// Track product view when page loads
mixpanel.track('view_product', {
    product_id: @Model.Id,
    product_name: '@Model.Name',
    product_category: '@Model.Category',
    product_price: @Model.Price,
    timestamp: new Date().toISOString()
});
</script>
```

## Configuration trong appsettings.json

Đảm bảo Mixpanel credentials được cấu hình đúng:

```json
{
  "Mixpanel": {
    "ProjectToken": "YOUR_PROJECT_TOKEN",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

## Lưu Ý

1. **Event Naming**: Sử dụng snake_case cho event names và properties
2. **Data Types**: Đảm bảo data types consistent (strings, numbers, booleans)
3. **Privacy**: Không track thông tin nhạy cảm (passwords, payment details)
4. **Performance**: Implement tracking không ảnh hưởng đến performance trang web

## Testing

1. Enable debug mode trong Mixpanel init
2. Kiểm tra Network tab trong browser dev tools
3. Verify events trong Mixpanel dashboard
4. Test admin dashboard sau khi có dữ liệu

## Kết Quả

Sau khi implement các tracking events, admin dashboard sẽ hiển thị:
- ✅ Lượt xem thực theo ngày/tuần/tháng
- ✅ Top từ khóa tìm kiếm thực từ users
- ✅ Sản phẩm được xem nhiều nhất thực
- ✅ Conversion rates thực
- ✅ User behavior analytics thực

Thay thế hoàn toàn dữ liệu ảo bằng insights thực từ user behavior!
