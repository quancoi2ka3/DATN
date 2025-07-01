"use client";

import { CartItem } from "./types";
import { toast } from "sonner";

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

// Enhanced Performance Metrics for Checkout
interface CheckoutMetrics {
  totalCheckouts: number;
  successfulCheckouts: number;
  failedCheckouts: number;
  averageCheckoutTime: number;
  vnpayRedirects: number;
  retryAttempts: number;
}

// Checkout Cache for storing temporary data
class CheckoutCache {
  private static instance: CheckoutCache;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CheckoutCache {
    if (!CheckoutCache.instance) {
      CheckoutCache.instance = new CheckoutCache();
    }
    return CheckoutCache.instance;
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any, ttl: number = 10 * 60 * 1000): void { // 10 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Retry Logic for Checkout
const withCheckoutRetry = async function<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 2000,
  onRetry?: (attempt: number) => void
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      onRetry?.(attempt);
      
      // Exponential backoff with jitter
      const jitter = Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay * attempt + jitter));
    }
  }
  
  throw lastError!;
};

// Enhanced Checkout Service
class EnhancedCheckoutService {
  private static instance: EnhancedCheckoutService;
  private cache = CheckoutCache.getInstance();
  private metrics: CheckoutMetrics = {
    totalCheckouts: 0,
    successfulCheckouts: 0,
    failedCheckouts: 0,
    averageCheckoutTime: 0,
    vnpayRedirects: 0,
    retryAttempts: 0
  };

  static getInstance(): EnhancedCheckoutService {
    if (!EnhancedCheckoutService.instance) {
      EnhancedCheckoutService.instance = new EnhancedCheckoutService();
    }
    return EnhancedCheckoutService.instance;
  }

  private updateMetrics(
    checkoutTime: number, 
    success: boolean, 
    retryAttempts: number = 0, 
    hasVnpayRedirect: boolean = false
  ) {
    this.metrics.totalCheckouts++;
    this.metrics.retryAttempts += retryAttempts;
    
    if (success) {
      this.metrics.successfulCheckouts++;
    } else {
      this.metrics.failedCheckouts++;
    }
    
    if (hasVnpayRedirect) {
      this.metrics.vnpayRedirects++;
    }
    
    // Update average checkout time
    this.metrics.averageCheckoutTime = 
      (this.metrics.averageCheckoutTime * (this.metrics.totalCheckouts - 1) + checkoutTime) / 
      this.metrics.totalCheckouts;
  }

  getMetrics(): CheckoutMetrics {
    return { ...this.metrics };
  }

  // Validate checkout data before submission
  private validateCheckoutData(checkoutDetails: CheckoutRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate shipping address
    if (!checkoutDetails.shippingAddress.fullName?.trim()) {
      errors.push('Họ tên không được để trống');
    }
    
    if (!checkoutDetails.shippingAddress.addressLine1?.trim()) {
      errors.push('Địa chỉ không được để trống');
    }
    
    if (!checkoutDetails.shippingAddress.city?.trim()) {
      errors.push('Thành phố không được để trống');
    }
    
    if (!checkoutDetails.shippingAddress.province?.trim()) {
      errors.push('Tỉnh/Thành phố không được để trống');
    }
    
    // Validate contact info
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!checkoutDetails.contactInfo.email?.trim() || !emailRegex.test(checkoutDetails.contactInfo.email)) {
      errors.push('Email không hợp lệ');
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!checkoutDetails.contactInfo.phone?.trim() || !phoneRegex.test(checkoutDetails.contactInfo.phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }
    
    // Validate payment method
    if (!checkoutDetails.paymentMethod?.trim()) {
      errors.push('Vui lòng chọn phương thức thanh toán');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Save checkout data to cache for recovery
  private saveCheckoutProgress(checkoutDetails: CheckoutRequest, orderId?: string) {
    const key = `checkout-progress-${Date.now()}`;
    this.cache.set(key, {
      checkoutDetails,
      orderId,
      timestamp: Date.now()
    }, 30 * 60 * 1000); // 30 minutes
    
    // Store in localStorage as backup
    try {
      localStorage.setItem('checkout-backup', JSON.stringify({
        checkoutDetails,
        orderId,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Could not save checkout backup to localStorage:', error);
    }
  }

  // Recover checkout data from cache or localStorage
  recoverCheckoutProgress(): { checkoutDetails?: CheckoutRequest; orderId?: string } | null {
    try {
      // First try localStorage
      const backup = localStorage.getItem('checkout-backup');
      if (backup) {
        const parsed = JSON.parse(backup);
        
        // Check if backup is not too old (30 minutes)
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          return {
            checkoutDetails: parsed.checkoutDetails,
            orderId: parsed.orderId
          };
        }
      }
    } catch (error) {
      console.warn('Could not recover checkout progress:', error);
    }
    
    return null;
  }

  // Clear checkout progress after successful completion
  clearCheckoutProgress() {
    try {
      localStorage.removeItem('checkout-backup');
    } catch (error) {
      console.warn('Could not clear checkout backup:', error);
    }
  }

  async processCheckout(checkoutDetails: CheckoutRequest): 
    Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> {
    const startTime = Date.now();
    let retryAttempts = 0;
    
    try {
      console.log('[ENHANCED CHECKOUT] Starting checkout with validation');
      
      // Validate checkout data
      const validation = this.validateCheckoutData(checkoutDetails);
      if (!validation.valid) {
        toast.error(validation.errors.join(', '));
        this.updateMetrics(Date.now() - startTime, false);
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Save progress for recovery
      this.saveCheckoutProgress(checkoutDetails);

      // Process checkout with retry logic
      const result = await withCheckoutRetry(
        async () => {
          console.log('[ENHANCED CHECKOUT] Making API request');
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutDetails),
            credentials: 'include',
          });
          
          console.log('[ENHANCED CHECKOUT] Response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('[ENHANCED CHECKOUT] Error response:', errorText);
            throw new Error(`Checkout failed: ${errorText}`);
          }
          
          const data = await response.json();
          console.log('[ENHANCED CHECKOUT] Parsed data:', data);

          if (!data.success || !data.order) {
            throw new Error('Invalid response format from server');
          }

          return data;
        },
        3, // max retries
        2000, // delay
        (attempt) => {
          retryAttempts = attempt;
          toast.info(`Đang thử lại thanh toán... (${attempt}/3)`);
        }
      );

      // Map response
      const mappedOrder: CheckoutResponse = {
        orderId: result.order?.id?.toString() || '',
        orderNumber: result.order?.id?.toString() || '',
        createdAt: result.order?.orderDate || new Date().toISOString(),
        totalAmount: result.order?.totalAmount || 0,
        status: result.order?.status || 'Pending',
        paymentUrl: result.paymentUrl
      };

      // Update progress with order ID
      this.saveCheckoutProgress(checkoutDetails, mappedOrder.orderId);

      // Handle VNPay redirect
      if (result.paymentUrl) {
        console.log('[ENHANCED CHECKOUT] Redirecting to VNPay');
        this.updateMetrics(Date.now() - startTime, true, retryAttempts, true);
        
        // Small delay to ensure state is saved
        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 500);
        
        return {
          success: true,
          order: mappedOrder
        };
      }

      // Success without redirect
      this.updateMetrics(Date.now() - startTime, true, retryAttempts);
      this.clearCheckoutProgress();
      toast.success('Đặt hàng thành công!');

      return {
        success: true,
        order: mappedOrder
      };

    } catch (error) {
      console.error('[ENHANCED CHECKOUT] Error:', error);
      this.updateMetrics(Date.now() - startTime, false, retryAttempts);
      
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error(`Thanh toán thất bại: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async getOrderById(orderId: string): 
    Promise<{ success: boolean; order?: CheckoutResponse; error?: string }> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = `order-${orderId}`;
      const cachedOrder = this.cache.get(cacheKey);
      if (cachedOrder) {
        return {
          success: true,
          order: cachedOrder
        };
      }

      const result = await withCheckoutRetry(
        async () => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
            credentials: 'include',
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get order details: ${errorText}`);
          }

          return await response.json();
        }
      );

      // Cache the result
      this.cache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes

      return {
        success: true,
        order: result
      };

    } catch (error) {
      console.error('Error getting order details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async getOrderHistory(): 
    Promise<{ success: boolean; orders?: CheckoutResponse[]; error?: string }> {
    try {
      // Check cache first
      const cacheKey = 'order-history';
      const cachedHistory = this.cache.get(cacheKey);
      if (cachedHistory) {
        return {
          success: true,
          orders: cachedHistory
        };
      }

      const result = await withCheckoutRetry(
        async () => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/history`, {
            credentials: 'include',
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get order history: ${errorText}`);
          }

          return await response.json();
        }
      );

      // Cache the result
      this.cache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes

      return {
        success: true,
        orders: result
      };

    } catch (error) {
      console.error('Error getting order history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
}

// Export singleton instance and functions
const checkoutService = EnhancedCheckoutService.getInstance();

export const processCheckout = (checkoutDetails: CheckoutRequest) => 
  checkoutService.processCheckout(checkoutDetails);

export const getOrderById = (orderId: string) => 
  checkoutService.getOrderById(orderId);

export const getOrderHistory = () => 
  checkoutService.getOrderHistory();

export const getCheckoutMetrics = () => 
  checkoutService.getMetrics();

export const recoverCheckoutProgress = () => 
  checkoutService.recoverCheckoutProgress();

export const clearCheckoutProgress = () => 
  checkoutService.clearCheckoutProgress();
