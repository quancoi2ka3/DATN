using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IShoppingCartRepository : IRepository<ShoppingCart>
    {
        Task<ShoppingCart?> GetCartByUserIdAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(int cartId);
        Task<ShoppingCart?> GetCartWithItemsAndProductsAsync(int cartId);
        Task<CartItem?> GetCartItemAsync(int cartId, int? productId, int? serviceId);
        Task<CartItem?> GetCartItemByIdAsync(int itemId);
        Task<CartItem> AddCartItemAsync(CartItem cartItem);
        void UpdateCartItem(CartItem cartItem);
        Task DeleteCartItemAsync(int itemId);
        Task ClearCartAsync(int cartId);
    }
}
