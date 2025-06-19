export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  subCategory?: string;
  specifications?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  stockQuantity?: number;
  isBestseller?: boolean;
  colors?: string[];
  sizes?: string[];
  details?: string;
}

export interface ApiResponse<T> {
  data?: T;
  count?: number;
}

class ProductService {
  private readonly baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001';
    console.log('ProductService initialized with baseUrl:', this.baseUrl);
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/api/products`;
      console.log('Fetching all products from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Products response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data.length, 'products');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const url = `${this.baseUrl}/api/products/${id}`;
      console.log('Fetching product by ID from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/api/products/category/${category}`;
      console.log('Fetching products by category from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Products by category response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products by category fetched successfully:', data.length, 'products');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Get supplements products (category = 1)
  async getSupplementsProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/api/products/category/supplements`;
      console.log('Fetching supplements from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Supplements response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Supplements fetched successfully:', data.length, 'products');
      return this.mapToFrontendProducts(data);
    } catch (error) {
      console.error('Error fetching supplements:', error);
      return [];
    }
  }

  // Get sportswear products (category = 0)
  async getSportswearProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/api/products/category/sportswear`;
      console.log('Fetching sportswear from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Sportswear response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Sportswear fetched successfully:', data.length, 'products');
      return this.mapToFrontendProducts(data);
    } catch (error) {
      console.error('Error fetching sportswear:', error);
      return [];
    }
  }

  // Helper method to map backend products to frontend format
  private mapToFrontendProducts(backendProducts: any[]): Product[] {
    return backendProducts.map(item => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      discountPrice: item.discountPrice || undefined,
      imageUrl: item.imageUrl || "/images/default-product.jpg",
      category: item.category === 0 ? "sportswear" : "supplements",
      subCategory: item.subCategory || "general",
      specifications: item.specifications || "",
      isFeatured: !!item.isFeatured,
      isActive: !!item.isActive,
      stockQuantity: item.stockQuantity || 0,
      isBestseller: !!item.isFeatured // Use featured as bestseller for now
    }));
  }
}

export const productService = new ProductService();
export default productService;
