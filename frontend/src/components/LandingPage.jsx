import React from 'react';

const LandingPage = ({ onStartChat, onMoodCheckin, onJournaling, onCommunityWall }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-mental-primary/10 to-mental-secondary/10 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How are you feeling today?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to your safe, anonymous space for mental health support. 
            Everything you share here is private and temporary.
          </p>
          <button
            onClick={onStartChat}
            className="btn-primary text-lg px-8 py-3 animate-pulse-slow"
          >
            💬 Start Conversation
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chat Feature */}
        <div className="card card-hover">
          <div className="text-center">
            <div className="text-4xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              AI Companion
            </h3>
            <p className="text-gray-600 mb-4">
              Share your thoughts and feelings with our compassionate AI companion. 
              Get supportive responses and guidance.
            </p>
            <button
              onClick={onStartChat}
              className="btn-primary w-full"
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* Mood Check-in Feature */}
        <div className="card card-hover">
          <div className="text-center">
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Mood Check-in
            </h3>
            <p className="text-gray-600 mb-4">
              Track how you're feeling with our simple mood tracker. 
              Understand your emotional patterns.
            </p>
            <button
              onClick={onMoodCheckin}
              className="btn-primary w-full"
            >
              Check Mood
            </button>
          </div>
        </div>

        {/* Journaling Feature */}
        <div className="card card-hover">
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Reflect & Release
            </h3>
            <p className="text-gray-600 mb-4">
              Write down your thoughts in a safe space. 
              Express yourself freely and find clarity.
            </p>
            <button
              onClick={onJournaling}
              className="btn-primary w-full"
            >
              Start Journal
            </button>
          </div>
        </div>

        {/* Community Wall Feature */}
        <div className="card card-hover">
          <div className="text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Community Wall
            </h3>
            <p className="text-gray-600 mb-4">
              Share anonymous messages with others. 
              Connect with people who understand.
            </p>
            <button
              onClick={onCommunityWall}
              className="btn-primary w-full"
            >
              View Community
            </button>
          </div>
        </div>

        {/* Safety & Privacy */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Privacy First
            </h3>
            <p className="text-blue-700 mb-4">
              No registration, no cookies, no tracking. 
              Your data stays with you.
            </p>
            <div className="text-sm text-blue-600">
              ✓ Anonymous sessions<br/>
              ✓ No data storage<br/>
              ✓ Encrypted connections
            </div>
          </div>
        </div>

        {/* Crisis Support */}
        <div className="card bg-red-50 border-red-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🆘</div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Crisis Support
            </h3>
            <p className="text-red-700 mb-4">
              If you're in crisis, we'll connect you with 
              professional help immediately.
            </p>
            <button
              onClick={() => {
                const emergency = document.getElementById('emergency-resources');
                if (emergency) {
                  emergency.classList.remove('hidden');
                }
              }}
              className="btn-danger w-full"
            >
              Get Help Now
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="card bg-gray-50">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          How Sanjeevani Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-mental-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Choose Your Space</h4>
            <p className="text-gray-600 text-sm">
              Select from chat, mood tracking, journaling, or community sharing
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-mental-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Share Safely</h4>
            <p className="text-gray-600 text-sm">
              Express your thoughts knowing everything is private and temporary
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-mental-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Get Support</h4>
            <p className="text-gray-600 text-sm">
              Receive compassionate responses and connect with helpful resources
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-mental-primary">100%</div>
          <div className="text-sm text-gray-600">Anonymous</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-mental-primary">0</div>
          <div className="text-sm text-gray-600">Data Stored</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-mental-primary">24/7</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-mental-primary">Safe</div>
          <div className="text-sm text-gray-600">& Secure</div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;