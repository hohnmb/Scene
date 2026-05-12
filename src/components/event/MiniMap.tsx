'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { NoLocationBadge } from './NoLocationBadge';

declare global {
  interface Window {
    kakao: any;
  }
}

export function MiniMap({ lat, lng, address }: { lat: number | null, lng: number | null, address: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(lat && lng ? {lat, lng} : null);
  const [loading, setLoading] = useState(!coords);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGeocode() {
      if (coords) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const doc = data.documents[0];
          setCoords({ lat: parseFloat(doc.y), lng: parseFloat(doc.x) });
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchGeocode();
  }, [address, coords]);

  useEffect(() => {
    if (!coords || !mapRef.current) return;
    
    // Check if Kakao Maps SDK is loaded via global window object
    if (!window.kakao || !window.kakao.maps) {
      // In MVP, we might not have the script loaded if NEXT_PUBLIC_KAKAO_MAP_KEY is missing.
      return;
    }

    window.kakao.maps.load(() => {
      const position = new window.kakao.maps.LatLng(coords.lat, coords.lng);
      const options = { center: position, level: 3 };
      const map = new window.kakao.maps.Map(mapRef.current, options);
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map);
    });
  }, [coords]);

  if (loading) return <div className="h-60 bg-[var(--color-bg-overlay)] rounded-xl flex items-center justify-center border border-[var(--color-border-subtle)]"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-text-tertiary)]" /></div>;
  
  if (error || !coords) return <div className="h-60 bg-[var(--color-bg-overlay)] rounded-xl flex flex-col items-center justify-center border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-sm gap-2"><NoLocationBadge /><span>{address}</span></div>;

  return (
    <div className="relative h-60 w-full rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
      {/* Target container for Kakao Map */}
      <div ref={mapRef} className="w-full h-full bg-[var(--color-bg-overlay)] flex items-center justify-center text-sm text-[var(--color-text-tertiary)]">
        지도를 불러오는 중이거나 카카오맵 API 키가 필요합니다.
      </div>
    </div>
  );
}
