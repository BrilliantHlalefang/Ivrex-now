const FOREX_PAIRS = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD",
  "USD/CAD", "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY",
];

export function getDerivSymbol(symbol: string): string {
  if (FOREX_PAIRS.includes(symbol)) {
    return `frx${symbol.replace("/", "")}`;
  }
  
  // Add other symbol mappings here as needed
  // For example, for cryptocurrencies:
  if (symbol === "BTC/USD") {
    return "cryBTCUSD";
  }

  // Fallback for volatility indices or other symbols
  // This is just an example, adjust as necessary.
  const volatilityMap: { [key: string]: string } = {
    "Volatility 10 Index": "R_10",
    "Volatility 25 Index": "R_25",
    "Volatility 50 Index": "R_50",
    "Volatility 75 Index": "R_75",
    "Volatility 100 Index": "R_100",
  };

  return volatilityMap[symbol] || symbol;
} 