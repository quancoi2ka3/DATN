"use client";

import { CartItem, Product } from "./types";
import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { addToCart as apiAddToCart, getCart, updateCartItem, removeCartItem, clearCart as apiClearCart, apiMergeGuestCart } from "./cart-service";
import { processCheckout, CheckoutRequest } from "./checkout-service";
import { useAuth } from "./auth-context";
import { useNotification } from "./notification-context";

// Cache Layer
class CartCache {
  private static instance: CartCache;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CartCache {
    if (!CartCache.instance) {
      CartCache.instance = new CartCache();
    }
    return CartCache.instance;
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

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
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

// Performance Metrics Interface
interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  retryCount: number;
  averageResponseTime: number;
  totalRequests: number;
}

// Retry Logic
const withRetry = async function<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
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
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  checkout: (checkoutDetails: CheckoutRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  preserveGuestCart: () => void;
  syncCartAfterLogin: () => Promise<void>;
  retryLastAction: () => Promise<void>;
  getPerformanceMetrics: () => PerformanceMetrics;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastAction, setLastAction] = useState<(() => Promise<void>) | null>(null);
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheHits: 0,
    cacheMisses: 0,
    retryCount: 0,
    averageResponseTime: 0,
    totalRequests: 0,
  });

  const cache = CartCache.getInstance();

  const updateMetrics = useCallback((responseTime: number, fromCache: boolean, retryAttempts: number = 0) => {
    setMetrics(prev => ({
      cacheHits: prev.cacheHits + (fromCache ? 1 : 0),
      cacheMisses: prev.cacheMisses + (fromCache ? 0 : 1),
      retryCount: prev.retryCount + retryAttempts,
      averageResponseTime: (prev.averageResponseTime * prev.totalRequests + responseTime) / (prev.totalRequests + 1),
      totalRequests: prev.totalRequests + 1,
    }));
  }, []);

  const getPerformanceMetrics = useCallback(() => metrics, [metrics]);

  const retryLastAction = useCallback(async () => {
    if (lastAction) {
      try {
        await lastAction();
        showSuccess("Thao tác đã được thực hiện lại thành công");
      } catch (error) {
        showError("Không thể thực hiện lại thao tác");
      }
    } else {
      showInfo("Không có thao tác nào để thực hiện lại");
    }
  }, [lastAction, showSuccess, showError, showInfo]);

  // Fetch cart on initial load with cache and retry
  useEffect(() => {
    const fetchCart = async () => {
      // Only fetch cart if user is authenticated
      if (!isAuthenticated) {
        setItems([]);
        return;
      }
      
      const startTime = Date.now();
      setIsLoading(true);
      setError(undefined);
      
      try {
        // Check cache first
        const cachedData = cache.get('cart');
        if (cachedData) {
          setItems(cachedData.items || []);
          updateMetrics(Date.now() - startTime, true);
          setIsLoading(false);
          return;
        }

        // Fetch from API with retry
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await getCart(),
          3,
          1000,
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang thử lại... (${attempt}/3)`);
          }
        );
        
        if (response.success) {
          setItems(response.items);
          // Cache the result
          cache.set('cart', { items: response.items });
          updateMetrics(Date.now() - startTime, false, retryAttempts);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to fetch cart');
        console.error('Error fetching cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [cache, updateMetrics, isAuthenticated]);

  // Auto-sync cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      syncCartAfterLogin();
    }
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity: number, size?: string, color?: string): Promise<boolean> => {
    const operationKey = `add-${product.id}-${size || ''}-${color || ''}`;
    
    // Prevent duplicate operations
    if (pendingOperations.has(operationKey)) {
      console.log('[CART DEBUG] Operation already pending, skipping:', operationKey);
      return false;
    }
    
    setPendingOperations(prev => new Set(prev).add(operationKey));
    
    const startTime = Date.now();
    
    // Remove optimistic update to prevent duplicates
    const originalItems = [...items];

    const action = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      
      try {
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await apiAddToCart(product, quantity, size, color),
          3,
          1000,
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang thêm vào giỏ hàng... (${attempt}/3)`);
          }
        );
        
        if (response.success) {
          setItems(response.items);
          // Invalidate cache
          cache.invalidate('cart');
          cache.set('cart', { items: response.items });
          updateMetrics(Date.now() - startTime, false, retryAttempts);
          showSuccess("Đã thêm vào giỏ hàng");
        } else {
          // Keep original items
          setItems(originalItems);
          setError(response.error);
          showError(response.error || "Không thể thêm vào giỏ hàng");
          throw new Error(response.error || "Failed to add to cart");
        }
      } catch (err) {
        // Keep original items
        setItems(originalItems);
        const errorMessage = 'Failed to add to cart';
        setError(errorMessage);
        console.error('Error adding to cart:', err);
        showError("Không thể thêm vào giỏ hàng");
        throw err;
      } finally {
        setIsLoading(false);
        setPendingOperations(prev => {
          const newSet = new Set(prev);
          newSet.delete(operationKey);
          return newSet;
        });
      }
    };

    setLastAction(() => action);
    
    try {
      await action();
      return true;
    } catch {
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    const startTime = Date.now();
    
    // Optimistic update
    const originalItems = [...items];
    const itemToRemove = items.find(item => item.id === cartItemId);
    setItems(prev => prev.filter(item => item.id !== cartItemId));

    const action = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      
      try {
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await removeCartItem(cartItemId),
          3,
          1000,
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang xóa khỏi giỏ hàng... (${attempt}/3)`);
          }
        );
        
        if (response.success) {
          setItems(response.items);
          // Invalidate cache
          cache.invalidate('cart');
          cache.set('cart', { items: response.items });
          updateMetrics(Date.now() - startTime, false, retryAttempts);
          showSuccess("Đã xóa khỏi giỏ hàng");
        } else {
          // Rollback optimistic update
          setItems(originalItems);
          setError(response.error);
          showError(response.error || "Không thể xóa khỏi giỏ hàng");
          throw new Error(response.error || "Failed to remove from cart");
        }
      } catch (err) {
        // Rollback optimistic update
        setItems(originalItems);
        const errorMessage = 'Failed to remove from cart';
        setError(errorMessage);
        console.error('Error removing from cart:', err);
        showError("Không thể xóa khỏi giỏ hàng");
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    setLastAction(() => action);
    
    try {
      await action();
      return true;
    } catch {
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    const operationKey = `update-${cartItemId}-${quantity}`;
    
    // Prevent duplicate operations
    if (pendingOperations.has(operationKey)) {
      console.log('[CART DEBUG] Update operation already pending, skipping:', operationKey);
      return false;
    }
    
    setPendingOperations(prev => new Set(prev).add(operationKey));

    const startTime = Date.now();
    
    // Optimistic update
    const originalItems = [...items];
    setItems(prev => prev.map(item => 
      item.id === cartItemId 
        ? { ...item, quantity } 
        : item
    ));

    const action = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      
      try {
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await updateCartItem(cartItemId, quantity),
          3,
          1000,
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang cập nhật giỏ hàng... (${attempt}/3)`);
          }
        );
        
        if (response.success) {
          setItems(response.items);
          // Invalidate cache
          cache.invalidate('cart');
          cache.set('cart', { items: response.items });
          updateMetrics(Date.now() - startTime, false, retryAttempts);
          showSuccess("Đã cập nhật giỏ hàng");
        } else {
          // Rollback optimistic update
          setItems(originalItems);
          setError(response.error);
          showError(response.error || "Không thể cập nhật giỏ hàng");
          throw new Error(response.error || "Failed to update cart");
        }
      } catch (err) {
        // Rollback optimistic update
        setItems(originalItems);
        const errorMessage = 'Failed to update cart';
        setError(errorMessage);
        console.error('Error updating cart:', err);
        showError("Không thể cập nhật giỏ hàng");
        throw err;
      } finally {
        setIsLoading(false);
        setPendingOperations(prev => {
          const newSet = new Set(prev);
          newSet.delete(operationKey);
          return newSet;
        });
      }
    };

    setLastAction(() => action);
    
    try {
      await action();
      return true;
    } catch {
      return false;
    }
  };
  const clearCart = async (): Promise<boolean> => {
    const startTime = Date.now();
    
    // Optimistic update
    const originalItems = [...items];
    setItems([]);

    const action = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      
      try {
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await apiClearCart(),
          3,
          1000,
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang xóa giỏ hàng... (${attempt}/3)`);
          }
        );
        
        if (response.success) {
          setItems([]);
          // Invalidate cache
          cache.invalidate('cart');
          cache.set('cart', { items: [] });
          updateMetrics(Date.now() - startTime, false, retryAttempts);
          showSuccess("Đã xóa toàn bộ giỏ hàng");
        } else {
          // Rollback optimistic update
          setItems(originalItems);
          setError(response.error);
          showError(response.error || "Không thể xóa giỏ hàng");
          throw new Error(response.error || "Failed to clear cart");
        }
      } catch (err) {
        // Rollback optimistic update
        setItems(originalItems);
        const errorMessage = 'Failed to clear cart';
        setError(errorMessage);
        console.error('Error clearing cart:', err);
        showError("Không thể xóa giỏ hàng");
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    setLastAction(() => action);
    
    try {
      await action();
      return true;
    } catch {
      return false;
    }
  };
  
  const checkout = async (checkoutDetails: CheckoutRequest): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    const startTime = Date.now();
    
    const action = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      
      try {
        let retryAttempts = 0;
        const response = await withRetry(
          async () => await processCheckout(checkoutDetails),
          3,
          2000, // Longer delay for checkout
          (attempt) => {
            retryAttempts = attempt;
            setError(`Đang xử lý thanh toán... (${attempt}/3)`);
          }
        );
        
        if (response.success && response.order) {
          // Clear cart after successful checkout
          setItems([]);
          // Clear cache
          cache.clear();
          updateMetrics(Date.now() - startTime, false, retryAttempts);
          showSuccess("Thanh toán thành công!");
          throw response; // Use throw to pass success response
        } else {
          setError(response.error);
          showError(response.error || "Thanh toán thất bại");
          throw response;
        }
      } catch (err) {
        if (err && typeof err === 'object' && 'success' in err) {
          // This is our response object, re-throw it
          throw err;
        }
        const errorMessage = 'Failed to process checkout';
        setError(errorMessage);
        console.error(errorMessage, err);
        showError("Lỗi thanh toán");
        throw {
          success: false,
          error: errorMessage
        };
      } finally {
        setIsLoading(false);
      }
    };

    setLastAction(() => action);
    
    try {
      await action();
      // This shouldn't be reached due to the throws above
      return { success: false, error: "Unexpected error" };
    } catch (result: any) {
      if (result.success && result.order) {
        return {
          success: true,
          orderId: result.order.orderId
        };
      } else {
        return {
          success: false,
          error: result.error || "Checkout failed"
        };
      }
    }
  };

  const preserveGuestCart = () => {
    // Implementation for preserving guest cart, e.g., by saving to localStorage
    try {
      const serializedCart = JSON.stringify(items);
      localStorage.setItem('guestCart', serializedCart);
    } catch (err) {
      console.error('Error preserving guest cart:', err);
    }
  };

  const syncCartAfterLogin = async () => {
    // Implementation for syncing cart after user login
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const parsedCart: CartItem[] = JSON.parse(guestCart);
        // Assuming the API has a method to merge guest cart with user cart
        const response = await apiMergeGuestCart(parsedCart);
        
        if (response.success) {
          setItems(response.items);
          localStorage.removeItem('guestCart'); // Clear guest cart after merging
        } else {
          setError(response.error);
        }
      }
    } catch (err) {
      console.error('Error syncing cart after login:', err);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      preserveGuestCart,
      syncCartAfterLogin,
      retryLastAction,
      getPerformanceMetrics,
      totalItems,
      totalPrice,
      isLoading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}