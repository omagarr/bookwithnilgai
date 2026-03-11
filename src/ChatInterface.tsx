'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, Mic, ExternalLink, Globe, X } from 'lucide-react';
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
  // Restore persisted state from localStorage
  const savedState = typeof window !== 'undefined'
    ? (() => {
        try {
          const raw = localStorage.getItem('chatState');
          return raw ? JSON.parse(raw) : null;
        } catch { return null; }
      })()
    : null;

  const [messages, setMessages] = useState<Message[]>(savedState?.messages ?? []);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(savedState?.currentStep ?? 0);
  const [isDemoComplete, setIsDemoComplete] = useState(savedState?.isDemoComplete ?? false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(
    new Set(savedState?.selectedCards ?? [])
  );
  const [waitingForCardSelect, setWaitingForCardSelect] = useState(savedState?.waitingForCardSelect ?? false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [speechOverlayText, setSpeechOverlayText] = useState('');
  const [speechBaseText, setSpeechBaseText] = useState('');
  const [expandedFlights, setExpandedFlights] = useState<Set<string>>(
    new Set(savedState?.expandedFlights ?? [])
  );
  const [showCheckout, setShowCheckout] = useState(false);

  const { recognition: browserRecognition, isSupported: browserSupported } = useBrowserSpeech();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(savedState?.messages?.length > 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist conversation state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chatState', JSON.stringify({
        messages,
        currentStep,
        isDemoComplete,
        selectedCards: Array.from(selectedCards),
        waitingForCardSelect,
        expandedFlights: Array.from(expandedFlights),
      }));
    } catch { /* ignore quota errors */ }
  }, [messages, currentStep, isDemoComplete, selectedCards, waitingForCardSelect, expandedFlights]);

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
          await new Promise((r) => setTimeout(r, 300));
          addMessage({
            role: 'assistant',
            content: '',
            [key]: items,
          });
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
    (cardId: string, siblingIds?: string[]) => {
      setSelectedCards((prev) => {
        const next = new Set(prev);
        // If siblings provided, deselect them first (single-select within group)
        if (siblingIds) {
          for (const id of siblingIds) {
            next.delete(id);
          }
        }
        next.add(cardId);
        return next;
      });
    },
    []
  );

  // Handle card deselection
  const handleCardDeselect = useCallback(
    (cardId: string) => {
      setSelectedCards((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
    },
    []
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
            <div className="space-y-2 mt-2">
              {(expandedFlights.has(msg.id) ? msg.flightOptions : msg.flightOptions.slice(0, 3)).map((flight, i) => (
                <FlightOption
                  key={flight.id}
                  data={flight}
                  onSelect={() => handleCardSelect(flight.id, msg.flightOptions!.map(f => f.id))}
                  onDeselect={() => handleCardDeselect(flight.id)}
                  selected={selectedCards.has(flight.id)}
                  animationDelay={i * 150}
                />
              ))}
              {msg.flightOptions.length > 3 && !expandedFlights.has(msg.id) && (
                <button
                  onClick={() => setExpandedFlights(prev => new Set(prev).add(msg.id))}
                  className="w-full py-2 text-sm font-medium text-[#0e3b43] bg-[#0e3b43]/10 rounded-xl hover:bg-[#0e3b43]/20 transition-colors"
                >
                  Show more options
                </button>
              )}
            </div>
          )}

          {/* Hotel options */}
          {msg.hotelOptions && (
            <div className="space-y-2 mt-2">
              {msg.hotelOptions.map((hotel, i) => (
                <HotelOption
                  key={hotel.id}
                  data={hotel}
                  onSelect={() => handleCardSelect(hotel.id, msg.hotelOptions!.map(h => h.id))}
                  onDeselect={() => handleCardDeselect(hotel.id)}
                  selected={selectedCards.has(hotel.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Transfer options */}
          {msg.transferOptions && (
            <div className="space-y-2 mt-2">
              {msg.transferOptions.map((transfer, i) => (
                <TransferOption
                  key={transfer.id}
                  data={transfer}
                  onSelect={() => handleCardSelect(transfer.id, msg.transferOptions!.map(t => t.id))}
                  onDeselect={() => handleCardDeselect(transfer.id)}
                  selected={selectedCards.has(transfer.id)}
                  animationDelay={i * 150}
                />
              ))}
            </div>
          )}

          {/* Experience options */}
          {msg.experienceOptions && (
            <div className="space-y-2 mt-2">
              {msg.experienceOptions.map((exp, i) => (
                <ExperienceOption
                  key={exp.id}
                  data={exp}
                  onSelect={() => handleCardSelect(exp.id)}
                  onDeselect={() => handleCardDeselect(exp.id)}
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

  // Compute trip total and selected item details
  const tripTotal = useMemo(() => {
    let total = 0;
    let currency = '';
    const items: { label: string; detail: string; price: number }[] = [];

    for (const msg of messages) {
      if (msg.flightOptions) {
        for (const f of msg.flightOptions) {
          if (selectedCards.has(f.id)) {
            total += f.price;
            currency = currency || f.currency;
            items.push({ label: 'Flight', detail: `${f.airline} · ${f.departureAirport} → ${f.arrivalAirport}`, price: f.price });
          }
        }
      }
      if (msg.hotelOptions) {
        for (const h of msg.hotelOptions) {
          if (selectedCards.has(h.id)) {
            total += h.totalPrice;
            currency = currency || h.currency;
            items.push({ label: 'Hotel', detail: `${h.name} · ${h.nights} nights`, price: h.totalPrice });
          }
        }
      }
      if (msg.transferOptions) {
        for (const t of msg.transferOptions) {
          if (selectedCards.has(t.id)) {
            total += t.price;
            currency = currency || t.currency;
            items.push({ label: 'Transfer', detail: t.vehicleType, price: t.price });
          }
        }
      }
      if (msg.experienceOptions) {
        for (const e of msg.experienceOptions) {
          if (selectedCards.has(e.id)) {
            total += e.pricePerPerson;
            currency = currency || e.currency;
            items.push({ label: 'Experience', detail: e.title, price: e.pricePerPerson });
          }
        }
      }
    }

    return total > 0 ? { total, currency, items } : null;
  }, [messages, selectedCards]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Trip total subheader */}
      {tripTotal && (
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 bg-teal-50 border-b border-teal-100 shadow-[0_2px_6px_rgba(255,255,255,0.5)] z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Trip total:</span>
            <span className="text-sm font-bold text-gray-900">{tripTotal.currency}{tripTotal.total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="text-[11px] font-bold tracking-wider text-teal-700 hover:text-teal-900 transition-colors"
          >
            CHECKOUT
          </button>
        </div>
      )}

      {/* Checkout overlay */}
      {showCheckout && tripTotal && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Your trip summary</h2>
            <button onClick={() => setShowCheckout(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Summary items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {tripTotal.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{item.label}</div>
                  <div className="text-sm text-gray-800 truncate">{item.detail}</div>
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0 ml-4">{tripTotal.currency}{item.price}</span>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{tripTotal.currency}{tripTotal.total.toLocaleString()}</span>
            </div>

            {/* Booking link preview */}
            <div
              className="border border-gray-200 hover:border-gray-300 rounded-lg p-3 mt-4 cursor-pointer transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 hover:shadow-sm"
              onClick={() => window.open('https://book.nilgai.travel/checkout/NLG-PAR-2026', '_blank', 'noopener,noreferrer')}
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 flex-shrink-0 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✈️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate mb-0.5">
                        Complete your booking
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        Secure checkout · Instant confirmation · Free cancellation
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">book.nilgai.travel</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
