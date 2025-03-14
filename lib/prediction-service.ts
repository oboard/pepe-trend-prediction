import type { CoinData, MarketChartData } from "./api-service"

// 技术指标类型
interface TechnicalIndicators {
  rsi: number
  macdSignal: "bullish" | "bearish" | "neutral"
  macdValue: number
  macdHistogram: number
  ema20: number
  ema50: number
  ema200: number
  bollingerUpper: number
  bollingerMiddle: number
  bollingerLower: number
  bollingerWidth: number
  volumeChange: number
  priceVolumeTrend: number
}

// 预测结果类型
export interface PredictionResult {
  prediction: "bullish" | "bearish" | "neutral"
  confidence: number
  nextTarget: number
  supportLevel: number
  indicators: TechnicalIndicators
  shortTermTrend: "bullish" | "bearish" | "neutral"
  mediumTermTrend: "bullish" | "bearish" | "neutral"
  longTermTrend: "bullish" | "bearish" | "neutral"
  reasons: string[]
}

/**
 * 计算相对强弱指标 (RSI)
 * RSI = 100 - (100 / (1 + RS))
 * RS = 平均上涨幅度 / 平均下跌幅度
 */
function calculateRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) {
    return 50 // 默认值
  }

  let gains = 0
  let losses = 0

  // 计算初始平均涨跌幅
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change >= 0) {
      gains += change
    } else {
      losses -= change
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  // 计算后续的平均涨跌幅
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]

    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) - change) / period
    }
  }

  // 防止除以零
  if (avgLoss === 0) {
    return 100
  }

  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

/**
 * 计算指数移动平均线 (EMA)
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices[prices.length - 1] // 如果数据不足，返回最后一个价格
  }

  const k = 2 / (period + 1)
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k)
  }

  return ema
}

/**
 * 计算MACD (移动平均收敛/发散)
 */
function calculateMACD(prices: number[]): { macdLine: number; signalLine: number; histogram: number } {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macdLine = ema12 - ema26
  const signalLine = calculateEMA([...Array(8).fill(macdLine), macdLine], 9)
  const histogram = macdLine - signalLine

  return { macdLine, signalLine, histogram }
}

/**
 * 计算布林带
 */
function calculateBollingerBands(
  prices: number[],
  period = 20,
  multiplier = 2,
): { upper: number; middle: number; lower: number; width: number } {
  if (prices.length < period) {
    const lastPrice = prices[prices.length - 1]
    return { upper: lastPrice * 1.1, middle: lastPrice, lower: lastPrice * 0.9, width: 0.2 }
  }

  // 计算简单移动平均线 (SMA)
  const sma = prices.slice(-period).reduce((sum, price) => sum + price, 0) / period

  // 计算标准差
  const squaredDifferences = prices.slice(-period).map((price) => Math.pow(price - sma, 2))
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / period
  const standardDeviation = Math.sqrt(variance)

  // 计算布林带
  const upper = sma + standardDeviation * multiplier
  const lower = sma - standardDeviation * multiplier
  const width = (upper - lower) / sma // 相对宽度

  return { upper, middle: sma, lower, width }
}

/**
 * 计算价格-交易量趋势指标 (PVT)
 */
function calculatePVT(prices: number[], volumes: number[]): number {
  if (prices.length < 2 || volumes.length < 2) {
    return 0
  }

  let pvt = 0
  for (let i = 1; i < prices.length; i++) {
    const priceChange = (prices[i] - prices[i - 1]) / prices[i - 1]
    pvt += priceChange * volumes[i]
  }

  return pvt
}

/**
 * 分析价格趋势
 */
function analyzeTrend(prices: number[]): "bullish" | "bearish" | "neutral" {
  if (prices.length < 2) {
    return "neutral"
  }

  // 计算简单的线性回归斜率
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0

  for (let i = 0; i < prices.length; i++) {
    sumX += i
    sumY += prices[i]
    sumXY += i * prices[i]
    sumX2 += i * i
  }

  const n = prices.length
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  // 根据斜率判断趋势
  if (slope > 0.0001) {
    return "bullish"
  } else if (slope < -0.0001) {
    return "bearish"
  } else {
    return "neutral"
  }
}

/**
 * 计算支撑位和阻力位
 */
function calculateSupportResistance(prices: number[], currentPrice: number): { support: number; resistance: number } {
  if (prices.length < 10) {
    return {
      support: currentPrice * 0.9,
      resistance: currentPrice * 1.1,
    }
  }

  // 找出局部最低点和最高点
  const localMins: number[] = []
  const localMaxs: number[] = []

  for (let i = 1; i < prices.length - 1; i++) {
    if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
      localMins.push(prices[i])
    }
    if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
      localMaxs.push(prices[i])
    }
  }

  // 找出当前价格以下的最近支撑位
  let support = currentPrice * 0.85
  for (const min of localMins.sort((a, b) => b - a)) {
    if (min < currentPrice) {
      support = min
      break
    }
  }

  // 找出当前价格以上的最近阻力位
  let resistance = currentPrice * 1.15
  for (const max of localMaxs.sort((a, b) => a - b)) {
    if (max > currentPrice) {
      resistance = max
      break
    }
  }

  return { support, resistance }
}

/**
 * 综合分析并生成预测
 */
export async function generatePrediction(
  coinData: CoinData,
  marketChartData: MarketChartData | null,
): Promise<PredictionResult> {
  // 默认值
  const defaultPrediction: PredictionResult = {
    prediction: "neutral",
    confidence: 50,
    nextTarget: coinData.current_price * 1.1,
    supportLevel: coinData.current_price * 0.9,
    indicators: {
      rsi: 50,
      macdSignal: "neutral",
      macdValue: 0,
      macdHistogram: 0,
      ema20: coinData.current_price,
      ema50: coinData.current_price,
      ema200: coinData.current_price,
      bollingerUpper: coinData.current_price * 1.1,
      bollingerMiddle: coinData.current_price,
      bollingerLower: coinData.current_price * 0.9,
      bollingerWidth: 0.2,
      volumeChange: 0,
      priceVolumeTrend: 0,
    },
    shortTermTrend: "neutral",
    mediumTermTrend: "neutral",
    longTermTrend: "neutral",
    reasons: ["数据不足以进行详细分析"],
  }

  // 如果没有图表数据，返回基于当前市场数据的简单预测
  if (!marketChartData || !marketChartData.prices || marketChartData.prices.length < 30) {
    const prediction =
      coinData.price_change_percentage_24h > 0
        ? "bullish"
        : coinData.price_change_percentage_24h < 0
          ? "bearish"
          : "neutral"

    const confidence = Math.min(Math.round(Math.abs(coinData.price_change_percentage_24h) * 2 + 50), 95)

    return {
      ...defaultPrediction,
      prediction,
      confidence,
      reasons: ["基于24小时价格变化的简单预测"],
    }
  }

  // 提取价格和交易量数据
  const prices = marketChartData.prices.map((p) => p[1])
  const volumes = marketChartData.total_volumes.map((v) => v[1])
  const currentPrice = coinData.current_price

  // 计算技术指标
  const rsi = calculateRSI(prices)
  const macd = calculateMACD(prices)
  const ema20 = calculateEMA(prices, 20)
  const ema50 = calculateEMA(prices, 50)
  const ema200 = calculateEMA(prices, 200)
  const bollingerBands = calculateBollingerBands(prices)
  const pvt = calculatePVT(prices, volumes)

  // 计算交易量变化
  const recentVolumes = volumes.slice(-7)
  const avgVolume = recentVolumes.slice(0, 5).reduce((sum, vol) => sum + vol, 0) / 5
  const latestVolume = recentVolumes[recentVolumes.length - 1]
  const volumeChange = ((latestVolume - avgVolume) / avgVolume) * 100

  // 分析不同时间框架的趋势
  const shortTermPrices = prices.slice(-7)
  const mediumTermPrices = prices.slice(-30)
  const longTermPrices = prices

  const shortTermTrend = analyzeTrend(shortTermPrices)
  const mediumTermTrend = analyzeTrend(mediumTermPrices)
  const longTermTrend = analyzeTrend(longTermPrices)

  // 确定MACD信号
  let macdSignal: "bullish" | "bearish" | "neutral" = "neutral"
  if (macd.histogram > 0 && macd.histogram > macd.histogram) {
    macdSignal = "bullish"
  } else if (macd.histogram < 0 && macd.histogram < macd.histogram) {
    macdSignal = "bearish"
  }

  // 计算支撑位和阻力位
  const { support, resistance } = calculateSupportResistance(prices, currentPrice)

  // 综合分析所有指标
  let bullishPoints = 0
  let bearishPoints = 0
  const reasons: string[] = []

  // RSI分析
  if (rsi > 70) {
    bearishPoints += 2
    reasons.push("RSI超买 (RSI > 70)")
  } else if (rsi < 30) {
    bullishPoints += 2
    reasons.push("RSI超卖 (RSI < 30)")
  } else if (rsi > 60) {
    bullishPoints += 1
    reasons.push("RSI偏强 (RSI > 60)")
  } else if (rsi < 40) {
    bearishPoints += 1
    reasons.push("RSI偏弱 (RSI < 40)")
  }

  // MACD分析
  if (macdSignal === "bullish") {
    bullishPoints += 2
    reasons.push("MACD看涨信号")
  } else if (macdSignal === "bearish") {
    bearishPoints += 2
    reasons.push("MACD看跌信号")
  }

  // 移动平均线分析
  if (currentPrice > ema20) {
    bullishPoints += 1
    reasons.push("价格高于20日EMA")
  } else {
    bearishPoints += 1
    reasons.push("价格低于20日EMA")
  }

  if (currentPrice > ema50) {
    bullishPoints += 1
    reasons.push("价格高于50日EMA")
  } else {
    bearishPoints += 1
    reasons.push("价格低于50日EMA")
  }

  if (currentPrice > ema200) {
    bullishPoints += 2
    reasons.push("价格高于200日EMA (长期上升趋势)")
  } else {
    bearishPoints += 2
    reasons.push("价格低于200日EMA (长期下降趋势)")
  }

  if (ema20 > ema50) {
    bullishPoints += 2
    reasons.push("20日EMA高于50日EMA (黄金交叉)")
  } else if (ema20 < ema50) {
    bearishPoints += 2
    reasons.push("20日EMA低于50日EMA (死亡交叉)")
  }

  // 布林带分析
  if (currentPrice > bollingerBands.upper) {
    bearishPoints += 2
    reasons.push("价格高于布林带上轨 (可能超买)")
  } else if (currentPrice < bollingerBands.lower) {
    bullishPoints += 2
    reasons.push("价格低于布林带下轨 (可能超卖)")
  }

  if (bollingerBands.width > 0.1) {
    if (shortTermTrend === "bullish") {
      bullishPoints += 1
      reasons.push("布林带扩张 + 短期上升趋势 (可能继续上涨)")
    } else if (shortTermTrend === "bearish") {
      bearishPoints += 1
      reasons.push("布林带扩张 + 短期下降趋势 (可能继续下跌)")
    }
  } else {
    reasons.push("布林带收窄 (可能即将突破)")
  }

  // 交易量分析
  if (volumeChange > 20) {
    if (shortTermTrend === "bullish") {
      bullishPoints += 2
      reasons.push("交易量大幅增加 + 价格上涨 (强烈看涨信号)")
    } else if (shortTermTrend === "bearish") {
      bearishPoints += 2
      reasons.push("交易量大幅增加 + 价格下跌 (强烈看跌信号)")
    } else {
      bullishPoints += 1
      reasons.push("交易量大幅增加 (可能即将突破)")
    }
  } else if (volumeChange < -20) {
    if (shortTermTrend !== "neutral") {
      reasons.push("交易量大幅减少 (趋势可能即将反转)")
    }
  }

  // 价格-交易量趋势分析
  if (pvt > 0) {
    bullishPoints += 1
    reasons.push("价格-交易量趋势为正 (看涨)")
  } else if (pvt < 0) {
    bearishPoints += 1
    reasons.push("价格-交易量趋势为负 (看跌)")
  }

  // 趋势分析
  if (shortTermTrend === "bullish") {
    bullishPoints += 2
    reasons.push("短期趋势看涨")
  } else if (shortTermTrend === "bearish") {
    bearishPoints += 2
    reasons.push("短期趋势看跌")
  }

  if (mediumTermTrend === "bullish") {
    bullishPoints += 3
    reasons.push("中期趋势看涨")
  } else if (mediumTermTrend === "bearish") {
    bearishPoints += 3
    reasons.push("中期趋势看跌")
  }

  if (longTermTrend === "bullish") {
    bullishPoints += 4
    reasons.push("长期趋势看涨")
  } else if (longTermTrend === "bearish") {
    bearishPoints += 4
    reasons.push("长期趋势看跌")
  }

  // 确定最终预测
  let prediction: "bullish" | "bearish" | "neutral"
  if (bullishPoints > bearishPoints + 3) {
    prediction = "bullish"
  } else if (bearishPoints > bullishPoints + 3) {
    prediction = "bearish"
  } else {
    prediction = "neutral"
  }

  // 计算置信度
  const totalPoints = bullishPoints + bearishPoints
  const confidenceBase = totalPoints > 0 ? (Math.abs(bullishPoints - bearishPoints) / totalPoints) * 100 : 50

  // 调整置信度，确保在合理范围内
  const confidence = Math.min(Math.max(Math.round(confidenceBase + 50), 50), 95)

  // 确定目标价格
  let nextTarget: number
  if (prediction === "bullish") {
    nextTarget = resistance
  } else if (prediction === "bearish") {
    nextTarget = support
  } else {
    nextTarget = (resistance + support) / 2
  }

  // 返回预测结果
  return {
    prediction,
    confidence,
    nextTarget,
    supportLevel: support,
    indicators: {
      rsi,
      macdSignal,
      macdValue: macd.macdLine,
      macdHistogram: macd.histogram,
      ema20,
      ema50,
      ema200,
      bollingerUpper: bollingerBands.upper,
      bollingerMiddle: bollingerBands.middle,
      bollingerLower: bollingerBands.lower,
      bollingerWidth: bollingerBands.width,
      volumeChange,
      priceVolumeTrend: pvt,
    },
    shortTermTrend,
    mediumTermTrend,
    longTermTrend,
    reasons: reasons.slice(0, 5), // 只返回最重要的5个原因
  }
}

