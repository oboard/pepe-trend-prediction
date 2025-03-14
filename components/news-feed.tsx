"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, TrendingUp, Globe } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  sentiment: "positive" | "negative" | "neutral"
  category: "pepe" | "market" | "general"
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate fetching news data
    setTimeout(() => {
      setNews([
        {
          id: "1",
          title: "Pepe coin surges 15% amid broader market recovery",
          source: "CryptoNews",
          url: "#",
          publishedAt: "2 hours ago",
          sentiment: "positive",
          category: "pepe",
        },
        {
          id: "2",
          title: "Analysts predict continued growth for meme coins in Q2",
          source: "CoinDesk",
          url: "#",
          publishedAt: "5 hours ago",
          sentiment: "positive",
          category: "market",
        },
        {
          id: "3",
          title: "New Pepe-themed NFT collection launches, boosting token demand",
          source: "NFTInsider",
          url: "#",
          publishedAt: "8 hours ago",
          sentiment: "positive",
          category: "pepe",
        },
        {
          id: "4",
          title: "Market volatility increases as Bitcoin tests support levels",
          source: "BlockchainReport",
          url: "#",
          publishedAt: "12 hours ago",
          sentiment: "negative",
          category: "market",
        },
        {
          id: "5",
          title: "Pepe community votes on new development roadmap",
          source: "MemeEconomy",
          url: "#",
          publishedAt: "1 day ago",
          sentiment: "neutral",
          category: "pepe",
        },
        {
          id: "6",
          title: "Regulatory concerns grow as meme coins attract mainstream attention",
          source: "CryptoRegulation",
          url: "#",
          publishedAt: "1 day ago",
          sentiment: "negative",
          category: "general",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNews = activeTab === "all" ? news : news.filter((item) => item.category === activeTab)

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-500">Bullish</Badge>
      case "negative":
        return <Badge className="bg-red-500">Bearish</Badge>
      default:
        return <Badge variant="outline">Neutral</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pepe":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> PEPE
          </Badge>
        )
      case "market":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> Market
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Newspaper className="h-3 w-3" /> General
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Crypto News Feed
        </CardTitle>
        <CardDescription>Latest news and updates affecting PEPE and the crypto market</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="pepe">PEPE</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center py-8">Loading news...</div>
            ) : (
              <div className="space-y-4">
                {filteredNews.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      {getSentimentBadge(item.sentiment)}
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.publishedAt}</span>
                      </div>
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

