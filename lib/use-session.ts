import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TokenManager } from "./token-refresh";
import { signOut } from "next-auth/react";

export interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
    verificationResponsibilities?: string[];
  };
  accessToken: string;
  expires: string;
}

export function useExtendedSession() {
  const { data: session, status, update } = useSession();
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    // Check if access token is expired
    if (session?.expires) {
      const expiresAt = new Date(session.expires);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Consider token expired if less than 5 minutes remaining
      if (timeUntilExpiry < 5 * 60 * 1000) {
        setIsTokenExpired(true);
      }
    }
  }, [session]);

  const refreshSession = async () => {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      await signOut({ redirect: true, callbackUrl: '/auth' });
      return null;
    }

    try {
      const refreshResult = await TokenManager.handleTokenExpiration(refreshToken);
      
      if (refreshResult) {
        // Update NextAuth session with new access token
        await update({
          ...session,
          accessToken: refreshResult.accessToken,
        });
        
        setIsTokenExpired(false);
        return refreshResult;
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      await signOut({ redirect: true, callbackUrl: '/auth' });
    }
    
    return null;
  };

  const logout = async () => {
    // Call backend logout endpoint
    const refreshToken = TokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear tokens and sign out
    TokenManager.clearTokens();
    await signOut({ redirect: true, callbackUrl: '/auth' });
  };

  return {
    session: session as ExtendedSession | null,
    status,
    isTokenExpired,
    refreshSession,
    logout,
  };
}

// Hook for checking authentication status
export function useAuth() {
  const { session, status } = useExtendedSession();
  
  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user || null,
    accessToken: session?.accessToken || null,
  };
}
