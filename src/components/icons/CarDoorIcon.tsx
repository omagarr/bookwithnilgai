import React from 'react';

export default function CarDoorIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      {/* Door outline */}
      <path d="M23,63H57a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1H29a1,1,0,0,0-.707.293l-22,22A1,1,0,0,0,6,24V44a1,1,0,0,0,1,1A15.017,15.017,0,0,1,22,60v2A1,1,0,0,0,23,63Z" />
      {/* Window */}
      <path d="M50,5H32.242a4.022,4.022,0,0,0-2.828,1.172L14.121,21.465A3.828,3.828,0,0,0,16.828,28H50a4,4,0,0,0,4-4V9A4,4,0,0,0,50,5Z" />
      {/* Handle */}
      <path d="M16,32h4a3,3,0,0,1,0,6H16a3,3,0,0,1,0-6Z" />
    </svg>
  );
}
