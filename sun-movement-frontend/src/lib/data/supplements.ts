"use client";

import { Product } from "../types";

// Supplements data
export const supplements: Product[] = [
  {
    id: "supp-1",
    name: "Whey Protein Isolate",
    description: "Protein whey đạm tinh khiết hấp thu nhanh, hỗ trợ tăng cơ hiệu quả.",
    price: 850000,
    salePrice: 799000,
    imageUrl: "/images/supplements/protein.jpg",
    category: "protein",
    brand: "Sun Performance",
    rating: 4.9,
    reviews: 28,
    isNew: true,
    isBestseller: true,
  },
  {
    id: "supp-2",
    name: "Pre-Workout Energy",
    description: "Năng lượng tập luyện tăng cường sức mạnh và sức bền trong mỗi buổi tập.",
    price: 650000,
    salePrice: null,
    imageUrl: "/images/supplements/pre-workout.jpg",
    category: "pre-workout",
    brand: "Sun Performance",
    rating: 4.7,
    reviews: 15,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "supp-3",
    name: "BCAA 2:1:1",
    description: "Hỗ trợ phục hồi cơ bắp và giảm đau nhức sau tập luyện cường độ cao.",
    price: 450000,
    salePrice: 399000,
    imageUrl: "/images/supplements/bcaa.jpg",
    category: "amino-acids",
    brand: "Sun Performance",
    rating: 4.5,
    reviews: 12,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "supp-4",
    name: "Vitamin Complex",
    description: "Hỗn hợp vitamin và khoáng chất thiết yếu cho sức khỏe tổng thể và hỗ trợ miễn dịch.",
    price: 350000,
    salePrice: null,
    imageUrl: "/images/supplements/vitamins.jpg",
    category: "vitamins",
    brand: "Sun Wellness",
    rating: 4.8,
    reviews: 20,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "supp-5",
    name: "Creatine Monohydrate",
    description: "Tăng sức mạnh và hiệu suất tập luyện, hỗ trợ phát triển cơ bắp nhanh chóng.",
    price: 400000,
    salePrice: null,
    imageUrl: "/images/supplements/creatine.jpg",
    category: "performance",
    brand: "Sun Performance",
    rating: 4.9,
    reviews: 32,
    isNew: false,
    isBestseller: true,
  },
  {
    id: "supp-6",
    name: "Mass Gainer",
    description: "Bổ sung calo và protein chất lượng cao cho người khó tăng cân và phát triển cơ bắp.",
    price: 750000,
    salePrice: 699000,
    imageUrl: "/images/supplements/mass-gainer.jpg",
    category: "weight-gain",
    brand: "Sun Performance",
    rating: 4.6,
    reviews: 18,
    isNew: false,
    isBestseller: false,
  },
  {
    id: "supp-7",
    name: "Omega-3 Fish Oil",
    description: "Dầu cá omega-3 hỗ trợ sức khỏe tim mạch và giảm viêm sau tập luyện.",
    price: 320000,
    salePrice: null,
    imageUrl: "/images/supplements/vitamins.jpg", // Placeholder image
    category: "vitamins",
    brand: "Sun Wellness",
    rating: 4.7,
    reviews: 14,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "supp-8",
    name: "ZMA Complex",
    description: "Hỗ trợ giấc ngủ sâu và phục hồi cơ bắp với kẽm, magiê và vitamin B6.",
    price: 380000,
    salePrice: 349000,
    imageUrl: "/images/supplements/pre-workout.jpg", // Placeholder image
    category: "recovery",
    brand: "Sun Performance",
    rating: 4.5,
    reviews: 9,
    isNew: false,
    isBestseller: false,
  },
];

// Category options for filter
export const supplementCategories = [
  { value: "all", label: "Tất cả", count: supplements.length },
  { value: "protein", label: "Protein", count: supplements.filter(p => p.category === "protein").length },
  { value: "pre-workout", label: "Pre-Workout", count: supplements.filter(p => p.category === "pre-workout").length },
  { value: "amino-acids", label: "Amino Acids", count: supplements.filter(p => p.category === "amino-acids").length },
  { value: "vitamins", label: "Vitamin & Minerals", count: supplements.filter(p => p.category === "vitamins").length },
  { value: "performance", label: "Hiệu suất", count: supplements.filter(p => p.category === "performance").length },
  { value: "weight-gain", label: "Tăng cân", count: supplements.filter(p => p.category === "weight-gain").length },
  { value: "recovery", label: "Phục hồi", count: supplements.filter(p => p.category === "recovery").length },
];

// Brand options for filter
export const supplementBrands = [
  { value: "all", label: "Tất cả" },
  { value: "Sun Performance", label: "Sun Performance" },
  { value: "Sun Wellness", label: "Sun Wellness" },
];

// Sort options
export const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
];
