export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
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
  stockQuantity?: number;
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