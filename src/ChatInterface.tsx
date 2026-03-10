'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/types/chat';
import MessageInput from './MessageInput';
import { X, Send, Mic, Square } from 'lucide-react';
import { initialResponses } from '@/lib/chat/responses';
import TransferOption from './TransferOption';
import './styles/TransferOption.css';
import { v4 as uuidv4 } from 'uuid';
import { streamMessage, sendMessage, ChatMessage, getConversationHistory, checkExistingConversation } from '@/lib/api';
import { useBackendSpeech } from './lib/useBackendSpeech';
import { parseMarkdown } from '@/utils/markdown';

// Global tracking to prevent duplicate API calls from React Strict Mode
const globalApiCallTracker = new Map<string, number>();

interface ChatInterfaceProps {
  initialMessage: string;
  onClose: () => void;
  onMinimize: () => void;
  onNewConversation?: () => void;
  hideMinimizeButton?: boolean; // Optional prop to hide minimize button for embed mode
}

const handleTransferOptionClick = (optionTitle: string, basketId?: string, quoteStatus?: string, bookingUrl?: string) => {
  // Use the bookingUrl from backend response if available, otherwise show error
  if (!bookingUrl) {
    console.error('No booking URL provided - cannot open booking link');
    alert('Sorry, this booking option is not available. Please try another option or contact support.');
    return;
  }
  
  // Open the deep link URL provided by the backend
  window.open(bookingUrl, '_blank');
};

// Helper function to handle transfer options rendering with split message support
const handleTransferOptionsRendering = (
  data: any,
  streamingMessageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void
) => {
  const splitMarker = '|||TRANSFER_OPTIONS|||';

  // Use data.text (not content!) - ChatResponse has 'text' field
  const messageContent = data.text || data.content || '';
  const hasSplitMarker = messageContent.includes(splitMarker);

  let beforeBubbles = '';
  let afterBubbles = '';

  if (hasSplitMarker) {
    [beforeBubbles, afterBubbles] = messageContent.split(splitMarker);
  }

  if (hasSplitMarker) {
    // Update the streaming message to show only the "before bubbles" text
    setMessages(prev => prev.map(msg =>
      msg.id === streamingMessageId
        ? { ...msg, content: beforeBubbles.trim() }
        : msg
    ));

    // Render transfer option bubbles first
    setTimeout(() => {
      data.transferOptions.forEach((option: any, optionIndex: number) => {
        setTimeout(() => {
          const frontendOption = {
            image: getTransferOptionImage(option.title, option.badge, option.transferTypeCode),
            title: option.title,
            badge: {
              text: option.badge || '✨ Available',
              type: getBadgeType(option.badge) as 'eco' | 'premium' | 'budget',
            },
            feature: option.description,
            fullFeature: option.fullDescription,
            pricing: {
              total: option.price,
              perPerson: option.title.toLowerCase().includes('shared') ? option.price : undefined,
              isLimited: option.isLimited || false,
            },
            capacity: parseCapacity(option.capacity),
            luggage: getLuggageCount(option, data.bookingData),
            skis_snowboards: 0,
            buttonType: (option.isLimited ? 'enquire' : 'book') as 'book' | 'enquire',
            onButtonClick: () => handleTransferOptionClick(option.title, option.basketId, option.quoteStatus, option.bookingUrl)
          };

          addMessage({
            role: 'assistant',
            content: '',
            transferOption: frontendOption
          });
        }, optionIndex * 300);
      });

      // After all bubbles are rendered, add the discount message with fade-in
      if (afterBubbles && afterBubbles.trim()) {
        const totalBubblesDelay = data.transferOptions.length * 300;
        setTimeout(() => {
          const discountMessageId = uuidv4();
          setMessages(prev => [...prev, {
            id: discountMessageId,
            role: 'assistant',
            content: afterBubbles.trim(),
            isHidden: true,
            timestamp: Date.now()
          }]);

          // Fade in after a brief moment
          setTimeout(() => {
            setMessages(prev => prev.map(msg =>
              msg.id === discountMessageId
                ? { ...msg, isHidden: false }
                : msg
            ));
          }, 100);
        }, totalBubblesDelay + 300);
      }
    }, 300);
  } else {
    // Fallback: No split marker, use original behavior
    setTimeout(() => {
      data.transferOptions.forEach((option: any, optionIndex: number) => {
        setTimeout(() => {
          const frontendOption = {
            image: getTransferOptionImage(option.title, option.badge, option.transferTypeCode),
            title: option.title,
            badge: {
              text: option.badge || '✨ Available',
              type: getBadgeType(option.badge) as 'eco' | 'premium' | 'budget',
            },
            feature: option.description,
            fullFeature: option.fullDescription,
            pricing: {
              total: option.price,
              perPerson: option.title.toLowerCase().includes('shared') ? option.price : undefined,
              isLimited: option.isLimited || false,
            },
            capacity: parseCapacity(option.capacity),
            luggage: getLuggageCount(option, data.bookingData),
            skis_snowboards: 0,
            buttonType: (option.isLimited ? 'enquire' : 'book') as 'book' | 'enquire',
            onButtonClick: () => handleTransferOptionClick(option.title, option.basketId, option.quoteStatus, option.bookingUrl)
          };

          addMessage({
            role: 'assistant',
            content: '',
            transferOption: frontendOption
          });
        }, optionIndex * 300);
      });
    }, 300);
  }
};

// Helper functions for transfer option mapping
const getTransferOptionImage = (title: string, badge?: string, transferTypeCode?: string): string => {
  const titleLower = title.toLowerCase();
  
  // ABSOLUTE CORRECT MATCHES ONLY - each image maps to exactly ONE transfer type
  
  // eco-luxury.webp → ONLY ECLX (Eco Luxury)
  if (titleLower === 'eco luxury') return '/transfer-images/eco-luxury.webp';
  
  // eco-private.webp → ONLY ECOP (Eco Private)  
  if (titleLower === 'eco private') return '/transfer-images/eco-private.webp';
  
  // luxury-car.webp → ONLY LIMO (Luxury Car)
  if (titleLower === 'luxury car') return '/transfer-images/luxury-car.webp';
  
  // luxury-minibus.webp → ONLY EXEC (Luxury Minibus)
  if (titleLower === 'luxury minibus') return '/transfer-images/luxury-minibus.webp';
  
  // shared-transfer.webp → ONLY SHAR (Shared Transfer)
  if (titleLower === 'shared transfer') return '/transfer-images/shared-transfer.webp';
  
  // private-coach.webp → ONLY COAC (Private Coach)
  if (titleLower === 'private coach') return '/transfer-images/private-coach.webp';
  
  // private.webp → ONLY PRIV (Private Transfer with "Most Popular" badge)
  if (titleLower === 'private transfer' && badge?.includes('Most Popular')) {
    return '/transfer-images/private.webp';
  }
  
  // schedule-shuttle.webp → ONLY SHTL (Shuttle)
  if (titleLower === 'shuttle') return '/transfer-images/schedule-shuttle.webp';
  
  // Everything else (32 other transfer types including PTNS) gets undefined.webp
  return '/transfer-images/undefined.webp';
};

const getBadgeType = (badge: string): 'eco' | 'premium' | 'budget' => {
  const badgeLower = badge?.toLowerCase() || '';
  if (badgeLower.includes('eco') || badgeLower.includes('friendly')) return 'eco';
  if (badgeLower.includes('premium') || badgeLower.includes('luxury')) return 'premium';
  if (badgeLower.includes('budget') || badgeLower.includes('shared')) return 'budget';
  return 'premium'; // default
};

const parseCapacity = (capacity: string | undefined): number | null => {
  // Handle undefined or null capacity
  if (!capacity) return null;
  
  // First try to extract vehicle capacity from parentheses (e.g., "2 passengers (vehicle seats 16)" -> 16)
  const vehicleCapacityMatch = capacity.match(/vehicle seats (\d+)/);
  if (vehicleCapacityMatch) {
    return parseInt(vehicleCapacityMatch[1]);
  }
  
  // Fallback: extract any number from the string
  const match = capacity.match(/(\d+)/);
  return match ? parseInt(match[1]) : null; // Return null if no capacity info available
};

const getLuggageCount = (option: any, bookingData: any): number => {
  return bookingData?.luggage ?? 0;
};

// Convert backend transfer option to frontend format
const convertBackendOptionToFrontend = (backendOption: any, bookingData?: any) => {
  return {
    image: getTransferOptionImage(backendOption.title, backendOption.badge, backendOption.transferTypeCode),
    title: backendOption.title,
    badge: {
      text: backendOption.badge,
      type: getBadgeType(backendOption.badge),
    },
    feature: backendOption.description,
    fullFeature: backendOption.fullDescription, // Add full description for tooltip
    pricing: {
      total: backendOption.price,
      perPerson: backendOption.pricePerPerson,
      isLimited: backendOption.isLimited,
    },
    capacity: parseCapacity(backendOption.capacity),
    luggage: getLuggageCount(backendOption, bookingData),
    skis_snowboards: 0, // HIDDEN: backendOption.actualSkisSnowboards || 0,
    buttonType: backendOption.isLimited ? 'enquire' as const : 'book' as const,
    features: backendOption.features || [],
  };
};

export default function ChatInterface({ initialMessage, onClose, onMinimize, onNewConversation, hideMinimizeButton = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Add state for better speech UX
  const [speechOverlayText, setSpeechOverlayText] = useState('');
  const [speechBaseText, setSpeechBaseText] = useState('');

  // Use backend speech service
  const { recognition: backendRecognition, isSupported: backendSupported } = useBackendSpeech();



  // Ref for messages container to handle auto-scroll
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      // Use setTimeout to ensure DOM has updated before scrolling
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, []);

  const addMessage = useCallback((messageContent: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...messageContent
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const adjustTextareaHeight = (text: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const lineHeight = 20;
    const paddingY = 18;
    
    textarea.style.height = 'auto';
    
    // Minimum 3 lines, maximum 5 lines
    let finalHeight = Math.min(Math.max(textarea.scrollHeight, lineHeight * 3 + paddingY), lineHeight * 5 + paddingY);
    textarea.style.height = `${finalHeight}px`;

    // Always scroll to bottom to show latest content
    textarea.scrollTop = textarea.scrollHeight;
  };

  useEffect(() => {
    adjustTextareaHeight(message);
  }, [message]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const showTransferOptions = useCallback(() => {
    // REMOVED: No more fallback transfer options
    // If backend doesn't provide transfer options, don't show any
    // Removed debugging console.log
  }, []);

  const handleFirstMessage = useCallback(async (content: string) => {
    // Check if this exact message was processed recently (within 2 seconds)
    const messageKey = `first_message_${content}`;
    const lastCallTime = globalApiCallTracker.get(messageKey);
    const now = Date.now();
    
    if (lastCallTime && (now - lastCallTime) < 2000) {
      return; // Skip duplicate API call
    }
    
    // Mark this message as being processed
    globalApiCallTracker.set(messageKey, now);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now()
    };
    
    setMessages([userMessage]);
    
    // Start streaming
    setIsStreaming(true);
    setStreamingText('');
    setIsLoading(false); // Don't show loading, we'll show streaming text instead
    
    let response: any = null;
    
    try {
      // Create a placeholder message for streaming (won't render until it has content)
      const streamingMessageId = Date.now().toString() + '_streaming';
      const streamingMessage: Message = {
        id: streamingMessageId,
        content: '',
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, streamingMessage]);
      
      // Use streaming API
      streamMessage(
        [{
          role: 'user',
          content
        }],
        sessionId || undefined,
        // onChunk callback
        (chunk: string) => {
          setStreamingText(prev => prev + chunk);
          // Update the streaming message in real-time, truncating at marker
          setMessages(prev => prev.map(msg => {
            if (msg.id === streamingMessageId) {
              const newContent = (msg.content || '') + chunk;
              const markerIndex = newContent.indexOf('|||TRANSFER_OPTIONS|||');
              // If marker found, only show content before it during streaming
              return {
                ...msg,
                content: markerIndex !== -1 ? newContent.substring(0, markerIndex) : newContent
              };
            }
            return msg;
          }));
        },
        // onComplete callback
        (data: any) => {
          setIsStreaming(false);
          setStreamingText('');
          setSessionId(data.sessionId);

          // Handle transfer options if present
          if (data.transferOptions && data.transferOptions.length > 0) {
            handleTransferOptionsRendering(data, streamingMessageId, setMessages, addMessage);
          }
        },
        // onError callback
        (error: Error) => {
          setIsStreaming(false);
          setStreamingText('');
          setIsLoading(false);
          console.error('Streaming error:', error);

          // Fall back to showing error message
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            role: 'assistant',
            timestamp: Date.now()
          };
          setMessages(prev => {
            // Remove the streaming placeholder
            const filtered = prev.filter(msg => !msg.id.includes('_streaming'));
            return [...filtered, errorMessage];
          });
        }
      );
      
      // Clean up tracker after successful processing
      setTimeout(() => globalApiCallTracker.delete(messageKey), 5000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Clean up the tracker entry on error
      globalApiCallTracker.delete(messageKey);
      
      // Fall back to static response if API fails
      const fallbackResponse: Message = {
        id: Date.now().toString(),
        content: initialResponses.default.response,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages([userMessage, fallbackResponse]);
      setIsLoading(false);
    } finally {
      // Only hide loading for single messages, multi-messages handle their own loading states
      if (!response?.messages || response.messages.length <= 1) {
        setIsLoading(false);
      }
    }
  }, [sessionId, addMessage]);

  // SAFE: Check for existing conversation on widget load (never creates DB entries)
  useEffect(() => {
    // ONLY load conversation on very first widget load (when sessionId is null)
    if (sessionId !== null) {
      console.info('[WIDGET-LOAD] SessionId exists, not loading conversation');
      return;
    }

    const checkForExistingConversation = async () => {
      try {
        const userId = localStorage.getItem('chatUserId');
        const existingConversation = await checkExistingConversation(userId || undefined, sessionId || undefined);
        
        if (existingConversation && existingConversation.messages && existingConversation.messages.length > 0) {
          // Convert database messages to frontend Message format
          // Transfer options are already saved as messages, just add click handlers
          const convertedMessages: Message[] = existingConversation.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role,
            timestamp: msg.timestamp,
            transferOption: msg.transferOption ? {
              ...convertBackendOptionToFrontend(msg.transferOption, existingConversation.bookingData),
              onButtonClick: () => handleTransferOptionClick(
                msg.transferOption.title,
                msg.transferOption.basketId,
                msg.transferOption.quoteStatus,
                msg.transferOption.bookingUrl
              )
            } : undefined
          }));

          setMessages(convertedMessages);
          setSessionId(existingConversation.sessionId);
          setIsInitialized(true);
          console.info(`[WIDGET-LOAD] Restored existing conversation with ${convertedMessages.length} messages`);
        } else {
          console.info(`[WIDGET-LOAD] No existing conversation found - showing welcome screen`);
        }
      } catch (error) {
        console.error('Error checking existing conversation:', error);
      }
    };

    checkForExistingConversation();
  }, [sessionId]);

  // Initialize with initial message if no existing chat
  useEffect(() => {
    if (!isInitialized && initialMessage && messages.length === 0) {
      handleFirstMessage(initialMessage);
      setIsInitialized(true);
    }
  }, [initialMessage, isInitialized, messages.length, handleFirstMessage]);

  const toSentenceCase = (text: string) => {
    if (!text) return text;
    // Only capitalize the first letter of the first word
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    // Use backend speech service instead of browser API
    if (backendRecognition && backendSupported) {
      const recognition = backendRecognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }

        let interim = '';
        let finalText = '';

        // Process only new results from this session
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText = result[0].transcript.trim();
            // Update final transcript and commit to main input
            const updatedFinal = speechBaseText ? `${speechBaseText} ${finalText}` : finalText;
            setFinalTranscript(updatedFinal);
            setSpeechBaseText(updatedFinal);
            setMessage(toSentenceCase(updatedFinal));
            setSpeechOverlayText(''); // Clear interim display
          } else {
            // Collect interim results
            interim += result[0].transcript.trim() + ' ';
          }
        }

        // Show interim results directly in textarea
        if (interim.trim() && !finalText) {
          const combinedText = speechBaseText ? `${speechBaseText} ${interim.trim()}` : interim.trim();
          setMessage(toSentenceCase(combinedText));
          setSpeechOverlayText(interim.trim()); // Keep for status tracking
        }

        // Simple auto-scroll to bottom
        setTimeout(() => {
          const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
          if (textarea) {
            textarea.scrollTop = textarea.scrollHeight;
          }
        }, 0);

        // Wait 3 seconds after final speech before stopping
        if (event.results[event.resultIndex] && event.results[event.resultIndex].isFinal) {
          const timeout = setTimeout(() => {
            if (recognition) {
              recognition.stop();
              setIsListening(false);
            }
          }, 3000);
          setSilenceTimeout(timeout);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechOverlayText('');
        if (event.error === 'not-allowed') {
          // Check if we're in an iframe context
          const isIframe = window.self !== window.top;
          if (isIframe) {
            alert('Microphone access is required for speech input. If you\'re seeing this in an embedded widget, the hosting website may need to allow microphone permissions. Please check your browser settings and permissions, or try using the widget on our main site.');
          } else {
            alert('Microphone access is required for speech input. Please check your browser settings and permissions.');
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechOverlayText('');
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }
      };

      setRecognition(recognition);
      setIsSpeechSupported(true);
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
      }
    };
  }, [silenceTimeout, backendRecognition, backendSupported, speechBaseText]);

  const handleMicClick = async () => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately after permission check
      
      if (recognition) {
        if (isListening) {
          recognition.stop();
          setIsListening(false);
          setSpeechOverlayText('');
        } else {
          try {
            // Reset speech states for new session
            setSpeechOverlayText('');
            setSpeechBaseText(message); // Store current text as base
            recognition.start();
            setIsListening(true);
          } catch (error) {
            console.error('Speech recognition start error:', error);
            if (error instanceof Error && error.name === 'NotAllowedError') {
              alert('Microphone access was denied. Please allow microphone access in your browser settings.');
            } else {
              alert('There was an error starting speech recognition. Please try again.');
            }
            setIsListening(false);
          }
        }
      }
    } catch (error) {
      console.error('Microphone permission denied:', error);
      // Check if we're in an iframe context
      const isIframe = window.self !== window.top;
      if (isIframe) {
        alert('Please allow microphone access to use speech input. If you\'re seeing this in an embedded widget, the hosting website needs to allow microphone permissions. You can also try using the widget on our main site at ski-lifts.nilgai.travel.');
      } else {
        alert('Please allow microphone access to use speech input. Check your browser settings if the permission dialog doesn\'t appear.');
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = toSentenceCase(e.target.value);
    setMessage(newText);
    
    // If text is manually cleared, reset all speech states
    if (!newText) {
      setFinalTranscript('');
      setSpeechBaseText('');
      setSpeechOverlayText('');
    } else {
      // Update speech base text to current manual input
      setSpeechBaseText(newText);
      setFinalTranscript(newText);
    }
  };

  const handleFocus = () => {
    // Additional focus handling if needed
  };

  const handleBlur = () => {
    // Force viewport reset on blur to prevent zoom staying after keyboard closes
    setTimeout(() => {
      if (window.visualViewport) {
        window.scrollTo(0, 0);
      }
      // Force a meta viewport update to reset zoom
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
      }
    }, 300);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);

    // Start streaming
    setIsStreaming(true);
    setStreamingText('');
    setIsLoading(false);

    let response: any = null;

    try {
      // Convert messages to format needed for API
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add new message to history
      chatHistory.push({
        role: 'user',
        content
      });
      
      // Create a placeholder message for streaming (won't render until it has content)
      const streamingMessageId = Date.now().toString() + '_streaming';
      const streamingMessage: Message = {
        id: streamingMessageId,
        content: '',
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, streamingMessage]);
      
      // Use streaming API
      streamMessage(
        chatHistory,
        sessionId || undefined,
        // onChunk callback
        (chunk: string) => {
          setStreamingText(prev => prev + chunk);
          // Update the streaming message in real-time, truncating at marker
          setMessages(prev => prev.map(msg => {
            if (msg.id === streamingMessageId) {
              const newContent = (msg.content || '') + chunk;
              const markerIndex = newContent.indexOf('|||TRANSFER_OPTIONS|||');
              // If marker found, only show content before it during streaming
              return {
                ...msg,
                content: markerIndex !== -1 ? newContent.substring(0, markerIndex) : newContent
              };
            }
            return msg;
          }));
        },
        // onComplete callback
        (data: any) => {
          setIsStreaming(false);
          setStreamingText('');
          setSessionId(data.sessionId);

          // Handle transfer options if present
          if (data.transferOptions && data.transferOptions.length > 0) {
            handleTransferOptionsRendering(data, streamingMessageId, setMessages, addMessage);
          }
        },
        // onError callback
        (error: Error) => {
          setIsStreaming(false);
          setStreamingText('');
          setIsLoading(false);
          console.error('Streaming error:', error);

          const errorMessage: Message = {
            id: Date.now().toString(),
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            role: 'assistant',
            timestamp: Date.now()
          };
          setMessages(prev => {
            const filtered = prev.filter(msg => !msg.id.includes('_streaming'));
            return [...filtered, errorMessage];
          });
        }
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      const errorResponse: Message = {
        id: uuidv4(),
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        role: 'assistant',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    } finally {
      // Only hide loading for single messages, multi-messages handle their own loading states
      if (!response?.messages || response.messages.length <= 1) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage(message);
        setMessage('');
      }
    }
  };

  const handleNewConversation = async () => {
    try {
      console.info('[NEW-CONVERSATION] Clearing user data and reloading');
      
      // Clear the userId so it gets treated as a completely new user
      localStorage.removeItem('chatUserId');
      
      // Reload the page to start completely fresh
      window.location.reload();
      
    } catch (error) {
      console.error('Error clearing data and reloading:', error);
    }
  };

  const renderMessage = (message: Message) => {
    try {
      if (message.transferOption) {
        return (
          <div className="flex justify-start mb-2">
            <div className="max-w-[85%] w-full">
              <TransferOption {...message.transferOption} />
            </div>
          </div>
        );
      }
      
      return (
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2 transition-opacity duration-500 ${
          message.isHidden ? 'opacity-0' : 'opacity-100'
        }`}>
          <div
            className={`rounded-lg px-4 py-2 max-w-[85%] ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className={`text-sm leading-normal whitespace-pre-wrap ${
              message.isSupersededSummary ? 'italic text-gray-600' : ''
            }`}>
              {parseMarkdown(message.content, message.role)}
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering message:', error);
      // Return a fallback message if rendering fails
      return (
        <div className="flex justify-start mb-2">
          <div className="rounded-lg px-4 py-2 max-w-[85%] bg-red-100 text-red-800">
            <p className="text-sm">Error displaying message</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header section */}
      <div className="flex items-center px-4 py-3 border-b">
        <div className="flex items-center flex-1">
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button 
                onClick={handleNewConversation}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                aria-label="Start new conversation"
                title="Start new conversation"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <img
              src="/Jess @ NilgAI.png"
              alt="Jess from NilgAI"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900 ml-2">Jess @ NilgAI</span>
          </div>
        </div>

        {!hideMinimizeButton && (
          <button 
            onClick={onMinimize}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Minimize chat"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Messages section */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-2 flex flex-col-reverse"
      >
        {(isLoading || (isStreaming && streamingText === '')) && (
          <div className="flex mb-2 justify-start">
            <div className="rounded-lg px-4 py-3.5 max-w-[85%] bg-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        {[...messages].reverse().map((message) => {
          // Skip rendering empty assistant messages (they're placeholders for streaming)
          if (message.role === 'assistant' && !message.content && !message.transferOption) {
            return null;
          }
          return (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          );
        })}
      </div>

      {/* Input section - matching WelcomeSection styling */}
      <div className="w-full mt-0 mb-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (message.trim()) {
            handleSendMessage(message);
            setMessage('');
          }
        }} className="relative">
          <div className="rounded-xl border border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.05)] mx-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isListening ? "Listening..." : "Ask a follow up..."}
                className="w-full pt-3 pb-1.5 px-4 bg-white rounded-xl focus:outline-none focus:ring-0 focus:border-none placeholder:text-gray-400 resize-none overflow-y-auto transition-height duration-200 leading-5 border-none outline-none"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E5E7EB transparent',
                  minHeight: '78px', // 3 lines: 20px * 3 + 18px padding = 78px
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  overflowAnchor: 'auto',
                  overflowY: 'auto',
                  fontSize: (() => {
                    // Check actual browser window width, not container width
                    const browserWidth = typeof window !== 'undefined' ? window.screen.width : 0;
                    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
                    // Use desktop font size if browser window is wide (desktop) or if window width > 600
                    const isDesktopBrowser = browserWidth > 1000 || windowWidth > 600;
                    return isDesktopBrowser ? '14px' : '16px';
                  })() // 14px on desktop, 16px on mobile to prevent iOS zoom
                }}
              />
            </div>
            
            <div className="flex items-center justify-end gap-1 pt-1 pb-2 px-3 bg-white rounded-b-xl min-h-[36px]">
              {isListening ? (
                <div className="flex items-center gap-2 h-[32px]">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">
                      {speechOverlayText ? 'Processing...' : 'Listening...'}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleMicClick}
                    className="p-1.5 rounded-lg text-[#161616] hover:bg-gray-100 transition-colors"
                    title="Click to stop recording"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#161616] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                  </button>
                </div>
              ) : (
                <>
                  {isSpeechSupported && (
                    <button 
                      type="button"
                      onClick={handleMicClick}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                      title="Click to start voice input - speak naturally, I&apos;ll wait for you to finish"
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'text-red-500' : ''}`} />
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => {
                      if (message.trim()) {
                        handleSendMessage(message);
                        setMessage('');
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}