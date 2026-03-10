import Image from 'next/image';

export default function TrustpilotWidget() {
  return (
    <div className="mt-4 w-full flex items-center gap-3 bg-[#f8fafb] px-4 py-3 rounded-lg">
      <span className="text-[15px] font-semibold text-[#18212b]">Excellent</span>
      <span className="text-[13px] text-[#4b5665]">4.7 out of 5</span>
      <div className="flex items-center">
        <Image 
          src="/trustpilot.svg" 
          alt="Trustpilot" 
          width={100}
          height={20}
          className="h-5"
        />
      </div>
    </div>
  );
} 