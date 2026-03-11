'use client';

import React from 'react';
import { BookingConfirmationData } from '@/types/chat';

interface BookingConfirmationProps {
  data: BookingConfirmationData;
  onConfirm: () => void;
  onCancel: () => void;
  animationDelay?: number;
}

export default function BookingConfirmation({ data, onConfirm, onCancel, animationDelay = 0 }: BookingConfirmationProps) {
  const { tripSummary } = data;

  return (
    <div
      className="travel-card-enter bg-white rounded-2xl p-5 w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-nilgai-orange/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-nilgai-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-800">Confirm Booking</h3>
      </div>

      {/* Compact summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Flight</span>
          <span className="font-medium text-gray-700">{tripSummary.currency}{tripSummary.flight.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Hotel</span>
          <span className="font-medium text-gray-700">{tripSummary.currency}{tripSummary.hotel.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Transfer</span>
          <span className="font-medium text-gray-700">{tripSummary.currency}{tripSummary.transfer.price}</span>
        </div>
        {tripSummary.experiences.map((exp, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-500">{exp.label}</span>
            <span className="font-medium text-gray-700">{tripSummary.currency}{exp.price}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="font-bold text-nilgai-blue">Total</span>
          <span className="font-bold text-nilgai-blue text-lg">{tripSummary.currency}{tripSummary.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        By confirming, you agree to the booking terms and cancellation policy.
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 text-gray-500 font-medium rounded-xl
                     hover:bg-gray-50 transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-nilgai-orange text-white font-bold rounded-xl
                     hover:-translate-y-px hover:shadow-md transition-all duration-200
                     active:translate-y-0 min-h-[44px]"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
