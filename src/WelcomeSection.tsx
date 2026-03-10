'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface WelcomeSectionProps {
  onStartChat: (message: string) => void;
}

const suggestions = [
  { icon: '✈️', text: 'Plan a weekend trip', message: 'I want to plan a weekend trip to Paris for 2 people' },
  { icon: '🏨', text: 'Find hotels in Paris', message: 'Find me boutique hotels in central Paris' },
  { icon: '🚗', text: 'Airport transfers', message: 'I need an airport transfer from CDG to central Paris' },
  { icon: '🎯', text: 'Things to do', message: 'What are the best experiences in Paris this weekend?' },
];

export default function WelcomeSection({ onStartChat }: WelcomeSectionProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onStartChat(message.trim());
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-nilgai-blue/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Where would you like to go?</h1>
        <p className="text-nilgai-gray-400 text-sm">
          I&apos;ll help you find flights, hotels, transfers, and experiences — all in one place.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
        <div className="relative rounded-xl border border-nilgai-gray-700 bg-nilgai-gray-800 shadow-lg focus-within:border-nilgai-blue/50 transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Plan a trip, find a hotel, book an experience..."
            rows={2}
            className="w-full pt-3 pb-1.5 px-4 text-sm bg-transparent text-white rounded-xl
                       focus:outline-none placeholder:text-nilgai-gray-500 resize-none
                       leading-5"
            style={{ fontSize: '16px' }}
          />
          <div className="flex items-center justify-end px-3 pb-2">
            {message.trim() && (
              <button
                type="submit"
                className="p-1.5 rounded-lg text-nilgai-orange hover:bg-nilgai-gray-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {suggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => onStartChat(s.message)}
            className="px-3 py-2 rounded-full border border-nilgai-gray-700 bg-nilgai-gray-800/50
                       hover:bg-nilgai-gray-700 hover:border-nilgai-gray-600 transition-all
                       text-sm text-nilgai-gray-300 flex items-center gap-2"
          >
            <span>{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <a
          href="https://nilgai.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-nilgai-gray-600 hover:text-nilgai-gray-400 transition-colors"
        >
          Powered by NilgAI
        </a>
      </div>
    </div>
  );
}
