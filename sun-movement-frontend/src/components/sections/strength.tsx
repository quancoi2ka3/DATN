"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { articleService, Article } from "@/services/articleService";

export function StrengthSection() {
  const [strengthArticle, setStrengthArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrengthContent = async () => {
      try {
        const articles = await articleService.getStrengthTrainingArticles();
        if (articles.length > 0) {
          setStrengthArticle(articles[0]); // Get the first strength article
        }
      } catch (error) {
        console.error('Error fetching strength content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrengthContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
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
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-2">
          {strengthArticle ? strengthArticle.title : "POWER / STRENGTH TRAINING"}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">          <div className="order-2 md:order-1 relative h-[400px] overflow-hidden rounded-lg">
            <Image
              src={strengthArticle?.imageUrl || "https://localhost:5001/images/strength.jpg"}
              alt={strengthArticle?.metaTitle || "Power and Strength Training"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            {strengthArticle ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: strengthArticle.content || strengthArticle.summary 
                }}
              />
            ) : (
              <>
                <p>
                  Sức mạnh có hai loại, đó là Power và Strength.
                </p>
                <p>
                  Power là một sức mạnh lớn được sản sinh sử dụng trong một khoảng thời gian rất ngắn. Strength là sức mạnh tuyệt đối sử dụng trong một khoảng thời gian.
                </p>
                <p>
                  Để có được sức mạnh thì mọi người cần tập luyện để xây dựng và phát triển cơ bắp lớn hơn. Khi cơ bắp được phát triển thì cũng đồng nghĩa với việc bạn có thể giảm mỡ thừa hiệu quả đơn giản, các hoạt động trong cuộc sống cần dùng tới sức sẽ dễ dàng hơn, phòng tránh nhiều cơ đau chấn thương. Sức mạnh thể chất được cải thiện thì sức mạnh về mặt tinh thần cũng được nâng cao, não bộ khỏe mạnh hơn giúp giảm bớt và ngăn chặn nhiều căng thẳng.
                </p>
                <p>
                  Vậy phải làm thế nào để có sức mạnh?
                </p>
                <p>
                  Với những bài tập đẩy, kéo, nâng, đứng lên ngồi xuống với các mức từ từ thấp đến cao giúp xây dựng cơ bắp 1 cách hoàn hảo. Các sợi cơ dần được phát triển lớn hơn giúp sản sinh ra nhiều sức mạnh hơn, đi kèm với những kỹ thuật vận động từ bộ môn Weightlifting có nhiều tính ứng dụng trong cuộc sống, người tập cải thiện sức khỏe tốt hơn.
                </p>
              </>
            )}
            <div className="pt-4">
              <Button variant="link" className="text-sunred p-0 font-medium" asChild>
                <Link href="/dich-vu/strength">Tìm hiểu →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
