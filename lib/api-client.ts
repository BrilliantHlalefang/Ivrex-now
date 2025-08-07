import { API_BASE_URL } from "./api";
import { TokenManager } from "./token-refresh";
import { signOut } from "next-auth/react";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getAccessToken(): Promise<string | null> {
    // This would typically come from NextAuth session
    // For now, we'll handle it through the interceptor
    return null;
  }

  private async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    // Add authorization header if we have access token
    const accessToken = await this.getAccessToken();
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    return fetch(fullUrl, options);
  }

  async request(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    try {
      let response = await this.makeRequest(url, options);

      // If we get 401, try to refresh the token
      if (response.status === 401) {
        const refreshToken = TokenManager.getRefreshToken();
        
        if (refreshToken) {
          const refreshResult = await TokenManager.handleTokenExpiration(refreshToken);
          
          if (refreshResult) {
            // Retry the original request with new access token
            const newOptions = {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${refreshResult.accessToken}`,
              },
            };
            
            response = await this.makeRequest(url, newOptions);
          }
        }
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(url: string, options?: RequestInit): Promise<Response> {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options?: RequestInit): Promise<Response> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Helper function to create authenticated fetch with automatic token refresh
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return apiClient.request(url, options);
}
