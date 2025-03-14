"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getPredictions } from "@/app/actions/predictions"

interface Prediction {
  id: string
  user: {
    name: string
    avatar?: string
    accuracy: number
  }
  prediction: "bullish" | "bearish" | "neutral"
  targetPrice: string
  confidence: number
  timeframe: string
  timestamp: string
  votes: number
}

const leaderboard = [
  { name: "CryptoWhale", accuracy: 78, predictions: 145, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "TradingMaster", accuracy: 82, predictions: 132, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "PepeHodler", accuracy: 68, predictions: 98, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "MemeInvestor", accuracy: 65, predictions: 87, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "CryptoAnalyst", accuracy: 71, predictions: 76, avatar: "/placeholder.svg?height=40&width=40" },
]

export default function CommunityPredictions() {
  const [activeTab, setActiveTab] = useState("predictions")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true)
        const data = await getPredictions()
        setPredictions(data)
      } catch (error) {
        console.error("加载预测失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPredictions()

    // 设置轮询以获取最新预测
    const interval = setInterval(loadPredictions, 30000) // 每30秒更新一次

    return () => clearInterval(interval)
  }, [])

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case "bullish":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            看涨 <ArrowUpRight className="h-3 w-3" />
          </Badge>
        )
      case "bearish":
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            看跌 <ArrowDownRight className="h-3 w-3" />
          </Badge>
        )
      default:
        return <Badge variant="outline">中性</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          社区洞察
        </CardTitle>
        <CardDescription>查看其他交易者对PEPE的预测</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predictions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="predictions">热门预测</TabsTrigger>
            <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
          </TabsList>
          <TabsContent value="predictions">
            {loading ? (
              <div className="flex justify-center py-8">加载预测中...</div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={prediction.user.avatar} alt={prediction.user.name} />
                          <AvatarFallback>{prediction.user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {prediction.user.name}
                            <Badge variant="outline" className="text-xs">
                              {prediction.user.accuracy}% 准确率
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{prediction.timestamp}</div>
                        </div>
                      </div>
                      {getPredictionBadge(prediction.prediction)}
                    </div>
                    <div className="pl-10">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">
                          目标: <span className="font-medium">${prediction.targetPrice}</span> 在{" "}
                          <span className="font-medium">{prediction.timeframe}</span> 内
                        </div>
                        <div className="text-sm">
                          置信度: <span className="font-medium">{prediction.confidence}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <button className="hover:text-foreground transition-colors">
                          👍 同意 ({prediction.votes})
                        </button>
                        <span>•</span>
                        <button className="hover:text-foreground transition-colors">💬 评论</button>
                        <span>•</span>
                        <button className="hover:text-foreground transition-colors">🔗 分享</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">暂无预测</p>
                <p className="text-sm">成为第一个提交预测的人！</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="leaderboard">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium border-b pb-2">
                <div>排名</div>
                <div>交易者</div>
                <div>准确率</div>
                <div>预测数</div>
              </div>
              {leaderboard.map((user, index) => (
                <div key={user.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <div className="w-5 text-center font-medium">{index + 1}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.name}</div>
                  </div>
                  <div className="font-medium">{user.accuracy}%</div>
                  <div className="text-muted-foreground">{user.predictions}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

