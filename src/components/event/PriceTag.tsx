import { Gift } from 'lucide-react';

export function PriceTag({ price }: { price?: string }) {
  if (!price) return null;
  
  const isFree = price.includes('무료');
  const isPaidOnly = price.includes('유료') && price.length <= 3;

  if (isFree) {
    return (
      <div className="flex items-center gap-1 text-[#4ADE80] text-xs font-medium justify-end mt-auto">
        <Gift className="w-3 h-3" />
        <span>무료</span>
      </div>
    );
  }

  return (
    <div className="text-[var(--color-brand-accent)] text-xs font-medium text-right truncate mt-auto">
      {isPaidOnly ? '유료' : price}
    </div>
  );
}
