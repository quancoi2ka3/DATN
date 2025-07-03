'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Fallback component cho khi PersonalRecommendations không thể load
const RecommendationsFallback = ({ count = 4, title = "Sản phẩm phù hợp với bạn" }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

// Dynamic import của PersonalRecommendations với error handling
const PersonalRecommendations = dynamic(
  () => import('./PersonalRecommendations').catch(() => {
    // Fallback nếu không thể load component
    return { default: RecommendationsFallback };
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }
);

interface PersonalRecommendationsWrapperProps {
  count?: number;
  title?: string;
}

export default function PersonalRecommendationsWrapper({ 
  count = 4, 
  title = "Sản phẩm phù hợp với bạn" 
}: PersonalRecommendationsWrapperProps) {
  return (
    <div>
      <Suspense fallback={<RecommendationsFallback count={count} title={title} />}>
        <PersonalRecommendations count={count} title={title} />
      </Suspense>
    </div>
  );
}
