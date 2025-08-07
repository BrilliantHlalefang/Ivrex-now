"use client"

import React, { useEffect, useRef, memo, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol = "NASDAQ:AAPL" }) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Suppress specific TradingView warnings without overriding console.error
    const suppressTradingViewWarnings = (event: ErrorEvent) => {
      const message = event.message || '';
      if (message.includes('data type: unknown does not match a schema') ||
          message.includes('Property:The state with a data type')) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', suppressTradingViewWarnings);
    
    return () => {
      window.removeEventListener('error', suppressTradingViewWarnings);
    };
  }, []);

  useEffect(() => {
    if (!container.current) return;
    
    const scriptId = 'tradingview-widget-script';
    // Ensure script is not loaded multiple times
    if (document.getElementById(scriptId)) {
      initializeWidget();
      return;
    }

    try {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        initializeWidget();
      };
      
      script.onerror = () => {
        console.error("Failed to load TradingView script");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error loading TradingView widget:", error);
    }

    return () => {
      // Cleanup on unmount
      if (widgetRef.current) {
        try {
          widgetRef.current.remove?.();
        } catch (e) {
          console.warn("Error removing TradingView widget:", e);
        }
        widgetRef.current = null;
      }
      
      if (container.current) {
        container.current.innerHTML = "";
      }
    }
  }, [symbol]);

  const initializeWidget = () => {
    if (!container.current || !window.TradingView) return;

    try {
      const widgetContainerId = `tradingview_container_${Math.random().toString(36).substring(2, 9)}`;
      container.current.id = widgetContainerId;
      
      // Clear any existing content
      container.current.innerHTML = "";
      
      const widgetConfig = {
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "light" as const,
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: widgetContainerId,
        // Add additional configuration to prevent schema errors
        hide_side_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        hide_volume: false,
        support_host: "https://www.tradingview.com"
      };
      
      widgetRef.current = new window.TradingView.widget(widgetConfig);
    } catch (error) {
      console.error("Error initializing TradingView widget:", error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  return (
    <>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`}>
        {/* Fullscreen controls */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Exit fullscreen"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Normal mode controls */}
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

        <div 
          ref={container} 
          className={`${isFullscreen ? 'w-full h-full' : 'w-full h-[400px]'}`}
        />
      </div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </>
  );
}

export default memo(TradingViewChart);
