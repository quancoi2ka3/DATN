using AutoMapper;
using SunMovement.Core.DTOs;
using SunMovement.Core.Models;

namespace SunMovement.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Shopping Cart Mappings - DTO mappings only
            CreateMap<ShoppingCart, ShoppingCartDto>();
            CreateMap<CartItem, CartItemDto>();

            // Product Mappings (placeholder - update with actual properties)
            CreateMap<Product, ProductDto>();
            CreateMap<Service, ServiceDto>();
        }
    }
}
