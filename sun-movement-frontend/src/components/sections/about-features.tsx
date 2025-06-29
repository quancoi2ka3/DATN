"use client";

import { Dumbbell, Users, Heart, Award, Target, Shield } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Tập Luyện Hiệu Quả",
      description: "Các bài tập được thiết kế khoa học, phù hợp với mọi trình độ",
      color: "from-red-500 to-red-400",
      hoverColor: "hover:border-red-500/50"
    },
    {
      icon: Users,
      title: "Cộng Đồng Tích Cực",
      description: "Kết nối với những người bạn cùng chí hướng và mục tiêu",
      color: "from-amber-500 to-amber-400",
      hoverColor: "hover:border-amber-500/50"
    },
    {
      icon: Heart,
      title: "Chăm Sóc Toàn Diện",
      description: "Hỗ trợ dinh dưỡng, tư vấn tâm lý và theo dõi tiến bộ",
      color: "from-emerald-500 to-emerald-400",
      hoverColor: "hover:border-emerald-500/50"
    },
    {
      icon: Award,
      title: "Chất Lượng Đẳng Cấp",
      description: "Thiết bị hiện đại, huấn luyện viên chuyên nghiệp",
      color: "from-blue-500 to-blue-400",
      hoverColor: "hover:border-blue-500/50"
    },
    {
      icon: Target,
      title: "Mục Tiêu Rõ Ràng",
      description: "Lộ trình tập luyện cá nhân hóa theo từng nhu cầu",
      color: "from-purple-500 to-purple-400",
      hoverColor: "hover:border-purple-500/50"
    },
    {
      icon: Shield,
      title: "An Toàn Tuyệt Đối",
      description: "Môi trường tập luyện an toàn với sự giám sát chặt chẽ",
      color: "from-green-500 to-green-400",
      hoverColor: "hover:border-green-500/50"
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Tại Sao Chọn Sun Movement?
      </h2>
      <p className="text-slate-300 text-lg mb-12 max-w-3xl mx-auto">
        Chúng tôi mang đến những giá trị độc đáo và dịch vụ chất lượng cao để đồng hành cùng hành trình của bạn
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className={`group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 ${feature.hoverColor} transition-transform transition-border duration-300 hover:scale-105`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
