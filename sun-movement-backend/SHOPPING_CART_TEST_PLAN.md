# Shopping Cart System Implementation Test Script

This script outlines a series of steps to manually test the shopping cart functionality once the migrations have been applied.

## Prerequisites

1. Run the shopping cart migration:
   ```
   create-shopping-cart-migration.bat
   ```

2. Start the application:
   ```
   run-dev.bat
   ```

## Testing Steps

### API Testing (Using Swagger or Postman)

1. **Register/Login** to get an authentication token
   - Endpoint: `POST /api/account/login`
   - Body: `{ "email": "test@example.com", "password": "Password123!" }`

2. **Get Cart** (should be empty initially)
   - Endpoint: `GET /api/ShoppingCart`
   - Headers: `Authorization: Bearer {token}`

3. **Add Product to Cart**
   - Endpoint: `POST /api/ShoppingCart/items`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "productId": 1, "quantity": 2 }`

4. **Add Service to Cart**
   - Endpoint: `POST /api/ShoppingCart/items`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "serviceId": 1, "quantity": 1 }`

5. **Get Cart** (should now contain items)
   - Endpoint: `GET /api/ShoppingCart`
   - Headers: `Authorization: Bearer {token}`

6. **Update Cart Item Quantity**
   - Endpoint: `PUT /api/ShoppingCart/items`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "cartItemId": 1, "quantity": 3 }`

7. **Remove Item from Cart**
   - Endpoint: `DELETE /api/ShoppingCart/items/{itemId}`
   - Headers: `Authorization: Bearer {token}`

8. **Clear Cart**
   - Endpoint: `DELETE /api/ShoppingCart/clear`
   - Headers: `Authorization: Bearer {token}`

### Web Application Testing

1. **Login** to the application
   - Navigate to `/Account/Login`
   - Enter credentials and log in

2. **Browse Products**
   - Navigate to products or services page
   - Click "Add to Cart" on a product

3. **View Cart**
   - Click on the cart icon or navigate to `/Cart/Index`
   - Verify the product appears with correct quantity and price

4. **Update Quantity**
   - Change the quantity using the +/- buttons
   - Click "Update" to save changes

5. **Remove Item**
   - Click the trash icon to remove an item
   - Verify item is removed

6. **Clear Cart**
   - Click "Clear Cart" button
   - Verify cart is emptied

7. **Add Multiple Items**
   - Add both products and services to cart
   - Verify all appear correctly

8. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in the shipping information form
   - Complete order

## Database Verification

After testing, verify database entries:

```sql
SELECT * FROM ShoppingCarts;
SELECT * FROM CartItems;
```

## Expected Results

- Cart operations should be reflected in real-time
- Cart should persist between sessions for logged-in users
- Quantities should update correctly
- Price calculations should be accurate
- Checkout should clear the cart
