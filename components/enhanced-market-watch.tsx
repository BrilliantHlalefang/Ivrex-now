"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, RefreshCw, Search, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TradingViewChart from "./trading-view-chart"
import { useDerivMarketDataV2 } from "@/hooks/use-deriv-market-data-v2"

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Market Watch Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Market watch temporarily unavailable. Please refresh the page.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Market Asset type (compatible with legacy)
type MarketAsset = {
  symbol: string
  name: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: string
  marketCap?: string
  category: "forex" | "crypto" | "indices" | "commodities" | "stocks" | "synthetic"
}

// Main component
function MarketWatchContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("symbol")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)

  // Stable symbol list - memoized to prevent dependency changes
  const defaultSymbols = useMemo(() => [
    'frxEURUSD', 'frxGBPUSD', 'frxUSDJPY', 'frxAUDUSD', 'frxUSDCAD', // Forex
    'frxXAUUSD', 'frxXAGUSD', // Commodities (Gold, Silver)
    'cryBTCUSD', 'cryETHUSD', 'cryLTCUSD', // Crypto
    'R_100', 'R_50', 'R_25', // Synthetic indices (24/7)
    'BOOM1000', 'CRASH1000' // Boom/Crash indices
  ], []);

  // Use improved Deriv market data hook
  const {
    prices,
    isConnected,
    isConnecting,
    error,
    apiConnected,
    subscribedSymbols,
    subscribeToSymbols,
    formatSymbolDisplay,
    getSymbolPrice,
    totalPriceUpdates,
    connectionStatus
  } = useDerivMarketDataV2({
    enabled: true,
    autoSubscribeSymbols: defaultSymbols
  });

  // Convert Deriv prices to MarketAsset format with error handling
  const marketData: MarketAsset[] = useMemo(() => {
    try {
      return Object.values(prices).map(tick => ({
        symbol: formatSymbolDisplay(tick.symbol),
        name: getSymbolDisplayName(tick.symbol),
        price: tick.price,
        previousPrice: tick.previousPrice,
        change: tick.change,
        changePercent: tick.changePercent,
        high: tick.high,
        low: tick.low,
        volume: tick.volume || 'Live',
        category: categorizeDerivSymbol(tick.symbol)
      }));
    } catch (error) {
      console.error('Error processing market data:', error);
      return [];
    }
  }, [prices, formatSymbolDisplay]);

  // Set default selected symbol when data loads
  useEffect(() => {
    if (!selectedSymbol && marketData.length > 0) {
      setSelectedSymbol(marketData[0].symbol);
    }
  }, [marketData, selectedSymbol]);

  // Helper functions
  function getSymbolDisplayName(derivSymbol: string): string {
    const symbolMap: Record<string, string> = {
      'frxEURUSD': 'Euro / US Dollar',
      'frxGBPUSD': 'British Pound / US Dollar', 
      'frxUSDJPY': 'US Dollar / Japanese Yen',
      'frxAUDUSD': 'Australian Dollar / US Dollar',
      'frxUSDCAD': 'US Dollar / Canadian Dollar',
      'frxXAUUSD': 'Gold / US Dollar',
      'frxXAGUSD': 'Silver / US Dollar',
      'cryBTCUSD': 'Bitcoin / US Dollar',
      'cryETHUSD': 'Ethereum / US Dollar',
      'cryLTCUSD': 'Litecoin / US Dollar',
      'R_100': 'Volatility 100 Index',
      'R_50': 'Volatility 50 Index',
      'R_25': 'Volatility 25 Index',
      'BOOM1000': 'Boom 1000 Index',
      'CRASH1000': 'Crash 1000 Index'
    };
    return symbolMap[derivSymbol] || derivSymbol;
  }

  function categorizeDerivSymbol(symbol: string): MarketAsset['category'] {
    if (symbol.startsWith('frx')) {
      if (symbol.includes('XAU') || symbol.includes('XAG')) return 'commodities';
      return 'forex';
    }
    if (symbol.startsWith('cry')) return 'crypto';
    if (symbol.startsWith('R_') || symbol.includes('BOOM') || symbol.includes('CRASH')) return 'synthetic';
    return 'indices';
  }

  // Filter and sort data with error handling
  const filteredData = useMemo(() => {
    try {
      return marketData.filter((asset) => {
        if (selectedCategory !== "all" && asset.category !== selectedCategory) {
          return false;
        }

        if (
          searchQuery &&
          !asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Error filtering data:', error);
      return [];
    }
  }, [marketData, selectedCategory, searchQuery]);

  const sortedData = useMemo(() => {
    try {
      return [...filteredData].sort((a, b) => {
        let comparison = 0;

        if (sortBy === "symbol") {
          comparison = a.symbol.localeCompare(b.symbol);
        } else if (sortBy === "price") {
          comparison = a.price - b.price;
        } else if (sortBy === "change") {
          comparison = a.change - b.change;
        } else if (sortBy === "changePercent") {
          comparison = a.changePercent - b.changePercent;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    } catch (error) {
      console.error('Error sorting data:', error);
      return filteredData;
    }
  }, [filteredData, sortBy, sortDirection]);

  // Event handlers
  const handleSortClick = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  const formatChangePercent = (changePercent: number) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart section */}
      <div className="lg:col-span-2">
        {selectedSymbol && <TradingViewChart symbol={selectedSymbol} />}
      </div>

      {/* Market data section */}
      <div>
        <Card className="w-full">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Live Market Data</CardTitle>
                <div className="flex items-center gap-2">
                  {isConnected && apiConnected ? (
                    <div className="flex items-center text-green-500 text-sm">
                      <Wifi className="h-4 w-4 mr-1" />
                      Live
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500 text-sm">
                      <WifiOff className="h-4 w-4 mr-1" />
                      {isConnecting ? 'Connecting...' : 'Offline'}
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {totalPriceUpdates} symbols
                  </Badge>
                </div>
              </div>
              
              {/* Connection status alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!error && !apiConnected && isConnected && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connected to server but Deriv API is offline. Attempting to reconnect...
                  </AlertDescription>
                </Alert>
              )}

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
                    <SelectItem value="synthetic">Synthetic</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="indices">Indices</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => subscribeToSymbols(defaultSymbols)}
                  disabled={isConnecting}
                  className="h-10 w-10"
                >
                  <RefreshCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
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
                  {isConnecting ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                          <span>Connecting to Deriv API...</span>
                        </div>
                      </td>
                    </tr>
                  ) : sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        {error ? 'Connection error - please refresh' : 
                         marketData.length === 0 ? 'Waiting for market data...' :
                         'No symbols match your search criteria'}
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((asset, index) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Exported component with error boundary
export default function EnhancedMarketWatch() {
  return (
    <ErrorBoundary>
      <MarketWatchContent />
    </ErrorBoundary>
  );
}