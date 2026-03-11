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
      <h3 className="text-base font-bold text-nilgai-blue mb-3">Added to your trip</h3>

      <div className="space-y-2">
        {data.selectedExperiences.map((exp, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 truncate">{exp.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0 ml-3">{data.currency}{exp.price}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-nilgai-blue/20">
        <span className="text-sm font-semibold text-gray-600">Trip total</span>
        <span className="text-lg font-bold text-nilgai-blue">{data.currency}{data.tripTotal.toLocaleString()}</span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-3 py-2.5 bg-[#0e3b43] text-white text-sm font-semibold rounded-xl
                   hover:-translate-y-px hover:shadow-md transition-all duration-200
                   active:translate-y-0 min-h-[44px]"
      >
        Proceed to Checkout
      </button>

      <div className="text-center mt-4">
        <a href="https://nilgai.ai/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Powered by NilgAI</a>
      </div>
    </div>
  );
}
