'use client';

import React, { useState, useEffect } from 'react';

interface BookingProcessingProps {
  animationDelay?: number;
}

const statusMessages = [
  'Confirming flights...',
  'Reserving hotel room...',
  'Scheduling transfer...',
  'Adding experiences...',
  'Finalizing booking...',
];

export default function BookingProcessing({ animationDelay = 0 }: BookingProcessingProps) {
  const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev < statusMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="travel-card-enter bg-white rounded-2xl p-6 my-2 max-w-[420px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-3 border-nilgai-blue/20 border-t-nilgai-orange animate-spin mb-4"
             style={{ borderWidth: '3px' }} />

        <h3 className="text-base font-bold text-gray-800 mb-1">Booking your Paris weekend...</h3>

        {/* Status messages */}
        <div className="space-y-1.5 mt-3 w-full">
          {statusMessages.map((msg, i) => (
            <div
              key={msg}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                i < currentStatus
                  ? 'text-emerald-600'
                  : i === currentStatus
                  ? 'text-nilgai-blue font-medium booking-processing-pulse'
                  : 'text-gray-300'
              }`}
            >
              {i < currentStatus ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i === currentStatus ? (
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-nilgai-blue animate-pulse"></div>
                </div>
              ) : (
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                </div>
              )}
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
