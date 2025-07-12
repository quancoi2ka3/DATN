"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface OrderSuccessViewProps {
  orderId?: string;
}

export function OrderSuccessView({ orderId }: OrderSuccessViewProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="p-8">
          <Alert className="bg-green-50 border-green-200 mb-6">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Đặt hàng thành công!</AlertTitle>
            <AlertDescription className="text-green-700">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.
              {orderId && <p className="font-semibold mt-2">Mã đơn hàng: {orderId}</p>}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/')}
              size="lg"
            >
              Tiếp tục mua sắm
            </Button>
            {orderId && (
              <Button 
                variant="outline"
                size="lg"
                onClick={() => router.push(`/orders/${orderId}`)}
              >
                Xem chi tiết đơn hàng
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
