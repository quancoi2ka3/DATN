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
          src="/images/strength.jpg" 
          alt="Sun Movement - Gym" 
          fill
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

      {/* Quick Stats */}
      <section className="py-12 bg-red-600">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">5+</h3>
              <p className="text-white/80">Năm kinh nghiệm</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">15+</h3>
              <p className="text-white/80">Huấn luyện viên</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</h3>
              <p className="text-white/80">Học viên</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">3</h3>
              <p className="text-white/80">Cơ sở hiện đại</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Câu Chuyện Của Chúng Tôi</h2>
            <div className="w-20 h-1 bg-red-500 mb-8"></div>
            <div className="space-y-6 text-slate-300">
              <p>
                Sun Movement được thành lập vào năm 2020 với ước mơ tạo nên một không gian thể thao đa năng, 
                kết hợp giữa sức mạnh, sự dẻo dai, và tâm trí trong một môi trường hiện đại và thân thiện.
              </p>
              <p>
                Từ một cơ sở nhỏ tại Hai Bà Trưng, chúng tôi đã phát triển thành một trung tâm thể thao 
                được yêu thích tại Hà Nội, thu hút hàng nghìn học viên mỗi năm nhờ chất lượng huấn luyện 
                chuyên nghiệp và sự đa dạng trong các chương trình tập luyện.
              </p>
              <p>
                Đội ngũ sáng lập Sun Movement đều là những người trẻ có niềm đam mê mãnh liệt với thể thao 
                và mong muốn lan tỏa lối sống tích cực, khỏe mạnh đến cộng đồng. Chúng tôi tin rằng thể thao không chỉ 
                là về thể chất mà còn là hành trình phát triển toàn diện của mỗi cá nhân.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white">Không gian hiện đại</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white">HLV chuyên nghiệp</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-white">Trang thiết bị cao cấp</span>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="/images/calisthenics.jpg" 
              alt="Đội ngũ sáng lập Sun Movement" 
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="text-white text-lg font-medium">Không gian luyện tập Calisthenics tại Sun Movement</span>
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

      {/* Achievements */}
      <section className="py-20 container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Thành Tựu</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-slate-300 text-lg">
            Những dấu mốc quan trọng trong hành trình phát triển của Sun Movement
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-500/30"></div>
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {/* Item 1 */}
            <div className="relative flex justify-between items-center">
              <div className="w-5/12 pr-8 text-right">
                <h3 className="text-xl font-bold text-white mb-2">2020</h3>
                <p className="text-slate-300">Thành lập cơ sở đầu tiên tại Hai Bà Trưng với diện tích 500m²</p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 z-10"></div>
              <div className="w-5/12 pl-8">
                <div className="w-full h-40 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/event1.jpg" 
                    alt="Thành lập cơ sở đầu tiên" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="relative flex justify-between items-center">
              <div className="w-5/12 pr-8">
                <div className="w-full h-40 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/event2.jpg" 
                    alt="Mở rộng cơ sở thứ hai" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 z-10"></div>
              <div className="w-5/12 pl-8 text-left">
                <h3 className="text-xl font-bold text-white mb-2">2022</h3>
                <p className="text-slate-300">Mở rộng cơ sở thứ hai tại Cầu Giấy và ra mắt dịch vụ Sun Sportswear</p>
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="relative flex justify-between items-center">
              <div className="w-5/12 pr-8 text-right">
                <h3 className="text-xl font-bold text-white mb-2">2023</h3>
                <p className="text-slate-300">Đạt mốc 1000+ học viên và mở cơ sở thứ ba tại Tây Hồ</p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 z-10"></div>
              <div className="w-5/12 pl-8">
                <div className="w-full h-40 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/event3.jpg" 
                    alt="Mở cơ sở thứ ba" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Item 4 */}
            <div className="relative flex justify-between items-center">
              <div className="w-5/12 pr-8">
                <div className="w-full h-40 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/supplements/1.jpg" 
                    alt="Ra mắt Sun Supplements" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 z-10"></div>
              <div className="w-5/12 pl-8 text-left">
                <h3 className="text-xl font-bold text-white mb-2">2024</h3>
                <p className="text-slate-300">Ra mắt dòng sản phẩm dinh dưỡng Sun Supplements và mở rộng quy mô đào tạo HLV</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-slate-800/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Đội Ngũ Huấn Luyện Viên</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-slate-300 text-lg">
              Những chuyên gia tận tâm, nhiệt huyết sẽ đồng hành cùng bạn trong hành trình chinh phục các mục tiêu thể chất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trainer 1 */}
            <div className="group">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image 
                  src="/images/event1.jpg" 
                  alt="HLV Minh Đức" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">Minh Đức</h3>
                  <p className="text-red-400">Head Coach Calisthenics</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300 text-sm">
                  Với hơn 8 năm kinh nghiệm, HLV Minh Đức đã giúp hàng trăm học viên làm chủ các kỹ thuật Calisthenics nâng cao. 
                  Anh sở hữu các chứng chỉ ISSA và là vận động viên Calisthenics chuyên nghiệp.
                </p>
                <div className="flex items-center mt-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            
            {/* Trainer 2 */}
            <div className="group">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image 
                  src="/images/event2.jpg" 
                  alt="HLV Thu Trang" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">Thu Trang</h3>
                  <p className="text-red-400">Head Coach Yoga</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300 text-sm">
                  HLV Thu Trang là người sáng lập chương trình Modern Yoga tại Sun Movement với hơn 10 năm kinh nghiệm. 
                  Cô sở hữu chứng chỉ RYT-500 và Yoga Alliance, đã đào tạo nhiều thế hệ giáo viên yoga.
                </p>
                <div className="flex items-center mt-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            
            {/* Trainer 3 */}
            <div className="group">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image 
                  src="/images/event3.jpg" 
                  alt="HLV Quang Huy" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">Quang Huy</h3>
                  <p className="text-red-400">Head Coach Strength</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300 text-sm">
                  HLV Quang Huy là chuyên gia về Strength Training với chứng chỉ NSCA-CSCS và hơn 7 năm kinh nghiệm. 
                  Anh từng là vận động viên powerlifting chuyên nghiệp và hiện đang huấn luyện cho nhiều vận động viên cấp cao.
                </p>
                <div className="flex items-center mt-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-none" asChild>
              <Link href="/dich-vu">Khám Phá Các Dịch Vụ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Học Viên Nói Gì Về Chúng Tôi</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-slate-300 text-lg">
            Hàng nghìn học viên đã tin tưởng và đạt được kết quả cùng Sun Movement
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 relative">
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-xl font-bold">
                N
              </div>
            </div>            <div className="pt-6">
              <p className="text-slate-300 italic mb-6">
                &ldquo;Tôi đã tập luyện tại nhiều phòng gym nhưng chỉ có tại Sun Movement, tôi mới tìm thấy một cộng đồng đam mê và hỗ trợ. 
                Sau 6 tháng, tôi đã đạt được mục tiêu giảm 15kg và xây dựng cơ bắp.&rdquo;
              </p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="mt-3">
                <h4 className="text-white font-semibold">Nguyễn Văn Nam</h4>
                <p className="text-slate-400 text-sm">Học viên Strength Training, 32 tuổi</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 relative">
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-xl font-bold">
                L
              </div>
            </div>
            <div className="pt-6">              <p className="text-slate-300 italic mb-6">
                &ldquo;Các lớp yoga tại Sun Movement đã giúp tôi giảm stress đáng kể và cải thiện sự linh hoạt. 
                Các HLV rất chuyên nghiệp và quan tâm đến từng học viên. Không gian tập luyện rất thoải mái và thư giãn.&rdquo;
              </p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="mt-3">
                <h4 className="text-white font-semibold">Lê Thị Minh Anh</h4>
                <p className="text-slate-400 text-sm">Học viên Yoga, 28 tuổi</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 relative">
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-xl font-bold">
                T
              </div>
            </div>
            <div className="pt-6">              <p className="text-slate-300 italic mb-6">
                &ldquo;Calisthenics tại Sun Movement đã cho tôi thấy mình có thể làm được những điều tưởng chừng không thể. 
                HLV Minh Đức đã hướng dẫn tôi từng bước để làm chủ các động tác khó như human flag và muscle up.&rdquo;
              </p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="mt-3">
                <h4 className="text-white font-semibold">Trần Hoàng Long</h4>
                <p className="text-slate-400 text-sm">Học viên Calisthenics, 25 tuổi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-slate-800/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Cơ Sở Vật Chất</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-slate-300 text-lg">
              Không gian tập luyện hiện đại, thoáng đãng với đầy đủ trang thiết bị chuyên nghiệp
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-80 rounded-lg overflow-hidden group">
              <Image 
                src="/images/strength.jpg" 
                alt="Khu vực tập Strength" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white">Khu vực Strength Training</h3>
                <p className="text-slate-300">
                  Trang bị đầy đủ máy móc, tạ đơn, tạ đòn và các thiết bị hiện đại
                </p>
              </div>
            </div>
            
            <div className="relative h-80 rounded-lg overflow-hidden group">
              <Image 
                src="/images/yoga.jpg" 
                alt="Khu vực tập Yoga" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white">Không gian Yoga</h3>
                <p className="text-slate-300">
                  Không gian yên tĩnh, thoáng đãng với đầy đủ props hỗ trợ tập luyện
                </p>
              </div>
            </div>
            
            <div className="relative h-80 rounded-lg overflow-hidden group">
              <Image 
                src="/images/calisthenics.jpg" 
                alt="Khu vực tập Calisthenics" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white">Khu vực Calisthenics</h3>
                <p className="text-slate-300">
                  Không gian rộng rãi với các thiết bị chuyên dụng, thanh xà và không gian vận động
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3">Tiện Ích Bổ Sung</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Phòng thay đồ, tủ khóa và nhà tắm riêng tư</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Quầy nước và khu vực thư giãn sau tập</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Cửa hàng Sun Sportswear và Sun Supplements</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Khu vực tư vấn dinh dưỡng và lên lịch tập</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3">Cam Kết Dịch Vụ</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Vệ sinh, khử trùng thiết bị sau mỗi buổi tập</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Số lượng học viên mỗi lớp được giới hạn để đảm bảo chất lượng</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Wifi miễn phí và dịch vụ đặt lịch online</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-red-500" />
                  <span>Bảo hiểm tai nạn trong quá trình tập luyện</span>
                </li>
              </ul>
            </div>
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
              <Link href="/lien-he">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Đăng Ký Tập Thử</span>
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
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
