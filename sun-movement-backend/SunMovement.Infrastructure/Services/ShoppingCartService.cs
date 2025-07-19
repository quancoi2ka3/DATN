using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Services
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ShoppingCartService> _logger;

        public ShoppingCartService(ApplicationDbContext context, ILogger<ShoppingCartService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ShoppingCart> GetOrCreateCartAsync(string userId)
        {
            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new ShoppingCart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ShoppingCarts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        public async Task<ShoppingCart?> GetCartWithItemsAsync(string userId)
        {
            return await _context.ShoppingCarts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .Include(c => c.Items)
                .ThenInclude(i => i.Service)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task AddItemToCartAsync(string userId, int? productId, int? serviceId, string itemName, string? imageUrl, decimal unitPrice, int quantity)
        {
            var cart = await GetOrCreateCartAsync(userId);

            // Check if item already exists in cart
            var existingItem = cart.Items.FirstOrDefault(i =>
                i.ProductId == productId && i.ServiceId == serviceId);

            if (existingItem != null)
            {
                // Update quantity if item already exists
                existingItem.Quantity += quantity;
                existingItem.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    ShoppingCartId = cart.Id,
                    ProductId = productId,
                    ServiceId = serviceId,
                    ItemName = itemName,
                    ItemImageUrl = imageUrl ?? string.Empty,
                    UnitPrice = unitPrice,
                    Quantity = quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CartItems.Add(cartItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Added item to cart for user {userId}");
        }

        public async Task UpdateCartItemQuantityAsync(string userId, int cartItemId, int quantity)
        {
            var cart = await GetCartWithItemsAsync(userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                throw new InvalidOperationException("Cart item not found");
            }

            cartItem.Quantity = quantity;
            cartItem.UpdatedAt = DateTime.UtcNow;
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Updated cart item {cartItemId} quantity to {quantity} for user {userId}");
        }

        public async Task RemoveItemFromCartAsync(string userId, int cartItemId)
        {
            var cart = await GetCartWithItemsAsync(userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
            if (cartItem == null)
            {
                throw new InvalidOperationException("Cart item not found");
            }

            _context.CartItems.Remove(cartItem);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Removed cart item {cartItemId} for user {userId}");
        }

        public async Task ClearCartAsync(string userId)
        {
            var cart = await GetCartWithItemsAsync(userId);
            if (cart == null)
            {
                return; // No cart to clear
            }

            _context.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Cleared cart for user {userId}");
        }

        public async Task<int> GetCartItemCountAsync(string userId)
        {
            var cart = await GetCartWithItemsAsync(userId);
            return cart?.Items.Sum(i => i.Quantity) ?? 0;
        }

        // Implementation for IShoppingCartService.AddToCartAsync

        public async Task AddToCartAsync(string userId, AddToCartDto dto)
        {
            ArgumentNullException.ThrowIfNull(dto);
            await AddItemToCartAsync(
                userId,
                dto.ProductId,
                dto.ServiceId,
                dto.ItemName,
                dto.ImageUrl,
                dto.UnitPrice,
                dto.Quantity
            );
        }

        public async Task<SunMovement.Core.DTOs.CartDto> GetCartByUserIdAsync(string userId)
        {
            var cart = await GetCartWithItemsAsync(userId);
            if (cart == null)
            {
                return new SunMovement.Core.DTOs.CartDto();
            }

            var items = cart.Items.Select(i => {
                SunMovement.Core.DTOs.ProductDto? productDto = null;
                if (i.Product != null)
                {
                    productDto = new SunMovement.Core.DTOs.ProductDto
                    {
                        Id = i.Product.Id,
                        Name = i.Product.Name,
                        ImageUrl = i.Product.ImageUrl ?? string.Empty,
                        Price = i.Product.Price,
                        SubCategory = i.Product.SubCategory ?? string.Empty,
                        Specifications = i.Product.Specifications ?? string.Empty,
                        Description = i.Product.Description ?? string.Empty
                    };
                }
                
                // Đảm bảo UnitPrice không bị 0, lấy từ database hoặc từ Product
                var unitPrice = i.UnitPrice > 0 ? i.UnitPrice : (i.Product?.Price ?? 0);
                
                return new SunMovement.Core.DTOs.CartItemDto
                {
                    Id = i.Id,
                    CartId = i.ShoppingCartId,
                    ProductId = i.ProductId,
                    ServiceId = i.ServiceId,
                    ItemName = i.ItemName ?? (i.Product?.Name ?? "Unknown Product"),
                    ItemImageUrl = i.ItemImageUrl ?? (i.Product?.ImageUrl ?? ""),
                    UnitPrice = unitPrice,
                    Quantity = i.Quantity,
                    Product = productDto,
                    Service = null // Nếu cần, map Service tương tự
                };
            }).ToList();

            return new SunMovement.Core.DTOs.CartDto
            {
                Items = items,
                TotalQuantity = items.Sum(x => x.Quantity),
                TotalPrice = items.Sum(x => x.UnitPrice * x.Quantity)
            };
        }

        // Đảm bảo interface IShoppingCartService cũng trả về Task<CartDto>
    }
}

        