'use client';

import { useState, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import BadgesSection from './BadgesSection';
import { useBrowserSpeech } from './lib/useBrowserSpeech';

interface WelcomeSectionProps {
  onStartChat: (message: string) => void;
}

const suggestions = [
  { icon: '🏨', text: 'Find me a hotel', message: 'Help me find a hotel for my next trip' },
  { icon: '✈️', text: 'Book a flight', message: 'I need to book a flight' },
  { icon: '🚗', text: 'Arrange a transfer', message: 'I need an airport transfer' },
  { icon: '🎯', text: 'Find experiences', message: 'What experiences can you help me find?' },
];

export default function WelcomeSection({ onStartChat }: WelcomeSectionProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [, setFinalTranscript] = useState('');

  // Add state for better speech UX
  const [speechOverlayText, setSpeechOverlayText] = useState('');
  const [speechBaseText, setSpeechBaseText] = useState('');

  // Use browser speech service
  const { recognition: browserRecognition, isSupported: browserSupported } = useBrowserSpeech();

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const lineHeight = 24;
    const paddingY = 20;
    const minHeight = 80;

    textarea.style.height = 'auto';

    let finalHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), lineHeight * 5 + paddingY);
    textarea.style.height = `${finalHeight}px`;

    textarea.scrollTop = textarea.scrollHeight;
  };

  const toSentenceCase = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = toSentenceCase(e.target.value);
    setMessage(newText);
    if (!newText) {
      setFinalTranscript('');
      setSpeechBaseText('');
      setSpeechOverlayText('');
    } else {
      setSpeechBaseText(newText);
      setFinalTranscript(newText);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (window.visualViewport) {
        window.scrollTo(0, 0);
      }
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
      }
    }, 300);
  };

  useEffect(() => {
    if (browserRecognition && browserSupported) {
      const rec = browserRecognition;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }

        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText = result[0].transcript.trim();
            const updatedFinal = speechBaseText ? `${speechBaseText} ${finalText}` : finalText;
            setFinalTranscript(updatedFinal);
            setSpeechBaseText(updatedFinal);
            setMessage(toSentenceCase(updatedFinal));
            setSpeechOverlayText('');
          } else {
            interim += result[0].transcript.trim() + ' ';
          }
        }

        if (interim.trim() && !finalText) {
          const combinedText = speechBaseText ? `${speechBaseText} ${interim.trim()}` : interim.trim();
          setMessage(toSentenceCase(combinedText));
          setSpeechOverlayText(interim.trim());
        }

        setTimeout(() => {
          const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
          if (textarea) {
            textarea.scrollTop = textarea.scrollHeight;
          }
        }, 0);

        if (event.results[event.resultIndex] && event.results[event.resultIndex].isFinal) {
          const timeout = setTimeout(() => {
            if (rec) {
              rec.stop();
              setIsListening(false);
            }
          }, 3000);
          setSilenceTimeout(timeout);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechOverlayText('');
        if (event.error === 'not-allowed') {
          alert('Microphone access is required for speech input. Please check your browser settings and permissions.');
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setSpeechOverlayText('');
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }
      };

      setRecognition(rec);
      setIsSpeechSupported(true);
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
      }
    };
  }, [silenceTimeout, browserRecognition, browserSupported, speechBaseText]);

  const handleMicClick = async () => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      if (recognition) {
        if (isListening) {
          recognition.stop();
          setIsListening(false);
          setSpeechOverlayText('');
        } else {
          try {
            setSpeechOverlayText('');
            setSpeechBaseText(message);
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
      alert('Please allow microphone access to use speech input. Check your browser settings if the permission dialog doesn\'t appear.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message);
    }
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
    <div className="flex flex-col h-full px-6 pt-2 pb-10 antialiased relative">
      <div className="mb-2">
        <div className="flex items-center justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nilgai-logo.svg"
            alt="NilgAI"
            width={240}
            height={76}
            className="h-20"
          />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mt-4 hidden">
          AI-powered travel booking.
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
                onFocus={() => {}}
                onBlur={handleBlur}
                placeholder={isListening ? "Listening..." : "I'm Jess, your AI travel assistant. Ask me about flights, hotels, transfers, and experiences."}
                className="w-full pt-3 pb-2 px-4 text-sm bg-white rounded-xl focus:outline-none focus:ring-0 focus:border-none placeholder:text-gray-400 resize-none overflow-y-auto transition-height duration-200 leading-relaxed border-none outline-none"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E5E7EB transparent',
                  minHeight: '90px',
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  overflowAnchor: 'auto',
                  overflowY: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  touchAction: 'auto',
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
                      title="Click to add more with voice"
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
                  title="Click to start voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <SuggestionButton
            key={s.text}
            icon={s.icon}
            text={s.text}
            onClick={() => onStartChat(s.message)}
          />
        ))}
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
      className="px-3 py-1.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-500 flex items-center gap-2 font-medium"
    >
      <span className="text-base">{icon}</span>
      {text}
    </button>
  );
}
