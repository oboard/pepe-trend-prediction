"use client"

import { useState } from "react"
import TradingViewWidget from "@/components/trading-view-widget"
import PredictionForm from "@/components/prediction-form"
import TrendStats from "@/components/trend-stats"
import NewsFeed from "@/components/news-feed"
import CoinComparison from "@/components/coin-comparison"
import PriceAlerts from "@/components/price-alerts"
import CommunityPredictions from "@/components/community-predictions"
import SocialSentiment from "@/components/social-sentiment"
import WalletIntegration from "@/components/wallet-integration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, TrendingUp, BarChart3, History } from "lucide-react"

export default function Home() {
  const [timeframe, setTimeframe] = useState("1D")
  const [predictionData, setPredictionData] = useState({
    prediction: "bullish",
    confidence: 78,
    nextTarget: 0.000012,
    supportLevel: 0.000009,
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Pepe <span className="text-green-500">Trend Predictor</span>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </h1>
            <p className="text-muted-foreground">Real-time analysis and trend predictions for PEPE</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-green-500 font-bold">+4.2%</span>
            </Button>
            <Button variant="outline" size="sm">
              $0.0000105
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>PEPE/USD Chart</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Trend Analysis
              </CardTitle>
              <CardDescription>
                Our AI analyzes market patterns and sentiment to predict PEPE price movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prediction">
                <TabsList className="mb-4">
                  <TabsTrigger value="prediction">Prediction</TabsTrigger>
                  <TabsTrigger value="indicators">Indicators</TabsTrigger>
                  <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                </TabsList>
                <TabsContent value="prediction">
                  <TrendStats data={predictionData} />
                </TabsContent>
                <TabsContent value="indicators">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">RSI (14)</div>
                        <div className="text-xl font-bold">62.5</div>
                        <div className="text-xs text-green-500">Neutral/Bullish</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">MACD</div>
                        <div className="text-xl font-bold">Bullish</div>
                        <div className="text-xs text-green-500">Crossover detected</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Bollinger Bands</div>
                        <div className="text-xl font-bold">Squeeze</div>
                        <div className="text-xs text-amber-500">Volatility expected</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Volume</div>
                        <div className="text-xl font-bold">+32%</div>
                        <div className="text-xs text-green-500">Above average</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sentiment">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Social Media Sentiment</div>
                      <div className="text-green-500 font-bold">Bullish (72%)</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Trading Volume Trend</div>
                      <div className="text-green-500 font-bold">Increasing</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">Whale Activity</div>
                      <div className="text-amber-500 font-bold">Moderate</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Market Correlation</div>
                      <div className="text-muted-foreground font-bold">0.68 with BTC</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Your Prediction
              </CardTitle>
              <CardDescription>Submit your own analysis and track your accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionForm />
            </CardContent>
          </Card>
        </div>

        {/* News Feed */}
        <NewsFeed />

        {/* Coin Comparison */}
        <CoinComparison />

        {/* Community Predictions and Price Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CommunityPredictions />
          <PriceAlerts />
        </div>

        {/* Social Sentiment Analysis */}
        <SocialSentiment />

        {/* Wallet Integration and Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WalletIntegration />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Historical Performance
              </CardTitle>
              <CardDescription>Track your prediction accuracy over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-1">Track Your Predictions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit predictions to start building your track record
                  </p>
                  <Button>View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

