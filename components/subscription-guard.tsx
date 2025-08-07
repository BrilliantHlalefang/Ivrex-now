import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Users, BarChart3, UserCheck } from 'lucide-react';
import { useSubscriptionStatus, SubscriptionType } from '@/hooks/use-subscription-status';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredSubscription: SubscriptionType;
  serviceName: string;
  serviceDescription: string;
  features?: string[];
  fallbackComponent?: React.ReactNode;
  showUpgrade?: boolean;
}

const ServiceIcons = {
  [SubscriptionType.TRADING_SIGNALS]: Zap,
  [SubscriptionType.COPY_TRADING]: Users,
  [SubscriptionType.ADVANCED_ANALYTICS]: BarChart3,
  [SubscriptionType.PERSONAL_COACHING]: UserCheck,
  [SubscriptionType.IVREX_PRO]: Crown,
  [SubscriptionType.SHARES_CHALLENGE]: Lock,
};

const ServicePricing = {
  [SubscriptionType.TRADING_SIGNALS]: '$29',
  [SubscriptionType.COPY_TRADING]: '$49',
  [SubscriptionType.ADVANCED_ANALYTICS]: '$79',
  [SubscriptionType.PERSONAL_COACHING]: '$199',
  [SubscriptionType.IVREX_PRO]: '$99',
  [SubscriptionType.SHARES_CHALLENGE]: '$99',
};

export function SubscriptionGuard({
  children,
  requiredSubscription,
  serviceName,
  serviceDescription,
  features = [],
  fallbackComponent,
  showUpgrade = true,
}: SubscriptionGuardProps) {
  const router = useRouter();
  const {
    hasAccessToService,
    loading,
    isProUser,
    hasActiveSubscription,
  } = useSubscriptionStatus();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user has access
  const hasAccess = hasAccessToService(requiredSubscription);

  // If user has access, show the protected content
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Default subscription prompt
  const Icon = ServiceIcons[requiredSubscription];
  const price = ServicePricing[requiredSubscription];

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Subscribing to ${serviceName}`);
    const serviceParam = encodeURIComponent(serviceName);
    const priceParam = encodeURIComponent(`${price}/mo`);
    router.push(`/subscription-payment?service=${serviceParam}&price=${priceParam}&type=${requiredSubscription}`);
  };

  const handleUpgradeToProUser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Upgrading to Pro User');
    router.push('/subscription-payment?service=IVREX%20Pro&price=$99/mo&type=ivrex_pro');
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          {serviceName} Required
        </CardTitle>
        <CardDescription className="max-w-sm mx-auto">
          {serviceDescription}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {/* Show current subscription status */}
        <div className="flex justify-center">
          {isProUser ? (
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800">
              <Crown className="h-3 w-3 mr-1" />
              Pro User
            </Badge>
          ) : hasActiveSubscription(requiredSubscription) ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Subscribed to {serviceName}
            </Badge>
          ) : (
            <Badge variant="outline">
              No Active Subscription
            </Badge>
          )}
        </div>

        {/* Feature list */}
        {features.length > 0 && (
          <div className="text-left max-w-xs mx-auto">
            <p className="font-medium mb-2 text-center">This service includes:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          {/* Primary subscription button */}
          <Button onClick={(e) => handleSubscribe(e)} size="lg" className="w-full">
            Subscribe to {serviceName} - {price}/mo
          </Button>

          {/* Pro upgrade option for non-pro users */}
          {showUpgrade && !isProUser && requiredSubscription !== SubscriptionType.IVREX_PRO && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">or</p>
              <Button 
                onClick={(e) => handleUpgradeToProUser(e)} 
                variant="outline" 
                size="lg" 
                className="w-full border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to IVREX Pro - $99/mo
                <Badge variant="secondary" className="ml-2 bg-yellow-200 text-yellow-800">
                  All Services
                </Badge>
              </Button>
              <p className="text-xs text-muted-foreground">
                Get access to all services with one subscription
              </p>
            </div>
          )}
        </div>

        {/* Additional info */}
        <p className="text-xs text-muted-foreground pt-2">
          Secure payment processing • Cancel anytime
        </p>
      </CardContent>
    </Card>
  );
}

// Convenience wrapper for common use cases
export function withSubscriptionGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredSubscription: SubscriptionType,
  serviceName: string,
  serviceDescription: string,
  features?: string[]
) {
  return function WrappedComponent(props: P) {
    return (
      <SubscriptionGuard
        requiredSubscription={requiredSubscription}
        serviceName={serviceName}
        serviceDescription={serviceDescription}
        features={features}
      >
        <Component {...props} />
      </SubscriptionGuard>
    );
  };
} 