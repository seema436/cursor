const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { communityModerationMiddleware } = require('../middleware/moderation');

// GET /api/community - Get all community wall posts
router.get('/', communityController.getPosts);

// POST /api/community - Create a new community wall post
router.post('/', communityModerationMiddleware, communityController.createPost);

// GET /api/community/stats - Get community wall statistics
router.get('/stats', communityController.getStats);

// GET /api/community/health - Check community service health
router.get('/health', communityController.healthCheck);

// POST /api/community/cleanup - Manual cleanup of expired posts
router.post('/cleanup', communityController.cleanupExpiredPosts);

module.exports = router;