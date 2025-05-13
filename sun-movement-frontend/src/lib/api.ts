"use client";

// Base URL for API requests
const API_BASE_URL = "/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
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
  };

  // Add body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

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

  // Return the data
  return response.json() as Promise<T>;
}

// Create specialized request methods for different HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) => 
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) => 
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),
    
  put: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) => 
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),
    
  delete: <T>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) => 
    apiRequest<T>(endpoint, { ...options, method: "DELETE" })
};
