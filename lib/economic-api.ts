export interface EconomicEvent {
  id: number
  eventName: string
  country: string
  countryCode: string
  releaseDate: string
  releaseTime: string | null
  importance: 'low' | 'medium' | 'high'
  status: 'scheduled' | 'released' | 'revised' | 'cancelled'
  currency: string | null
  unit: string | null
  actual: number | null
  forecast: number | null
  previous: number | null
  description: string | null
  source: string
  externalId: string
  period: string | null
  isRevised: boolean
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export interface EconomicEventsResponse {
  success: boolean
  count: number
  data: EconomicEvent[]
  filters?: {
    startDate?: string
    endDate?: string
    importance?: string[]
    countries?: string[]
    limit?: number
  }
  error?: string
}

export interface ApiStatusResponse {
  success: boolean
  data: {
    rateLimits: {
      fmp: {
        calls: number
        limit: number
        canMakeCall: boolean
      }
      fred: {
        calls: number
        limit: number
        canMakeCall: boolean
      }
      lastReset: string
    }
    cache: {
      totalEvents: number
      eventsByImportance: Record<string, number>
      eventsByCountry: Record<string, number>
      oldestEvent: string | null
      newestEvent: string | null
      lastUpdated: string | null
    }
    isRefreshing: boolean
    lastRefresh: string | null
    status: string
  }
}

class EconomicApi {
  private baseUrl: string

  constructor() {
    // Use the same API base URL as other services for consistency
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'
    console.log('Economic API initialized with baseUrl:', this.baseUrl)
  }

  async getEconomicEvents(params: {
    startDate?: string
    endDate?: string
    importance?: string[]
    countries?: string[]
    limit?: number
    forceRefresh?: boolean
  } = {}): Promise<EconomicEventsResponse> {
    try {
      const url = new URL(`${this.baseUrl}/economic-events`)
      
      if (params.startDate) url.searchParams.append('startDate', params.startDate)
      if (params.endDate) url.searchParams.append('endDate', params.endDate)
      if (params.importance?.length) url.searchParams.append('importance', params.importance.join(','))
      if (params.countries?.length) url.searchParams.append('countries', params.countries.join(','))
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.forceRefresh) url.searchParams.append('forceRefresh', 'true')

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: EconomicEventsResponse = await response.json()
      return data

    } catch (error) {
      console.error('Error fetching economic events:', error)
      throw error
    }
  }

  async getTodaysEvents(): Promise<EconomicEventsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/economic-events/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Error fetching today\'s events:', error)
      throw error
    }
  }

  async getUpcomingHighImpactEvents(days?: number): Promise<EconomicEventsResponse> {
    try {
      const url = new URL(`${this.baseUrl}/economic-events/upcoming-high-impact`)
      if (days) url.searchParams.append('days', days.toString())

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Error fetching high impact events:', error)
      throw error
    }
  }

  async getEventsByCountry(country: string, days?: number): Promise<EconomicEventsResponse> {
    try {
      const url = new URL(`${this.baseUrl}/economic-events/by-country`)
      url.searchParams.append('country', country)
      if (days) url.searchParams.append('days', days.toString())

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Error fetching events by country:', error)
      throw error
    }
  }

  async getApiStatus(): Promise<ApiStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/economic-events/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Error fetching API status:', error)
      throw error
    }
  }

  async forceRefresh(): Promise<{ success: boolean; eventsCount: number; error?: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/economic-events/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Error forcing refresh:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
export const economicApi = new EconomicApi()

// Export utility functions
export const formatEconomicValue = (value: number | null, currency?: string | null): string => {
  if (value === null) return '-'
  
  if (currency && currency !== 'USD') {
    return `${value} ${currency}`
  }
  
  // Format large numbers
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  
  return value.toString()
}

export const getCountryFlag = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    US: "🇺🇸", EU: "🇪🇺", CA: "🇨🇦", JP: "🇯🇵", 
    GB: "🇬🇧", AU: "🇦🇺", CN: "🇨🇳", DE: "🇩🇪",
    FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸", CH: "🇨🇭"
  }
  return flags[countryCode] || "🏳️"
}

export const getImpactColor = (importance: string): string => {
  switch (importance) {
    case 'high': return 'text-red-600'
    case 'medium': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export const formatEventTime = (releaseTime: string | null, releaseDate: string): string => {
  if (!releaseTime) return 'TBD'
  
  try {
    // Extract just the date part from the ISO string
    const datePart = releaseDate.split('T')[0]
    const date = new Date(`${datePart}T${releaseTime}`)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return releaseTime
  }
}

export const formatEventDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      })
    }
  } catch {
    return dateString
  }
} 