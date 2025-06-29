"use client";

import { BarChart, Users, Award, Clock } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "5000+",
      label: "Thành Viên",
      description: "Cộng đồng lớn mạnh",
      color: "from-blue-500 to-blue-400"
    },
    {
      icon: Award,
      number: "98%",
      label: "Hài Lòng",
      description: "Tỷ lệ khách hàng hài lòng",
      color: "from-green-500 to-green-400"
    },
    {
      icon: Clock,
      number: "7+",
      label: "Năm Kinh Nghiệm",
      description: "Hoạt động và phát triển",
      color: "from-purple-500 to-purple-400"
    },
    {
      icon: BarChart,
      number: "1000+",
      label: "Mục Tiêu Đạt Được",
      description: "Thành công cùng học viên",
      color: "from-red-500 to-red-400"
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Con Số Ấn Tượng
      </h2>
      <p className="text-slate-300 text-lg mb-12">
        Những thành tựu chúng tôi tự hào sau 7 năm hoạt động
      </p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{stat.label}</h3>
              <p className="text-slate-400 text-sm">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
