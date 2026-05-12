'use client';

import { useEventDetail } from '@/hooks/useEventDetail';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Calendar, MapPin, Heart, Share2, ExternalLink } from 'lucide-react';
import { GenreBadge } from '@/components/event/GenreBadge';
import { PosterFallback } from '@/components/event/PosterFallback';
import { PriceTag } from '@/components/event/PriceTag';
import { MiniMap } from '@/components/event/MiniMap';
import { useSavedStore } from '@/stores/useSavedStore';
import { cn } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: event, status } = useEventDetail(id);

  const toggle = useSavedStore(s => s.toggle);
  const isSaved = useSavedStore(s => event ? s.isSaved(event.id) : false);
  const [mounted, setMounted] = useState(false);
  const [posterError, setPosterError] = useState(false);

  useEffect(() => setMounted(true), []);

  if (status === 'pending') {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-primary)]" /></div>;
  }
  
  if (status === 'error' || !event) {
    return <div className="py-32 text-center text-red-400">행사 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left: Poster */}
        <div className="w-full md:w-[40%] shrink-0">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border-subtle)] bg-black/20">
            {event.posterUrl && !posterError ? (
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                onError={() => setPosterError(true)}
                unoptimized
              />
            ) : (
              <PosterFallback genre={event.genre} />
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col flex-1">
          <GenreBadge genre={event.genre} className="mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] leading-tight mb-6">
            {event.title}
          </h1>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-start gap-3 text-[var(--color-text-secondary)]">
              <Calendar className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-[var(--color-text-primary)]">기간</div>
                <div className="mt-1">{event.startDate} ~ {event.endDate}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-[var(--color-text-secondary)]">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-[var(--color-text-primary)]">장소</div>
                <div className="mt-1">{event.venue.name || '장소 미상'}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-[var(--color-text-secondary)]">
              <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center font-bold text-lg">₩</div>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-primary)]">가격</div>
                <div className="mt-1"><PriceTag price={event.price} /></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-10">
            <button 
              onClick={() => toggle(event)}
              className={cn("flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-colors", 
                mounted && isSaved
                  ? "bg-[var(--color-bg-overlay)] border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]"
                  : "bg-[var(--color-bg-overlay)] border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              )}
            >
              <Heart className="w-5 h-5" fill={mounted && isSaved ? "currentColor" : "none"} />
              {mounted && isSaved ? '찜 취소' : '찜하기'}
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: event.title, text: 'SCENE에서 이 행사를 확인해보세요!', url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 복사되었습니다.');
                }
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-bg-overlay)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] transition-colors text-[var(--color-text-primary)]"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {event.externalUrl && (
              <a href={event.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 transition-colors text-white font-semibold ml-auto">
                예매하기
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">소개</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Map */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">위치</h3>
            <MiniMap lat={event.venue.lat} lng={event.venue.lng} address={event.venue.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
