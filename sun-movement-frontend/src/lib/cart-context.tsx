"use client";

import { CartItem, Product } from "./types";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { addToCart as apiAddToCart, getCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from "./cart-service";
import { processCheckout, CheckoutRequest } from "./checkout-service";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  checkout: (checkoutDetails: CheckoutRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCart();
        if (response.success) {
          setItems(response.items);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to load cart');
        console.error('Error loading cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product: Product, quantity: number, size?: string, color?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await apiAddToCart(product, quantity, size, color);
      
      if (response.success) {
        setItems(response.items);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding to cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await removeCartItem(cartItemId);
      
      if (response.success) {
        setItems(response.items);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Failed to remove from cart');
      console.error('Error removing from cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await updateCartItem(cartItemId, quantity);
      
      if (response.success) {
        setItems(response.items);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Failed to update cart');
      console.error('Error updating cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const clearCart = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await apiClearCart();
      
      if (response.success) {
        setItems([]);
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkout = async (checkoutDetails: CheckoutRequest): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await processCheckout(checkoutDetails);
      
      if (response.success && response.order) {
        // Clear cart after successful checkout
        setItems([]);
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
      const errorMessage = 'Failed to process checkout';
      setError(errorMessage);
      console.error(errorMessage, err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
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