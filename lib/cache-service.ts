// 简单的内存缓存实现
interface CacheItem<T> {
  data: T
  expiry: number
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map()

  // 设置缓存项，带有过期时间（秒）
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiry = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiry })
  }

  // 获取缓存项，如果过期或不存在则返回 null
  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  // 检查缓存项是否存在且未过期
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // 删除缓存项
  delete(key: string): void {
    this.cache.delete(key)
  }

  // 清除所有缓存
  clear(): void {
    this.cache.clear()
  }
}

// 导出单例实例
export const cacheService = new CacheService()

