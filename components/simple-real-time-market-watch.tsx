"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import TradingViewChart from "./trading-view-chart"

// Static market data to avoid infinite loops
const staticMarketData = [
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    price: 1.0892,
    change: 0.0008,
    changePercent: 0.07,
    category: "forex",
    tradingViewSymbol: "EURUSD"
  },
  {
    symbol: "GBP/USD", 
    name: "British Pound / US Dollar",
    price: 1.2654,
    change: -0.0012,
    changePercent: -0.09,
    category: "forex",
    tradingViewSymbol: "GBPUSD"
  },
  {
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen", 
    price: 151.42,
    change: 0.25,
    changePercent: 0.17,
    category: "forex",
    tradingViewSymbol: "USDJPY"
  },
  {
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    price: 67245.8,
    change: 1245.3,
    changePercent: 1.89,
    category: "crypto",
    tradingViewSymbol: "BTCUSD"
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum / US Dollar",
    price: 3478.25,
    change: 87.45,
    changePercent: 2.58,
    category: "crypto", 
    tradingViewSymbol: "ETHUSD"
  },
  {
    symbol: "XAU/USD",
    name: "Gold / US Dollar",
    price: 2345.6,
    change: -12.8,
    changePercent: -0.54,
    category: "commodities",
    tradingViewSymbol: "XAUUSD"
  }
]

export default function SimpleRealTimeMarketWatch() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("symbol")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>("EUR/USD")

  // Filter data
  const filteredData = staticMarketData.filter((asset) => {
    if (selectedCategory !== "all" && asset.category !== selectedCategory) {
      return false
    }

    if (
      searchQuery &&
      !asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0

    if (sortBy === "symbol") {
      comparison = a.symbol.localeCompare(b.symbol)
    } else if (sortBy === "price") {
      comparison = a.price - b.price
    } else if (sortBy === "changePercent") {
      comparison = a.changePercent - b.changePercent
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleSortClick = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    )
  }

  const formatChangePercent = (changePercent: number) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`
  }

  const selectedAsset = staticMarketData.find(asset => asset.symbol === selectedSymbol)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart section */}
      <div className="lg:col-span-2">
        {selectedAsset && <TradingViewChart symbol={selectedAsset.tradingViewSymbol} />}
      </div>

      {/* Market data section */}
      <div>
        <Card className="w-full">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Market Watch</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  TradingView Data
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search symbols..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b">
                    <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSortClick("symbol")}>
                      <span className="flex items-center">Symbol {renderSortIndicator("symbol")}</span>
                    </th>
                    <th className="text-right font-medium p-2 cursor-pointer" onClick={() => handleSortClick("price")}>
                      <span className="flex items-center justify-end">Price {renderSortIndicator("price")}</span>
                    </th>
                    <th
                      className="text-right font-medium p-2 cursor-pointer"
                      onClick={() => handleSortClick("changePercent")}
                    >
                      <span className="flex items-center justify-end">
                        Chg % {renderSortIndicator("changePercent")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((asset, index) => (
                    <tr
                      key={`${asset.symbol}-${index}`}
                      className={`border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedSymbol === asset.symbol ? "bg-muted/50" : ""
                      }`}
                      onClick={() => setSelectedSymbol(asset.symbol)}
                    >
                      <td className="p-2 font-medium">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {asset.category.toUpperCase()}
                          </Badge>
                          <span>{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="p-2 text-right font-mono">
                        {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
                      </td>
                      <td
                        className={`p-2 text-right font-mono ${
                          asset.changePercent >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        <div className="flex items-center justify-end">
                          {asset.changePercent >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {formatChangePercent(asset.changePercent)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}