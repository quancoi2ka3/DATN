using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace SunMovement.Infrastructure.Repositories
{
    public interface IShoppingCartRepository : IRepository<ShoppingCart>
    {
        Task<ShoppingCart?> GetCartByUserIdAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(string userId);
        Task<CartItem?> GetCartItemAsync(int cartItemId);
        Task<bool> RemoveCartItemAsync(int cartItemId);
        Task<bool> ClearCartItemsAsync(string userId);
    }

    public class ShoppingCartRepository : Repository<ShoppingCart>, IShoppingCartRepository
    {
        public ShoppingCartRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<ShoppingCart?> GetCartByUserIdAsync(string userId)
        {
            return await _context.ShoppingCarts
                .FirstOrDefaultAsync(c => c.UserId == userId);
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

        public async Task<CartItem?> GetCartItemAsync(int cartItemId)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .Include(ci => ci.Service)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);
        }

        public async Task<bool> RemoveCartItemAsync(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
                return false;

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartItemsAsync(string userId)
        {
            var cart = await GetCartWithItemsAsync(userId);
            if (cart == null || !cart.Items.Any())
                return false;

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
