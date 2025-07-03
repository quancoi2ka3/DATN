"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { CartItem, Product } from './types';
import { 
  addToCart as apiAddToCart, 
  getCart as apiGetCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart as apiClearCart 
} from './cart-service';
import { CheckoutRequest, processCheckout } from './checkout-service';
import { useAuth } from './auth-context';

// Enhanced cache management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CartCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Retry mechanism
function withRetry<T>(
  fn: () => Promise<T>, 
  retries: number = 3, 
  delay: number = 1000
): Promise<T> {
  return fn().catch((error) => {
    if (retries > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(withRetry(fn, retries - 1, delay * 1.5));
        }, delay);
      });
    }
    throw error;
  });
}

// Optimistic update types
interface OptimisticAction {
  type: 'ADD' | 'UPDATE' | 'REMOVE' | 'CLEAR';
  id: string;
  payload?: any;
  rollback: () => void;
}

interface EnhancedCartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  checkout: (checkoutDetails: CheckoutRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  
  // Enhanced features
  retryLastAction: () => Promise<void>;
  refreshCart: () => Promise<void>;
  
  // State management
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error?: string;
  lastAction?: OptimisticAction;
  
  // Performance metrics
  metrics: {
    cacheHits: number;
    cacheMisses: number;
    retryCount: number;
    averageResponseTime: number;
  };
}

const EnhancedCartContext = createContext<EnhancedCartContextType | undefined>(undefined);

export function EnhancedCartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastAction, setLastAction] = useState<OptimisticAction | undefined>();
  
  // Performance tracking
  const [metrics, setMetrics] = useState({
    cacheHits: 0,
    cacheMisses: 0,
    retryCount: 0,
    averageResponseTime: 0
  });
  
  const cache = useRef(new CartCache());
  const responseTimeRef = useRef<number[]>([]);

  // Update response time metrics
  const updateResponseTime = useCallback((time: number) => {
    responseTimeRef.current.push(time);
    if (responseTimeRef.current.length > 10) {
      responseTimeRef.current.shift();
    }
    
    const average = responseTimeRef.current.reduce((a, b) => a + b, 0) / responseTimeRef.current.length;
    setMetrics(prev => ({ ...prev, averageResponseTime: Math.round(average) }));
  }, []);

  // Optimistic update helper
  const applyOptimisticUpdate = useCallback((action: OptimisticAction) => {
    setLastAction(action);
    
    switch (action.type) {
      case 'ADD':
        setItems(prev => [...prev, action.payload]);
        break;
      case 'UPDATE':
        setItems(prev => prev.map(item => 
          item.id === action.id ? { ...item, ...action.payload } : item
        ));
        break;
      case 'REMOVE':
        setItems(prev => prev.filter(item => item.id !== action.id));
        break;
      case 'CLEAR':
        setItems([]);
        break;
    }
  }, []);

  // Enhanced API call wrapper
  const enhancedApiCall = useCallback((
    apiFunction: () => Promise<any>,
    cacheKey?: string,
    useCache: boolean = true
  ): Promise<any> => {
    const startTime = Date.now();
    
    // Check cache first
    if (cacheKey && useCache) {
      const cached = cache.current.get(cacheKey);
      if (cached) {
        setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
        return Promise.resolve(cached);
      }
      setMetrics(prev => ({ ...prev, cacheMisses: prev.cacheMisses + 1 }));
    }

    return withRetry(apiFunction).then((result) => {
      // Cache successful results
      if (cacheKey && useCache) {
        cache.current.set(cacheKey, result);
      }
      
      const responseTime = Date.now() - startTime;
      updateResponseTime(responseTime);
      
      return result;
    }).catch((error) => {
      setMetrics(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
      throw error;
    });
  }, [updateResponseTime]);

  // Fetch cart with caching
  const fetchCart = useCallback(async (useCache: boolean = true) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await enhancedApiCall(
        () => apiGetCart(),
        'cart-data',
        useCache
      );
      
      if (response.success) {
        setItems(response.items);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Error fetching cart:', err);
      
      // Rollback optimistic update if needed
      if (lastAction) {
        lastAction.rollback();
        setLastAction(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enhancedApiCall, lastAction]);

  // Enhanced add to cart with optimistic updates
  const addToCart = useCallback(async (
    product: Product, 
    quantity: number, 
    size?: string, 
    color?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    // Create optimistic cart item
    const optimisticItem: CartItem = {
      id: `temp-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      size,
      color,
      addedAt: new Date()
    };

    // Apply optimistic update
    const rollback = () => setItems(prev => prev.filter(item => item.id !== optimisticItem.id));
    applyOptimisticUpdate({
      type: 'ADD',
      id: optimisticItem.id,
      payload: optimisticItem,
      rollback
    });

    try {
      const response = await enhancedApiCall(
        () => apiAddToCart(product, quantity, size, color),
        undefined,
        false // Don't cache add operations
      );
      
      if (response.success) {
        // Replace optimistic item with real data
        setItems(response.items);
        cache.current.invalidate('cart-data');
        setLastAction(undefined);
        return true;
      } else {
        setError(response.error);
        rollback();
        return false;
      }
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding to cart:', err);
      rollback();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [enhancedApiCall, applyOptimisticUpdate]);

  // Enhanced update quantity
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    setIsLoading(true);
    setError(undefined);

    // Store original item for rollback
    const originalItem = items.find(item => item.id === cartItemId);
    if (!originalItem) return false;

    // Apply optimistic update
    const rollback = () => setItems(prev => prev.map(item => 
      item.id === cartItemId ? originalItem : item
    ));
    
    applyOptimisticUpdate({
      type: 'UPDATE',
      id: cartItemId,
      payload: { quantity },
      rollback
    });

    try {
      const response = await enhancedApiCall(
        () => updateCartItem(cartItemId, quantity),
        undefined,
        false
      );
      
      if (response.success) {
        setItems(response.items);
        cache.current.invalidate('cart-data');
        setLastAction(undefined);
        return true;
      } else {
        setError(response.error);
        rollback();
        return false;
      }
    } catch (err) {
      setError('Failed to update cart');
      console.error('Error updating cart:', err);
      rollback();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [items, enhancedApiCall, applyOptimisticUpdate]);

  // Enhanced remove from cart
  const removeFromCart = useCallback(async (cartItemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    // Store item for rollback
    const itemToRemove = items.find(item => item.id === cartItemId);
    if (!itemToRemove) return false;

    const rollback = () => setItems(prev => [...prev, itemToRemove]);
    
    applyOptimisticUpdate({
      type: 'REMOVE',
      id: cartItemId,
      rollback
    });

    try {
      const response = await enhancedApiCall(
        () => removeCartItem(cartItemId),
        undefined,
        false
      );
      
      if (response.success) {
        setItems(response.items);
        cache.current.invalidate('cart-data');
        setLastAction(undefined);
        return true;
      } else {
        setError(response.error);
        rollback();
        return false;
      }
    } catch (err) {
      setError('Failed to remove from cart');
      console.error('Error removing from cart:', err);
      rollback();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [items, enhancedApiCall, applyOptimisticUpdate]);

  // Enhanced clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    const originalItems = [...items];
    const rollback = () => setItems(originalItems);
    
    applyOptimisticUpdate({
      type: 'CLEAR',
      id: 'all',
      rollback
    });

    try {
      const response = await enhancedApiCall(
        () => apiClearCart(),
        undefined,
        false
      );
      
      if (response.success) {
        setItems([]);
        cache.current.clear();
        setLastAction(undefined);
        return true;
      } else {
        setError(response.error);
        rollback();
        return false;
      }
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
      rollback();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [items, enhancedApiCall, applyOptimisticUpdate]);

  // Enhanced checkout
  const checkout = useCallback(async (checkoutDetails: CheckoutRequest): Promise<{ 
    success: boolean; 
    orderId?: string; 
    error?: string 
  }> => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await enhancedApiCall(
        () => processCheckout(checkoutDetails),
        undefined,
        false
      );
      
      if (response.success && response.order) {
        // Clear cart after successful checkout
        setItems([]);
        cache.current.clear();
        return {
          success: true,
          orderId: response.order.orderId
        };
      } else {
        setError(response.error);
        return {
          success: false,
          error: response.error
        };
      }
    } catch (err) {
      const errorMessage = 'Checkout failed';
      setError(errorMessage);
      console.error('Checkout error:', err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [enhancedApiCall]);

  // Retry last action
  const retryLastAction = useCallback(async () => {
    if (!lastAction) return;
    
    setError(undefined);
    // Implement retry logic based on last action
    await fetchCart(false); // Force refresh
  }, [lastAction, fetchCart]);

  // Force refresh cart
  const refreshCart = useCallback(async () => {
    cache.current.invalidate('cart-data');
    await fetchCart(false);
  }, [fetchCart]);

  // Computed values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Initialize cart
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Clean up cache when user changes
  useEffect(() => {
    cache.current.clear();
    setMetrics({
      cacheHits: 0,
      cacheMisses: 0,
      retryCount: 0,
      averageResponseTime: 0
    });
  }, [isAuthenticated]);

  const contextValue: EnhancedCartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    retryLastAction,
    refreshCart,
    totalItems,
    totalPrice,
    isLoading,
    error,
    lastAction,
    metrics
  };

  return (
    <EnhancedCartContext.Provider value={contextValue}>
      {children}
    </EnhancedCartContext.Provider>
  );
}

export function useEnhancedCart() {
  const context = useContext(EnhancedCartContext);
  if (context === undefined) {
    throw new Error('useEnhancedCart must be used within an EnhancedCartProvider');
  }
  return context;
}

// Performance monitoring hook
export function useCartPerformance() {
  const { metrics, isLoading, error } = useEnhancedCart();
  
  return {
    ...metrics,
    isLoading,
    hasError: !!error,
    cacheEfficiency: metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100 || 0
  };
}
