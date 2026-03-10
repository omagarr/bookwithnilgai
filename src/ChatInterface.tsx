'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

        // Determine if this message has rich content
        const richContent: Partial<Message> = {};
        if (scriptedMsg.flightOptions) richContent.flightOptions = scriptedMsg.flightOptions;
        if (scriptedMsg.hotelOptions) richContent.hotelOptions = scriptedMsg.hotelOptions;
        if (scriptedMsg.transferOptions) richContent.transferOptions = scriptedMsg.transferOptions;
        if (scriptedMsg.experienceOptions) richContent.experienceOptions = scriptedMsg.experienceOptions;
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
          await streamText(scriptedMsg.content, msgId);
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

    return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[85%] ${isUser ? '' : ''}`}>
          {/* Text content */}
          {msg.content && (
            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap ${
                isUser
                  ? 'bg-nilgai-blue text-white rounded-2xl rounded-br-md px-4 py-2.5'
                  : 'bg-nilgai-gray-800 text-white rounded-2xl rounded-bl-md px-4 py-2.5'
              }`}
            >
              {msg.content}
            </div>
          )}

          {/* Flight options */}
          {msg.flightOptions && (
            <div className="mt-2 space-y-0">
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
            <div className="mt-2 space-y-0">
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
            <div className="mt-2 space-y-0">
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
            <div className="mt-2 space-y-0">
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
            <div className="mt-2">
              <TripSummary data={msg.tripSummary} onBook={handleBookTrip} />
            </div>
          )}

          {/* Booking confirmation */}
          {msg.bookingConfirmation && (
            <div className="mt-2">
              <BookingConfirmation
                data={msg.bookingConfirmation}
                onConfirm={handleBookingConfirm}
                onCancel={handleBookingCancel}
              />
            </div>
          )}

          {/* Booking processing */}
          {msg.bookingProcessing && (
            <div className="mt-2">
              <BookingProcessing />
            </div>
          )}

          {/* Booking complete */}
          {msg.bookingComplete && (
            <div className="mt-2">
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
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
      >
        {messages.map(renderMessage)}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-nilgai-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-nilgai-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-nilgai-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-nilgai-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-nilgai-gray-800 px-4 py-3 bg-nilgai-gray-900">
        {isDemoComplete ? (
          <button
            onClick={onRestart}
            className="w-full py-3 bg-nilgai-orange text-white font-semibold rounded-xl
                       hover:-translate-y-px hover:shadow-lg transition-all duration-200 min-h-[48px]"
          >
            Restart Demo
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(message);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative rounded-xl border border-nilgai-gray-700 bg-nilgai-gray-800 focus-within:border-nilgai-blue/50 transition-colors">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(message);
                  }
                }}
                placeholder={isLoading ? 'Thinking...' : 'Type anything to continue...'}
                disabled={isLoading}
                rows={1}
                className="w-full py-3 px-4 text-sm bg-transparent text-white rounded-xl
                           focus:outline-none placeholder:text-nilgai-gray-500 resize-none
                           disabled:opacity-50"
                style={{ fontSize: '16px' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 bg-nilgai-orange text-white rounded-xl
                         hover:-translate-y-px hover:shadow-md transition-all duration-200
                         disabled:opacity-50 disabled:hover:translate-y-0 min-w-[48px] min-h-[48px]
                         flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
