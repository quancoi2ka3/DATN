"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value = "", 
  onChange = () => {}, 
  placeholder = "Tìm kiếm...",
  className = ""
}: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}