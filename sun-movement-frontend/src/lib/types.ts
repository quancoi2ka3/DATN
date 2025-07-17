export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  originalPrice?: number; // Add this field
  discount?: number; // Add this field
  imageUrl: string;
  category: number|string;
  subCategory?: string; // Use number for category ID or string for category slug
  details?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  StockQuantity : number;
  specifications?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  addedAt: Date;
}