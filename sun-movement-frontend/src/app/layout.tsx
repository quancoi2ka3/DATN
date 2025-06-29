import type { Metadata, Viewport } from "next";
import "./critical.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RasaChatbot } from "@/components/ui/rasa-chatbot";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ScrollToTop, PerformanceMonitor, ResourcePreloader } from "@/components/ui/page-transition";
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
  keywords: "gym, fitness, calisthenics, yoga, strength training, Hà Nội",
  authors: [{ name: "Sun Movement Team" }],
  creator: "Sun Movement",
  publisher: "Sun Movement",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sunmovement.com'),
  openGraph: {
    title: "Sun Movement - Vận động kiến tạo cuộc sống tốt đẹp hơn",
    description: "Trung tâm thể thao chuyên nghiệp với các khóa học calisthenics, power training và modern yoga.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sunmovement.com',
    siteName: "Sun Movement",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sun Movement Fitness Center",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sun Movement - Fitness Center",
    description: "Trung tâm thể thao chuyên nghiệp tại Hà Nội",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Loading component for Suspense boundaries
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Preconnect to same-origin resources */}
        <link rel="preconnect" href={process.env.BACKEND_URL || 'https://localhost:5001'} />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#eb4d3c" />
        
        {/* Performance hints */}
        <link rel="preload" href="/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SF-Pro-Display/SF-Pro-Display-Medium.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        
        {/* Simple scroll progress script */}
        <script src="/scroll-progress.js" defer></script>
      </head>
      <body className="min-h-screen bg-sunbg flex flex-col optimize-text smooth-scroll">
        {/* Enhanced scroll progress bar */}
        <div className="scroll-progress">
          <div className="scroll-progress-bar" id="scroll-progress"></div>
        </div>
        
        <ResourcePreloader />
        <PerformanceMonitor />
        <ScrollToTop />
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
              <RasaChatbot />
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
