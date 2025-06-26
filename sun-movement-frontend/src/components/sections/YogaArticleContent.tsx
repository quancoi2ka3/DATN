"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import { Card, CardContent } from "@/components/ui/card";
import { articleService, Article } from "@/services/articleService";
import { Heart, Users, Star, Clock, Leaf, Moon, Sun } from "lucide-react";

export default function YogaArticleContent() {
  const [yogaArticle, setYogaArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYogaContent = async () => {
      try {
        const articles = await articleService.getYogaArticles();
        if (articles.length > 0) {
          setYogaArticle(articles[0]);
        }
      } catch (error) {
        console.error('Error fetching yoga content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYogaContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-800 rounded w-3/4 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-800 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!yogaArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Nội dung không tìm thấy</h2>
          <p className="text-slate-400">Hiện tại chưa có bài viết về yoga.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              YOGA
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {yogaArticle.title}
              </span>
            </h1>
            {yogaArticle.summary && (
              <p className="text-lg text-slate-300 mb-8">
                {yogaArticle.summary}
              </p>
            )}
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Tác giả: {yogaArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(yogaArticle.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{yogaArticle.viewCount} lượt xem</span>
              </div>
            </div>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal defaultMode="register">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                  Đăng ký tư vấn miễn phí
                </Button>
              </AuthModal>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Xem lịch tập luyện
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      {/* Article Image */}
      {yogaArticle.imageUrl && (
        <div className="container py-8">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl">
            <Image
              src={yogaArticle.imageUrl}
              alt={yogaArticle.metaTitle || yogaArticle.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-ul:text-slate-300 prose-ol:text-slate-300"
            style={{
              '--tw-prose-body': 'rgb(203 213 225)',
              '--tw-prose-headings': 'rgb(255 255 255)',
              '--tw-prose-links': 'rgb(147 51 234)',
              '--tw-prose-strong': 'rgb(255 255 255)',
              '--tw-prose-code': 'rgb(147 51 234)',
            } as any}
            dangerouslySetInnerHTML={{ 
              __html: yogaArticle.content 
            }}
          />
        </div>
      </div>

      {/* Yoga Benefits Section */}
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Lợi ích của Yoga tại Sun Movement
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Thể chất khỏe mạnh</h3>
                <p className="text-slate-400">
                  Tăng cường sức mạnh, độ dẻo dai và sự cân bằng của cơ thể
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Moon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Tinh thần thư thái</h3>
                <p className="text-slate-400">
                  Giảm stress, tăng khả năng tập trung và cân bằng cảm xúc
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Sun className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Sống cân bằng</h3>
                <p className="text-slate-400">
                  Tạo thói quen sống lành mạnh và cân bằng cuộc sống
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Bắt đầu hành trình Yoga của bạn ngay hôm nay
            </h2>            <p className="text-slate-300 mb-6">
              Tham gia cùng Sun Movement để trải nghiệm phương pháp yoga hiện đại, 
              phù hợp với lối sống của bạn.
            </p>
            
            <AuthModal defaultMode="register">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 h-auto rounded-lg font-medium text-lg">
                Đăng ký lớp học thử nghiệm miễn phí
              </Button>
            </AuthModal>
          </div>
        </div>
      </div>

      {/* Tags */}
      {yogaArticle.tags && (
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {yogaArticle.tags.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
