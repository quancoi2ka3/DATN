import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter, 
  ChevronDown, 
  CalendarClock, 
  ArrowRight,
  Tag,
  Info
} from "lucide-react";

type EventProps = {
  id: string;
  title: string;
  type: "WORKSHOP" | "GIẢI ĐẤU";
  date: string;
  time: string;
  image: string;
  instructor: string;
  location: string;
  capacity: number;
  status: "Đã diễn ra" | "Sắp diễn ra" | "Đang diễn ra";
  description: string;
  highlight?: boolean;
  tags?: string[];
};

const events: EventProps[] = [
  {
    id: "1",
    title: "Handstand Intensive",
    type: "WORKSHOP",
    date: "27-28/05/2025",
    time: "10:00-13:00",
    image: "/images/event1.jpg",
    instructor: "Nicólás Montes de Oca",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 10,
    status: "Sắp diễn ra",
    description: "Workshop chuyên sâu về kỹ thuật Handstand từ cơ bản đến nâng cao với huấn luyện viên quốc tế Nicólás Montes de Oca.",
    highlight: true,
    tags: ["Handstand", "Kỹ thuật", "Quốc tế"]
  },
  {
    id: "2",
    title: "Kìm linh hoạt khớp vai",
    type: "WORKSHOP",
    date: "10/06/2025",
    time: "15:00",
    image: "/images/event2.jpg",
    instructor: "Đinh Hưng",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 15,
    status: "Sắp diễn ra",
    description: "Workshop về cách cải thiện linh hoạt khớp vai, giúp phòng tránh chấn thương và tăng hiệu quả trong tập luyện.",
    tags: ["Linh hoạt", "Khớp vai", "Phòng chấn thương"]
  },
  {
    id: "3",
    title: "ATG Squat - Squat sâu & an toàn",
    type: "WORKSHOP",
    date: "15/05/2025",
    time: "15:00",
    image: "/images/event3.jpg",
    instructor: "Trung Lê",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 20,
    status: "Đang diễn ra",
    description: "Workshop về kỹ thuật ATG Squat (Ass to Grass), giúp bạn thực hiện động tác squat sâu nhưng vẫn đảm bảo an toàn cho khớp gối và lưng dưới.",
    highlight: true,
    tags: ["Squat", "ATG", "Kỹ thuật", "Khớp gối"]
  },
  {
    id: "4",
    title: "Gala Calisthenics Summer 2025",
    type: "GIẢI ĐẤU",
    date: "20/08/2025",
    time: "14:00-18:00",
    image: "/images/event1.jpg",
    instructor: "Sun Movement Team",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 50,
    status: "Sắp diễn ra",
    description: "Sự kiện Calisthenics lớn nhất mùa hè 2025 với các vận động viên hàng đầu Việt Nam. Thi đấu các nội dung như kéo xà, chống đẩy và các động tác kỹ thuật.",
    tags: ["Calisthenics", "Giải đấu", "Mùa hè", "Kéo xà"]
  },
  {
    id: "5",
    title: "Yoga Retreat 2025",
    type: "WORKSHOP",
    date: "15-17/07/2025",
    time: "Cả ngày",
    image: "/images/yoga.jpg",
    instructor: "Viet Yogi",
    location: "Tam Đảo, Vĩnh Phúc",
    capacity: 25,
    status: "Sắp diễn ra",
    description: "Chuyến đi retreat yoga cuối tuần tại Tam Đảo, tập trung vào thiền, yoga và các hoạt động ngoài trời để tái tạo năng lượng.",
    highlight: true,
    tags: ["Yoga", "Retreat", "Thiền", "Tâm linh"]
  },
  {
    id: "6",
    title: "Training Mindset Workshop",
    type: "WORKSHOP",
    date: "10/06/2025",
    time: "15:00-17:00",
    image: "/images/event2.jpg",
    instructor: "Minh Hiếu & Viet Yogi",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 30,
    status: "Sắp diễn ra",
    description: "Workshop về tâm lý học trong tập luyện, cách xây dựng mindset mạnh mẽ và vượt qua giới hạn bản thân.",
    tags: ["Tâm lý", "Mindset", "Động lực"]
  },
  {
    id: "7",
    title: "Kỹ thuật tập Front Lever",
    type: "WORKSHOP",
    date: "05/05/2025",
    time: "10:00-12:00",
    image: "/images/calisthenics.jpg",
    instructor: "Anh Tuấn",
    location: "Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 15,
    status: "Đã diễn ra",
    description: "Workshop chuyên sâu về kỹ thuật Front Lever, từ các bài tập chuẩn bị đến động tác hoàn chỉnh. Phù hợp cho cả người mới bắt đầu và trung cấp.",
    tags: ["Front Lever", "Calisthenics", "Kỹ thuật"]
  },
  {
    id: "8",
    title: "Mobility Challenge - 30 ngày",
    type: "WORKSHOP",
    date: "01/06/2025 - 30/06/2025",
    time: "Online & Offline",
    image: "/images/strength.jpg",
    instructor: "Team Sun Movement",
    location: "Online & Sun Movement, Tầng 11, 300 Đê La Thành",
    capacity: 100,
    status: "Sắp diễn ra",
    description: "Thử thách 30 ngày cải thiện tính linh hoạt toàn thân. Bao gồm chương trình tập luyện, hướng dẫn và cộng đồng hỗ trợ.",
    highlight: true,
    tags: ["Mobility", "Thử thách", "30 ngày", "Linh hoạt"]
  },
];

// Get upcoming events
const upcomingEvents = events.filter(e => e.status === "Sắp diễn ra" || e.status === "Đang diễn ra").sort((a, b) => {
  // Sort by date parsing logic would go here
  // For simplicity, returning a basic comparison
  return a.date.localeCompare(b.date);
});

// Get past events
const pastEvents = events.filter(e => e.status === "Đã diễn ra");

// Get highlighted events
const highlightedEvents = events.filter(e => e.highlight).slice(0, 3);

// Get all event tags for filtering
const allTags = [...new Set(events.flatMap(event => event.tags || []))].sort();

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container relative z-10">
          <div className="w-full py-4">
            <Breadcrumbs 
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Sự kiện", href: "/su-kien" }
              ]} 
              className="text-slate-400"
            />
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              SUN MOVEMENT EVENTS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Sự kiện & Workshop<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                nâng cao kỹ năng
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Khám phá các sự kiện, workshop và giải đấu được tổ chức bởi đội ngũ 
              huấn luyện viên chuyên nghiệp của Sun Movement. Nâng cao kiến thức, 
              kỹ thuật và kết nối với cộng đồng.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-24">
        {/* Quick Filters Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Lọc nhanh sự kiện</h2>
            <SearchBar 
              placeholder="Tìm kiếm sự kiện..." 
              className="w-full md:w-64"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
              Tất cả
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700">
              Sắp diễn ra
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700">
              Đang diễn ra
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700">
              Workshop
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700">
              Giải đấu
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Chủ đề phổ biến:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 8).map(tag => (
                <button 
                  key={tag} 
                  className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-400 text-xs hover:bg-slate-700/50 hover:text-slate-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Currently Running Events Section */}
        {events.filter(e => e.status === "Đang diễn ra").length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white">Đang diễn ra</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {events.filter(e => e.status === "Đang diễn ra").map((event) => (
                <div 
                  key={event.id} 
                  className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-xl overflow-hidden group hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-60 md:h-full overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-sm font-medium px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        {event.status}
                      </div>
                      <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-sm font-medium px-2 py-1 rounded">
                        {event.type}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="p-6 md:col-span-2 flex flex-col">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {event.tags?.map(tag => (
                          <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-slate-300 mb-5">
                        {event.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-400 mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-green-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-green-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-green-500" />
                          <span>Giảng viên: {event.instructor}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center text-sm text-green-500 font-medium">
                          <Info className="w-4 h-4 mr-1" /> 
                          Còn {event.capacity - Math.floor(Math.random() * 10)} slot trong tổng số {event.capacity}
                        </div>
                        <Link href={`/su-kien/${event.id}`}>
                          <Button className="bg-green-500 hover:bg-green-600 text-white">
                            Xem chi tiết và đăng ký
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upcoming Events Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Sự kiện sắp diễn ra</h2>
            <div className="text-sm text-slate-400">
              {upcomingEvents.length} sự kiện
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                    {event.status}
                  </div>
                  <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-sm font-medium px-2 py-1 rounded">
                    {event.type}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {event.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-xs text-slate-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-red-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-red-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-3 w-3 mr-2 text-red-500 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-400">
                      Giảng viên: {event.instructor}
                    </span>
                    <Link href={`/su-kien/${event.id}`} className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1">
                      Chi tiết <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Event Categories Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Khám phá theo chủ đề</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Calisthenics", image: "/images/calisthenics.jpg", count: events.filter(e => e.tags?.includes("Calisthenics")).length },
              { name: "Yoga & Thiền", image: "/images/yoga.jpg", count: events.filter(e => e.tags?.some(t => ["Yoga", "Thiền"].includes(t))).length },
              { name: "Sức mạnh & Hiệu suất", image: "/images/strength.jpg", count: events.filter(e => e.tags?.some(t => ["Kỹ thuật", "Hiệu suất", "Squat"].includes(t))).length },
              { name: "Retreat & Trải nghiệm", image: "/images/event3.jpg", count: events.filter(e => e.tags?.includes("Retreat")).length },
            ].map((category, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl h-40">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-transparent z-10"></div>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                  <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">{category.count} sự kiện</span>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Events Calendar Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Lịch sự kiện 2025</h2>
            <Link href="#" className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-medium">
              Xem lịch đầy đủ <ChevronDown className="w-4 h-4 rotate-270" />
            </Link>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Tháng</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Sự kiện</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Loại</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Ngày</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 align-top" rowSpan={2}>
                      <div className="font-semibold text-white">Tháng 05</div>
                      <div className="text-xs text-slate-500">2025</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white mb-1">Kỹ thuật tập Front Lever</div>
                      <div className="text-xs text-slate-400">Hướng dẫn: Anh Tuấn</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">WORKSHOP</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">05/05/2025</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Đã diễn ra</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white mb-1">ATG Squat - Squat sâu & an toàn</div>
                      <div className="text-xs text-slate-400">Hướng dẫn: Trung Lê</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">WORKSHOP</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">15/05/2025</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Đang diễn ra
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 align-top" rowSpan={3}>
                      <div className="font-semibold text-white">Tháng 06</div>
                      <div className="text-xs text-slate-500">2025</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white mb-1">Training Mindset Workshop</div>
                      <div className="text-xs text-slate-400">Hướng dẫn: Minh Hiếu & Viet Yogi</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">WORKSHOP</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">10/06/2025</td>
                    <td className="py-3 px-4">
                      <Link href="#">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                          Đăng ký
                        </Button>
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white mb-1">Kìm linh hoạt khớp vai</div>
                      <div className="text-xs text-slate-400">Hướng dẫn: Đinh Hưng</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">WORKSHOP</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">10/06/2025</td>
                    <td className="py-3 px-4">
                      <Link href="#">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                          Đăng ký
                        </Button>
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white mb-1">Mobility Challenge - 30 ngày</div>
                      <div className="text-xs text-slate-400">Hướng dẫn: Team Sun Movement</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">WORKSHOP</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">01/06 - 30/06/2025</td>
                    <td className="py-3 px-4">
                      <Link href="#">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                          Đăng ký
                        </Button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Sự kiện đã diễn ra</h2>
              <Link href="#" className="text-slate-400 hover:text-slate-300 flex items-center gap-1 text-sm">
                Xem tất cả <ChevronDown className="w-4 h-4 rotate-270" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pastEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group hover:border-slate-700 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30 z-10"></div>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75"
                    />
                    <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-xs px-2 py-1 rounded">
                      {event.type}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-base font-medium text-white mb-1 line-clamp-1 group-hover:text-slate-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-xs text-slate-400 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <Link href={`/su-kien/${event.id}`} className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
                      Xem lại <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] bg-repeat opacity-5"></div>
          <div className="relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Nhận thông báo về sự kiện mới</h3>
              <p className="text-slate-300 mb-6">
                Đăng ký để nhận thông báo kịp thời về các sự kiện, workshop sắp tới của Sun Movement. 
                Chúng tôi thường xuyên tổ chức các hoạt động với các chuyên gia trong và ngoài nước.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Địa chỉ email của bạn"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
                <Button className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white">
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
