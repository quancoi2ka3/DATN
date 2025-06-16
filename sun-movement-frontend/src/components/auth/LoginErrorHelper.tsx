"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, UserPlus } from "lucide-react";

interface LoginErrorHelperProps {
  email: string;
  onResendVerification?: () => void;
  onSwitchToRegister?: () => void;
  onClose?: () => void;
}

export default function LoginErrorHelper({ 
  email, 
  onResendVerification, 
  onSwitchToRegister, 
  onClose 
}: LoginErrorHelperProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendVerification = async () => {
    if (!email) return;
    
    setLoading(true);
    setMessage('');
      try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.');
        onResendVerification?.();
      } else {
        setMessage('❌ ' + (data.message || 'Không thể gửi lại email xác thực. Vui lòng thử lại.'));
      }
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-orange-600">
          Cần hoàn tất đăng ký
        </CardTitle>
        <CardDescription className="text-center">
          Tài khoản của bạn chưa được kích hoạt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Email:</strong> {email}
            <br />
            Tài khoản này cần xác thực email để hoàn tất đăng ký. 
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
          </AlertDescription>
        </Alert>

        {message && (
          <Alert variant={message.startsWith('✅') ? 'default' : 'destructive'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Gửi lại email xác thực
              </>
            )}
          </Button>

          {onSwitchToRegister && (
            <Button 
              onClick={onSwitchToRegister}
              variant="secondary"
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Đăng ký tài khoản mới
            </Button>
          )}

          {onClose && (
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Quay lại đăng nhập
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Lưu ý:</strong></p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Kiểm tra cả hộp thư spam/junk mail</li>
            <li>Email xác thực có thể mất vài phút để đến</li>
            <li>Mã xác thực có hiệu lực trong 15 phút</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
