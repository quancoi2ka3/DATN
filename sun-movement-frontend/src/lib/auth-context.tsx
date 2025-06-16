"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  // E-commerce specific methods
  redirectAfterLogin: (defaultPath?: string) => void;
  setReturnUrl: (url: string) => void;
  preserveShoppingSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Track return URL for post-login redirect
  const [returnUrl, setReturnUrlState] = useState<string | null>(null);

  // On mount, try to restore auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        // If there's an error parsing user data, clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Preserve shopping session before login
      preserveShoppingSession();

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        
        // Try to get error details from response
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Login error details:', errorData);
          } else {
            const errorText = await response.text();
            console.error('Login error text:', errorText);
          }
        } catch (parseError) {
          console.error('Could not parse login error response:', parseError);
        }
        
        return false;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Login response is not JSON:', contentType);
        return false;
      }

      const data = await response.json();
      
      // Save auth data - backend returns { token, user, expiration }
      const { token, user } = data;
      
      if (!token || !user) {
        console.error('Invalid login response format:', data);
        return false;
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles
        },
        token,
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const isAdmin = () => {
    return authState.user?.roles?.includes("Admin") || false;
  };

  // E-commerce specific methods
  const setReturnUrl = (url: string) => {
    setReturnUrlState(url);
    // Also store in sessionStorage for persistence across page reloads
    sessionStorage.setItem('returnUrl', url);
  };

  const redirectAfterLogin = (defaultPath: string = '/') => {
    // Check for stored return URL first
    const storedReturnUrl = returnUrl || sessionStorage.getItem('returnUrl');
    
    if (storedReturnUrl) {
      // Clear the stored URL
      setReturnUrlState(null);
      sessionStorage.removeItem('returnUrl');
      
      // Redirect to the stored URL
      window.location.href = storedReturnUrl;
    } else {
      // Redirect to default path (homepage for e-commerce)
      window.location.href = defaultPath;
    }
  };

  const preserveShoppingSession = () => {
    // This method can be extended to preserve cart state
    // For now, it's a placeholder for future implementation
    const cartData = localStorage.getItem('shoppingCart');
    if (cartData) {
      // Cart data is already preserved in localStorage
      console.log('Shopping cart session preserved');
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Preserve shopping cart during logout (for guest checkout)
    // Don't clear cart data - let user continue shopping as guest
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      login,
      logout,
      isAdmin,
      redirectAfterLogin,
      setReturnUrl,
      preserveShoppingSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
