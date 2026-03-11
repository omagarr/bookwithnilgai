'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  formatReviewCount?: (count: number) => string;
}

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export default function StarRating({ rating, reviewCount, formatReviewCount = formatCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-0.5">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.min(1, Math.max(0, rating - i));
          const clipId = `star-clip-${i}-${rating}`;
          return (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20">
              {/* Empty star background */}
              <path d={STAR_PATH} fill="#D1D5DB" />
              {/* Filled portion */}
              {fill > 0 && (
                <>
                  <clipPath id={clipId}>
                    <rect x="0" y="0" width={fill * 20} height="20" />
                  </clipPath>
                  <path d={STAR_PATH} fill="#FBBF24" clipPath={`url(#${clipId})`} />
                </>
              )}
            </svg>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({formatReviewCount(reviewCount)})</span>
      )}
    </div>
  );
}
