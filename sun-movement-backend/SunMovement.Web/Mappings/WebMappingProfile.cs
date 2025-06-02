using AutoMapper;
using SunMovement.Core.DTOs;
using SunMovement.Core.Models;
using SunMovement.Web.ViewModels;

namespace SunMovement.Web.Mappings
{
    public class WebMappingProfile : Profile
    {
        public WebMappingProfile()
        {
            // Shopping Cart ViewModel Mappings
            CreateMap<ShoppingCart, ShoppingCartViewModel>();
            CreateMap<CartItem, CartItemViewModel>();
            
            // DTO to ViewModel Mappings
            CreateMap<ShoppingCartDto, ShoppingCartViewModel>();
            CreateMap<CartItemDto, CartItemViewModel>();
        }
    }
}
