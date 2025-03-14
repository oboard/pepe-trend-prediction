"use server"

import { revalidatePath } from "next/cache"

interface PredictionData {
  direction: string
  confidence: number
  targetPrice: string
  timeframe: string
}

// 这里我们模拟一个数据库，在实际应用中，你应该使用真实的数据库
let predictions: any[] = []

export async function submitPrediction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const direction = formData.get("direction") as string
    const confidence = Number.parseInt(formData.get("confidence") as string)
    const targetPrice = formData.get("targetPrice") as string
    const timeframe = formData.get("timeframe") as string

    // 验证数据
    if (!direction || isNaN(confidence) || !targetPrice || !timeframe) {
      return { success: false, message: "所有字段都是必填的" }
    }

    // 创建预测对象
    const prediction = {
      id: Date.now().toString(),
      user: {
        name: "CurrentUser", // 在实际应用中，这应该是从认证系统获取的
        avatar: "/placeholder.svg?height=40&width=40",
        accuracy: Math.floor(Math.random() * 30) + 60, // 模拟准确率
      },
      prediction: direction,
      targetPrice,
      confidence,
      timeframe,
      timestamp: new Date().toISOString(),
      votes: 0,
    }

    // 在实际应用中，这里应该将预测保存到数据库
    predictions.unshift(prediction)

    // 限制预测数量，仅用于演示
    if (predictions.length > 20) {
      predictions = predictions.slice(0, 20)
    }

    // 重新验证路径以更新UI
    revalidatePath("/")

    return {
      success: true,
      message: `预测已提交：${direction}，置信度${confidence}%，目标价格$${targetPrice}`,
    }
  } catch (error) {
    console.error("提交预测时出错:", error)
    return { success: false, message: "提交预测时发生错误" }
  }
}

export async function getPredictions(): Promise<any[]> {
  // 在实际应用中，这里应该从数据库获取预测
  return predictions
}

