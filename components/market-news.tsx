"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, RefreshCw, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { newsApi, type NewsArticle } from "@/lib/news-api"

// Generate dynamic mock data with current timestamps
const generateMockNewsData = (): NewsArticle[] => {
  const mockTitles = [
    "Fed Signals Potential Rate Cut in September",
    "Bitcoin Breaks $67K Resistance Level",
    "Oil Prices Surge as Middle East Tensions Escalate",
    "Tech Stocks Rally on Strong Earnings Reports",
    "ECB Maintains Interest Rates Amid Inflation Concerns",
    "Gold Hits New Record High on Safe Haven Demand",
    "US Dollar Strengthens Against Major Currencies",
    "Global Markets React to Economic Data Releases"
  ];
  
  const mockSources = ["Financial Times", "Bloomberg", "Reuters", "CNBC", "Wall Street Journal"];
  const mockCategories = ["Economy", "Crypto", "Commodities", "Markets", "Forex", "Technology"];
  
  return Array.from({ length: 6 }, (_, i) => ({
    id: `mock_${Date.now()}_${i}`,
    title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
    summary: "This is dynamically generated mock news content. The actual API connection appears to be unavailable at the moment.",
    url: "#",
    publishedAt: new Date(Date.now() - Math.floor(Math.random() * 12) * 60 * 60 * 1000).toISOString(),
    category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
    imageUrl: `https://source.unsplash.com/random/800x600?finance,${i}`,
    source: mockSources[Math.floor(Math.random() * mockSources.length)],
  }));
};

export default function MarketNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAllNews, setShowAllNews] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  // Set initial time on client side to prevent hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date())
  }, [])

  // Fetch real-time news updates with retry mechanism
  const refreshNews = useCallback(async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 Refreshing news...', { forceRefresh, showAllNews, retryAttempt: retryCount + 1 });
      
      const response = await newsApi.getMarketNews({ 
        limit: showAllNews ? 10 : 3, 
        forceRefresh 
      })
      
      console.log('📰 News response:', {
        success: response.success,
        count: response.data?.length || 0,
        firstTitle: response.data?.[0]?.title || 'No data'
      });
      
      if (response.success && response.data && response.data.length > 0) {
        setNews(response.data)
        setLastUpdated(new Date())
        setUseFallback(false)
        setRetryCount(0) // Reset retry count on success
        
        if (forceRefresh) {
          // Clear any previous error when manually refreshing
          setError(null)
        }
      } else {
        throw new Error('No news articles received or empty data')
      }
    } catch (err) {
      // Retry logic (up to 2 retries)
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1)
        // Wait before retrying
        setTimeout(() => {
          refreshNews(forceRefresh)
        }, 2000)
        return
      }
      
      // After retries fail, use fallback data
      const fallbackData = generateMockNewsData().slice(0, showAllNews ? 10 : 3);
      setNews(fallbackData)
      setLastUpdated(new Date())
      setUseFallback(true)
      setError('Unable to fetch latest news')
      console.warn('⚠️ Using dynamically generated fallback data');
    } finally {
      setIsLoading(false)
    }
  }, [showAllNews, retryCount])

  const toggleAllNews = () => {
    setShowAllNews(!showAllNews);
    // Refresh with new limit
    if (!showAllNews) {
      refreshNews(true); // Force refresh when showing all news
    } else {
      // When going back to limited view, just slice current data
      setNews(prev => prev.slice(0, 3));
    }
  }

  // Load initial data
  useEffect(() => {
    refreshNews()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing news data')
      refreshNews(true)
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [refreshNews])

  const handleReadMore = (url: string) => {
    // If it's a mock URL (#), don't attempt to open it
    if (url === '#') {
      console.log('Mock news item - no real URL available');
      return;
    }
    
    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-muted py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Market News</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest developments in the financial markets.
              {lastUpdated && (
                <span className="text-xs ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => {
              setRetryCount(0); // Reset retry count
              refreshNews(true);
            }} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button variant="outline" onClick={toggleAllNews}>
              {showAllNews ? 'Show Less' : 'View All News'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && useFallback && (
          <Alert variant="warning" className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error}. Showing sample news articles.
            </AlertDescription>
          </Alert>
        )}

        <div className={`grid grid-cols-1 gap-6 ${showAllNews ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'}`}>
          {news.length > 0 ? (
            news.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img src={item.imageUrl || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Badge className="bg-primary text-primary-foreground">{item.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{item.source}</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(item.publishedAt).toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.summary}</p>
                  <Button 
                    variant="link" 
                    className="px-0"
                    onClick={() => handleReadMore(item.url)}
                    disabled={item.url === '#'}
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading news articles...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
