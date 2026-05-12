'use client';

import { useFilterStore } from '@/stores/useFilterStore';
import { FilterChip } from './FilterChip';
import { SubGenrePresetChip, PRESETS } from './SubGenrePresetChip';
import { RealmCode } from '@/types/event';
import { Search } from 'lucide-react';

const GENRE_LIST: { id: RealmCode; label: string }[] = [
  { id: 'A000', label: '연극' },
  { id: 'B000', label: '음악/콘서트' },
  { id: 'B002', label: '국악' },
  { id: 'B003', label: '뮤지컬/오페라' },
  { id: 'C000', label: '무용/발레' },
  { id: 'D000', label: '전시' },
];

export function FilterSidebar() {
  const { 
    realmCodes, toggleRealmCode, 
    subGenres, toggleSubGenre, 
    keyword, setKeyword,
    isFreeOnly, setIsFreeOnly,
    reset
  } = useFilterStore();

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-[var(--color-border-subtle)] pr-6 gap-8 h-fit sticky top-8">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input 
            type="text" 
            placeholder="공연·전시 제목, 장소" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-[var(--color-bg-overlay)] border border-[var(--color-border-default)] rounded-md pl-9 pr-3 py-2 text-sm focus:border-[var(--color-brand-primary)] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Mania Presets */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">마니아 추천</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <SubGenrePresetChip 
              key={preset.label} 
              preset={preset} 
              selected={subGenres.some(s => s.label === preset.label)}
              onClick={() => toggleSubGenre(preset)}
            />
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">분야</h3>
        <div className="flex flex-wrap gap-2">
          {GENRE_LIST.map((g) => (
            <FilterChip 
              key={g.id}
              label={g.label}
              realmCode={g.id}
              selected={realmCodes.includes(g.id)}
              onClick={() => toggleRealmCode(g.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Free toggle */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsFreeOnly(!isFreeOnly)}
          className={`w-10 h-5 rounded-full relative transition-colors ${isFreeOnly ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-default)]'}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isFreeOnly ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-[var(--color-text-primary)] font-medium">무료만 보기</span>
      </div>

      <button onClick={reset} className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors text-left w-fit mt-4">
        필터 초기화
      </button>
    </aside>
  );
}
