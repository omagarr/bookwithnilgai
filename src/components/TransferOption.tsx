'use client';

import React from 'react';
import Image from 'next/image';
import TravelCard from './TravelCard';
import { TransferOptionData } from '@/types/chat';
import CarDoorIcon from './icons/CarDoorIcon';

interface TransferOptionProps {
  data: TransferOptionData;
  onSelect: () => void;
  onDeselect?: () => void;
  selected?: boolean;
  animationDelay?: number;
}

const badgeTypeMap: Record<string, 'green' | 'orange' | 'blue'> = {
  eco: 'green',
  premium: 'orange',
  budget: 'blue',
};

const fuelTypeColors: Record<string, string> = {
  diesel: 'bg-gray-200 text-gray-600',
  petrol: 'bg-amber-100 text-amber-700',
  electric: 'bg-emerald-100 text-emerald-700',
  cng: 'bg-sky-100 text-sky-700',
};

export default function TransferOption({ data, onSelect, onDeselect, selected, animationDelay }: TransferOptionProps) {
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
      onDeselect={onDeselect}
      selected={selected}
      animationDelay={animationDelay}
    >
      {/* Vehicle image – full width */}
      <div className="w-full h-[80px] rounded-lg overflow-hidden bg-white relative">
        <Image
          src={data.image}
          alt={data.vehicleType}
          fill
          className="object-contain"
          sizes="280px"
        />
        {/* Fuel type badge */}
        {data.fuelType && (
          <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${fuelTypeColors[data.fuelType.toLowerCase()] || 'bg-gray-200 text-gray-600'}`}>
            {data.fuelType}
          </span>
        )}
      </div>

      {/* Title + meta row */}
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-sm font-semibold text-gray-800">{data.vehicleType}</h3>
        <span className="text-xs text-gray-500">{data.duration}</span>
      </div>

      {/* Capacity icons */}
      <div className="flex items-center gap-3 mt-1 text-gray-400">
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
        <div className="flex items-center gap-1" title={`${data.doors} doors`}>
          <CarDoorIcon />
          <span className="text-xs">{data.doors}</span>
        </div>
      </div>
    </TravelCard>
  );
}
