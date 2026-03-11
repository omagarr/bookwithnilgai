'use client';

import React from 'react';
import Image from 'next/image';
import TravelCard from './TravelCard';
import StarRating from './StarRating';
import { HotelOptionData } from '@/types/chat';

interface HotelOptionProps {
  data: HotelOptionData;
  onSelect: () => void;
  onDeselect?: () => void;
  selected?: boolean;
  animationDelay?: number;
}

export default function HotelOption({ data, onSelect, onDeselect, selected, animationDelay }: HotelOptionProps) {
  return (
    <TravelCard
      price={`${data.currency}${data.pricePerNight}`}
      priceSubtext={`/ night · ${data.currency}${data.totalPrice} total`}
      buttonLabel="Select"
      onSelect={onSelect}
      onDeselect={onDeselect}
      selected={selected}
      animationDelay={animationDelay}
    >
      <div className="flex gap-3 items-center">
        {/* Hotel image */}
        <div className="w-[100px] h-[72px] rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{data.name}</h3>
          <div className="mt-0.5">
            <StarRating rating={data.stars} reviewCount={data.reviewCount} />
          </div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">{data.location}</div>
        </div>
      </div>
    </TravelCard>
  );
}
