import { SectionSkeleton } from "@/components/ui/lazy-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Loading */}
      <div className="relative bg-gradient-to-br from-orange-500 to-red-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <div className="h-12 w-96 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
            <div className="h-6 w-[600px] bg-white/20 rounded mx-auto animate-pulse"></div>
            <div className="flex justify-center space-x-4">
              <div className="h-12 w-40 bg-white/20 rounded animate-pulse"></div>
              <div className="h-12 w-40 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Loading */}
      <SectionSkeleton />
      <SectionSkeleton className="bg-gray-50" />
    </div>
  );
}
