const axios = require('axios');

// AI Response Controller
class ChatController {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useRealAI = !!this.openaiApiKey;
    
    if (!this.useRealAI) {
      console.log('⚠️  No OpenAI API key found - using dummy AI responses');
    }
  }

  // Handle chat messages
  async handleChat(req, res) {
    try {
      const { message } = req.body;
      const { crisisData, crisisResponse, originalMessage } = req.moderation;

      console.log(`💬 Received message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
      console.log(`🔍 Crisis detected: ${crisisData.hasCrisisContent ? 'Yes' : 'No'}`);

      // If crisis detected, prioritize crisis response
      if (crisisResponse) {
        console.log(`🚨 Crisis response triggered: ${crisisResponse.type}`);
        
        // For emergency situations, return immediate crisis response
        if (crisisResponse.shouldBypassAI) {
          return res.json({
            response: crisisResponse.message,
            resources: crisisResponse.resources,
            crisis: true,
            emergency: true,
            timestamp: new Date().toISOString()
          });
        }

        // For non-emergency crisis content, include resources with AI response
        const aiResponse = await this.generateAIResponse(message);
        return res.json({
          response: `${crisisResponse.message}\n\n${aiResponse}`,
          resources: crisisResponse.resources,
          crisis: true,
          emergency: false,
          timestamp: new Date().toISOString()
        });
      }

      // Normal chat flow - get AI response
      const aiResponse = await this.generateAIResponse(message);
      
      res.json({
        response: aiResponse,
        crisis: false,
        emergency: false,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error in chat controller:', error);
      res.status(500).json({
        error: 'Failed to process message',
        message: 'I\'m having trouble responding right now. Please try again.',
        crisis: false,
        emergency: false,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Generate AI response using OpenAI or dummy responses
  async generateAIResponse(message) {
    if (this.useRealAI) {
      return await this.getOpenAIResponse(message);
    } else {
      return this.getDummyResponse(message);
    }
  }

  // OpenAI API integration
  async getOpenAIResponse(message) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a compassionate mental health companion named Sanjeevani. You provide supportive, empathetic responses to help people process their feelings. Keep responses:
              - Warm and understanding
              - Encouraging but not dismissive
              - 2-3 sentences maximum
              - Focused on validation and gentle guidance
              - Never provide medical advice
              - Suggest professional help when appropriate
              - Be culturally sensitive
              - Maintain hope and positivity`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      
      // Fallback to dummy response if OpenAI fails
      return this.getDummyResponse(message);
    }
  }

  // Dummy AI responses for demo/development
  getDummyResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Sentiment-based responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I hear that you're feeling really down right now. It's okay to feel sad - your emotions are valid. Sometimes just acknowledging these feelings can be the first step toward healing.";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('anxiety')) {
      return "Anxiety can feel overwhelming, but you're not alone in this. Take a deep breath with me. What you're experiencing is real, and there are ways to work through these feelings.";
    }
    
    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
      return "It sounds like you're carrying a lot of frustration. Those feelings are completely understandable. Let's take a moment to acknowledge that anger often comes from caring deeply about something.";
    }
    
    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
      return "Loneliness can feel so heavy. Thank you for reaching out and sharing with me. Even though it might not feel like it right now, you matter and your feelings are important.";
    }
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
      return "It sounds like you're carrying a lot right now. Feeling overwhelmed is a sign that you care and that you're dealing with real challenges. Let's take this one step at a time.";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "I'm so glad to hear you're feeling positive! It's wonderful that you're experiencing some joy. These moments of happiness are precious and worth celebrating.";
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return "Being tired - whether physically or emotionally - is your body and mind telling you they need care. Rest isn't selfish; it's necessary for your wellbeing.";
    }
    
    if (lowerMessage.includes('confused') || lowerMessage.includes('lost')) {
      return "Feeling confused or lost can be really unsettling. It's okay not to have all the answers right now. Sometimes clarity comes gradually as we process our experiences.";
    }
    
    // Default supportive responses
    const defaultResponses = [
      "Thank you for sharing that with me. Your feelings matter, and I'm here to listen. What you're experiencing is valid, and you don't have to go through this alone.",
      "I appreciate you opening up about what's on your mind. It takes courage to express your feelings. Remember that seeking support is a sign of strength, not weakness.",
      "I hear you, and I want you to know that your emotions are completely valid. You're doing the best you can with what you're facing right now.",
      "It sounds like you're dealing with a lot. Your willingness to share shows real strength. Take things one moment at a time - you don't have to figure everything out right now.",
      "Your feelings are important and deserve to be heard. Thank you for trusting me with what you're going through. You're braver than you realize."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}

module.exports = new ChatController();