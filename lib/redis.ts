import Redis from 'ioredis';

// Redis connection configuration
let redis: Redis | null = null;

try {
  // If REDIS_URL is provided, use it; otherwise use default config
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  } else {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }
  
  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
  });
} catch (error) {
  console.warn('⚠️ Redis not available, running without background processing');
  redis = null;
}

export default redis;

// Helper to check if Redis is available
export const isRedisAvailable = (): boolean => {
  return redis !== null && redis.status === 'ready';
};
