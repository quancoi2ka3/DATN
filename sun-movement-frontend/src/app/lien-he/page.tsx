import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Liên Hệ</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>

            <div className="space-y-5">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-sunred mr-3" />
                <div>
                  <p className="font-medium">Điện thoại</p>
                  <a href="tel:08999139393" className="text-gray-600 hover:text-sunred">08999 139 393</a>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-sunred mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:contact@sunmovement.vn" className="text-gray-600 hover:text-sunred">contact@sunmovement.vn</a>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-sunred mr-3" />
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <address className="text-gray-600 not-italic">
                    Tầng 11, số 300 Đê La Thành Đính, Thổ Quan, Đống Đa, Hà Nội
                  </address>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-sunred mr-3" />
                <div>
                  <p className="font-medium">Giờ mở cửa</p>
                  <p className="text-gray-600">Thứ 2 - Thứ 7: 7:00 - 21:30</p>
                  <p className="text-gray-600">Chủ nhật: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <iframe
                title="Sun Movement Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.384564816232!2d105.8288443!3d21.0125016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8aeb95550b%3A0xe55436ee0d94d8e1!2zMzAwIMSQw6ogTGEgVGhhbmggxJDDrW5oLCBUaOG7lSBRdWFuLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2sus!4v1715033151826!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 border rounded-md"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 border rounded-md"
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full p-3 border rounded-md"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Chủ đề
                </label>
                <select
                  id="subject"
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="membership">Đăng ký thành viên</option>
                  <option value="class">Thông tin lớp học</option>
                  <option value="event">Sự kiện</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border rounded-md"
                  placeholder="Nhập tin nhắn của bạn"
                />
              </div>

              <Button className="w-full bg-sunred hover:bg-sunred/90" type="submit">
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
