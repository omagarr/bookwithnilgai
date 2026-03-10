import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://bookwithnilgai.vercel.app'),
  title: 'NilgAI — AI Travel Booking Demo',
  description: 'Experience the future of travel booking. NilgAI helps you find flights, hotels, transfers, and experiences — all through a single AI-powered conversation.',
  keywords: 'NilgAI, AI travel, booking demo, flights, hotels, transfers, experiences',
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  openGraph: {
    type: 'website',
    title: 'NilgAI — AI Travel Booking Demo',
    description: 'Experience the future of travel booking with AI.',
    url: 'https://bookwithnilgai.vercel.app',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#0F172A] text-white`}>
        {children}
      </body>
    </html>
  );
}
