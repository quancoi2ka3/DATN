using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Repositories
{
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
        
        public async Task<ShoppingCart?> GetCartWithItemsAsync(int cartId)
        {
            return await _context.ShoppingCarts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.Id == cartId);
        }        public async Task<ShoppingCart?> GetCartWithItemsAndProductsAsync(int cartId)
        {
            return await _context.ShoppingCarts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .Include(c => c.Items)
                .ThenInclude(i => i.Service)
                .FirstOrDefaultAsync(c => c.Id == cartId);
        }
        
        public async Task<CartItem?> GetCartItemAsync(int cartId, int productId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(i => i.ShoppingCartId == cartId && i.ProductId == productId);
        }
        
        public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
        {
            await _context.CartItems.AddAsync(cartItem);
            return cartItem;
        }
        
        public async Task UpdateCartItemAsync(CartItem cartItem)
        {
            _context.Entry(cartItem).State = EntityState.Modified;
            await Task.CompletedTask;
        }
        
        public async Task DeleteCartItemAsync(CartItem cartItem)
        {
            _context.CartItems.Remove(cartItem);
            await Task.CompletedTask;
        }
        
        public async Task ClearCartAsync(int cartId)
        {
            var cartItems = await _context.CartItems
                .Where(i => i.ShoppingCartId == cartId)
                .ToListAsync();
                
            _context.CartItems.RemoveRange(cartItems);
            await Task.CompletedTask;
        }
    }
}
