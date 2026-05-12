import { SubGenre, RealmCode } from '@/types/event';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { REALM_MAP } from '@/lib/mappers/realm';

export const PRESETS: SubGenre[] = [
  { label: '재즈', realmCode: 'B000', keyword: '재즈' },
  { label: '락', realmCode: 'B000', keyword: '락' },
  { label: '일렉트로닉', realmCode: 'B000', keyword: '일렉트로닉' },
  { label: '모던 클래식', realmCode: 'B000', keyword: '모던' },
  { label: '현대미술', realmCode: 'D000', keyword: '현대' },
  { label: '사진전', realmCode: 'D000', keyword: '사진' },
  { label: '실험극', realmCode: 'A000', keyword: '실험' },
  { label: '컨템퍼러리 댄스', realmCode: 'C000', keyword: '컨템퍼러리' },
];

export function SubGenrePresetChip({ preset, selected, onClick }: { preset: SubGenre; selected: boolean; onClick: () => void }) {
  const meta = REALM_MAP[preset.realmCode];
  const textColorClass = `text-[var(--color-genre-${meta.genre})]`;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-colors min-w-[100px]",
        selected 
          ? "bg-[var(--color-bg-overlay)] border-[var(--color-border-default)]" 
          : "bg-[var(--color-bg-base)] border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-overlay)] hover:border-[var(--color-border-default)]"
      )}
    >
      <div className="flex items-center gap-1.5 w-full">
        {selected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
        <span className={cn("font-semibold text-sm", textColorClass)}>{preset.label}</span>
      </div>
      <span className={cn("text-[11px] text-[var(--color-text-secondary)] mt-0.5", selected ? "pl-5" : "pl-0")}>
        {meta.korean}
      </span>
    </button>
  );
}
