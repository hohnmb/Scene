import { Event } from '@/types/event';
import { EventCard } from '@/components/event/EventCard';

export function EventSection({ title, events }: { title: string; events: Event[] }) {
  if (!events.length) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h2>
      </div>
      
      {/* Horizontal scrollable list without scrollbar */}
      <div className="flex overflow-x-auto gap-5 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {events.map((event) => (
          <div key={event.id} className="w-[260px] md:w-[300px] snap-start shrink-0">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
