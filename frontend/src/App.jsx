import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import MoodCheckin from './components/MoodCheckin';
import JournalPrompt from './components/JournalPrompt';
import CommunityWall from './components/CommunityWall';
import PrivacyNotice from './components/PrivacyNotice';

function App() {
  // Application state
  const [currentView, setCurrentView] = useState('landing');
  const [sessionData, setSessionData] = useState({
    mood: null,
    journalEntry: null,
    chatHistory: [],
    startTime: new Date()
  });

  // Privacy-first: Clear session data on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear any sensitive data before page closes
      setSessionData({
        mood: null,
        journalEntry: null,
        chatHistory: [],
        startTime: new Date()
      });
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Update session data
  const updateSessionData = (updates) => {
    setSessionData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Navigation handlers
  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleMoodCheckin = () => {
    setCurrentView('mood');
  };

  const handleJournaling = () => {
    setCurrentView('journal');
  };

  const handleCommunityWall = () => {
    setCurrentView('community');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onStartChat={handleStartChat}
            onMoodCheckin={handleMoodCheckin}
            onJournaling={handleJournaling}
            onCommunityWall={handleCommunityWall}
          />
        );
      case 'chat':
        return (
          <ChatInterface
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onBackToHome={handleBackToHome}
          />
        );
      case 'mood':
        return (
          <MoodCheckin
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onBackToHome={handleBackToHome}
            onStartChat={handleStartChat}
          />
        );
      case 'journal':
        return (
          <JournalPrompt
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onBackToHome={handleBackToHome}
          />
        );
      case 'community':
        return (
          <CommunityWall
            sessionData={sessionData}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return (
          <LandingPage
            onStartChat={handleStartChat}
            onMoodCheckin={handleMoodCheckin}
            onJournaling={handleJournaling}
            onCommunityWall={handleCommunityWall}
          />
        );
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50 privacy-first">
      {/* Privacy Notice */}
      <PrivacyNotice />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Sanjeevani
            </h1>
            <p className="text-gray-600 text-lg">
              Your Anonymous Mental Health Companion
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-500">
                Private & Secure Session
              </span>
            </div>
          </header>

          {/* Current View */}
          <div className="animate-fade-in">
            {renderCurrentView()}
          </div>

          {/* Navigation Footer */}
          {currentView !== 'landing' && (
            <footer className="mt-8 text-center">
              <button
                onClick={handleBackToHome}
                className="btn-secondary"
              >
                🏠 Back to Home
              </button>
            </footer>
          )}
        </div>
      </main>

      {/* Emergency Resources Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            const emergency = document.getElementById('emergency-resources');
            if (emergency) {
              emergency.classList.remove('hidden');
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
          title="Emergency Resources"
        >
          🆘 Help
        </button>
      </div>

      {/* Session Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white text-xs p-2 rounded opacity-50">
          <div>View: {currentView}</div>
          <div>Mood: {sessionData.mood || 'Not set'}</div>
          <div>Messages: {sessionData.chatHistory.length}</div>
        </div>
      )}
    </div>
  );
}

export default App;