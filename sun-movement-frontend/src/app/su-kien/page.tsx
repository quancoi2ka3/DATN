"use client";

import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter, 
  ChevronDown, 
  CalendarClock, 
  ArrowRight,
  Tag,
  Info,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import { articleService, Article } from "@/services/articleService";

export default function EventsPage() {
  const [events, setEvents] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events articles from category 5 (Events)
        const eventsArticles = await articleService.getEventsArticles();
        // Filter published articles
        const publishedEvents = eventsArticles.filter(article => article.isPublished);
        setEvents(publishedEvents);
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
    return articleService.getPreviewText(article, 150);
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.tags && event.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get featured events
  const featuredEvents = filteredEvents.filter(event => event.isFeatured).slice(0, 3);

  // Get recent events (excluding featured)
  const recentEvents = filteredEvents
    .filter(event => !event.isFeatured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 9);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Loading skeleton */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black py-24">
          <div className="container relative z-10">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-slate-900 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10">
          <Breadcrumbs 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sự kiện", href: "/su-kien" }
            ]} 
            className="mb-8 text-slate-400"
          />
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              SUN MOVEMENT EVENTS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Sự kiện & Workshop<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                đã diễn ra
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Khám phá các sự kiện, workshop và hoạt động đã được tổ chức bởi đội ngũ 
              Sun Movement. Đây là những khoảnh khắc đáng nhớ trong hành trình phát triển cộng đồng của chúng tôi.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <SearchBar 
                placeholder="Tìm kiếm sự kiện..." 
                value={searchQuery}
                onChange={setSearchQuery}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Filter className="w-4 h-4" />
              <span>Kết quả tìm kiếm cho: "{searchQuery}" ({filteredEvents.length} sự kiện)</span>
            </div>
          </div>
        )}

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white">Sự kiện nổi bật</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {featuredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-60 md:h-full overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        Nổi bật
                      </div>
                      <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-sm font-medium px-2 py-1 rounded">
                        SỰ KIỆN
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30 z-10"></div>
                      <Image
                        src={event.imageUrl || "/images/event-default.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="p-6 md:col-span-2 flex flex-col">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {event.tags && event.tags.split(',').map(tag => (
                          <span key={tag.trim()} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-slate-300 mb-5">
                        {getEventPreviewText(event)}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-400 mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-red-500" />
                          <span>{formatDate(event.publishedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-red-500" />
                          <span>{event.viewCount} lượt xem</span>
                        </div>
                        {event.author && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                            <span>Bởi {event.author}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <Button 
                          className="bg-red-500 hover:bg-red-600 text-white"
                          asChild
                        >
                          <Link href={`/su-kien/${event.slug || event.id}`}>
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Events Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Các sự kiện gần đây</h2>
            <div className="text-sm text-slate-400">
              {recentEvents.length} sự kiện
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded">
                    Đã diễn ra
                  </div>
                  <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-sm font-medium px-2 py-1 rounded">
                    SỰ KIỆN
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  <Image
                    src={event.imageUrl || "/images/event-default.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {event.tags && event.tags.split(',').slice(0, 3).map(tag => (
                      <span key={tag.trim()} className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {getEventPreviewText(event)}
                  </p>
                  
                  <div className="space-y-2 text-xs text-slate-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-red-500" />
                      <span>{formatDate(event.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-2 text-red-500" />
                      <span>{event.viewCount} lượt xem</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-red-500"
                      asChild
                    >
                      <Link href={`/su-kien/${event.slug || event.id}`}>
                        Xem chi tiết
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {searchQuery ? "Không tìm thấy sự kiện nào" : "Chưa có sự kiện nào"}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery 
                ? "Hãy thử từ khóa khác hoặc xóa bộ lọc để xem tất cả sự kiện."
                : "Hiện tại chưa có sự kiện nào được đăng tải. Hãy quay lại sau để cập nhật thông tin mới nhất."
              }
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Đăng ký nhận thông báo</h3>
            <p className="text-slate-300 mb-6">
              Để không bỏ lỡ các sự kiện và workshop mới nhất từ Sun Movement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
              />
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
