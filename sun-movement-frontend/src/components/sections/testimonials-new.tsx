"use client";

import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { articleService, Article } from "@/services/articleService";

// Helper function to extract YouTube URL from content
const extractYouTubeUrl = (content: string): string | null => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = content.match(youtubeRegex);
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
};

// Helper function to get YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

type TestimonialProps = {
  id: string;
  name: string;
  service: string;
  quote: string;
  youtubeUrl?: string;
  videoTitle?: string;
  duration?: string;
};

// Default testimonials as fallback with YouTube videos
const defaultTestimonials: TestimonialProps[] = [
  {
    id: "1",
    name: "Minh Hiếu",
    service: "Calisthenics & Yoga",
    quote: "Xuất phát từ 1 chàng trai có thân hình khá nặng nề và không thể kéo được xà (Pull up). Nhưng chỉ cần 3 tháng tập luyện nghiêm túc, kỷ luật và cố gắng, Hiếu có thể làm được 10 Muscle Up. Một điều tưởng chừng không thể...",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1",
    videoTitle: "Tập 10 Muscle ups trong 3 tháng từ 0 | hít xà",
    duration: "03 tháng"
  },
  {
    id: "2", 
    name: "Duy Anh",
    service: "Calisthenics",
    quote: "Chàng trai 'kém may mắn' và cơ duyên với Calisthenics. Là 1 anh chàng gặp phải nhiều biến cố về sức khỏe nhưng luôn lạc quan, Duy Anh tìm thấy niềm vui, đam mê và ý do để cố gắng với Calisthenics...",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2", 
    videoTitle: "Chàng trai 'kém may mắn' và cơ duyên với Calisthenics",
    duration: "Hành trình"
  },
  {
    id: "3",
    name: "Nam Phạm", 
    service: "Strength Training",
    quote: "Là 1 anh chàng thực sự nghiêm túc trong tập luyện nhưng gặp phải chấn thương do còn thiếu kiến thức. Không chịu đựng lại, Nam đã viết lên hành trình vượt lên chính mình sau sự cố chấn thương dai dẳng...",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3",
    videoTitle: "Hành trình vượt lên chính mình",
    duration: "Vượt lên chính mình"
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonialContent = async () => {
      try {
        // Try to get testimonial articles from the CustomerReviews category
        const articles = await articleService.getTestimonialsArticles();
        if (articles.length > 0) {
          // Convert articles to testimonials format with YouTube support
          const testimonialData = articles.slice(0, 3).map((article: Article, index: number) => {
            const youtubeUrl = extractYouTubeUrl(article.content) || extractYouTubeUrl(article.summary || '');
            return {
              id: article.id.toString(),
              name: article.author || `Thành viên ${index + 1}`,
              service: article.tags || "Sun Movement",
              quote: articleService.getPreviewText(article, 200),
              youtubeUrl: youtubeUrl || undefined,
              videoTitle: article.title,
              duration: article.metaKeywords || "Hành trình"
            };
          });
          setTestimonials(testimonialData);
          console.log('Loaded testimonials from API:', testimonialData.length);
        } else {
          console.log('No testimonial articles found, using default testimonials');
        }
        // If no testimonial articles found, keep default testimonials
      } catch (error) {
        console.error('Error fetching testimonial content:', error);
        // Keep default testimonials on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonialContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-sunbg">
        <div className="container">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Hành trình của <span className="text-sunred">THÀNH VIÊN</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-sunbg">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Hành trình của <span className="text-sunred">THÀNH VIÊN</span>
        </h2>

        {/* Grid layout for YouTube video testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="group">
              {/* Video Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* YouTube Video Thumbnail */}
                {testimonial.youtubeUrl ? (
                  <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden cursor-pointer"
                       onClick={() => window.open(testimonial.youtubeUrl, '_blank')}>
                    <img 
                      src={getYouTubeThumbnail(testimonial.youtubeUrl)}
                      alt={testimonial.videoTitle || testimonial.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to default thumbnail if YouTube thumbnail fails
                        e.currentTarget.src = "https://localhost:5001/images/video-placeholder.jpg";
                      }}
                    />
                    
                    {/* YouTube Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    {testimonial.duration && (
                      <div className="absolute top-3 left-3 bg-sunred text-white px-2 py-1 rounded text-sm font-medium">
                        {testimonial.duration}
                      </div>
                    )}
                    
                    {/* YouTube Logo */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      YouTube
                    </div>
                  </div>
                ) : (
                  /* Fallback image for non-video testimonials */
                  <div className="aspect-video bg-gradient-to-br from-sunred to-orange-500 flex items-center justify-center">
                    <QuoteIcon className="h-12 w-12 text-white opacity-50" />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {/* Video Title */}
                  {testimonial.videoTitle && (
                    <h3 className="font-bold text-lg mb-3 text-gray-800 line-clamp-2 leading-tight">
                      {testimonial.videoTitle}
                    </h3>
                  )}
                  
                  {/* Member Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-sunred rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.service}</p>
                    </div>
                  </div>
                  
                  {/* Quote/Description */}
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {testimonial.quote}
                  </p>
                  
                  {/* Watch Button */}
                  {testimonial.youtubeUrl && (
                    <button 
                      onClick={() => window.open(testimonial.youtubeUrl, '_blank')}
                      className="mt-4 w-full bg-sunred hover:bg-sunred/90 text-white py-2 px-4 rounded-lg transition-colors duration-300 font-medium text-sm"
                    >
                      Xem hành trình →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hash tag */}
        <div className="text-center mt-8">
          <p className="text-sunred font-medium text-lg">#MemberOfSunMovement</p>
        </div>
      </div>
    </section>
  );
}
