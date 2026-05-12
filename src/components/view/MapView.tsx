'use client';

import { Event } from '@/types/event';
import { useEffect, useRef, useState } from 'react';
import { EventCard } from '@/components/event/EventCard';
import { NoLocationBadge } from '@/components/event/NoLocationBadge';

export function MapView({ events }: { events: Event[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  const validEvents = events.filter(e => e.venue.lat && e.venue.lng);
  const invalidEvents = events.filter(e => !e.venue.lat || !e.venue.lng);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Seoul
        level: 8
      };
      const m = new window.kakao.maps.Map(mapRef.current, options);
      setMap(m);
    });
  }, []);

  useEffect(() => {
    if (!map || !window.kakao) return;

    // MVP: draw simple markers
    const markers = validEvents.map(e => {
      const position = new window.kakao.maps.LatLng(e.venue.lat, e.venue.lng);
      const marker = new window.kakao.maps.Marker({ position });
      
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:12px;color:#000;font-family:var(--font-sans);min-width:150px;border-radius:8px;">${e.title}</div>`
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
      window.kakao.maps.event.addListener(marker, 'click', () => {
        window.location.href = `/event/${e.id}`;
      });

      marker.setMap(map);
      return marker;
    });

    return () => {
      markers.forEach(m => m.setMap(null));
    };
  }, [map, validEvents]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
      <div className="flex-1 rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] relative">
        <div ref={mapRef} className="w-full h-full bg-[var(--color-bg-overlay)] flex flex-col items-center justify-center text-sm text-[var(--color-text-tertiary)] gap-2">
          <span>지도를 불러오는 중이거나, 카카오맵 API 키가 없습니다.</span>
        </div>
      </div>
      <div className="w-full lg:w-[320px] flex flex-col bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-2xl p-4 overflow-y-auto">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-4 sticky top-0 bg-[var(--color-bg-elevated)] z-10 py-2">
          현재 화면 내 행사 ({validEvents.length}건)
        </h3>
        <div className="flex flex-col gap-4">
          {validEvents.map(e => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        
        {invalidEvents.length > 0 && (
          <div className="mt-8 pt-4 border-t border-[var(--color-border-subtle)]">
            <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <NoLocationBadge />
              위치정보 없음 ({invalidEvents.length}건)
            </h3>
            <div className="flex flex-col gap-4">
              {invalidEvents.map(e => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
