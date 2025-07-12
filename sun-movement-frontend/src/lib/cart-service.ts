"use client";

import { CartItem, Product } from "./types";

// Get auth token for authenticated requests
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Lấy token trực tiếp từ localStorage key 'token'
  return localStorage.getItem('token');
}

// Base types for cart API requests and responses
interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

// Backend response format
interface BackendCartResponse {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: BackendCartItemDto[];
  totalAmount: number;
}

interface BackendCartItemDto {
  id: number;
  cartId: number;
  productId?: number;
  serviceId?: number;
  itemName: string;
  itemImageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
    price: number;
  };
  service?: any;
}

// Frontend expected format
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

// Function to process image URL
function processImageUrl(imageUrl: string | undefined): string {
  console.log('[CART DEBUG] Processing image URL:', imageUrl);
  
  if (!imageUrl) {
    console.log('[CART DEBUG] No image URL, using placeholder');
    return '/images/placeholder.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('[CART DEBUG] Full URL detected:', imageUrl);
    return imageUrl;
  }
  
  // Backend base URL for images
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';
  console.log('[CART DEBUG] Backend base URL:', backendBaseUrl);
  
  // If it starts with /uploads, it's a backend relative path (uploaded files)
  if (imageUrl.startsWith('/uploads/')) {
    const finalUrl = `${backendBaseUrl}${imageUrl}`;
    console.log('[CART DEBUG] Uploads path detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If it starts with uploads/ (without leading slash)
  if (imageUrl.startsWith('uploads/')) {
    const finalUrl = `${backendBaseUrl}/${imageUrl}`;
    console.log('[CART DEBUG] Uploads path (no slash) detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If it starts with /images/products, it's also a backend path (static/seed files)
  if (imageUrl.startsWith('/images/products/')) {
    const finalUrl = `${backendBaseUrl}${imageUrl}`;
    console.log('[CART DEBUG] Backend images/products path detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If it starts with images/products (without leading slash)
  if (imageUrl.startsWith('images/products/')) {
    const finalUrl = `${backendBaseUrl}/${imageUrl}`;
    console.log('[CART DEBUG] Backend images/products path (no slash) detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If it's just a filename (like f7f6747d-488e-4c8a-afc6-fc70b0e0463d.webp)
  if (!imageUrl.startsWith('/') && (imageUrl.includes('.webp') || imageUrl.includes('.jpg') || imageUrl.includes('.png'))) {
    const finalUrl = `${backendBaseUrl}/uploads/products/${imageUrl}`;
    console.log('[CART DEBUG] Filename detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If it starts with /images/ or /assets/ (frontend static assets)
  if (imageUrl.startsWith('/images/') && !imageUrl.startsWith('/images/products/')) {
    console.log('[CART DEBUG] Frontend static asset detected:', imageUrl);
    return imageUrl; // Keep as frontend static asset
  }
  
  if (imageUrl.startsWith('/assets/')) {
    console.log('[CART DEBUG] Frontend assets detected:', imageUrl);
    return imageUrl; // Keep as frontend static asset
  }
  
  // Default case - treat as relative path from domain root
  const finalUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  console.log('[CART DEBUG] Default case, final URL:', finalUrl);
  return finalUrl;
}

// Function to map backend response to frontend format
function mapBackendCartResponse(backendResponse: BackendCartResponse): CartResponse {
  const mappedItems = backendResponse.items.map(item => ({
    id: item.id.toString(),
    productId: item.productId || item.serviceId || 0,
    productName: item.itemName || item.product?.name || 'Unknown Product',
    productImage: processImageUrl(item.itemImageUrl || item.product?.imageUrl),
    quantity: item.quantity,
    price: item.unitPrice || item.product?.price || 0,
    createdAt: backendResponse.createdAt
  }));

  return {
    items: mappedItems,
    totalQuantity: mappedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: backendResponse.totalAmount
  };
}

// Function to map backend CartItemDto to frontend CartItem
function mapCartItemDtoToCartItem(dto: CartItemDto): CartItem {
  return {
    id: dto.id,
    productId: dto.productId.toString(),
    name: dto.productName,
    imageUrl: processImageUrl(dto.productImage),
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
      quantity
    };
    console.log('[CART DEBUG] Adding item to cart through proxy API...');
    console.log('[CART DEBUG] Request:', request);
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if user is authenticated
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CART DEBUG] Adding auth header for authenticated user');
    }
    
    // Use local API proxy to avoid CORS issues
    console.log('[CART DEBUG] Fetch addToCart:', {
      url: '/api/cart/items',
      method: 'POST',
      headers,
      body: request,
      credentials: 'include'
    });
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      credentials: 'include' // Add credentials for session consistency
    });

    console.log('[CART DEBUG] Add to cart response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CART DEBUG] Add to cart error:', errorText);
      throw new Error(`Failed to add item to cart: ${errorText}`);
    }

    // Try to parse response, but don't fail if it's empty
    let addResponse;
    try {
      const responseText = await response.text();
      console.log('[CART DEBUG] Add to cart response text:', responseText);
      
      if (responseText.trim() === '') {
        addResponse = { success: true };
      } else {
        addResponse = JSON.parse(responseText);
      }
      console.log('[CART DEBUG] Parsed add response:', addResponse);
    } catch (parseError) {
      console.warn('[CART DEBUG] Failed to parse add response, assuming success:', parseError);
      addResponse = { success: true };
    }

    // POST was successful, now try to get updated cart
    // If getCart fails, still consider the add operation successful
    const cartResult = await getCart();
    if (cartResult.success) {
      return cartResult;
    } else {
      // Add was successful but couldn't retrieve updated cart
      // Return success with minimal info
      console.warn('Item added to cart but failed to retrieve updated cart:', cartResult.error);
      return {
        success: true,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        error: undefined
      };
    }
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
    console.log('[CART DEBUG] Getting cart through proxy API...');
    
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Add authorization header if user is authenticated
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CART DEBUG] Adding auth header for get cart');
    }
    
    // Use local API proxy to avoid CORS issues
    console.log('[CART DEBUG] Fetch getCart:', {
      url: '/api/cart/items',
      method: 'GET',
      headers,
      credentials: 'include'
    });
    const response = await fetch('/api/cart/items', {
      cache: 'no-store',
      headers,
      credentials: 'include' // Add credentials for session consistency
    });

    console.log('[CART DEBUG] Get cart response status:', response.status);

    let backendData: BackendCartResponse;
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[CART DEBUG] Get cart error:', errorText);
        throw new Error(`Failed to get cart: ${errorText}`);
      } else {
        backendData = await response.json();
        console.log('[CART DEBUG] Cart data:', backendData);
      }
    const data = mapBackendCartResponse(backendData);

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
    const request: UpdateCartItemRequest = { 
      cartItemId: parseInt(cartItemId),
      quantity 
    };
    
    console.log('[CART DEBUG] Updating cart item:', request);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CART DEBUG] Adding auth header for update cart item');
    }
    // Use local API proxy to avoid CORS issues
    console.log('[CART DEBUG] Fetch updateCartItem:', {
      url: '/api/cart/items',
      method: 'PUT',
      headers,
      body: request,
      credentials: 'include'
    });
    const response = await fetch('/api/cart/items', {
      method: 'PUT',
      headers,
      body: JSON.stringify(request),
      credentials: 'include' // Add credentials for session consistency
    });

    console.log('[CART DEBUG] Update cart item response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CART DEBUG] Update cart item error:', errorText);
      throw new Error(`Failed to update cart item: ${errorText}`);
    }

    // After updating, get the updated cart
    return await getCart();
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
    console.log('[CART DEBUG] Removing cart item:', cartItemId);
    const headers: Record<string, string> = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CART DEBUG] Adding auth header for remove cart item');
    }
    // Use local API proxy to avoid CORS issues
    console.log('[CART DEBUG] Fetch removeCartItem:', {
      url: `/api/cart?itemId=${cartItemId}`,
      method: 'DELETE',
      headers,
      credentials: 'include'
    });
    const response = await fetch(`/api/cart?itemId=${cartItemId}`, {
      method: 'DELETE',
      headers,
      credentials: 'include' // Add credentials for session consistency
    });

    console.log('[CART DEBUG] Remove cart item response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CART DEBUG] Remove cart item error:', errorText);
      throw new Error(`Failed to remove cart item: ${errorText}`);
    }

    // After removing, get the updated cart
    return await getCart();
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
    console.log('[CART DEBUG] Clearing cart...');
    const headers: Record<string, string> = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CART DEBUG] Adding auth header for clear cart');
    }
    // Use local API proxy to avoid CORS issues
    console.log('[CART DEBUG] Fetch clearCart:', {
      url: '/api/cart/clear',
      method: 'DELETE',
      headers,
      credentials: 'include'
    });
    const response = await fetch('/api/cart/clear', {
      method: 'DELETE',
      headers,
      credentials: 'include' // Add credentials for session consistency
    });

    console.log('[CART DEBUG] Clear cart response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CART DEBUG] Clear cart error:', errorText);
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



