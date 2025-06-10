import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SportswearSection } from "@/components/sections/sportswear";

export const metadata: Metadata = {
  title: "Quần áo thể thao | Sun Movement",
  description: "Trang phục và phụ kiện thể thao chất lượng cao, thiết kế riêng cho cộng đồng Sun Movement",
};

// Server-side data fetching function
async function getSportswearProducts() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/products/category/slug/sportswear`, { 
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch sportswear products");
  }
  
  return response.json();
}

export default async function SportswearPage() {
  // Fetch sportswear products
  const products = await getSportswearProducts();
  
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
      <SportswearSection products={products} />
    </main>
  );
}