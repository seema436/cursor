const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { chatModerationMiddleware } = require('../middleware/moderation');

// POST /api/chat - Send message to AI companion
router.post('/', chatModerationMiddleware, chatController.handleChat);

// GET /api/chat/health - Check chat service health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'chat',
    aiEnabled: chatController.useRealAI,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;