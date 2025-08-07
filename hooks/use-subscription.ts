import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Subscription, SubscriptionType } from '@/types';
import { api } from '@/lib/api';

// This is a mock implementation. In a real application, you would
// check the user's subscription status against your backend.

export type SubscriptionTier = 'free' | 'signals' | 'copy_trading' | 'premium';

// Mock database of user subscriptions
const userSubscriptions: { [userId: string]: SubscriptionTier[] } = {
  'user_123': ['signals'], // Mock user has access to signals
};

export function useSubscription(requiredTier?: SubscriptionType) {
  const { data: session, status } = useSession();
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'loading') {
      return; // Wait for session to be loaded
    }

    setLoading(true);
    setError(null);

    try {
            const response = await api.get('/subscriptions/active');

              const data: Subscription[] = response.data;
      setActiveSubscriptions(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching subscriptions.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const hasSubscription = (tier?: SubscriptionType) => {
    if (!tier) return activeSubscriptions.length > 0;
    return activeSubscriptions.some(sub => sub.type === tier);
  };
  
  const isSubscribed = requiredTier ? hasSubscription(requiredTier) : false;

  return { 
    isSubscribed, 
    hasSubscription,
    activeSubscriptions,
    loading, 
    error,
    refetch: checkSubscription 
  };
} 