using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Data
{
    public static class SeedProducts
    {
        public static async Task SeedSportswearProductsAsync(ApplicationDbContext context)
        {
            // Kiểm tra xem đã có các sản phẩm Sportswear này chưa
            if (await context.Products.AnyAsync(p => p.Name == "Áo Polo Sun Movement" || p.Name == "Short da cá Sun Movement"))
            {
                return; // Nếu đã có rồi thì không thêm nữa
            }

            var products = new List<Product>
            {
                // 1. Áo Polo
                new Product
                {
                    Name = "Áo Polo Sun Movement",
                    Description = "Áo Polo thể thao chất liệu vải cá sấu polyester cao cấp. Vải co giãn 4 chiều tạo cảm giác thoải mái khi mặc. Bo chun tay áo, kẻ viền tay áo và cổ áo tạo nét cá tính. Form áo Regular Fit phù hợp với nhiều người sử dụng (cả nam và nữ).",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 425000m,
                    CostPrice = 300000m,
                    ImageUrl = "/images/products/ao-polo-den.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 100,
                    MinimumStockLevel = 10,
                    OptimalStockLevel = 50,
                    Weight = 200, // grams
                    Dimensions = "70x50x2", // L x W x H in cm
                    Specifications = JsonSerializer.Serialize(new
                    {
                        Material = "95% Polyester, 5% Spandex",
                        Features = "Vải co giãn 4 chiều, thoáng khí",
                        Care = "Có thể tái chế. Thân thiện với môi trường."
                    }),
                    Slug = "ao-polo-sun-movement",
                    MetaTitle = "Áo Polo Sun Movement - Áo thể thao chất lượng cao",
                    MetaDescription = "Áo Polo thể thao Sun Movement chất liệu vải cá sấu polyester co giãn 4 chiều, form Regular Fit phù hợp với mọi người.",
                    MetaKeywords = "áo polo, sun movement, thể thao, polyester",
                    CreatedAt = DateTime.UtcNow,
                    TrackInventory = true
                },
                
                // 2. Short da cá
                new Product
                {
                    Name = "Short da cá Sun Movement",
                    Description = "Quần short da cá với chất vải mềm mại, co giãn tốt. Vải co giãn 4 chiều tạo cảm giác thoải mái khi mặc. Cạp chun bản rộng kết hợp dây rút khiến quần chắc chắn hơn. Form quần Regular Fit phù hợp với nhiều người sử dụng.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 255000m,
                    CostPrice = 180000m,
                    ImageUrl = "/images/products/short-da-ca-xam.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 100,
                    MinimumStockLevel = 10,
                    OptimalStockLevel = 50,
                    Weight = 180, // grams
                    Dimensions = "45x35x2", // L x W x H in cm
                    Specifications = JsonSerializer.Serialize(new
                    {
                        Material = "60% polyester, 35% cotton, 5% spandex",
                        Features = "Vải co giãn 4 chiều, thoáng khí",
                        Care = "Có thể tái chế. Thân thiện với môi trường."
                    }),
                    Slug = "short-da-ca-sun-movement",
                    MetaTitle = "Short da cá Sun Movement - Quần thể thao chất lượng cao",
                    MetaDescription = "Quần short da cá Sun Movement chất liệu mềm mại co giãn 4 chiều, form Regular Fit phù hợp với mọi người.",
                    MetaKeywords = "quần short, short da cá, sun movement, thể thao",
                    CreatedAt = DateTime.UtcNow,
                    TrackInventory = true
                },
                
                // 3. T-Shirt Training
                new Product
                {
                    Name = "T-Shirt Training Sun Movement",
                    Description = "Áo siêu nhẹ, siêu mềm, có khả năng co giãn 4 chiều và thấm hút mồ hôi giúp tốt giúp người tập luyện thể dục thể thao luôn có cảm giác thoải mái, đặc biệt trong các môn vận động cường độ cao. Form áo Slim Fit giúp tôn dáng thể thao. Thiết kế áo phù hợp nhất cho các hoạt động tập luyện.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 375000m,
                    CostPrice = 270000m,
                    ImageUrl = "/images/products/tshirt-training-do.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 100,
                    MinimumStockLevel = 10,
                    OptimalStockLevel = 50,
                    Weight = 150, // grams
                    Dimensions = "70x50x2", // L x W x H in cm
                    Specifications = JsonSerializer.Serialize(new
                    {
                        Material = "95% Polyester, 5% Spandex",
                        Features = "Co giãn 4 chiều, thấm hút mồ hôi",
                        Care = "Có thể tái chế. Thân thiện với môi trường."
                    }),
                    Slug = "tshirt-training-sun-movement",
                    MetaTitle = "T-Shirt Training Sun Movement - Áo tập luyện chất lượng cao",
                    MetaDescription = "Áo T-Shirt Training Sun Movement siêu nhẹ, co giãn 4 chiều và thấm hút mồ hôi, form Slim Fit tôn dáng thể thao.",
                    MetaKeywords = "áo t-shirt, training, sun movement, thể thao",
                    CreatedAt = DateTime.UtcNow,
                    TrackInventory = true
                },
                
                // 4. T-Shirt Casual
                new Product
                {
                    Name = "T-Shirt Casual Pull Up Sun Movement",
                    Description = "Áo siêu nhẹ, siêu mềm, có khả năng co giãn 4 chiều và thấm hút mồ hôi giúp người mặc luôn cảm thấy thoải mái dù là lúc bình thường hay vận động. Form áo Regular Fit giúp tôn dáng thể thao. Áo không nhăn khi giặt, hình in siêu bền. Thiết kế với slogan có động thể thao (Pull up or Shut up) và tên bộ môn Calisthenics mang đậm cá tính.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 355000m,
                    CostPrice = 255000m,
                    ImageUrl = "/images/products/tshirt-casual-den.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 100,
                    MinimumStockLevel = 10,
                    OptimalStockLevel = 50,
                    Weight = 170, // grams
                    Dimensions = "70x50x2", // L x W x H in cm
                    Specifications = JsonSerializer.Serialize(new
                    {
                        Material = "57% Cotton, 38% Polyester, 5% Spandex",
                        Features = "Co giãn 4 chiều, thoáng khí",
                        Care = "Có thể tái chế. Thân thiện với môi trường."
                    }),
                    Slug = "tshirt-casual-pull-up-sun-movement",
                    MetaTitle = "T-Shirt Casual Pull Up Sun Movement - Áo thể thao thời trang",
                    MetaDescription = "Áo T-Shirt Casual Sun Movement với slogan Pull Up or Shut Up, chất liệu co giãn 4 chiều, form Regular Fit phù hợp với mọi người.",
                    MetaKeywords = "áo t-shirt, casual, sun movement, pull up, calisthenics",
                    CreatedAt = DateTime.UtcNow,
                    TrackInventory = true
                }
            };

            // Thêm sản phẩm vào cơ sở dữ liệu
            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            // Tạo biến variants để lưu trữ tất cả các biến thể
            var variants = new List<ProductVariant>();

            // Thêm variants cho Áo Polo (đen, trắng, xám)
            var poloDen = products[0];
            var poloColors = new[] { "Đen", "Trắng", "Xám" };
            var poloSizes = new[] { "S", "M", "L", "XL" };
            var poloImages = new[]
            {
                "/images/products/ao-polo-den.webp",
                "/images/products/ao-polo-trang.webp",
                "/images/products/ao-polo-xam.webp"
            };

            foreach (var color in poloColors)
            {
                foreach (var size in poloSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = poloDen.Id,
                        Name = $"Áo Polo {color} - {size}",
                        Sku = $"POLO-{color}-{size}",
                        Price = 425000m,
                        CostPrice = 300000m,
                        StockQuantity = 25,
                        Attributes = JsonSerializer.Serialize(new { Color = color, Size = size }),
                        ImageUrl = poloImages[Array.IndexOf(poloColors, color)],
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Thêm variants cho Short da cá (chỉ có màu xám)
            var shortDaCa = products[1];
            var shortSizes = new[] { "S", "M", "L", "XL" };
            
            foreach (var size in shortSizes)
            {
                variants.Add(new ProductVariant
                {
                    ProductId = shortDaCa.Id,
                    Name = $"Short da cá Xám - {size}",
                    Sku = $"SHORT-XAM-{size}",
                    Price = 255000m,
                    CostPrice = 180000m,
                    StockQuantity = 25,
                    Attributes = JsonSerializer.Serialize(new { Color = "Xám", Size = size }),
                    ImageUrl = "/images/products/short-da-ca-xam.webp",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Thêm variants cho T-Shirt Training (đỏ, xám, navy, tím đen)
            var tshirtTraining = products[2];
            var trainingColors = new[] { "Đỏ", "Xám", "Navy", "Tím đen" };
            var trainingSizes = new[] { "S", "M", "L", "XL" };
            var trainingImages = new[]
            {
                "/images/products/tshirt-training-do.webp",
                "/images/products/tshirt-training-xam.webp",
                "/images/products/tshirt-training-navy.webp",
                "/images/products/tshirt-training-tim-den.webp"
            };

            foreach (var color in trainingColors)
            {
                foreach (var size in trainingSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = tshirtTraining.Id,
                        Name = $"T-Shirt Training {color} - {size}",
                        Sku = $"TRAINING-{color}-{size}",
                        Price = 375000m,
                        CostPrice = 270000m,
                        StockQuantity = 25,
                        Attributes = JsonSerializer.Serialize(new { Color = color, Size = size }),
                        ImageUrl = trainingImages[Array.IndexOf(trainingColors, color)],
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Thêm variants cho T-Shirt Casual (đen, trắng)
            var tshirtCasual = products[3];
            var casualColors = new[] { "Đen", "Trắng" };
            var casualSizes = new[] { "S", "M", "L", "XL" };
            var casualImages = new[]
            {
                "/images/products/tshirt-casual-den.webp",
                "/images/products/tshirt-casual-trang.webp"
            };

            foreach (var color in casualColors)
            {
                foreach (var size in casualSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = tshirtCasual.Id,
                        Name = $"T-Shirt Casual {color} - {size}",
                        Sku = $"CASUAL-{color}-{size}",
                        Price = 355000m,
                        CostPrice = 255000m,
                        StockQuantity = 25,
                        Attributes = JsonSerializer.Serialize(new { Color = color, Size = size }),
                        ImageUrl = casualImages[Array.IndexOf(casualColors, color)],
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Thêm các biến thể vào cơ sở dữ liệu
            await context.ProductVariants.AddRangeAsync(variants);
            await context.SaveChangesAsync();

            // Thêm hình ảnh cho các sản phẩm
            var productImages = new List<ProductImage>();

            // Hình ảnh cho Áo Polo
            productImages.AddRange(new[]
            {
                new ProductImage
                {
                    ProductId = poloDen.Id,
                    ImageUrl = "/images/products/ao-polo-den.webp",
                    AltText = "Áo Polo Sun Movement màu đen",
                    IsPrimary = true,
                    SortOrder = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = poloDen.Id,
                    ImageUrl = "/images/products/ao-polo-trang.webp",
                    AltText = "Áo Polo Sun Movement màu trắng",
                    IsPrimary = false,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = poloDen.Id,
                    ImageUrl = "/images/products/ao-polo-xam.webp",
                    AltText = "Áo Polo Sun Movement màu xám",
                    IsPrimary = false,
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow
                }
            });

            // Hình ảnh cho Short da cá
            productImages.Add(new ProductImage
            {
                ProductId = shortDaCa.Id,
                ImageUrl = "/images/products/short-da-ca-xam.webp",
                AltText = "Short da cá Sun Movement màu xám",
                IsPrimary = true,
                SortOrder = 0,
                CreatedAt = DateTime.UtcNow
            });

            // Hình ảnh cho T-Shirt Training
            productImages.AddRange(new[]
            {
                new ProductImage
                {
                    ProductId = tshirtTraining.Id,
                    ImageUrl = "/images/products/tshirt-training-do.webp",
                    AltText = "T-Shirt Training Sun Movement màu đỏ",
                    IsPrimary = true,
                    SortOrder = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = tshirtTraining.Id,
                    ImageUrl = "/images/products/tshirt-training-xam.webp",
                    AltText = "T-Shirt Training Sun Movement màu xám",
                    IsPrimary = false,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = tshirtTraining.Id,
                    ImageUrl = "/images/products/tshirt-training-navy.webp",
                    AltText = "T-Shirt Training Sun Movement màu navy",
                    IsPrimary = false,
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = tshirtTraining.Id,
                    ImageUrl = "/images/products/tshirt-training-tim-den.webp",
                    AltText = "T-Shirt Training Sun Movement màu tím đen",
                    IsPrimary = false,
                    SortOrder = 3,
                    CreatedAt = DateTime.UtcNow
                }
            });

            // Hình ảnh cho T-Shirt Casual
            productImages.AddRange(new[]
            {
                new ProductImage
                {
                    ProductId = tshirtCasual.Id,
                    ImageUrl = "/images/products/tshirt-casual-den.webp",
                    AltText = "T-Shirt Casual Pull Up Sun Movement màu đen",
                    IsPrimary = true,
                    SortOrder = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new ProductImage
                {
                    ProductId = tshirtCasual.Id,
                    ImageUrl = "/images/products/tshirt-casual-trang.webp",
                    AltText = "T-Shirt Casual Pull Up Sun Movement màu trắng",
                    IsPrimary = false,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                }
            });

            // Thêm hình ảnh vào cơ sở dữ liệu
            await context.ProductImages.AddRangeAsync(productImages);
            await context.SaveChangesAsync();

            // Thêm 16 sản phẩm thể thao khác để đủ 20 sản phẩm
            var extraProducts = new List<Product>
            {
                // 5. Quần dài thể thao
                new Product
                {
                    Name = "Quần thể thao dài Sun Movement",
                    Description = "Quần dài thể thao chất liệu co giãn cao cấp, thoáng khí và thoát mồ hôi tốt. Thiết kế hiện đại với túi khóa kéo an toàn cho đồ cá nhân. Phù hợp cho tập luyện và đi lại hàng ngày.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 450000m,
                    CostPrice = 320000m,
                    ImageUrl = "/images/products/quan-the-thao-dai.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 80,
                    Specifications = JsonSerializer.Serialize(new { Material = "90% Polyester, 10% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 6. Áo thun thể thao nam
                new Product
                {
                    Name = "Áo thun thể thao nam Sun Movement",
                    Description = "Áo thun thể thao nam thiết kế đơn giản, trẻ trung với chất liệu thấm hút mồ hôi tốt. Phù hợp cho các hoạt động thể thao và đi lại hàng ngày.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 320000m,
                    CostPrice = 220000m,
                    ImageUrl = "/images/products/ao-thun-the-thao-nam.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 90,
                    Specifications = JsonSerializer.Serialize(new { Material = "100% Polyester" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 7. Áo thun thể thao nữ
                new Product
                {
                    Name = "Áo thun thể thao nữ Sun Movement",
                    Description = "Áo thun thể thao nữ thiết kế ôm body, tôn dáng với chất liệu co giãn 4 chiều. Thấm hút mồ hôi tốt, phù hợp cho các hoạt động thể thao và tập luyện.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 320000m,
                    CostPrice = 220000m,
                    ImageUrl = "/images/products/ao-thun-the-thao-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 90,
                    Specifications = JsonSerializer.Serialize(new { Material = "92% Polyester, 8% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 8. Quần short thể thao nam
                new Product
                {
                    Name = "Quần short thể thao nam Sun Movement",
                    Description = "Quần short thể thao nam chất liệu nhẹ, thoáng khí với túi khóa kéo an toàn. Thiết kế hiện đại, phù hợp cho chạy bộ và các hoạt động thể thao ngoài trời.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 280000m,
                    CostPrice = 190000m,
                    ImageUrl = "/images/products/quan-short-the-thao-nam.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 85,
                    Specifications = JsonSerializer.Serialize(new { Material = "100% Polyester" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 9. Quần legging nữ
                new Product
                {
                    Name = "Quần legging thể thao nữ Sun Movement",
                    Description = "Quần legging thể thao nữ co giãn 4 chiều, ôm dáng tôn hình thể. Chất liệu cao cấp không xù lông, không nhăn, bền màu theo thời gian.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 350000m,
                    CostPrice = 240000m,
                    ImageUrl = "/images/products/quan-legging-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 75,
                    Specifications = JsonSerializer.Serialize(new { Material = "88% Polyester, 12% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 10. Áo khoác gió thể thao
                new Product
                {
                    Name = "Áo khoác gió thể thao Sun Movement",
                    Description = "Áo khoác gió thể thao chống nước nhẹ, có mũ trùm đầu và túi khóa kéo. Thiết kế hiện đại, phù hợp cho các hoạt động ngoài trời và thể thao.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo khoác",
                    Price = 550000m,
                    CostPrice = 380000m,
                    ImageUrl = "/images/products/ao-khoac-gio.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 60,
                    Specifications = JsonSerializer.Serialize(new { Material = "100% Polyester chống nước" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 11. Áo ba lỗ thể thao nam
                new Product
                {
                    Name = "Áo ba lỗ thể thao nam Sun Movement",
                    Description = "Áo ba lỗ thể thao nam thoáng khí, thấm hút mồ hôi tốt. Thiết kế hiện đại, tôn dáng người mặc, phù hợp cho tập gym và các hoạt động thể thao trong nhà.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 280000m,
                    CostPrice = 190000m,
                    ImageUrl = "/images/products/ao-ba-lo-nam.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 70,
                    Specifications = JsonSerializer.Serialize(new { Material = "100% Polyester" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 12. Áo bra thể thao nữ
                new Product
                {
                    Name = "Áo bra thể thao nữ Sun Movement",
                    Description = "Áo bra thể thao nữ với độ nâng đỡ cao, phù hợp cho các hoạt động thể thao cường độ cao. Chất liệu thấm hút mồ hôi tốt, thoáng khí và co giãn 4 chiều.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 320000m,
                    CostPrice = 220000m,
                    ImageUrl = "/images/products/ao-bra-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 65,
                    Specifications = JsonSerializer.Serialize(new { Material = "80% Nylon, 20% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 13. Quần jogger thể thao
                new Product
                {
                    Name = "Quần jogger thể thao Sun Movement",
                    Description = "Quần jogger thể thao với thiết kế hiện đại, ống quần bo gọn và túi khóa kéo an toàn. Chất liệu nhẹ, thoáng khí và co giãn tốt.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 420000m,
                    CostPrice = 290000m,
                    ImageUrl = "/images/products/quan-jogger.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 80,
                    Specifications = JsonSerializer.Serialize(new { Material = "95% Polyester, 5% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 14. Bộ đồ thể thao nam
                new Product
                {
                    Name = "Bộ đồ thể thao nam Sun Movement",
                    Description = "Bộ đồ thể thao nam gồm áo thun và quần short với thiết kế đồng bộ. Chất liệu nhẹ, thoáng khí và thấm hút mồ hôi tốt, phù hợp cho tập luyện và đi lại hàng ngày.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Bộ đồ thể thao",
                    Price = 550000m,
                    CostPrice = 380000m,
                    ImageUrl = "/images/products/bo-do-the-thao-nam.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 55,
                    Specifications = JsonSerializer.Serialize(new { Material = "100% Polyester" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 15. Bộ đồ thể thao nữ
                new Product
                {
                    Name = "Bộ đồ thể thao nữ Sun Movement",
                    Description = "Bộ đồ thể thao nữ gồm áo bra và quần legging với thiết kế đồng bộ. Chất liệu co giãn 4 chiều, thoáng khí và thấm hút mồ hôi tốt, phù hợp cho yoga, gym và các hoạt động thể thao.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Bộ đồ thể thao",
                    Price = 620000m,
                    CostPrice = 430000m,
                    ImageUrl = "/images/products/bo-do-the-thao-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = true,
                    StockQuantity = 50,
                    Specifications = JsonSerializer.Serialize(new { Material = "85% Polyester, 15% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 16. Áo hoodie thể thao
                new Product
                {
                    Name = "Áo hoodie thể thao Sun Movement",
                    Description = "Áo hoodie thể thao với chất liệu cotton pha polyester mềm mại, ấm áp. Thiết kế hiện đại với túi kangaroo phía trước, phù hợp cho mùa đông và thời tiết se lạnh.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo khoác",
                    Price = 480000m,
                    CostPrice = 330000m,
                    ImageUrl = "/images/products/ao-hoodie.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 60,
                    Specifications = JsonSerializer.Serialize(new { Material = "65% Cotton, 35% Polyester" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 17. Áo thể thao dài tay
                new Product
                {
                    Name = "Áo thể thao dài tay Sun Movement",
                    Description = "Áo thể thao dài tay với chất liệu co giãn, thấm hút mồ hôi tốt. Thiết kế hiện đại với cổ tròn, phù hợp cho thời tiết se lạnh và các hoạt động thể thao ngoài trời.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 380000m,
                    CostPrice = 260000m,
                    ImageUrl = "/images/products/ao-the-thao-dai-tay.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 70,
                    Specifications = JsonSerializer.Serialize(new { Material = "92% Polyester, 8% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 18. Quần short thể thao nữ
                new Product
                {
                    Name = "Quần short thể thao nữ Sun Movement",
                    Description = "Quần short thể thao nữ với chất liệu nhẹ, co giãn và thoáng khí. Thiết kế hiện đại với quần lót bên trong, phù hợp cho chạy bộ và các hoạt động thể thao ngoài trời.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Quần thể thao",
                    Price = 280000m,
                    CostPrice = 190000m,
                    ImageUrl = "/images/products/quan-short-the-thao-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 75,
                    Specifications = JsonSerializer.Serialize(new { Material = "90% Polyester, 10% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 19. Áo tank top thể thao nữ
                new Product
                {
                    Name = "Áo tank top thể thao nữ Sun Movement",
                    Description = "Áo tank top thể thao nữ với thiết kế hiện đại, tôn dáng và thoáng mát. Chất liệu thấm hút mồ hôi tốt, phù hợp cho tập gym và các hoạt động thể thao trong nhà.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 290000m,
                    CostPrice = 200000m,
                    ImageUrl = "/images/products/ao-tank-top-nu.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 80,
                    Specifications = JsonSerializer.Serialize(new { Material = "95% Polyester, 5% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                },

                // 20. Áo giữ nhiệt thể thao
                new Product
                {
                    Name = "Áo giữ nhiệt thể thao Sun Movement",
                    Description = "Áo giữ nhiệt thể thao với công nghệ giữ ấm tiên tiến, thích hợp cho các hoạt động thể thao trong điều kiện thời tiết lạnh. Thiết kế ôm sát, co giãn tốt và thoải mái khi vận động.",
                    Category = ProductCategory.Sportswear,
                    SubCategory = "Áo thể thao",
                    Price = 420000m,
                    CostPrice = 290000m,
                    ImageUrl = "/images/products/ao-giu-nhiet.webp",
                    Status = ProductStatus.Active,
                    IsActive = true,
                    IsFeatured = false,
                    StockQuantity = 65,
                    Specifications = JsonSerializer.Serialize(new { Material = "85% Polyester, 15% Spandex" }),
                    CreatedAt = DateTime.UtcNow
                }
            };

            // Thêm các sản phẩm phụ vào cơ sở dữ liệu
            await context.Products.AddRangeAsync(extraProducts);
            await context.SaveChangesAsync();

            // Thêm variants đơn giản cho các sản phẩm phụ (mỗi sản phẩm 4 kích cỡ)
            var extraVariants = new List<ProductVariant>();
            foreach (var product in extraProducts)
            {
                foreach (var size in new[] { "S", "M", "L", "XL" })
                {
                    extraVariants.Add(new ProductVariant
                    {
                        ProductId = product.Id,
                        Name = $"{product.Name} - {size}",
                        Sku = $"{product.Name.Substring(0, Math.Min(5, product.Name.Length))}-{size}".Replace(" ", ""),
                        Price = product.Price,
                        CostPrice = product.CostPrice,
                        StockQuantity = 20,
                        Attributes = JsonSerializer.Serialize(new { Size = size }),
                        ImageUrl = product.ImageUrl,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Thêm biến thể cho các sản phẩm phụ
            await context.ProductVariants.AddRangeAsync(extraVariants);
            await context.SaveChangesAsync();

            // Thêm hình ảnh cho các sản phẩm phụ
            var extraImages = extraProducts.Select(p => new ProductImage
            {
                ProductId = p.Id,
                ImageUrl = p.ImageUrl,
                AltText = p.Name,
                IsPrimary = true,
                SortOrder = 0,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await context.ProductImages.AddRangeAsync(extraImages);
            await context.SaveChangesAsync();
        }
    }
}
