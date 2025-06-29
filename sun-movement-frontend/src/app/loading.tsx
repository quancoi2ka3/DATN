import { SectionSkeleton } from "@/components/ui/lazy-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Loading */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="h-12 w-96 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
          <div className="h-6 w-[600px] bg-white/20 rounded mx-auto animate-pulse"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
            <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Sections Loading */}
      <SectionSkeleton />
      <SectionSkeleton className="bg-gray-50" />
      <SectionSkeleton />
    </div>
  );
}
