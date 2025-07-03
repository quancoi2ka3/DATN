import { NextRequest, NextResponse } from 'next/server';

// Mock data for trending products
const mockTrendingProducts = [
  {
    id: 1,
    name: "Áo thun thể thao Premium",
    price: 299000,
    image: "/images/products/sportswear/ao-thun-1.jpg",
    category: "Sportswear",
    rating: 4.8,
    reviews: 127
  },
  {
    id: 2,
    name: "Quần short tập gym",
    price: 199000,
    image: "/images/products/sportswear/quan-short-1.jpg",
    category: "Sportswear",
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Whey Protein Isolate",
    price: 899000,
    image: "/images/products/supplements/whey-protein-1.jpg",
    category: "Supplements",
    rating: 4.9,
    reviews: 203
  },
  {
    id: 4,
    name: "BCAA Energy Boost",
    price: 599000,
    image: "/images/products/supplements/bcaa-1.jpg",
    category: "Supplements",
    rating: 4.7,
    reviews: 156
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '4');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return requested number of products
    const products = mockTrendingProducts.slice(0, count);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
