"use client";

import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { 
  Search, 
  ChevronRight,   Phone, 
  Mail, 
  Users, 
  MapPin, 
  Dumbbell, 
  Leaf, 
  MessagesSquare
} from "lucide-react";
import Link from "next/link";

// FAQ categories and data
const categories = [
  { id: "all", label: "Tất cả", icon: <MessagesSquare className="w-4 h-4" /> },
  { id: "membership", label: "Thành viên & Đăng ký", icon: <Users className="w-4 h-4" /> },
  { id: "services", label: "Dịch vụ & Lớp học", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "facilities", label: "Cơ sở vật chất", icon: <MapPin className="w-4 h-4" /> },
  { id: "nutrition", label: "Dinh dưỡng & Sản phẩm", icon: <Leaf className="w-4 h-4" /> },
  { id: "other", label: "Câu hỏi khác", icon: <MessagesSquare className="w-4 h-4" /> }
];

// FAQ data with category tags
const faqData = [
  {
    category: "membership",
    items: [
      {
        value: "membership-cost",
        trigger: "Chi phí để trở thành thành viên là bao nhiêu?",
        content: "Sun Movement cung cấp nhiều gói thành viên khác nhau phù hợp với nhu cầu và ngân sách của bạn. Các gói thành viên có giá từ 500.000đ đến 1.500.000đ/tháng tùy theo thời hạn đăng ký và quyền lợi đi kèm. Chúng tôi cũng có các gói ưu đãi cho sinh viên, người cao tuổi và đăng ký nhóm. Vui lòng liên hệ trực tiếp với nhân viên tư vấn để biết chi tiết về các gói thành viên hiện tại."
      },
      {
        value: "membership-includes",
        trigger: "Gói thành viên bao gồm những quyền lợi gì?",
        content: `Tùy thuộc vào gói thành viên bạn chọn, quyền lợi có thể bao gồm:
        • Sử dụng không giới hạn tất cả các thiết bị tại phòng tập
        • Tham gia các lớp tập nhóm (Calisthenics, Strength, Yoga)
        • Tư vấn dinh dưỡng cá nhân (với gói Premium)
        • Có PT hướng dẫn cá nhân (số buổi tùy theo gói)
        • Sử dụng phòng xông hơi, tắm
        • Giảm giá khi mua sản phẩm tại cửa hàng của chúng tôi
        • Ưu đãi khi tham gia các sự kiện đặc biệt`
      },
      {
        value: "registration-process",
        trigger: "Quy trình đăng ký thành viên như thế nào?",
        content: `Quy trình đăng ký thành viên tại Sun Movement rất đơn giản:
        1. Đến trực tiếp phòng tập hoặc liên hệ qua hotline 08999 139 393
        2. Tham khảo các gói thành viên và chọn gói phù hợp
        3. Hoàn tất thủ tục đăng ký và thanh toán
        4. Nhận thẻ thành viên và hướng dẫn sử dụng các dịch vụ
        5. Tham gia buổi định hướng miễn phí (nếu là thành viên mới)`
      },
      {
        value: "payment-methods",
        trigger: "Các phương thức thanh toán được chấp nhận?",
        content: `Sun Movement chấp nhận nhiều phương thức thanh toán khác nhau để đáp ứng nhu cầu của khách hàng:
        • Thanh toán tiền mặt tại quầy
        • Chuyển khoản ngân hàng
        • Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB)
        • Ví điện tử (Momo, VNPay, ZaloPay)
        • Thanh toán trả góp (đối với các gói dài hạn)`
      }
    ]
  },
  {
    category: "services",
    items: [
      {
        value: "class-schedule",
        trigger: "Lịch các lớp tập nhóm như thế nào?",
        content: "Lịch các lớp tập nhóm được cập nhật hàng tuần và có thể xem trên trang web chính thức, ứng dụng di động hoặc bảng thông báo tại phòng tập. Các lớp thường diễn ra từ sáng sớm (6:00) đến tối muộn (21:00), bao gồm cả ngày cuối tuần. Bạn có thể đăng ký trước qua ứng dụng hoặc tại quầy lễ tân để đảm bảo có chỗ trong lớp học mình yêu thích."
      },
      {
        value: "class-types",
        trigger: "Các loại lớp tập có những gì?",
        content: `Sun Movement cung cấp đa dạng các lớp tập phù hợp với mọi cấp độ và mục tiêu tập luyện:
        • Calisthenics: Tập luyện với trọng lượng cơ thể, xây dựng sức mạnh tự nhiên
        • Strength: Tập luyện sức mạnh với tạ và thiết bị
        • Yoga: Các phong cách yoga khác nhau từ nhẹ nhàng đến mạnh mẽ
        • HIIT: Luyện tập cường độ cao ngắt quãng
        • Cardio: Lớp tập cardio nhịp điệu
        • Body Pump: Tập luyện với tạ nhẹ, nhiều lần lặp lại
        • Zumba: Kết hợp nhảy và âm nhạc sôi động`
      },
      {
        value: "personal-training",
        trigger: "Làm thế nào để đăng ký huấn luyện viên cá nhân (PT)?",
        content: `Để đăng ký huấn luyện viên cá nhân, bạn có thể:
        • Liên hệ trực tiếp với nhân viên tại quầy lễ tân
        • Đặt lịch qua ứng dụng di động hoặc website
        • Liên hệ qua số hotline 08999 139 393
        
        Các huấn luyện viên của chúng tôi đều có chứng chỉ và nhiều năm kinh nghiệm trong lĩnh vực fitness. Buổi đầu tiên sẽ bao gồm đánh giá thể chất và thảo luận về mục tiêu tập luyện để xây dựng chương trình phù hợp với bạn.`
      },
      {
        value: "bring-guest",
        trigger: "Tôi có thể đưa bạn bè đến tập thử không?",
        content: "Có, thành viên của Sun Movement có quyền đưa khách đến tập thử. Mỗi thành viên được phép đưa tối đa 3 khách/tháng, mỗi khách có thể tập thử 1 lần. Khách tập thử cần đăng ký trước ít nhất 24 giờ và xuất trình giấy tờ tùy thân khi đến phòng tập. Chúng tôi cũng có chương trình \"Ngày Tập Thử\" định kỳ cho người chưa phải là thành viên muốn trải nghiệm dịch vụ tại Sun Movement."
      }
    ]
  },
  {
    category: "facilities",
    items: [
      {
        value: "gym-facilities",
        trigger: "Phòng tập có những trang thiết bị gì?",
        content: `Sun Movement được trang bị đầy đủ các thiết bị tập luyện hiện đại, bao gồm:
        • Khu vực cardio với máy chạy bộ, xe đạp, máy elliptical
        • Khu vực tạ tự do với đa dạng tạ đơn và tạ đòn
        • Khu vực máy tập luyện resistance cho từng nhóm cơ
        • Khu vực tập Calisthenics với xà đơn, xà kép, thanh parallettes
        • Phòng tập yoga rộng rãi với đầy đủ dụng cụ
        • Phòng tập nhóm cho các lớp tập
        • Phòng xông hơi khô và ướt
        • Khu vực thay đồ và tủ cá nhân
        • Khu vực nghỉ ngơi và quầy bar dinh dưỡng`
      },
      {
        value: "operating-hours",
        trigger: "Thời gian hoạt động của phòng tập?",
        content: `Sun Movement hoạt động với lịch trình sau:
        • Thứ 2 - Thứ 6: 5:30 - 22:00
        • Thứ 7: 7:00 - 21:30
        • Chủ nhật: 9:00 - 18:00
        • Ngày lễ: Lịch có thể thay đổi, vui lòng kiểm tra thông báo
        
        Lưu ý rằng một số dịch vụ như lớp học nhóm có thể có lịch trình riêng. Vui lòng kiểm tra lịch học cụ thể trên ứng dụng hoặc website của chúng tôi.`
      },
      {
        value: "parking",
        trigger: "Có chỗ đậu xe không?",
        content: "Có, Sun Movement có bãi đậu xe rộng rãi dành cho thành viên. Bãi đậu xe máy miễn phí cho tất cả thành viên. Đối với ô tô, chúng tôi có dịch vụ gửi xe với mức giá ưu đãi cho thành viên (miễn phí 2 giờ đầu, sau đó 20.000đ/giờ). Bãi đậu xe được giám sát 24/7 bởi đội ngũ bảo vệ và camera an ninh."
      },
      {
        value: "lockers",
        trigger: "Có tủ cá nhân để đồ không?",
        content: "Có, Sun Movement cung cấp tủ cá nhân cho tất cả thành viên trong thời gian tập luyện. Bạn có thể sử dụng khóa của mình hoặc thuê/mua khóa tại quầy lễ tân. Chúng tôi cũng có dịch vụ tủ cá nhân cố định cho thành viên muốn để đồ dùng tập luyện thường xuyên tại phòng tập (phí thuê tủ cố định: 200.000đ/tháng)."
      }
    ]
  },
  {
    category: "nutrition",
    items: [
      {
        value: "nutritional-advice",
        trigger: "Có tư vấn dinh dưỡng không?",
        content: `Có, Sun Movement cung cấp dịch vụ tư vấn dinh dưỡng với các chuyên gia dinh dưỡng thể thao. Dịch vụ này miễn phí cho thành viên gói Premium và có phí cho các gói thành viên khác. Chúng tôi cung cấp:
        • Đánh giá thành phần cơ thể
        • Tư vấn chế độ ăn phù hợp với mục tiêu
        • Lập kế hoạch dinh dưỡng cá nhân hóa
        • Theo dõi tiến trình và điều chỉnh kế hoạch`
      },
      {
        value: "supplements",
        trigger: "Có bán thực phẩm bổ sung không?",
        content: `Có, Sun Movement có cửa hàng thực phẩm bổ sung với các sản phẩm chất lượng cao từ các thương hiệu uy tín. Danh mục sản phẩm bao gồm:
        • Protein whey, casein và plant-based
        • Pre-workout và BCAA
        • Creatine và các loại amino acid
        • Vitamin và khoáng chất
        • Thực phẩm fitness (bánh protein, thanh năng lượng)
        
        Tất cả thành viên được giảm 10% khi mua sản phẩm tại cửa hàng của chúng tôi.`
      },
      {
        value: "sports-apparel",
        trigger: "Có bán quần áo và phụ kiện tập luyện không?",
        content: `Có, Sun Movement có khu vực bán quần áo và phụ kiện tập luyện với nhiều mẫu mã đa dạng. Sản phẩm bao gồm:
        • Quần áo tập luyện nam/nữ
        • Giày tập
        • Găng tay tập luyện
        • Dây đai hỗ trợ
        • Bình nước và phụ kiện khác
        
        Chúng tôi cung cấp cả sản phẩm thương hiệu Sun Movement và các thương hiệu fitness nổi tiếng khác.`
      }
    ]
  },
  {
    category: "other",
    items: [
      {
        value: "first-visit",
        trigger: "Lần đầu đến phòng tập, tôi nên chuẩn bị gì?",
        content: `Cho lần đầu đến Sun Movement, bạn nên chuẩn bị:
        • Trang phục tập luyện thoải mái
        • Giày thể thao (bắt buộc cho khu vực tập luyện)
        • Khăn cá nhân
        • Bình nước
        • Khóa tủ (hoặc bạn có thể thuê tại quầy lễ tân)
        • Giấy tờ tùy thân (nếu là buổi tập thử)
        
        Chúng tôi cung cấp miễn phí khăn tắm, dầu gội, sữa tắm và máy sấy tóc tại phòng thay đồ.`
      },
      {
        value: "age-limits",
        trigger: "Có giới hạn độ tuổi để tập luyện không?",
        content: "Sun Movement chào đón thành viên từ 16 tuổi trở lên. Thành viên từ 16-18 tuổi cần có sự đồng ý và chữ ký của phụ huynh hoặc người giám hộ. Chúng tôi cũng có các lớp đặc biệt dành cho người cao tuổi với các bài tập được thiết kế phù hợp, an toàn và hiệu quả."
      },
      {
        value: "cancellation-policy",
        trigger: "Chính sách hủy thành viên như thế nào?",
        content: `Để hủy thành viên tại Sun Movement, bạn cần:
        • Thông báo trước ít nhất 30 ngày
        • Hoàn tất biểu mẫu hủy thành viên tại quầy lễ tân
        • Thanh toán phí hủy hợp đồng (nếu có, tùy theo điều khoản hợp đồng)
        
        Đối với các trường hợp đặc biệt như chuyển nơi ở, bệnh tật dài hạn có xác nhận y tế, chúng tôi có chính sách linh hoạt. Vui lòng liên hệ với bộ phận chăm sóc khách hàng để biết thêm chi tiết.`
      },
      {
        value: "contact-question",
        trigger: "Nếu tôi có câu hỏi khác, liên hệ ở đâu?",
        content: `Nếu bạn có bất kỳ câu hỏi nào khác, vui lòng liên hệ với chúng tôi qua:
        • Hotline: 08999 139 393 (7:00 - 21:00 hàng ngày)
        • Email: contact@sunmovement.vn
        • Fanpage: facebook.com/sunmovementvn
        • Trực tiếp: Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội
        
        Đội ngũ chăm sóc khách hàng của chúng tôi sẽ phản hồi trong vòng 24 giờ.`
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  // Generate background particles effect
  useEffect(() => {
    const newBackgroundParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 40 + 10}px`,
        height: `${Math.random() * 60 + 20}px`,
        opacity: 0.5 + Math.random() * 0.5,
        animationDuration: `${Math.random() * 3 + 1}s`,
        animationDelay: `${Math.random() * 2}s`,
      }
    }));
    setBackgroundParticles(newBackgroundParticles);
  }, []);

  // Filter FAQs based on search query and active category
  useEffect(() => {
    let filtered = faqData;
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(category => category.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.trigger.toLowerCase().includes(query) || 
          item.content.toLowerCase().includes(query)
        )
      })).filter(category => category.items.length > 0);
    }
    
    setFilteredFAQs(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/dichvu/Strength-Thumb.webp')] bg-repeat opacity-5 z-0"></div>
        
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {backgroundParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-gradient-to-t from-red-500/20 to-transparent rounded-full animate-float-slow"
              style={particle.style}
            />
          ))}
        </div>
        
        <div className="container relative z-10">
          <div className="w-full py-4">
            <Breadcrumbs 
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "FAQ", href: "/faq" }
              ]} 
              className="text-slate-400"
            />
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              HỎI & ĐÁP
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Những thông tin hữu ích giúp bạn hiểu rõ hơn về các dịch vụ tại Sun Movement.
              Nếu bạn có thắc mắc khác, hãy liên hệ với chúng tôi qua email hoặc hotline.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Tìm kiếm câu hỏi..." 
                className="pl-10 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Content Section */}
      <div className="container pb-24">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                activeCategory === category.id 
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-600" 
                  : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* FAQ Content */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Icon Navigation - Desktop */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-slate-800">
                <h3 className="font-bold text-white">Danh mục câu hỏi</h3>
              </div>
              <div className="divide-y divide-slate-700/50">
                {categories.slice(1).map((category) => (
                  <button
                    key={category.id}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      activeCategory === category.id 
                        ? "bg-slate-700/50 text-red-500" 
                        : "text-slate-300 hover:bg-slate-700/30"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      activeCategory === category.id 
                        ? "bg-red-500/20 text-red-500" 
                        : "bg-slate-700 text-slate-300"
                    }`}>
                      {category.icon}
                    </div>
                    <span>{category.label}</span>
                    {activeCategory === category.id && (
                      <ChevronRight className="ml-auto h-4 w-4 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* FAQ Accordions */}
          <div className="md:col-span-9">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy kết quả</h3>
                <p className="text-slate-400 mb-6">Vui lòng thử lại với từ khóa khác hoặc xem tất cả câu hỏi</p>
                <Button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Xem tất cả câu hỏi
                </Button>
              </div>
            ) : (
              filteredFAQs.map((category, index) => (
                <div key={category.category} className={index > 0 ? "mt-12" : ""}>
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-red-500 mr-1 rounded-full"></div>
                    {categories.find(cat => cat.id === category.category)?.label || ""}
                  </h2>
                  
                  <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6 backdrop-blur-sm">
                    <Accordion className="divide-y divide-slate-700/50 border-none">
                      {category.items.map((item) => (
                        <AccordionItem
                          key={item.value}
                          value={item.value}
                          trigger={
                            <span className="text-white font-medium hover:text-red-400 transition-colors">
                              {item.trigger}
                            </span>
                          }
                        >
                          <div className="text-slate-200 prose prose-sm max-w-none prose-p:text-slate-200 prose-headings:text-white prose-strong:text-white prose-strong:font-semibold prose-a:text-red-400 hover:prose-a:text-red-300">
                            {item.content.split('\n').map((paragraph, i) => (
                              <p key={i} className="whitespace-pre-line leading-relaxed">{paragraph}</p>
                            ))}
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              ))
            )}
            
            {/* Still have questions */}
            <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/dichvu/Strength-Thumb.webp')] bg-repeat opacity-5 z-0"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Vẫn còn thắc mắc?</h3>
                  <p className="text-slate-300 mb-0 md:mb-0">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" asChild>
                    <Link href="tel:0899913939">
                      <Phone className="mr-2 h-4 w-4" />
                      Hotline
                    </Link>
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
                    <a 
                      href="https://www.messenger.com/t/112565973590004/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Liên hệ ngay
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}