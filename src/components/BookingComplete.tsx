'use client';

import React from 'react';
import { BookingCompleteData } from '@/types/chat';

interface BookingCompleteProps {
  data: BookingCompleteData;
  animationDelay?: number;
}

export default function BookingComplete({ data, animationDelay = 0 }: BookingCompleteProps) {
  const { tripSummary, bookingRef } = data;

  return (
    <div
      className="travel-card-enter bg-white rounded-2xl p-5 my-2 max-w-[420px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Success header */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3 animate-check-in">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">Your trip is booked!</h3>
        <p className="text-xs text-gray-400 mt-1">Booking ref: {bookingRef}</p>
      </div>

      {/* Compact itinerary */}
      <div className="bg-nilgai-gray-50 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">✈</span>
          <span className="text-gray-700">{tripSummary.flight.label}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">🏨</span>
          <span className="text-gray-700">{tripSummary.hotel.label}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">🚗</span>
          <span className="text-gray-700">{tripSummary.transfer.label}</span>
        </div>
        {tripSummary.experiences.map((exp, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">⭐</span>
            <span className="text-gray-700">{exp.label}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-sm font-bold text-nilgai-blue">Total paid</span>
          <span className="text-sm font-bold text-nilgai-blue">{tripSummary.currency}{tripSummary.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Download button */}
      <button
        className="w-full mt-4 py-2.5 border-2 border-nilgai-blue text-nilgai-blue font-semibold rounded-xl
                   hover:bg-nilgai-blue hover:text-white transition-all duration-200 min-h-[44px] text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download Itinerary
      </button>
    </div>
  );
}
