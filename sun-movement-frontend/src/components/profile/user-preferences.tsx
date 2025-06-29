"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Mail, Globe, Save } from "lucide-react";

export default function UserPreferences() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: "vi",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh"
  });

  const handleSave = () => {
    // Save preferences logic
    console.log('Saving preferences:', preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Tùy chọn cá nhân
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Thông báo email</Label>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">Thông báo SMS</Label>
              <Switch
                id="sms-notifications"
                checked={preferences.smsNotifications}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails">Email khuyến mãi</Label>
              <Switch
                id="marketing-emails"
                checked={preferences.marketingEmails}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Ngôn ngữ & Khu vực
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <Label htmlFor="language">Ngôn ngữ</Label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={preferences.language} 
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <Label htmlFor="currency">Tiền tệ</Label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={preferences.currency} 
                onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
