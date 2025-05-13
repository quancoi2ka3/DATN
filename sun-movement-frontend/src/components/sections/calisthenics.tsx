import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CalisthenicsSection() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-2">CALISTHENICS</h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
            <p>
              Một môn Thể thao nhiều tính nghệ thuật trong đó, Calisthenics đang ngày càng có giới trẻ và mọi người đón nhận, lựa chọn tham gia tập luyện để hình thành thói quen, thay đổi cuộc sống. Tưởng tượng những kỹ năng, bài tập như kéo xà một tay, hít đất hai tay nâng cả người lên chân không chạm đất, vòn xoay người 360° trên không khí kéo xà sẽ khó đến thế nào.
            </p>
            <p className="font-medium">Nhưng,...</p>
            <p>
              Bắt đầu với những bài tập chuyển động cơ bản mang tính chức năng phù hợp với từng cá nhân, người tập nâng cao dần kỹ thuật tập luyện các bài kéo xà, hít đất, xà kép hình thành những chuyển động khó hơn đòi hỏi nhiều sức mạnh và sự linh hoạt hơn. Với các bài tập sáng tạo nhưng dựa trên sự vận động khoa học, Calisthenics giúp người tập đạt được nhiều kết quả tốt cho phát triển cơ thể, xây dựng cơ bắp, giảm mỡ thừa, tăng thể lực và sức bền, thăng bằng và linh hoạt hơn mà không bị nhàm chán bởi sự đơn điệu của tập luyện hay gò bó phụ thuộc bởi dụng cụ thiết bị.
            </p>
            <p>
              Trên nền nhạc hay sử dụng nhạc để tăng nguồn cảm hứng tập luyện, người tập có thể biến buổi tập của mình thành một buổi nghệ thuật. Calisthenics đang dần trở thành một môn thể thao vận động có tầm ảnh hưởng thay đổi cuộc sống của mọi người.
            </p>
            <p>
              Với đặc tính của bộ môn nên Calisthenis phù hợp với tất cả mọi người, mọi lứa tuổi khác nhau và xuất phát điểm tập luyện khác nhau, chỉ cần bạn có những mục tiêu cụ thể thì Calisthenics đều đáp ứng được hết.
            </p>
            <div className="pt-4">
              <Button variant="link" className="text-sunred p-0 font-medium" asChild>
                <Link href="/dich-vu/calisthenics">Tìm hiểu →</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <Image
              src="/images/calisthenics.jpg"
              alt="Calisthenics"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
