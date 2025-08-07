export * from './signal';
export * from './notification';

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  companyName: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  image?: string;
  isActive: boolean;
  createdAt: string; // ISO 8601 string from backend Date
  updatedAt: string; // ISO 8601 string from backend Date
  profile: Profile | null;
  role?: string;
  verificationResponsibilities?: string[];
}

// This will be used in the copy trading dashboard
// We'll combine the fetched User data with some mock data for now
export interface Trader extends User {
  profit: string;
  followers: number;
  winRate: number;
  trades: number;
  specialties: string[];
  risk: "Low" | "Medium" | "High";
}

export interface Asset {
  id: number;
  symbol: string;
  name: string;
  type: string;
  currentPrice: number | null;
  lastUpdated: string; // ISO 8601 string from backend Date
}

export interface Portfolio {
  id: number;
  name: string;
  createdAt: string; // ISO 8601 string from backend Date
  updatedAt: string; // ISO 8601 string from backend Date
  userId: number;
  // Relationships (optional for basic fetching, but good for type safety)
  user?: User;
  portfolioAssets?: PortfolioAsset[];
}

export interface PortfolioAsset {
  portfolioId: number;
  assetId: number;
  quantity: number;
  averageCost: number;
  lastUpdated: string; // ISO 8601 string from backend Date
  // Relationships (optional for basic fetching)
  portfolio?: Portfolio;
  asset?: Asset;
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Transaction {
  id: number;
  type: TransactionType;
  quantity: number;
  price: number;
  transactionDate: string; // ISO 8601 string from backend Date
  userId: number;
  assetId: number;
  portfolioId: number | null;
  // Relationships (optional for basic fetching)
  user?: User;
  asset?: Asset;
  portfolio?: Portfolio;
}

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PAYMENT_FAILED = 'payment_failed',
}

export enum SubscriptionType {
  TRADING_SIGNALS = 'trading_signals',
  COPY_TRADING = 'copy_trading',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  PERSONAL_COACHING = 'personal_coaching',
  IVREX_PRO = 'ivrex_pro',
  SHARES_CHALLENGE = 'shares_challenge',
}

export interface Subscription {
  id: string;
  userId: number;
  type: SubscriptionType;
  price: number;
  status: SubscriptionStatus;
  paymentMethod?: string;
  paymentPhoneNumber?: string;
  receiptImagePath?: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Optional relation
}

export enum ChallengeStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Challenge {
  id: string;
  description: string;
  screenshotPath?: string;
  status: ChallengeStatus;
  adminNotes?: string;
  googleMeetLink?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  userId: number;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  subscription?: Subscription;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// TradingView widget types
declare global {
  interface Window {
    TradingView?: {
      widget: new (config: TradingViewWidgetConfig) => TradingViewWidget;
    };
  }
}

interface TradingViewWidget {
  remove?: () => void;
  onChartReady?: (callback: () => void) => void;
  chart?: () => any;
}

export interface TradingViewWidgetConfig {
  autosize?: boolean;
  symbol?: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: string;
  locale?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  hide_side_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  calendar?: boolean;
  hide_volume?: boolean;
  support_host?: string;
  width?: number;
  height?: number;
  [key: string]: any;
} 