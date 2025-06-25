import { redisCache } from "../config/redis.js";
import { CachedUser } from "./interfaces/user-cached-interface.js";

export class UserCachedEvents {
  private readonly CACHE_TIME_EXPIRE = 60 * 60 * 2

  private getCacheKey(userId: string): string {
    return `user:${userId}`
  }

  async GetUserEvent(userId: string): Promise<CachedUser | null> {
    try {
      const cacheKey = this.getCacheKey(userId);
      const cached = await redisCache.get(cacheKey);

      if (!cached) {
        console.error(`Cannot find cached user with this id: ${userId}`)
        return null
      }

      const user: CachedUser = JSON.parse(cached)
      console.log(`User finded in cache: ${userId}`)

      return user
    } catch (error) {
      console.error(`Error when trying to access the cache: ${error}`)
      return null
    }
  }

  async CacheUserEvent(userData: any): Promise<void> {
    try {
      const user: CachedUser = {
        id: userData.id,
        name: userData.name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
        cached_at: Date.now(),
      }

      const cacheKey = this.getCacheKey(user.id)
      await redisCache.setex(cacheKey, this.CACHE_TIME_EXPIRE, JSON.stringify(user))
      console.log(`User ${user.name} cached successfully`)
    } catch (error) {
      console.error(`Error when trying to cache user: ${error}`)
    }

  }

  async RejectUserEvent(userId: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(userId)
      await redisCache.del(cacheKey)
      console.log(`Cache rejected for user ${userId}`)
    } catch (error) {
      console.error(`Error when trying to reject user: ${error}`)
    }
  }

  async UserAlreadyCached(userId: string): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(userId)
      const validator = await redisCache.exists(cacheKey)
      return validator === 1
    } catch (error) {
      console.error(`Error when trying to check the ca user: ${error}`)
      return false
    }
  }
}