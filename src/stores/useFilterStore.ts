import { create } from 'zustand';
import { RealmCode, SubGenre } from '@/types/event';

export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface FilterState {
  realmCodes: RealmCode[];
  subGenres: SubGenre[];
  sido?: string;
  sigungu?: string;
  dateRange: { from: Date; to: Date } | null;
  keyword: string;
  isFreeOnly: boolean;
  mapBounds: MapBounds | null;
  sortStdr: '1' | '2' | '3'; // 1=등록일, 2=공연명, 3=지역
  
  toggleRealmCode: (code: RealmCode) => void;
  toggleSubGenre: (sub: SubGenre) => void;
  setSido: (sido?: string) => void;
  setSigungu: (sigungu?: string) => void;
  setDateRange: (range: { from: Date; to: Date } | null) => void;
  setKeyword: (keyword: string) => void;
  setIsFreeOnly: (isFree: boolean) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
  setSortStdr: (sort: '1' | '2' | '3') => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  realmCodes: [],
  subGenres: [],
  sido: undefined,
  sigungu: undefined,
  dateRange: null,
  keyword: '',
  isFreeOnly: false,
  mapBounds: null,
  sortStdr: '1',

  toggleRealmCode: (code) => set((state) => ({
    realmCodes: state.realmCodes.includes(code)
      ? state.realmCodes.filter((c) => c !== code)
      : [...state.realmCodes, code]
  })),
  toggleSubGenre: (sub) => set((state) => {
    const exists = state.subGenres.some((s) => s.label === sub.label);
    return {
      subGenres: exists
        ? state.subGenres.filter((s) => s.label !== sub.label)
        : [...state.subGenres, sub]
    };
  }),
  setSido: (sido) => set({ sido, sigungu: undefined }),
  setSigungu: (sigungu) => set({ sigungu }),
  setDateRange: (range) => set({ dateRange: range }),
  setKeyword: (keyword) => set({ keyword }),
  setIsFreeOnly: (isFreeOnly) => set({ isFreeOnly }),
  setMapBounds: (mapBounds) => set({ mapBounds }),
  setSortStdr: (sortStdr) => set({ sortStdr }),
  reset: () => set({
    realmCodes: [], subGenres: [], sido: undefined, sigungu: undefined, dateRange: null, keyword: '', isFreeOnly: false, mapBounds: null, sortStdr: '1'
  })
}));
