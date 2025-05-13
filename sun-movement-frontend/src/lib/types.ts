export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  category: string;
  details?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}