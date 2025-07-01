"use client";

import React, { useState } from 'react';

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

// Các tin nhắn gợi ý nhanh cho người dùng
export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  const [suggestions] = useState([
    "Đăng ký tập thử miễn phí",
    "Giá các gói tập",
    "Lịch học Yoga",
    "Giờ mở cửa",
    "Các khóa học Calisthenics",
    "Sản phẩm bổ sung dinh dưỡng"
  ]);
  
  return (
    <div className="quick-suggestions">
      <p className="text-xs text-gray-500 mb-2">Bạn có thể hỏi:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chip"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
