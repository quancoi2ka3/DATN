using AutoMapper;
using SunMovement.Core.DTOs;
using SunMovement.Core.Models;

namespace SunMovement.Core.Mappings
{
    public class MappingProfile : Profile
    {        public MappingProfile()
        {
            // Shopping Cart Mappings - DTO mappings only
            CreateMap<ShoppingCart, ShoppingCartDto>();
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.CartId, opt => opt.MapFrom(src => src.ShoppingCartId))
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => 
                    src.Product != null ? src.Product.Name : 
                    src.Service != null ? src.Service.Name : 
                    src.ItemName))
                .ForMember(dest => dest.ItemImageUrl, opt => opt.MapFrom(src => 
                    src.Product != null ? src.Product.ImageUrl : 
                    src.Service != null ? src.Service.ImageUrl : 
                    src.ItemImageUrl))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => 
                    src.Product != null ? src.Product.Price : 
                    src.Service != null ? src.Service.Price : 
                    src.UnitPrice));

            // Product Mappings (placeholder - update with actual properties)
            CreateMap<Product, ProductDto>();
            CreateMap<Service, ServiceDto>();
        }
    }
}
