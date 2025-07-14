import React, { useState } from 'react';

const PrivacyNotice = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-800">
                🔒 Privacy First:
              </span>
              <span className="text-sm text-blue-700 ml-1">
                No registration, no cookies, no data storage. Your session is completely anonymous.
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {showDetails ? 'Hide Details' : 'Learn More'}
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 animate-slide-up">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🛡️ Your Privacy is Our Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">What We DON'T Collect</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• No personal information</li>
                  <li>• No email addresses or phone numbers</li>
                  <li>• No IP address tracking</li>
                  <li>• No cookies or local storage</li>
                  <li>• No conversation history</li>
                  <li>• No user profiles or accounts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">How We Protect You</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All connections are encrypted (HTTPS)</li>
                  <li>• Messages are processed in real-time</li>
                  <li>• Community posts expire after 1 hour</li>
                  <li>• No logs are kept of your activity</li>
                  <li>• Session data disappears when you leave</li>
                  <li>• No third-party tracking scripts</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> While we prioritize your privacy, please remember that this is a support tool, 
                not a replacement for professional mental health care. If you're experiencing a crisis, 
                please contact emergency services or a mental health professional immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyNotice;