"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  Signal,
  Users,
  LifeBuoy,
  Trophy,
  Plus,
  ExternalLink,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DashboardHeader from "@/components/dashboard-header"
import AnalyticalSolutions from "@/components/analytical-solutions"
import OurServicesSubscriptions from "@/components/our-services-subscriptions"
import SharesChallenge from "@/components/shares-challenge"
import CustomerSupport from "@/components/customer-support"
import CopyTradingDashboard from "@/components/copy-trading-dashboard"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionType } from "@/hooks/use-subscription-status"

import ActiveSignals from "@/components/signals/active-signals"
import SignalHistory from "@/components/signals/signal-history"
import { NotificationsTab } from "@/components/notifications/notifications-tab"
import { useToast } from "@/components/ui/use-toast"
import { useWebSocketNotifications } from "@/hooks/use-websocket-notifications"
import { Signal as SignalType } from "@/types/signal"
import Image from "next/image"
import { getActiveSignals, getSignalHistory, closeSignal } from "@/lib/api"

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You must log in to access the dashboard.</p>
          <a href="/auth" className="text-blue-600 hover:text-blue-800 underline">
            Go to Login Page
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar user={session.user} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={session.user} />
            <main className="flex-1 p-6 overflow-y-auto">
              <PersonalDashboard />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

function DashboardSidebar({
  user,
}: {
  user: any
}) {
  // Helper function to get initials from user name
  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("") || "U";
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Image 
            src="/logo3.png" 
            alt="Ivrex Logo" 
            width={60} 
            height={60} 
            className="rounded-full object-cover"
            priority
          />
          
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/dashboard">
                    <Home />
                    <span>Overview</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard#signals">
                    <Signal />
                    <span>Trading Signals</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard#copy-trading">
                    <Users />
                    <span>Copy Trading</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/dashboard">
                      <BarChart3 />
                      <span>Verifications</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/signals">
                      <Signal />
                      <span>Manage Signals</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/users">
                      <Users />
                      <span>Manage Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/support">
                    <LifeBuoy />
                    <span>Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "No email"}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function PersonalDashboard() {
  const [currentHash, setCurrentHash] = useState("")
  const [activeSignals, setActiveSignals] = useState<SignalType[]>([]);
  const [signalHistory, setSignalHistory] = useState<SignalType[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();
  const toastRef = useRef(toast);
  
  // Update toast ref when toast changes
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  // WebSocket connection for real-time signal updates
  const { isConnected, notifications } = useWebSocketNotifications({
    enabled: true, // Enabled - backend WebSocket server exists and is properly configured
  });

  // Handle notifications using useEffect
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      
      // Handle signal-related notifications
      if (latestNotification.type === 'signal') {
        fetchSignals(); // Refresh signals when signal notification received
      }
      
      // Handle signal events
      if (latestNotification.type === 'signal_created') {
        const signal = latestNotification.data;
        setActiveSignals(prev => [signal, ...prev]);
        
        toastRef.current({
          title: "New Trading Signal",
          description: `${signal.symbol} ${signal.type.toUpperCase()} signal created`,
        });
      }
      
      if (latestNotification.type === 'signal_closed') {
        const signal = latestNotification.data;
        setActiveSignals(prev => prev.filter(s => s.id !== signal.id));
        setSignalHistory(prev => [signal, ...prev]);
        
        toastRef.current({
          title: "Signal Closed",
          description: `${signal.symbol} ${signal.type.toUpperCase()} signal has been closed`,
        });
      }
      
      if (latestNotification.type === 'signal_updated') {
        const signal = latestNotification.data;
        setActiveSignals(prev => prev.map(s => s.id === signal.id ? signal : s));
      }
    }
  }, [notifications, toastRef]);

  const fetchSignals = useCallback(async () => {
    try {
      const active = await getActiveSignals();
      setActiveSignals(active);

      const history = await getSignalHistory();
      setSignalHistory(history);
    } catch (error: any) {
      // Handle authentication errors silently
      if (error.response?.status === 401) {
        return
      }
      
      toastRef.current({
        variant: "destructive",
        title: "Failed to Load Signals",
        description: "Unable to fetch trading signals. Please try refreshing the page.",
      });
    }
  }, []); // Remove dependencies to prevent infinite re-renders

  // Auto-refresh signals more frequently for better responsiveness
  useEffect(() => {
    if (!session?.accessToken) return;

    fetchSignals();
    const interval = setInterval(fetchSignals, 10000); // 10 seconds for better responsiveness

    return () => clearInterval(interval);
  }, [session?.accessToken, fetchSignals]);

  const handleCloseSignal = useCallback(async (id: string) => {
    if (!session?.accessToken) {
      toastRef.current({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to close signals.",
      });
      return;
    }

    try {
      await closeSignal(id);
      toastRef.current({
        title: "Signal Closed",
        description: "Trading signal has been successfully closed.",
      });
      fetchSignals();
    } catch (error) {
      toastRef.current({
        variant: "destructive",
        title: "Failed to Close Signal",
        description: "Unable to close the signal. Please try again.",
      });
    }
  }, [session?.accessToken, fetchSignals]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1)
      if (hash && ['signals', 'copy-trading'].includes(hash)) {
        setCurrentHash(hash)
      } else {
        setCurrentHash('signals')
      }
    }
  }, [])

  useEffect(() => {
    if (currentHash && typeof window !== 'undefined') {
      window.location.hash = currentHash
    }
  }, [currentHash])

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Personal Dashboard</h1>
        {/* Debug info - remove in production */}
        <div className="text-sm text-muted-foreground">
          WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'} | 
          Active Signals: {activeSignals.length} | 
          Signal History: {signalHistory.length}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticalSolutions />
        </div>

        <div className="lg:col-span-1">
          <Card>
            <Tabs defaultValue="services" className="w-full">
              <CardHeader className="px-4 pt-4 pb-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="challenge">Challenge</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-4">
                <TabsContent value="services">
                  <OurServicesSubscriptions showCardWrapper={false} />
                </TabsContent>
                <TabsContent value="challenge">
                  <SharesChallenge showCardWrapper={false} />
                </TabsContent>
                <TabsContent value="support">
                  <CustomerSupport showCardWrapper={false} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={currentHash} onValueChange={(value) => {
            setCurrentHash(value);
            if (typeof window !== 'undefined') {
              window.location.hash = value;
            }
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signals">Trading Signals</TabsTrigger>
              <TabsTrigger value="copy-trading">Copy Trading</TabsTrigger>
            </TabsList>
            <TabsContent value="signals" className="mt-4">
              <SubscriptionGuard
                requiredSubscription={SubscriptionType.TRADING_SIGNALS}
                serviceName="Trading Signals"
                serviceDescription="Get exclusive access to real-time buy/sell signals from our expert analysts."
                features={[
                  "Real-time market signals",
                  "Entry & exit points", 
                  "Risk management alerts",
                  "Performance tracking"
                ]}
              >
                <div id="signals" className="scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Trading Signals</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Active Signals</h3>
                      <ActiveSignals signals={activeSignals} onCloseSignal={handleCloseSignal} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Signal History</h3>
                      <SignalHistory signals={signalHistory} />
                    </div>
                  </div>
                </div>
              </SubscriptionGuard>
            </TabsContent>
            <TabsContent value="copy-trading" className="mt-4">
              <CopyTradingDashboard />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Floating Action Button for Create Real Account */}
      <Button 
        className="fixed bottom-8 right-8 rounded-full w-auto h-14 px-6 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 border-none animate-pulse hover:animate-none z-50 text-white font-medium text-base"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open("https://track.deriv.com/_K5JaVtKRs9RMjdsyM5hasGNd7ZgqdRLk/1/", "_blank");
        }}
      >
        <Plus className="h-5 w-5 mr-2" />
        Create Real Account with Deriv
      </Button>
    </div>
  );
}
