import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Sun Movement - Vận động kiến tạo cuộc sống tốt đẹp hơn",
  description: "Sun Movement là trung tâm thể thao chuyên về calisthenics, power training, và modern yoga tại Hà Nội.",
};

// Simple loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Basic favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#eb4d3c" />
      </head>
      <body className="min-h-screen bg-slate-950 flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
