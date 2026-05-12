import { useQuery } from '@tanstack/react-query';
import { dataSource, BoundsParams } from '@/lib/api/data-source';

export function useEventsByBounds(params: Omit<BoundsParams, 'cPage' | 'rows'>) {
  return useQuery({
    queryKey: ['eventsBounds', params],
    queryFn: () => dataSource.searchByBounds({ ...params, cPage: 1, rows: 100 }), // Map view loads many at once
    staleTime: 1000 * 60 * 5,
    enabled: !!params.gpsxfrom && !!params.gpsxto && !!params.gpsyfrom && !!params.gpsyto,
  });
}
