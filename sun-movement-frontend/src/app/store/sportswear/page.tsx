import { SportswearSection } from "@/components/sections/sportswear";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Quần áo thể thao | Sun Movement",
  description: "Trang phục và phụ kiện thể thao chất lượng cao, thiết kế riêng cho cộng đồng Sun Movement",
};

export default function SportswearPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full container py-6 px-4 md:px-6">
        <Breadcrumbs 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Cửa hàng", href: "/store" },
            { label: "Quần áo thể thao",href: "/store/sportswear" },
          ]} 
        />
      </div>
      <SportswearSection />
    </main>
  );
}
