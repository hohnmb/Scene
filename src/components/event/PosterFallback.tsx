import { Genre } from '@/types/event';
import { Drama, Mic2, Music3, Music, Sparkles, ImageIcon, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<Genre, any> = {
  theater: Drama,
  concert: Mic2,
  gugak: Music3,
  musical: Music,
  dance: Sparkles,
  exhibition: ImageIcon,
  etc: LayoutGrid,
};

const labels: Record<Genre, string> = {
  theater: '연극',
  concert: '음악/콘서트',
  gugak: '국악',
  musical: '뮤지컬/오페라',
  dance: '무용/발레',
  exhibition: '전시',
  etc: '기타',
};

const bgColors: Record<Genre, string> = {
  theater: 'bg-[var(--color-genre-theater)]',
  concert: 'bg-[var(--color-genre-concert)]',
  gugak: 'bg-[var(--color-genre-gugak)]',
  musical: 'bg-[var(--color-genre-musical)]',
  dance: 'bg-[var(--color-genre-dance)]',
  exhibition: 'bg-[var(--color-genre-exhibition)]',
  etc: 'bg-[var(--color-genre-etc)]',
};

export function PosterFallback({ genre }: { genre: Genre }) {
  const Icon = iconMap[genre] || LayoutGrid;
  return (
    <div 
      className={cn("w-full h-full flex flex-col items-center justify-center bg-opacity-30", bgColors[genre] || bgColors.etc)} 
      style={{ backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)' }}
    >
      <Icon className="w-16 h-16 text-white/40 mb-4" />
      <span className="text-white/60 font-semibold">{labels[genre] || '기타'}</span>
    </div>
  );
}
