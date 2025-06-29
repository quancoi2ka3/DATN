"use client";

import { useState, useEffect } from 'react';
import { ScrollAnimation } from './enhanced-animations';

interface NotificationData {
  id: string;
  type: 'purchase' | 'review' | 'signup';
  userName: string;
  productName?: string;
  timeAgo: string;
  location?: string;
}

const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'purchase',
    userName: 'Minh Anh',
    productName: 'Áo Tập Yoga Premium',
    timeAgo: '2 phút trước',
    location: 'Hà Nội'
  },
  {
    id: '2',
    type: 'signup',
    userName: 'Thu Hà',
    timeAgo: '5 phút trước',
    location: 'TP.HCM'
  },
  {
    id: '3',
    type: 'review',
    userName: 'Đức Minh',
    productName: 'Whey Protein Gold',
    timeAgo: '8 phút trước',
    location: 'Đà Nẵng'
  },
  {
    id: '4',
    type: 'purchase',
    userName: 'Lan Anh',
    productName: 'Thảm Yoga Cao Cấp',
    timeAgo: '12 phút trước',
    location: 'Hà Nội'
  },
  {
    id: '5',
    type: 'signup',
    userName: 'Quang Minh',
    timeAgo: '15 phút trước',
    location: 'Cần Thơ'
  }
];

export function RealtimeNotifications() {
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    const showNotification = () => {
      setCurrentNotification(mockNotifications[notificationIndex]);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      setTimeout(() => {
        setNotificationIndex((prev) => (prev + 1) % mockNotifications.length);
      }, 8000);
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000);
    
    // Then show subsequent notifications every 12 seconds
    const interval = setInterval(showNotification, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [notificationIndex]);

  if (!currentNotification || !isVisible) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'review':
        return '⭐';
      case 'signup':
        return '👋';
      default:
        return '🔔';
    }
  };

  const getNotificationText = (notification: NotificationData) => {
    switch (notification.type) {
      case 'purchase':
        return `${notification.userName} vừa mua ${notification.productName}`;
      case 'review':
        return `${notification.userName} vừa đánh giá 5⭐ cho ${notification.productName}`;
      case 'signup':
        return `${notification.userName} vừa tham gia Sun Movement`;
      default:
        return '';
    }
  };

  return (
    <div 
      className={`fixed bottom-6 left-6 z-50 max-w-sm transition-all-smooth ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <ScrollAnimation animation="slide-in-left" className="bg-white rounded-lg shadow-xl border-l-4 border-primary p-4 hover-lift">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">
            {getNotificationIcon(currentNotification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {getNotificationText(currentNotification)}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{currentNotification.timeAgo}</span>
              {currentNotification.location && (
                <>
                  <span>•</span>
                  <span>{currentNotification.location}</span>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors-smooth"
          >
            ✕
          </button>
        </div>
      </ScrollAnimation>
    </div>
  );
}

// Floating action button for quick access
export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`transition-all-smooth ${isExpanded ? 'mb-4' : 'mb-0'}`}>
        {isExpanded && (
          <div className="flex flex-col gap-2 mb-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover-lift transition-all-smooth">
              <span className="text-sm">💬</span>
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover-lift transition-all-smooth">
              <span className="text-sm">📞</span>
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg hover-lift transition-all-smooth">
              <span className="text-sm">📧</span>
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover-lift transition-all-smooth pulse-glow"
      >
        <span className={`text-xl transition-transform ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
          {isExpanded ? '✕' : '⚡'}
        </span>
      </button>
    </div>
  );
}

// Stock counter component
interface StockCounterProps {
  initialStock: number;
  productName: string;
}

export function StockCounter({ initialStock, productName }: StockCounterProps) {
  const [stock, setStock] = useState(initialStock);
  const [isLowStock, setIsLowStock] = useState(initialStock <= 5);

  useEffect(() => {
    // Simulate stock changes
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        setStock(prev => {
          const newStock = Math.max(0, prev - Math.floor(Math.random() * 2 + 1));
          setIsLowStock(newStock <= 5);
          return newStock;
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (stock === 0) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">
        ❌ Tạm hết hàng
      </div>
    );
  }

  return (
    <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all-smooth ${
      isLowStock 
        ? 'bg-orange-100 border border-orange-300 text-orange-800 animate-pulse' 
        : 'bg-green-100 border border-green-300 text-green-800'
    }`}>
      {isLowStock ? '⚠️' : '✅'} Còn lại {stock} sản phẩm
    </div>
  );
}

// Browser activity indicator
export function BrowserActivity() {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15 + 5));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(3, Math.min(25, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
      <div className="flex -space-x-1">
        {[...Array(Math.min(3, viewers))].map((_, i) => (
          <div 
            key={i} 
            className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="font-medium">
        {viewers} người đang xem sản phẩm này
      </span>
    </div>
  );
}
