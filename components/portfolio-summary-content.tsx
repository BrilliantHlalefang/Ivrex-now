import { ArrowDownRight, ArrowUpRight, DollarSign, LineChart, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface PortfolioData {
  totalBalance: number
  balanceChange: number
  activeSignals: number
  newSignals: number
  winRate: number
  winRateChange: number
  monthlyProfit: number
  profitChange: number
}

export function PortfolioSummaryContent({ data, loading }: { data: PortfolioData | null; loading: boolean }) {
  if (loading) {
    return <PortfolioSkeleton />
  }

  if (!data) {
    return <div>Error loading portfolio data.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="border rounded-lg p-4">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium">Total Balance</h3>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">${data.totalBalance.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`${
                data.balanceChange >= 0 ? "text-green-500" : "text-red-500"
              } inline-flex items-center`}
            >
              {data.balanceChange >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {data.balanceChange.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium">Active Signals</h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{data.activeSignals}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" />+{data.newSignals}
            </span>{" "}
            new signals today
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium">Win Rate</h3>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{data.winRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`${
                data.winRateChange >= 0 ? "text-green-500" : "text-red-500"
              } inline-flex items-center`}
            >
              {data.winRateChange >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {data.winRateChange.toFixed(1)}%
            </span>{" "}
            from last week
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium">Monthly Profit</h3>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">${data.monthlyProfit.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`${
                data.profitChange >= 0 ? "text-green-500" : "text-red-500"
              } inline-flex items-center`}
            >
              {data.profitChange >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {data.profitChange.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </div>
      </div>
    </div>
  )
}

function PortfolioSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <div className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  )
}
