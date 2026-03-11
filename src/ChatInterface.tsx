'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ScriptStep } from '@/types/chat';
import scriptedConversation from '@/lib/scriptedConversation';
import FlightOption from '@/components/FlightOption';
import HotelOption from '@/components/HotelOption';
import TransferOption from '@/components/TransferOption';
import ExperienceOption from '@/components/ExperienceOption';
import TripSummary from '@/components/TripSummary';
import BookingConfirmation from '@/components/BookingConfirmation';
import BookingProcessing from '@/components/BookingProcessing';
import BookingComplete from '@/components/BookingComplete';
import { useBrowserSpeech } from '@/lib/useBrowserSpeech';
import '@/styles/TravelCards.css';

interface ChatInterfaceProps {
  initialMessage: string;
  onRestart: () => void;
}

export default function ChatInterface({ initialMessage, onRestart }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDemoComplete, setIsDemoComplete] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [waitingForCardSelect, setWaitingForCardSelect] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [speechOverlayText, setSpeechOverlayText] = useState('');
  const [speechBaseText, setSpeechBaseText] = useState('');

  const { recognition: browserRecognition, isSupported: browserSupported } = useBrowserSpeech();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom (with flex-col-reverse, scrollTop=0 is the visual bottom)
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 0;
      }
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add a message to the chat
  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...msg,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  // Stream text character-by-character, then resolve
  const streamText = useCallback((text: string, messageId: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex += 3; // 3 chars at a time for speed
        if (charIndex >= text.length) {
          charIndex = text.length;
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, content: text } : m))
          );
          resolve();
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, content: text.substring(0, charIndex) } : m
            )
          );
        }
      }, 20);
    });
  }, []);

  // Play a single step's assistant messages
  const playStep = useCallback(
    async (step: ScriptStep) => {
      setIsLoading(true);

      for (let i = 0; i < step.assistantMessages.length; i++) {
        const scriptedMsg = step.assistantMessages[i];

        // Wait for the delay
        if (scriptedMsg.delay > 0) {
          await new Promise((r) => setTimeout(r, scriptedMsg.delay));
        }

        // Determine if this message has rich content (non-card types)
        const richContent: Partial<Message> = {};
        if (scriptedMsg.tripSummary) richContent.tripSummary = scriptedMsg.tripSummary;
        if (scriptedMsg.bookingConfirmation) richContent.bookingConfirmation = scriptedMsg.bookingConfirmation;
        if (scriptedMsg.bookingProcessing) richContent.bookingProcessing = scriptedMsg.bookingProcessing;
        if (scriptedMsg.bookingComplete) richContent.bookingComplete = scriptedMsg.bookingComplete;

        const msgId = addMessage({
          role: 'assistant',
          content: '',
          ...richContent,
        });

        // Stream the text content character-by-character
        if (scriptedMsg.content) {
          setIsLoading(false);
          await streamText(scriptedMsg.content, msgId);
        }

        // Add card options one by one with staggered delays (matching B2B pattern)
        const cardArrays: { key: string; items: any[] }[] = [];
        if (scriptedMsg.flightOptions) cardArrays.push({ key: 'flightOptions', items: scriptedMsg.flightOptions });
        if (scriptedMsg.hotelOptions) cardArrays.push({ key: 'hotelOptions', items: scriptedMsg.hotelOptions });
        if (scriptedMsg.transferOptions) cardArrays.push({ key: 'transferOptions', items: scriptedMsg.transferOptions });
        if (scriptedMsg.experienceOptions) cardArrays.push({ key: 'experienceOptions', items: scriptedMsg.experienceOptions });

        for (const { key, items } of cardArrays) {
          for (const item of items) {
            await new Promise((r) => setTimeout(r, 300));
            addMessage({
              role: 'assistant',
              content: '',
              [key]: [item],
            });
          }
        }
      }

      setIsLoading(false);
    },
    [addMessage, streamText]
  );

  // Advance to next step
  const advanceScript = useCallback(
    async (userText: string) => {
      if (currentStep >= scriptedConversation.length) {
        setIsDemoComplete(true);
        addMessage({
          role: 'assistant',
          content:
            "Thanks for exploring NilgAI! This was a demo preview of our AI travel booking platform. Click 'Restart Demo' to try again.",
        });
        return;
      }

      const step = scriptedConversation[currentStep];

      // Add the scripted user message
      addMessage({
        role: 'user',
        content: step.userMessage,
      });

      // Move to next step
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);

      // Play assistant messages
      await playStep(step);

      // Check if the NEXT step requires card selection
      const nextStep = scriptedConversation[nextStepIndex];
      if (nextStep && nextStep.trigger === 'cardSelect') {
        setWaitingForCardSelect(true);
      } else {
        setWaitingForCardSelect(false);
      }
    },
    [currentStep, addMessage, playStep]
  );

  // Handle card selection
  const handleCardSelect = useCallback(
    (cardId: string) => {
      setSelectedCards((prev) => new Set(prev).add(cardId));

      // For experience cards, allow multi-select before advancing
      const lastMsgWithExperiences = [...messages].reverse().find((m) => m.experienceOptions);
      if (lastMsgWithExperiences?.experienceOptions) {
        // Don't auto-advance for experiences — wait for user to type or click more
        return;
      }

      // For other card types, advance after a short delay
      setTimeout(() => advanceScript(''), 500);
    },
    [messages, advanceScript]
  );

  // Handle experience multi-select completion (via text input)
  const handleExperiencesDone = useCallback(() => {
    advanceScript('');
  }, [advanceScript]);

  // Handle booking confirmation
  const handleBookingConfirm = useCallback(() => {
    // Remove the confirmation message
    setMessages((prev) => prev.filter((m) => !m.bookingConfirmation));
    // Advance to the next step (processing + complete)
    advanceScript('');
  }, [advanceScript]);

  const handleBookingCancel = useCallback(() => {
    addMessage({
      role: 'assistant',
      content: "No worries! Your trip details are saved. Let me know when you're ready to book.",
    });
  }, [addMessage]);

  // Handle trip summary "Book Trip" button
  const handleBookTrip = useCallback(() => {
    advanceScript('');
  }, [advanceScript]);

  // Handle user sending a message
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading || isDemoComplete) return;
      setMessage('');
      // If experiences are shown and some selected, advance on submit
      const lastMsgWithExperiences = [...messages].reverse().find((m) => m.experienceOptions);
      if (lastMsgWithExperiences && selectedCards.size > 0) {
        handleExperiencesDone();
      } else {
        advanceScript(content);
      }
    },
    [isLoading, isDemoComplete, advanceScript, messages, selectedCards, handleExperiencesDone]
  );

  // Speech recognition setup
  useEffect(() => {
    if (browserRecognition && browserSupported) {
      const rec = browserRecognition;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        if (silenceTimeout) clearTimeout(silenceTimeout);

        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText = result[0].transcript.trim();
            const updatedFinal = speechBaseText ? `${speechBaseText} ${finalText}` : finalText;
            setSpeechBaseText(updatedFinal);
            setMessage(updatedFinal);
            setSpeechOverlayText('');
          } else {
            interim += result[0].transcript.trim() + ' ';
          }
        }

        if (interim.trim() && !finalText) {
          const combinedText = speechBaseText ? `${speechBaseText} ${interim.trim()}` : interim.trim();
          setMessage(combinedText);
          setSpeechOverlayText(interim.trim());
        }

        if (event.results[event.resultIndex]?.isFinal) {
          const timeout = setTimeout(() => {
            rec.stop();
            setIsListening(false);
          }, 3000);
          setSilenceTimeout(timeout);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        setSpeechOverlayText('');
      };

      rec.onend = () => {
        setIsListening(false);
        setSpeechOverlayText('');
        if (silenceTimeout) clearTimeout(silenceTimeout);
      };

      setRecognition(rec);
      setIsSpeechSupported(true);
    }

    return () => {
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };
  }, [silenceTimeout, browserRecognition, browserSupported, speechBaseText]);

  const handleMicClick = useCallback(async () => {
    if (!isSpeechSupported || !recognition) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      if (isListening) {
        recognition.stop();
        setIsListening(false);
        setSpeechOverlayText('');
      } else {
        setSpeechOverlayText('');
        setSpeechBaseText(message);
        recognition.start();
        setIsListening(true);
      }
    } catch {
      alert('Please allow microphone access to use speech input.');
    }
  }, [isSpeechSupported, recognition, isListening, message]);

  // Initialize with first message
  useEffect(() => {
    if (!hasInitialized.current && initialMessage) {
      hasInitialized.current = true;
      advanceScript(initialMessage);
    }
  }, [initialMessage, advanceScript]);

  // Render a single message
  const renderMessage = (msg: Message) => {
    const isUser = msg.role === 'user';
    const hasCards = msg.flightOptions || msg.hotelOptions || msg.transferOptions
      || msg.experienceOptions || msg.tripSummary || msg.bookingConfirmation
      || msg.bookingProcessing || msg.bookingComplete;

    return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={hasCards ? 'w-[90%]' : 'max-w-[90%]'}>
          {/* Text content */}
          {msg.content && (
            <div
              className={`text-sm leading-normal whitespace-pre-wrap rounded-lg px-4 py-2 ${
                isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          )}

          {/* Flight options */}
          {msg.flightOptions && (
            <div>
              {msg.flightOptions.map((flight, i) => (
                <FlightOption
                  key={flight.id}
                  data={flight}
                  onSelect={() => handleCardSelect(flight.id)}
                  selected={selectedCards.has(flight.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Hotel options */}
          {msg.hotelOptions && (
            <div>
              {msg.hotelOptions.map((hotel, i) => (
                <HotelOption
                  key={hotel.id}
                  data={hotel}
                  onSelect={() => handleCardSelect(hotel.id)}
                  selected={selectedCards.has(hotel.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Transfer options */}
          {msg.transferOptions && (
            <div>
              {msg.transferOptions.map((transfer, i) => (
                <TransferOption
                  key={transfer.id}
                  data={transfer}
                  onSelect={() => handleCardSelect(transfer.id)}
                  selected={selectedCards.has(transfer.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Experience options */}
          {msg.experienceOptions && (
            <div>
              {msg.experienceOptions.map((exp, i) => (
                <ExperienceOption
                  key={exp.id}
                  data={exp}
                  onSelect={() => handleCardSelect(exp.id)}
                  selected={selectedCards.has(exp.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Trip summary */}
          {msg.tripSummary && (
            <div>
              <TripSummary data={msg.tripSummary} onBook={handleBookTrip} />
            </div>
          )}

          {/* Booking confirmation */}
          {msg.bookingConfirmation && (
            <div>
              <BookingConfirmation
                data={msg.bookingConfirmation}
                onConfirm={handleBookingConfirm}
                onCancel={handleBookingCancel}
              />
            </div>
          )}

          {/* Booking processing */}
          {msg.bookingProcessing && (
            <div>
              <BookingProcessing />
            </div>
          )}

          {/* Booking complete */}
          {msg.bookingComplete && (
            <div>
              <BookingComplete data={msg.bookingComplete} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-2 flex flex-col-reverse"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {[...messages].reverse().map(renderMessage)}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 w-full mt-0 mb-4 bg-white">
        {isDemoComplete ? (
          <button
            onClick={onRestart}
            className="w-full py-3 bg-[#1b3a4b] text-white font-semibold rounded-xl
                       hover:-translate-y-px hover:shadow-lg transition-all duration-200 min-h-[48px]"
          >
            Restart Demo
          </button>
        ) : (
          <div className="rounded-xl border border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.05)] mx-4">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                const newText = e.target.value;
                setMessage(newText);
                if (!newText) {
                  setSpeechBaseText('');
                  setSpeechOverlayText('');
                } else {
                  setSpeechBaseText(newText);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(message);
                }
              }}
              placeholder={isListening ? 'Listening...' : isLoading ? 'Thinking...' : 'Ask a follow up...'}
              disabled={isLoading}
              rows={2}
              className="w-full pt-3 pb-1.5 px-4 bg-white rounded-t-xl text-gray-800
                         focus:outline-none focus:ring-0 placeholder:text-gray-400 resize-none
                         disabled:opacity-50"
              style={{ fontSize: '16px' }}
            />
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
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Click to start voice input"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleSendMessage(message)}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors
                               disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
