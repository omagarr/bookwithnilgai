'use client';

import React from 'react';
import TravelCard from './TravelCard';
import { FlightOptionData } from '@/types/chat';

interface FlightOptionProps {
  data: FlightOptionData;
  onSelect: () => void;
  selected?: boolean;
  animationDelay?: number;
}

export default function FlightOption({ data, onSelect, selected, animationDelay }: FlightOptionProps) {
  const stopsBadge = data.stops === 0
    ? { text: 'Direct', variant: 'green' as const }
    : { text: `${data.stops} Stop${data.stops > 1 ? 's' : ''}`, variant: 'orange' as const };

  return (
    <TravelCard
      badge={stopsBadge}
      price={`${data.currency}${data.price}`}
      priceSubtext="/ person"
      buttonLabel="Select"
      onSelect={onSelect}
      selected={selected}
      animationDelay={animationDelay}
    >
      <div className="flex items-center justify-between">
        {/* Airline */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-nilgai-blue/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700 truncate">{data.airline}</span>
        </div>
        {/* Duration */}
        <span className="text-xs text-gray-400 flex-shrink-0">{data.duration}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 mt-3">
        {/* Departure */}
        <div className="text-center min-w-[60px]">
          <div className="text-lg font-semibold text-gray-800">{data.departureTime}</div>
          <div className="text-xs text-gray-400 font-medium">{data.departureAirport}</div>
        </div>

        {/* Flight line */}
        <div className="flex-1 flex items-center gap-1">
          <div className="h-px flex-1 bg-gray-300"></div>
          {data.stops > 0 ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-nilgai-orange"></div>
              <div className="h-px flex-1 bg-gray-300"></div>
            </>
          ) : (
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Arrival */}
        <div className="text-center min-w-[60px]">
          <div className="text-lg font-semibold text-gray-800">{data.arrivalTime}</div>
          <div className="text-xs text-gray-400 font-medium">{data.arrivalAirport}</div>
        </div>
      </div>

      {/* Stop city */}
      {data.stops > 0 && data.stopCity && (
        <div className="text-center mt-1">
          <span className="text-[11px] text-gray-400">via {data.stopCity}</span>
        </div>
      )}
    </TravelCard>
  );
}
