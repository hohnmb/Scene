import { useInfiniteQuery } from '@tanstack/react-query';
import { Event } from '@/types/event';

export function useEvents({ type, params }: { type: string, params: Record<string, any> }) {
  return useInfiniteQuery({
    queryKey: ['events', type, params],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams(params as any);
      searchParams.set('PageNo', String(pageParam));
      
      const res = await fetch(`/api/events/${type}?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data: Event[] = await res.json();
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 20) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes as per PRD v1.2
    gcTime: 1000 * 60 * 10,
  });
}
