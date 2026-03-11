'use client';

import React from 'react';
import Image from 'next/image';
import TravelCard from './TravelCard';
import StarRating from './StarRating';
import { ExperienceOptionData } from '@/types/chat';

interface ExperienceOptionProps {
  data: ExperienceOptionData;
  onSelect: () => void;
  onDeselect?: () => void;
  selected?: boolean;
  animationDelay?: number;
}

export default function ExperienceOption({ data, onSelect, onDeselect, selected, animationDelay }: ExperienceOptionProps) {
  return (
    <TravelCard
      price={`${data.currency}${data.pricePerPerson}`}
      priceSubtext={`/ person · ${data.currency}${data.totalPrice} total`}
      buttonLabel="Add"
      selectedLabel="Added"
      onSelect={onSelect}
      onDeselect={onDeselect}
      selected={selected}
      animationDelay={animationDelay}
    >
      <div className="flex gap-3 items-center">
        {/* Experience image with duration overlay */}
        <div className="w-[100px] h-[72px] rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            sizes="100px"
          />
          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded">
            {data.duration}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight">{data.title}</h3>
          {/* Rating */}
          <div className="mt-1">
            <StarRating rating={data.rating} reviewCount={data.reviewCount} />
          </div>
        </div>
      </div>
    </TravelCard>
  );
}
