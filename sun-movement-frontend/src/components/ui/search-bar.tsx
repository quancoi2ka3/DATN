"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { trackSearch } from "@/services/analytics";
import { useState, useEffect } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({ 
  value = "", 
  onChange = () => {}, 
  placeholder = "Tìm kiếm...",
  className = "",
  onSearch = () => {}
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value);

  // Enhanced search tracking with immediate and debounced events
  useEffect(() => {
    if (searchTerm.length > 0) {
      // Track immediately when user starts typing (for engagement)
      trackSearch('anonymous', searchTerm, 0);
      
      // Also track with debounce for completed searches
      const timeoutId = setTimeout(() => {
        if (searchTerm.length > 2) {
          trackSearch('anonymous', searchTerm, 0);
          console.log('🔍 Search tracked:', searchTerm);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const handleChange = (newValue: string) => {
    setSearchTerm(newValue);
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm) {
      onSearch(searchTerm);
    }
  };
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
      />
    </div>
  );
}