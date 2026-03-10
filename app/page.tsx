'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import config from '../src/config';
import LoadingSpinner from '../src/components/LoadingSpinner';

// Dynamically import the ChatPopup component with no SSR to avoid hydration issues
const ChatPopup = dynamic(() => import('../src/ChatPopup'), { ssr: false });

function HomeContent() {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams?.get('embed') === 'true';
  
  if (isEmbedded) {
    // For the embedded version, render the ChatPopup component directly
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-full h-full">
          <ChatPopup initialMinimized={false} />
          {/* Add this script to ensure widget initialization */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log("Embedded mode detected, initializing chat...");
                // Force immediate initialization in case the component didn't load
                if (window.parent && window.parent.postMessage) {
                  window.parent.postMessage({
                    type: 'WIDGET_READY',
                    state: 'maximized'
                  }, '*');
                }
              `
            }}
          />
        </div>
      </div>
    );
  }
  
  // Serve the static HTML content directly (no redirect)
  return (
    <>
      <main className="min-h-screen bg-[#161616]">
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
      </main>

      {/* Widget Configuration Script - REMOVED TO PREVENT CONFLICTS */}
      {/* The widget is already loaded in layout.tsx with /widget.js */}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
} // API Test
