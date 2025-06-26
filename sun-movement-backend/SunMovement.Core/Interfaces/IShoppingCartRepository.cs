using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IShoppingCartRepository
    {
        Task<ShoppingCart?> GetCartByUserIdAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(string userId);
        Task<ShoppingCart> AddAsync(ShoppingCart cart);
        Task UpdateAsync(ShoppingCart cart);
        Task DeleteAsync(int cartId);
        Task<CartItem?> GetCartItemAsync(int cartItemId);
        Task<CartItem> AddCartItemAsync(CartItem cartItem);
        Task UpdateCartItemAsync(CartItem cartItem);
        Task DeleteCartItemAsync(int cartItemId);
        Task ClearCartItemsAsync(int cartId);
    }
}
