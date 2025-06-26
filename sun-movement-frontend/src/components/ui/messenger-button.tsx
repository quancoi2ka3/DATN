"use client";

import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";
import { MessageCircle, Phone, Mail } from "lucide-react";

interface MessengerButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  icon?: "message" | "phone" | "mail";
}

export function MessengerButton({ 
  children = "Liên hệ ngay", 
  className = "",
  variant = "default",
  size = "default",
  icon = "message"
}: MessengerButtonProps) {
  const IconComponent = {
    message: MessageCircle,
    phone: Phone,
    mail: Mail
  }[icon];

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <a 
        href={CONTACT_INFO.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconComponent className="mr-2 h-4 w-4" />
        {children}
      </a>
    </Button>
  );
}

// Floating Contact Button component
export function FloatingContactButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <MessengerButton
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl rounded-full px-6 py-4 animate-pulse hover:animate-none transition-all"
        icon="message"
        size="lg"
      >
        <span className="hidden sm:inline">Chat với chúng tôi</span>
        <span className="sm:hidden">Chat</span>
      </MessengerButton>
    </div>
  );
}

// Quick Contact component with multiple options
export function QuickContactOptions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <MessengerButton
        className="bg-blue-600 hover:bg-blue-700 text-white"
        icon="message"
      >
        Chat Messenger
      </MessengerButton>
      
      <Button variant="outline" asChild>
        <a href={`tel:${CONTACT_INFO.phone}`}>
          <Phone className="mr-2 h-4 w-4" />
          {CONTACT_INFO.phone}
        </a>
      </Button>
      
      <Button variant="outline" asChild>
        <a href={`mailto:${CONTACT_INFO.email}`}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </a>
      </Button>
    </div>
  );
}
