const { redisHelpers } = require('../config/redis');

// Community Wall Controller
class CommunityController {
  constructor() {
    // Check Redis connection on startup
    this.checkRedisConnection();
  }

  // Check Redis connection status
  checkRedisConnection() {
    if (!redisHelpers.isConnected()) {
      console.log('⚠️  Redis not connected - Community wall features disabled');
    } else {
      console.log('✅ Community wall ready with Redis');
    }
  }

  // Get all community wall posts
  async getPosts(req, res) {
    try {
      // Check if Redis is available
      if (!redisHelpers.isConnected()) {
        return res.json({
          posts: [],
          message: 'Community wall temporarily unavailable',
          redisConnected: false
        });
      }

      // Get all posts from Redis
      const posts = await redisHelpers.getAllPosts();
      
      console.log(`📱 Retrieved ${posts.length} community posts`);
      
      res.json({
        posts: posts,
        count: posts.length,
        redisConnected: true,
        message: posts.length === 0 ? 'No posts yet - be the first to share!' : `${posts.length} anonymous posts`
      });

    } catch (error) {
      console.error('Error getting community posts:', error);
      res.status(500).json({
        error: 'Failed to get posts',
        posts: [],
        redisConnected: false,
        message: 'Unable to load community posts right now'
      });
    }
  }

  // Create a new community wall post
  async createPost(req, res) {
    try {
      const { message, mood, anonymous = true } = req.body;

      // Check if Redis is available
      if (!redisHelpers.isConnected()) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Community wall temporarily unavailable',
          redisConnected: false
        });
      }

      // Validate message
      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid message',
          message: 'Please provide a message to share'
        });
      }

      // Create post object
      const postData = {
        id: redisHelpers.generatePostId(),
        message: message.trim(),
        mood: mood || 'neutral',
        anonymous: anonymous,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        source: 'community-wall'
      };

      // Save to Redis with 1-hour expiration
      const saved = await redisHelpers.setPost(postData.id, postData);
      
      if (!saved) {
        return res.status(500).json({
          error: 'Failed to save post',
          message: 'Unable to save your post right now'
        });
      }

      console.log(`📝 Created community post: ${postData.id}`);
      
      res.status(201).json({
        success: true,
        message: 'Post shared successfully',
        post: {
          id: postData.id,
          message: postData.message,
          mood: postData.mood,
          timestamp: postData.timestamp,
          expiresAt: postData.expiresAt
        },
        expiresInHours: 1
      });

    } catch (error) {
      console.error('Error creating community post:', error);
      res.status(500).json({
        error: 'Failed to create post',
        message: 'Unable to share your post right now'
      });
    }
  }

  // Get community wall statistics (anonymous)
  async getStats(req, res) {
    try {
      if (!redisHelpers.isConnected()) {
        return res.json({
          stats: {
            totalPosts: 0,
            redisConnected: false,
            message: 'Statistics unavailable'
          }
        });
      }

      const posts = await redisHelpers.getAllPosts();
      
      // Calculate mood distribution
      const moodDistribution = posts.reduce((acc, post) => {
        const mood = post.mood || 'neutral';
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      // Calculate time distribution (last hour)
      const now = new Date();
      const timeDistribution = {
        'last15min': 0,
        'last30min': 0,
        'last60min': 0
      };

      posts.forEach(post => {
        const postTime = new Date(post.timestamp);
        const minutesAgo = Math.floor((now - postTime) / 60000);
        
        if (minutesAgo <= 15) timeDistribution['last15min']++;
        if (minutesAgo <= 30) timeDistribution['last30min']++;
        if (minutesAgo <= 60) timeDistribution['last60min']++;
      });

      res.json({
        stats: {
          totalPosts: posts.length,
          moodDistribution,
          timeDistribution,
          redisConnected: true,
          lastUpdated: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error getting community stats:', error);
      res.status(500).json({
        error: 'Failed to get statistics',
        stats: {
          totalPosts: 0,
          redisConnected: false,
          message: 'Statistics unavailable'
        }
      });
    }
  }

  // Clean up expired posts manually (Redis TTL handles this automatically)
  async cleanupExpiredPosts(req, res) {
    try {
      if (!redisHelpers.isConnected()) {
        return res.json({
          message: 'Redis not connected - cleanup not performed',
          cleaned: 0
        });
      }

      await redisHelpers.cleanupExpiredPosts();
      
      res.json({
        message: 'Cleanup completed',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error during cleanup:', error);
      res.status(500).json({
        error: 'Cleanup failed',
        message: 'Unable to perform cleanup right now'
      });
    }
  }

  // Health check for community features
  async healthCheck(req, res) {
    try {
      const redisConnected = redisHelpers.isConnected();
      const posts = redisConnected ? await redisHelpers.getAllPosts() : [];
      
      res.json({
        status: 'healthy',
        redisConnected,
        postsCount: posts.length,
        features: {
          createPost: redisConnected,
          getPosts: redisConnected,
          autoExpire: redisConnected
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Community health check error:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new CommunityController();