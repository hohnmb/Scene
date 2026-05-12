'use client';
import Image from 'next/image';
import { Event } from '@/types/event';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { GenreBadge } from './GenreBadge';
import { PosterFallback } from './PosterFallback';
import { NoLocationBadge } from './NoLocationBadge';
import { PriceTag } from './PriceTag';
import Link from 'next/link';
import { useSavedStore } from '@/stores/useSavedStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function EventCard({ event }: { event: Event }) {
  const hasLocation = event.venue.lat !== null && event.venue.lng !== null;
  const toggle = useSavedStore(s => s.toggle);
  const isSaved = useSavedStore(s => s.isSaved(event.id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link 
      href={`/event/${event.id}`} 
      className="group flex flex-col bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-[var(--color-border-subtle)]"
    >
      {/* Poster Area */}
      <div className="relative aspect-[3/4] w-full bg-black/20 overflow-hidden shrink-0">
        {event.posterUrl ? (
          <Image 
            src={event.posterUrl} 
            alt={event.title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <PosterFallback genre={event.genre} />
        )}
        
        {/* Badges on Poster */}
        <div className="absolute top-3 left-3">
          <GenreBadge genre={event.genre} />
        </div>
        
        <button 
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-colors z-10",
            mounted && isSaved 
              ? "bg-black/60 text-[var(--color-brand-accent)]" 
              : "bg-black/40 text-white/80 hover:text-[var(--color-brand-accent)] hover:bg-black/60"
          )}
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            toggle(event); 
          }}
        >
          <Heart className="w-4 h-4" fill={mounted && isSaved ? "currentColor" : "none"} />
        </button>

        {!hasLocation && (
          <div className="absolute bottom-3 left-3">
            <NoLocationBadge />
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-base line-clamp-2 leading-tight text-[var(--color-text-primary)]">
          {event.title}
        </h3>
        
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{event.startDate} ~ {event.endDate}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{event.venue.name || '장소 미상'}</span>
          </div>
        </div>

        <div className="mt-2 flex-1 flex flex-col justify-end">
          <PriceTag price={event.price} />
        </div>
      </div>
    </Link>
  );
}
