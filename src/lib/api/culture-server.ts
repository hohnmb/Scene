import { XMLParser } from 'fast-xml-parser';
import { Event, RealmCode } from '@/types/event';
import { yyyymmddToIso } from '../utils/date';
import { mapRealmNameToCode, REALM_MAP } from '../mappers/realm';

const BASE_URL = 'https://apis.data.go.kr/B553457/cultureinfo';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false, // '00' → '00' (문자열 유지, 숫자 변환 방지)
});

export async function fetchCultureApi(endpoint: string, params: Record<string, any> = {}) {
  const serviceKey = process.env.CULTURE_API_KEY_DECODED || process.env.CULTURE_API_KEY_ENCODED;

  const searchParams = new URLSearchParams();
  searchParams.append('serviceKey', serviceKey || '');

  if (!params.PageNo) searchParams.append('PageNo', '1');
  if (!params.numOfrows) searchParams.append('numOfrows', '20');

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'cPage') { searchParams.set('PageNo', String(value)); continue; }
    if (key === 'rows')  { searchParams.set('numOfrows', String(value)); continue; }
    searchParams.append(key, String(value));
  }

  if (!endpoint.includes('detail2')) {
    searchParams.set('serviceTp', 'A');
  }

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Culture API HTTP Error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const data = xmlParser.parse(text);

  const resultCode = data.response?.header?.resultCode;
  if (resultCode !== '00' && resultCode !== '0000' && resultCode !== '000') {
    throw new Error(data.response?.header?.resultMsg || `API Error: resultCode=${resultCode}`);
  }

  return data;
}

export function normalizeEvent(item: any): Event {
  let rCode: RealmCode = 'L000';
  if (item.realmName) {
    rCode = mapRealmNameToCode(item.realmName);
  }
  
  return {
    id: String(item.seq),
    title: item.title || '',
    realmCode: rCode,
    genre: REALM_MAP[rCode].genre,
    realmName: item.realmName || '기타',
    serviceName: item.serviceName,
    posterUrl: item.imgUrl || item.thumbnail || null,
    startDate: item.startDate ? yyyymmddToIso(item.startDate) : '',
    endDate: item.endDate ? yyyymmddToIso(item.endDate) : '',
    venue: {
      name: item.place || '',
      lat: item.gpsY ? parseFloat(item.gpsY) : null,
      lng: item.gpsX ? parseFloat(item.gpsX) : null,
      phone: item.phone,
    },
    region: {
      sido: item.area || '',
      sigungu: item.sigungu || '',
    },
    price: item.price,
    description: item.contents1,
    externalUrl: item.url
  };
}

export function extractEvents(data: any): Event[] {
  if (!data?.response?.body?.items?.item) {
    return [];
  }
  const items = data.response.body.items.item;
  const itemArray = Array.isArray(items) ? items : [items];
  return itemArray.map(normalizeEvent);
}

export function extractDetail(data: any): Event | null {
  if (!data?.response?.body?.items?.item) {
    return null;
  }
  const item = data.response.body.items.item;
  const target = Array.isArray(item) ? item[0] : item;
  return normalizeEvent(target);
}
