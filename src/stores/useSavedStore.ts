import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event } from '@/types/event';

interface SavedState {
  saved: Event[];
  toggle: (event: Event) => void;
  isSaved: (id: string) => boolean;
  clear: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggle: (event) => set((state) => {
        const exists = state.saved.some(e => e.id === event.id);
        if (exists) {
          return { saved: state.saved.filter(e => e.id !== event.id) };
        } else {
          return { saved: [event, ...state.saved] };
        }
      }),
      isSaved: (id) => get().saved.some(e => e.id === id),
      clear: () => set({ saved: [] }),
    }),
    {
      name: 'scene-saved-storage',
    }
  )
);
