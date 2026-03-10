'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatInterface from "./ChatInterface";
import WelcomeSection from "./WelcomeSection";

interface ChatEmbedProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ChatEmbed Component
 * 
 * An inline embeddable version of the chat interface that:
 * - Takes the full available space of its container
 * - Has no minimize/maximize functionality
 * - Is always in expanded form
 * - Can be styled via className or style props
 */
export default function ChatEmbed({ className = '', style = {} }: ChatEmbedProps) {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // Handle messages from parent window for API configuration
  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.data || !event.data.type) return;
    
    if (event.data.type === 'EMBED_CONFIG') {
      if (event.data.apiUrl) {
        setApiUrl(event.data.apiUrl);
      }
      
      // Send acknowledgment
      window.parent.postMessage({
        type: 'EMBED_READY',
        timestamp: Date.now()
      }, '*');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    
    // Send initial ready message
    window.parent.postMessage({
      type: 'EMBED_READY',
      timestamp: Date.now()
    }, '*');
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const handleStartChat = useCallback((message: string) => {
    setInitialMessage(message);
    setHasStartedChat(true);
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setHasStartedChat(false);
    setInitialMessage('');
  }, []);

  const handleNewConversation = useCallback(() => {
    setHasStartedChat(false);
    setInitialMessage('');
  }, []);

  // No-op functions for minimize since this is always expanded
  const handleMinimize = useCallback(() => {
    // Embed version doesn't support minimize
    console.log('Minimize not supported in embed mode');
  }, []);

  return (
    <div 
      className={`chat-embed w-full h-full bg-white rounded-lg overflow-hidden flex flex-col ${className}`}
      style={style}
    >
      {hasStartedChat ? (
        <ChatInterface 
          initialMessage={initialMessage} 
          onClose={handleBackToWelcome} 
          onMinimize={handleMinimize}
          onNewConversation={handleNewConversation}
          hideMinimizeButton={true} // Pass prop to hide minimize button
        />
      ) : (
        <WelcomeSection 
          onStartChat={handleStartChat} 
          onClose={handleMinimize}
          hideCloseButton={true} // Pass prop to hide close button
        />
      )}
    </div>
  );
}
