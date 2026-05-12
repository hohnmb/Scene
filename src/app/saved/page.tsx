'use client';

import { useSavedStore } from '@/stores/useSavedStore';
import { EventCard } from '@/components/event/EventCard';
import { useEffect, useState } from 'react';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const saved = useSavedStore(s => s.saved);
  const clear = useSavedStore(s => s.clear);
  const [mounted, setMounted] = useState(false);
  const [sort, setSort] = useState<'recent' | 'startDate'>('recent');

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const sortedEvents = [...saved].sort((a, b) => {
    if (sort === 'startDate') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    return 0; // 'recent' is the natural order
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">찜한 행사</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">총 {saved.length}건을 보관 중입니다.</p>
        </div>
        
        {saved.length > 0 && (
          <div className="flex items-center gap-4">
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value as 'recent' | 'startDate')}
              className="bg-[var(--color-bg-overlay)] border border-[var(--color-border-subtle)] rounded-md px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)]"
            >
              <option value="recent">최근 찜한 순</option>
              <option value="startDate">시작일 빠른 순</option>
            </select>
            <button onClick={clear} className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium">
              전체 삭제
            </button>
          </div>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)]">
          <HeartCrack className="w-16 h-16 text-[var(--color-text-tertiary)] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">아직 찜한 행사가 없어요</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">마음에 드는 전시나 공연을 발견하면 하트를 눌러보세요!</p>
          <Link 
            href="/explore"
            className="px-6 py-3 bg-[var(--color-brand-primary)] rounded-xl text-white font-medium hover:bg-[var(--color-brand-primary)]/90 transition-colors"
          >
            행사 탐색하러 가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
