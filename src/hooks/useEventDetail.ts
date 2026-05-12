import { useQuery } from '@tanstack/react-query';
import { dataSource } from '@/lib/api/data-source';

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ['eventDetail', id],
    queryFn: () => dataSource.getDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
