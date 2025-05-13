import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Star, Clock, ChevronRight, CheckCircle2, ArrowRight, Calendar, BarChart3 } from "lucide-react";

export default function StrengthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-amber-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              POWER / STRENGTH TRAINING
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Xây dựng sức mạnh tối đa với<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                chương trình Strength Training
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Nâng cao giới hạn của bản thân thông qua các bài tập kháng lực chuyên sâu. Phát triển sức mạnh tối đa, 
              cơ bắp và sức bền với phương pháp huấn luyện hiệu quả nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
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

      {/* What is Strength Training */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl order-2 md:order-1">
            <Image 
              src="/images/strength.jpg" 
              alt="Strength training at Sun Movement" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-white mb-6">Strength Training là gì?</h2>
            <p className="text-slate-300 mb-4">
              Strength Training (Huấn luyện sức mạnh) là phương pháp tập luyện tập trung vào việc 
              phát triển sức mạnh tối đa và sức mạnh bùng nổ thông qua các bài tập kháng lực với 
              trọng lượng tự do, máy tập và thiết bị chuyên dụng.
            </p>
            <p className="text-slate-300 mb-6">
              Tại Sun Movement, chúng tôi kết hợp các phương pháp huấn luyện sức mạnh hiện đại cùng 
              với kiến thức khoa học về sinh lý học thể thao để tạo ra các chương trình huấn luyện 
              hiệu quả và an toàn nhất.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-red-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Tăng sức mạnh tối đa và sức mạnh bùng nổ</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-red-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Phát triển khối lượng và chất lượng cơ bắp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-red-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Cải thiện trao đổi chất và sức khỏe xương khớp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-red-500 h-6 w-6 flex-shrink-0" />
                <span className="text-slate-300">Nâng cao hiệu suất thể thao và phòng ngừa chấn thương</span>
              </div>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 h-auto rounded-lg font-medium">
              Khám phá thêm <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Chương trình Strength Training</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cung cấp các chương trình huấn luyện sức mạnh được thiết kế phù hợp với mọi cấp độ và mục tiêu.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-red-500 to-amber-500"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Strength Fundamentals</h3>
                  <p className="text-sm text-red-400">Nền tảng sức mạnh</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Xây dựng nền tảng sức mạnh vững chắc với các bài tập cơ bản như squat, deadlift, bench press 
                  và overhead press. Tập trung vào kỹ thuật và cơ chế vận động đúng.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">3 buổi/tuần - 60 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Nhóm nhỏ (tối đa 8 người)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Đánh giá tiến độ hàng tháng</span>
                  </div>
                </div>
                <Button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-red-600 to-amber-600"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Hypertrophy Focus</h3>
                  <p className="text-sm text-red-400">Phát triển cơ bắp</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Chương trình chuyên sâu tập trung vào tăng kích thước cơ bắp với phương pháp progressive overload 
                  và tập luyện theo vùng cơ. Kết hợp với tư vấn dinh dưỡng.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">4 buổi/tuần - 75 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Nhóm nhỏ (tối đa 6 người)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Kế hoạch dinh dưỡng cá nhân</span>
                  </div>
                </div>
                <Button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all">
              <div className="h-3 bg-gradient-to-r from-red-700 to-amber-700"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Power Performance</h3>
                  <p className="text-sm text-red-400">Sức mạnh đỉnh cao</p>
                </div>
                <p className="text-slate-300 mb-4">
                  Chương trình nâng cao cho vận động viên muốn tối ưu hóa sức mạnh bùng nổ, tốc độ và hiệu suất 
                  thể thao với phương pháp huấn luyện theo chu kỳ.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">5 buổi/tuần - 90 phút/buổi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Huấn luyện 1-1 hoặc nhóm nhỏ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-red-500 h-4 w-4" />
                    <span className="text-slate-300 text-sm">Phân tích hiệu suất bằng công nghệ</span>
                  </div>
                </div>
                <Button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                  Xem chi tiết <ChevronRight className="ml-auto h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Methodologies */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Phương pháp huấn luyện</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Chúng tôi áp dụng các phương pháp huấn luyện tiên tiến, dựa trên nghiên cứu khoa học 
            và được chứng minh hiệu quả.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="bg-gradient-to-br from-red-600 to-amber-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Progressive Overload</h3>
            <p className="text-slate-300">
              Tăng dần cường độ tập luyện theo thời gian để liên tục thúc đẩy cơ thể phát triển và 
              thích nghi. Áp dụng qua tăng trọng lượng, số lần lặp lại hoặc thời gian tập.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="bg-gradient-to-br from-red-600 to-amber-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Dumbbell className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Periodization</h3>
            <p className="text-slate-300">
              Huấn luyện theo chu kỳ với các giai đoạn tăng cường độ và hồi phục để tối ưu hóa hiệu quả 
              và tránh tình trạng quá tải. Thiết kế chu kỳ huấn luyện ngắn hạn và dài hạn.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="bg-gradient-to-br from-red-600 to-amber-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Compound Movements</h3>
            <p className="text-slate-300">
              Tập trung vào các động tác tổng hợp sử dụng nhiều nhóm cơ cùng lúc để tối đa hóa hiệu quả 
              tập luyện và khả năng sản sinh lực. Ví dụ: squat, deadlift, bench press.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="bg-gradient-to-br from-red-600 to-amber-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Time Under Tension</h3>
            <p className="text-slate-300">
              Kiểm soát thời gian cơ bắp chịu tải trong mỗi động tác để tối ưu hóa quá trình kích thích 
              tăng trưởng cơ bắp và phát triển sức mạnh.
            </p>
          </div>
        </div>
      </div>

      {/* Trainers */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Đội ngũ huấn luyện viên</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Các huấn luyện viên Strength tại Sun Movement đều có chứng chỉ NSCA, CSCS và nhiều 
              năm kinh nghiệm trong huấn luyện sức mạnh chuyên nghiệp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/strength.jpg" 
                  alt="Huấn luyện viên Strength" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Phạm Văn D</h3>
                <p className="text-red-500 mb-4">Head of Strength & Conditioning</p>
                <p className="text-slate-300 mb-4">
                  12+ năm kinh nghiệm, chứng chỉ NSCA-CSCS, từng huấn luyện cho vận động viên 
                  thể hình và powerlifting chuyên nghiệp.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 3, Thứ 5, Thứ 6</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/strength.jpg" 
                  alt="Huấn luyện viên Strength" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Nguyễn Thị E</h3>
                <p className="text-red-500 mb-4">Senior Strength Coach</p>
                <p className="text-slate-300 mb-4">
                  8 năm kinh nghiệm, chuyên gia về powerlifting và olympic weightlifting, 
                  có chứng chỉ USAW và CPT.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 2, Thứ 4, Thứ 6, Thứ 7</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/30">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image 
                  src="/images/strength.jpg" 
                  alt="Huấn luyện viên Strength" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Trần Văn F</h3>
                <p className="text-red-500 mb-4">Performance Coach</p>
                <p className="text-slate-300 mb-4">
                  7 năm kinh nghiệm, chuyên về phát triển hiệu suất thể thao và huấn luyện 
                  sức mạnh bùng nổ cho vận động viên.
                </p>
                <div className="flex items-center">
                  <span className="text-slate-400 text-sm">Lịch dạy:</span>
                  <span className="text-slate-300 text-sm ml-2">Thứ 3, Thứ 5, Thứ 7, Chủ Nhật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Lịch tập Strength Training</h2>
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
                  <td className="py-3 px-4 text-sm font-medium text-white">06:00 - 07:00</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-500/10">Fundamentals</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-500/10">Fundamentals</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-500/10">Fundamentals</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">08:30 - 09:45</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">17:00 - 18:15</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-600/10">Hypertrophy</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-white">18:30 - 20:00</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-700/10">Performance</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-700/10">Performance</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-700/10">Performance</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-700/10">Performance</td>
                  <td className="py-3 px-4 text-sm text-slate-300 bg-red-700/10">Performance</td>
                  <td className="py-3 px-4 text-sm text-slate-300">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 h-auto rounded-lg font-medium text-lg">
            <Calendar className="mr-2 h-5 w-5" /> Đặt lịch học thử miễn phí
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-red-600/20 to-amber-500/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Sẵn sàng khám phá sức mạnh tiềm ẩn của bạn?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Tham gia ngay với Sun Movement để trải nghiệm chương trình huấn luyện sức mạnh 
              chuyên nghiệp, được thiết kế riêng cho mục tiêu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
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