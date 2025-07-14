import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatInterface = ({ sessionData, updateSessionData, onBackToHome }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [sessionData.chatHistory]);

  // Send message to backend
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setError('');
    setIsLoading(true);

    // Add user message to chat history
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    updateSessionData({
      chatHistory: [...sessionData.chatHistory, newUserMessage]
    });

    try {
      // Send message to backend
      const response = await axios.post('/api/chat', {
        message: userMessage
      });

      // Add AI response to chat history
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        crisis: response.data.crisis || false,
        emergency: response.data.emergency || false,
        resources: response.data.resources || null
      };

      updateSessionData({
        chatHistory: [...sessionData.chatHistory, newUserMessage, aiMessage]
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Sorry, I\'m having trouble responding right now. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I\'m having trouble connecting right now. Your message is important to me, so please try again in a moment.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };

      updateSessionData({
        chatHistory: [...sessionData.chatHistory, newUserMessage, errorMessage]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Render crisis resources
  const renderCrisisResources = (resources) => {
    if (!resources) return null;

    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2">{resources.title}</h4>
        <p className="text-red-700 text-sm mb-3">{resources.message}</p>
        <div className="space-y-2">
          {resources.resources.map((resource, index) => (
            <div key={index} className="text-sm">
              <strong className="text-red-800">{resource.name}:</strong>
              <span className="text-red-700 ml-2">{resource.contact}</span>
              <span className="text-red-600 ml-2 text-xs">({resource.available})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              💬 Chat with Sanjeevani
            </h2>
            <p className="text-gray-600 mt-1">
              Share your thoughts and feelings in this safe space
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card">
        <div 
          ref={chatContainerRef}
          className="chat-container h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg"
        >
          {sessionData.chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Welcome to your private conversation
              </h3>
              <p className="text-gray-600 text-sm">
                I'm here to listen and support you. Share anything that's on your mind.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessionData.chatHistory.map((msg) => (
                <div key={msg.id} className="animate-slide-up">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-mental-primary text-white' 
                        : msg.crisis 
                        ? 'bg-red-50 text-red-800 border border-red-200' 
                        : msg.isError
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className="text-xs mt-1 opacity-70">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show crisis resources if available */}
                  {msg.resources && renderCrisisResources(msg.resources)}
                </div>
              ))}
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span className="text-sm text-gray-600">Sanjeevani is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="input-field flex-1"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              '📤 Send'
            )}
          </button>
        </form>

        {/* Character count */}
        <div className="mt-2 text-right">
          <span className="text-xs text-gray-500">
            {message.length}/500 characters
          </span>
        </div>
      </div>

      {/* Chat Guidelines */}
      <div className="card mt-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💡 Chat Guidelines
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Share openly - this is a judgment-free space</li>
          <li>• Be patient - thoughtful responses take time</li>
          <li>• Remember - this is for support, not medical advice</li>
          <li>• If you're in crisis, please use the emergency resources</li>
        </ul>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-mental-primary">
            {sessionData.chatHistory.filter(msg => msg.sender === 'user').length}
          </div>
          <div className="text-sm text-gray-600">Messages Sent</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-mental-primary">
            {sessionData.chatHistory.filter(msg => msg.sender === 'ai').length}
          </div>
          <div className="text-sm text-gray-600">Responses</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-mental-primary">
            {Math.ceil((Date.now() - new Date(sessionData.startTime)) / 60000)}
          </div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-mental-primary">100%</div>
          <div className="text-sm text-gray-600">Private</div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;