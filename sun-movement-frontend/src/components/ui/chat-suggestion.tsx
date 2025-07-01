"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChatSuggestionProps {
  isOpen: boolean;
}

// Danh sách các gợi ý sẽ xuất hiện luân phiên
const SUGGESTIONS = [
  "👋 Bạn cần hỗ trợ gì không?",
  "🏋️‍♂️ Khám phá các gói tập luyện của chúng tôi?",
  "💪 Bạn muốn biết thêm về các khóa học Calisthenics?",
  "🧘‍♀️ Lịch học Yoga tuần này có nhiều giờ mới!",
  "👟 Bạn đã xem bộ sưu tập sportswear mới chưa?",
  "🥤 Bạn cần tư vấn về các sản phẩm supplements?",
  "🎯 Đặt lịch tập thử miễn phí ngay hôm nay!",
  "📅 Có sự kiện đặc biệt vào cuối tuần này!",
  "⏰ Đừng bỏ lỡ ưu đãi giảm 20% khi đăng ký hôm nay!",
  "🔥 Bạn muốn tìm hiểu về chương trình giảm cân không?",
  "🍎 Hãy hỏi tôi về chế độ dinh dưỡng phù hợp nhé!",
];

export function ChatSuggestion({ isOpen }: ChatSuggestionProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Hiển thị gợi ý mỗi 30 giây
  useEffect(() => {
    if (isOpen) {
      // Không hiển thị gợi ý khi chat đã mở
      setShowSuggestion(false);
      return;
    }

    // Hiển thị gợi ý đầu tiên sau 10 giây
    const initialTimeout = setTimeout(() => {
      setCurrentSuggestion(SUGGESTIONS[suggestionIndex]);
      setShowSuggestion(true);
    }, 10000);

    // Thiết lập interval 30 giây để thay đổi gợi ý
    const interval = setInterval(() => {
      const nextIndex = (suggestionIndex + 1) % SUGGESTIONS.length;
      setSuggestionIndex(nextIndex);
      setCurrentSuggestion(SUGGESTIONS[nextIndex]);
      setShowSuggestion(true);
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isOpen, suggestionIndex]);

  // Ẩn gợi ý khi người dùng đóng
  const hideSuggestion = () => {
    setShowSuggestion(false);
  };

  if (!showSuggestion) {
    return null;
  }

  return (
    <div className="robot-suggestion-bubble">
      <button 
        className="close-suggestion" 
        onClick={hideSuggestion}
        aria-label="Đóng gợi ý"
      >
        <X size={12} />
      </button>
      <p>{currentSuggestion}</p>
    </div>
  );
}
