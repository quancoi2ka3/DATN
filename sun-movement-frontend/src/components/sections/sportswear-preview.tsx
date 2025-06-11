import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";

interface SportswearSectionProps {
  products?: Product[];
}

export function SportswearSection({ products = [] }: SportswearSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-2">SPORTSWEAR</h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="order-2 md:order-1 space-y-4">
            <p>
              Sun Movement Sportswear không chỉ là trang phục thể thao mà còn là biểu tượng của phong cách và sự thoải mái khi vận động.
            </p>
            <p>
              Với chất liệu cao cấp, thiết kế công thái học và kiểu dáng hiện đại, bộ sưu tập quần áo thể thao của Sun Movement giúp bạn tự tin hơn và tối ưu hiệu suất trong mọi buổi tập.
            </p>
            <p>
              Từ áo thun, quần short đến các phụ kiện như túi đựng đồ, găng tay tập luyện, tất cả đều được thiết kế riêng cho cộng đồng những người đam mê vận động và theo đuổi lối sống khỏe mạnh.
            </p>
            <p>
              Mỗi sản phẩm trong bộ sưu tập đều thể hiện tinh thần "Vận động kiến tạo cuộc sống tốt đẹp hơn" mà Sun Movement hướng tới.
            </p>
            <div className="pt-4">
              <Button variant="link" className="text-sunred p-0 font-medium" asChild>
                <Link href="/store/sportswear">Khám phá →</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[400px] overflow-hidden rounded-lg">
            <Image
              src="/images/sportswear.jpg"
              alt="Sun Movement Sportswear"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}