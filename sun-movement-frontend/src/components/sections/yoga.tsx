import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function YogaSection() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-2">MODERN YOGA</h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
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
            <div className="pt-4">
              <Button variant="link" className="text-sunred p-0 font-medium" asChild>
                <Link href="/dich-vu/yoga">Tìm hiểu →</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <Image
              src="/images/yoga.jpg"
              alt="Modern Yoga"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
