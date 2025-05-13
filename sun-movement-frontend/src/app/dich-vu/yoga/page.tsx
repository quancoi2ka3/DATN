import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Star, Clock, ChevronRight, CheckCircle2, ArrowRight, Calendar, Leaf, Moon, Sun } from "lucide-react";

export default function YogaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              MODERN YOGA
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Hài hòa thân - tâm với<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                phương pháp Modern Yoga
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Kết hợp yoga truyền thống với phương pháp hiện đại, giúp bạn cân bằng thể chất và tinh thần, 
              tăng cường sức khỏe và sự linh hoạt cho cuộc sống hằng ngày.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Đăng ký tư vấn miễn phí
              </Button>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Xem lịch tập luyện
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      {/* What is Modern Yoga */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Modern Yoga là gì?</h2>
            <p className="text-slate-300 mb-4">
              Modern Yoga tại Sun Movement là sự kết hợp giữa các phương pháp yoga truyền thống với 
              các phương pháp luyện tập hiện đại, tạo nên một trải nghiệm tập luyện toàn diện, cân bằng 
              giữa thể chất và tinh thần.
            </p>
            <p className="text-slate-300 mb-6">
              Chúng tôi lấy nền tảng từ yoga truyền thống như Hatha, Vinyasa, Yin Yoga và kết hợp 
              với các yếu tố hiện đại từ khoa học thể thao, giải phẫu học và tâm lý học để tạo ra 
              một phương pháp tập luyện hiệu quả, an toàn và phù hợp với lối sống hiện đại.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Cân bằng thể chất và tinh thần</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Tăng cường sự linh hoạt và sức mạnh cơ thể</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Giảm stress, lo âu và cải thiện sức khỏe tinh thần</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-purple-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Cải thiện tư thế, hơi thở và nâng cao nhận thức cơ thể</span>
              </div>
            </div>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 h-auto rounded-lg font-medium">
              Khám phá thêm <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
            <Image 
              src="/images/yoga.jpg" 
              alt="Modern Yoga tại Sun Movement" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Các lớp học Yoga</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cung cấp nhiều lớp học yoga đa dạng, phù hợp với mọi cấp độ và mục tiêu tập luyện.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Gentle Flow</h3>
                  <p className="text-sm text-purple-400">Dành cho người mới bắt đầu</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Lớp học nhẹ nhàng tập trung vào các động tác cơ bản, kỹ thuật hơi thở và 
                  sự cân bằng. Lý tưởng cho người mới bắt đầu hoặc cần một buổi tập nhẹ nhàng.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">60 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Tối đa 12 người/lớp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Tất cả cấp độ</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Power Vinyasa</h3>
                  <p className="text-sm text-purple-400">Cấp độ trung cấp</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Kết hợp các động tác mạnh mẽ, nhịp độ nhanh và liên tục giúp xây dựng sức mạnh, 
                  sự dẻo dai và cải thiện sự tập trung. Phù hợp với người có kinh nghiệm yoga.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">75 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Tối đa 10 người/lớp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Trung cấp đến nâng cao</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-purple-700 to-pink-700"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Yin & Meditation</h3>
                  <p className="text-sm text-purple-400">Thư giãn sâu</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Tập trung vào việc giữ các tư thế lâu hơn, kết hợp thiền định để thư giãn sâu, 
                  tăng cường tính linh hoạt và cải thiện sức khỏe tinh thần.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">90 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Tối đa 8 người/lớp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-purple-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Mọi cấp độ</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Lợi ích của Modern Yoga</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tập luyện yoga đều đặn mang lại nhiều lợi ích toàn diện cho cả sức khỏe thể chất và tinh thần.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cải thiện sức khỏe tim mạch</h3>
            <p className="text-slate-300">
              Các động tác yoga kết hợp với hơi thở sâu giúp cải thiện tuần hoàn máu, hạ huyết áp 
              và tăng cường sức khỏe tim mạch tổng thể.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Moon className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Giảm stress và lo âu</h3>
            <p className="text-slate-300">
              Thực hành yoga thường xuyên giúp giảm mức cortisol, cải thiện chất lượng giấc ngủ 
              và tăng cường sự thư giãn cho hệ thần kinh.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tăng độ linh hoạt</h3>
            <p className="text-slate-300">
              Các tư thế yoga giúp kéo giãn và làm mềm cơ bắp, tăng phạm vi chuyển động của khớp 
              và cải thiện độ linh hoạt tổng thể.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tăng cường sức mạnh cơ bản</h3>
            <p className="text-slate-300">
              Nhiều tư thế yoga đòi hỏi bạn phải giữ trọng lượng cơ thể, giúp xây dựng sức mạnh cơ bắp, 
              đặc biệt là các nhóm cơ cốt lõi.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Sun className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cải thiện tư thế</h3>
            <p className="text-slate-300">
              Yoga giúp tăng cường nhận thức về cơ thể, cải thiện cân bằng và chỉnh sửa những vấn đề về tư thế, 
              giảm đau lưng và cổ.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nâng cao khả năng tập trung</h3>
            <p className="text-slate-300">
              Thực hành chánh niệm trong yoga giúp cải thiện sự tập trung, khả năng ghi nhớ và 
              chức năng nhận thức tổng thể.
            </p>
          </div>
        </div>
      </div>

      {/* Instructors */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Giáo viên Yoga</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Đội ngũ giáo viên yoga tại Sun Movement đều có chứng chỉ giảng dạy quốc tế và nhiều năm 
              kinh nghiệm thực hành và giảng dạy yoga.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-purple-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/yoga.jpg" 
                  alt="Giáo viên Yoga" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Nguyễn Thị G</h3>
                <p className="text-purple-400 mb-4">Lead Yoga Instructor</p>
                <p className="text-slate-300 mb-4">
                  12+ năm kinh nghiệm, chứng chỉ RYT-500, chuyên về Vinyasa Flow, 
                  Yin Yoga và thiền định.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 4, Thứ 6, Chủ Nhật</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-purple-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/yoga.jpg" 
                  alt="Giáo viên Yoga" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Trần Văn H</h3>
                <p className="text-purple-400 mb-4">Senior Yoga Instructor</p>
                <p className="text-slate-300 mb-4">
                  8 năm kinh nghiệm, chuyên về Power Yoga và phương pháp kết hợp 
                  Yoga với các bài tập sức mạnh hiện đại.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 3, Thứ 5, Thứ 7</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-purple-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/yoga.jpg" 
                  alt="Giáo viên Yoga" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Lê Thị I</h3>
                <p className="text-purple-400 mb-4">Yin & Meditation Specialist</p>
                <p className="text-slate-300 mb-4">
                  10 năm kinh nghiệm, chuyên về Yin Yoga, thiền định và các 
                  phương pháp thư giãn sâu.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 5, Chủ Nhật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Lịch học Yoga</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Chúng tôi cung cấp nhiều khung giờ học linh hoạt để phù hợp với lịch trình của bạn.
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
                  <td className="py-3 px-4 text-sm font-medium text-white">06:30 - 07:30</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">09:00 - 10:15</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">17:30 - 18:30</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-500/10">Gentle Flow</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">19:00 - 20:15</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-600/10">Power Vinyasa</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">20:30 - 22:00</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-700/10">Yin & Meditation</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-700/10">Yin & Meditation</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-purple-700/10">Yin & Meditation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 h-auto rounded-lg font-medium text-lg">
            <Calendar className="mr-2 h-5 w-5" /> Đặt lịch học thử miễn phí
          </Button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Học viên nói gì về chúng tôi</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Khám phá những trải nghiệm của các học viên đã tham gia lớp học yoga tại Sun Movement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative hover:border-purple-500/30">
              <div className="text-4xl text-purple-500 absolute -top-5 left-6">"</div>
              <p className="text-slate-300 mb-6 mt-3">
                "Lớp học Modern Yoga tại Sun Movement đã thay đổi hoàn toàn cuộc sống của tôi. 
                Tôi không chỉ cảm thấy khỏe mạnh hơn về thể chất mà còn cảm thấy bình an và 
                cân bằng hơn về tinh thần."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold mr-4">
                  TL
                </div>
                <div>
                  <h4 className="text-white font-medium">Trương Lan</h4>
                  <p className="text-purple-400 text-sm">Học viên 1 năm</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative hover:border-purple-500/30">
              <div className="text-4xl text-purple-500 absolute -top-5 left-6">"</div>
              <p className="text-slate-300 mb-6 mt-3">
                "Tôi bắt đầu tập yoga để giảm đau lưng, nhưng đã nhận được nhiều hơn thế. 
                Các giáo viên tại Sun Movement rất chuyên nghiệp, tận tâm và luôn quan tâm 
                đến từng học viên."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold mr-4">
                  HM
                </div>
                <div>
                  <h4 className="text-white font-medium">Hoàng Minh</h4>
                  <p className="text-purple-400 text-sm">Học viên 6 tháng</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative hover:border-purple-500/30">
              <div className="text-4xl text-purple-500 absolute -top-5 left-6">"</div>
              <p className="text-slate-300 mb-6 mt-3">
                "Lớp Yin & Meditation là điều tôi mong đợi nhất mỗi tuần. Nó giúp tôi 
                giảm stress sau những ngày làm việc căng thẳng và cải thiện chất lượng 
                giấc ngủ đáng kể."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold mr-4">
                  NT
                </div>
                <div>
                  <h4 className="text-white font-medium">Nguyễn Thu</h4>
                  <p className="text-purple-400 text-sm">Học viên 2 năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình yoga của bạn?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Hãy tham gia cùng Sun Movement để khám phá sự cân bằng và bình an thông qua 
              phương pháp Modern Yoga hiện đại.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Đăng ký tư vấn ngay
              </Button>
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