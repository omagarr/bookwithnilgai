// API service for communicating with the backend
import config from '../config';

// Add debug logging if available
const debugLog = (message: string) => {
  if (typeof window !== 'undefined' && window.debugChatWidget) {
    window.debugChatWidget.log(message);
  }
  // Removed console.log for production
};

// Log the config for debugging
debugLog(`API config: ${JSON.stringify(config)}`);

// Determine the API URL based on config and URL parameters
const API_URL = typeof window !== 'undefined' 
  ? (() => {
      // Check if API URL is passed in the URL parameters
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const apiUrlParam = urlParams.get('apiUrl');
        if (apiUrlParam) {
          debugLog(`Using API URL from URL parameter: ${apiUrlParam}`);
          return apiUrlParam;
        }
      }
      // Fall back to config
      debugLog(`Using API URL from config: ${config.apiUrl}`);
      return config.apiUrl;
    })()
  : config.apiUrl; // In server context, just use config

debugLog(`Final API_URL: ${API_URL}`);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationHistory {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    transferOption?: any;
  }>;
  sessionId: string | null;
  lastActivity?: string;
  quotes?: Array<{
    id: string;
    quoteNumber: number;
    bookingData: any;
    transferOptions: any[];
    bookingUrl?: string;
    status: 'active' | 'superseded' | 'booked';
    createdAt: string;
    lastUpdated: string;
  }>;
  activeQuote?: {
    id: string;
    quoteNumber: number;
    bookingData: any;
    transferOptions: any[];
    bookingUrl?: string;
    status: 'active' | 'superseded' | 'booked';
    createdAt: string;
    lastUpdated: string;
  } | null;
  hasExistingConversation?: boolean;
  bookingData?: any;
}

export interface ChatResponse {
  text: string;
  sessionId: string;
  error?: string;
  messages?: string[];
  transferOptions?: any[];
  bookingUrl?: string;
  flightTimingNote?: string;
  shouldShowTransferOptions?: boolean;
  followUpMessage?: string;
  bookingData?: any;
}

/**
 * Stream a message to the AI backend (simulated streaming for better UX)
 * Uses regular POST endpoint but streams the response character-by-character
 * @param messages Previous conversation history
 * @param sessionId Optional session ID for conversation continuity
 * @param onChunk Callback for each streamed chunk
 * @param onComplete Callback when streaming completes
 * @param onError Callback for errors
 * @returns AbortController to cancel the stream
 */
export function streamMessage(
  messages: ChatMessage[],
  sessionId?: string,
  onChunk?: (chunk: string) => void,
  onComplete?: (data: ChatResponse) => void,
  onError?: (error: Error) => void,
): AbortController {
  const abortController = new AbortController();
  
  // Use the regular sendMessage endpoint and simulate streaming
  (async () => {
    try {
      const response = await sendMessage(messages, sessionId);
      
      // Simulate streaming by sending text character by character
      const text = response.text || '';
      const chunkSize = 5; // Characters per chunk
      
      for (let i = 0; i < text.length; i += chunkSize) {
        if (abortController.signal.aborted) break;
        
        const chunk = text.slice(i, i + chunkSize);
        onChunk?.(chunk);
        
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // Send complete response
      onComplete?.(response);
    } catch (error) {
      console.error('Streaming error:', error);
      onError?.(error as Error);
    }
  })();

  return abortController;
}

/**
 * Send a message to the AI backend (LangChain + Azure GPT-5-mini)
 * Non-streaming fallback
 * @param messages Previous conversation history
 * @param sessionId Optional session ID for conversation continuity
 * @returns Promise with the AI response
 */
export async function sendMessage(messages: ChatMessage[], sessionId?: string): Promise<ChatResponse> {
  try {
    // Get the latest user message
    const latestUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!latestUserMessage) {
      throw new Error('No user message found');
    }
    
    // Generate a unique user ID or get from localStorage
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = `user_${Date.now()}`;
      localStorage.setItem('chatUserId', userId);
    }
    
    // Removed debugging console.log
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        sessionId,
        message: latestUserMessage.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from API:', errorData);
      throw new Error(errorData.message || errorData.error || 'Failed to get response from AI');
    }

    const data = await response.json();
    // Removed debugging console.log
    
    if (data.error) {
      console.warn('Backend returned an error:', data.error);
    }
    
    return {
      text: data.text || (data.followUpMessage ? '' : 'Sorry, I could not generate a response.'),
      sessionId: data.sessionId || '',
      error: data.error,
      messages: data.messages,
      transferOptions: data.transferOptions,
      bookingUrl: data.bookingUrl,
      flightTimingNote: data.flightTimingNote,
      shouldShowTransferOptions: data.shouldShowTransferOptions,
      followUpMessage: data.followUpMessage,
      bookingData: data.bookingData
    };
  } catch (error) {
    console.error('Error sending message to AI backend:', error);
    return {
      text: error instanceof Error 
        ? `Sorry, I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`
        : 'Sorry, I encountered an error while processing your request. Please try again later.',
      sessionId: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      flightTimingNote: '',
      shouldShowTransferOptions: false,
      followUpMessage: ''
    };
  }
}

/**
 * Get conversation history for a user
 * @param userId User ID
 * @param sessionId Optional session ID
 * @returns Promise with conversation history
 */
export async function getConversationHistory(userId?: string, sessionId?: string): Promise<ConversationHistory | null> {
  try {
    // Use stored userId if not provided
    const actualUserId = userId || localStorage.getItem('chatUserId');
    if (!actualUserId) {
      return null;
    }

    const url = sessionId 
      ? `${API_URL}/api/chat/history/${actualUserId}?sessionId=${sessionId}`
      : `${API_URL}/api/chat/history/${actualUserId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error fetching conversation history:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return null;
  }
}

/**
 * Check for existing conversation without creating new database entries (SAFE for widget load)
 * @param userId User ID
 * @param sessionId Optional session ID
 * @returns Promise with existing conversation or null
 */
export async function checkExistingConversation(userId?: string, sessionId?: string): Promise<ConversationHistory | null> {
  try {
    // Use stored userId if not provided
    const actualUserId = userId || localStorage.getItem('chatUserId');
    if (!actualUserId) {
      return null;
    }

    const url = sessionId 
      ? `${API_URL}/api/chat/check-existing/${actualUserId}?sessionId=${sessionId}`
      : `${API_URL}/api/chat/check-existing/${actualUserId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error checking existing conversation:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    // If no existing conversation, return null
    if (!data.hasExistingConversation) {
      return null;
    }
    
    return {
      messages: data.messages,
      sessionId: data.sessionId,
      lastActivity: data.lastActivity,
      quotes: data.quotes || [],
      activeQuote: data.activeQuote || null,
      hasExistingConversation: data.hasExistingConversation,
      bookingData: data.bookingData || null,
    };
  } catch (error) {
    console.error('Error checking existing conversation:', error);
    return null;
  }
}

/**
 * Create a new conversation for a user
 * @param userId User ID
 * @returns Promise with new conversation data
 */
export async function createNewConversation(userId?: string): Promise<{ sessionId: string; messages: any[]; createdAt: string } | null> {
  try {
    // Use stored userId if not provided
    const actualUserId = userId || localStorage.getItem('chatUserId');
    if (!actualUserId) {
      return null;
    }

    const response = await fetch(`${API_URL}/api/chat/new-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: actualUserId
      }),
    });

    if (!response.ok) {
      console.error('Error creating new conversation:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating new conversation:', error);
    return null;
  }
} 