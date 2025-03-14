"use client"

import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TrendStatsProps {
  data: {
    prediction: string
    confidence: number
    nextTarget: number
    supportLevel: number
  }
}

export default function TrendStats({ data }: TrendStatsProps) {
  const { prediction, confidence, nextTarget, supportLevel } = data

  const getPredictionColor = () => {
    switch (prediction.toLowerCase()) {
      case "bullish":
        return "text-green-500"
      case "bearish":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getPredictionIcon = () => {
    switch (prediction.toLowerCase()) {
      case "bullish":
        return <TrendingUp className="h-6 w-6 text-green-500" />
      case "bearish":
        return <TrendingDown className="h-6 w-6 text-red-500" />
      default:
        return <Minus className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">AI Prediction</div>
          <div className={`text-2xl font-bold flex items-center gap-2 ${getPredictionColor()}`}>
            {prediction.toUpperCase()}
            {getPredictionIcon()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Confidence</div>
          <div className="text-2xl font-bold">{confidence}%</div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
        <Progress value={confidence} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Next Target</div>
          <div className="text-xl font-bold flex items-center gap-1">
            ${nextTarget.toFixed(8)}
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-xs text-green-500">+14.3% from current</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Support Level</div>
          <div className="text-xl font-bold flex items-center gap-1">
            ${supportLevel.toFixed(8)}
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-xs text-red-500">-14.3% from current</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Key Insights</div>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Strong buying pressure detected in the last 24 hours</li>
          <li>• Volume increasing by 32% compared to 7-day average</li>
          <li>• Social sentiment trending positive with 72% bullish signals</li>
          <li>• Key resistance at $0.0000135 needs to be broken for continued uptrend</li>
        </ul>
      </div>
    </div>
  )
}

