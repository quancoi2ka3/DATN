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
  district: string;
  zipCode?: string;
  province: string;
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
}

/**
 * Process checkout with the current cart items
 * @param checkoutDetails The checkout details including shipping and payment information
 * @returns The checkout response with order details or error
 */
export async function processCheckout(checkoutDetails: CheckoutRequest): 
  Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutDetails),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Checkout failed: ${errorText}`);
    }

    const data: CheckoutResponse = await response.json();

    return {
      success: true,
      order: data
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
      credentials: 'include', // Include cookies for authentication
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/history`, {
      credentials: 'include', // Include cookies for authentication
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
