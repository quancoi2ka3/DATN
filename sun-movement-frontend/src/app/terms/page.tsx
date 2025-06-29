"use client";

import { ArrowLeft, FileText, Shield, Users, AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/ui/contact-form";

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Điều Khoản Sử Dụng</h1>
              <p className="text-slate-300 text-lg">Sun Movement - Quy định và điều khoản sử dụng dịch vụ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Bảo Mật</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Cam kết bảo mật thông tin khách hàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Trách Nhiệm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Quyền và trách nhiệm của người dùng
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Tuân Thủ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Các quy định cần tuân thủ khi sử dụng
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

          {/* Terms Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                1. Chấp Nhận Điều Khoản
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Bằng việc truy cập và sử dụng website Sun Movement (sunmovement.vn), bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi</li>
                  <li>• Chúng tôi có quyền thay đổi, sửa đổi các điều khoản này bất cứ lúc nào</li>
                  <li>• Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                2. Định Nghĩa Dịch Vụ
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Sun Movement cung cấp các dịch vụ sau:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Dịch vụ tập luyện:</strong> Calisthenics, Strength Training, Yoga, Lớp tập nhóm</li>
                  <li>• <strong>Huấn luyện cá nhân:</strong> PT 1-1, tư vấn dinh dưỡng</li>
                  <li>• <strong>Bán hàng online:</strong> Thực phẩm bổ sung, quần áo thể thao, thiết bị tập luyện</li>
                  <li>• <strong>Tư vấn sức khỏe:</strong> Đánh giá thể trạng, lập kế hoạch tập luyện</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                3. Tài Khoản Người Dùng
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Đăng ký tài khoản:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Phải đủ 16 tuổi trở lên</li>
                      <li>• Cung cấp thông tin chính xác, đầy đủ</li>
                      <li>• Xác thực email/số điện thoại</li>
                      <li>• Chịu trách nhiệm về tính bảo mật</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Nghĩa vụ người dùng:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Bảo mật thông tin đăng nhập</li>
                      <li>• Không chia sẻ tài khoản</li>
                      <li>• Cập nhật thông tin khi thay đổi</li>
                      <li>• Thông báo nếu tài khoản bị xâm phạm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                4. Quy Định Sử Dụng Dịch Vụ
              </h2>
              <div className="prose prose-slate max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Được phép:</h3>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Sử dụng dịch vụ cho mục đích cá nhân, hợp pháp</li>
                  <li>• Tham gia các hoạt động, sự kiện do Sun Movement tổ chức</li>
                  <li>• Đánh giá, chia sẻ trải nghiệm sử dụng dịch vụ</li>
                  <li>• Liên hệ hỗ trợ khi cần thiết</li>
                </ul>
                
                <h3 className="font-semibold text-slate-800 mb-2">Nghiêm cấm:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>• Gây tổn hại đến hệ thống, server</li>
                  <li>• Sao chép, phân phối nội dung mà không có sự cho phép</li>
                  <li>• Quấy rối, xúc phạm người dùng khác</li>
                  <li>• Đăng tải nội dung không phù hợp</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                5. Thanh Toán và Hoàn Tiền
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Chính sách thanh toán:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Thanh toán trước khi sử dụng dịch vụ</li>
                      <li>• Giá cả được niêm yết công khai</li>
                      <li>• Không hoàn tiền cho gói đã kích hoạt</li>
                      <li>• Ưu đãi có thể thay đổi theo thời gian</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Hoàn tiền:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Chỉ hoàn tiền trong trường hợp lỗi từ Sun Movement</li>
                      <li>• Xử lý hoàn tiền trong 7-15 ngày</li>
                      <li>• Hoàn tiền qua hình thức thanh toán gốc</li>
                      <li>• Không hoàn tiền khi vi phạm điều khoản</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                6. Bảo Mật Thông Tin
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Thu thập dữ liệu:</strong> Chỉ thu thập thông tin cần thiết cho việc cung cấp dịch vụ</li>
                  <li>• <strong>Bảo mật:</strong> Áp dụng các biện pháp bảo mật tiên tiến</li>
                  <li>• <strong>Chia sẻ:</strong> Không chia sẻ thông tin cá nhân với bên thứ ba</li>
                  <li>• <strong>Quyền của người dùng:</strong> Có quyền yêu cầu xóa, sửa đổi dữ liệu cá nhân</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                7. Trách Nhiệm và Giới Hạn
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Trách nhiệm của Sun Movement:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Cung cấp dịch vụ chất lượng cao</li>
                      <li>• Bảo mật thông tin khách hàng</li>
                      <li>• Hỗ trợ khách hàng 24/7</li>
                      <li>• Cập nhật, cải thiện dịch vụ liên tục</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Giới hạn trách nhiệm:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Không chịu trách nhiệm cho thiệt hại gián tiếp</li>
                      <li>• Không đảm bảo dịch vụ hoạt động 100% không lỗi</li>
                      <li>• Không chịu tr책nhiệm cho hành vi của bên thứ ba</li>
                      <li>• Giới hạn bồi thường theo quy định pháp luật</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                8. Chấm Dứt Dịch Vụ
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• Sun Movement có quyền chấm dứt dịch vụ với người dùng vi phạm điều khoản</li>
                  <li>• Người dùng có quyền hủy tài khoản bất cứ lúc nào</li>
                  <li>• Thông báo trước 30 ngày khi ngừng cung cấp dịch vụ</li>
                  <li>• Dữ liệu sẽ được xóa sau 90 ngày kể từ khi chấm dứt</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                9. Luật Áp Dụng
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• Điều khoản này được điều chỉnh bởi pháp luật Việt Nam</li>
                  <li>• Tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Hà Nội</li>
                  <li>• Ưu tiên giải quyết tranh chấp thông qua thương lượng, hòa giải</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Contact Form */}
          <div className="mt-12">
            <ContactForm 
              type="general"
              title="Cần Làm Rõ Điều Khoản Sử Dụng?"
              description="Có thắc mắc về điều khoản? Gửi tin nhắn cho chúng tôi để được giải đáp chi tiết."
            />
          </div>

          {/* Quick Contact Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Liên Hệ Nhanh</h3>
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
