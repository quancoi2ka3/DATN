using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Web.ViewModels;

namespace SunMovement.Web.Controllers
{
    [Authorize]
    public class CartController : Controller
    {
        private readonly IProductService _productService;
        private readonly IServiceService _serviceService;
        private readonly IMapper _mapper;
        private readonly ILogger<CartController> _logger;

       

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

       

        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartViewModel viewModel)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return RedirectToAction("Login", "Account");
                }

                if (viewModel.ProductId == null && viewModel.ServiceId == null)
                {
                    TempData["ErrorMessage"] = "Either Product or Service must be selected";
                    return RedirectToAction("Details", viewModel.ProductId.HasValue ? "Products" : "Services", new { id = viewModel.ProductId ?? viewModel.ServiceId });
                }

                if (viewModel.Quantity <= 0)
                {
                    viewModel.Quantity = 1;
                }

                string itemName = "";
                string imageUrl = "";
                decimal unitPrice = 0;

                if (viewModel.ProductId.HasValue)
                {
                    var product = await _productService.GetProductByIdAsync(viewModel.ProductId.Value);
                    if (product == null)
                    {
                        TempData["ErrorMessage"] = "Product not found";
                        return RedirectToAction("Index", "Products");
                    }
                    itemName = product.Name;
                    imageUrl = product.ImageUrl;
                    unitPrice = product.Price;
                }
                else if (viewModel.ServiceId.HasValue)
                {
                    var service = await _serviceService.GetServiceByIdAsync(viewModel.ServiceId.Value);
                    if (service == null)
                    {
                        TempData["ErrorMessage"] = "Service not found";
                        return RedirectToAction("Index", "Services");
                    }
                    itemName = service.Name;
                    imageUrl = service.ImageUrl;
                    unitPrice = service.Price;
                }

                

                TempData["SuccessMessage"] = "Item added to cart successfully";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to cart");
                TempData["ErrorMessage"] = "An error occurred while adding item to cart";
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCartItem(int itemId, int quantity)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return RedirectToAction("Login", "Account");
                }

                if (quantity <= 0)
                {
                    quantity = 1;
                }

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item");
                TempData["ErrorMessage"] = "An error occurred while updating cart item";
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public async Task<IActionResult> RemoveCartItem(int itemId)
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return RedirectToAction("Login", "Account");
                }

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from cart");
                TempData["ErrorMessage"] = "An error occurred while removing item from cart";
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return RedirectToAction("Login", "Account");
                }

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                TempData["ErrorMessage"] = "An error occurred while clearing the cart";
                return RedirectToAction("Index");
            }
        }

        
    }
}
