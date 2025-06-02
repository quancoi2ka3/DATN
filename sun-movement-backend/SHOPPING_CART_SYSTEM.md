# Shopping Cart System Documentation

## Overview

The shopping cart system allows users to add products and services to a cart, manage quantities, and proceed to checkout. The system includes caching to enhance performance and supports both web and API interfaces.

## Features

- Add products and services to the shopping cart
- Update item quantities
- Remove items from the cart
- View cart contents
- Clear the cart
- Checkout process

## Architecture

The shopping cart system follows a clean architecture approach:

1. **Models** (Core Layer)
   - `ShoppingCart`: Represents a user's shopping cart
   - `CartItem`: Represents individual items in a cart

2. **Repositories** (Infrastructure Layer)
   - `IShoppingCartRepository`: Interface defining cart data access methods
   - `ShoppingCartRepository`: Implementation of repository pattern for cart data

3. **Services** (Core Layer)
   - `IShoppingCartService`: Interface defining business logic operations
   - `ShoppingCartService`: Implementation with caching and business rules

4. **Controllers** 
   - `ShoppingCartController` (API): RESTful endpoints for cart management
   - `CartController` (Web): MVC controller for web interface

5. **Data Transfer Objects**
   - `CartItemDto`: Represents cart items for API responses
   - `ShoppingCartDto`: Represents the full cart for API responses
   - `AddToCartDto`: Input model for adding items to cart
   - `UpdateCartItemDto`: Input model for updating cart items

6. **View Models**
   - `CartItemViewModel`: View representation of cart items
   - `ShoppingCartViewModel`: View representation of shopping cart
   - `AddToCartViewModel`: Input model for adding items from web interface
   - `CheckoutViewModel`: Model for checkout process

## Database Schema

The shopping cart system uses two main tables:

1. **ShoppingCarts**
   - Id (PK)
   - UserId (FK to AspNetUsers)
   - CreatedAt
   - UpdatedAt

2. **CartItems**
   - Id (PK)
   - CartId (FK to ShoppingCarts)
   - ProductId (FK to Products, nullable)
   - ServiceId (FK to Services, nullable)
   - ItemName
   - ItemImageUrl
   - UnitPrice
   - Quantity
   - CreatedAt
   - UpdatedAt

## Caching Strategy

The shopping cart service implements caching to improve performance:

- Cart data is cached by user ID
- Cache is invalidated when cart is modified
- Cache timeout is set to 30 minutes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/ShoppingCart | Get the current user's cart |
| POST   | /api/ShoppingCart/items | Add an item to the cart |
| PUT    | /api/ShoppingCart/items | Update a cart item quantity |
| DELETE | /api/ShoppingCart/items/{itemId} | Remove an item from the cart |
| DELETE | /api/ShoppingCart/clear | Clear the entire cart |

## Usage Examples

### Adding an item to the cart

```csharp
// Via service
await _cartService.AddItemToCartAsync(
    userId,
    productId,
    null, // serviceId
    "Product Name",
    "image-url.jpg",
    19.99m,
    2 // quantity
);

// Via API
POST /api/ShoppingCart/items
{
    "productId": 1,
    "quantity": 2
}
```

### Updating item quantity

```csharp
await _cartService.UpdateCartItemQuantityAsync(userId, cartItemId, 3);
```

### Removing an item

```csharp
await _cartService.RemoveItemFromCartAsync(userId, cartItemId);
```

## Testing

Unit tests are provided for:
- ShoppingCartService
- ShoppingCartRepository

Run tests using the `test-shopping-cart.bat` script.

## Future Enhancements

- Saved cart items for logged-out users
- Wishlist functionality
- Product recommendations based on cart contents
- Discount code support
- Tax calculation
- Shipping options
