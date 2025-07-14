// Crisis detection and moderation middleware
const crisisKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self harm', 'self-harm', 'hurt myself', 'cutting', 'overdose',
  'panic attack', 'panic', 'anxiety attack', 'can\'t breathe',
  'hopeless', 'worthless', 'nobody cares', 'better off dead',
  'abuse', 'domestic violence', 'being hurt', 'unsafe',
  'crisis', 'emergency', 'help me', 'desperate'
];

const emergencyKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'overdose', 'self harm', 'cutting', 'hurt myself'
];

// Crisis resources and helplines
const crisisResources = {
  emergency: {
    title: "🚨 Immediate Crisis Support",
    message: "If you're in immediate danger, please contact emergency services or go to your nearest emergency room.",
    resources: [
      {
        name: "National Suicide Prevention Lifeline (US)",
        contact: "988 or 1-800-273-8255",
        available: "24/7"
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        available: "24/7"
      },
      {
        name: "International Association for Suicide Prevention",
        contact: "https://www.iasp.info/resources/Crisis_Centres/",
        available: "Global resources"
      }
    ]
  },
  support: {
    title: "💙 Mental Health Support",
    message: "You're not alone. Here are some resources that can help:",
    resources: [
      {
        name: "National Alliance on Mental Illness (NAMI)",
        contact: "1-800-950-6264",
        available: "Mon-Fri 10AM-6PM ET"
      },
      {
        name: "SAMHSA National Helpline",
        contact: "1-800-662-4357",
        available: "24/7"
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        available: "24/7"
      }
    ]
  }
};

// Moderation functions
const moderationHelpers = {
  // Check if message contains crisis keywords
  detectCrisis: (message) => {
    const lowerMessage = message.toLowerCase();
    const foundKeywords = crisisKeywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    const isEmergency = emergencyKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    return {
      hasCrisisContent: foundKeywords.length > 0,
      isEmergency: isEmergency,
      keywords: foundKeywords,
      severity: isEmergency ? 'high' : foundKeywords.length > 0 ? 'medium' : 'low'
    };
  },

  // Generate appropriate crisis response
  generateCrisisResponse: (crisisData) => {
    if (crisisData.isEmergency) {
      return {
        type: 'emergency',
        message: "I'm really concerned about you right now. Your safety is the most important thing. Please reach out to someone who can help immediately - whether that's emergency services, a crisis helpline, or a trusted person in your life.",
        resources: crisisResources.emergency,
        shouldBypassAI: true
      };
    } else if (crisisData.hasCrisisContent) {
      return {
        type: 'support',
        message: "I hear that you're going through a really difficult time. Thank you for sharing with me. While I'm here to listen, I want to make sure you have access to professional support that can provide the help you deserve.",
        resources: crisisResources.support,
        shouldBypassAI: false
      };
    }
    return null;
  },

  // Check for inappropriate content (simple filter)
  checkInappropriateContent: (message) => {
    const inappropriatePatterns = [
      /spam/i,
      /advertisement/i,
      /buy now/i,
      /click here/i,
      /www\./i,
      /http/i,
      /\.com/i,
      /personal information/i,
      /phone number/i,
      /address/i,
      /meet me/i,
      /location/i
    ];

    const hasInappropriate = inappropriatePatterns.some(pattern => 
      pattern.test(message)
    );

    return {
      hasInappropriate,
      reason: hasInappropriate ? 'Contains potentially inappropriate content' : null
    };
  },

  // Moderate message for community wall
  moderateForCommunity: (message) => {
    const crisisCheck = moderationHelpers.detectCrisis(message);
    const inappropriateCheck = moderationHelpers.checkInappropriateContent(message);

    // Don't allow crisis content on community wall
    if (crisisCheck.hasCrisisContent) {
      return {
        allowed: false,
        reason: 'Crisis content should be handled privately through chat',
        suggestion: 'Please use the private chat feature for personal support'
      };
    }

    // Don't allow inappropriate content
    if (inappropriateCheck.hasInappropriate) {
      return {
        allowed: false,
        reason: inappropriateCheck.reason,
        suggestion: 'Please keep posts supportive and relevant to mental health'
      };
    }

    // Check message length
    if (message.length > 500) {
      return {
        allowed: false,
        reason: 'Message too long',
        suggestion: 'Please keep community posts under 500 characters'
      };
    }

    return {
      allowed: true,
      reason: null,
      suggestion: null
    };
  }
};

// Middleware for chat moderation
const chatModerationMiddleware = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Invalid message',
      message: 'Please provide a valid message'
    });
  }

  // Check for crisis content
  const crisisData = moderationHelpers.detectCrisis(message);
  const crisisResponse = moderationHelpers.generateCrisisResponse(crisisData);

  // Add moderation data to request
  req.moderation = {
    crisisData,
    crisisResponse,
    originalMessage: message
  };

  next();
};

// Middleware for community moderation
const communityModerationMiddleware = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Invalid message',
      message: 'Please provide a valid message'
    });
  }

  // Moderate for community wall
  const moderationResult = moderationHelpers.moderateForCommunity(message);

  if (!moderationResult.allowed) {
    return res.status(400).json({
      error: 'Content not allowed',
      reason: moderationResult.reason,
      suggestion: moderationResult.suggestion
    });
  }

  next();
};

module.exports = {
  moderationHelpers,
  chatModerationMiddleware,
  communityModerationMiddleware,
  crisisResources
};