import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

type TestimonialProps = {
  id: string;
  name: string;
  service: string;
  quote: string;
};

const testimonials: TestimonialProps[] = [
  {
    id: "1",
    name: "Minh Hiếu",
    service: "Calisthenics & Yoga",
    quote: "Đã 5 tháng tôi luyện tập ở Sun. Tôi đã đạt được những mục tiêu ban đầu: kéo xà, chống đẩy và ngồi xổm 120kg mà năm ngoái chưa làm được. Coaches ở đây rất chuyên nghiệp, không gian luyện tập đầy đủ trang thiết bị và thân thiện.",
  },
  {
    id: "2",
    name: "Phúc Mai",
    service: "Strength Training",
    quote: "Sau 3 tháng tham gia Sun Movement, tôi đã giảm 4kg mỡ thừa và tăng cơ đáng kể. Các coach rất tận tâm, theo dõi sát sao quá trình luyện tập và điều chỉnh phù hợp với thể trạng. Tôi rất hài lòng với kết quả đạt được.",
  },
  {
    id: "3",
    name: "Hạnh Phương",
    service: "Modern Yoga",
    quote: "Không chỉ giúp tôi linh hoạt hơn, các buổi học yoga ở Sun Movement còn mang đến sự cân bằng tinh thần tuyệt vời. Tôi cảm thấy thư giãn và tràn đầy năng lượng sau mỗi buổi tập. Coach luôn sáng tạo và truyền cảm hứng.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-sunbg">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-12">Hành trình của THÀNH VIÊN</h2>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <QuoteIcon className="h-10 w-10 text-sunred opacity-50" />
                    </div>
                    <blockquote className="text-center text-lg mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.service}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 gap-2">
            <CarouselPrevious className="relative static translate-y-0 bg-sunred hover:bg-sunred/90 text-white" />
            <CarouselNext className="relative static translate-y-0 bg-sunred hover:bg-sunred/90 text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
