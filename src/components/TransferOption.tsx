'use client';

import React from 'react';
import Image from 'next/image';
import TravelCard from './TravelCard';
import { TransferOptionData } from '@/types/chat';

interface TransferOptionProps {
  data: TransferOptionData;
  onSelect: () => void;
  selected?: boolean;
  animationDelay?: number;
}

const badgeTypeMap: Record<string, 'green' | 'orange' | 'blue'> = {
  eco: 'green',
  premium: 'orange',
  budget: 'blue',
};

export default function TransferOption({ data, onSelect, selected, animationDelay }: TransferOptionProps) {
  const badge = data.badge
    ? { text: data.badge.text, variant: badgeTypeMap[data.badge.type] || ('gray' as const) }
    : undefined;

  return (
    <TravelCard
      badge={badge}
      price={`${data.currency}${data.price}`}
      priceSubtext="total"
      buttonLabel="Select"
      onSelect={onSelect}
      selected={selected}
      animationDelay={animationDelay}
    >
      <div className="flex gap-3">
        {/* Vehicle image */}
        <div className="w-[100px] h-[72px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
          <Image
            src={data.image}
            alt={data.vehicleType}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800">{data.vehicleType}</h3>
          <div className="text-xs text-gray-400 mt-0.5">{data.duration}</div>
          {/* Capacity icons */}
          <div className="flex items-center gap-3 mt-2 text-gray-400">
            <div className="flex items-center gap-1" title={`${data.capacity} passengers`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-xs">{data.capacity}</span>
            </div>
            <div className="flex items-center gap-1" title={`${data.luggage} bags`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs">{data.luggage}</span>
            </div>
          </div>
        </div>
      </div>
    </TravelCard>
  );
}
