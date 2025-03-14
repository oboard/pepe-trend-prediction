"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, ArrowUpRight, ArrowDownRight } from "lucide-react"

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

const predictions: Prediction[] = [
  {
    id: "1",
    user: {
      name: "CryptoWhale",
      avatar: "/placeholder.svg?height=40&width=40",
      accuracy: 78,
    },
    prediction: "bullish",
    targetPrice: "0.000018",
    confidence: 85,
    timeframe: "7 days",
    timestamp: "2 hours ago",
    votes: 124,
  },
  {
    id: "2",
    user: {
      name: "MemeInvestor",
      avatar: "/placeholder.svg?height=40&width=40",
      accuracy: 65,
    },
    prediction: "bullish",
    targetPrice: "0.000015",
    confidence: 70,
    timeframe: "3 days",
    timestamp: "5 hours ago",
    votes: 87,
  },
  {
    id: "3",
    user: {
      name: "TradingMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      accuracy: 82,
    },
    prediction: "bearish",
    targetPrice: "0.000008",
    confidence: 60,
    timeframe: "24 hours",
    timestamp: "8 hours ago",
    votes: 65,
  },
  {
    id: "4",
    user: {
      name: "CryptoAnalyst",
      avatar: "/placeholder.svg?height=40&width=40",
      accuracy: 71,
    },
    prediction: "neutral",
    targetPrice: "0.000010",
    confidence: 50,
    timeframe: "48 hours",
    timestamp: "12 hours ago",
    votes: 42,
  },
  {
    id: "5",
    user: {
      name: "PepeHodler",
      avatar: "/placeholder.svg?height=40&width=40",
      accuracy: 68,
    },
    prediction: "bullish",
    targetPrice: "0.000020",
    confidence: 90,
    timeframe: "14 days",
    timestamp: "1 day ago",
    votes: 156,
  },
]

const leaderboard = [
  { name: "CryptoWhale", accuracy: 78, predictions: 145, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "TradingMaster", accuracy: 82, predictions: 132, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "PepeHodler", accuracy: 68, predictions: 98, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "MemeInvestor", accuracy: 65, predictions: 87, avatar: "/placeholder.svg?height=40&width=40" },
  { name: "CryptoAnalyst", accuracy: 71, predictions: 76, avatar: "/placeholder.svg?height=40&width=40" },
]

export default function CommunityPredictions() {
  const [activeTab, setActiveTab] = useState("predictions")

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case "bullish":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            Bullish <ArrowUpRight className="h-3 w-3" />
          </Badge>
        )
      case "bearish":
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            Bearish <ArrowDownRight className="h-3 w-3" />
          </Badge>
        )
      default:
        return <Badge variant="outline">Neutral</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Insights
        </CardTitle>
        <CardDescription>See what other traders are predicting for PEPE</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predictions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="predictions">Top Predictions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="predictions">
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
                            {prediction.user.accuracy}% accuracy
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
                        Target: <span className="font-medium">${prediction.targetPrice}</span> in{" "}
                        <span className="font-medium">{prediction.timeframe}</span>
                      </div>
                      <div className="text-sm">
                        Confidence: <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <button className="hover:text-foreground transition-colors">👍 Agree ({prediction.votes})</button>
                      <span>•</span>
                      <button className="hover:text-foreground transition-colors">💬 Comment</button>
                      <span>•</span>
                      <button className="hover:text-foreground transition-colors">🔗 Share</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="leaderboard">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium border-b pb-2">
                <div>Rank</div>
                <div>Trader</div>
                <div>Accuracy</div>
                <div>Predictions</div>
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

