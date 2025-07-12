"use client";

import { CartItem } from "./types";

export interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  contactInfo: ContactInfo;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  zipCode?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentUrl?: string; // For VNPay redirect
}

/**
 * Process checkout with the current cart items
 * @param checkoutDetails The checkout details including shipping and payment information
 * @returns The checkout response with order details or error
 */
export async function processCheckout(checkoutDetails: CheckoutRequest): 
  Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> {  
  try {
    console.log('[CHECKOUT DEBUG] Starting checkout with data:', checkoutDetails);
    console.log('[CHECKOUT DEBUG] Using API proxy: /api/checkout');

    // Lấy JWT từ localStorage giống cart-service
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[CHECKOUT DEBUG] Thêm Authorization header cho checkout');
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers,
      body: JSON.stringify(checkoutDetails),
      credentials: 'include',
    });

    console.log('[CHECKOUT DEBUG] Response status:', response.status);
    console.log('[CHECKOUT DEBUG] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CHECKOUT DEBUG] Error response:', errorText);
      throw new Error(`Checkout failed: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[CHECKOUT DEBUG] Parsed data:', data);

    // Ensure data has the expected structure
    if (!data.success || !data.order) {
      throw new Error('Invalid response format from server');
    }

    // Handle VNPay redirect
    if (data.paymentUrl) {
      // Redirect to VNPay
      window.location.href = data.paymentUrl;
      return {
        success: true,
        order: {
          orderId: data.order?.id?.toString() || '',
          orderNumber: data.order?.id?.toString() || '',
          createdAt: data.order?.orderDate || new Date().toISOString(),
          totalAmount: data.order?.totalAmount || 0,
          status: data.order?.status || 'Pending',
          paymentUrl: data.paymentUrl
        }
      };
    }

    // Map backend order response to frontend format
    const mappedOrder: CheckoutResponse = {
      orderId: data.order?.id?.toString() || '',
      orderNumber: data.order?.id?.toString() || '',
      createdAt: data.order?.orderDate || new Date().toISOString(),
      totalAmount: data.order?.totalAmount || 0,
      status: data.order?.status || 'Pending'
    };

    return {
      success: true,
      order: mappedOrder
    };
  } catch (error) {
    console.error('Error processing checkout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get order details by order ID
 * @param orderId The ID of the order to retrieve
 * @returns The order details or error
 */
export async function getOrderById(orderId: string): 
  Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> {
  try {
    let headers: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get order details: ${errorText}`);
    }

    const data: CheckoutResponse = await response.json();

    return {
      success: true,
      order: data
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get order history for the current user
 * @returns List of past orders or error
 */
export async function getOrderHistory(): 
  Promise<{ success: boolean; orders?: CheckoutResponse[]; error?: string }> {
  try {
    let headers: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/history`, {
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get order history: ${errorText}`);
    }

    const data: CheckoutResponse[] = await response.json();

    return {
      success: true,
      orders: data
    };
  } catch (error) {
    console.error('Error getting order history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
