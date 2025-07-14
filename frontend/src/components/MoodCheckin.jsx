import React, { useState, useEffect } from 'react';

const MoodCheckin = ({ sessionData, updateSessionData, onBackToHome, onStartChat }) => {
  const [selectedMood, setSelectedMood] = useState(sessionData.mood || null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [showThanks, setShowThanks] = useState(false);

  // Mood options with emojis and descriptions
  const moodOptions = [
    { emoji: '😢', name: 'Very Sad', value: 'very-sad', color: 'bg-red-100 border-red-300' },
    { emoji: '😔', name: 'Sad', value: 'sad', color: 'bg-orange-100 border-orange-300' },
    { emoji: '😐', name: 'Neutral', value: 'neutral', color: 'bg-gray-100 border-gray-300' },
    { emoji: '🙂', name: 'Happy', value: 'happy', color: 'bg-green-100 border-green-300' },
    { emoji: '😊', name: 'Very Happy', value: 'very-happy', color: 'bg-emerald-100 border-emerald-300' },
    { emoji: '😰', name: 'Anxious', value: 'anxious', color: 'bg-yellow-100 border-yellow-300' },
    { emoji: '😤', name: 'Frustrated', value: 'frustrated', color: 'bg-red-100 border-red-300' },
    { emoji: '😴', name: 'Tired', value: 'tired', color: 'bg-blue-100 border-blue-300' },
    { emoji: '🤔', name: 'Confused', value: 'confused', color: 'bg-purple-100 border-purple-300' },
    { emoji: '😌', name: 'Calm', value: 'calm', color: 'bg-teal-100 border-teal-300' }
  ];

  // Intensity labels
  const intensityLabels = {
    1: 'Very Low',
    2: 'Low',
    3: 'Mild',
    4: 'Moderate',
    5: 'Average',
    6: 'Noticeable',
    7: 'High',
    8: 'Very High',
    9: 'Intense',
    10: 'Overwhelming'
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  // Submit mood check-in
  const submitMoodCheckin = () => {
    if (!selectedMood) return;

    const moodData = {
      mood: selectedMood,
      intensity: moodIntensity,
      note: moodNote.trim(),
      timestamp: new Date().toISOString()
    };

    updateSessionData({ mood: moodData });
    setShowThanks(true);

    // Auto-hide thanks message after 3 seconds
    setTimeout(() => {
      setShowThanks(false);
    }, 3000);
  };

  // Get mood recommendation
  const getMoodRecommendation = () => {
    if (!selectedMood) return '';

    const recommendations = {
      'very-sad': 'It sounds like you\'re going through a tough time. Consider reaching out to someone you trust or talking to our AI companion.',
      'sad': 'Feeling down is completely normal. Sometimes talking about it can help lighten the load.',
      'neutral': 'A neutral mood is perfectly okay. You might enjoy some gentle self-care activities.',
      'happy': 'It\'s wonderful that you\'re feeling positive! Cherish these moments.',
      'very-happy': 'Your happiness is beautiful! Consider sharing your joy with others.',
      'anxious': 'Anxiety can be challenging. Try some deep breathing exercises or talk to someone about what\'s worrying you.',
      'frustrated': 'Frustration is understandable. Consider what might be causing it and how you might address it.',
      'tired': 'Rest is important for your wellbeing. Make sure you\'re getting enough sleep and taking breaks.',
      'confused': 'Feeling confused is okay. Sometimes talking through your thoughts can bring clarity.',
      'calm': 'Calmness is a gift. Enjoy this peaceful moment and consider what helps you feel this way.'
    };

    return recommendations[selectedMood] || '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            😊 Mood Check-in
          </h2>
          <p className="text-gray-600">
            Take a moment to check in with yourself. How are you feeling right now?
          </p>
        </div>
      </div>

      {/* Mood Selection */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          1. Select your current mood
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedMood === mood.value
                  ? `${mood.color} border-mental-primary scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium text-gray-700">{mood.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      {selectedMood && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2. How intense is this feeling?
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 w-16">Very Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={moodIntensity}
                onChange={(e) => setMoodIntensity(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-20">Overwhelming</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mental-primary">{moodIntensity}</div>
              <div className="text-sm text-gray-600">{intensityLabels[moodIntensity]}</div>
            </div>
          </div>
        </div>
      )}

      {/* Optional Note */}
      {selectedMood && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            3. Want to add a note? (Optional)
          </h3>
          <textarea
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="What's contributing to this mood? Any specific thoughts or events?"
            rows="3"
            className="input-field resize-none"
            maxLength={200}
          />
          <div className="text-right mt-2">
            <span className="text-xs text-gray-500">
              {moodNote.length}/200 characters
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {selectedMood && (
        <div className="card mb-6 animate-slide-up">
          <button
            onClick={submitMoodCheckin}
            className="btn-primary w-full py-3 text-lg"
          >
            ✅ Submit Check-in
          </button>
        </div>
      )}

      {/* Thank You Message */}
      {showThanks && (
        <div className="card mb-6 bg-green-50 border-green-200 animate-slide-up">
          <div className="text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Thank you for checking in!
            </h3>
            <p className="text-green-700 text-sm">
              Taking time to acknowledge your feelings is an important step in self-care.
            </p>
          </div>
        </div>
      )}

      {/* Mood Recommendation */}
      {selectedMood && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Personalized Suggestion
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            {getMoodRecommendation()}
          </p>
          <button
            onClick={onStartChat}
            className="btn-primary"
          >
            💬 Talk to Sanjeevani
          </button>
        </div>
      )}

      {/* Current Session Summary */}
      {sessionData.mood && (
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Your Current Session
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl mb-2">
                {moodOptions.find(m => m.value === sessionData.mood.mood)?.emoji}
              </div>
              <div className="text-sm font-medium text-gray-700">
                {moodOptions.find(m => m.value === sessionData.mood.mood)?.name}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-mental-primary mb-2">
                {sessionData.mood.intensity}/10
              </div>
              <div className="text-sm text-gray-600">Intensity</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-mental-primary mb-2">
                {new Date(sessionData.mood.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-600">Checked in</div>
            </div>
          </div>
          {sessionData.mood.note && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Your Note:</div>
              <div className="text-sm text-gray-600">{sessionData.mood.note}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodCheckin;