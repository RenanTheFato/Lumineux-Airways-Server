import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config()

export const redisCache = new Redis(String(process.env.REDIS_URL), { db: 0 })
export const redis = new Redis(String(process.env.REDIS_URL), { db: 1 })
