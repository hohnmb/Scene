'use client';

import { useRouter } from 'next/navigation';
import { useFilterStore } from '@/stores/useFilterStore';
import { Drama, Music, Music3, Sparkles, Mic2, ImageIcon } from 'lucide-react';
import { RealmCode } from '@/types/event';

// Map 6 target RealmCodes.
const GENRES: { id: RealmCode; label: string; Icon: any; color: string }[] = [
  { id: 'A000', label: '연극', Icon: Drama, color: 'var(--color-genre-theater)' },
  { id: 'B000', label: '음악/콘서트', Icon: Mic2, color: 'var(--color-genre-concert)' },
  { id: 'B002', label: '국악', Icon: Music3, color: 'var(--color-genre-gugak)' },
  { id: 'B003', label: '뮤지컬/오페라', Icon: Music, color: 'var(--color-genre-musical)' },
  { id: 'C000', label: '무용/발레', Icon: Sparkles, color: 'var(--color-genre-dance)' },
  { id: 'D000', label: '전시', Icon: ImageIcon, color: 'var(--color-genre-exhibition)' },
];

export function GenreShortcuts() {
  const router = useRouter();
  const reset = useFilterStore(s => s.reset);
  const toggleRealmCode = useFilterStore(s => s.toggleRealmCode);

  const handleClick = (code: RealmCode) => {
    reset(); 
    toggleRealmCode(code);
    router.push('/explore');
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">분야별로 찾아보기</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {GENRES.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-border-default)] transition-colors"
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}1A`, color: color }}
            >
              <Icon className="w-7 h-7" />
            </div>
            <span className="font-semibold text-sm text-[var(--color-text-primary)]">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
