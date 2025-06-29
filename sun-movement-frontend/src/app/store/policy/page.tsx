"use client";

import { ArrowLeft, ShoppingCart, Shield, Truck, RefreshCw, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/ui/contact-form";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/store" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Quay lại cửa hàng
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Chính Sách Mua Hàng</h1>
              <p className="text-slate-300 text-lg">Sun Movement - Quy định và điều khoản mua hàng</p>
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
                <CardTitle className="text-lg">Bảo Hành</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Bảo hành chính hãng cho tất cả sản phẩm
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <Truck className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Giao Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Giao hàng toàn quốc, miễn phí nội thành Hà Nội
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader className="text-center">
                <RefreshCw className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Đổi Trả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center">
                  Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Policy Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                1. Điều Kiện Đặt Hàng
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• Khách hàng phải đủ 18 tuổi hoặc có sự đồng ý của người giám hộ</li>
                  <li>• Thông tin đặt hàng phải chính xác và đầy đủ</li>
                  <li>• Xác nhận đơn hàng qua email hoặc SMS trong vòng 24 giờ</li>
                  <li>• Đơn hàng được xác nhận sau khi thanh toán thành công</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                2. Hình Thức Thanh Toán
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Thanh toán online:</strong> Thẻ ATM, Visa, Mastercard, QR Code</li>
                  <li>• <strong>Chuyển khoản ngân hàng:</strong> Vietcombank, Techcombank, BIDV</li>
                  <li>• <strong>Thanh toán khi nhận hàng (COD):</strong> Áp dụng trong nội thành Hà Nội</li>
                  <li>• <strong>Thanh toán tại cửa hàng:</strong> Tiền mặt hoặc thẻ</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                3. Chính Sách Giao Hàng
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Thời gian giao hàng:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Nội thành Hà Nội: 1-2 ngày</li>
                      <li>• Các tỉnh thành khác: 3-5 ngày</li>
                      <li>• Vùng sâu, vùng xa: 5-7 ngày</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Phí giao hàng:</h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Miễn phí: Đơn hàng từ 500.000đ</li>
                      <li>• Nội thành Hà Nội: 30.000đ</li>
                      <li>• Ngoại thành: 50.000đ</li>
                      <li>• Tỉnh thành khác: 60.000đ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                4. Chính Sách Đổi Trả
              </h2>
              <div className="prose prose-slate max-w-none">
                <h3 className="font-semibold text-slate-800 mb-2">Điều kiện đổi trả:</h3>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>• Có hóa đơn mua hàng hoặc phiếu giao hàng</li>
                  <li>• Thời gian đổi trả trong vòng 7 ngày kể từ ngày nhận hàng</li>
                  <li>• Sản phẩm không thuộc danh mục không được đổi trả</li>
                </ul>
                
                <h3 className="font-semibold text-slate-800 mb-2">Sản phẩm không được đổi trả:</h3>
                <ul className="space-y-1 text-slate-600">
                  <li>• Thực phẩm bổ sung đã mở seal</li>
                  <li>• Sản phẩm đã qua sử dụng</li>
                  <li>• Sản phẩm khuyến mãi, giảm giá trên 50%</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                5. Chính Sách Bảo Hành
              </h2>
              <div className="prose prose-slate max-w-none">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>Thiết bị tập gym:</strong> Bảo hành 12-24 tháng tùy sản phẩm</li>
                  <li>• <strong>Quần áo thể thao:</strong> Đổi mới nếu lỗi sản xuất trong 30 ngày</li>
                  <li>• <strong>Phụ kiện:</strong> Bảo hành 6-12 tháng</li>
                  <li>• Bảo hành không áp dụng cho hư hỏng do sử dụng sai cách</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                6. Quyền và Nghĩa Vụ
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Quyền của khách hàng:</h3>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Được tư vấn sản phẩm miễn phí</li>
                    <li>• Được kiểm tra hàng khi nhận</li>
                    <li>• Được đổi trả theo chính sách</li>
                    <li>• Được bảo mật thông tin cá nhân</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Nghĩa vụ của khách hàng:</h3>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Cung cấp thông tin chính xác</li>
                    <li>• Thanh toán đúng hạn</li>
                    <li>• Sử dụng sản phẩm đúng mục đích</li>
                    <li>• Tuân thủ quy định của cửa hàng</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Information */}
          {/* Contact Form */}
          <div className="mt-12">
            <ContactForm 
              type="general"
              title="Cần Hỗ Trợ Về Chính Sách Mua Hàng?"
              description="Có thắc mắc về chính sách? Gửi tin nhắn cho chúng tôi để được hỗ trợ chi tiết."
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
            <Link href="/store">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
                Tiếp Tục Mua Sắm
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
