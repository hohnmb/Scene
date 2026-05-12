'use client';

import { Calendar, dateFnsLocalizer, Event as RbcEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event } from '@/types/event';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EventCard } from '@/components/event/EventCard';
import { X } from 'lucide-react';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { ko },
});

interface CalendarEvent extends RbcEvent {
  resource: Event;
}

export function CalendarView({ events }: { events: Event[] }) {
  const router = useRouter();
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[] | null>(null);

  // Parse YYYY-MM-DD into valid JS Dates.
  // Add 1 day to end date because react-big-calendar allDay events are exclusive on end date.
  const calendarEvents: CalendarEvent[] = events.map(e => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    end.setDate(end.getDate() + 1); // Make it inclusive for visual representation

    return {
      title: e.title,
      start,
      end,
      allDay: true,
      resource: e,
    };
  });

  const eventStyleGetter = (event: CalendarEvent) => {
    const genre = event.resource.genre;
    const style = {
      backgroundColor: `var(--color-genre-${genre})`,
      borderRadius: '4px',
      opacity: 0.9,
      color: '#fff',
      border: 'none',
      display: 'block',
      fontWeight: 500,
      padding: '2px 6px'
    };
    return { style };
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // Find all events happening on this date
    const dayEvents = events.filter(e => {
      const eStart = new Date(e.startDate);
      const eEnd = new Date(e.endDate);
      // Reset hours to compare dates only
      eStart.setHours(0,0,0,0);
      eEnd.setHours(0,0,0,0);
      const target = new Date(start);
      target.setHours(0,0,0,0);
      
      return target >= eStart && target <= eEnd;
    });

    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
    }
  };

  return (
    <div className="relative">
      <div className="h-[700px] w-full bg-[var(--color-bg-elevated)] p-4 rounded-2xl border border-[var(--color-border-subtle)]">
        <style dangerouslySetInnerHTML={{__html: `
          .rbc-calendar { font-family: var(--font-sans); }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: var(--color-border-subtle); border-radius: 8px; overflow: hidden; }
          .rbc-header { border-bottom: 1px solid var(--color-border-subtle); padding: 12px 0; font-weight: 600; color: var(--color-text-secondary); }
          .rbc-day-bg { border-left: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); }
          .rbc-off-range-bg { background: var(--color-bg-overlay); }
          .rbc-today { background: rgba(99,102,241,0.08); }
          .rbc-event { font-size: 11px; margin-bottom: 2px; }
          .rbc-btn-group button { color: var(--color-text-primary); border-color: var(--color-border-subtle); }
          .rbc-btn-group button:hover, .rbc-btn-group button:active, .rbc-btn-group button.rbc-active { background-color: var(--color-bg-overlay); }
          .rbc-toolbar button { background: var(--color-bg-base); }
          .rbc-date-cell { padding: 4px; font-weight: 500; }
        `}} />
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          culture="ko"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(e) => router.push(`/event/${e.resource.id}`)}
          onSelectSlot={handleSelectSlot}
          selectable
          views={['month', 'week', 'agenda']}
          defaultView="month"
        />
      </div>

      {/* Day Events Modal (MVP) */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-2xl w-full max-w-[600px] max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)]">
              <h3 className="font-bold text-lg text-[var(--color-text-primary)]">선택한 날짜의 행사 ({selectedDayEvents.length}건)</h3>
              <button onClick={() => setSelectedDayEvents(null)} className="p-1 hover:bg-[var(--color-bg-overlay)] rounded-full transition-colors text-[var(--color-text-secondary)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-4">
              {selectedDayEvents.map(e => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
