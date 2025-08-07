import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Copy, Star, TrendingUp, Users, Loader2 } from "lucide-react"
import { getUsers } from "@/lib/api"
import { Trader, User } from "@/types"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionType } from "@/hooks/use-subscription-status"

function CopyTradingContent() {

  const [traders, setTraders] = useState<Trader[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        setLoading(true)
        const users = await getUsers()
        // Mocking additional trader data until backend provides it
        const tradersData: Trader[] = users.map((user: User) => ({
          ...user,
          profit: `${(Math.random() * 50).toFixed(1)}%`,
          followers: Math.floor(Math.random() * 2000),
          winRate: Math.floor(Math.random() * 30) + 70,
          trades: Math.floor(Math.random() * 500),
          specialties: ["Forex", "Crypto"], // Mock data
          risk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
        }));
        setTraders(tradersData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to fetch traders.")
      } finally {
        setLoading(false)
      }
    }

    fetchTraders()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading traders...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Traders</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="traders">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="copied">Traders You Copy</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Find Traders
        </Button>
      </div>

      <TabsContent value="traders">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {traders.map((trader, index) => {
            const displayName =
              (trader.profile?.firstName || trader.profile?.lastName)
                ? `${trader.profile.firstName || ''} ${trader.profile.lastName || ''}`.trim()
                : trader.email?.split('@')[0] || `User ${trader.id}`;

            const avatarFallback =
              (trader.profile?.firstName?.charAt(0) || '') +
              (trader.profile?.lastName?.charAt(0) || '') ||
              trader.email?.charAt(0).toUpperCase() ||
              'U';

            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trader.profile?.image || "/placeholder.svg"} alt={displayName} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{displayName}</CardTitle>
                        <CardDescription>
                          {trader.email ? `@${trader.email.split('@')[0]}` : 'No public email'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500 font-medium">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {trader.profit}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="font-medium">{trader.followers}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                      <p className="font-medium">{trader.winRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Trades</p>
                      <p className="font-medium">{trader.trades}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Risk Level</span>
                      <span className="font-medium">{trader.risk}</span>
                    </div>
                    <Progress value={trader.risk === "Low" ? 33 : trader.risk === "Medium" ? 66 : 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {trader.specialties.map((specialty, i) => (
                      <Badge key={i} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Trader
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="copied">
        <Card>
          <CardHeader>
            <CardTitle>Traders You Copy</CardTitle>
            <CardDescription>Manage your copy trading relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  name: "Alex Morgan",
                  username: "alexm_trader",
                  avatar: "/placeholder.svg?height=100&width=100",
                  profit: "+12.8%",
                  allocation: "$5,000",
                  openTrades: 3,
                  status: "Active",
                  lastTrade: "2h ago",
                },
                {
                  name: "Michael Rodriguez",
                  username: "miker_trading",
                  avatar: "/placeholder.svg?height=100&width=100",
                  profit: "+8.5%",
                  allocation: "$3,500",
                  openTrades: 1,
                  status: "Active",
                  lastTrade: "5h ago",
                },
              ].map((trader, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.name} />
                      <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{trader.name}</p>
                      <p className="text-sm text-muted-foreground">@{trader.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    <div>
                      <p className="text-xs text-muted-foreground">Profit/Loss</p>
                      <p className="font-medium text-green-500">{trader.profit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Allocation</p>
                      <p className="font-medium">{trader.allocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Open Trades</p>
                      <p className="font-medium">{trader.openTrades}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Trade</p>
                      <p className="font-medium">{trader.lastTrade}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1 md:flex-none">
                      Stop Copying
                    </Button>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <p className="text-muted-foreground mb-4">Looking for more traders to copy?</p>
                <Button>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Browse Top Traders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default function CopyTradingDashboard() {
  return (
    <SubscriptionGuard
      requiredSubscription={SubscriptionType.COPY_TRADING}
      serviceName="Copy Trading Access"
      serviceDescription="Automatically copy the trades of our top-performing traders."
      features={[
        "Auto-copy expert trades",
        "Risk control settings", 
        "Performance reports",
        "Multiple trader options"
      ]}
    >
      <CopyTradingContent />
    </SubscriptionGuard>
  );
}
