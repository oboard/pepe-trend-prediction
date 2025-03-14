import { type NextRequest, NextResponse } from "next/server"
import { getCoinsMarkets, getCoinMarketChart } from "@/lib/api-service"
import { generatePrediction } from "@/lib/prediction-service"
import { cacheService } from "@/lib/cache-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const coinId = searchParams.get("coinId") || "pepe"
  const days = searchParams.get("days") || "30"

  try {
    // 检查缓存
    const cacheKey = `prediction_${coinId}_${days}`
    const cachedPrediction = cacheService.get(cacheKey)

    if (cachedPrediction) {
      return NextResponse.json({ success: true, data: cachedPrediction })
    }

    // 获取币种的市场数据
    const marketData = await getCoinsMarkets("usd", [coinId])

    if (!marketData || marketData.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch market data. API rate limit may have been reached." },
        { status: 503 },
      )
    }

    // 获取历史图表数据
    const chartData = await getCoinMarketChart(coinId, "usd", days)

    // 生成预测
    const prediction = await generatePrediction(marketData[0], chartData)

    // 缓存预测结果 (15分钟)
    cacheService.set(cacheKey, prediction, 900)

    return NextResponse.json({ success: true, data: prediction })
  } catch (error) {
    console.error("Prediction API error:", error)

    // 尝试返回过期的缓存数据作为后备
    const cacheKey = `prediction_${coinId}_${days}`
    const expiredPrediction = cacheService.get(cacheKey)

    if (expiredPrediction) {
      return NextResponse.json({
        success: true,
        data: expiredPrediction,
        cached: true,
      })
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate prediction. Service temporarily unavailable." },
      { status: 503 },
    )
  }
}

