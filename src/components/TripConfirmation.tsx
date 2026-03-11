'use client';

import React from 'react';
import { TripConfirmationData } from '@/types/chat';

interface TripConfirmationProps {
  data: TripConfirmationData;
  onCheckout: () => void;
  animationDelay?: number;
}

export default function TripConfirmation({ data, onCheckout, animationDelay = 0 }: TripConfirmationProps) {
  return (
    <div
      className="travel-card-enter bg-gray-100 rounded-2xl p-4 w-full"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
        {data.summary}
      </p>

      <button
        onClick={onCheckout}
        className="w-full mt-4 py-2.5 bg-[#0e3b43] text-white text-sm font-semibold rounded-xl
                   hover:-translate-y-px hover:shadow-md transition-all duration-200
                   active:translate-y-0 min-h-[44px]"
      >
        Review Trip
      </button>
    </div>
  );
}
