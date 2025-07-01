"use client";

import { toast } from "sonner";

export interface OrderStatus {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  location?: string;
}

export interface OrderDetails {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
  statusHistory: OrderStatus[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  subtotal: number;
}

export interface TrackingResponse {
  success: boolean;
  order?: OrderDetails;
  error?: string;
}

// Enhanced Order Tracking Service
class OrderTrackingService {
  private static instance: OrderTrackingService;
  private cache: Map<string, { data: OrderDetails; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  static getInstance(): OrderTrackingService {
    if (!OrderTrackingService.instance) {
      OrderTrackingService.instance = new OrderTrackingService();
    }
    return OrderTrackingService.instance;
  }

  // Cache management
  private getCachedOrder(key: string): OrderDetails | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCachedOrder(key: string, order: OrderDetails): void {
    this.cache.set(key, {
      data: order,
      timestamp: Date.now()
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Retry logic for API calls
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
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
        
        toast.info(`Đang thử lại... (${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }

  // Validate input data
  private validateTrackingInput(orderId: string, email: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!orderId?.trim()) {
      errors.push('Mã đơn hàng không được để trống');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email)) {
      errors.push('Email không hợp lệ');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Track order by ID and email
  async trackOrder(orderId: string, email: string): Promise<TrackingResponse> {
    try {
      console.log('[ORDER TRACKING] Starting order tracking:', { orderId, email });
      
      // Validate input
      const validation = this.validateTrackingInput(orderId, email);
      if (!validation.valid) {
        toast.error(validation.errors.join(', '));
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Check cache first
      const cacheKey = `${orderId}-${email}`;
      const cachedOrder = this.getCachedOrder(cacheKey);
      if (cachedOrder) {
        console.log('[ORDER TRACKING] Returning cached order');
        return {
          success: true,
          order: cachedOrder
        };
      }

      // Fetch from API with retry
      const orderData = await this.withRetry(async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/track?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Không tìm thấy đơn hàng với thông tin đã cung cấp');
          } else if (response.status === 403) {
            throw new Error('Không có quyền truy cập đơn hàng này');
          } else {
            const errorText = await response.text();
            throw new Error(`Lỗi khi tải thông tin đơn hàng: ${errorText}`);
          }
        }

        const data = await response.json();
        
        if (!data.success || !data.order) {
          throw new Error(data.error || 'Dữ liệu đơn hàng không hợp lệ');
        }

        return data.order;
      });

      // Transform and validate order data
      const transformedOrder = this.transformOrderData(orderData);
      
      // Cache the result
      this.setCachedOrder(cacheKey, transformedOrder);
      
      console.log('[ORDER TRACKING] Successfully retrieved order:', transformedOrder.orderId);
      
      return {
        success: true,
        order: transformedOrder
      };

    } catch (error) {
      console.error('[ORDER TRACKING] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định khi theo dõi đơn hàng';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Transform backend order data to frontend format
  private transformOrderData(orderData: any): OrderDetails {
    return {
      orderId: orderData.id?.toString() || orderData.orderId || '',
      orderNumber: orderData.orderNumber || orderData.id?.toString() || '',
      customerEmail: orderData.customerEmail || orderData.email || '',
      customerName: orderData.customerName || orderData.fullName || '',
      customerPhone: orderData.customerPhone || orderData.phone || '',
      orderDate: new Date(orderData.orderDate || orderData.createdAt || Date.now()),
      totalAmount: orderData.totalAmount || 0,
      status: orderData.status || 'Pending',
      paymentStatus: orderData.paymentStatus || 'Pending',
      paymentMethod: orderData.paymentMethod || 'Unknown',
      shippingAddress: orderData.shippingAddress || '',
      trackingNumber: orderData.trackingNumber || undefined,
      estimatedDelivery: orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery) : undefined,
      actualDelivery: orderData.actualDelivery ? new Date(orderData.actualDelivery) : undefined,
      items: (orderData.items || []).map((item: any) => ({
        id: item.id?.toString() || '',
        productId: item.productId?.toString() || '',
        productName: item.productName || item.name || '',
        productImage: item.productImage || item.imageUrl || '',
        quantity: item.quantity || 0,
        price: item.price || 0,
        size: item.size || undefined,
        color: item.color || undefined,
        subtotal: item.subtotal || (item.quantity * item.price) || 0
      })),
      statusHistory: (orderData.statusHistory || []).map((status: any) => ({
        id: status.id?.toString() || '',
        status: status.status || '',
        description: status.description || '',
        timestamp: new Date(status.timestamp || status.createdAt || Date.now()),
        location: status.location || undefined
      }))
    };
  }

  // Get order status updates (for real-time tracking)
  async getOrderStatusUpdates(orderId: string): Promise<{ success: boolean; statusHistory?: OrderStatus[]; error?: string }> {
    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/status-history`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to get status updates: ${res.statusText}`);
        }

        return await res.json();
      });

      return {
        success: true,
        statusHistory: response.statusHistory || []
      };

    } catch (error) {
      console.error('[ORDER TRACKING] Error getting status updates:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Subscribe to order status updates (if WebSocket is available)
  subscribeToOrderUpdates(orderId: string, onUpdate: (status: OrderStatus) => void): () => void {
    // This would implement WebSocket subscription for real-time updates
    // For now, we'll simulate with polling
    
    const interval = setInterval(async () => {
      try {
        const result = await this.getOrderStatusUpdates(orderId);
        if (result.success && result.statusHistory) {
          const latestStatus = result.statusHistory[result.statusHistory.length - 1];
          if (latestStatus) {
            onUpdate(latestStatus);
          }
        }
      } catch (error) {
        console.error('[ORDER TRACKING] Error in subscription:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Return unsubscribe function
    return () => clearInterval(interval);
  }

  // Get estimated delivery date
  async getEstimatedDelivery(orderId: string): Promise<{ success: boolean; estimatedDate?: Date; error?: string }> {
    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/estimated-delivery`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to get estimated delivery: ${res.statusText}`);
        }

        return await res.json();
      });

      return {
        success: true,
        estimatedDate: response.estimatedDate ? new Date(response.estimatedDate) : undefined
      };

    } catch (error) {
      console.error('[ORDER TRACKING] Error getting estimated delivery:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Clear all cached data
  clearAllCache(): void {
    this.clearCache();
    toast.info('Đã xóa cache theo dõi đơn hàng');
  }
}

// Export singleton instance and convenience functions
const trackingService = OrderTrackingService.getInstance();

export const trackOrder = (orderId: string, email: string) => 
  trackingService.trackOrder(orderId, email);

export const getOrderStatusUpdates = (orderId: string) => 
  trackingService.getOrderStatusUpdates(orderId);

export const subscribeToOrderUpdates = (orderId: string, onUpdate: (status: OrderStatus) => void) => 
  trackingService.subscribeToOrderUpdates(orderId, onUpdate);

export const getEstimatedDelivery = (orderId: string) => 
  trackingService.getEstimatedDelivery(orderId);

export const clearOrderTrackingCache = () => 
  trackingService.clearAllCache();

export default trackingService;
