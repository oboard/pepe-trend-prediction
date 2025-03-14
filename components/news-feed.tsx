"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, TrendingUp, Globe, ExternalLink, Loader2 } from "lucide-react"
import type { NewsItem } from "@/lib/api-service"
import { Button } from "@/components/ui/button"

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)

        // 根据选项卡过滤新闻
        let categories = ""
        if (activeTab === "meme") {
          categories = "Meme,PEPE,DOGE,SHIB"
        } else if (activeTab === "market") {
          categories = "Market,Trading,Analysis"
        } else if (activeTab === "general") {
          categories = "General,Regulation,Business"
        }

        const response = await fetch(`/api/crypto?endpoint=news&categories=${categories}&limit=20`)

        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const result = await response.json()

        if (result.success && result.data) {
          setNews(result.data)
        } else {
          throw new Error("Invalid news data")
        }
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("获取新闻失败，请稍后再试")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // 设置轮询以获取最新新闻 - 从5分钟改为15分钟
    const interval = setInterval(fetchNews, 900000) // 每15分钟更新一次

    return () => clearInterval(interval)
  }, [activeTab])

  // 根据新闻内容分析情绪
  const analyzeSentiment = (title: string, body: string): "positive" | "negative" | "neutral" => {
    const text = (title + " " + body).toLowerCase()

    const positiveWords = [
      "bullish",
      "surge",
      "soar",
      "gain",
      "rally",
      "jump",
      "rise",
      "up",
      "high",
      "growth",
      "positive",
      "profit",
      "success",
      "win",
      "good",
      "great",
      "excellent",
      "boom",
      "recover",
      "breakthrough",
    ]

    const negativeWords = [
      "bearish",
      "crash",
      "plunge",
      "drop",
      "fall",
      "down",
      "low",
      "decline",
      "negative",
      "loss",
      "fail",
      "bad",
      "poor",
      "worse",
      "worst",
      "bust",
      "collapse",
      "trouble",
      "risk",
      "danger",
    ]

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach((word) => {
      if (text.includes(word)) {
        positiveScore++
      }
    })

    negativeWords.forEach((word) => {
      if (text.includes(word)) {
        negativeScore++
      }
    })

    if (positiveScore > negativeScore) {
      return "positive"
    } else if (negativeScore > positiveScore) {
      return "negative"
    } else {
      return "neutral"
    }
  }

  // 获取情绪徽章
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-500">看涨</Badge>
      case "negative":
        return <Badge className="bg-red-500">看跌</Badge>
      default:
        return <Badge variant="outline">中性</Badge>
    }
  }

  // 获取新闻分类徽章
  const getCategoryBadge = (categories: string) => {
    if (
      categories.includes("Meme") ||
      categories.includes("PEPE") ||
      categories.includes("DOGE") ||
      categories.includes("SHIB")
    ) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> 模因币
        </Badge>
      )
    } else if (categories.includes("Market") || categories.includes("Trading") || categories.includes("Analysis")) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Globe className="h-3 w-3" /> 市场
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Newspaper className="h-3 w-3" /> 一般
        </Badge>
      )
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const now = new Date()
    const newsDate = new Date(timestamp * 1000)
    const diffInSeconds = Math.floor((now.getTime() - newsDate.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`
    } else {
      return `${Math.floor(diffInSeconds / 86400)}天前`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            加密货币新闻
          </CardTitle>
          <CardDescription>正在加载最新新闻...</CardDescription>
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
            <Newspaper className="h-5 w-5" />
            加密货币新闻
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
          <Newspaper className="h-5 w-5" />
          加密货币新闻
        </CardTitle>
        <CardDescription>影响PEPE和加密市场的最新新闻和更新</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">所有新闻</TabsTrigger>
            <TabsTrigger value="meme">模因币</TabsTrigger>
            <TabsTrigger value="market">市场</TabsTrigger>
            <TabsTrigger value="general">一般</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {news.length === 0 ? (
              <div className="flex justify-center py-8 text-muted-foreground">没有找到新闻</div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => {
                  const sentiment = analyzeSentiment(item.title, item.body)
                  return (
                    <div key={item.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        {getSentimentBadge(sentiment)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.body}</div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{formatTime(item.published_on)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(item.categories)}
                          <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

