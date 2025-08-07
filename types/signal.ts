export enum SignalType {
  BUY = 'buy',
  SELL = 'sell',
}

export enum SignalStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface Signal {
  id: string;
  symbol: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  type: SignalType;
  status: SignalStatus;
  createdAt: Date;
  closedAt: Date | null;
} 