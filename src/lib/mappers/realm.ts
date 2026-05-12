import { RealmCode, Genre } from '@/types/event';

export const REALM_MAP: Record<RealmCode, { genre: Genre; korean: string }> = {
  'A000': { genre: 'theater',    korean: '연극' },
  'B000': { genre: 'concert',    korean: '음악/콘서트' },
  'B002': { genre: 'gugak',      korean: '국악' },
  'B003': { genre: 'musical',    korean: '뮤지컬/오페라' },
  'C000': { genre: 'dance',      korean: '무용/발레' },
  'D000': { genre: 'exhibition', korean: '전시' },
  'L000': { genre: 'etc',        korean: '기타' },
};

export function mapRealmNameToCode(realmName: string): RealmCode {
  if (realmName.includes('연극')) return 'A000';
  if (realmName.includes('음악') || realmName.includes('콘서트') || realmName.includes('대중')) return 'B000';
  if (realmName.includes('국악')) return 'B002';
  if (realmName.includes('뮤지컬') || realmName.includes('오페라')) return 'B003';
  if (realmName.includes('무용') || realmName.includes('발레')) return 'C000';
  if (realmName.includes('전시') || realmName.includes('미술')) return 'D000';
  
  return 'L000'; // fallback
}
