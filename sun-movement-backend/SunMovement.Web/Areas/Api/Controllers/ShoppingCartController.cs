// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Security.Claims;
// using System.Threading.Tasks;
// using AutoMapper;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Logging;
// using SunMovement.Core.DTOs;
// using SunMovement.Core.Interfaces;
// using SunMovement.Core.Models;

// namespace SunMovement.Web.Areas.Api.Controllers
// {    [Area("Api")]
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize] // Re-enabled authorization
//     public class ShoppingCartController : ControllerBase
//     {
//         private readonly IShoppingCartService _cartService;
//         private readonly IProductService _productService;
//         private readonly IServiceService _serviceService;
//         private readonly IMapper _mapper;
//         private readonly ILogger<ShoppingCartController> _logger;

//         public ShoppingCartController(
//             IShoppingCartService cartService,
//             IProductService productService,
//             IServiceService serviceService,
//             IMapper mapper,
//             ILogger<ShoppingCartController> logger)
//         {
//             _cartService = cartService;
//             _productService = productService;
//             _serviceService = serviceService;
//             _mapper = mapper;
//             _logger = logger;
//         }        private string GetUserId()
//         {
//             var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
//             // If user is authenticated, use their ID
//             if (!string.IsNullOrEmpty(userId))
//             {
//                 return userId;
//             }
            
//             // For anonymous users, create a unique session ID
//             // This prevents sharing cart between different anonymous sessions
//             var sessionId = HttpContext.Session.GetString("AnonymousUserId");
//             if (string.IsNullOrEmpty(sessionId))
//             {
//                 sessionId = $"anonymous-{Guid.NewGuid()}";
//                 HttpContext.Session.SetString("AnonymousUserId", sessionId);
//             }
            
//             return sessionId;
//         }[HttpGet("items")]
//         public async Task<ActionResult<ShoppingCartDto>> GetCart()
//         {
//             try
//             {
//                 var userId = GetUserId();
//                 _logger.LogInformation($"[GET CART] UserId: {userId}");
                
//                 // Remove authorization check for testing
//                 // if (string.IsNullOrEmpty(userId))
//                 // {
//                 //     return Unauthorized();
//                 // }

//                 var cart = await _cartService.GetCartWithItemsAsync(userId);
//                 _logger.LogInformation($"[GET CART] Cart found: {cart != null}, Items count: {cart?.Items?.Count ?? 0}");
//                 if (cart == null)
//                 {
//                     // Return empty cart if no cart exists
//                     return Ok(new ShoppingCartDto 
//                     { 
//                         UserId = userId,
//                         Items = new List<CartItemDto>(),
//                         CreatedAt = DateTime.UtcNow,
//                         UpdatedAt = DateTime.UtcNow
//                     });
//                 }

//                 var cartDto = _mapper.Map<ShoppingCartDto>(cart);
//                 return Ok(cartDto);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error retrieving shopping cart");
//                 return StatusCode(500, "An error occurred while retrieving the shopping cart");
//             }
//         }[HttpPost("items")]
//         public async Task<ActionResult> AddToCart(AddToCartDto addToCartDto)
//         {
//             try
//             {
//                 var userId = GetUserId();
//                 _logger.LogInformation($"[ADD TO CART] UserId: {userId}, Request: {System.Text.Json.JsonSerializer.Serialize(addToCartDto)}");
                
//                 // Remove authorization check for testing
//                 // if (string.IsNullOrEmpty(userId))
//                 // {
//                 //     return Unauthorized();
//                 // }

//                 if (addToCartDto.ProductId == null && addToCartDto.ServiceId == null)
//                 {
//                     _logger.LogWarning("[ADD TO CART] Missing ProductId and ServiceId");
//                     return BadRequest("Either ProductId or ServiceId must be provided");
//                 }

//                 if (addToCartDto.ProductId != null && addToCartDto.ServiceId != null)
//                 {
//                     _logger.LogWarning("[ADD TO CART] Both ProductId and ServiceId provided");
//                     return BadRequest("Cannot add both Product and Service at the same time");
//                 }

//                 if (addToCartDto.Quantity <= 0)
//                 {
//                     _logger.LogWarning($"[ADD TO CART] Invalid quantity: {addToCartDto.Quantity}");
//                     return BadRequest("Quantity must be greater than zero");
//                 }

//                 string itemName = "";
//                 string imageUrl = "";
//                 decimal unitPrice = 0;

//                 if (addToCartDto.ProductId.HasValue)
//                 {
//                     _logger.LogInformation($"[ADD TO CART] Looking up product: {addToCartDto.ProductId.Value}");
//                     var product = await _productService.GetProductByIdAsync(addToCartDto.ProductId.Value);
//                     if (product == null)
//                     {
//                         _logger.LogWarning($"[ADD TO CART] Product not found: {addToCartDto.ProductId.Value}");
//                         return NotFound("Product not found");
//                     }
//                     itemName = product.Name ?? "Unknown Product";
//                     imageUrl = product.ImageUrl ?? "/images/placeholder.jpg";
//                     unitPrice = product.Price;
//                     _logger.LogInformation($"[ADD TO CART] Product found: {itemName}, Price: {unitPrice}");
//                 }
//                 else if (addToCartDto.ServiceId.HasValue)
//                 {
//                     _logger.LogInformation($"[ADD TO CART] Looking up service: {addToCartDto.ServiceId.Value}");
//                     var service = await _serviceService.GetServiceByIdAsync(addToCartDto.ServiceId.Value);
//                     if (service == null)
//                     {
//                         _logger.LogWarning($"[ADD TO CART] Service not found: {addToCartDto.ServiceId.Value}");
//                         return NotFound("Service not found");
//                     }
//                     itemName = service.Name ?? "Unknown Service";
//                     imageUrl = service.ImageUrl ?? "/images/placeholder.jpg";
//                     unitPrice = service.Price;
//                     _logger.LogInformation($"[ADD TO CART] Service found: {itemName}, Price: {unitPrice}");
//                 }

//                 _logger.LogInformation($"[ADD TO CART] Adding item to cart for user: {userId}");
//                 await _cartService.AddItemToCartAsync(
//                     userId,
//                     addToCartDto.ProductId,
//                     addToCartDto.ServiceId,
//                     itemName,
//                     imageUrl,
//                     unitPrice,
//                     addToCartDto.Quantity
//                 );

//                 _logger.LogInformation($"[ADD TO CART] Successfully added item to cart for user: {userId}");
//                 return Ok();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "[ADD TO CART] Error adding item to cart");
//                 return StatusCode(500, $"An error occurred while adding item to cart: {ex.Message}");
//             }
//         }        [HttpPut("items")]
//         public async Task<ActionResult> UpdateCartItem(UpdateCartItemDto updateCartItemDto)
//         {
//             try
//             {
//                 var userId = GetUserId();
//                 // Remove authorization check for testing
//                 // if (string.IsNullOrEmpty(userId))
//                 // {
//                 //     return Unauthorized();
//                 // }

//                 if (updateCartItemDto.Quantity <= 0)
//                 {
//                     return BadRequest("Quantity must be greater than zero");
//                 }

//                 var cart = await _cartService.GetCartWithItemsAsync(userId);
//                 if (cart == null)
//                 {
//                     return NotFound("Shopping cart not found");
//                 }

//                 var cartItem = cart.Items.FirstOrDefault(i => i.Id == updateCartItemDto.CartItemId);
//                 if (cartItem == null)
//                 {
//                     return NotFound("Cart item not found");
//                 }

//                 await _cartService.UpdateCartItemQuantityAsync(userId, updateCartItemDto.CartItemId, updateCartItemDto.Quantity);
//                 return Ok();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error updating cart item");
//                 return StatusCode(500, "An error occurred while updating cart item");
//             }
//         }        [HttpDelete("items/{itemId}")]
//         public async Task<ActionResult> RemoveCartItem(int itemId)
//         {
//             try
//             {
//                 var userId = GetUserId();
//                 // Remove authorization check for testing
//                 // if (string.IsNullOrEmpty(userId))
//                 // {
//                 //     return Unauthorized();
//                 // }

//                 var cart = await _cartService.GetCartWithItemsAsync(userId);
//                 if (cart == null)
//                 {
//                     return NotFound("Shopping cart not found");
//                 }

//                 var cartItem = cart.Items.FirstOrDefault(i => i.Id == itemId);
//                 if (cartItem == null)
//                 {
//                     return NotFound("Cart item not found");
//                 }

//                 await _cartService.RemoveItemFromCartAsync(userId, itemId);
//                 return Ok();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error removing item from cart");
//                 return StatusCode(500, "An error occurred while removing item from cart");
//             }
//         }        [HttpDelete("clear")]
//         public async Task<ActionResult> ClearCart()
//         {
//             try
//             {
//                 var userId = GetUserId();
//                 // Remove authorization check for testing
//                 // if (string.IsNullOrEmpty(userId))
//                 // {
//                 //     return Unauthorized();
//                 // }

//                 await _cartService.ClearCartAsync(userId);
//                 return Ok();
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error clearing cart");
//                 return StatusCode(500, "An error occurred while clearing the cart");
//             }
//         }
//     }
// }
