import { Event } from '@/types/event';

export interface SearchParams {
  from?: string;
  to?: string;
  cPage?: number;
  rows?: number;
  keyword?: string;
  sortStdr?: string;
}

export interface AreaParams extends SearchParams {
  area: string;
}

export interface RealmParams extends SearchParams {
  realmCode?: string; 
}

export interface BoundsParams extends SearchParams {
  gpsxfrom: string;
  gpsxto: string;
  gpsyfrom: string;
  gpsyto: string;
}

export interface EventDataSource {
  searchByPeriod(params: SearchParams): Promise<Event[]>;
  searchByArea(params: AreaParams): Promise<Event[]>;
  searchByBounds(params: BoundsParams): Promise<Event[]>;
  searchByRealm(params: RealmParams): Promise<Event[]>;
  getDetail(id: string): Promise<Event>;
}

export class KCISADataSource implements EventDataSource {
  private async fetchApi(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    }
    const response = await fetch(`/api/events${endpoint}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  searchByPeriod(params: SearchParams): Promise<Event[]> {
    return this.fetchApi('/period', params);
  }

  searchByArea(params: AreaParams): Promise<Event[]> {
    return this.fetchApi('/area', params);
  }

  searchByBounds(params: BoundsParams): Promise<Event[]> {
    return this.fetchApi('/bounds', params);
  }

  searchByRealm(params: RealmParams): Promise<Event[]> {
    return this.fetchApi('/realm', params);
  }

  getDetail(id: string): Promise<Event> {
    return this.fetchApi(`/${id}`);
  }
}

export const dataSource = new KCISADataSource();
