import { type NextRequest, NextResponse } from "next/server"
import {
  getCoinsMarkets,
  getCoinData,
  getCoinMarketChart,
  getTrendingCoins,
  getGlobalData,
  getCryptoNews,
} from "@/lib/api-service"

// 获取多个币种的市场数据
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")

  try {
    switch (endpoint) {
      case "markets": {
        const vsCurrency = searchParams.get("vs_currency") || "usd"
        const ids = searchParams.get("ids")?.split(",") || ["pepe", "dogecoin", "shiba-inu", "floki"]
        const data = await getCoinsMarkets(vsCurrency, ids)

        if (!data || data.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: "No data available. API rate limit may have been reached.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      case "coin": {
        const id = searchParams.get("id")
        if (!id) {
          return NextResponse.json({ success: false, error: "Coin ID is required" }, { status: 400 })
        }
        const data = await getCoinData(id)

        if (!data) {
          return NextResponse.json(
            {
              success: false,
              error: "No data available. API rate limit may have been reached.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      case "chart": {
        const id = searchParams.get("id")
        const days = searchParams.get("days") || "7"
        const vsCurrency = searchParams.get("vs_currency") || "usd"

        if (!id) {
          return NextResponse.json({ success: false, error: "Coin ID is required" }, { status: 400 })
        }

        const data = await getCoinMarketChart(id, vsCurrency, days)

        if (!data) {
          return NextResponse.json(
            {
              success: false,
              error: "No data available. API rate limit may have been reached.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      case "trending": {
        const data = await getTrendingCoins()

        if (!data) {
          return NextResponse.json(
            {
              success: false,
              error: "No data available. API rate limit may have been reached.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      case "global": {
        const data = await getGlobalData()

        if (!data) {
          return NextResponse.json(
            {
              success: false,
              error: "No data available. API rate limit may have been reached.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      case "news": {
        const categories = searchParams.get("categories") || ""
        const excludeCategories = searchParams.get("excludeCategories") || ""
        const lang = searchParams.get("lang") || "EN"
        const sortOrder = searchParams.get("sortOrder") || "latest"
        const limit = Number.parseInt(searchParams.get("limit") || "10")

        const data = await getCryptoNews(categories, excludeCategories, lang, sortOrder, limit)

        if (!data || data.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: "No news data available.",
            },
            { status: 503 },
          )
        }

        return NextResponse.json({ success: true, data })
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid endpoint" }, { status: 400 })
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Service temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    )
  }
}

