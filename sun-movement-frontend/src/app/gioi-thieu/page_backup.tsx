import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, Users, Award, Clock, MapPin, Target, Phone, BarChart, Heart, Shield, Check, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image 
          src="/images/gioithieu/aboutus.webp" 
          alt="Sun Movement - About Us" 
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 container flex flex-col justify-center items-start">
          <Breadcrumbs 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/gioi-thieu" }
            ]} 
            className="mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Về Chúng Tôi</h1>
          <div className="w-24 h-1 bg-red-500 mb-6"></div>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl">
            Sun Movement - Nơi bạn tìm thấy phiên bản tốt nhất của chính mình qua thể thao và lối sống lành mạnh.
          </p>
        </div>
      </div>

      {/* Welcome Message with parallax effect */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-amber-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-red-500/20">
              <Heart className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="text-red-400 font-semibold uppercase tracking-wide text-sm">Welcome to Sun Movement</span>
              <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Chào Mừng Bạn Đến Với 
              <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent block mt-2">
                Gia Đình Sun Movement
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              Tại đây, chúng tôi không chỉ giúp bạn tập luyện thể chất mà còn đồng hành cùng bạn trong hành trình 
              phát triển toàn diện - <strong className="text-white">từ cơ thể đến tinh thần, từ sức mạnh đến sự linh hoạt</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tập Luyện Hiệu Quả</h3>
                <p className="text-slate-300 text-sm">
                  Các bài tập được thiết kế khoa học, phù hợp với mọi trình độ
                </p>
              </div>
              
              <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cộng Đồng Tích Cực</h3>
                <p className="text-slate-300 text-sm">
                  Kết nối với những người bạn cùng chí hướng và mục tiêu
                </p>
              </div>
              
              <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Chăm Sóc Toàn Diện</h3>
                <p className="text-slate-300 text-sm">
                  Hỗ trợ dinh dưỡng, tư vấn tâm lý và theo dõi tiến bộ
                </p>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <a 
                  href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <span>Tư Vấn Miễn Phí Ngay</span>
                  </span>
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300" asChild>
                <Link href="/dich-vu">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span>Khám Phá Dịch Vụ</span>
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-amber-500 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group p-4 hover:scale-105 transition-transform duration-300">
              <div className="mb-2">
                <Clock className="h-8 w-8 text-white mx-auto group-hover:animate-spin" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">5+</h3>
              <p className="text-white/90 font-medium">Năm kinh nghiệm</p>
            </div>
            <div className="group p-4 hover:scale-105 transition-transform duration-300">
              <div className="mb-2">
                <Users className="h-8 w-8 text-white mx-auto group-hover:animate-bounce" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">15+</h3>
              <p className="text-white/90 font-medium">Huấn luyện viên</p>
            </div>
            <div className="group p-4 hover:scale-105 transition-transform duration-300">
              <div className="mb-2">
                <Heart className="h-8 w-8 text-white mx-auto group-hover:animate-pulse" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</h3>
              <p className="text-white/90 font-medium">Học viên hài lòng</p>
            </div>
            <div className="group p-4 hover:scale-105 transition-transform duration-300">
              <div className="mb-2">
                <Award className="h-8 w-8 text-white mx-auto group-hover:animate-pulse" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">3</h3>
              <p className="text-white/90 font-medium">Cơ sở hiện đại</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-red-500 text-sm font-semibold uppercase tracking-wide">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Câu Chuyện Của Chúng Tôi</h2>
              </div>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-amber-500 mb-8"></div>
            <div className="space-y-6 text-slate-300">
              <div className="group/text">
                <p className="group-hover/text:text-white transition-colors duration-300 leading-relaxed">
                  Sun Movement được thành lập vào năm 2020 với ước mơ tạo nên một không gian thể thao đa năng, 
                  kết hợp giữa sức mạnh, sự dẻo dai, và tâm trí trong một môi trường hiện đại và thân thiện.
                </p>
              </div>
              <div className="group/text">
                <p className="group-hover/text:text-white transition-colors duration-300 leading-relaxed">
                  Từ một cơ sở nhỏ tại Hai Bà Trưng, chúng tôi đã phát triển thành một trung tâm thể thao 
                  được yêu thích tại Hà Nội, thu hút hàng nghìn học viên mỗi năm nhờ chất lượng huấn luyện 
                  chuyên nghiệp và sự đa dạng trong các chương trình tập luyện.
                </p>
              </div>
              <div className="group/text">
                <p className="group-hover/text:text-white transition-colors duration-300 leading-relaxed">
                  Đội ngũ sáng lập Sun Movement đều là những người trẻ có niềm đam mê mãnh liệt với thể thao 
                  và mong muốn lan tỏa lối sống tích cực, khỏe mạnh đến cộng đồng. Chúng tôi tin rằng thể thao không chỉ 
                  là về thể chất mà còn là hành trình phát triển toàn diện của mỗi cá nhân.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center group/item hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3 group-hover/item:bg-red-500/30 transition-colors">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white group-hover/item:text-red-300 transition-colors">Không gian hiện đại</span>
              </div>
              <div className="flex items-center group/item hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3 group-hover/item:bg-red-500/30 transition-colors">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white group-hover/item:text-red-300 transition-colors">HLV chuyên nghiệp</span>
              </div>
              <div className="flex items-center group/item hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3 group-hover/item:bg-red-500/30 transition-colors">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white group-hover/item:text-red-300 transition-colors">Trang thiết bị cao cấp</span>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent z-10"></div>
            <Image 
              src="/images/gioithieu/khonggiancalis.webp" 
              alt="Không gian luyện tập Calisthenics tại Sun Movement" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 z-20">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-5 w-5 text-red-500" />
                <span className="text-red-400 text-sm font-semibold uppercase tracking-wide">Sun Movement</span>
              </div>
              <span className="text-white text-lg font-medium block">Không gian luyện tập Calisthenics hiện đại</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-800/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tại Sao Chọn Sun Movement?</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-slate-300 text-lg">
              Điều gì khiến chúng tôi khác biệt và là sự lựa chọn tốt nhất cho hành trình thể chất của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 hover:border-red-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">An Toàn Là Ưu Tiên Hàng Đầu</h3>
              <p className="text-slate-300">
                Mọi bài tập đều được giám sát chặt chẽ bởi các huấn luyện viên có chuyên môn, đảm bảo an toàn tối đa cho người tập.
              </p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 hover:border-red-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <BarChart className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lộ Trình Cá Nhân Hóa</h3>
              <p className="text-slate-300">
                Mỗi học viên đều có lộ trình tập luyện riêng, được thiết kế dựa trên mục tiêu, khả năng và thời gian của từng người.
              </p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 hover:border-red-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Không Chỉ Là Tập Luyện</h3>
              <p className="text-slate-300">
                Chúng tôi xây dựng lối sống lành mạnh toàn diện thông qua tư vấn dinh dưỡng, thiền và phát triển tư duy tích cực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tầm Nhìn & Sứ Mệnh</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Tầm Nhìn</h3>
            </div>
            <p className="text-slate-300">
              Trở thành trung tâm thể thao hàng đầu tại Việt Nam, nơi mọi người được truyền cảm hứng để vượt qua giới hạn bản thân, 
              xây dựng một cộng đồng khỏe mạnh, tích cực và bền vững.
            </p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Sứ Mệnh</h3>
            </div>
            <p className="text-slate-300">
              Chúng tôi cam kết mang đến những chương trình tập luyện chất lượng cao, được cá nhân hóa, giúp mỗi học viên đạt được 
              mục tiêu sức khỏe và thể chất, đồng thời xây dựng một lối sống cân bằng và bền vững.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-800/30">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Giá Trị Cốt Lõi</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-slate-300 text-lg">
            Những giá trị tạo nên thương hiệu Sun Movement và là kim chỉ nam cho mọi hoạt động của chúng tôi
          </p>
        </div>
        
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 shadow-lg border border-slate-700">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 mx-auto">
              <Dumbbell className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-4">Chuyên Môn</h3>
            <p className="text-slate-300 text-center">
              Đội ngũ huấn luyện viên có chuyên môn sâu, kinh nghiệm dày dặn và các chứng chỉ quốc tế, 
              đảm bảo chất lượng huấn luyện tốt nhất cho học viên.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 shadow-lg border border-slate-700">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 mx-auto">
              <Users className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-4">Cộng Đồng</h3>
            <p className="text-slate-300 text-center">
              Xây dựng một cộng đồng các học viên gắn kết, hỗ trợ và truyền cảm hứng cho nhau, 
              tạo nên văn hóa tập luyện tích cực và bền vững.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 shadow-lg border border-slate-700">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 mx-auto">
              <Clock className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-4">Liên Tục Phát Triển</h3>
            <p className="text-slate-300 text-center">
              Không ngừng cập nhật kiến thức, phương pháp và trang thiết bị mới nhất để mang đến 
              trải nghiệm tập luyện tốt nhất cho học viên.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-500">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn Sàng Bắt Đầu Hành Trình Của Bạn?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Đăng ký buổi tập thử miễn phí ngay hôm nay và trải nghiệm không gian tập luyện tại Sun Movement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-white/90" asChild>
              <a 
                href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Đăng Ký Tập Thử</span>
                </span>
              </a>
            </Button>
            <Button size="lg" className="bg-white text-red-600 hover:bg-white/90" asChild>
              <Link href="/dich-vu">
                <span>Xem Các Dịch Vụ</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Vị Trí</h2>
            <div className="w-20 h-1 bg-red-500 mb-8"></div>
            
            <div className="space-y-6 text-slate-300">
              <p className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <span>Số 65 Đường Nguyễn Du, Hai Bà Trưng, Hà Nội</span>
              </p>
              
              <p className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <span>
                  <span className="block">Thứ 2 - Thứ 6: 6:00 - 22:00</span>
                  <span className="block">Thứ 7 - Chủ Nhật: 7:00 - 21:00</span>
                </span>
              </p>
              
              <div className="space-y-3 mt-6">
                <h3 className="text-lg font-bold text-white">Các Cơ Sở Khác:</h3>
                <p className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <span>Cơ sở 2: 88 Trần Thái Tông, Cầu Giấy, Hà Nội</span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <span>Cơ sở 3: 156 Xuân Diệu, Tây Hồ, Hà Nội</span>
                </p>
              </div>
            </div>
            
            <Button size="lg" className="mt-8 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none" asChild>
              <Link href="https://maps.google.com" target="_blank">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Xem Trên Bản Đồ</span>
                </span>
              </Link>
            </Button>
          </div>
          
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl border border-slate-700">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-slate-400">Bản đồ Google Maps sẽ hiển thị ở đây</p>
              <div className="absolute inset-0 opacity-40 bg-[url('/images/map-placeholder.jpg')] bg-cover bg-center"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
