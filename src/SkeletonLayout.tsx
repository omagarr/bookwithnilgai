export default function SkeletonLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-12">
        <div className="w-32 h-8 bg-[#232323] rounded-lg animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-20 h-6 bg-[#232323] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="mb-16">
        <div className="w-3/4 h-12 bg-[#232323] rounded-lg animate-pulse mb-6" />
        <div className="w-1/2 h-8 bg-[#232323] rounded-lg animate-pulse" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="w-full h-48 bg-[#232323] rounded-xl animate-pulse" />
            <div className="w-3/4 h-6 bg-[#232323] rounded-lg animate-pulse" />
            <div className="w-full h-4 bg-[#232323] rounded-lg animate-pulse" />
            <div className="w-5/6 h-4 bg-[#232323] rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content section skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="w-2/3 h-8 bg-[#232323] rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-4 bg-[#232323] rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="w-2/3 h-8 bg-[#232323] rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-4 bg-[#232323] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
} 