import React, { useState } from 'react';
import Image from 'next/image';

interface TransferOptionProps {
  image: string;
  title: string;
  badge: {
    text: string;
    type: 'eco' | 'premium' | 'budget';
  };
  feature: string;
  fullFeature?: string; // Full description for tooltip
  capacity: number | null;
  luggage: number;
  skis_snowboards: number;
  pricing: {
    total: string;
    perPerson?: string;
    isLimited?: boolean;
  };
  buttonType: 'book' | 'enquire';
  onButtonClick: () => void;
}

const TransferOption: React.FC<TransferOptionProps> = ({
  image,
  title,
  badge,
  feature,
  fullFeature,
  capacity,
  luggage,
  skis_snowboards,
  pricing,
  buttonType,
  onButtonClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Only show tooltip if there's a full feature and it's different from the truncated feature
  const shouldShowTooltip = fullFeature && fullFeature !== feature && fullFeature.length > feature.length;
  return (
    <div className="transfer-option-bubble">
      <div className="transfer-header">
        <Image 
          src={image} 
          alt={`${title} Transfer`} 
          className="transfer-image" 
          style={{ objectFit: 'contain' }} 
          width={80} 
          height={60}
          loading="lazy"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="
        />
        <div className="transfer-title">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="break-words">{title}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {capacity && (
                  <div className="flex items-center text-[11px] text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {capacity}
                  </div>
                )}
                <div className="flex items-center text-[11px] text-gray-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                    <path d="M6 2h12v4H6z"></path>
                    <rect x="2" y="6" width="20" height="14" rx="2"></rect>
                    <path d="M10 10h4"></path>
                  </svg>
                  {luggage}
                </div>
                {/* SKI/SNOWBOARD DISPLAY HIDDEN - TODO: Remove when bookingUrl supports ski/snowboard parameters
                <div className="flex items-center text-[11px] text-gray-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                    <path d="M5 18L17 6"></path>
                    <path d="M11 18L23 6"></path>
                  </svg>
                  {skis_snowboards}
                </div>
                */}
              </div>
            </div>
          </div>
          <div className={`${badge.type}-badge`}>
            <span>{badge.text}</span>
          </div>
        </div>
      </div>
      <div className="transfer-details">
        <div className="feature-container relative">
          <p 
            className="feature text-sm text-gray-600"
            onMouseEnter={() => shouldShowTooltip && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ cursor: shouldShowTooltip ? 'help' : 'default' }}
          >
            {feature}
          </p>
          {shouldShowTooltip && showTooltip && (
            <div className="tooltip">
              <div className="tooltip-content">
                {fullFeature}
              </div>
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </div>
        <div className="pricing">
          <div className="flex items-baseline">
            <span className="text-xs text-gray-400 mr-1">From</span>
            <div className="total-price">{pricing.total}</div>
          </div>
        </div>
      </div>
      <button 
        className={`${buttonType === 'book' ? 'book-now-btn' : 'enquire-btn'} mt-2`}
        onClick={onButtonClick}
      >
        {buttonType === 'book' ? 'Book now' : 'Enquire'}
      </button>
    </div>
  );
};

export default TransferOption; 