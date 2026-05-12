import { Event } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { GenreBadge } from '@/components/event/GenreBadge';

export function HeroBanner({ event }: { event: Event }) {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with heavy blur */}
      {event.posterUrl && (
        <div className="absolute inset-0 z-0">
          <Image src={event.posterUrl} alt="" fill className="object-cover opacity-30 blur-2xl scale-110" />
        </div>
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/80 to-transparent" />

      <div className="relative z-10 w-full max-w-[1440px] px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="relative w-[240px] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 hidden sm:block">
          {event.posterUrl && (
            <Image src={event.posterUrl} alt={event.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 320px" />
          )}
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <GenreBadge genre={event.genre} className="mb-4" />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg line-clamp-3">
            {event.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-white/80 mb-8 font-medium">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-5 h-5 shrink-0" />
              <span>{event.startDate} ~ {event.endDate}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-5 h-5 shrink-0" />
              <span>{event.venue.name || '장소 미상'}</span>
            </div>
          </div>

          <Link 
            href={`/event/${event.id}`}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors shadow-xl group"
          >
            자세히 보기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
