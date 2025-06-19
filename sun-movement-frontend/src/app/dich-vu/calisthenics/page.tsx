import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Clock, ChevronRight, CheckCircle2, ArrowRight, Calendar } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function CalisthenicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              CALISTHENICS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Làm chủ cơ thể với<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                nghệ thuật Calisthenics
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Phát triển sức mạnh, linh hoạt và thẩm mỹ cơ thể thông qua các bài tập với trọng lượng cơ thể.
              Không cần thiết bị phức tạp, chỉ cần quyết tâm và kỹ thuật đúng.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal defaultMode="register">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                  Đăng ký tư vấn miễn phí
                </Button>
              </AuthModal>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Xem lịch tập luyện
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      {/* What is Calisthenics */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Calisthenics là gì?</h2>
            <p className="text-slate-300 mb-4">
              Calisthenics là phương pháp tập luyện sử dụng trọng lượng cơ thể để phát triển sức mạnh, 
              sự linh hoạt và khả năng kiểm soát cơ thể. Bắt nguồn từ Hy Lạp cổ đại, Calisthenics đã phát 
              triển thành một hình thức rèn luyện hiện đại kết hợp nghệ thuật và thể thao.
            </p>
            <p className="text-slate-300 mb-6">
              Tại Sun Movement, chúng tôi tiếp cận Calisthenics như một hành trình toàn diện - từ những 
              bài tập cơ bản như hít đất, chống đẩy, kéo xà đến các kỹ thuật nâng cao như human flag, 
              planche, và muscle up.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Phát triển sức mạnh thực tế, ứng dụng cao</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Tăng cường sự linh hoạt và kiểm soát cơ thể</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Rèn luyện kỹ năng vận động, cân bằng và phối hợp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Có thể tập luyện mọi lúc, mọi nơi với ít thiết bị</span>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-auto rounded-lg font-medium">
              Khám phá thêm <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
            <Image 
              src="https://localhost:5001/images/calisthenics.jpg" 
              alt="Calisthenics training at Sun Movement" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Chương trình Calisthenics</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cung cấp các chương trình Calisthenics phù hợp với mọi cấp độ, từ người mới bắt đầu 
              đến vận động viên chuyên nghiệp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Calisthenics Cơ bản</h3>
                  <p className="text-sm text-blue-400">Dành cho người mới bắt đầu</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Học các kỹ thuật nền tảng và xây dựng sức mạnh cơ bản với trọng lượng cơ thể. Tập trung vào 
                  pull-up, push-up, dip, squat cùng các biến thể.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">2 buổi/tuần - 90 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Nhóm nhỏ (tối đa 8 người)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Đánh giá tiến độ hàng tháng</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Calisthenics Nâng cao</h3>
                  <p className="text-sm text-blue-400">Cấp độ trung cấp</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Nâng cao kỹ năng với các bài tập chuyên sâu như muscle-up, handstand, front lever, và human flag.
                  Phát triển kỹ thuật và sức mạnh chuyên biệt.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">3 buổi/tuần - 90 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Nhóm nhỏ (tối đa 6 người)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Lộ trình cá nhân hóa</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-blue-700 to-cyan-700"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Calisthenics Elite</h3>
                  <p className="text-sm text-blue-400">Chuyên nghiệp</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Chương trình dành cho vận động viên muốn hoàn thiện các kỹ thuật cao cấp như planche, 
                  one arm pull-up và các động tác kết hợp phức tạp.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">4 buổi/tuần - 120 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Huấn luyện 1-1 hoặc nhóm nhỏ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Phân tích video và đánh giá chuyên sâu</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trainers */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Đội ngũ huấn luyện viên</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Các huấn luyện viên Calisthenics tại Sun Movement đều có chứng chỉ quốc tế và 
            nhiều năm kinh nghiệm trong lĩnh vực tập luyện với trọng lượng cơ thể.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/30">            <div className="relative h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              <Image 
                src="http://localhost:5000/images/calisthenics.jpg" 
                alt="Huấn luyện viên Calisthenics" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Nguyễn Văn A</h3>
              <p className="text-blue-500 mb-4">Head Coach Calisthenics</p>
              <p className="text-slate-300 mb-4">
                10+ năm kinh nghiệm, chứng chỉ chuyên môn quốc tế, từng tham gia nhiều giải đấu 
                Calisthenics trong và ngoài nước.
              </p>
              <div className="flex items-center">
                <span className="text-slate-400 text-sm">Lịch dạy:</span>
                <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 4, Thứ 7</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/30">            <div className="relative h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              <Image 
                src="http://localhost:5000/images/calisthenics.jpg" 
                alt="Huấn luyện viên Calisthenics" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Trần Thị B</h3>
              <p className="text-blue-500 mb-4">Senior Calisthenics Coach</p>
              <p className="text-slate-300 mb-4">
                8 năm kinh nghiệm huấn luyện, chuyên về các kỹ thuật nâng cao và xây dựng lộ trình cá nhân hóa 
                cho người tập.
              </p>
              <div className="flex items-center">
                <span className="text-slate-400 text-sm">Lịch dạy:</span>
                <span className="text-slate-300 text-sm ml-2">Thứ 3, Thứ 5, Chủ Nhật</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/30">            <div className="relative h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              <Image 
                src="http://localhost:5000/images/calisthenics.jpg" 
                alt="Huấn luyện viên Calisthenics" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Lê Văn C</h3>
              <p className="text-blue-500 mb-4">Calisthenics Coach</p>
              <p className="text-slate-300 mb-4">
                Chuyên gia về Calisthenics cơ bản và phát triển nền tảng vững chắc cho người mới bắt đầu, 
                với 5 năm kinh nghiệm.
              </p>
              <div className="flex items-center">
                <span className="text-slate-400 text-sm">Lịch dạy:</span>
                <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 4, Thứ 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Lịch tập Calisthenics</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cung cấp nhiều khung giờ tập luyện linh hoạt để phù hợp với lịch trình của bạn.
            </p>
          </div>
          
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-700/50">
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thời gian</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 2</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 3</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 4</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 5</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 6</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Thứ 7</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-white">Chủ nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-white">07:00 - 08:30</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-white">09:00 - 10:30</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-600/10">Nâng cao</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-600/10">Nâng cao</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-600/10">Nâng cao</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-white">18:00 - 19:30</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-500/10">Cơ bản</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-white">19:45 - 21:15</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-600/10">Nâng cao</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-600/10">Nâng cao</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-white">20:00 - 22:00</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-700/10">Elite</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-700/10">Elite</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-700/10">Elite</td>
                    <td className="py-3 px-4 text-sm text-slate-300 bg-blue-700/10">Elite</td>
                    <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
            <div className="mt-8 text-center">
            <AuthModal defaultMode="register">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 h-auto rounded-lg font-medium text-lg">
                <Calendar className="mr-2 h-5 w-5" /> Đặt lịch học thử miễn phí
              </Button>
            </AuthModal>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình Calisthenics của bạn?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Tham gia ngay để khám phá sức mạnh và khả năng tiềm ẩn của cơ thể bạn cùng đội ngũ huấn luyện viên 
              chuyên nghiệp của Sun Movement.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal defaultMode="register">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                  Đăng ký tư vấn ngay
                </Button>
              </AuthModal>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Xem gói thành viên
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
