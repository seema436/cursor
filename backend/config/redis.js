const redis = require('redis');

// Redis client configuration
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnection attempt ${retries}`);
      return Math.min(retries * 50, 500);
    }
  }
});

// Redis connection event handlers
client.on('connect', () => {
  console.log('📦 Redis client connected');
});

client.on('ready', () => {
  console.log('✅ Redis client ready');
});

client.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

client.on('end', () => {
  console.log('🔌 Redis client disconnected');
});

// Initialize Redis connection
const initRedis = async () => {
  try {
    await client.connect();
    console.log('🔄 Redis initialized for ephemeral community wall');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    console.log('⚠️  Community wall will be disabled without Redis');
  }
};

// Helper functions for community wall posts
const redisHelpers = {
  // Set a post with expiration (1 hour = 3600 seconds)
  setPost: async (postId, postData) => {
    try {
      if (!client.isOpen) return false;
      await client.setEx(postId, 3600, JSON.stringify(postData));
      return true;
    } catch (error) {
      console.error('Error setting post:', error);
      return false;
    }
  },

  // Get all posts (scan for keys and get values)
  getAllPosts: async () => {
    try {
      if (!client.isOpen) return [];
      
      const keys = await client.keys('post:*');
      if (keys.length === 0) return [];
      
      const posts = await client.mGet(keys);
      return posts
        .filter(post => post !== null)
        .map(post => JSON.parse(post))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  // Get Redis connection status
  isConnected: () => client.isOpen,

  // Generate unique post ID
  generatePostId: () => `post:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

  // Clean up expired posts manually (Redis TTL handles this automatically)
  cleanupExpiredPosts: async () => {
    try {
      if (!client.isOpen) return;
      
      const keys = await client.keys('post:*');
      let cleaned = 0;
      
      for (const key of keys) {
        const ttl = await client.ttl(key);
        if (ttl <= 0) {
          await client.del(key);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired posts`);
      }
    } catch (error) {
      console.error('Error cleaning expired posts:', error);
    }
  }
};

// Initialize Redis on module load
initRedis();

module.exports = {
  client,
  redisHelpers,
  initRedis
};