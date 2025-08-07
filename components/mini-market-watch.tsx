"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type MarketAsset = {
  symbol: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  category: string
}

export default function MiniMarketWatch() {
  const [marketData, setMarketData] = useState<MarketAsset[]>([
    {
      symbol: "EUR/USD",
      price: 1.0892,
      previousPrice: 1.0884,
      change: 0.0008,
      changePercent: 0.07,
      category: "forex",
    },
    {
      symbol: "BTC/USD",
      price: 67245.8,
      previousPrice: 66000.5,
      change: 1245.3,
      changePercent: 1.89,
      category: "crypto",
    },
    {
      symbol: "XAU/USD",
      price: 2345.6,
      previousPrice: 2358.4,
      change: -12.8,
      changePercent: -0.54,
      category: "commodities",
    },
    {
      symbol: "US30",
      price: 39875.25,
      previousPrice: 39750.12,
      change: 125.13,
      changePercent: 0.31,
      category: "indices",
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) => {
        return prevData.map((asset) => {
          // Random price change within a reasonable range
          const priceChange = asset.price * (Math.random() * 0.01 - 0.005)
          const newPrice = Number.parseFloat((asset.price + priceChange).toFixed(asset.price < 10 ? 4 : 2))

          // Calculate change and change percent
          const change = Number.parseFloat((newPrice - asset.previousPrice).toFixed(asset.price < 10 ? 4 : 2))
          const changePercent = Number.parseFloat(((change / asset.previousPrice) * 100).toFixed(2))

          return {
            ...asset,
            price: newPrice,
            previousPrice: asset.price,
            change,
            changePercent,
          }
        })
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Format price change percent with + or - sign
  const formatChangePercent = (changePercent: number) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {marketData.map((asset, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
              <div>
                <span className="font-medium">{asset.symbol}</span>
                <span className="text-xs ml-2 text-muted-foreground">{asset.category.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-mono mr-3">
                  {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center text-xs ${asset.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {asset.changePercent >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {formatChangePercent(asset.changePercent)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/market-watch/real-time">
            <Button variant="outline" size="sm">
              View Real-Time Charts
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
