"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, RefreshCw } from "lucide-react"

export default function MarketWatchPage() {
  const [selectedMarket, setSelectedMarket] = useState("forex")
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Market Watch</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Charts</CardTitle>
                  <CardDescription>Real-time market data</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                      <SelectItem value="indices">Indices</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1D</SelectItem>
                      <SelectItem value="1w">1W</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button size="icon" variant="ghost">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">TradingView Chart Widget</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="watchlist">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="market-movers">Market Movers</TabsTrigger>
              <TabsTrigger value="signals">Trading Signals</TabsTrigger>
            </TabsList>

            <TabsContent value="watchlist" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Symbol</th>
                          <th className="text-right font-medium p-2">Price</th>
                          <th className="text-right font-medium p-2">Change</th>
                          <th className="text-right font-medium p-2">Change %</th>
                          <th className="text-right font-medium p-2">High</th>
                          <th className="text-right font-medium p-2">Low</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            symbol: "EUR/USD",
                            price: "1.0892",
                            change: "+0.0008",
                            changePercent: "+0.07%",
                            high: "1.0901",
                            low: "1.0878",
                          },
                          {
                            symbol: "GBP/USD",
                            price: "1.2654",
                            change: "-0.0012",
                            changePercent: "-0.09%",
                            high: "1.2672",
                            low: "1.2642",
                          },
                          {
                            symbol: "USD/JPY",
                            price: "151.42",
                            change: "+0.25",
                            changePercent: "+0.17%",
                            high: "151.68",
                            low: "151.12",
                          },
                          {
                            symbol: "BTC/USD",
                            price: "67,245.80",
                            change: "+1,245.30",
                            changePercent: "+1.89%",
                            high: "67,890.00",
                            low: "65,780.50",
                          },
                          {
                            symbol: "ETH/USD",
                            price: "3,478.25",
                            change: "+87.45",
                            changePercent: "+2.58%",
                            high: "3,512.40",
                            low: "3,385.70",
                          },
                          {
                            symbol: "XAU/USD",
                            price: "2,345.60",
                            change: "-12.80",
                            changePercent: "-0.54%",
                            high: "2,358.40",
                            low: "2,342.10",
                          },
                        ].map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{item.symbol}</td>
                            <td className="p-2 text-right">{item.price}</td>
                            <td
                              className={`p-2 text-right ${item.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                            >
                              {item.change}
                            </td>
                            <td
                              className={`p-2 text-right ${item.changePercent.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                            >
                              {item.changePercent}
                            </td>
                            <td className="p-2 text-right">{item.high}</td>
                            <td className="p-2 text-right">{item.low}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market-movers" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Top Gainers</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "SOL/USD", price: "145.78", changePercent: "+8.42%" },
                          { symbol: "AAPL", price: "187.45", changePercent: "+4.23%" },
                          { symbol: "EUR/TRY", price: "35.67", changePercent: "+3.78%" },
                          { symbol: "NVDA", price: "924.58", changePercent: "+3.45%" },
                          { symbol: "XRP/USD", price: "0.5423", changePercent: "+3.12%" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <span className="font-medium">{item.symbol}</span>
                            <div className="flex items-center gap-2">
                              <span>{item.price}</span>
                              <span className="text-green-500">{item.changePercent}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Top Losers</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "TSLA", price: "178.32", changePercent: "-5.67%" },
                          { symbol: "USD/CNH", price: "7.2145", changePercent: "-2.34%" },
                          { symbol: "META", price: "478.90", changePercent: "-2.12%" },
                          { symbol: "DOGE/USD", price: "0.1234", changePercent: "-1.98%" },
                          { symbol: "NQ100", price: "18,245.67", changePercent: "-1.45%" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <span className="font-medium">{item.symbol}</span>
                            <div className="flex items-center gap-2">
                              <span>{item.price}</span>
                              <span className="text-red-500">{item.changePercent}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signals" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[
                      {
                        symbol: "EUR/USD",
                        type: "BUY",
                        entry: "1.0890",
                        stopLoss: "1.0860",
                        takeProfit: "1.0950",
                        timeframe: "4H",
                        confidence: "High",
                      },
                      {
                        symbol: "BTC/USD",
                        type: "SELL",
                        entry: "67,500.00",
                        stopLoss: "68,200.00",
                        takeProfit: "66,000.00",
                        timeframe: "1D",
                        confidence: "Medium",
                      },
                      {
                        symbol: "XAU/USD",
                        type: "BUY",
                        entry: "2,340.00",
                        stopLoss: "2,320.00",
                        takeProfit: "2,380.00",
                        timeframe: "1D",
                        confidence: "High",
                      },
                      {
                        symbol: "USD/JPY",
                        type: "SELL",
                        entry: "151.50",
                        stopLoss: "152.00",
                        takeProfit: "150.50",
                        timeframe: "4H",
                        confidence: "Medium",
                      },
                    ].map((signal, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{signal.symbol}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${signal.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {signal.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>2h ago</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Entry</p>
                            <p className="font-medium">{signal.entry}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Stop Loss</p>
                            <p className="font-medium">{signal.stopLoss}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Take Profit</p>
                            <p className="font-medium">{signal.takeProfit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Timeframe</p>
                            <p className="font-medium">{signal.timeframe}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs ${
                              signal.confidence === "High"
                                ? "text-green-500"
                                : signal.confidence === "Medium"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {signal.confidence} Confidence
                          </span>
                          <Button size="sm" variant="outline">
                            View Analysis
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Economic Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Today
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Previous</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { time: "08:30", event: "US Nonfarm Payrolls", impact: "high", forecast: "175K", previous: "165K" },
                  { time: "10:00", event: "EU CPI y/y", impact: "medium", forecast: "2.4%", previous: "2.6%" },
                  {
                    time: "12:30",
                    event: "CAD Employment Change",
                    impact: "medium",
                    forecast: "21.2K",
                    previous: "17.5K",
                  },
                  { time: "14:00", event: "US ISM Services PMI", impact: "medium", forecast: "52.1", previous: "51.4" },
                  { time: "18:00", event: "FOMC Member Speech", impact: "low", forecast: "-", previous: "-" },
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b">
                    <div className="w-16 text-sm">{event.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            event.impact === "high"
                              ? "bg-red-500"
                              : event.impact === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <span className="font-medium">{event.event}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <div>
                          <span>Forecast: </span>
                          <span>{event.forecast}</span>
                        </div>
                        <div>
                          <span>Previous: </span>
                          <span>{event.previous}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Fed signals potential rate cut in September", time: "2h ago" },
                  { title: "ECB maintains current interest rates amid inflation concerns", time: "4h ago" },
                  { title: "Oil prices surge as Middle East tensions escalate", time: "6h ago" },
                  { title: "Bitcoin breaks $67K resistance level", time: "8h ago" },
                  { title: "Major tech stocks rally after positive earnings reports", time: "10h ago" },
                ].map((news, index) => (
                  <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                    <h4 className="font-medium hover:text-primary cursor-pointer">{news.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{news.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="link" className="px-0 mt-2">
                View all news
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
