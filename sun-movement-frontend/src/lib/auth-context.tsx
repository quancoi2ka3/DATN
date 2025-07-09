"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { isTokenExpired } from './token-utils';
import { setCookie, getCookie, deleteCookie } from './cookie-utils';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt?: string;
  lastLogin?: string;
  emailConfirmed?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithTokenData: (tokenData: any) => void; // For auto-login after verification
  logout: () => void;
  isAdmin: () => boolean;
  isLoading: boolean;
  // E-commerce specific methods
  redirectAfterLogin: (defaultPath?: string) => void;
  setReturnUrl: (url: string) => void;
  preserveShoppingSession: () => void;
  // User profile methods
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Track return URL for post-login redirect
  const [returnUrl, setReturnUrlState] = useState<string | null>(null);

  // On mount, try to restore auth state from localStorage
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn('Stored token is expired, clearing auth data');
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoading(false);
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
        
        // Also set cookie for API routes if not already set
        if (!getCookie("auth-token")) {
          setCookie("auth-token", token, 7);
          console.log('[AUTH] Cookie restored for token:', token.substring(0, 20) + '...');
        }
      } catch (error) {
        // If there's an error parsing user data, clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
      
      // Also set cookie for API routes
      setCookie("auth-token", token, 7);
      console.log('[AUTH] Cookie set for token:', token.substring(0, 20) + '...');
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          phoneNumber: user.phoneNumber,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          emailConfirmed: user.emailConfirmed
        },
        token,
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Method to handle auto-login with token data (used after email verification)
  const loginWithTokenData = (tokenData: any) => {
    try {
      const { token, user } = tokenData;
      
      if (!token || !user) {
        console.error('Invalid token data for auto-login:', tokenData);
        return;
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Also set cookie for API routes
      setCookie("auth-token", token, 7);
      console.log('[AUTH] Auto-login cookie set for token:', token.substring(0, 20) + '...');
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          phoneNumber: user.phoneNumber,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          emailConfirmed: user.emailConfirmed
        },
        token,
      });
      
      console.log('[AUTH] Auto-login successful for user:', user.email);
    } catch (error) {
      console.error("Auto-login failed:", error);
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
    
    // Clear auth cookie
    deleteCookie("auth-token");
    
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

  const refreshUserProfile = async (): Promise<void> => {
    if (!authState.token) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const updatedUser = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          roles: userData.roles,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin,
          emailConfirmed: userData.emailConfirmed
        };
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser
        }));
        
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else if (response.status === 401) {
        // Token expired or invalid - logout user
        console.warn('Token expired or invalid, logging out user');
        logout();
      } else {
        console.error('Failed to refresh user profile:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      login,
      loginWithTokenData,
      logout,
      isAdmin,
      isLoading,
      redirectAfterLogin,
      setReturnUrl,
      preserveShoppingSession,
      refreshUserProfile,
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
