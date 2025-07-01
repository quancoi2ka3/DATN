"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

interface ChatbotErrorHandlerProps {
  onRetry: () => void;
}

export function ChatbotErrorHandler({ onRetry }: ChatbotErrorHandlerProps) {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <div className="relative w-24 h-24 mb-4">
        <Image 
          src="/images/chatbot-robot.svg" 
          alt="Robot Assistant" 
          width={96}
          height={96}
          className="opacity-50"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 rounded-full p-2">
          <div className="text-red-500 text-lg font-bold">!</div>
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-2">Không thể kết nối trợ lý</h3>
      <p className="text-gray-600 text-sm text-center mb-4">
        Trợ lý ảo hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua các phương thức khác.
      </p>
      <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 bg-red-50 border-red-200 text-red-500 hover:bg-red-100">
        <RefreshCw className="h-4 w-4" />
        Thử lại kết nối
      </Button>
    </div>
  );
}
