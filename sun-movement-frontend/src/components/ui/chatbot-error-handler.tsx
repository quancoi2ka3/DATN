"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ChatbotErrorHandlerProps {
  onRetry: () => void;
}

export function ChatbotErrorHandler({ onRetry }: ChatbotErrorHandlerProps) {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="font-semibold text-lg mb-2">Không thể kết nối trợ lý</h3>
      <p className="text-gray-600 text-sm text-center mb-4">
        Trợ lý ảo hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua các phương thức khác.
      </p>
      <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Thử lại
      </Button>
    </div>
  );
}
