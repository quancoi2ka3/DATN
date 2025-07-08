"use client";

import { CartItem, Product } from "./types";
import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { addToCart as apiAddToCart, getCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from "./cart-service";
import { processCheckout, CheckoutRequest } from "./checkout-service";
import { useAuth } from "./auth-context";
import { useNotification } from "./notification-context";

// Enhanced cart item with coupon support
export interface EnhancedCartItem extends CartItem {
  originalPrice: number;
  discountAmount?: number;
  couponCode?: string;
  couponType?: string;
  finalPrice: number;
}

// Coupon validation result
export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  error?: string;
  couponDetails?: {
    code: string;
    type: string;
    value: number;
    description?: string;
  };
}

// Enhanced cart context interface
interface EnhancedCartContextType {
  items: EnhancedCartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  checkout: (checkoutDetails: CheckoutRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  
  // Coupon functionality
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: (couponCode: string) => Promise<boolean>;
  validateCoupon: (couponCode: string) => Promise<CouponValidationResult>;
  appliedCoupons: string[];
  
  // Enhanced calculations
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  totalPrice: number;
  shippingFee: number;
  finalTotal: number;
  
  // State
  isLoading: boolean;
  error?: string;
}

const EnhancedCartContext = createContext<EnhancedCartContextType | undefined>(undefined);

// Enhanced coupon service functions
const validateCouponAPI = async (couponCode: string, orderTotal: number, items: CartItem[]): Promise<CouponValidationResult> => {
  try {
    const response = await fetch('/api/cart/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couponCode,
        orderTotal,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate coupon');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      isValid: false,
      discountAmount: 0,
      error: 'Không thể xác thực mã giảm giá'
    };
  }
};

const applyCouponAPI = async (couponCode: string, cartItems: CartItem[]): Promise<{ success: boolean; items?: EnhancedCartItem[]; error?: string }> => {
  try {
    const response = await fetch('/api/cart/apply-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couponCode,
        items: cartItems
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to apply coupon');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error applying coupon:', error);
    return {
      success: false,
      error: 'Không thể áp dụng mã giảm giá'
    };
  }
};

const removeCouponAPI = async (couponCode: string): Promise<{ success: boolean; items?: EnhancedCartItem[]; error?: string }> => {
  try {
    const response = await fetch('/api/cart/remove-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ couponCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove coupon');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error removing coupon:', error);
    return {
      success: false,
      error: 'Không thể gỡ bỏ mã giảm giá'
    };
  }
};

// Enhanced cart provider
export function EnhancedCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnhancedCartItem[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Helper function to convert CartItem to EnhancedCartItem
  const enhanceCartItem = (item: CartItem): EnhancedCartItem => ({
    ...item,
    originalPrice: item.price,
    finalPrice: item.price,
    discountAmount: 0
  });

  // Helper function to convert CartItem[] to EnhancedCartItem[]
  const enhanceCartItems = (cartItems: CartItem[]): EnhancedCartItem[] => {
    return cartItems.map(enhanceCartItem);
  };

  // Load cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await getCart();
      if (response.success && response.items) {
        setItems(enhanceCartItems(response.items));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart
  const addToCart = useCallback(async (
    product: Product, 
    quantity: number, 
    size?: string, 
    color?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await apiAddToCart(product, quantity, size, color);
      
      if (response.success && response.items) {
        setItems(enhanceCartItems(response.items));
        showSuccess(`Đã thêm ${product.name} vào giỏ hàng`);
        return true;
      } else {
        setError(response.error);
        showError(response.error || 'Không thể thêm sản phẩm vào giỏ hàng');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error adding to cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Update quantity
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await updateCartItem(cartItemId, quantity);
      
      if (response.success && response.items) {
        setItems(enhanceCartItems(response.items));
        showSuccess('Đã cập nhật giỏ hàng');
        return true;
      } else {
        setError(response.error);
        showError(response.error || 'Không thể cập nhật giỏ hàng');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể cập nhật giỏ hàng';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error updating cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Remove from cart
  const removeFromCart = useCallback(async (cartItemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await removeCartItem(cartItemId);
      
      if (response.success && response.items) {
        setItems(enhanceCartItems(response.items));
        showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
        return true;
      } else {
        setError(response.error);
        showError(response.error || 'Không thể xóa sản phẩm');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể xóa sản phẩm';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error removing from cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await apiClearCart();
      
      if (response.success) {
        setItems([]);
        setAppliedCoupons([]);
        showSuccess('Đã xóa giỏ hàng');
        return true;
      } else {
        setError(response.error);
        showError(response.error || 'Không thể xóa giỏ hàng');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể xóa giỏ hàng';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error clearing cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Validate coupon
  const validateCoupon = useCallback(async (couponCode: string): Promise<CouponValidationResult> => {
    const subtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const cartItems = items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.originalPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      addedAt: item.addedAt
    }));

    return await validateCouponAPI(couponCode, subtotal, cartItems);
  }, [items]);

  // Apply coupon
  const applyCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (appliedCoupons.includes(couponCode)) {
      showError('Mã giảm giá đã được áp dụng');
      return false;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // First validate the coupon
      const validation = await validateCoupon(couponCode);
      
      if (!validation.isValid) {
        showError(validation.error || 'Mã giảm giá không hợp lệ');
        return false;
      }

      // Apply the coupon
      const cartItems = items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.originalPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        addedAt: item.addedAt
      }));

      const response = await applyCouponAPI(couponCode, cartItems);
      
      if (response.success && response.items) {
        setItems(response.items);
        setAppliedCoupons(prev => [...prev, couponCode]);
        showSuccess(`Đã áp dụng mã giảm giá ${couponCode}`);
        return true;
      } else {
        showError(response.error || 'Không thể áp dụng mã giảm giá');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể áp dụng mã giảm giá';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error applying coupon:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [appliedCoupons, items, validateCoupon, showSuccess, showError]);

  // Remove coupon
  const removeCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (!appliedCoupons.includes(couponCode)) {
      return true; // Already removed
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await removeCouponAPI(couponCode);
      
      if (response.success && response.items) {
        setItems(response.items);
        setAppliedCoupons(prev => prev.filter(code => code !== couponCode));
        showSuccess(`Đã gỡ bỏ mã giảm giá ${couponCode}`);
        return true;
      } else {
        showError(response.error || 'Không thể gỡ bỏ mã giảm giá');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Không thể gỡ bỏ mã giảm giá';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error removing coupon:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [appliedCoupons, showSuccess, showError]);

  // Checkout
  const checkout = useCallback(async (checkoutDetails: CheckoutRequest): Promise<{ 
    success: boolean; 
    orderId?: string; 
    error?: string 
  }> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await processCheckout(checkoutDetails);
      
      if (response.success && response.order) {
        // Clear cart and coupons after successful checkout
        setItems([]);
        setAppliedCoupons([]);
        showSuccess('Thanh toán thành công!');
        
        return {
          success: true,
          orderId: response.order.orderId
        };
      } else {
        setError(response.error);
        showError(response.error || 'Thanh toán thất bại');
        return {
          success: false,
          error: response.error
        };
      }
    } catch (err) {
      const errorMessage = 'Thanh toán thất bại';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Checkout error:', err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalDiscount = items.reduce((sum, item) => sum + ((item.discountAmount || 0) * item.quantity), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const shippingFee = 0; // Free shipping for now
  const finalTotal = totalPrice + shippingFee;

  const value: EnhancedCartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    applyCoupon,
    removeCoupon,
    validateCoupon,
    appliedCoupons,
    totalItems,
    subtotal,
    totalDiscount,
    totalPrice,
    shippingFee,
    finalTotal,
    isLoading,
    error
  };

  return (
    <EnhancedCartContext.Provider value={value}>
      {children}
    </EnhancedCartContext.Provider>
  );
}

// Hook to use enhanced cart context
export function useEnhancedCart() {
  const context = useContext(EnhancedCartContext);
  if (context === undefined) {
    throw new Error('useEnhancedCart must be used within an EnhancedCartProvider');
  }
  return context;
}
