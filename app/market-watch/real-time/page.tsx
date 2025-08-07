"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const SimpleRealTimeMarketWatch = dynamic(() => import("@/components/simple-real-time-market-watch"), {
  ssr: false,
  loading: () => <p>Loading market watch...</p>,
})

function MarketWatchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Real-Time Market Watch</h1>
      <p className="text-muted-foreground mb-6">
        Live market data with interactive charts powered by TradingView.
      </p>

      <div className="relative">
        <SimpleRealTimeMarketWatch />
      </div>
    </div>
  )
}

export default function RealTimeMarketWatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketWatchPage />
    </Suspense>
  )
}
