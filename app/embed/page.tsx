'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR to avoid hydration issues
const ChatEmbed = dynamic(() => import('@/ChatEmbed'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1b3a4b] rounded-full animate-spin"></div>
        <div className="text-gray-600 text-sm">Loading chat...</div>
      </div>
    </div>
  ),
});

/**
 * Embed Page
 * 
 * This page serves the embeddable version of the chat interface.
 * It's designed to be loaded in an iframe and take the full available space.
 * 
 * Usage:
 * - Can be embedded via iframe: <iframe src="https://ski-lifts.nilgai.travel/embed" />
 * - Automatically adjusts to container size
 * - No minimize/maximize functionality
 */
export default function EmbedPage() {
  return (
    <main className="w-full h-screen">
      <ChatEmbed className="w-full h-full" />
    </main>
  );
}
