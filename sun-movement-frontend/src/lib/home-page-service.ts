"use server";

import { Product } from "./types";
import { ProductDto } from "./adapters";

// Fetch featured products for a specific category
export async function getFeaturedProductsByCategory(category: string): Promise<{products: Product[], error?: string}> {
  try {
    // Use a more robust URL construction with fallback
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const url = `${backendUrl}/api/products/category/${category}`;
    
    console.log(`Attempting to fetch from: ${url}`);
    
    const response = await fetch(url, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API returned status ${response.status} for ${category}`);
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data: ProductDto[] = await response.json();
    console.log(`Successfully fetched ${data.length} products for category: ${category}`);
    
    // Return the fetched products
    return { products: data as unknown as Product[] };
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return {
      products: [], // Return empty array instead of undefined
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Get home page data with all required products
export async function getHomePageData() {
  // Fetch featured sportswear products
  const { products: sportswearProducts, error: sportswearError } = await getFeaturedProductsByCategory('sportswear');
  
  // Fetch featured supplements products
  const { products: supplementsProducts, error: supplementsError } = await getFeaturedProductsByCategory('supplements');

  return {
    sportswear: {
      products: sportswearProducts,
      error: sportswearError
    },
    supplements: {
      products: supplementsProducts,
      error: supplementsError
    }
  };
}
