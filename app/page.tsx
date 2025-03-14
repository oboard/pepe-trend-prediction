"use client"

import { useState, useEffect } from "react"
import TradingViewWidget from "@/components/trading-view-widget"
import TrendStats from "@/components/trend-stats"
import NewsFeed from "@/components/news-feed"
import CoinComparison from "@/components/coin-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, Loader2 } from "lucide-react"
import type { CoinData } from "@/lib/api-service"
import type { PredictionResult } from "@/lib/prediction-service"

export default function Home() {
  const [timeframe, setTimeframe] = useState("1D")
  const [pepeData, setPepeData] = useState<CoinData | null>(null)
  const [predictionData, setPredictionData] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // 获取PEPE市场数据
        const marketResponse = await fetch("/api/crypto?endpoint=markets&ids=pepe")

        if (!marketResponse.ok) {
          throw new Error("Failed to fetch PEPE data")
        }

        const marketResult = await marketResponse.json()

        if (marketResult.success && marketResult.data && marketResult.data.length > 0) {
          setPepeData(marketResult.data[0])

          // 获取预测数据
          const predictionResponse = await fetch("/api/crypto/prediction?coinId=pepe&days=30")

          if (!predictionResponse.ok) {
            throw new Error("Failed to fetch prediction data")
          }

          const predictionResult = await predictionResponse.json()

          if (predictionResult.success && predictionResult.data) {
            setPredictionData(predictionResult.data)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("获取数据失败，请稍后再试")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 设置轮询以获取最新数据 - 每5分钟更新一次
    const interval = setInterval(fetchData, 300000)

    return () => clearInterval(interval)
  }, [])

  // 格式化价格显示
  const formatPrice = (price: number | undefined) => {
    if (!price) return "$0.00"

    if (price < 0.00001) {
      return "$" + price.toFixed(8)
    } else if (price < 0.001) {
      return "$" + price.toFixed(6)
    } else if (price < 1) {
      return "$" + price.toFixed(4)
    } else {
      return "$" + price.toFixed(2)
    }
  }

  // 格式化百分比变化
  const formatChange = (change: number | undefined) => {
    if (!change) return "+0.00%"
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Pepe <span className="text-green-500">趋势预测</span>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </h1>
            <p className="text-muted-foreground">PEPE的实时分析和趋势预测</p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">加载中...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                {pepeData?.price_change_percentage_24h && pepeData.price_change_percentage_24h > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    pepeData?.price_change_percentage_24h && pepeData.price_change_percentage_24h > 0
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {formatChange(pepeData?.price_change_percentage_24h)}
                </span>
              </Button>
              <Button variant="outline" size="sm">
                {formatPrice(pepeData?.current_price)}
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>PEPE/USD 图表</CardTitle>
              <div className="flex gap-1">
                {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    className="h-8 px-3"
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[500px] w-full">
              <TradingViewWidget symbol="PEPEUSD" timeframe={timeframe} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI 趋势分析
            </CardTitle>
            <CardDescription>我们的AI分析市场模式和情绪，预测PEPE价格走势</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prediction">
              <TabsList className="mb-4">
                <TabsTrigger value="prediction">预测</TabsTrigger>
                <TabsTrigger value="indicators">指标</TabsTrigger>
                <TabsTrigger value="sentiment">情绪</TabsTrigger>
              </TabsList>
              <TabsContent value="prediction">
                <TrendStats data={predictionData} />
              </TabsContent>
              <TabsContent value="indicators">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">RSI (14)</div>
                      <div className="text-xl font-bold">{predictionData?.indicators.rsi.toFixed(1) || "62.5"}</div>
                      <div className="text-xs text-green-500">中性/看涨</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">MACD</div>
                      <div className="text-xl font-bold">
                        {predictionData?.indicators.macdSignal === "bullish"
                          ? "看涨"
                          : predictionData?.indicators.macdSignal === "bearish"
                            ? "看跌"
                            : "中性"}
                      </div>
                      <div className="text-xs text-green-500">
                        {predictionData?.indicators.macdHistogram && predictionData.indicators.macdHistogram > 0
                          ? "柱状图为正"
                          : "柱状图为负"}
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">布林带</div>
                      <div className="text-xl font-bold">
                        {predictionData?.indicators.bollingerWidth && predictionData.indicators.bollingerWidth > 0.05
                          ? "扩张"
                          : "收缩"}
                      </div>
                      <div className="text-xs text-amber-500">预期波动</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">交易量</div>
                      <div className="text-xl font-bold">
                        {predictionData?.indicators.volumeChange
                          ? (predictionData.indicators.volumeChange > 0 ? "+" : "") +
                            predictionData.indicators.volumeChange.toFixed(1) +
                            "%"
                          : "+32%"}
                      </div>
                      <div className="text-xs text-green-500">
                        {predictionData?.indicators.volumeChange && predictionData.indicators.volumeChange > 0
                          ? "高于平均水平"
                          : "低于平均水平"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sentiment">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium">社交媒体情绪</div>
                    <div className="text-green-500 font-bold">看涨 (72%)</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium">交易量趋势</div>
                    <div className="text-green-500 font-bold">增加</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium">鲸鱼活动</div>
                    <div className="text-amber-500 font-bold">中等</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">市场相关性</div>
                    <div className="text-muted-foreground font-bold">与BTC相关性 0.68</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 新闻Feed */}
        <NewsFeed />

        {/* 币种比较 */}
        <CoinComparison />
      </div>
    </main>
  )
}

