import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dumbbell, Flame, Heart, Users, Zap, Award, Clock, ChevronRight } from "lucide-react";

const services = [
  {
    id: "calisthenics",
    title: "Calisthenics",
    description: "Phát triển sức mạnh, sự linh hoạt và thẩm mỹ cơ thể thông qua các bài tập với trọng lượng cơ thể.",
    image: "/images/calisthenics.jpg",
    icon: Zap,
    benefits: ["Cải thiện sức mạnh cơ bản", "Tăng sự linh hoạt", "Kiểm soát cơ thể tốt hơn", "Phát triển cơ bắp hài hòa"],
    schedule: "Thứ 2, Thứ 4, Thứ 7",
    level: "Tất cả cấp độ",
    trainer: "Huấn luyện viên chuyên nghiệp",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "strength",
    title: "Power / Strength Training",
    description: "Xây dựng sức mạnh tối đa và sức mạnh bùng nổ với các bài tập kháng lực chuyên sâu.",
    image: "/images/strength.jpg",
    icon: Dumbbell,
    benefits: ["Tăng sức mạnh tối đa", "Phát triển cơ bắp", "Cải thiện sức bền", "Tăng cường sức mạnh cốt lõi"],
    schedule: "Thứ 2, Thứ 3, Thứ 5, Thứ 6",
    level: "Từ cơ bản đến nâng cao",
    trainer: "Huấn luyện viên quốc tế",
    color: "from-red-600 to-amber-500",
  },
  {
    id: "yoga",
    title: "Modern Yoga",
    description: "Kết hợp yoga truyền thống với phương pháp hiện đại cho cả sức mạnh và sự cân bằng tinh thần.",
    image: "/images/yoga.jpg",
    icon: Heart,
    benefits: ["Cân bằng thể chất và tinh thần", "Tăng sự linh hoạt", "Giảm stress", "Cải thiện tư thế"],
    schedule: "Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Chủ nhật",
    level: "Mọi trình độ",
    trainer: "Giáo viên yoga chứng nhận",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "personal-training",
    title: "Huấn luyện cá nhân",
    description: "Chương trình huấn luyện được cá nhân hóa để đáp ứng mục tiêu cụ thể của bạn với sự hướng dẫn chuyên nghiệp.",
    image: "/images/calisthenics.jpg",
    icon: Users,
    benefits: ["Kế hoạch tập luyện cá nhân hóa", "Theo dõi tiến độ chặt chẽ", "Điều chỉnh linh hoạt", "Đạt mục tiêu nhanh chóng"],
    schedule: "Linh hoạt theo lịch của bạn",
    level: "Tùy chỉnh theo trình độ",
    trainer: "Huấn luyện viên cá nhân",
    color: "from-emerald-600 to-teal-500",
  },
];

const features = [
  {
    icon: Flame,
    title: "Động lực không ngừng",
    description: "Huấn luyện viên luôn đồng hành, thúc đẩy bạn vượt qua giới hạn bản thân mỗi ngày."
  },
  {
    icon: Users,
    title: "Cộng đồng đam mê",
    description: "Trở thành thành viên của cộng đồng những người có cùng đam mê rèn luyện và phát triển."
  },
  {
    icon: Award,
    title: "Huấn luyện viên chất lượng",
    description: "Đội ngũ huấn luyện viên giàu kinh nghiệm, được chứng nhận quốc tế với phương pháp hiện đại."
  },
  {
    icon: Clock,
    title: "Lịch tập linh hoạt",
    description: "Nhiều khung giờ tập luyện để phù hợp với lịch trình bận rộn của bạn."
  }
];

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Thành viên 1 năm",
    comment: "Sun Movement đã thay đổi hoàn toàn cách tôi nhìn nhận về tập luyện. Sau 6 tháng, tôi không chỉ khỏe mạnh hơn mà còn tự tin hơn rất nhiều.",
    avatar: "/images/testimonials/avatar1.jpg"
  },
  {
    name: "Trần Thị B",
    role: "Thành viên 2 năm",
    comment: "Các buổi tập Yoga tại đây thực sự khác biệt. Tôi cảm thấy cân bằng hơn cả về thể chất lẫn tinh thần, đặc biệt là sau những ngày làm việc căng thẳng.",
    avatar: "/images/testimonials/avatar2.jpg"
  },
  {
    name: "Lê Văn C",
    role: "Thành viên 6 tháng",
    comment: "Từ một người chưa từng tập luyện, các HLV tại Sun đã giúp tôi từng bước xây dựng được thói quen tập luyện khoa học và hiệu quả.",
    avatar: "/images/testimonials/avatar3.jpg"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              CHƯƠNG TRÌNH HUẤN LUYỆN
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Đột phá giới hạn bản thân với các dịch vụ<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                huấn luyện chuyên nghiệp
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Từ người mới bắt đầu đến vận động viên chuyên nghiệp, chúng tôi cung cấp các chương trình 
              đào tạo chất lượng cao phù hợp với mọi mục tiêu và trình độ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Đăng ký tư vấn miễn phí
              </Button>
              <Button variant="outline" className="border-slate-600 text-black hover:bg-slate-800 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Xem lịch tập luyện
              </Button>
            </div>
          </div>
          
          <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Chương trình huấn luyện</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tại Sun Movement, chúng tôi cung cấp nhiều chương trình huấn luyện đa dạng, 
            được thiết kế đặc biệt để đáp ứng mọi mục tiêu tập luyện của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
              <div className="relative h-52 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 z-10`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${service.color}`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-6 pb-3">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{service.title}</h2>
                <p className="text-slate-300 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm uppercase text-slate-400 mb-2">Lợi ích chính</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <span className="mr-2 text-red-500">•</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-red-500" />
                    <span>{service.schedule}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-red-500" />
                    <span>{service.level}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white`} asChild>
                  <Link href={`/dich-vu/${service.id}`} className="flex items-center justify-between">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="bg-slate-900/50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tại sao chọn Sun Movement</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất với các tiêu chuẩn cao nhất về chất lượng và sự chuyên nghiệp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
              >
                <div className="bg-gradient-to-br from-red-600 to-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Học viên nói gì về chúng tôi</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Hãy nghe những chia sẻ từ các thành viên đã và đang trải nghiệm hành trình tập luyện tại Sun Movement.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative"
            >
              <div className="absolute -top-4 left-6">
                <div className="text-4xl text-red-500">"</div>
              </div>
              <p className="text-slate-300 mb-6 mt-3">{testimonial.comment}</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden relative">
                    {/* Replace with actual avatar image if available */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-red-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">So sánh các loại hình tập luyện</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tìm hiểu sự khác biệt giữa các chương trình huấn luyện của chúng tôi để lựa chọn phương pháp phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl overflow-hidden border border-slate-700">
            <thead>
              <tr className="bg-slate-800">
                <th className="p-4 text-left text-white font-medium"></th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-blue-400">Calisthenics</span>
                  </div>
                </th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-red-600 to-amber-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-red-400">Strength Training</span>
                  </div>
                </th>
                <th className="p-4 text-center text-white font-medium">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-purple-400">Modern Yoga</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Trang thiết bị</td>
                <td className="p-4 text-center text-slate-300">Tối thiểu: thanh xà, ghế đẩy, thảm</td>
                <td className="p-4 text-center text-slate-300">Tạ tự do, máy tập, thiết bị chuyên dụng</td>
                <td className="p-4 text-center text-slate-300">Thảm yoga, khối gỗ, dây đai, gối</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Hình thức tập luyện</td>
                <td className="p-4 text-center text-slate-300">Sử dụng trọng lượng cơ thể</td>
                <td className="p-4 text-center text-slate-300">Tập luyện với tạ và thiết bị kháng lực</td>
                <td className="p-4 text-center text-slate-300">Tư thế kết hợp với hơi thở và thiền</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Mục tiêu chính</td>
                <td className="p-4 text-center text-slate-300">Sức mạnh tương đối, kiểm soát cơ thể, kỹ năng</td>
                <td className="p-4 text-center text-slate-300">Sức mạnh tối đa, tăng khối lượng cơ, sức mạnh bùng nổ</td>
                <td className="p-4 text-center text-slate-300">Cân bằng thân-tâm, linh hoạt, sức khỏe tinh thần</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Phù hợp với</td>
                <td className="p-4 text-center text-slate-300">Người muốn phát triển kỹ năng, thể hình cân đối</td>
                <td className="p-4 text-center text-slate-300">Người muốn tăng sức mạnh, khối lượng cơ và hiệu suất</td>
                <td className="p-4 text-center text-slate-300">Người cần cân bằng, linh hoạt và giảm căng thẳng</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="p-4 text-white font-medium">Cường độ</td>
                <td className="p-4 text-center text-slate-300">Trung bình đến cao</td>
                <td className="p-4 text-center text-slate-300">Cao</td>
                <td className="p-4 text-center text-slate-300">Thấp đến trung bình</td>
              </tr>
              <tr className="bg-slate-800">
                <td className="p-4 text-white font-medium">Lợi ích đặc biệt</td>
                <td className="p-4 text-center text-slate-300">Có thể tập mọi lúc mọi nơi, cải thiện kiểm soát cơ thể</td>
                <td className="p-4 text-center text-slate-300">Tăng trưởng cơ nhanh, cải thiện trao đổi chất</td>
                <td className="p-4 text-center text-slate-300">Giảm stress, cải thiện tư thế và hơi thở</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-slate-300 mb-6">
            Vẫn chưa chắc chắn loại hình tập luyện nào phù hợp với bạn? Hãy để chúng tôi tư vấn!
          </p>
          <Button className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white px-6 py-3 h-auto rounded-lg font-medium">
            Đăng ký tư vấn miễn phí
          </Button>
        </div>
      </div>

      {/* Schedule */}
      <div className="container py-16">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Lịch tập luyện</h2>
          <p className="text-slate-300 mb-8">
            Sun Movement cung cấp lịch tập linh hoạt phù hợp với thời gian của bạn.
            Các buổi tập được thiết kế để phát triển toàn diện cả về sức mạnh, sự linh hoạt và khả năng phối hợp.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3 text-left text-white font-medium">Thời gian</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 2</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 3</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 4</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 5</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 6</th>
                  <th className="p-3 text-left text-white font-medium">Thứ 7</th>
                  <th className="p-3 text-left text-white font-medium">Chủ nhật</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700/50">
                  <td className="p-3 font-medium text-white">8:00 - 9:30</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="p-3 font-medium text-white">17:30 - 19:00</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">19:30 - 21:00</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-red-500/10">Strength</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-blue-500/10">Calisthenics</td>
                  <td className="p-3 text-slate-300 bg-purple-500/10">Modern Yoga</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                  <td className="p-3 text-slate-300 bg-slate-500/10">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white px-6 py-6 h-auto rounded-lg text-lg font-medium">
              Đăng ký buổi tập miễn phí
            </Button>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600/20 to-amber-500/20 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình của bạn?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Trở thành phiên bản tốt nhất của chính mình cùng Sun Movement ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-red-600 hover:bg-red-100 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Đăng ký thành viên
              </Button>
              <Button variant="outline" className="border-white text-black hover:bg-white/10 px-6 py-3 h-auto rounded-lg font-medium text-lg">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
