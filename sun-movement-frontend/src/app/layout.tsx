import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./reset.css";
import "./fallback.css";  // Add fallback CSS
import "./globals.css";
// Import critical CSS
import styles from "./critical.module.css";
import { ClientBody } from "./ClientBody";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { EnsureStyles } from "./EnsureStyles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sun Movement - Vận động kiến tạo cuộc sống tốt đẹp hơn",
  description: "Sun Movement là trung tâm thể thao chuyên về calisthenics, power training, và modern yoga tại Hà Nội.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`min-h-screen bg-sunbg flex flex-col ${styles.container}`}>
        <EnsureStyles />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className={`flex-grow ${styles.section}`}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
