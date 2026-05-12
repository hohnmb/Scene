import { LayoutGrid, Calendar, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'card' | 'calendar' | 'map';

interface ViewToggleProps {
  view: ViewType;
  onChange: (view: ViewType) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-[var(--color-bg-overlay)] rounded-lg p-1 border border-[var(--color-border-subtle)] w-fit">
      <button 
        onClick={() => onChange('card')}
        className={cn("px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-all", view === 'card' ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">리스트</span>
      </button>
      <button 
        onClick={() => onChange('calendar')}
        className={cn("px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-all", view === 'calendar' ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">캘린더</span>
      </button>
      <button 
        onClick={() => onChange('map')}
        className={cn("px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-all", view === 'map' ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}
      >
        <Map className="w-4 h-4" />
        <span className="hidden sm:inline">지도</span>
      </button>
    </div>
  );
}
