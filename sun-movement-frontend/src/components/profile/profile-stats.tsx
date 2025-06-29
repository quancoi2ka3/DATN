"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingBag, Calendar, Award } from "lucide-react";

export default function ProfileStats() {
  // Mock data - in real app, fetch from API
  const stats = {
    totalOrders: 12,
    totalSpent: 2450000,
    memberSince: "6 tháng",
    loyaltyPoints: 1250
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Thống kê tài khoản
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Đơn hàng</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.loyaltyPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Điểm thưởng</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{stats.totalSpent.toLocaleString('vi-VN')}đ</div>
            <div className="text-sm text-gray-600">Tổng chi tiêu</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-lg font-bold text-orange-600">{stats.memberSince}</div>
            <div className="text-sm text-gray-600">Thành viên</div>
          </div>
        </div>
        
        <div className="mt-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800">
            🏆 Thành viên VIP
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
