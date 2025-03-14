"use client"

import { useEffect, useRef } from "react"

interface TradingViewWidgetProps {
  symbol: string
  timeframe: string
}

export default function TradingViewWidget({ symbol = "PEPEUSD", timeframe = "1D" }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clean up any existing script
    const existingScript = document.getElementById("tradingview-widget-script")
    if (existingScript) {
      existingScript.remove()
    }

    // Create a new script element
    const script = document.createElement("script")
    script.id = "tradingview-widget-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== "undefined" && container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: mapTimeframeToInterval(timeframe),
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          hide_side_toolbar: false,
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, timeframe])

  // Map timeframe to TradingView interval
  const mapTimeframeToInterval = (tf: string): string => {
    switch (tf) {
      case "1H":
        return "60"
      case "4H":
        return "240"
      case "1D":
        return "D"
      case "1W":
        return "W"
      case "1M":
        return "M"
      default:
        return "D"
    }
  }

  return <div id="tradingview-chart-container" ref={container} className="h-full w-full" />
}

// Add this to make TypeScript happy
declare global {
  interface Window {
    TradingView: any
  }
}

