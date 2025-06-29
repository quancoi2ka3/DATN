"use client";

import { ArrowLeft, MapPin, Home, User, Settings, ShoppingCart, Calendar, HelpCircle, FileText, Shield, Store, Coffee, Dumbbell, Users, BookOpen, Star, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap } from "@/components/ui/google-map";

export default function SitemapPage() {
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
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Sitemap</h1>
              <p className="text-slate-300 text-lg">Sun Movement - Bản đồ trang web và vị trí của chúng tôi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Location Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Vị Trí Của Chúng Tôi</h2>
            
            {/* Address Card */}
            <div className="mb-8">
              <Card className="border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Sun Movement Fitness Center</h3>
                      <p className="text-red-600 font-medium">Trung tâm thể dục thể thao hiện đại</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4">Thông tin liên hệ:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-red-500" />
                          <span className="text-slate-700">Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-red-500" />
                          <span className="text-slate-700">08999139393</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-red-500" />
                          <span className="text-slate-700">contact@sunmovement.vn</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Coffee className="h-5 w-5 text-red-500" />
                          <span className="text-slate-700">Giờ mở cửa: 6:00 - 22:00, Thứ 2 - Chủ Nhật</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-4">Cách di chuyển:</h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• <strong>Xe bus:</strong> Tuyến 01, 03, 08, 22 (Dừng Đê La Thành)</li>
                        <li>• <strong>Taxi/Grab:</strong> Đặt đến "300 Đê La Thành nhỏ, Đống Đa"</li>
                        <li>• <strong>Xe máy:</strong> Có bãi gửi xe an toàn</li>
                        <li>• <strong>Ô tô:</strong> Parking tầng hầm tòa nhà</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Google Maps */}
            <div className="mb-8">
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Xem trên Google Maps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap height="400px" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Website Sitemap */}
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Bản Đồ Trang Web</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main Pages */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Home className="h-5 w-5" />
                    Trang Chính
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/" className="text-slate-600 hover:text-red-500 transition-colors">Trang Chủ</Link></li>
                    <li><Link href="/gioi-thieu" className="text-slate-600 hover:text-red-500 transition-colors">Giới Thiệu</Link></li>
                    <li><Link href="/lien-he" className="text-slate-600 hover:text-red-500 transition-colors">Liên Hệ</Link></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Dumbbell className="h-5 w-5" />
                    Dịch Vụ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/dich-vu" className="text-slate-600 hover:text-red-500 transition-colors">Tổng Quan Dịch Vụ</Link></li>
                    <li><Link href="/dich-vu/calisthenics" className="text-slate-600 hover:text-red-500 transition-colors">Calisthenics</Link></li>
                    <li><Link href="/dich-vu/strength" className="text-slate-600 hover:text-red-500 transition-colors">Strength Training</Link></li>
                    <li><Link href="/dich-vu/yoga" className="text-slate-600 hover:text-red-500 transition-colors">Modern Yoga</Link></li>
                    <li><Link href="/dich-vu/group-class" className="text-slate-600 hover:text-red-500 transition-colors">Lớp Tập Nhóm</Link></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Shop */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <ShoppingCart className="h-5 w-5" />
                    Cửa Hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/store" className="text-slate-600 hover:text-red-500 transition-colors">Tổng Quan Shop</Link></li>
                    <li><Link href="/store/supplements" className="text-slate-600 hover:text-red-500 transition-colors">Thực Phẩm Bổ Sung</Link></li>
                    <li><Link href="/store/sportswear" className="text-slate-600 hover:text-red-500 transition-colors">Quần Áo Thể Thao</Link></li>
                    <li><Link href="/store/policy" className="text-slate-600 hover:text-red-500 transition-colors">Chính Sách Mua Hàng</Link></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Account */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <User className="h-5 w-5" />
                    Tài Khoản
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/profile" className="text-slate-600 hover:text-red-500 transition-colors">Hồ Sơ Cá Nhân</Link></li>
                    <li><Link href="/edit-profile" className="text-slate-600 hover:text-red-500 transition-colors">Chỉnh Sửa Hồ Sơ</Link></li>
                    <li><Link href="/change-password" className="text-slate-600 hover:text-red-500 transition-colors">Đổi Mật Khẩu</Link></li>
                    <li><Link href="/settings" className="text-slate-600 hover:text-red-500 transition-colors">Cài Đặt</Link></li>
                    <li><Link href="/notification-settings" className="text-slate-600 hover:text-red-500 transition-colors">Cài Đặt Thông Báo</Link></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Events & Support */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Calendar className="h-5 w-5" />
                    Sự Kiện & Hỗ Trợ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/su-kien" className="text-slate-600 hover:text-red-500 transition-colors">Sự Kiện</Link></li>
                    <li><Link href="/faq" className="text-slate-600 hover:text-red-500 transition-colors">FAQ</Link></li>
                    <li><Link href="/blog" className="text-slate-600 hover:text-red-500 transition-colors">Blog</Link></li>
                    <li><Link href="/tin-tuc" className="text-slate-600 hover:text-red-500 transition-colors">Tin Tức</Link></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Legal & Policies */}
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <FileText className="h-5 w-5" />
                    Pháp Lý & Chính Sách
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><Link href="/terms" className="text-slate-600 hover:text-red-500 transition-colors">Điều Khoản Sử Dụng</Link></li>
                    <li><Link href="/privacy" className="text-slate-600 hover:text-red-500 transition-colors">Chính Sách Bảo Mật</Link></li>
                    <li><Link href="/sitemap" className="text-slate-600 hover:text-red-500 transition-colors">Sitemap</Link></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Hành Động Nhanh</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/store" className="group">
                <Card className="border-red-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Store className="h-8 w-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-slate-800">Mua Sắm</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dich-vu" className="group">
                <Card className="border-red-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Dumbbell className="h-8 w-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-slate-800">Đăng Ký Tập</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/lien-he" className="group">
                <Card className="border-red-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-slate-800">Liên Hệ</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/faq" className="group">
                <Card className="border-red-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <HelpCircle className="h-8 w-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-slate-800">Hỗ Trợ</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Cần Hỗ Trợ Thêm?</h3>
                <p className="mb-6 text-red-100">
                  Đội ngũ Sun Movement luôn sẵn sàng hỗ trợ bạn 24/7
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-white text-red-500 hover:bg-red-50"
                  >
                    <Link href="/lien-he">Liên Hệ Ngay</Link>
                  </Button>
                  <Button 
                    variant="outline"
                    asChild
                    className="border-white text-white hover:bg-white hover:text-red-500"
                  >
                    <a href="tel:08999139393">Gọi Hotline</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
