'use client';

import React from 'react';
import { RoomTypeOptionData } from '@/types/chat';

interface RoomTypeOptionProps {
  data: RoomTypeOptionData;
  nights: number;
  onSelect: () => void;
  selected: boolean;
  disabled: boolean;
  animationDelay?: number;
}

export default function RoomTypeOption({ data, nights, onSelect, selected, disabled, animationDelay = 0 }: RoomTypeOptionProps) {
  const isIncluded = data.surchargePerNight === 0;
  const totalSurcharge = data.surchargePerNight * nights;

  return (
    <button
      onClick={onSelect}
      disabled={disabled && !selected}
      className={`travel-card-enter w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200
        ${selected
          ? 'border-[#0e3b43] bg-[#0e3b43]/5 shadow-md'
          : disabled
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-200 bg-white hover:border-[#0e3b43] hover:-translate-y-px hover:shadow-md active:translate-y-0'
        }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="text-left min-w-0">
        <div className={`text-sm font-semibold ${selected ? 'text-[#0e3b43]' : 'text-gray-900'}`}>
          {data.name}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{data.description}</div>
      </div>
      <div className="flex-shrink-0 ml-4 text-right">
        {isIncluded ? (
          <span className="text-xs font-semibold text-emerald-600">Included</span>
        ) : (
          <span className="text-xs font-semibold text-gray-700">+{data.currency}{totalSurcharge}</span>
        )}
      </div>
    </button>
  );
}
