'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import WelcomeSection from './WelcomeSection';
import ChatInterface from './ChatInterface';

export default function ChatPopup() {
  const [hasStartedChat, setHasStartedChat] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('chatStarted') === 'true'; } catch { return false; }
    }
    return false;
  });
  const [initialMessage, setInitialMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('chatInitialMessage') || ''; } catch { return ''; }
    }
    return '';
  });
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('chatMinimized');
        return savedState !== null ? JSON.parse(savedState) : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const handleStartChat = useCallback((message: string) => {
    setInitialMessage(message);
    setHasStartedChat(true);
    try {
      localStorage.setItem('chatStarted', 'true');
      localStorage.setItem('chatInitialMessage', message);
    } catch { /* ignore */ }
  }, []);

  const clearChatState = useCallback(() => {
    setHasStartedChat(false);
    setInitialMessage('');
    try {
      localStorage.removeItem('chatStarted');
      localStorage.removeItem('chatInitialMessage');
      localStorage.removeItem('chatState');
    } catch { /* ignore */ }
  }, []);

  const handleRestart = useCallback(() => {
    clearChatState();
  }, [clearChatState]);

  const handleBack = useCallback(() => {
    clearChatState();
  }, [clearChatState]);

  const handleClose = useCallback(() => {
    setIsMinimized(true);
    try {
      localStorage.setItem('chatMinimized', 'true');
    } catch {}
  }, []);

  const handleOpen = useCallback(() => {
    setIsMinimized(false);
    try {
      localStorage.setItem('chatMinimized', 'false');
    } catch {}
  }, []);

  // Minimized state — floating button bottom-right
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="bg-white py-2 px-4 rounded-full shadow-lg">
          <span className="text-[#161616] text-sm whitespace-nowrap font-medium">
            Jess from NilgAI
          </span>
        </div>
        <button
          onClick={handleOpen}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center
                     hover:scale-105 transition-transform duration-200 overflow-hidden"
        >
          <Image
            src="/Jess @ NilgAI.png"
            alt="Jess"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    );
  }

  // Expanded state — bottom-right chat window
  return (
    <div className="chat-window fixed bottom-6 right-6 md:max-w-[400px] w-[calc(100%-1.5rem)] max-w-[400px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="w-full h-[600px] md:h-[650px] flex flex-col min-h-0">
        {/* Header */}
        {hasStartedChat ? (
          <div className="flex-shrink-0 flex items-center px-4 py-3 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-2"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <Image
              src="/Jess @ NilgAI.png"
              alt="Jess"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="ml-2 font-medium text-gray-900 text-sm">Jess @ NilgAI</span>
            <div className="ml-auto">
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 flex justify-end px-4 py-3">
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        {!hasStartedChat ? (
          <WelcomeSection onStartChat={handleStartChat} />
        ) : (
          <ChatInterface
            initialMessage={initialMessage}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
