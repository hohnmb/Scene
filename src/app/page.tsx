'use client';

import { useEvents } from '@/hooks/useEvents';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { EventSection } from '@/components/home/EventSection';
import { GenreShortcuts } from '@/components/home/GenreShortcuts';

export default function HomePage() {
  const queryParams = useMemo(() => {
    return {
      from: '20260501',
      to: '20260531'
    };
  }, []);

  const { data, status } = useEvents({
    type: 'period',
    params: queryParams
  });

  const allEvents = useMemo(() => data ? data.pages.flat() : [], [data]);

  const { heroEvent, recommendedEvents, closingEvents } = useMemo(() => {
    if (!allEvents.length) return { heroEvent: null, recommendedEvents: [], closingEvents: [] };

    const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
    
    // Pick first valid poster event for hero
    const heroEvent = shuffled.find(e => e.posterUrl) || shuffled[0];
    
    // Pick 8 random for recommended
    const recommendedEvents = shuffled.filter(e => e.id !== heroEvent.id).slice(0, 8);
    
    // Sort by end date ascending for closing soon
    const closingEvents = [...allEvents]
      .filter(e => e.id !== heroEvent.id)
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 8);

    return { heroEvent, recommendedEvents, closingEvents };
  }, [allEvents]);

  if (status === 'pending') {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand-primary)]" /></div>;
  }

  if (status === 'error' || !heroEvent) {
    return <div className="py-32 text-center text-[var(--color-text-secondary)]">행사 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24 pb-20">
      <HeroBanner event={heroEvent} />
      
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 flex flex-col gap-16 md:gap-24">
        <GenreShortcuts />
        <EventSection title="오늘의 추천 큐레이션" events={recommendedEvents} />
        <EventSection title="마감 임박! 서두르세요" events={closingEvents} />
      </div>
    </div>
  );
}
