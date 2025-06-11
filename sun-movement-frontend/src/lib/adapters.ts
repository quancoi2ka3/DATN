'use client';

import { Product } from "@/lib/types";

// Define the backend data structure based on the API response
export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string;
  stockQuantity: number;
  category: string|number;
  subCategory?: string;
  specifications?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Converts a backend ProductDto to a frontend Product model
 * @param dto The data transfer object from the backend
 * @returns A properly formatted Product for the frontend
 */


/**
 * Helper function to extract colors from specifications string
 */
export function extractColors(specifications: string): string[] {
  // This is a simple implementation - adjust based on your actual data format
  const colorMatch = specifications.match(/colors?:([^;]+)/i);
  if (colorMatch && colorMatch[1]) {
    return colorMatch[1].split(',').map(color => color.trim());
  }
  return [];
}

/**
 * Helper function to extract sizes from specifications string
 */
export function extractSizes(specifications: string): string[] {
  // This is a simple implementation - adjust based on your actual data format
  const sizeMatch = specifications.match(/sizes?:([^;]+)/i);
  if (sizeMatch && sizeMatch[1]) {
    return sizeMatch[1].split(',').map(size => size.trim());
  }
  return [];
}

/**
 * Helper function to determine if a product is new (within the last 30 days)
 */
export function isNewProduct(product: ProductDto): boolean {
  if (!product.createdAt) return false;
  
  const createdDate = new Date(product.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return createdDate >= thirtyDaysAgo;
}
