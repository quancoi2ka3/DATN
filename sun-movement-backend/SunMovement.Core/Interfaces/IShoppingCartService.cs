using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IShoppingCartService
    {
        Task<ShoppingCart> GetOrCreateCartAsync(string userId);
        Task<ShoppingCart?> GetCartByUserIdAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(string userId);
        Task<ShoppingCart> CreateCartAsync(string userId);
        Task<ShoppingCart> AddItemToCartAsync(string userId, int? productId, int? serviceId, string itemName, string imageUrl, decimal unitPrice, int quantity);
        Task<ShoppingCart> UpdateCartItemQuantityAsync(string userId, int itemId, int quantity);
        Task<ShoppingCart> RemoveItemFromCartAsync(string userId, int itemId);
        Task ClearCartAsync(string userId);
        Task<Order> CheckoutAsync(string userId, string fullName, string shippingAddress, string email, string phoneNumber, string notes = "");
    }
}
