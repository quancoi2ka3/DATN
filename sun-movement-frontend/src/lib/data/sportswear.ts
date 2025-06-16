"use client";

import { Product } from "../types";

// Sportswear products
export const sportswear: Product[] = [
  
   
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
