'use client';

import React from 'react';
import TravelCard from './TravelCard';
import { FlightOptionData } from '@/types/chat';

// Map airline names to IATA codes for logo lookup
const airlineIataMap: Record<string, string> = {
  'air france': 'AF',
  'easyjet': 'U2',
  'british airways': 'BA',
  'vueling': 'VY',
  'ryanair': 'FR',
  'lufthansa': 'LH',
  'klm': 'KL',
  'swiss': 'LX',
  'iberia': 'IB',
  'transavia': 'TO',
  'wizz air': 'W6',
  'norwegian': 'DY',
  'tap portugal': 'TP',
  'austrian': 'OS',
  'brussels airlines': 'SN',
  'finnair': 'AY',
  'sas': 'SK',
  'aegean': 'A3',
  'turkish airlines': 'TK',
  'emirates': 'EK',
  'qatar airways': 'QR',
  'etihad': 'EY',
  'united': 'UA',
  'delta': 'DL',
  'american airlines': 'AA',
  'jet2': 'LS',
  'eurowings': 'EW',
  'volotea': 'V7',
  'flybe': 'BE',
  'aer lingus': 'EI',
  'alitalia': 'AZ',
};

function getAirlineLogoUrl(airlineName: string): string {
  const code = airlineIataMap[airlineName.toLowerCase()];
  if (code) {
    return `https://images.kiwi.com/airlines/64/${code}.png`;
  }
  return '';
}

const badgeColors: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-amber-100 text-amber-700',
};

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

  const logoUrl = getAirlineLogoUrl(data.airline);

  return (
    <TravelCard
      price={`${data.currency}${data.price}`}
      priceSubtext="/ person"
      buttonLabel="Select"
      onSelect={onSelect}
      selected={selected}
      animationDelay={animationDelay}
    >
      {/* Airline + Badge row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={data.airline}
              className="w-7 h-7 rounded-full object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-nilgai-blue/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 truncate">{data.airline}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">{data.duration}</span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeColors[stopsBadge.variant]}`}>
            {stopsBadge.text}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 mt-2">
        {/* Departure */}
        <div className="text-center min-w-[52px]">
          <div className="text-base font-semibold text-gray-800">{data.departureTime}</div>
          <div className="text-[11px] text-gray-500 font-medium">{data.departureAirport}</div>
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
        <div className="text-center min-w-[52px]">
          <div className="text-base font-semibold text-gray-800">{data.arrivalTime}</div>
          <div className="text-[11px] text-gray-500 font-medium">{data.arrivalAirport}</div>
        </div>
      </div>

      {/* Stop city */}
      {data.stops > 0 && data.stopCity && (
        <div className="text-center -mt-3 -mb-1">
          <span className="text-[11px] text-gray-500">via {data.stopCity}</span>
        </div>
      )}
    </TravelCard>
  );
}
