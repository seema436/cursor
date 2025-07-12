import React, { useState, useEffect } from 'react';

const JournalPrompt = ({ sessionData, updateSessionData, onBackToHome }) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Journaling prompts
  const prompts = [
    {
      id: 1,
      category: 'Reflection',
      title: 'Current Feelings',
      prompt: 'What emotions am I experiencing right now? What might be contributing to these feelings?',
      icon: '🤔'
    },
    {
      id: 2,
      category: 'Gratitude',
      title: 'Three Good Things',
      prompt: 'What are three things I\'m grateful for today, no matter how small?',
      icon: '🙏'
    },
    {
      id: 3,
      category: 'Challenges',
      title: 'Working Through Difficulties',
      prompt: 'What challenges am I facing? What resources or strengths do I have to help me?',
      icon: '💪'
    },
    {
      id: 4,
      category: 'Goals',
      title: 'Moving Forward',
      prompt: 'What small step can I take today to move toward feeling better or achieving my goals?',
      icon: '🎯'
    },
    {
      id: 5,
      category: 'Self-Care',
      title: 'Caring for Myself',
      prompt: 'What does my mind and body need right now? How can I show myself compassion?',
      icon: '💚'
    },
    {
      id: 6,
      category: 'Relationships',
      title: 'Connections',
      prompt: 'How are my relationships affecting me? Who makes me feel supported and understood?',
      icon: '🤝'
    },
    {
      id: 7,
      category: 'Growth',
      title: 'Learning and Growing',
      prompt: 'What have I learned about myself recently? How am I growing as a person?',
      icon: '🌱'
    },
    {
      id: 8,
      category: 'Hope',
      title: 'Looking Ahead',
      prompt: 'What am I looking forward to? What gives me hope for the future?',
      icon: '✨'
    },
    {
      id: 9,
      category: 'Stress',
      title: 'Managing Pressure',
      prompt: 'What is causing me stress? What coping strategies have worked for me in the past?',
      icon: '🌪️'
    },
    {
      id: 10,
      category: 'Free Write',
      title: 'Open Expression',
      prompt: 'Write freely about anything on your mind. Let your thoughts flow without judgment.',
      icon: '✍️'
    }
  ];

  // Update word count
  useEffect(() => {
    const words = journalEntry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [journalEntry]);

  // Handle prompt selection
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    setJournalEntry('');
    setShowCompletion(false);
  };

  // Complete journaling session
  const completeJournal = () => {
    if (!journalEntry.trim()) return;

    const journalData = {
      prompt: selectedPrompt,
      entry: journalEntry.trim(),
      wordCount: wordCount,
      timestamp: new Date().toISOString()
    };

    updateSessionData({ journalEntry: journalData });
    setShowCompletion(true);

    // Auto-hide completion message after 5 seconds
    setTimeout(() => {
      setShowCompletion(false);
    }, 5000);
  };

  // Get writing encouragement
  const getWritingEncouragement = () => {
    if (wordCount === 0) return '';
    if (wordCount < 10) return 'Great start! Keep writing...';
    if (wordCount < 50) return 'You\'re doing well! Your thoughts matter.';
    if (wordCount < 100) return 'Beautiful reflection! You\'re really opening up.';
    if (wordCount < 200) return 'Wonderful depth! This is powerful self-reflection.';
    return 'Amazing! You\'ve created something truly meaningful.';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            📝 Reflect & Release
          </h2>
          <p className="text-gray-600">
            Take time to process your thoughts and feelings through guided journaling
          </p>
        </div>
      </div>

      {/* Prompt Selection */}
      {!selectedPrompt && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Choose a journaling prompt that resonates with you
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-mental-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{prompt.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{prompt.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{prompt.category}</div>
                      <div className="text-sm text-gray-700 mt-2">{prompt.prompt}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Benefits of Journaling */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              💡 Benefits of Journaling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>• Reduces stress and anxiety</div>
              <div>• Improves self-awareness</div>
              <div>• Helps process emotions</div>
              <div>• Enhances problem-solving</div>
              <div>• Boosts mood and wellbeing</div>
              <div>• Provides mental clarity</div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Writing Interface */}
      {selectedPrompt && !showCompletion && (
        <div className="space-y-6">
          {/* Selected Prompt Display */}
          <div className="card bg-mental-primary/10 border-mental-primary/30">
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{selectedPrompt.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{selectedPrompt.title}</h3>
                <p className="text-gray-700 mt-2">{selectedPrompt.prompt}</p>
              </div>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Change Prompt
              </button>
            </div>
          </div>

          {/* Writing Area */}
          <div className="card">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Your Journal Entry</h3>
                <div className="text-sm text-gray-600">
                  {wordCount} words • {getWritingEncouragement()}
                </div>
              </div>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your thoughts here... Remember, this is your private space."
                rows="12"
                className="input-field resize-none text-base leading-relaxed"
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {journalEntry.length}/2000 characters
                </div>
                <div className="text-xs text-gray-500">
                  💡 Tip: Write freely without worrying about grammar or structure
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={completeJournal}
                disabled={!journalEntry.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Complete & Release
              </button>
              <button
                onClick={() => setJournalEntry('')}
                className="btn-secondary"
              >
                🔄 Start Over
              </button>
            </div>
          </div>

          {/* Writing Tips */}
          <div className="card bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              ✍️ Writing Tips
            </h3>
            <div className="text-sm text-green-700 space-y-2">
              <div>• Write in whatever way feels natural to you</div>
              <div>• Don't worry about spelling or grammar</div>
              <div>• Be honest with yourself - no judgment here</div>
              <div>• If you get stuck, just keep writing whatever comes to mind</div>
              <div>• Remember: your thoughts and feelings are valid</div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {showCompletion && (
        <div className="card bg-green-50 border-green-200 animate-slide-up">
          <div className="text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Beautiful Work!
            </h3>
            <p className="text-green-700 mb-4">
              You've taken an important step in your mental health journey. 
              Your thoughts and feelings matter, and you've given them the attention they deserve.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
              <div className="text-sm text-green-700">
                <strong>Your session:</strong> {wordCount} words • {selectedPrompt.title}
              </div>
            </div>
            <button
              onClick={() => setSelectedPrompt(null)}
              className="btn-primary"
            >
              ✍️ Journal Again
            </button>
          </div>
        </div>
      )}

      {/* Previous Journal Summary */}
      {sessionData.journalEntry && (
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📖 Your Current Session
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl mb-2">{sessionData.journalEntry.prompt.icon}</div>
              <div className="text-sm font-medium text-gray-700">
                {sessionData.journalEntry.prompt.title}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-mental-primary mb-2">
                {sessionData.journalEntry.wordCount}
              </div>
              <div className="text-sm text-gray-600">Words Written</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-mental-primary mb-2">
                {new Date(sessionData.journalEntry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPrompt;