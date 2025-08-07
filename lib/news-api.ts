import { api } from './api';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  count: number;
}

class NewsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
  }

  async getMarketNews(params: {
    topics?: string[];
    limit?: number;
    forceRefresh?: boolean;
  } = {}): Promise<NewsResponse> {
    try {
      // Build URL parameters
      const searchParams = new URLSearchParams();
      
      if (params.topics?.length) {
        searchParams.append('topics', params.topics.join(','));
      }
      if (params.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params.forceRefresh) {
        searchParams.append('_t', Date.now().toString());
      }

      // Try authenticated endpoint first, fallback to public if needed
      let endpoint = '/market-news';
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`;
      }

      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        // If authentication fails, try public endpoint
        if (error.response?.status === 401) {
          console.log('Authentication failed, falling back to public endpoint');
          const publicEndpoint = '/market-news/public' + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          const publicResponse = await api.get(publicEndpoint);
          return publicResponse.data;
        }
        throw error;
      }

    } catch (error) {
      console.error('Error fetching market news:', error);
      // Return fallback data on error
      return {
        success: false,
        data: this.getFallbackNews(),
        count: 0
      };
    }
  }

  async getLatestNews(): Promise<NewsResponse> {
    try {
      // Try authenticated endpoint first
      try {
        const response = await api.get('/market-news/latest');
        return response.data;
      } catch (error: any) {
        // If authentication fails, try public endpoint
        if (error.response?.status === 401) {
          console.log('Authentication failed, falling back to public endpoint');
          const response = await api.get('/market-news/public');
          return response.data;
        }
        throw error;
      }

    } catch (error) {
      console.error('Error fetching latest news:', error);
      return {
        success: false,
        data: this.getFallbackNews().slice(0, 5),
        count: 0
      };
    }
  }

  async getNewsByCategory(category: string): Promise<NewsResponse> {
    try {
      const response = await api.get(`/market-news/categories?category=${encodeURIComponent(category)}`);
      return response.data;

    } catch (error) {
      console.error('Error fetching news by category:', error);
      return {
        success: false,
        data: this.getFallbackNews().filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        ),
        count: 0
      };
    }
  }

  private getFallbackNews(): NewsArticle[] {
    const now = new Date();
    return [
      {
        id: 'fallback_1',
        title: 'Federal Reserve Signals Potential Policy Shift in Upcoming Meeting',
        summary: 'Federal Reserve officials have indicated they may adjust monetary policy in response to recent economic indicators, with markets closely watching for signals on interest rate direction.',
        url: '#',
        publishedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        source: 'Financial Times',
        category: 'Economy',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
        sentiment: 'neutral'
      },
      {
        id: 'fallback_2',
        title: 'Cryptocurrency Markets Show Strong Momentum Amid Institutional Adoption',
        summary: 'Major cryptocurrencies are experiencing significant price movements as institutional investors continue to increase their digital asset allocations.',
        url: '#',
        publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'CoinDesk',
        category: 'Crypto',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        sentiment: 'positive'
      },
      {
        id: 'fallback_3',
        title: 'Global Oil Markets React to Geopolitical Developments',
        summary: 'Oil prices are fluctuating in response to international developments, with traders monitoring supply chain implications.',
        url: '#',
        publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        source: 'Reuters',
        category: 'Commodities',
        imageUrl: 'https://images.unsplash.com/photo-1582182300890-32b4a43e3c4d?w=400',
        sentiment: 'neutral'
      },
    ];
  }
}

// Export singleton instance
export const newsApi = new NewsApi();
export type { NewsArticle, NewsResponse }; 