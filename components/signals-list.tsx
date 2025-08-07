import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Clock, Info, Lock } from "lucide-react"
import { getDerivSymbol } from "@/lib/deriv"
import { activeSignals, signalHistory, Signal, SignalHistory } from "@/lib/mock-data"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionType } from "@/hooks/use-subscription-status"

function SignalCard({ signal }: { signal: Signal }) {
  const isProfit = signal.status === "In Profit"
  const statusColor = isProfit ? "text-green-500" : "text-red-500"
  const badgeColor = signal.type === "BUY" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {/* Column 1: Symbol & Type */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{signal.symbol}</span>
              <Badge className={`${badgeColor} hover:${badgeColor} font-semibold`}>{signal.type}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{signal.time}</span>
            </div>
            <div className="text-sm text-muted-foreground">Timeframe: {signal.timeframe}</div>
          </div>

          {/* Column 2: Prices */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium text-muted-foreground">Entry Price</div>
            <div className="text-right font-mono">{signal.entry}</div>
            <div className="font-medium text-muted-foreground">Current Price</div>
            <div className="text-right font-mono font-semibold">{signal.current}</div>
            <div className="font-medium text-muted-foreground">Stop Loss</div>
            <div className="text-right font-mono">{signal.stopLoss}</div>
            <div className="font-medium text-muted-foreground">Take Profit</div>
            <div className="text-right font-mono">{signal.takeProfit}</div>
          </div>

          {/* Column 3: P&L */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className={`text-lg font-bold ${statusColor}`}>{signal.status}</div>
            <div className={`text-2xl font-mono font-bold ${statusColor}`}>{signal.profit}</div>
          </div>

          {/* Column 4: Actions */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              <Info className="mr-2 h-4 w-4" />
              View Chart
            </Button>
            <Button variant="destructive" size="sm">
              Close Position
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SignalHistoryTable({ history }: { history: SignalHistory[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal History</CardTitle>
        <CardDescription>Your past trading signals and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium p-2">Symbol</th>
                <th className="text-left font-medium p-2">Type</th>
                <th className="text-left font-medium p-2">Entry</th>
                <th className="text-left font-medium p-2">Exit</th>
                <th className="text-left font-medium p-2">Profit/Loss</th>
                <th className="text-left font-medium p-2">Date</th>
                <th className="text-left font-medium p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((signal) => (
                <tr key={signal.symbol + signal.date} className="border-b">
                  <td className="p-2 font-medium">{signal.symbol}</td>
                  <td className="p-2">
                    <Badge variant={signal.type === "BUY" ? "default" : "destructive"} className="text-xs">
                      {signal.type}
                    </Badge>
                  </td>
                  <td className="p-2">{signal.entry}</td>
                  <td className="p-2">{signal.exit}</td>
                  <td className={`p-2 ${signal.profit.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {signal.profit}
                  </td>
                  <td className="p-2 text-sm text-muted-foreground">{signal.date}</td>
                  <td className="p-2">
                    <Badge
                      variant="outline"
                      className={signal.status === "Win" ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                    >
                      {signal.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function SignalSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Settings</CardTitle>
        <CardDescription>Customize your trading signal preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Signal settings will be available here.</p>
      </CardContent>
    </Card>
  )
}

function SignalsContent() {
  return (
    <Tabs defaultValue="active">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="active">Active Signals</TabsTrigger>
          <TabsTrigger value="history">Signal History</TabsTrigger>
          <TabsTrigger value="settings">Signal Settings</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active">
        <div className="space-y-4">
          {activeSignals.map((signal) => (
            <SignalCard key={signal.symbol} signal={signal} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="history">
        <SignalHistoryTable history={signalHistory} />
      </TabsContent>
      <TabsContent value="settings">
        <SignalSettings />
      </TabsContent>
    </Tabs>
  );
}

export default function SignalsList() {
  return (
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
      <SignalsContent />
    </SubscriptionGuard>
  );
}
