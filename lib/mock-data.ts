export type Signal = {
  symbol: string
  type: "BUY" | "SELL"
  entry: string
  current: string
  stopLoss: string
  takeProfit: string
  timeframe: string
  time: string
  profit: string
  status: "In Profit" | "In Loss"
}

export type SignalHistory = {
  symbol: string
  type: "BUY" | "SELL"
  entry: string
  exit: string
  profit: string
  date: string
  status: "Win" | "Loss"
}

export const activeSignals: Signal[] = [
  {
    symbol: "EUR/USD",
    type: "BUY",
    entry: "1.0890",
    current: "1.0905",
    stopLoss: "1.0860",
    takeProfit: "1.0950",
    timeframe: "4H",
    time: "2h ago",
    profit: "+0.14%",
    status: "In Profit",
  },
  {
    symbol: "BTC/USD",
    type: "SELL",
    entry: "67,500.00",
    current: "67,320.50",
    stopLoss: "68,200.00",
    takeProfit: "66,000.00",
    timeframe: "1D",
    time: "5h ago",
    profit: "+0.27%",
    status: "In Profit",
  },
  {
    symbol: "XAU/USD",
    type: "BUY",
    entry: "2,340.00",
    current: "2,335.80",
    stopLoss: "2,320.00",
    takeProfit: "2,380.00",
    timeframe: "1D",
    time: "8h ago",
    profit: "-0.18%",
    status: "In Loss",
  },
  {
    symbol: "USD/JPY",
    type: "SELL",
    entry: "151.50",
    current: "151.65",
    stopLoss: "152.00",
    takeProfit: "150.50",
    timeframe: "4H",
    time: "12h ago",
    profit: "-0.10%",
    status: "In Loss",
  },
]

export const signalHistory: SignalHistory[] = [
  {
    symbol: "GBP/USD",
    type: "BUY",
    entry: "1.2640",
    exit: "1.2695",
    profit: "+0.43%",
    date: "May 15, 2025",
    status: "Win",
  },
  {
    symbol: "ETH/USD",
    type: "SELL",
    entry: "3,520.00",
    exit: "3,480.50",
    profit: "+1.12%",
    date: "May 14, 2025",
    status: "Win",
  },
  {
    symbol: "USD/CAD",
    type: "BUY",
    entry: "1.3650",
    exit: "1.3620",
    profit: "-0.22%",
    date: "May 13, 2025",
    status: "Loss",
  },
  {
    symbol: "NAS100",
    type: "SELL",
    entry: "18,450.00",
    exit: "18,520.00",
    profit: "-0.38%",
    date: "May 12, 2025",
    status: "Loss",
  },
  {
    symbol: "XAU/USD",
    type: "BUY",
    entry: "2,320.00",
    exit: "2,345.00",
    profit: "+1.08%",
    date: "May 11, 2025",
    status: "Win",
  },
  {
    symbol: "EUR/JPY",
    type: "SELL",
    entry: "164.50",
    exit: "163.80",
    profit: "+0.43%",
    date: "May 10, 2025",
    status: "Win",
  },
  {
    symbol: "TSLA",
    type: "BUY",
    entry: "182.40",
    exit: "187.65",
    profit: "+2.88%",
    date: "May 9, 2025",
    status: "Win",
  },
] 