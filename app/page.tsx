'use client';

import dynamic from 'next/dynamic';

const ChatPopup = dynamic(() => import('../src/ChatPopup'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-[#161616]">
      {/* Background skeleton (decorative) */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-12">
          <div className="w-32 h-8 bg-[#232323] rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            <div className="w-20 h-6 bg-[#232323] rounded-lg animate-pulse"></div>
            <div className="w-20 h-6 bg-[#232323] rounded-lg animate-pulse"></div>
            <div className="w-20 h-6 bg-[#232323] rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Hero section skeleton */}
        <div className="mb-16">
          <div className="w-3/4 h-12 bg-[#232323] rounded-lg animate-pulse mb-6"></div>
          <div className="w-1/2 h-8 bg-[#232323] rounded-lg animate-pulse"></div>
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="w-full h-48 bg-[#232323] rounded-xl animate-pulse"></div>
              <div className="w-3/4 h-6 bg-[#232323] rounded-lg animate-pulse"></div>
              <div className="w-full h-4 bg-[#232323] rounded-lg animate-pulse"></div>
              <div className="w-5/6 h-4 bg-[#232323] rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Content section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-2/3 h-8 bg-[#232323] rounded-lg animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-4 bg-[#232323] rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="w-2/3 h-8 bg-[#232323] rounded-lg animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-4 bg-[#232323] rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat popup widget */}
      <ChatPopup />
    </main>
  );
}
