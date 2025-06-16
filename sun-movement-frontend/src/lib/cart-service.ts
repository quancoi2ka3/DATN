"use client";

import { CartItem, Product } from "./types";

// Base types for cart API requests and responses
interface AddToCartRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface UpdateCartItemRequest {
  quantity: number;
}

interface CartResponse {
  items: CartItemDto[];
  totalQuantity: number;
  totalPrice: number;
}

interface CartItemDto {
  id: string;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  createdAt: string;
}

// Function to map backend CartItemDto to frontend CartItem
function mapCartItemDtoToCartItem(dto: CartItemDto): CartItem {
  return {
    id: dto.id,
    productId: dto.productId.toString(),
    name: dto.productName,
    imageUrl: dto.productImage || '/images/placeholder.jpg',
    quantity: dto.quantity,
    price: dto.price,
    size: dto.size,
    color: dto.color,
    addedAt: new Date(dto.createdAt),
  };
}

/**
 * Add an item to the cart
 * @param product The product to add
 * @param quantity The quantity to add
 * @param size Optional size selection
 * @param color Optional color selection
 * @returns Updated cart data or error
 */
export async function addToCart(product: Product, quantity: number = 1, size?: string, color?: string): 
  Promise<{ success: boolean; items: CartItem[]; error?: string; totalQuantity: number; totalPrice: number }> {
  try {
    const request: AddToCartRequest = {
      productId: parseInt(product.id),
      quantity,
      size,
      color,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add item to cart: ${errorText}`);
    }

    const data: CartResponse = await response.json();

    return {
      success: true,
      items: data.items.map(mapCartItemDtoToCartItem),
      totalQuantity: data.totalQuantity,
      totalPrice: data.totalPrice
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      items: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      totalQuantity: 0,
      totalPrice: 0
    };
  }
}

/**
 * Fetch the current cart contents
 * @returns Current cart data or error
 */
export async function getCart(): Promise<{ success: boolean; items: CartItem[]; error?: string; totalQuantity: number; totalPrice: number }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get cart: ${errorText}`);
    }

    const data: CartResponse = await response.json();

    return {
      success: true,
      items: data.items.map(mapCartItemDtoToCartItem),
      totalQuantity: data.totalQuantity,
      totalPrice: data.totalPrice
    };
  } catch (error) {
    console.error('Error getting cart:', error);
    return {
      success: false,
      items: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      totalQuantity: 0,
      totalPrice: 0
    };
  }
}

/**
 * Update the quantity of an item in the cart
 * @param cartItemId The ID of the cart item to update
 * @param quantity The new quantity
 * @returns Updated cart data or error
 */
export async function updateCartItem(cartItemId: string, quantity: number): 
  Promise<{ success: boolean; items: CartItem[]; error?: string; totalQuantity: number; totalPrice: number }> {
  try {
    const request: UpdateCartItemRequest = { quantity };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update cart item: ${errorText}`);
    }

    const data: CartResponse = await response.json();

    return {
      success: true,
      items: data.items.map(mapCartItemDtoToCartItem),
      totalQuantity: data.totalQuantity,
      totalPrice: data.totalPrice
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return {
      success: false,
      items: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      totalQuantity: 0,
      totalPrice: 0
    };
  }
}

/**
 * Remove an item from the cart
 * @param cartItemId The ID of the cart item to remove
 * @returns Updated cart data or error
 */
export async function removeCartItem(cartItemId: string): 
  Promise<{ success: boolean; items: CartItem[]; error?: string; totalQuantity: number; totalPrice: number }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove cart item: ${errorText}`);
    }

    const data: CartResponse = await response.json();

    return {
      success: true,
      items: data.items.map(mapCartItemDtoToCartItem),
      totalQuantity: data.totalQuantity,
      totalPrice: data.totalPrice
    };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return {
      success: false,
      items: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      totalQuantity: 0,
      totalPrice: 0
    };
  }
}

/**
 * Clear all items from the cart
 * @returns Empty cart data or error
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to clear cart: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Merge guest cart with user cart after login
 */
export async function apiMergeGuestCart(guestCartItems: CartItem[]): Promise<{ success: boolean; items: CartItem[]; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'User not authenticated', items: [] };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/cart/merge-guest-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ guestCartItems }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || `HTTP error! status: ${response.status}`,
        items: []
      };
    }

    const data: CartResponse = await response.json();
    const items = data.items.map(mapCartItemDtoToCartItem);
    
    return { success: true, items };
  } catch (error) {
    console.error('Error merging guest cart:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error',
      items: []
    };
  }
}
