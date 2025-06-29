"use client";

export const EventCardSkeleton = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-slate-700/50"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Badge skeleton */}
        <div className="h-6 w-20 bg-slate-700/50 rounded-full"></div>
        
        {/* Title skeleton */}
        <div className="h-6 bg-slate-700/50 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-700/50 rounded w-full"></div>
          <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
        </div>
        
        {/* Event details skeleton */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-700/50 rounded"></div>
            <div className="h-4 w-20 bg-slate-700/50 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-700/50 rounded"></div>
            <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
          </div>
        </div>
        
        {/* Price and button skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="space-y-1">
            <div className="h-4 w-12 bg-slate-700/50 rounded"></div>
            <div className="h-6 w-20 bg-slate-700/50 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const EventSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};
