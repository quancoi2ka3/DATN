"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MessageCircle, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
  type?: 'general' | 'feedback';
  title?: string;
  description?: string;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function ContactForm({ 
  type = 'general', 
  title,
  description,
  className = "" 
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Tin nhắn đã được gửi thành công!'
        });
        setFormData(initialFormData);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Có lỗi xảy ra khi gửi tin nhắn.'
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Có lỗi kết nối. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectOptions = () => {
    if (type === 'feedback') {
      return [
        { value: '', label: 'Chọn loại phản hồi' },
        { value: 'bug', label: 'Báo lỗi website/app' },
        { value: 'feature', label: 'Đề xuất tính năng mới' },
        { value: 'service-complaint', label: 'Khiếu nại dịch vụ' },
        { value: 'service-compliment', label: 'Khen ngợi dịch vụ' },
        { value: 'business-inquiry', label: 'Yêu cầu hợp tác kinh doanh' },
        { value: 'special-request', label: 'Yêu cầu đặc biệt khác' },
      ];
    }
    
    return [
      { value: '', label: 'Chọn chủ đề' },
      { value: 'membership', label: 'Đăng ký thành viên' },
      { value: 'class-info', label: 'Thông tin lớp học' },
      { value: 'schedule', label: 'Lịch tập và thời gian' },
      { value: 'pricing', label: 'Bảng giá dịch vụ' },
      { value: 'event', label: 'Sự kiện' },
      { value: 'product', label: 'Sản phẩm supplements/sportswear' },
      { value: 'other', label: 'Khác' },
    ];
  };

  const defaultTitle = type === 'feedback' 
    ? 'Gửi Phản Hồi Chính Thức' 
    : 'Gửi Tin Nhắn Cho Chúng Tôi';
    
  const defaultDescription = type === 'feedback'
    ? 'Cho các phản hồi chính thức, khiếu nại, hoặc yêu cầu đặc biệt cần được xử lý bởi ban quản lý.'
    : 'Điền thông tin bên dưới và chúng tôi sẽ phản hồi qua email sớm nhất có thể.';

  return (
    <Card className={`${className} border-red-100`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mail className="h-5 w-5 text-red-500" />
          {title || defaultTitle}
        </CardTitle>
        {description && (
          <p className="text-slate-600 text-sm">{description}</p>
        )}
        {!description && (
          <p className="text-slate-600 text-sm">{defaultDescription}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Status Messages */}
        {submitStatus.type && (
          <Alert className={`mb-6 ${
            submitStatus.type === 'success' 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription className={
              submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Nhập họ và tên của bạn"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="email@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-slate-700">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="0999 123 456"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-slate-700">
                {type === 'feedback' ? 'Loại phản hồi' : 'Chủ đề'}
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                disabled={isSubmitting}
              >
                {getSubjectOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-700">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-vertical"
              placeholder={
                type === 'feedback' 
                  ? 'Mô tả chi tiết vấn đề hoặc yêu cầu của bạn...'
                  : 'Nhập tin nhắn của bạn...'
              }
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gửi {type === 'feedback' ? 'Phản Hồi' : 'Tin Nhắn'}
              </>
            )}
          </Button>
        </form>

        {/* Alternative Contact Methods */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Hoặc liên hệ nhanh qua:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              asChild
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <a 
                href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Messenger (Hỏi đáp nhanh)
              </a>
            </Button>
            
            <div className="flex items-center text-sm text-slate-600">
              <span className="mr-2">📞</span>
              <span>Hotline: 08999139393</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
