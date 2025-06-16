using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IShoppingCartService
    {
        Task<ShoppingCart> GetOrCreateCartAsync(string userId);
        Task<ShoppingCart?> GetCartWithItemsAsync(string userId);
        Task AddItemToCartAsync(string userId, int? productId, int? serviceId, string itemName, string? imageUrl, decimal unitPrice, int quantity);
        Task UpdateCartItemQuantityAsync(string userId, int cartItemId, int quantity);
        Task RemoveItemFromCartAsync(string userId, int cartItemId);
        Task ClearCartAsync(string userId);
        Task<int> GetCartItemCountAsync(string userId);
    }
}
