'use client';

import React from 'react';
import Image from 'next/image';
import TravelCard from './TravelCard';
import { ExperienceOptionData } from '@/types/chat';

interface ExperienceOptionProps {
  data: ExperienceOptionData;
  onSelect: () => void;
  selected?: boolean;
  animationDelay?: number;
}

function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export default function ExperienceOption({ data, onSelect, selected, animationDelay }: ExperienceOptionProps) {
  return (
    <TravelCard
      badge={{ text: data.duration, variant: 'gray' }}
      price={`${data.currency}${data.pricePerPerson}`}
      priceSubtext="/ person"
      buttonLabel="Add"
      onSelect={onSelect}
      selected={selected}
      animationDelay={animationDelay}
    >
      <div className="flex gap-3">
        {/* Experience image */}
        <div className="w-[100px] h-[72px] rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight">{data.title}</h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-gray-700">{data.rating}</span>
            <span className="text-xs text-gray-400">({formatReviewCount(data.reviewCount)})</span>
          </div>
          {/* Description */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{data.description}</p>
        </div>
      </div>
    </TravelCard>
  );
}
