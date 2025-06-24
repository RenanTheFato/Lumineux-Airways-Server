import { Redis } from "ioredis";

export const redis = new Redis(String(process.env.REDIS_URL), { db: 1 })