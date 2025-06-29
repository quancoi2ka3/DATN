"use client";

import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/ui/google-map";
import { ContactForm } from "@/components/ui/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy chọn cách liên hệ phù hợp nhất.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Contact Methods Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MessageCircle className="h-6 w-6" />
                Messenger - Hỏi Đáp Nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Phù hợp cho các câu hỏi về sản phẩm, dịch vụ, sự kiện, lịch tập. 
                Nhận phản hồi ngay lập tức trong giờ hành chính.
              </p>
              <ul className="text-sm text-slate-600 mb-6 space-y-1">
                <li>• Thông tin sản phẩm supplements, sportswear</li>
                <li>• Hỏi về lịch tập, đăng ký lớp học</li>
                <li>• Tư vấn gói tập phù hợp</li>
                <li>• Thông tin sự kiện, khuyến mãi</li>
              </ul>
              <Button 
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a 
                  href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin qua Messenger
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Mail className="h-6 w-6" />
                Email - Liên Hệ Chính Thức
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Dành cho phản hồi chính thức, khiếu nại, yêu cầu đặc biệt cần được 
                xử lý bởi ban quản lý.
              </p>
              <ul className="text-sm text-slate-600 mb-6 space-y-1">
                <li>• Báo lỗi website/ứng dụng</li>
                <li>• Khiếu nại hoặc khen ngợi dịch vụ</li>
                <li>• Yêu cầu hợp tác kinh doanh</li>
                <li>• Các vấn đề cần xử lý đặc biệt</li>
              </ul>
              <Button 
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Send className="h-4 w-4 mr-2" />
                Điền form bên dưới
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">Thông tin liên hệ</h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Điện thoại</p>
                    <span className="text-slate-600">08999139393</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <span className="text-slate-600">contact@sunmovement.vn</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Địa chỉ</p>
                    <address className="text-slate-600 not-italic">
                      Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội
                    </address>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Giờ hoạt động</p>
                    <p className="text-slate-600">6:00 - 22:00, Thứ 2 - Chủ Nhật</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <GoogleMap height={300} />
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form">
            <ContactForm 
              type="general"
              title="Gửi Tin Nhắn Qua Email"
              description="Điền thông tin bên dưới và chúng tôi sẽ phản hồi qua email trong vòng 24 giờ."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
