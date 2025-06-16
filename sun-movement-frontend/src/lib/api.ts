"use client";

// Base URL for API requests - update this to point to your backend
// For development, this can be a relative URL if you're using a proxy
// If deploying separately, use the full backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  cache?: RequestCache;
}

/**
 * Utility function to make API requests with proper authentication
 */
export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
    cache = "default"
  } = options;

  // Set up headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add authentication token if required
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    } else if (requiresAuth) {
      throw new Error("Authentication required but no token found");
    }
  }

  // Prepare the request
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    cache,
  };

  // Add body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Handle response
    if (!response.ok) {
      if (response.status === 401) {
        // Clear token if unauthorized
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API request failed with status ${response.status}`);
    }

    // Return the data (handle empty responses)
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json() as Promise<T>;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Create specialized API methods for different resources
export const api = {
  // General HTTP methods
  get: <T>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) => 
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) => 
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),
    
  put: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) => 
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),
    
  delete: <T>(endpoint: string, options?: Omit<ApiOptions, "method">) => 
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
    
  // Resource-specific methods
  products: {
    getAll: () => api.get<ProductDto[]>('/products'),
    getById: (id: number) => api.get<ProductDto>(`/products/${id}`),
    getByCategoryId: (categoryId: number) => api.get<ProductDto[]>(`/products/category/${categoryId}`),
    getByCategory: (category: string) => api.get<ProductDto[]>(`/products/category/${category}`),
    // Convenience methods for your specific categories
    getSportswear: () => api.products.getByCategory('sportswear'),
    getSupplements: () => api.products.getByCategory('supplements'),
  },
  
  services: {
    getAll: () => api.get<ServiceDto[]>('/services'),
    getById: (id: number) => api.get<ServiceDto>(`/services/${id}`),
    getWithSchedules: (id: number) => api.get<ServiceDto>(`/services/${id}/schedules`),
    getByType: (type: string) => api.get<ServiceDto[]>(`/services/type/${type}`),
    create: (service: ServiceDto) => api.post<ServiceDto>('/services', service),
    update: (id: number, service: ServiceDto) => api.put<void>(`/services/${id}`, service),
    delete: (id: number) => api.delete<void>(`/services/${id}`),
  },
    // Categories
  categories: {
    getAll: () => api.get<CategoryDto[]>('/categories'),
    getById: (id: number) => api.get<CategoryDto>(`/categories/${id}`),
    getBySlug: (slug: string) => api.get<CategoryDto>(`/categories/${slug}`),
  },
  auth: {
    login: (credentials: LoginCredentials) => 
      api.post<AuthResponse>('/auth/login', credentials, { requiresAuth: false }),
    register: (userData: RegisterData) => 
      api.post<AuthResponse>('/auth/register', userData, { requiresAuth: false }),
    getCurrentUser: () => api.get<UserDto>('/auth/current-user'),
  },

  // Add more resource-specific methods as needed
}

// Define types for your API responses
interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  stockQuantity: number;
  categoryId: number;
  category?: CategoryDto;
  // Add other fields based on your backend model
}
interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
}
interface ServiceDto {
  id?: number;
  name: string;
  description: string;
  price: number;
  // Add other fields based on your backend model
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

interface AuthResponse {
  token: string;
  user: UserDto;
}

interface UserDto {
  id: string;
  email: string;
  roles: string[];
  // Other user properties
}

export type { ProductDto,CategoryDto, ServiceDto, LoginCredentials, RegisterData, AuthResponse, UserDto };