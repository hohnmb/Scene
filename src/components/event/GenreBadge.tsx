import { Genre } from '@/types/event';
import { cn } from '@/lib/utils';

const genreLabels: Record<Genre, string> = {
  theater: '연극',
  concert: '음악/콘서트',
  gugak: '국악',
  musical: '뮤지컬/오페라',
  dance: '무용/발레',
  exhibition: '전시',
  etc: '기타',
};

const genreColorClasses: Record<Genre, string> = {
  theater: 'bg-[var(--color-genre-theater)]/12 text-[var(--color-genre-theater)]',
  concert: 'bg-[var(--color-genre-concert)]/12 text-[var(--color-genre-concert)]',
  gugak: 'bg-[var(--color-genre-gugak)]/12 text-[var(--color-genre-gugak)]',
  musical: 'bg-[var(--color-genre-musical)]/12 text-[var(--color-genre-musical)]',
  dance: 'bg-[var(--color-genre-dance)]/12 text-[var(--color-genre-dance)]',
  exhibition: 'bg-[var(--color-genre-exhibition)]/12 text-[var(--color-genre-exhibition)]',
  etc: 'bg-[var(--color-genre-etc)]/12 text-[var(--color-genre-etc)]',
};

export function GenreBadge({ genre, className }: { genre: Genre; className?: string }) {
  return (
    <div className={cn('px-2.5 py-1 rounded-full text-xs font-semibold w-fit', genreColorClasses[genre] || genreColorClasses['etc'], className)}>
      {genreLabels[genre] || '기타'}
    </div>
  );
}
