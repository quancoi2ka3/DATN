"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { articleService, Article } from "@/services/articleService";

export function EventsSection() {
  const [events, setEvents] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events articles from category 5 (Events)
        const eventsArticles = await articleService.getEventsArticles();
        // Filter featured and published articles, limit to 6 for grid layout
        const featuredEvents = eventsArticles
          .filter(article => article.isPublished && article.isFeatured)
          .slice(0, 6);
        setEvents(featuredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Đã cập nhật';
    }
  };

  const getEventPreviewText = (article: Article) => {
    return articleService.getPreviewText(article, 120);
  };

  if (loading) {
    return (
      <section className="py-16 bg-rose-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-rose-50">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            SỰ KIỆN
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các sự kiện nổi bật được tổ chức bởi Sun Movement - 
            đây chỉ là những gì đã thực sự diễn ra với mục đích quảng bá.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.length > 0 ? events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    SỰ KIỆN
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Đã diễn ra
                  </span>
                </div>
                <Image
                  src={event.imageUrl || "/images/event-default.jpg"}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Event Content */}
              <div className="p-4">
                {/* Date and Category */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(event.publishedAt)}</span>
                  {event.tags && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-blue-600 font-medium">{event.tags}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {getEventPreviewText(event)}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{event.viewCount} lượt xem</span>
                  </div>
                  {event.author && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Bởi {event.author}</span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  asChild
                >
                  <Link href={`/su-kien/${event.slug || event.id}`}>
                    Xem chi tiết
                  </Link>
                </Button>
              </div>
            </div>
          )) : (
            // Fallback content when no events available
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sự kiện nào</h3>
                <p className="text-gray-500 mb-4">
                  Hiện tại chưa có sự kiện nào được đăng tải. 
                  Hãy quay lại sau để cập nhật thông tin mới nhất.
                </p>
                <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
                  <Link href="/su-kien">Xem tất cả sự kiện</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {events.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-base font-medium"
              asChild
            >
              <Link href="/su-kien">Xem thêm</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base font-medium"
              asChild
            >
              <Link href="/faq">Câu hỏi thường gặp</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
