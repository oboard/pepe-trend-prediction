"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowUpRight, ArrowDownRight, BarChart3, Loader2 } from "lucide-react"
import type { CoinData } from "@/lib/api-service"

export default function CoinComparison() {
  const [marketData, setMarketData] = useState<CoinData[]>([])
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/crypto?endpoint=markets")

        if (!response.ok) {
          throw new Error("Failed to fetch market data")
        }

        const result = await response.json()

        if (result.success && result.data) {
          setMarketData(result.data)

          // 处理比较数据
          const processedData = [
            {
              name: "24h变化",
              PEPE: result.data.find((coin: CoinData) => coin.id === "pepe")?.price_change_percentage_24h || 0,
              DOGE: result.data.find((coin: CoinData) => coin.id === "dogecoin")?.price_change_percentage_24h || 0,
              SHIB: result.data.find((coin: CoinData) => coin.id === "shiba-inu")?.price_change_percentage_24h || 0,
              FLOKI: result.data.find((coin: CoinData) => coin.id === "floki")?.price_change_percentage_24h || 0,
            },
            {
              name: "7d变化",
              PEPE:
                result.data.find((coin: CoinData) => coin.id === "pepe")?.price_change_percentage_7d_in_currency || 0,
              DOGE:
                result.data.find((coin: CoinData) => coin.id === "dogecoin")?.price_change_percentage_7d_in_currency ||
                0,
              SHIB:
                result.data.find((coin: CoinData) => coin.id === "shiba-inu")?.price_change_percentage_7d_in_currency ||
                0,
              FLOKI:
                result.data.find((coin: CoinData) => coin.id === "floki")?.price_change_percentage_7d_in_currency || 0,
            },
            {
              name: "交易量/市值",
              PEPE:
                result.data.find((coin: CoinData) => coin.id === "pepe")?.total_volume /
                  result.data.find((coin: CoinData) => coin.id === "pepe")?.market_cap || 0,
              DOGE:
                result.data.find((coin: CoinData) => coin.id === "dogecoin")?.total_volume /
                  result.data.find((coin: CoinData) => coin.id === "dogecoin")?.market_cap || 0,
              SHIB:
                result.data.find((coin: CoinData) => coin.id === "shiba-inu")?.total_volume /
                  result.data.find((coin: CoinData) => coin.id === "shiba-inu")?.market_cap || 0,
              FLOKI:
                result.data.find((coin: CoinData) => coin.id === "floki")?.total_volume /
                  result.data.find((coin: CoinData) => coin.id === "floki")?.market_cap || 0,
            },
          ]

          setComparisonData(processedData)
        }
      } catch (err) {
        console.error("Error fetching comparison data:", err)
        setError("获取数据失败，请稍后再试")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 设置轮询以获取最新数据 - 每10分钟更新一次
    const interval = setInterval(fetchData, 600000)

    return () => clearInterval(interval)
  }, [])

  // 格式化价格显示
  const formatPrice = (price: number) => {
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

  // 格式化市值显示
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return "$" + (marketCap / 1e9).toFixed(2) + "B"
    } else if (marketCap >= 1e6) {
      return "$" + (marketCap / 1e6).toFixed(2) + "M"
    } else {
      return "$" + marketCap.toFixed(0)
    }
  }

  // 格式化百分比变化
  const formatChange = (change: number) => {
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            模因币比较
          </CardTitle>
          <CardDescription>正在加载数据...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            模因币比较
          </CardTitle>
          <CardDescription>出错了</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          模因币比较
        </CardTitle>
        <CardDescription>比较PEPE与其他流行模因币的表现</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">币种</th>
                  <th className="text-right py-2 font-medium">价格</th>
                  <th className="text-right py-2 font-medium">市值</th>
                  <th className="text-right py-2 font-medium">交易量 (24h)</th>
                  <th className="text-right py-2 font-medium">变化 (24h)</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((coin) => (
                  <tr key={coin.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{coin.symbol.toUpperCase()}</td>
                    <td className="text-right py-3">{formatPrice(coin.current_price)}</td>
                    <td className="text-right py-3">{formatMarketCap(coin.market_cap)}</td>
                    <td className="text-right py-3">{formatMarketCap(coin.total_volume)}</td>
                    <td className="text-right py-3 flex items-center justify-end gap-1">
                      {formatChange(coin.price_change_percentage_24h)}
                      {coin.price_change_percentage_24h > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="PEPE" fill="#10b981" name="PEPE" />
              <Bar dataKey="DOGE" fill="#6366f1" name="DOGE" />
              <Bar dataKey="SHIB" fill="#f59e0b" name="SHIB" />
              <Bar dataKey="FLOKI" fill="#ec4899" name="FLOKI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

