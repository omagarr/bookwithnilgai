'use client';

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '../src/components/LoadingSpinner';

const inter = Inter({ subsets: ["latin"] });

// Create a wrapper component to handle the conditional loading
function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isEmbedded = searchParams?.get('embed') === 'true';
  
  // Also check if we're on the /embed route
  const isEmbedRoute = pathname === '/embed';
  const shouldLoadWidget = !isEmbedded && !isEmbedRoute;
  
  return (
    <>
      {children}
      {/* Only load the widget script if NOT in embedded mode or on /embed route */}
      {shouldLoadWidget && (
        <Script 
          src="/widget.js" 
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Your Brand x NilgAI</title>
        <meta name="description" content="NilgAI transforms enterprise travel APIs and website data into AI-ready tools. Launch intelligent assistants, search agents, and booking agents without rebuilding your tech stack. Plug in your own APIs or deploy instantly with pre-integrated partners — go live in days, not months." />
        <meta name="keywords" content="NilgAI, AI travel agents, enterprise travel API, booking agents, intelligent assistants, search agents, AI-ready tools, travel technology, API integration, travel AI platform" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />

        {/* Open Graph / Social Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Your Brand x NilgAI" />
        <meta property="og:description" content="NilgAI transforms enterprise travel APIs and website data into AI-ready tools. Launch intelligent assistants, search agents, and booking agents without rebuilding your tech stack." />
        <meta property="og:url" content="https://stagingb2b.nilgai.travel" />
        <meta property="og:image" content="https://stagingb2b.nilgai.travel/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Brand x NilgAI" />
        <meta name="twitter:description" content="NilgAI transforms enterprise travel APIs and website data into AI-ready tools. Launch intelligent assistants, search agents, and booking agents without rebuilding your tech stack." />
        <meta name="twitter:image" content="https://stagingb2b.nilgai.travel/og-image.png" />
        {/* Debug script for production troubleshooting */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log("Debug: Layout initialization");
                window.debugChatWidget = {
                  logs: [],
                  log: function(message) {
                    this.logs.push({time: new Date().toISOString(), message: message});
                    console.log("ChatWidget Debug:", message);
                  },
                  getEnvironment: function() {
                    return {
                      url: window.location.href,
                      hostname: window.location.hostname,
                      pathname: window.location.pathname,
                      search: window.location.search,
                      userAgent: navigator.userAgent
                    };
                  }
                };
                window.debugChatWidget.log("Debug script loaded");
                
                // Mobile viewport zoom fix
                if (window.visualViewport) {
                  window.visualViewport.addEventListener('resize', function() {
                    if (window.visualViewport.scale !== 1) {
                      setTimeout(function() {
                        window.scrollTo(0, 0);
                        var viewport = document.querySelector('meta[name="viewport"]');
                        if (viewport) {
                          viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
                        }
                      }, 300);
                    }
                  });
                }
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} h-full`} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}