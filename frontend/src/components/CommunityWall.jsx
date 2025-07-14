import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityWall = ({ sessionData, onBackToHome }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [stats, setStats] = useState(null);

  // Mood options for posts
  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'hopeful', emoji: '🌟', label: 'Hopeful' },
    { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'confused', emoji: '🤔', label: 'Confused' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' }
  ];

  // Fetch posts from backend
  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/community');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Unable to load community posts right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch community stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/community/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Submit new post
  const submitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/community', {
        message: newPost.trim(),
        mood: selectedMood,
        anonymous: true
      });

      if (response.data.success) {
        setNewPost('');
        setSelectedMood('neutral');
        setShowSuccess(true);
        
        // Refresh posts
        await fetchPosts();
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      if (error.response?.data?.reason) {
        setError(error.response.data.reason);
      } else {
        setError('Unable to share your post right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - postTime) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return 'Earlier';
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? moodOption.emoji : '😐';
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
    fetchStats();
    
    // Refresh posts every 30 seconds
    const interval = setInterval(() => {
      fetchPosts();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🤝 Community Wall
          </h2>
          <p className="text-gray-600">
            Share anonymous messages of support, hope, and connection
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Posts automatically disappear after 1 hour • Stay supportive and kind
          </div>
        </div>
      </div>

      {/* Community Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-mental-primary">{stats.totalPosts}</div>
            <div className="text-sm text-gray-600">Active Posts</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-mental-primary">{stats.timeDistribution?.last15min || 0}</div>
            <div className="text-sm text-gray-600">Last 15 min</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-mental-primary">{stats.timeDistribution?.last60min || 0}</div>
            <div className="text-sm text-gray-600">Last hour</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-mental-primary">100%</div>
            <div className="text-sm text-gray-600">Anonymous</div>
          </div>
        </div>
      )}

      {/* Post Creation Form */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ✨ Share Something Anonymous
        </h3>
        
        <form onSubmit={submitPost} className="space-y-4">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    selectedMood === mood.value
                      ? 'border-mental-primary bg-mental-primary/10 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={mood.label}
                >
                  <div className="text-2xl">{mood.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your message
            </label>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share words of encouragement, hope, or support for others..."
              rows="4"
              className="input-field resize-none"
              maxLength={500}
            />
            <div className="text-right mt-2">
              <span className="text-xs text-gray-500">
                {newPost.length}/500 characters
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                ✅ Your message has been shared anonymously! Thank you for contributing to our community.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !newPost.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Sharing...
              </span>
            ) : (
              '🌟 Share Anonymously'
            )}
          </button>
        </form>
      </div>

      {/* Community Guidelines */}
      <div className="card mb-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💙 Community Guidelines
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Share messages of support, hope, and encouragement</li>
          <li>• Be kind and respectful to everyone</li>
          <li>• Avoid sharing personal information</li>
          <li>• Crisis content should be handled in private chat</li>
          <li>• Your posts will automatically disappear after 1 hour</li>
        </ul>
      </div>

      {/* Posts Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Community Posts
          </h3>
          <button
            onClick={fetchPosts}
            className="text-sm text-mental-primary hover:text-mental-primary/80"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌱</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Be the first to share!
            </h4>
            <p className="text-gray-600">
              Start the conversation by sharing an anonymous message of support.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-slide-up"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getMoodEmoji(post.mood)}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{post.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Anonymous • {formatTime(post.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires in {Math.ceil((new Date(post.expiresAt) - new Date()) / 60000)} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Notice */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Posts refresh automatically every 30 seconds • All posts expire after 1 hour
      </div>
    </div>
  );
};

export default CommunityWall;