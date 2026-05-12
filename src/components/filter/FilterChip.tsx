import { cn } from '@/lib/utils';
import { RealmCode } from '@/types/event';
import { Check } from 'lucide-react';
import { REALM_MAP } from '@/lib/mappers/realm';

const getSelectedStyle = (code: RealmCode) => {
  const genre = REALM_MAP[code]?.genre || 'etc';
  return `bg-[var(--color-genre-${genre})]/12 border-[var(--color-genre-${genre})] text-[var(--color-genre-${genre})]`;
};

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  realmCode?: RealmCode;
}

export function FilterChip({ label, selected, onClick, realmCode }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
        selected
          ? (realmCode ? getSelectedStyle(realmCode) : "bg-[var(--color-brand-primary)]/10 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]")
          : "bg-[var(--color-bg-overlay)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-default)] hover:text-[var(--color-text-primary)]"
      )}
    >
      {selected && <Check className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
