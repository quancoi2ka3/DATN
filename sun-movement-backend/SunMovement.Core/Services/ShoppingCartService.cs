using System;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private const string CartCacheKeyPrefix = "Cart_";
        
        public ShoppingCartService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }
        
        public async Task<ShoppingCart?> GetCartByUserIdAsync(string userId)
        {
            var cacheKey = $"CartUser_{userId}";
            var cachedCart = _cacheService.Get<ShoppingCart>(cacheKey);
            if (cachedCart != null)
            {
                return cachedCart;
            }
            
            var cart = await _unitOfWork.ShoppingCarts.GetCartByUserIdAsync(userId);
            if (cart != null)
            {
                _cacheService.Set(cacheKey, cart, TimeSpan.FromMinutes(30));
            }
            
            return cart;
        }
        
        public async Task<ShoppingCart?> GetCartWithItemsAsync(int cartId)
        {
            var cacheKey = $"{CartCacheKeyPrefix}{cartId}";
            var cachedCart = _cacheService.Get<ShoppingCart>(cacheKey);
            if (cachedCart != null)
            {
                return cachedCart;
            }
            
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAndProductsAsync(cartId);
            if (cart != null)
            {
                _cacheService.Set(cacheKey, cart, TimeSpan.FromMinutes(30));
            }
            
            return cart;
        }
        
        public async Task<ShoppingCart> CreateCartAsync(string userId)
        {
            var cart = new ShoppingCart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _unitOfWork.ShoppingCarts.AddAsync(cart);
            await _unitOfWork.CompleteAsync();
            
            // Cache the new cart
            var cacheKey = $"CartUser_{userId}";
            _cacheService.Set(cacheKey, cart, TimeSpan.FromMinutes(30));
            
            return cart;
        }
        
        public async Task<ShoppingCart> AddItemToCartAsync(int cartId, int productId, int quantity)
        {
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAsync(cartId);
            
            if (cart == null)
            {
                throw new ArgumentException($"Cart with ID {cartId} not found");
            }
            
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {productId} not found");
            }
            
            var cartItem = await _unitOfWork.ShoppingCarts.GetCartItemAsync(cartId, productId);
            
            if (cartItem == null)
            {
                // Add new item
                cartItem = new CartItem
                {
                    ShoppingCartId = cartId,
                    ProductId = productId,
                    ProductName = product.Name,
                    Quantity = quantity,
                    UnitPrice = product.DiscountPrice ?? product.Price,
                    Subtotal = (product.DiscountPrice ?? product.Price) * quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                await _unitOfWork.ShoppingCarts.AddCartItemAsync(cartItem);
            }
            else
            {
                // Update existing item
                cartItem.Quantity += quantity;
                cartItem.Subtotal = cartItem.UnitPrice * cartItem.Quantity;
                cartItem.UpdatedAt = DateTime.UtcNow;
                
                await _unitOfWork.ShoppingCarts.UpdateCartItemAsync(cartItem);
            }
            
            // Update cart timestamp
            cart.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.ShoppingCarts.UpdateAsync(cart);
            
            await _unitOfWork.CompleteAsync();
            
            // Clear cache
            InvalidateCartCache(cartId, cart.UserId);
            
            // Return updated cart
            return await _unitOfWork.ShoppingCarts.GetCartWithItemsAndProductsAsync(cartId);
        }
        
        public async Task<ShoppingCart> UpdateCartItemQuantityAsync(int cartId, int productId, int quantity)
        {
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAsync(cartId);
            
            if (cart == null)
            {
                throw new ArgumentException($"Cart with ID {cartId} not found");
            }
            
            var cartItem = await _unitOfWork.ShoppingCarts.GetCartItemAsync(cartId, productId);
            
            if (cartItem == null)
            {
                throw new ArgumentException($"Cart item with product ID {productId} not found in cart {cartId}");
            }
            
            if (quantity <= 0)
            {
                // Remove item if quantity is zero or negative
                await _unitOfWork.ShoppingCarts.DeleteCartItemAsync(cartItem);
            }
            else
            {
                // Update quantity
                cartItem.Quantity = quantity;
                cartItem.Subtotal = cartItem.UnitPrice * quantity;
                cartItem.UpdatedAt = DateTime.UtcNow;
                
                await _unitOfWork.ShoppingCarts.UpdateCartItemAsync(cartItem);
            }
            
            // Update cart timestamp
            cart.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.ShoppingCarts.UpdateAsync(cart);
            
            await _unitOfWork.CompleteAsync();
            
            // Clear cache
            InvalidateCartCache(cartId, cart.UserId);
            
            // Return updated cart
            return await _unitOfWork.ShoppingCarts.GetCartWithItemsAndProductsAsync(cartId);
        }
        
        public async Task<ShoppingCart> RemoveItemFromCartAsync(int cartId, int productId)
        {
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAsync(cartId);
            
            if (cart == null)
            {
                throw new ArgumentException($"Cart with ID {cartId} not found");
            }
            
            var cartItem = await _unitOfWork.ShoppingCarts.GetCartItemAsync(cartId, productId);
            
            if (cartItem == null)
            {
                throw new ArgumentException($"Cart item with product ID {productId} not found in cart {cartId}");
            }
            
            await _unitOfWork.ShoppingCarts.DeleteCartItemAsync(cartItem);
            
            // Update cart timestamp
            cart.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.ShoppingCarts.UpdateAsync(cart);
            
            await _unitOfWork.CompleteAsync();
            
            // Clear cache
            InvalidateCartCache(cartId, cart.UserId);
            
            // Return updated cart
            return await _unitOfWork.ShoppingCarts.GetCartWithItemsAndProductsAsync(cartId);
        }
        
        public async Task ClearCartAsync(int cartId)
        {
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAsync(cartId);
            
            if (cart == null)
            {
                throw new ArgumentException($"Cart with ID {cartId} not found");
            }
            
            await _unitOfWork.ShoppingCarts.ClearCartAsync(cartId);
            
            // Update cart timestamp
            cart.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.ShoppingCarts.UpdateAsync(cart);
            
            await _unitOfWork.CompleteAsync();
            
            // Clear cache
            InvalidateCartCache(cartId, cart.UserId);
        }
        
        public async Task<Order> CheckoutAsync(int cartId, string shippingAddress, string email, string phoneNumber)
        {
            var cart = await _unitOfWork.ShoppingCarts.GetCartWithItemsAndProductsAsync(cartId);
            
            if (cart == null)
            {
                throw new ArgumentException($"Cart with ID {cartId} not found");
            }
            
            if (cart.Items == null || !cart.Items.Any())
            {
                throw new InvalidOperationException("Cannot checkout an empty cart");
            }
            
            // Create order from cart
            var order = new Order
            {
                UserId = cart.UserId,
                OrderDate = DateTime.UtcNow,
                ShippingAddress = shippingAddress,
                Email = email,
                PhoneNumber = phoneNumber,
                Status = OrderStatus.Pending,
                TotalAmount = cart.TotalAmount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();
            
            // Add order items
            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.ProductName,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice,
                    Subtotal = cartItem.Subtotal
                };
                
                await _unitOfWork.OrderItems.AddAsync(orderItem);
                
                // Update product stock
                var product = await _unitOfWork.Products.GetByIdAsync(cartItem.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= cartItem.Quantity;
                    if (product.StockQuantity < 0)
                    {
                        product.StockQuantity = 0;
                    }
                    await _unitOfWork.Products.UpdateAsync(product);
                }
            }
            
            await _unitOfWork.CompleteAsync();
            
            // Clear the cart after successful checkout
            await ClearCartAsync(cartId);
            
            return order;
        }
        
        private void InvalidateCartCache(int cartId, string userId)
        {
            _cacheService.Remove($"{CartCacheKeyPrefix}{cartId}");
            _cacheService.Remove($"CartUser_{userId}");
        }
    }
}
