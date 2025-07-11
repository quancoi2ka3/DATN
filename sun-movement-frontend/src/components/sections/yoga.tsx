"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { articleService, Article } from "@/services/articleService";

export function YogaSection() {
  const [yogaArticle, setYogaArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYogaContent = async () => {
      try {
        const articles = await articleService.getYogaArticles();
        if (articles.length > 0) {
          setYogaArticle(articles[0]); // Get the first yoga article
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
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-2">
          {yogaArticle ? yogaArticle.title : "MODERN YOGA"}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
            {yogaArticle ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: yogaArticle.content || yogaArticle.summary 
                }}
              />
            ) : (
              <>
                <p>
                  Nhắc tới yoga, hầu hết mọi người sẽ hình dung ngay tới những bài tập yoga uốn dẻo và các tư thế gập người mà người tập là những cô bác trung và cao tuổi tập luyện trong các phòng tập với hình ảnh HLV là người Ấn Độ.
                </p>
                <p>
                  Ngày nay, Yoga đã khác rất nhiều khi có sự kết hợp giữa tính truyền thống của Ấn Độ và tính hiện đại của New York City.
                </p>
                <p>
                  Phương pháp của Yoga ở SUN Movement hội tụ 6 yếu tố: 1) Thiền (meditation) <br />
                  2) Hơi thở (breathing technique) 3) Sức mạnh (strength) <br />
                  4) Dẻo dai (flexibility) 5) Linh hoạt (mobility) <br />
                  6) Âm thanh trị liệu (singing bowl & handpan)
                </p>
                <p>
                  Yoga trở nên phù hợp với cả các bạn nam chứ không còn chỉ cho nữ giới.
                </p>
                <p>
                  Ngoài ý nghĩa tác dụng tới sự dẻo dai và linh hoạt trong vận động/di chuyển hàng ngày, Yoga còn giúp người tập phát triển sức mạnh cơ bắp, cơ thể săn chắc và giảm mỡ thừa hiệu quả.
                </p>
                <p>
                  Yoga coach ở SUN Movement là Viet Yogi - người duy nhất ở Việt Nam từng tổ chức workshops và liên kết với các giáo viên yoga số 1 thế giới hiện giờ như Dylan Werner, Kest Yoga, Action Hiro, Mark Das, Miguel Handbalancing, Two Momento (cựu diễn viên xiếc Cirque du Soleil).
                </p>
              </>
            )}
            <div className="pt-4">
              <Button variant="link" className="text-sunred p-0 font-medium" asChild>
                <Link href="/dich-vu/yoga">Tìm hiểu →</Link>
              </Button>
            </div>
          </div>          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <Image
              src={yogaArticle?.imageUrl || "/images/yoga.jpg"}
              alt={yogaArticle?.metaTitle || "Modern Yoga"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
