'use client';

import React from 'react';
import { TripSummaryData } from '@/types/chat';

interface TripSummaryProps {
  data: TripSummaryData;
  onBook: () => void;
  animationDelay?: number;
}

function SummaryRow({ icon, category, label, details, price, currency }: {
  icon: React.ReactNode;
  category: string;
  label: string;
  details: string;
  price: number;
  currency: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-nilgai-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{category}</div>
        <div className="text-sm font-medium text-gray-800 mt-0.5">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{details}</div>
      </div>
      <div className="text-sm font-bold text-gray-700 flex-shrink-0 mt-3">
        {currency}{price}
      </div>
    </div>
  );
}

const FlightIcon = () => (
  <svg className="w-4 h-4 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const HotelIcon = () => (
  <svg className="w-4 h-4 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const TransferIcon = () => (
  <svg className="w-4 h-4 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ExperienceIcon = () => (
  <svg className="w-4 h-4 text-nilgai-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export default function TripSummary({ data, onBook, animationDelay = 0 }: TripSummaryProps) {
  return (
    <div
      className="travel-card-enter bg-gray-100 rounded-2xl p-4 w-full"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <h3 className="text-base font-bold text-nilgai-blue mb-3">Trip Summary</h3>

      <div className="divide-y divide-gray-200/60">
        {/* Flight */}
        <SummaryRow
          icon={<FlightIcon />}
          category="Flight"
          label={data.flight.label}
          details={data.flight.details}
          price={data.flight.price}
          currency={data.currency}
        />

        {/* Hotel */}
        <SummaryRow
          icon={<HotelIcon />}
          category="Hotel"
          label={data.hotel.label}
          details={`${data.hotel.details}${data.hotel.roomType ? ` · ${data.hotel.roomType}` : ''}`}
          price={data.hotel.price}
          currency={data.currency}
        />

        {/* Transfer */}
        <SummaryRow
          icon={<TransferIcon />}
          category="Transfer"
          label={data.transfer.label}
          details={data.transfer.details}
          price={data.transfer.price}
          currency={data.currency}
        />

        {/* Experiences */}
        {data.experiences.map((exp, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-nilgai-blue/10 flex items-center justify-center flex-shrink-0">
              {i === 0 ? <ExperienceIcon /> : (
                <svg className="w-4 h-4 text-nilgai-blue/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {i === 0 && (
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Experiences</div>
              )}
              <span className="text-sm text-gray-700">{exp.label}</span>
            </div>
            <span className="text-sm font-bold text-gray-700 flex-shrink-0">{data.currency}{exp.price}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t-2 border-nilgai-blue/20">
        <span className="text-base font-bold text-nilgai-blue">Total</span>
        <span className="text-xl font-bold text-nilgai-blue">{data.currency}{data.totalPrice.toLocaleString()}</span>
      </div>

      {/* Book button — matches TravelCard's select button style */}
      <button
        onClick={onBook}
        className="w-full mt-3 py-2.5 bg-[#0e3b43] text-white text-sm font-semibold rounded-xl
                   hover:-translate-y-px hover:shadow-md transition-all duration-200
                   active:translate-y-0 min-h-[44px]"
      >
        Book Trip
      </button>

      <div className="text-center mt-4">
        <a href="https://nilgai.ai/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Powered by NilgAI</a>
      </div>
    </div>
  );
}
