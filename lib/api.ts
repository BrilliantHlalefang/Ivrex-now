import axios from 'axios';
import { getSession } from 'next-auth/react';
import { User, Signal } from "@/types";

// Export the base URL for other components to use
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3002';

console.log('API_BASE_URL configured as:', API_BASE_URL);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session cache to reduce getSession calls
let sessionCache: { session: any; timestamp: number } | null = null;
const SESSION_CACHE_TTL = 5000; // 5 seconds cache

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Use cached session if available and not expired
      const now = Date.now();
      let session;
      
      if (sessionCache && (now - sessionCache.timestamp) < SESSION_CACHE_TTL) {
        session = sessionCache.session;
      } else {
        session = await getSession();
        sessionCache = { session, timestamp: now };
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Session retrieved:', {
            hasSession: !!session,
            hasAccessToken: !!session?.accessToken,
            userEmail: session?.user?.email,
            tokenLength: session?.accessToken?.length || 0
          });
        }
      }
      
      if (session?.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.accessToken}`;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔑 Adding Authorization header for:', config.url);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ No access token available for:', config.url);
        }
      }
      
      // For multipart/form-data, let the browser set the Content-Type
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      // Continue with request even if session fetch fails
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 and haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 401 error, clearing session cache and retrying...');
      }
      
      // Clear session cache to force fresh session fetch
      sessionCache = null;
      
      try {
        // Try to get a fresh session
        const session = await getSession();
        if (session?.accessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${session.accessToken}`;
          return api(originalRequest);
        }
      } catch (retryError) {
        console.error('Failed to retry with fresh session:', retryError);
      }
    }
    
    // Log authentication errors in development
    if (error.response?.status === 401 && process.env.NODE_ENV === 'development') {
      console.error('🚫 Authentication failed for:', error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

// Logout function to invalidate token on the server
export const logoutServerSide = async (): Promise<void> => {
  try {
    const session = await getSession();
    if (session?.accessToken) {
      await api.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Server-side logout failed:', error);
    // Continue with client-side logout even if server-side fails
  }
};

// Export both named and default exports
export { api };
export default api;

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

// Example usage (will be used in components later):
export const getUsers = () => fetcher<User[]>('/users');
// export const getAssets = () => fetcher<Asset[]>('/assets'); 

export const getActiveSignals = async (): Promise<Signal[]> => {
  const response = await api.get('/signals/list/active');
  return response.data;
};

export const getSignalHistory = async (): Promise<Signal[]> => {
  const response = await api.get('/signals/list/history');
  return response.data;
};

export const closeSignal = async (id: string): Promise<Signal> => {
  const response = await api.patch(`/signals/${id}/close`);
  return response.data;
};

export const createSignal = async (signalData: any): Promise<Signal> => {
  const response = await api.post('/signals', signalData);
  return response.data;
};

// Challenge API functions
export const createChallenge = async (formData: FormData): Promise<any> => {
  const response = await api.post('/challenges', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyChallenges = async (): Promise<any[]> => {
  const response = await api.get('/challenges/my-challenges');
  return response.data;
};

export const linkChallengeToSubscription = async (challengeId: string, subscriptionId: string): Promise<any> => {
  const response = await api.post(`/challenges/${challengeId}/link-subscription`, {
    subscriptionId,
  });
  return response.data;
};

export const checkChallengeAccess = async (): Promise<{ hasAccess: boolean }> => {
  const response = await api.get('/challenges/access-check');
  return response.data;
};

export const createChallengeSimple = async (description: string): Promise<any> => {
  const response = await api.post('/challenges/simple', {
    description: description,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteChallenge = async (challengeId: string): Promise<void> => {
  const response = await api.delete(`/challenges/${challengeId}`);
  return response.data;
};

// Subscription API functions
export const getMySubscriptions = async (): Promise<any[]> => {
  const response = await api.get('/subscriptions');
  return response.data;
};

export const getActiveSubscriptions = async (): Promise<any[]> => {
  const response = await api.get('/subscriptions/active');
  return response.data;
};

export const cancelSubscription = async (subscriptionId: string): Promise<any> => {
  const response = await api.post(`/subscriptions/${subscriptionId}/cancel`);
  return response.data;
}; 