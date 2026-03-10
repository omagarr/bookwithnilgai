'use client';

import React, { useState, useCallback } from 'react';
import WelcomeSection from './WelcomeSection';
import ChatInterface from './ChatInterface';

export default function ChatPage() {
  const [view, setView] = useState<'welcome' | 'chat'>('welcome');
  const [initialMessage, setInitialMessage] = useState('');

  const handleStartChat = useCallback((message: string) => {
    setInitialMessage(message);
    setView('chat');
  }, []);

  const handleRestart = useCallback(() => {
    setInitialMessage('');
    setView('welcome');
  }, []);

  return (
    <div className="h-screen w-screen bg-nilgai-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-nilgai-blue px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">NilgAI</span>
          <span className="text-white/50 text-xs font-light ml-1">Travel Demo</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-2xl h-full flex flex-col">
          {view === 'welcome' ? (
            <WelcomeSection onStartChat={handleStartChat} />
          ) : (
            <ChatInterface
              initialMessage={initialMessage}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>
    </div>
  );
}
