'use client';

import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/event/EventCard';
import { useEffect, useRef, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FilterSidebar } from '@/components/filter/FilterSidebar';
import { useFilterStore } from '@/stores/useFilterStore';
import { EmptyEventCard } from '@/components/event/EmptyEventCard';
import { ViewToggle, ViewType } from '@/components/view/ViewToggle';
import { CalendarView } from '@/components/view/CalendarView';
import { MapView } from '@/components/view/MapView';

export default function ExplorePage() {
  const store = useFilterStore();
  const [view, setView] = useState<ViewType>('card');
  
  // API Query Params
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (store.keyword) params.keyword = store.keyword;
    
    // Default period to upcoming month for testing MVP
    params.from = '20260501';
    params.to = '20260630';
    
    return params;
  }, [store.keyword]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useEvents({
    type: 'period',
    params: queryParams
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view !== 'card') return; 
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, view]);

  // Client-side filtering
  const filteredEvents = useMemo(() => {
    if (!data) return [];
    let events = data.pages.flat();

    // 1. RealmCode filter
    if (store.realmCodes.length > 0) {
      events = events.filter(e => store.realmCodes.includes(e.realmCode));
    }
    
    // 2. SubGenre filter
    if (store.subGenres.length > 0) {
      events = events.filter(e => 
        store.subGenres.some(sub => 
          e.realmCode === sub.realmCode && (!sub.keyword || e.title.includes(sub.keyword))
        )
      );
    }
    
    // 3. Free only filter
    if (store.isFreeOnly) {
      events = events.filter(e => e.price?.includes('무료'));
    }

    return events;
  }, [data, store.realmCodes, store.subGenres, store.isFreeOnly]);

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8 gap-6">
      <FilterSidebar />

      <main className="flex-1 min-w-0 flex flex-col">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">탐색</h1>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">
              결과 {filteredEvents.length}건
            </div>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {status === 'pending' ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-primary)]" />
          </div>
        ) : status === 'error' ? (
          <div className="py-20 text-center text-red-400">데이터를 불러오는 중 오류가 발생했습니다.</div>
        ) : filteredEvents.length === 0 ? (
          <EmptyEventCard />
        ) : (
          <>
            {view === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredEvents.map((event, i) => (
                  <EventCard key={`${event.id}-${i}`} event={event} />
                ))}
              </div>
            )}
            
            {view === 'calendar' && <CalendarView events={filteredEvents} />}
            {view === 'map' && <MapView events={filteredEvents} />}
          </>
        )}

        {/* Infinite Scroll Trigger */}
        {view === 'card' && (
          <div ref={observerRef} className="h-10 mt-6 flex items-center justify-center">
            {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-[var(--color-text-secondary)]" />}
          </div>
        )}
      </main>
    </div>
  );
}
