"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MessageSquare, Twitter, Globe } from "lucide-react"

const sentimentData = [
  { date: "Mar 1", twitter: 65, reddit: 72, overall: 68 },
  { date: "Mar 2", twitter: 68, reddit: 70, overall: 69 },
  { date: "Mar 3", twitter: 75, reddit: 68, overall: 72 },
  { date: "Mar 4", twitter: 80, reddit: 74, overall: 77 },
  { date: "Mar 5", twitter: 78, reddit: 80, overall: 79 },
  { date: "Mar 6", twitter: 82, reddit: 78, overall: 80 },
  { date: "Mar 7", twitter: 75, reddit: 76, overall: 75 },
  { date: "Mar 8", twitter: 70, reddit: 72, overall: 71 },
  { date: "Mar 9", twitter: 72, reddit: 75, overall: 73 },
  { date: "Mar 10", twitter: 78, reddit: 80, overall: 79 },
  { date: "Mar 11", twitter: 82, reddit: 84, overall: 83 },
  { date: "Mar 12", twitter: 85, reddit: 82, overall: 84 },
  { date: "Mar 13", twitter: 80, reddit: 78, overall: 79 },
  { date: "Mar 14", twitter: 72, reddit: 75, overall: 73 },
]

const topMentions = [
  {
    platform: "Twitter",
    user: "@CryptoAnalyst",
    message: "PEPE looking bullish, expecting 20% gains this week",
    sentiment: "positive",
    likes: 1245,
  },
  {
    platform: "Reddit",
    user: "PepeTrader",
    message: "Just increased my PEPE position, technical analysis shows strong support",
    sentiment: "positive",
    likes: 876,
  },
  {
    platform: "Twitter",
    user: "@MemeInvestor",
    message: "PEPE volume increasing, watch for breakout above resistance",
    sentiment: "positive",
    likes: 723,
  },
  {
    platform: "Reddit",
    user: "CryptoGuru",
    message: "Be cautious with PEPE, market showing signs of correction",
    sentiment: "negative",
    likes: 542,
  },
]

export default function SocialSentiment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Social Sentiment Analysis
        </CardTitle>
        <CardDescription>Track PEPE sentiment across social media platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ChartContainer
            config={{
              twitter: {
                label: "Twitter",
                color: "hsl(var(--chart-1))",
              },
              reddit: {
                label: "Reddit",
                color: "hsl(var(--chart-2))",
              },
              overall: {
                label: "Overall",
                color: "hsl(var(--chart-3))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="twitter" stroke="var(--color-twitter)" strokeWidth={2} />
                <Line type="monotone" dataKey="reddit" stroke="var(--color-reddit)" strokeWidth={2} />
                <Line type="monotone" dataKey="overall" stroke="var(--color-overall)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Top Mentions</h3>
          <div className="space-y-3">
            {topMentions.map((mention, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {mention.platform === "Twitter" ? (
                      <Twitter className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="font-medium">{mention.user}</span>
                  </div>
                  <div className={`text-xs ${mention.sentiment === "positive" ? "text-green-500" : "text-red-500"}`}>
                    {mention.sentiment === "positive" ? "Bullish" : "Bearish"}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{mention.message}</p>
                <div className="text-xs text-muted-foreground">
                  {mention.likes} likes • {Math.floor(Math.random() * 24) + 1} hours ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

