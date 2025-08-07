import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getActiveSubscriptions } from '@/lib/api';

export enum SubscriptionType {
  TRADING_SIGNALS = 'trading_signals',
  COPY_TRADING = 'copy_trading', 
  ADVANCED_ANALYTICS = 'advanced_analytics',
  PERSONAL_COACHING = 'personal_coaching',
  IVREX_PRO = 'ivrex_pro',
  SHARES_CHALLENGE = 'shares_challenge',
}

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PAYMENT_FAILED = 'payment_failed',
}

export interface Subscription {
  id: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  price: number;
  expiresAt: string;
  createdAt: string;
  paymentMethod?: string;
  verificationNotes?: string;
}

export interface SubscriptionStatusState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface SubscriptionHookReturn extends SubscriptionStatusState {
  // Subscription checking methods
  hasActiveSubscription: (type: SubscriptionType) => boolean;
  hasAccessToService: (serviceType: SubscriptionType) => boolean;
  getSubscription: (type: SubscriptionType) => Subscription | null;
  getActiveSubscriptions: () => Subscription[];
  
  // Utility methods
  refresh: () => Promise<void>;
  isProUser: boolean;
  hasAnyActiveSubscription: boolean;
  
  // Service-specific helpers
  canAccessTradingSignals: boolean;
  canAccessCopyTrading: boolean;
  canAccessAdvancedAnalytics: boolean;
  canAccessPersonalCoaching: boolean;
  canAccessSharesChallenge: boolean;
}

export function useSubscriptionStatus(): SubscriptionHookReturn {
  const { data: session, status: sessionStatus } = useSession();
  const [state, setState] = useState<SubscriptionStatusState>({
    subscriptions: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchSubscriptions = async () => {
    if (!session?.accessToken) {
      setState(prev => ({ ...prev, loading: false, subscriptions: [] }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const subscriptions = await getActiveSubscriptions();
      
      setState(prev => ({
        ...prev,
        subscriptions,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (error: any) {
      console.error('Failed to fetch subscriptions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load subscriptions',
      }));
    }
  };

  // Initial fetch and session-based refetch
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchSubscriptions();
    } else if (sessionStatus === 'unauthenticated') {
      setState({
        subscriptions: [],
        loading: false,
        error: null,
        lastUpdated: null,
      });
    }
  }, [session?.accessToken, sessionStatus]);

  // Subscription checking methods
  const hasActiveSubscription = (type: SubscriptionType): boolean => {
    return state.subscriptions.some(
      sub => sub.type === type && sub.status === SubscriptionStatus.ACTIVE
    );
  };

  const hasAccessToService = (serviceType: SubscriptionType): boolean => {
    // IVREX_PRO gives access to all services
    const hasProSubscription = hasActiveSubscription(SubscriptionType.IVREX_PRO);
    if (hasProSubscription) return true;
    
    // Otherwise check for specific subscription
    return hasActiveSubscription(serviceType);
  };

  const getSubscription = (type: SubscriptionType): Subscription | null => {
    return state.subscriptions.find(
      sub => sub.type === type && sub.status === SubscriptionStatus.ACTIVE
    ) || null;
  };

  const getActiveSubscriptions = (): Subscription[] => {
    return state.subscriptions.filter(sub => sub.status === SubscriptionStatus.ACTIVE);
  };

  // Computed properties
  const isProUser = hasActiveSubscription(SubscriptionType.IVREX_PRO);
  const hasAnyActiveSubscription = getActiveSubscriptions().length > 0;

  // Service-specific access checks
  const canAccessTradingSignals = hasAccessToService(SubscriptionType.TRADING_SIGNALS);
  const canAccessCopyTrading = hasAccessToService(SubscriptionType.COPY_TRADING);
  const canAccessAdvancedAnalytics = hasAccessToService(SubscriptionType.ADVANCED_ANALYTICS);
  const canAccessPersonalCoaching = hasAccessToService(SubscriptionType.PERSONAL_COACHING);
  const canAccessSharesChallenge = hasAccessToService(SubscriptionType.SHARES_CHALLENGE);

  return {
    // State
    ...state,
    
    // Methods
    hasActiveSubscription,
    hasAccessToService,
    getSubscription,
    getActiveSubscriptions,
    refresh: fetchSubscriptions,
    
    // Computed properties
    isProUser,
    hasAnyActiveSubscription,
    
    // Service-specific helpers
    canAccessTradingSignals,
    canAccessCopyTrading,
    canAccessAdvancedAnalytics,
    canAccessPersonalCoaching,
    canAccessSharesChallenge,
  };
} 