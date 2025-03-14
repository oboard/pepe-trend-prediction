"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { submitPrediction } from "@/app/actions/predictions"
import { useToast } from "@/hooks/use-toast"

export default function PredictionForm() {
  const [direction, setDirection] = useState("bullish")
  const [confidence, setConfidence] = useState(50)
  const [targetPrice, setTargetPrice] = useState("")
  const [timeframe, setTimeframe] = useState("24h")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("direction", direction)
      formData.append("confidence", confidence.toString())
      formData.append("targetPrice", targetPrice)
      formData.append("timeframe", timeframe)

      const result = await submitPrediction(formData)

      if (result.success) {
        toast({
          title: "预测已提交",
          description: result.message,
          variant: "default",
        })
        setTargetPrice("")
      } else {
        toast({
          title: "提交失败",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "提交预测时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>价格方向</Label>
        <RadioGroup defaultValue="bullish" value={direction} onValueChange={setDirection} className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="bullish" id="bullish" />
            <Label htmlFor="bullish" className="text-green-500 font-medium cursor-pointer">
              看涨
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="bearish" id="bearish" />
            <Label htmlFor="bearish" className="text-red-500 font-medium cursor-pointer">
              看跌
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="neutral" id="neutral" />
            <Label htmlFor="neutral" className="text-yellow-500 font-medium cursor-pointer">
              中性
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>置信度 ({confidence}%)</Label>
        </div>
        <Slider
          value={[confidence]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setConfidence(value[0])}
          className="py-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target-price">目标价格 (USD)</Label>
        <Input
          id="target-price"
          type="text"
          placeholder="0.0000120"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeframe">时间范围</Label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="24h">24小时</option>
          <option value="7d">7天</option>
          <option value="30d">30天</option>
          <option value="90d">90天</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交预测"}
      </Button>
    </form>
  )
}

