import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center justify-center mb-4">
      <Image
        src="/Your Logo Here.png"
        alt="Your Logo"
        width={160}
        height={48}
        className="h-12"
      />
    </div>
  );
} 