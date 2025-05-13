import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-sunred mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Trang không tìm thấy</h2>
      <p className="text-center mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Button className="bg-sunred hover:bg-sunred/90" asChild>
        <Link href="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
}
