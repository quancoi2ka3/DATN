"use client";

import { Product } from "../types";

// Supplements data
export const supplements: Product[] = [
  
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
