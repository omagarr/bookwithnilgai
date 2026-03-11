'use client';

import React, { useState } from 'react';

interface TravelerCountProps {
  options: number[];
  onSelect: (count: number) => void;
}

export default function TravelerCount({ options, onSelect }: TravelerCountProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (count: number) => {
    if (selected !== null) return;
    setSelected(count);
    onSelect(count);
  };

  const visibleOptions = expanded ? options : options.slice(0, 5);
  const hasMore = !expanded && options.length > 5;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {visibleOptions.map((num, i) => (
        <button
          key={num}
          onClick={() => handleSelect(num)}
          disabled={selected !== null}
          className={`travel-card-enter w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200
            ${selected === num
              ? 'bg-[#0e3b43] text-white shadow-md'
              : selected !== null
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-[#0e3b43] hover:text-white hover:-translate-y-px hover:shadow-md active:translate-y-0'
            }`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {num}
        </button>
      ))}
      {hasMore && selected === null && (
        <button
          onClick={() => setExpanded(true)}
          className="travel-card-enter h-10 px-3 rounded-xl text-sm font-semibold transition-all duration-200
            bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 hover:-translate-y-px hover:shadow-md active:translate-y-0"
          style={{ animationDelay: `${5 * 60}ms` }}
        >
          More
        </button>
      )}
    </div>
  );
}
