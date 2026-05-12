import { MapPinOff } from 'lucide-react';

export function NoLocationBadge({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 bg-black/60 text-white/70 px-2 py-1 rounded-full text-[11px] font-medium w-fit ${className || ''}`}>
      <MapPinOff className="w-3 h-3" />
      <span>위치정보 없음</span>
    </div>
  );
}
