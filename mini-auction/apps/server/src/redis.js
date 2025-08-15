import Redis from 'ioredis';
import { REDIS_URL } from './config.js';
if (!REDIS_URL) throw new Error('REDIS_URL missing');

export const redis = new Redis(REDIS_URL, {
  tls: REDIS_URL.startsWith('rediss://') ? {} : undefined
});

// Helpers
export const highestBidKey = (auctionId) => `auction:${auctionId}:highest`;
export const roomKey = (auctionId) => `room:${auctionId}`;
export const userRoom = (userId) => `user:${userId}`;
