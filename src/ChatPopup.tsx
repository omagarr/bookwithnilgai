'use client';

import { useState, useEffect, useLayoutEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatInterface from "./ChatInterface";
import WelcomeSection from "./WelcomeSection";
import { MessageCircle } from 'lucide-react';
import { getConversationHistory } from '@/lib/api';

interface ChatPopupProps {
  initialMinimized?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

function ChatPopupContent({ initialMinimized = false, position = 'bottom-right' }: ChatPopupProps) {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const searchParams = useSearchParams();
  const isEmbedded = searchParams?.get('embed') === 'true';
  
  // Calculate initial minimized state correctly from the start to avoid state changes
  const [isMinimized, setIsMinimized] = useState(() => {
    // If embedded, always start as not minimized
    if (isEmbedded) return false;
    
    // For standalone mode, check localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('chatMinimized');
        return savedState !== null ? JSON.parse(savedState) : initialMinimized;
      } catch (error) {
        console.warn('Failed to parse localStorage state:', error);
        return initialMinimized;
      }
    }
    return initialMinimized;
  });
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const history = await getConversationHistory();
        if (history && history.messages && history.messages.length > 0) {
          setHasStartedChat(true);
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      } finally {
        // Add a small delay to prevent initial reload on mobile
        setTimeout(() => {
          setIsLoading(false);
          setIsInitialMount(false);
        }, 50);
      }
    };

    initializeChat();
  }, []);

  // Remove this useEffect since we now calculate isMinimized correctly from the start
  // This was causing the single reload issue on mobile

  // Optimize message handling with useCallback
  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.data || !event.data.type) return;
    
    if (event.data.type === 'WIDGET_PARENT_READY') {
      if (event.data.apiUrl) {
        setApiUrl(event.data.apiUrl);
      }
      
      window.parent.postMessage({
        type: 'WIDGET_READY',
        timestamp: Date.now()
      }, '*');
    }
  }, []);

  useEffect(() => {
    if (!isEmbedded) return;
    
    window.addEventListener('message', handleMessage);
    
    // Send initial ready message
    window.parent.postMessage({
      type: 'WIDGET_READY',
      timestamp: Date.now()
    }, '*');
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isEmbedded, handleMessage]);
  
  // Remove empty useEffect that was causing unnecessary re-renders
  useEffect(() => {
    if (isEmbedded && apiUrl) {
      // This effect was empty, so we can remove it or add actual logic if needed
    }
  }, [apiUrl, isEmbedded]);

  // Send initial state message only once after loading completes
  const [initialStateSent, setInitialStateSent] = useState(false);
  
  useEffect(() => {
    if (isEmbedded && !isLoading && !isInitialMount && !initialStateSent) {
      // Only send initial state message once after loading completes and initial mount is done
      const timeoutId = setTimeout(() => {
        window.parent.postMessage({
          type: 'WIDGET_INITIAL_STATE',
          state: isMinimized ? 'minimized' : 'maximized',
          timestamp: Date.now()
        }, '*');
        setInitialStateSent(true);
      }, 100); // Small delay to ensure parent is ready

      return () => clearTimeout(timeoutId);
    }
  }, [isEmbedded, isLoading, isInitialMount, initialStateSent, isMinimized]);

  // Optimize event handlers with useCallback to prevent unnecessary re-renders
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

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
    
    // Only save to localStorage if not in embedded mode
    if (!isEmbedded) {
      try {
        localStorage.setItem('chatMinimized', 'true');
      } catch (error) {
        console.warn('Failed to save minimized state:', error);
      }
    }
    
    if (isEmbedded) {
      window.parent.postMessage({
        type: 'WIDGET_CLOSE',
        state: 'minimized',
        timestamp: Date.now()
      }, '*');
    }
  }, [isEmbedded]);

  const handleMaximize = useCallback(() => {
    setIsMinimized(false);
    
    // Only save to localStorage if not in embedded mode
    if (!isEmbedded) {
      try {
        localStorage.setItem('chatMinimized', 'false');
      } catch (error) {
        console.warn('Failed to save maximized state:', error);
      }
    }
    
    if (isEmbedded) {
      window.parent.postMessage({
        type: 'WIDGET_STATE_CHANGE',
        state: 'maximized',
        timestamp: Date.now()
      }, '*');
    }
  }, [isEmbedded]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getFlexDirection = () => {
    return position?.includes('left') ? 'row-reverse' : 'row';
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50 flex items-end`}>
        <div className={`flex items-center gap-3`} style={{ flexDirection: getFlexDirection() }}>
          <div className="bg-white py-2 px-4 rounded-full shadow-lg w-fit">
            <span className="text-[#161616] text-sm whitespace-nowrap">Book your transfer with Ski-Lifts!</span>
          </div>
          <button
            onClick={handleMaximize}
            className="w-14 h-14 md:w-16 md:h-16 bg-[#1b3a4b] rounded-full shadow-lg flex items-center justify-center hover:bg-[#2b4a5b] transition-colors duration-200"
          >
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </button>
        </div>
      </div>
    );
  }

  const chatWindowClasses = isEmbedded
    ? "chat-window bg-white rounded-2xl overflow-hidden w-full h-full"
    : `chat-window fixed ${getPositionClasses()} md:max-w-[400px] w-[calc(100%-1.5rem)] max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden`;

  const chatContentClasses = isEmbedded
    ? "w-full h-full flex flex-col"
    : "w-full h-[600px] md:h-[650px] flex flex-col min-h-0";

  if (isLoading || isInitialMount) {
    return (
      <div className={chatWindowClasses}>
        <div className={chatContentClasses}>
          <div className="flex items-center justify-center h-full bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1b3a4b] rounded-full animate-spin"></div>
              <div className="text-gray-600 text-sm">Initializing chat...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={chatWindowClasses}>
      <div className={chatContentClasses}>
        {hasStartedChat ? (
          <ChatInterface 
            initialMessage={initialMessage} 
            onClose={handleBackToWelcome} 
            onMinimize={handleMinimize}
            onNewConversation={handleNewConversation}
          />
        ) : (
          <WelcomeSection onStartChat={handleStartChat} onClose={handleMinimize} />
        )}
      </div>
    </div>
  );
}

export default function ChatPopup(props: ChatPopupProps) {
  return <ChatPopupContent {...props} />;
} 