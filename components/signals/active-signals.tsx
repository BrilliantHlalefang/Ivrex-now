import { Signal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, StopCircle } from 'lucide-react';

interface ActiveSignalsProps {
  signals: Signal[];
  onCloseSignal: (id: string) => void;
}

export default function ActiveSignals({ signals, onCloseSignal }: ActiveSignalsProps) {
  const { data: session } = useSession();

  const formatPrice = (price: number) => {
    // Format with proper decimal places based on the price magnitude
    const formattedPrice = new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: price < 1 ? 4 : 2, 
      maximumFractionDigits: price < 1 ? 6 : 4,
      useGrouping: true
    }).format(price);
    
    return formattedPrice;
  };

  const formatCurrencyPair = (symbol: string) => {
    // Handle different currency pair formats
    if (symbol.includes('/')) {
      const [base, quote] = symbol.split('/');
      return (
        <span className="font-black text-2xl tracking-wider text-gray-900 font-mono uppercase">
          <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded-l-md border border-r-0 border-blue-200">{base}</span>
          <span className="bg-gray-100 text-gray-700 px-1 py-1 border-t border-b border-gray-200">/</span>
          <span className="bg-green-100 text-green-900 px-2 py-1 rounded-r-md border border-l-0 border-green-200">{quote}</span>
        </span>
      );
    } else if (symbol.includes('-')) {
      const [base, quote] = symbol.split('-');
      return (
        <span className="font-black text-2xl tracking-wider text-gray-900 font-mono uppercase">
          <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded-l-md border border-r-0 border-blue-200">{base}</span>
          <span className="bg-gray-100 text-gray-700 px-1 py-1 border-t border-b border-gray-200">-</span>
          <span className="bg-green-100 text-green-900 px-2 py-1 rounded-r-md border border-l-0 border-green-200">{quote}</span>
        </span>
      );
    } else {
      // Fallback for other formats
      return (
        <span className="font-black text-2xl tracking-wider text-gray-900 font-mono uppercase bg-gray-50 px-3 py-1 rounded-md border">{symbol}</span>
      );
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Active Signals</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {signals.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {signals.length > 0 ? (
            signals.map((signal) => (
              <Card key={signal.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {signal.type === 'buy' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      {formatCurrencyPair(signal.symbol)}
                    </div>
                    <Badge 
                      variant={signal.type === 'buy' ? 'default' : 'destructive'}
                      className={`text-sm font-bold px-3 py-1 ${signal.type === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      {signal.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Entry</span>
                      </div>
                      <span className="text-lg font-bold text-blue-900 font-mono tracking-tight">{formatPrice(signal.entry_price)}</span>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <StopCircle className="h-4 w-4 text-red-600" />
                        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Stop Loss</span>
                      </div>
                      <span className="text-lg font-bold text-red-900 font-mono tracking-tight">{formatPrice(signal.stop_loss)}</span>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Take Profit</span>
                      </div>
                      <span className="text-lg font-bold text-green-900 font-mono tracking-tight">{formatPrice(signal.take_profit)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeAgo(signal.createdAt)}</span>
                    </div>
                    {session?.user?.role === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        onClick={() => onCloseSignal(signal.id)}
                      >
                        Close Signal
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active signals at the moment.</p>
              <p className="text-sm text-muted-foreground mt-1">New signals will appear here automatically.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 