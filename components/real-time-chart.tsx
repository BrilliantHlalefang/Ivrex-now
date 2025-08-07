'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle, IChartApi, ISeriesApi } from 'lightweight-charts';
import DerivAPI from '@deriv/deriv-api';
import { getDerivSymbol } from '@/lib/deriv';
import { Maximize2, Minimize2, X } from 'lucide-react';

interface RealTimeChartProps {
  symbol: string
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const series = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const api = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Ensure this effect runs only once on mount.
    // The cleanup function will handle disconnection and removal.
    if (!chartContainerRef.current) return;
    if (api.current) return; // Already initialized

    setLoading(true)
    setError(null)
    
    // Use a ref to hold the WebSocket instance
    api.current = new DerivAPI({ app_id: 1089 })
    const currentApi = api.current

    const chartElement = chartContainerRef.current
    chart.current = createChart(chartElement, {
      width: chartElement.clientWidth,
      height: 500,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })
    series.current = chart.current.addCandlestickSeries()

    const derivSymbol = getDerivSymbol(symbol)

    const fetchData = async () => {
      try {
        const candleStream = await currentApi.candles({
          symbol: derivSymbol,
          granularity: 60, // 1 minute
        });

        const history = await candleStream.history({ count: 500 });

        if (history && series.current) {
          const formattedData: any[] = history.map((c: any) => ({
            time: c.epoch as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }));
          series.current.setData(formattedData);
        }

        // Subscribe to updates
        candleStream.onUpdate().subscribe((candle: any) => {
          if (candle && series.current) {
            series.current.update({
              time: candle.epoch as any,
              open: candle.open,
              high: candle.high,
              low: candle.low,
              close: candle.close,
            });
          }
        });

      } catch (e: any) {
        console.error("Failed to load chart data:", e)
        setError(`Failed to load chart data for ${symbol}: ${e.message}. The symbol may not be supported.`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const handleResize = () => {
      if (chart.current && chartElement) {
        chart.current.resize(chartElement.clientWidth, 500)
      }
    }
    window.addEventListener("resize", handleResize)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize)
      if (currentApi) {
        currentApi.basic.disconnect()
        api.current = null
      }
      if (chart.current) {
        chart.current.remove()
        chart.current = null;
      }
    }
  }, [symbol]) // Rerun effect if symbol changes

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'relative'}`}>
        {/* Header for fullscreen mode */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Exit fullscreen"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Chart container */}
        <div 
          ref={chartContainerRef} 
          className={`${isFullscreen ? 'w-full h-full' : 'w-full h-[500px]'}`}
        />

        {/* Controls for normal mode */}
        {!isFullscreen && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="View in fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-10">
            <div className="text-center">
              <p className="text-lg font-semibold">Loading Chart...</p>
              <p className="text-sm text-gray-500">Connecting to market data for {symbol}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default RealTimeChart 