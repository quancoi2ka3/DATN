import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EventProps = {
  id: string;
  title: string;
  type: "WORKSHOP" | "GIẢI ĐẤU";
  date: string;
  time: string;
  image: string;
  instructor: string;
  capacity: number;
  status: "Đã diễn ra" | "Sắp diễn ra";
};

const events: EventProps[] = [
  {
    id: "1",
    title: "Handstand Intensive",
    type: "WORKSHOP",
    date: "27-28/05/2023",
    time: "10:00-13:00",
    image: "/images/event1.jpg",
    instructor: "Nicólás Montes de Oca",
    capacity: 10,
    status: "Đã diễn ra",
  },
  {
    id: "2",
    title: "Kìm linh hoạt khớp vai",
    type: "WORKSHOP",
    date: "10/07/2022",
    time: "15:00",
    image: "/images/event2.jpg",
    instructor: "Đinh Hưng",
    capacity: 15,
    status: "Đã diễn ra",
  },
  {
    id: "3",
    title: "ATG Squat - Squat sâu & an toàn",
    type: "GIẢI ĐẤU",
    date: "05/06/2022",
    time: "15:00",
    image: "/images/event3.jpg",
    instructor: "Trung Lê",
    capacity: 20,
    status: "Đã diễn ra",
  },
];

export function EventsSection() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-12">SỰ KIỆN</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-56 w-full">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-sunred text-white text-xs font-semibold px-2 py-1 rounded">
                    {event.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                    {event.type}
                  </span>
                </div>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Giới hạn: {event.capacity} người</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/su-kien/${event.id}`}>Xem chi tiết</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button className="bg-sunred hover:bg-sunred/90" asChild>
            <Link href="/su-kien">Xem tất cả sự kiện</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
