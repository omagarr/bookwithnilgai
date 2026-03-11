'use client';

import React from 'react';

interface TravelCardProps {
  badge?: {
    text: string;
    variant: 'green' | 'orange' | 'blue' | 'gray';
  };
  price: string;
  priceSubtext?: string;
  buttonLabel: string;
  onSelect: () => void;
  selected?: boolean;
  animationDelay?: number;
  children: React.ReactNode;
}

const badgeColors: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-amber-100 text-amber-700',
  blue: 'bg-indigo-100 text-indigo-700',
  gray: 'bg-gray-100 text-gray-600',
};

export default function TravelCard({
  badge,
  price,
  priceSubtext,
  buttonLabel,
  onSelect,
  selected = false,
  animationDelay = 0,
  children,
}: TravelCardProps) {
  return (
    <div
      className={`
        travel-card-enter
        bg-gray-100 rounded-2xl p-3 w-full
        transition-all duration-200
        ${selected
          ? 'ring-2 ring-nilgai-blue opacity-80 pointer-events-none'
          : 'hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer'
        }
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={!selected ? onSelect : undefined}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-2">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badge.variant] || badgeColors.gray}`}>
            {badge.text}
          </span>
        </div>
      )}

      {/* Card-specific content */}
      {children}

      {/* Price + Button */}
      <div className="flex items-center justify-between mt-2 pt-2">
        <div>
          <span className="text-lg font-bold text-nilgai-blue">{price}</span>
          {priceSubtext && (
            <span className="text-xs text-gray-500 ml-1">{priceSubtext}</span>
          )}
        </div>
        {selected ? (
          <div className="flex items-center gap-1.5 text-nilgai-blue font-medium text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Selected
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="px-3.5 py-1.5 bg-[#0e3b43] text-white text-sm font-semibold rounded-lg
                       hover:-translate-y-px hover:shadow-md transition-all duration-200
                       active:translate-y-0"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
