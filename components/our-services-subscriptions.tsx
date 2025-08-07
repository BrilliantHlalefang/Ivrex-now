import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ShoppingBag, Lock, Crown, Zap, Users, BarChart3, UserCheck, ExternalLink, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSubscriptionStatus, SubscriptionType } from "@/hooks/use-subscription-status"

interface Service {
  name: string;
  type: SubscriptionType;
  price: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  accessUrl?: string;
}

const services: Service[] = [
  {
    name: "Trading Signals",
    type: SubscriptionType.TRADING_SIGNALS,
    price: "$29/mo",
    description: "Receive real-time buy/sell signals from our expert analysts.",
    icon: Zap,
    features: ["Real-time market signals", "Entry & exit points", "Risk management alerts"],
    accessUrl: "/dashboard?tab=signals",
  },
  {
    name: "Copy Trading Access",
    type: SubscriptionType.COPY_TRADING,
    price: "$49/mo",
    description: "Automatically copy the trades of our top-performing traders.",
    icon: Users,
    features: ["Auto-copy expert trades", "Risk control settings", "Performance reports"],
    accessUrl: "/dashboard?tab=copy-trading",
  },
  {
    name: "Advanced Analytics",
    type: SubscriptionType.ADVANCED_ANALYTICS,
    price: "$79/mo",
    description: "Unlock powerful charting tools and in-depth market analysis.",
    icon: BarChart3,
    features: ["Professional charting tools", "Market analysis reports", "Technical indicators"],
    accessUrl: "/dashboard?tab=analytics",
  },
  {
    name: "Personal Coaching",
    type: SubscriptionType.PERSONAL_COACHING,
    price: "$199/mo",
    description: "One-on-one sessions with a professional trading coach.",
    icon: UserCheck,
    features: ["1-on-1 mentorship sessions", "Personalized strategies", "Weekly progress reviews"],
    accessUrl: "/dashboard?tab=coaching",
  },
]

export default function OurServicesSubscriptions({ showCardWrapper = true }) {
  const router = useRouter()
  const {
    hasAccessToService,
    isProUser,
    loading,
    hasAnyActiveSubscription,
    getSubscription,
  } = useSubscriptionStatus()
  
  const handleSubscribe = (e: React.MouseEvent, service: Service) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(`Subscribing to ${service.name}`)
    router.push(`/subscription-payment?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&type=${service.type}`)
  }

  const handleAccessService = (e: React.MouseEvent, service: Service) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(`Accessing service ${service.name}`)
    if (service.accessUrl) {
      router.push(service.accessUrl)
    }
  }

  const handleManageSubscription = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Managing subscription')
    router.push('/dashboard/settings')
  }

  const ServiceList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {services.map((service) => {
          const hasAccess = hasAccessToService(service.type);
          const subscription = getSubscription(service.type);
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{service.name}</p>
                    {hasAccess && (
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                        {isProUser ? "Pro" : "Active"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  {hasAccess && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {service.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 space-y-2">
                {hasAccess ? (
                  <>
                    <Button 
                      size="sm" 
                      className="w-full flex items-center gap-2"
                      onClick={(e) => handleAccessService(e, service)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Service
                    </Button>
                    {subscription && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        onClick={(e) => handleManageSubscription(e)}
                      >
                        <Settings className="h-4 w-4" />
                        Manage
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="w-full transform transition-all duration-200 hover:scale-105 hover:shadow-md"
                    onClick={(e) => handleSubscribe(e, service)}
                  >
                    Subscribe {service.price}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Always show ServiceList so users can see individual services and their status
  const content = <ServiceList />

  if (!showCardWrapper) {
    return content
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Our Services & Subscriptions</CardTitle>
            <CardDescription>Manage your active plans and discover new services.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
} 