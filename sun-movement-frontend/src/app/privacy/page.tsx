"use client";

import { ArrowLeft, Shield, Lock, Eye, Database, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContactForm } from "@/components/ui/contact-form";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Chính Sách Bảo Mật</h1>
              <p className="text-slate-300 text-lg">Sun Movement - Cam kết bảo vệ thông tin cá nhân của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-800">
              <strong>Quan trọng:</strong> Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Vui lòng đọc kỹ chính sách này để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
            </AlertDescription>
          </Alert>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Database className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Thu Thập</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Chỉ thu thập thông tin cần thiết
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Lock className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Bảo Mật</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Mã hóa và bảo vệ dữ liệu
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Eye className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Sử Dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Sử dụng đúng mục đích
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Quyền Lợi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Quyền kiểm soát dữ liệu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              <strong>Cập nhật lần cuối:</strong> 27/06/2025
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                1. Giới Thiệu
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Sun Movement (&ldquo;chúng tôi&rdquo;, &ldquo;của chúng tôi&rdquo;) cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng (&ldquo;bạn&rdquo;, &ldquo;của bạn&rdquo;). Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi sử dụng website và dịch vụ của chúng tôi.
                </p>
                <p className="text-slate-600">
                  Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                2. Thông Tin Chúng Tôi Thu Thập
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Thông tin cá nhân:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Họ tên, tuổi, giới tính</li>
                      <li>• Email, số điện thoại</li>
                      <li>• Địa chỉ giao hàng</li>
                      <li>• Thông tin thanh toán</li>
                      <li>• Ảnh đại diện (tùy chọn)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Thông tin sức khỏe:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Chiều cao, cân nặng</li>
                      <li>• Tình trạng sức khỏe</li>
                      <li>• Mục tiêu tập luyện</li>
                      <li>• Lịch sử chấn thương</li>
                      <li>• Thông tin y tế khác</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-800 mb-2">Thông tin kỹ thuật:</h3>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Địa chỉ IP, loại trình duyệt</li>
                    <li>• Thời gian truy cập, trang đã xem</li>
                    <li>• Cookies và công nghệ theo dõi tương tự</li>
                    <li>• Thông tin thiết bị (hệ điều hành, màn hình)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                3. Cách Chúng Tôi Sử Dụng Thông Tin
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Cung cấp dịch vụ:</strong> Xử lý đăng ký, quản lý tài khoản, cung cấp dịch vụ tập luyện</li>
                  <li>• <strong>Cá nhân hóa:</strong> Đề xuất chương trình tập luyện phù hợp, sản phẩm liên quan</li>
                  <li>• <strong>Liên lạc:</strong> Gửi thông báo, cập nhật dịch vụ, hỗ trợ khách hàng</li>
                  <li>• <strong>Thanh toán:</strong> Xử lý giao dịch, hóa đơn, hoàn tiền</li>
                  <li>• <strong>Cải thiện dịch vụ:</strong> Phân tích sử dụng, phát triển tính năng mới</li>
                  <li>• <strong>Bảo mật:</strong> Phát hiện gian lận, ngăn chặn vi phạm</li>
                  <li>• <strong>Tuân thủ pháp luật:</strong> Đáp ứng yêu cầu pháp lý, bảo vệ quyền lợi</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                4. Chia Sẻ Thông Tin
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, ngoại trừ các trường hợp sau:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Nhà cung cấp dịch vụ:</strong> Đối tác hỗ trợ xử lý thanh toán, giao hàng</li>
                  <li>• <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền</li>
                  <li>• <strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền, tài sản, an toàn của chúng tôi và người dùng</li>
                  <li>• <strong>Sự đồng ý:</strong> Khi có sự đồng ý rõ ràng từ bạn</li>
                  <li>• <strong>Sáp nhập/mua lại:</strong> Trong trường hợp sáp nhập, mua lại doanh nghiệp</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                5. Bảo Mật Thông Tin
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Bảo mật kỹ thuật:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Mã hóa SSL/TLS cho truyền tải dữ liệu</li>
                      <li>• Mã hóa cơ sở dữ liệu</li>
                      <li>• Tường lửa và hệ thống phát hiện xâm nhập</li>
                      <li>• Sao lưu dữ liệu định kỳ</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Bảo mật tổ chức:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Kiểm soát truy cập nghiêm ngặt</li>
                      <li>• Đào tạo nhân viên về bảo mật</li>
                      <li>• Quy trình xử lý sự cố bảo mật</li>
                      <li>• Audit và đánh giá bảo mật định kỳ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                6. Cookies và Công Nghệ Theo Dõi
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện trải nghiệm người dùng:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Cookies cần thiết:</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Đăng nhập và xác thực</li>
                      <li>• Bảo mật và ngăn chặn gian lận</li>
                      <li>• Lưu giỏ hàng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Cookies chức năng:</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Ghi nhớ tùy chọn</li>
                      <li>• Cá nhân hóa nội dung</li>
                      <li>• Hỗ trợ tính năng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Cookies phân tích:</h3>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      <li>• Google Analytics</li>
                      <li>• Phân tích lưu lượng</li>
                      <li>• Cải thiện dịch vụ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                7. Quyền Của Bạn
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Bạn có các quyền sau đối với thông tin cá nhân của mình:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Quyền truy cập và kiểm soát:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Xem thông tin cá nhân chúng tôi lưu trữ</li>
                      <li>• Cập nhật, sửa đổi thông tin</li>
                      <li>• Yêu cầu xóa tài khoản</li>
                      <li>• Rút lại sự đồng ý</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Quyền khiếu nại:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Phản hồi về việc xử lý dữ liệu</li>
                      <li>• Yêu cầu giải thích cách sử dụng</li>
                      <li>• Khiếu nại với cơ quan chức năng</li>
                      <li>• Yêu cầu bồi thường thiệt hại</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                8. Lưu Trữ Dữ Liệu
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Thời gian:</strong> Lưu trữ chỉ trong thời gian cần thiết cho mục đích đã nêu</li>
                  <li>• <strong>Tài khoản hoạt động:</strong> Lưu trữ trong suốt thời gian tài khoản còn hoạt động</li>
                  <li>• <strong>Tài khoản bị xóa:</strong> Xóa hoàn toàn sau 90 ngày kể từ ngày xóa tài khoản</li>
                  <li>• <strong>Dữ liệu giao dịch:</strong> Lưu trữ theo quy định pháp luật về kế toán (5 năm)</li>
                  <li>• <strong>Logs hệ thống:</strong> Lưu trữ 12 tháng cho mục đích bảo mật và troubleshooting</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                9. Trẻ Em và Quyền Riêng Tư
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi</li>
                  <li>• Không cố ý thu thập thông tin cá nhân của trẻ em dưới 16 tuổi</li>
                  <li>• Nếu phát hiện có thu thập thông tin trẻ em, chúng tôi sẽ xóa ngay lập tức</li>
                  <li>• Phụ huynh có thể liên hệ để yêu cầu xóa thông tin con em mình</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                10. Thay Đổi Chính Sách
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian</li>
                  <li>• Thông báo trước 30 ngày về những thay đổi quan trọng</li>
                  <li>• Đăng bản cập nhật trên website với ngày hiệu lực</li>
                  <li>• Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận thay đổi</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Contact Form */}
          <div className="mt-12">
            <ContactForm 
              type="feedback"
              title="Có Thắc Mắc Về Chính Sách Bảo Mật?"
              description="Gửi yêu cầu hoặc phản hồi về chính sách bảo mật của chúng tôi."
            />
          </div>

          {/* Privacy Officer Contact */}
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Liên Hệ Về Quyền Riêng Tư</h3>
            <div className="text-center space-y-2">
              <p className="text-slate-600">
                <strong>Hotline:</strong> 08999139393 (chỉ nhận thông tin)
              </p>
              <p className="text-slate-600">
                <strong>Email:</strong> contact@sunmovement.vn
              </p>
              <p className="text-slate-600">
                <strong>Địa chỉ:</strong> Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội
              </p>
              <div className="pt-4">
                <a
                  href="https://m.me/sunmovementofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat Messenger (Hỏi đáp nhanh)
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
                Về Trang Chủ
              </Button>
            </Link>
            <Link href="/lien-he">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3">
                Liên Hệ Hỗ Trợ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
