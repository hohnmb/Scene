import { SearchX } from 'lucide-react';
import { useFilterStore } from '@/stores/useFilterStore';

export function EmptyEventCard() {
  const reset = useFilterStore(s => s.reset);
  
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border-subtle)]">
      <SearchX className="w-16 h-16 text-[var(--color-text-tertiary)] mb-4" />
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">조건에 맞는 행사가 없어요</h3>
      <p className="text-[var(--color-text-secondary)] mb-6">필터를 조금 풀어보거나, 검색어를 변경해보세요</p>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-[var(--color-bg-overlay)] border border-[var(--color-border-default)] rounded-md text-sm font-medium hover:bg-[var(--color-border-subtle)] transition-colors text-white"
      >
        필터 초기화
      </button>
    </div>
  );
}
