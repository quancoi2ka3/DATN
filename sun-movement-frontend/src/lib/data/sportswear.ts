"use client";

import { Product } from "../types";

// Sportswear products
export const sportswear: Product[] = [
  {
    id: "sw-1",
    name: "Áo Polo Đen",
    description: "Vải cà vải polyester - 95% Polyester | 5% Spandex. Có thể tái chế. Thân thiện môi trường.",
    price: 425000,
    imageUrl: "/images/sportswear/polo-black.jpg",
    category: "tops",
    details: `
      - Mặt vải hai bên khác nhau, bên trong êm ái, bên ngoài mát, thấm hút mồ hôi tốt
      - Rất thấm mồ hôi, sản xuất tay áo rất vừa và tạo form đẹp hơn
      - Form ôm Regular Fit phù hợp với nhiều người và nhiều loại cơ thể
      - Khổ vải rộng, năng động, các hoạt động outdoor, thể thao hay đi chơi
      - Phối đồ được với tất cả short quần áo, legging, jeans luôn mang 
      - Màu nhuộm bột không độc hại cho da
      - Trong phức từ dạng Polyester giúp chức áo nhẹ hơn, bền hơn, thoáng khí vẫn giúp vẫn chống nắng
    `,
    colors: ["black", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Sun Movement",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: "sw-2",
    name: "Áo Polo Trắng",
    description: "Vải cà vải polyester - 95% Polyester | 5% Spandex. Có thể tái chế. Thân thiện môi trường.",
    price: 425000,
    imageUrl: "/images/sportswear/polo-white.jpg",
    category: "tops",
    details: `
      - Mặt vải hai bên khác nhau, bên trong êm ái, bên ngoài mát, thấm hút mồ hôi tốt
      - Rất thấm mồ hôi, sản xuất tay áo rất vừa và tạo form đẹp hơn
      - Form ôm Regular Fit phù hợp với nhiều người và nhiều loại cơ thể
      - Khổ vải rộng, năng động, các hoạt động outdoor, thể thao hay đi chơi
      - Phối đồ được với tất cả short quần áo, legging, jeans luôn mang 
      - Màu nhuộm bột không độc hại cho da
      - Trong phức từ dạng Polyester giúp chức áo nhẹ hơn, bền hơn, thoáng khí vẫn giúp vẫn chống nắng
    `,
    colors: ["black", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Sun Movement",
    rating: 4.7,
    reviews: 18,
  },
  {
    id: "sw-3",
    name: "Áo Polo Xám",
    description: "Vải cà vải polyester - 95% Polyester | 5% Spandex. Có thể tái chế. Thân thiện môi trường.",
    price: 425000,
    imageUrl: "/images/sportswear/polo-gray.jpg",
    category: "tops",
    details: `
      - Mặt vải hai bên khác nhau, bên trong êm ái, bên ngoài mát, thấm hút mồ hôi tốt
      - Rất thấm mồ hôi, sản xuất tay áo rất vừa và tạo form đẹp hơn
      - Form ôm Regular Fit phù hợp với nhiều người và nhiều loại cơ thể
      - Khổ vải rộng, năng động, các hoạt động outdoor, thể thao hay đi chơi
      - Phối đồ được với tất cả short quần áo, legging, jeans luôn mang 
      - Màu nhuộm bột không độc hại cho da
      - Trong phức từ dạng Polyester giúp chức áo nhẹ hơn, bền hơn, thoáng khí vẫn giúp vẫn chống nắng
    `,
    colors: ["black", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Sun Movement",
    rating: 4.6,
    reviews: 15,
  },
  {
    id: "sw-4",
    name: "Quần Short Movement",
    description: "Quần short thể thao với chất liệu nhẹ, thoáng khí và co giãn tốt.",
    price: 320000,
    imageUrl: "/images/sportswear/shorts.jpg",
    category: "bottoms",
    details: `
      - Chất liệu nhẹ và co giãn, thoáng mát khi vận động
      - Có túi hai bên tiện lợi
      - Lưng thun co giãn với dây rút điều chỉnh
      - Thiết kế tối giản với logo Movement nhỏ ở góc
      - Phù hợp cho tập luyện và mặc hàng ngày
    `,
    colors: ["black", "gray", "navy"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Sun Movement",
    rating: 4.7,
    reviews: 20,
  },
  {
    id: "sw-5",
    name: "Áo khoác gió SUN",
    description: "Áo khoác gió nhẹ, chống thấm nước, thích hợp cho hoạt động ngoài trời.",
    price: 550000,
    imageUrl: "/images/sportswear/jacket.jpg",
    category: "outerwear",
    details: `
      - Chất liệu chống thấm nước, chống gió
      - Nhẹ và dễ dàng gấp gọn mang theo
      - Có mũ trùm đầu và túi khóa kéo
      - Logo Sun Movement phản quang
      - Thiết kế đường may tỉ mỉ
      - Phù hợp cho hoạt động ngoài trời và đi lại hàng ngày
    `,
    colors: ["black", "blue", "red"],
    sizes: ["S", "M", "L", "XL"],
    brand: "Sun Movement",
    rating: 4.9,
    reviews: 28,
  },
  {
    id: "sw-6",
    name: "Balo Movement",
    description: "Balo thể thao chất lượng cao với nhiều ngăn đựng đồ, tiện lợi cho việc đi tập.",
    price: 650000,
    imageUrl: "/images/sportswear/backpack.jpg",
    category: "accessories",
    details: `
      - Nhiều ngăn tiện dụng
      - Ngăn đựng giày riêng biệt
      - Chất liệu chống thấm nước
      - Đệm lưng thoáng khí
      - Dây đeo được tối ưu cho vai
      - Logo Movement phản quang
    `,
    colors: ["black", "gray"],
    sizes: ["One Size"],
    brand: "Sun Movement",
    rating: 4.8,
    reviews: 22,
    isNew: true,
  }
];

// Category options for filter
export const sportswearCategories = [
  { value: "all", label: "Tất cả" },
  { value: "tops", label: "Áo" },
  { value: "bottoms", label: "Quần" },
  { value: "outerwear", label: "Áo khoác" },
  { value: "accessories", label: "Phụ kiện" },
];

// Sort options
export const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
];
