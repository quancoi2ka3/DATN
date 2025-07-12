"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export function LoginRequiredView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8">
          <div className="text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Yêu cầu đăng nhập
            </h1>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để tiến hành thanh toán. Việc này giúp chúng tôi bảo vệ thông tin đơn hàng và hỗ trợ bạn tốt hơn.
            </p>
            
            <div className="space-y-4">
              <AuthModal defaultMode="login">
                <Button size="lg" className="w-full">
                  Đăng nhập để tiếp tục
                </Button>
              </AuthModal>
              
              <div className="text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <AuthModal defaultMode="register">
                  <button className="text-blue-600 hover:underline">
                    Đăng ký ngay
                  </button>
                </AuthModal>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
