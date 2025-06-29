"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ShoppingBag, CheckCircle, Truck } from "lucide-react";

export default function ActivityHistory() {
  // Mock data - in real app, fetch from API
  const activities = [
    {
      id: 1,
      type: "order",
      title: "Đặt hàng thành công",
      description: "Đơn hàng #ORD-001 - Áo thun Calisthenics",
      time: "2 giờ trước",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "shipping",
      title: "Đơn hàng đang giao",
      description: "Đơn hàng #ORD-002 đang được vận chuyển",
      time: "1 ngày trước",
      status: "in-progress",
      icon: Truck,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "order",
      title: "Đặt hàng mới",
      description: "Đơn hàng #ORD-003 - Bộ tập yoga",
      time: "3 ngày trước",
      status: "pending",
      icon: ShoppingBag,
      color: "text-orange-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full bg-white ${activity.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status === 'completed' ? 'Hoàn thành' : 
                       activity.status === 'in-progress' ? 'Đang xử lý' : 'Chờ xử lý'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
