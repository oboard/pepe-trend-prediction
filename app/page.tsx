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
    <main className="container mx-auto p-4">
      {loading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-xl">加载中...</span>
        </div>
      ) : error ? (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500">错误</h2>
            <p className="mt-2">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              重试
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 价格卡片 */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">PEPE/USD</CardTitle>
                  <CardDescription>Pepe Coin</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(pepeData?.current_price)}</div>
                  <div className={`flex items-center ${pepeData?.price_change_percentage_24h && pepeData.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pepeData?.price_change_percentage_24h && pepeData.price_change_percentage_24h > 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {formatChange(pepeData?.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <TradingViewWidget symbol="PEPEUSD" timeframe={timeframe} />
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant={timeframe === "1D" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("1D")}
                >
                  1D
                </Button>
                <Button
                  variant={timeframe === "1W" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("1W")}
                >
                  1W
                </Button>
                <Button
                  variant={timeframe === "1M" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("1M")}
                >
                  1M
                </Button>
                <Button
                  variant={timeframe === "3M" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("3M")}
                >
                  3M
                </Button>
                <Button
                  variant={timeframe === "1Y" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("1Y")}
                >
                  1Y
                </Button>
                <Button
                  variant={timeframe === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("ALL")}
                >
                  ALL
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* 趋势统计 */}
          <TrendStats data={predictionData} />

          {/* 预测卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                价格预测
              </CardTitle>
              <CardDescription>基于历史数据和市场指标</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prediction">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="prediction">预测</TabsTrigger>
                  <TabsTrigger value="indicators">指标</TabsTrigger>
                </TabsList>
                <TabsContent value="prediction">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">30天预测价格</div>
                      <div className="font-bold text-primary">
                        {predictionData ? formatPrice(predictionData.nextTarget) : "$0.00"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">预计变化</div>
                      <div className={`font-bold ${predictionData && predictionData.nextTarget > (pepeData?.current_price || 0) ? 'text-green-500' : 'text-red-500'}`}>
                        {predictionData && pepeData ?
                          formatChange(((predictionData.nextTarget - pepeData.current_price) / pepeData.current_price) * 100)
                          : "0.00%"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">置信度</div>
                      <div className="font-bold">
                        {predictionData ? `${predictionData.confidence.toFixed(1)}%` : "0%"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">预测趋势</div>
                      <div className={`font-bold ${predictionData && predictionData.prediction === 'bullish' ? 'text-green-500' : predictionData && predictionData.prediction === 'bearish' ? 'text-red-500' : 'text-amber-500'}`}>
                        {predictionData && predictionData.prediction === 'bullish' ? '看涨' :
                          predictionData && predictionData.prediction === 'bearish' ? '看跌' : '中性'}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="indicators">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">RSI (14)</div>
                      <div className={`font-bold ${predictionData && predictionData.indicators.rsi > 70 ? 'text-red-500' : predictionData && predictionData.indicators.rsi < 30 ? 'text-green-500' : 'text-amber-500'}`}>
                        {predictionData ? predictionData.indicators.rsi.toFixed(1) : "0"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">MACD</div>
                      <div className={`font-bold ${predictionData && predictionData.indicators.macdSignal === 'bullish' ? 'text-green-500' : predictionData && predictionData.indicators.macdSignal === 'bearish' ? 'text-red-500' : 'text-amber-500'}`}>
                        {predictionData && predictionData.indicators.macdSignal === 'bullish' ? '买入信号' :
                          predictionData && predictionData.indicators.macdSignal === 'bearish' ? '卖出信号' : '中性'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">移动平均线</div>
                      <div className={`font-bold ${predictionData && predictionData.shortTermTrend === 'bullish' ? 'text-green-500' : predictionData && predictionData.shortTermTrend === 'bearish' ? 'text-red-500' : 'text-amber-500'}`}>
                        {predictionData && predictionData.shortTermTrend === 'bullish' ? '买入信号' :
                          predictionData && predictionData.shortTermTrend === 'bearish' ? '卖出信号' : '中性'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">波动率</div>
                      <div className="font-bold">
                        {predictionData && predictionData.indicators.bollingerWidth ?
                          `${(predictionData.indicators.bollingerWidth * 100).toFixed(1)}%` : "0%"}
                      </div>
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
      )}
    </main>
  )
}

