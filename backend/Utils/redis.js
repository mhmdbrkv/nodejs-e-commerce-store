import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL);

export default redis;

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    15 * 24 * 60 * 60 // 15 days
  );
};

export const getRefreshToken = async (userId) => {
  return await redis.get(`refresh_token:${userId}`);
};

export const removeRefreshToken = async (userId) => {
  await redis.del(`refresh_token:${userId}`);
};
