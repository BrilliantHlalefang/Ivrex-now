"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { economicApi, type EconomicEvent, formatEconomicValue, getCountryFlag, formatEventTime, formatEventDate } from "@/lib/economic-api"

export default function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [apiUrl, setApiUrl] = useState<string | null>(null)

  // Fallback data for when API is unavailable
  const fallbackEvents = [
    {
      id: 1,
      eventName: "US Nonfarm Payrolls",
      country: "United States",
      countryCode: "US",
      releaseDate: new Date().toISOString().split('T')[0],
      releaseTime: "08:30:00",
      importance: "high" as const,
      status: "scheduled" as const,
      currency: "USD",
      unit: "K",
      actual: null,
      forecast: 175000,
      previous: 165000,
      source: "Demo",
      externalId: "demo_1",
      period: null,
      isRevised: false,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null
    },
    {
      id: 2,
      eventName: "EU CPI y/y",
      country: "European Union",
      countryCode: "EU",
      releaseDate: new Date().toISOString().split('T')[0],
      releaseTime: "10:00:00",
      importance: "medium" as const,
      status: "scheduled" as const,
      currency: "EUR",
      unit: "%",
      actual: null,
      forecast: 2.4,
      previous: 2.6,
      source: "Demo",
      externalId: "demo_2",
      period: null,
      isRevised: false,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null
    },
    {
      id: 3,
      eventName: "UK GDP q/q",
      country: "United Kingdom",
      countryCode: "GB",
      releaseDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      releaseTime: "09:00:00",
      importance: "high" as const,
      status: "scheduled" as const,
      currency: "GBP",
      unit: "%",
      actual: null,
      forecast: 0.3,
      previous: 0.2,
      source: "Demo",
      externalId: "demo_3",
      period: null,
      isRevised: false,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null
    },
    {
      id: 4,
      eventName: "JP Interest Rate Decision",
      country: "Japan",
      countryCode: "JP",
      releaseDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
      releaseTime: "04:00:00",
      importance: "high" as const,
      status: "scheduled" as const,
      currency: "JPY",
      unit: "%",
      actual: null,
      forecast: 0.1,
      previous: 0.0,
      source: "Demo",
      externalId: "demo_4",
      period: null,
      isRevised: false,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: null
    }
  ]

  // Fetch economic events from API with retry mechanism
  const fetchEconomicEvents = useCallback(async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const today = new Date()
      const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      // Get the API base URL from the economicApi instance
      const apiBaseUrl = (economicApi as any).baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
      setApiUrl(apiBaseUrl)
      
      console.log(`Fetching economic events from ${apiBaseUrl} (Attempt ${retryCount + 1})`)
      
      const response = await economicApi.getEconomicEvents({
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        limit: 20,
        forceRefresh
      })

      if (response.success && response.data && response.data.length > 0) {
        console.log(`Successfully fetched ${response.data.length} economic events`)
        setEvents(response.data)
        setLastUpdated(new Date())
        setUseFallback(false)
        setRetryCount(0) // Reset retry count on success
      } else {
        throw new Error('No events received from API or empty data array')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      
      // Retry logic (up to 2 retries)
      if (retryCount < 2) {
        setRetryCount(retryCount + 1)
        // Wait a bit before retrying
        setTimeout(() => {
          fetchEconomicEvents(forceRefresh)
        }, 2000)
        return
      }
      
      setError(errorMessage)
      
      // Generate more dynamic fallback data
      const dynamicFallbackEvents = fallbackEvents.map(event => ({
        ...event,
        releaseDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        forecast: event.forecast ? event.forecast * (0.9 + Math.random() * 0.2) : null // Vary by ±10%
      }))
      
      setEvents(dynamicFallbackEvents)
      setUseFallback(true)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [retryCount])

  // Set initial time on client side to prevent hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date())
  }, [])

  // Load data on component mount
  useEffect(() => {
    fetchEconomicEvents()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('Auto-refreshing economic calendar data')
      fetchEconomicEvents(true)
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [fetchEconomicEvents])

  // Refresh function
  const refreshCalendar = () => {
    setRetryCount(0) // Reset retry count on manual refresh
    fetchEconomicEvents(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-2xl mb-1">Economic Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">
              {useFallback ? "Demo economic events (API unavailable)" : "Real-time economic events and releases"}
              {lastUpdated && (
                <span className="text-xs ml-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={refreshCalendar} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && useFallback && (
          <Alert variant="warning" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Could not connect to {apiUrl || 'economic data API'}. Showing demo data as fallback.
            </AlertDescription>
          </Alert>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Event</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Impact</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Forecast</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Previous</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className={event.status === 'released' ? 'bg-muted/20' : ''}>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatEventTime(event.releaseTime, event.releaseDate)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      <div className="flex items-center">
                        <span className="mr-2">{getCountryFlag(event.countryCode)}</span>
                        <div>
                          <div>{event.eventName}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.country} • {event.source}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          event.importance === "high"
                            ? "destructive"
                            : event.importance === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {event.importance}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatEconomicValue(event.forecast, event.currency)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatEconomicValue(event.previous, event.currency)}
                    </td>
                    <td
                      className={`py-3 px-4 text-sm font-bold ${
                        event.status === "released" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {event.status === 'released' 
                        ? formatEconomicValue(event.actual, event.currency)
                        : '-'
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                        <p>Loading economic events...</p>
                      </div>
                    ) : (
                      <p>No economic events found for the selected period.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 