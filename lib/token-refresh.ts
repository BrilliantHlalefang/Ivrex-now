import { API_BASE_URL } from "@/lib/api";
import { signOut } from "next-auth/react";

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
    verificationResponsibilities?: string[];
  };
}

export class TokenManager {
  private static isRefreshing = false;
  private static refreshPromise: Promise<TokenRefreshResponse> | null = null;

  static async refreshTokens(refreshToken: string): Promise<TokenRefreshResponse> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to refresh tokens");
        }
        return response.json();
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  static async handleTokenExpiration(refreshToken: string): Promise<TokenRefreshResponse | null> {
    try {
      const response = await this.refreshTokens(refreshToken);
      
      // Store new tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear tokens and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refreshToken');
      }
      
      await signOut({ redirect: true, callbackUrl: '/auth' });
      return null;
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('refreshToken');
  }
}
