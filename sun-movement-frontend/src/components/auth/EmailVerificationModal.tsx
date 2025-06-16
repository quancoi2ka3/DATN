import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Clock, RefreshCw } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer countdown effect
  React.useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Vui lòng nhập mã xác thực 6 chữ số');
      return;
    }

    setLoading(true);
    setError('');

    try {      // Use explicit URL to ensure we hit the correct backend port
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const apiUrl = `${apiBaseUrl}/api/auth/verify-email`;
      
      console.log('Email verification attempt to:', apiUrl);
      console.log('Verification data:', { email, verificationCode });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      });      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Verification success data:', data);
        setSuccess('Email đã được xác thực thành công!');
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 1000);
      } else {
        let errorMessage = 'Mã xác thực không hợp lệ hoặc đã hết hạn';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Verification error data:', data);
            errorMessage = data.message || errorMessage;
          } else {
            const errorText = await response.text();
            console.error('Non-JSON verification error response:', errorText);
            console.error('Full verification error details:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              body: errorText.substring(0, 500)
            });
            
            if (response.status === 500) {
              errorMessage = 'Lỗi máy chủ khi xác thực. Vui lòng thử lại sau.';
            } else if (response.status === 404) {
              errorMessage = 'Không tìm thấy dịch vụ xác thực email.';
            } else {
              errorMessage = `Lỗi xác thực (${response.status}). Vui lòng thử lại.`;
            }
          }
        } catch (parseError) {
          console.error('Error parsing verification response:', parseError);
          errorMessage = 'Lỗi xử lý phản hồi xác thực từ máy chủ.';
        }
        
        setError(errorMessage);
      }    } catch (error: any) {
      console.error('Email verification error:', error);
      setError('Có lỗi xảy ra khi xác thực email. Vui lòng kiểm tra kết nối.');
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {      // Use explicit URL to ensure we hit the correct backend port
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const apiUrl = `${apiBaseUrl}/api/auth/resend-verification`;
      
      console.log('Resend verification attempt to:', apiUrl);
      console.log('Resend data:', { email });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Resend response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Resend success data:', data);
        setSuccess('Mã xác thực đã được gửi lại!');
        setTimeLeft(600); // Reset timer to 10 minutes
      } else {
        let errorMessage = 'Không thể gửi lại mã xác thực';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Resend error data:', data);
            errorMessage = data.message || errorMessage;
          } else {
            const errorText = await response.text();
            console.error('Non-JSON resend error response:', errorText);
            if (response.status === 500) {
              errorMessage = 'Lỗi máy chủ khi gửi lại mã. Vui lòng thử lại sau.';
            }
          }
        } catch (parseError) {
          console.error('Error parsing resend response:', parseError);
        }
        
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setError('Có lỗi xảy ra khi gửi lại mã xác thực. Vui lòng kiểm tra kết nối.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Xác thực email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi mã xác thực 6 chữ số đến email:
            </p>
            <p className="font-semibold text-sm mt-1">{email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">Mã xác thực</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={handleCodeChange}
              className="text-center text-lg tracking-wider"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          {timeLeft > 0 && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Mã hết hạn sau: {formatTime(timeLeft)}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleVerify}
              disabled={loading || !verificationCode || verificationCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Không nhận được mã?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendLoading || timeLeft > 540} // Allow resend after 1 minute
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : (
                  'Gửi lại mã xác thực'
                )}
              </Button>
              {timeLeft > 540 && (
                <p className="text-xs text-gray-500 mt-1">
                  Bạn có thể gửi lại sau {formatTime(timeLeft - 540)}
                </p>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>• Mã xác thực có hiệu lực trong 10 phút</p>
            <p>• Kiểm tra thư mục spam nếu không thấy email</p>
            <p>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
