'use client';

import { useState, useEffect } from 'react';
import { Send, Mic, Square, X } from 'lucide-react';
import Image from 'next/image';
import BadgesSection from './BadgesSection';
import Logo from './Logo';
import { useBackendSpeech } from './lib/useBackendSpeech';

interface WelcomeSectionProps {
  onStartChat: (message: string) => void;
  onClose?: () => void;
  hideCloseButton?: boolean; // Optional prop to hide close button for embed mode
}

export default function WelcomeSection({ onStartChat, onClose, hideCloseButton = false }: WelcomeSectionProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [initialText, setInitialText] = useState('');

  // Add state for better speech UX
  const [speechOverlayText, setSpeechOverlayText] = useState('');
  const [speechBaseText, setSpeechBaseText] = useState('');

  // Use backend speech service
  const { recognition: backendRecognition, isSupported: backendSupported } = useBackendSpeech();

  useEffect(() => {
    adjustTextareaHeight(message);
  }, [message]);

  const adjustTextareaHeight = (text: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const lineHeight = 20;
    const paddingY = 18;
    
    textarea.style.height = 'auto';
    
    // Keep fixed height - don't expand beyond design constraints
    let finalHeight = Math.min(Math.max(textarea.scrollHeight, lineHeight * 2 + paddingY), lineHeight * 5 + paddingY);
    textarea.style.height = `${finalHeight}px`;

    // Always scroll to bottom to show latest content
    textarea.scrollTop = textarea.scrollHeight;
  };

  const toSentenceCase = (text: string) => {
    if (!text) return text;
    // Only capitalize the first letter of the first word
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = toSentenceCase(e.target.value);
    setMessage(newText);
    // If text is manually cleared, reset all speech states
    if (!newText) {
      setFinalTranscript('');
      setSpeechBaseText('');
      setSpeechOverlayText('');
      setInitialText('');
    } else {
      // Update speech base text to current manual input
      setSpeechBaseText(newText);
      setFinalTranscript(newText);
      setInitialText(newText);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    let message = '';
    switch (suggestion) {
      case 'Range of cars':
        message = 'What types of vehicles do you offer for ski resort transfers?';
        break;
      case 'Transfer time':
        message = 'How long do airport transfers to ski resorts typically take?';
        break;
      case 'Need info':
        message = 'Why should I choose your ski transfer service over others?';
        break;
      case 'Get a quote':
        message = 'I need a quote for airport transfer to a ski resort';
        break;
    }
    setMessage(message);
    onStartChat(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onStartChat(message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full px-6 py-10 antialiased relative">
      {!hideCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/Your Logo Here.png"
            alt="Your Logo"
            width={150}
            height={97}
          />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mt-4 hidden">
          Airport Transfers to Ski Resorts.
        </p>
      </div>

      <div className="w-full mb-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="rounded-xl border border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
            <div className="relative">
              <textarea
                value={message}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isListening ? "Listening..." : "I’m Jess, your AI travel assistant. Ask me about transfers."}
                className="w-full pt-3 pb-1.5 px-4 text-base bg-white rounded-xl focus:outline-none focus:ring-0 focus:border-none placeholder:text-gray-400 resize-none overflow-y-auto transition-height duration-200 leading-5 border-none outline-none"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E5E7EB transparent',
                  height: '58px',
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
              ) : message.trim() && (
                <>
                  {isSpeechSupported && (
                    <button 
                      type="button"
                      onClick={handleMicClick}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                      title="Click to add more with voice - speak naturally, I&apos;ll wait for you to finish"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
              
              {/* Show only mic when no text */}
              {!message.trim() && !isListening && isSpeechSupported && (
                <button 
                  type="button"
                  onClick={handleMicClick}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                  title="Click to start voice input - speak naturally, I&apos;ll wait for you to finish"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 justify-start">
        <SuggestionButton 
          icon="💵" 
          text="Get a transfer quote" 
          onClick={() => handleSuggestionClick("Get a quote")} 
        />
        <SuggestionButton 
          icon="ℹ️" 
          text="Why choose us?" 
          onClick={() => handleSuggestionClick("Need info")} 
        />
        <SuggestionButton 
          icon="🚗" 
          text="Vehicle Types" 
          onClick={() => handleSuggestionClick("Range of cars")} 
        />
        <SuggestionButton 
          icon="🕒" 
          text="Transfer Time" 
          onClick={() => handleSuggestionClick("Transfer time")} 
        />
      </div>

      <BadgesSection />

      <div className="text-center mt-4">
        <a href="https://nilgai.ai/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Powered by NilgAI</a>
      </div>
    </div>
  );
}

function SuggestionButton({ 
  icon, 
  text, 
  onClick 
}: { 
  icon: string; 
  text: string; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-500 flex items-center gap-2 font-medium"
    >
      <span className="text-base">{icon}</span>
      {text}
    </button>
  );
} 