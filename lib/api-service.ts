import { cacheService } from "./cache-service"

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  atl: number
  atl_change_percentage: number
  roi: null | {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string
  price_change_percentage_7d_in_currency: number
}

export interface MarketChartData {
  prices: number[][]
  total_volumes: number[][]
}

// 实现指数退避重试
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options)

      // 如果不是 429 错误，直接返回响应
      if (response.status !== 429) {
        return response
      }

      // 如果是 429 错误，等待后重试
      retries++
      const waitTime = Math.min(Math.pow(2, retries) * 1000, 10000) // 指数退避，最多等待 10 秒
      console.log(`Rate limited (429). Retrying in ${waitTime}ms... (${retries}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    } catch (error) {
      retries++
      if (retries >= maxRetries) throw error

      const waitTime = Math.min(Math.pow(2, retries) * 1000, 10000)
      console.log(`Fetch error. Retrying in ${waitTime}ms... (${retries}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`)
}

export async function getCoinsMarkets(vsCurrency = "usd", ids: string[] = []): Promise<CoinData[]> {
  try {
    const coinIds = ids.join(",")
    const cacheKey = `markets_${vsCurrency}_${coinIds}`

    // 检查缓存
    const cachedData = cacheService.get<CoinData[]>(cacheKey)
    if (cachedData) {
      console.log(`Using cached data for ${cacheKey}`)
      return cachedData
    }

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`

    // 使用重试机制获取数据
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CoinData[] = await response.json()

    // 缓存数据 (5分钟)
    cacheService.set(cacheKey, data, 300)

    return data
  } catch (error) {
    console.error("Error fetching coins markets:", error)

    // 如果有错误，尝试返回过期的缓存数据作为后备
    const cacheKey = `markets_${vsCurrency}_${ids.join(",")}`
    const expiredData = cacheService.get<CoinData[]>(cacheKey)

    if (expiredData) {
      console.log("Returning expired cache data as fallback")
      return expiredData
    }

    // 如果没有缓存数据，返回空数组
    return []
  }
}

export async function getCoinData(id: string): Promise<CoinData | null> {
  try {
    const cacheKey = `coin_${id}`

    // 检查缓存
    const cachedData = cacheService.get<CoinData>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const url = `https://api.coingecko.com/api/v3/coins/${id}`
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CoinData = await response.json()

    // 缓存数据 (5分钟)
    cacheService.set(cacheKey, data, 300)

    return data
  } catch (error) {
    console.error("Error fetching coin data:", error)
    return null
  }
}

export async function getCoinMarketChart(id: string, vsCurrency: string, days = "7"): Promise<MarketChartData | null> {
  try {
    const cacheKey = `chart_${id}_${vsCurrency}_${days}`

    // 检查缓存
    const cachedData = cacheService.get<MarketChartData>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=daily`
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: MarketChartData = await response.json()

    // 缓存数据 (根据时间范围调整缓存时间)
    const cacheTTL = Number.parseInt(days) > 7 ? 3600 : 300 // 长时间范围缓存更久
    cacheService.set(cacheKey, data, cacheTTL)

    return data
  } catch (error) {
    console.error("Error fetching coin market chart:", error)
    return null
  }
}

export async function getTrendingCoins() {
  try {
    const cacheKey = `trending`

    // 检查缓存
    const cachedData = cacheService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const url = `https://api.coingecko.com/api/v3/search/trending`
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 缓存数据 (15分钟)
    cacheService.set(cacheKey, data, 900)

    return data
  } catch (error) {
    console.error("Error fetching trending coins:", error)
    return null
  }
}

export async function getGlobalData() {
  try {
    const cacheKey = `global`

    // 检查缓存
    const cachedData = cacheService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const url = `https://api.coingecko.com/api/v3/global`
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 缓存数据 (15分钟)
    cacheService.set(cacheKey, data, 900)

    return data
  } catch (error) {
    console.error("Error fetching global data:", error)
    return null
  }
}

export interface NewsItem {
  id: string
  guid: string
  published_on: number
  imageurl: string
  title: string
  url: string
  source: string
  body: string
  tags: string
  categories: string
  upvotes: number
  downvotes: number
  lang: string
  source_info?: {
    name: string
    lang: string
    img: string
  }
}

// 获取加密货币新闻
export async function getCryptoNews(
  categories?: string,
  excludeCategories?: string,
  lang = "EN",
  sortOrder = "latest",
  limit = 10,
): Promise<NewsItem[]> {
  try {
    const cacheKey = `news_${categories || ""}_${excludeCategories || ""}_${lang}_${sortOrder}_${limit}`

    // 检查缓存
    const cachedData = cacheService.get<NewsItem[]>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // 使用CryptoCompare News API
    const url = new URL("https://min-api.cryptocompare.com/data/v2/news/")

    const params: Record<string, string> = {
      lang,
      sortOrder,
      limit: limit.toString(),
    }

    if (categories) {
      params.categories = categories
    }

    if (excludeCategories) {
      params.excludeCategories = excludeCategories
    }

    url.search = new URLSearchParams(params).toString()

    const response = await fetchWithRetry(url.toString())

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const newsItems = data.Data || []

    // 缓存数据 (10分钟)
    cacheService.set(cacheKey, newsItems, 600)

    return newsItems
  } catch (error) {
    console.error("Error fetching crypto news:", error)
    return []
  }
}

