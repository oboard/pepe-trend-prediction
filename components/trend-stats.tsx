"use client"

import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, TrendingDown, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PredictionResult } from "@/lib/prediction-service"

interface TrendStatsProps {
  data: PredictionResult | null
}

export default function TrendStats({ data }: TrendStatsProps) {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">加载预测数据中...</p>
      </div>
    )
  }

  const { prediction, confidence, nextTarget, supportLevel, reasons, indicators } = data

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

  const getPredictionText = () => {
    switch (prediction.toLowerCase()) {
      case "bullish":
        return "看涨"
      case "bearish":
        return "看跌"
      default:
        return "中性"
    }
  }

  // 计算目标价格的百分比变化
  const calculatePercentageChange = (target: number, current: number) => {
    return ((target - current) / current) * 100
  }

  // 格式化RSI显示
  const getRsiStatus = (rsi: number) => {
    if (rsi > 70) return { text: "超买", color: "text-red-500" }
    if (rsi < 30) return { text: "超卖", color: "text-green-500" }
    if (rsi > 60) return { text: "偏强", color: "text-green-500" }
    if (rsi < 40) return { text: "偏弱", color: "text-red-500" }
    return { text: "中性", color: "text-yellow-500" }
  }

  const rsiStatus = getRsiStatus(indicators.rsi)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">AI预测</div>
          <div className={`text-2xl font-bold flex items-center gap-2 ${getPredictionColor()}`}>
            {getPredictionText().toUpperCase()}
            {getPredictionIcon()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">置信度</div>
          <div className="text-2xl font-bold">{confidence}%</div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-red-500">看跌</span>
          <span className="text-yellow-500">中性</span>
          <span className="text-green-500">看涨</span>
        </div>
        <Progress
          value={prediction === "bullish" ? confidence : prediction === "bearish" ? 100 - confidence : 50}
          className="h-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">下一目标</div>
          <div className="text-xl font-bold flex items-center gap-1">
            ${nextTarget.toFixed(8)}
            {nextTarget > supportLevel ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className={`text-xs ${nextTarget > supportLevel ? "text-green-500" : "text-red-500"}`}>
            {calculatePercentageChange(nextTarget, supportLevel).toFixed(2)}% 相对于当前
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">支撑位</div>
          <div className="text-xl font-bold flex items-center gap-1">
            ${supportLevel.toFixed(8)}
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-xs text-red-500">
            {calculatePercentageChange(supportLevel, nextTarget).toFixed(2)}% 相对于当前
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">关键指标</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between text-sm border-b pb-1">
            <span className="text-muted-foreground">RSI (14)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className={`flex items-center gap-1 ${rsiStatus.color}`}>
                    {indicators.rsi.toFixed(1)} ({rsiStatus.text})
                    <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>相对强弱指标 (RSI)</p>
                  <p>
                    {">"} 70: 超买, {"<"} 30: 超卖
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between text-sm border-b pb-1">
            <span className="text-muted-foreground">MACD</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    className={
                      indicators.macdSignal === "bullish"
                        ? "text-green-500"
                        : indicators.macdSignal === "bearish"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }
                  >
                    {indicators.macdSignal === "bullish"
                      ? "看涨"
                      : indicators.macdSignal === "bearish"
                        ? "看跌"
                        : "中性"}
                    <Info className="h-3 w-3 inline ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>移动平均收敛/发散</p>
                  <p>值: {indicators.macdValue.toFixed(8)}</p>
                  <p>柱状图: {indicators.macdHistogram.toFixed(8)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between text-sm border-b pb-1">
            <span className="text-muted-foreground">EMA交叉</span>
            <span className={indicators.ema20 > indicators.ema50 ? "text-green-500" : "text-red-500"}>
              {indicators.ema20 > indicators.ema50 ? "黄金交叉" : "死亡交叉"}
            </span>
          </div>
          <div className="flex justify-between text-sm border-b pb-1">
            <span className="text-muted-foreground">布林带</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-muted-foreground flex items-center">
                    {indicators.bollingerWidth > 0.05 ? "扩张" : "收缩"}
                    <Info className="h-3 w-3 inline ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>上轨: ${indicators.bollingerUpper.toFixed(8)}</p>
                  <p>中轨: ${indicators.bollingerMiddle.toFixed(8)}</p>
                  <p>下轨: ${indicators.bollingerLower.toFixed(8)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">预测依据</div>
        <ul className="text-sm space-y-1 text-muted-foreground">
          {reasons.map((reason, index) => (
            <li key={index}>• {reason}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="border rounded-lg p-2">
          <div className="text-xs text-muted-foreground">短期趋势</div>
          <div
            className={`text-sm font-medium ${data.shortTermTrend === "bullish" ? "text-green-500" : data.shortTermTrend === "bearish" ? "text-red-500" : "text-yellow-500"}`}
          >
            {data.shortTermTrend === "bullish" ? "看涨" : data.shortTermTrend === "bearish" ? "看跌" : "中性"}
          </div>
        </div>
        <div className="border rounded-lg p-2">
          <div className="text-xs text-muted-foreground">中期趋势</div>
          <div
            className={`text-sm font-medium ${data.mediumTermTrend === "bullish" ? "text-green-500" : data.mediumTermTrend === "bearish" ? "text-red-500" : "text-yellow-500"}`}
          >
            {data.mediumTermTrend === "bullish" ? "看涨" : data.mediumTermTrend === "bearish" ? "看跌" : "中性"}
          </div>
        </div>
        <div className="border rounded-lg p-2">
          <div className="text-xs text-muted-foreground">长期趋势</div>
          <div
            className={`text-sm font-medium ${data.longTermTrend === "bullish" ? "text-green-500" : data.longTermTrend === "bearish" ? "text-red-500" : "text-yellow-500"}`}
          >
            {data.longTermTrend === "bullish" ? "看涨" : data.longTermTrend === "bearish" ? "看跌" : "中性"}
          </div>
        </div>
      </div>
    </div>
  )
}

