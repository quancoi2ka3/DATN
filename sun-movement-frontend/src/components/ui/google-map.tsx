"use client";

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapProps {
  address?: string;
  height?: string | number;
  className?: string;
}

const COMPANY_ADDRESS = "Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội";

export function GoogleMap({ 
  address = COMPANY_ADDRESS, 
  height = 300,
  className = ""
}: GoogleMapProps) {
  const [mapError, setMapError] = useState(false);
  
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed&z=17`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const viewUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  
  if (mapError) {
    return (
      <div className={`bg-slate-100 rounded-lg p-8 text-center ${className}`} style={{ height }}>
        <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-800 mb-2">Xem vị trí trên Google Maps</h3>
        <p className="text-slate-600 mb-4">{address}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            asChild
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-4 w-4 mr-2" />
              Chỉ đường
            </a>
          </Button>
          <Button 
            variant="outline"
            asChild
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <a href={viewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem trên Maps
            </a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height }}>
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Sun Movement Location"
        onError={() => setMapError(true)}
        onLoad={(e) => {
          // Check if iframe loaded successfully
          const iframe = e.target as HTMLIFrameElement;
          try {
            // This will throw an error if the iframe didn't load properly
            if (!iframe.contentWindow) {
              setMapError(true);
            }
          } catch {
            // Expected cross-origin error, means iframe loaded successfully
          }
        }}
      />
      
      {/* Overlay buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <Button 
          size="sm"
          asChild
          className="bg-white/90 text-slate-800 hover:bg-white shadow-lg"
        >
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="h-3 w-3 mr-1" />
            Chỉ đường
          </a>
        </Button>
        <Button 
          size="sm"
          variant="outline"
          asChild
          className="bg-white/90 border-slate-300 text-slate-800 hover:bg-white shadow-lg"
        >
          <a href={viewUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
