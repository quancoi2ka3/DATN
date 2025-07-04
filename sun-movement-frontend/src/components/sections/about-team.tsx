"use client";

import Image from "next/image";
import { Star, Award, Users } from "lucide-react";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Nguyễn Đình Hùng",
      role: "Founder & Head Calisthenics Coach",
      experience: "10+ năm kinh nghiệm",
      speciality: "Calisthenics & Strength Training",
      image: "/images/gioithieu/Thumb-Hung.webp",
      achievements: ["Certified Personal Trainer", "Strength Specialist", "Calisthenics Coach"]
    },
    {
      name: "Nguyễn Đức Bình",
      role: "Founder & Head Yoga Coach",
      experience: "8+ năm kinh nghiệm",
      speciality: "Hatha & Vinyasa Yoga",
      image: "/images/gioithieu/Thumb-Binh.webp",
      achievements: ["200hr YTT Certified", "Meditation Teacher", "Wellness Coach"]
    },
    {
      name: "Lê Hoàng Trung",
      role: "Founder & Head Strength Coach",
      experience: "6+ năm kinh nghiệm",
      speciality: "Powerlifting & Functional Training",
      image: "/images/gioithieu/Thumb-Trung.webp",
      achievements: ["NSCA Certified", "Sports Nutrition", "Injury Prevention"]
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Đội Ngũ Huấn Luyện Viên
      </h2>
      <p className="text-slate-300 text-lg mb-12 max-w-3xl mx-auto">
        Gặp gỡ những huấn luyện viên chuyên nghiệp, tận tâm và giàu kinh nghiệm của chúng tôi
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-coach.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-red-400 font-medium">{member.role}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-slate-300 text-sm">{member.experience}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300 text-sm">{member.speciality}</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm mb-2">Chứng Chỉ:</h4>
                {member.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span className="text-slate-400 text-xs">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-bold text-white">Cam Kết Của Chúng Tôi</h3>
        </div>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Mỗi huấn luyện viên tại Sun Movement đều được đào tạo bài bản, cập nhật kiến thức thường xuyên 
          và luôn đặt sự an toàn, hiệu quả tập luyện của học viên lên hàng đầu.
        </p>
      </div>
    </div>
  );
};
