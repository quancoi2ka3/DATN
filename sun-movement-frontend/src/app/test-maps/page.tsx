"use client";

import { GoogleMap } from "@/components/ui/google-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function MapTestPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Google Maps Test</h1>
      <p className="text-center text-slate-600 mb-12">
        Kiểm tra hiển thị Google Maps với địa chỉ: Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội
      </p>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Google Map Component - Default Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Google Map Component - Custom Height 500px
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap height="500px" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Google Map Component - Number Height 400
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap height={400} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
