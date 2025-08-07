"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import TradingViewChart from "@/components/trading-view-chart"
import { LineChart } from "lucide-react"

export default function SimpleMarketWatch() {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")

  // Simple symbol list without external dependencies
  const symbols = [
    { value: "EURUSD", label: "EUR/USD", category: "Forex" },
    { value: "GBPUSD", label: "GBP/USD", category: "Forex" },
    { value: "USDJPY", label: "USD/JPY", category: "Forex" },
    { value: "BTCUSD", label: "BTC/USD", category: "Crypto" },
    { value: "ETHUSD", label: "ETH/USD", category: "Crypto" },
    { value: "XAUUSD", label: "Gold/USD", category: "Commodities" },
  ]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Market Watch
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  TradingView
                </Badge>
              </CardTitle>
              <CardDescription>
                Interactive market charts
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Symbol Selection */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="min-w-[180px]">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbols.map((symbol) => (
                  <SelectItem key={symbol.value} value={symbol.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {symbol.category}
                      </Badge>
                      {symbol.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Select a trading instrument to view its chart
          </div>
        </div>

        {/* TradingView Chart */}
        <div className="flex-1 min-h-[400px]">
          <TradingViewChart symbol={selectedSymbol} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
          <div className="flex items-center gap-4">
            <span>Chart: TradingView</span>
            <span>•</span>
            <span>Real-time data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">● Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}