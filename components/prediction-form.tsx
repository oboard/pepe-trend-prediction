"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export default function PredictionForm() {
  const [direction, setDirection] = useState("bullish")
  const [confidence, setConfidence] = useState(50)
  const [targetPrice, setTargetPrice] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the prediction to your backend
    alert(`Prediction submitted: ${direction} with ${confidence}% confidence, target: $${targetPrice}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Price Direction</Label>
        <RadioGroup defaultValue="bullish" value={direction} onValueChange={setDirection} className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="bullish" id="bullish" />
            <Label htmlFor="bullish" className="text-green-500 font-medium cursor-pointer">
              Bullish
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="bearish" id="bearish" />
            <Label htmlFor="bearish" className="text-red-500 font-medium cursor-pointer">
              Bearish
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="neutral" id="neutral" />
            <Label htmlFor="neutral" className="text-yellow-500 font-medium cursor-pointer">
              Neutral
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Confidence ({confidence}%)</Label>
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
        <Label htmlFor="target-price">Target Price (USD)</Label>
        <Input
          id="target-price"
          type="text"
          placeholder="0.0000120"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeframe">Timeframe</Label>
        <select
          id="timeframe"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="24h">24 hours</option>
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
          <option value="90d">90 days</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Submit Prediction
      </Button>
    </form>
  )
}

