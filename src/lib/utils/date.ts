import { parse, format, isValid } from 'date-fns';

/**
 * YYYYMMDD 형식을 ISO 문자열 (YYYY-MM-DD)로 변환
 */
export function yyyymmddToIso(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const parsed = parse(dateStr, 'yyyyMMdd', new Date());
  if (!isValid(parsed)) return dateStr;
  return format(parsed, 'yyyy-MM-dd');
}

/**
 * ISO 형식의 날짜 문자열(혹은 Date 객체)을 YYYYMMDD로 변환 (API 요청용)
 */
export function isoToYyyymmdd(isoStr: string | Date): string {
  try {
    const date = typeof isoStr === 'string' ? new Date(isoStr) : isoStr;
    if (!isValid(date)) return '';
    return format(date, 'yyyyMMdd');
  } catch (e) {
    return '';
  }
}
