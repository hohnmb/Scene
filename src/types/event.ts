// 분야 코드 (PDF 명세 12개 중 마니아 타겟 6개 + 기타 폴백)
export type RealmCode =
  | 'A000'   // 연극
  | 'B000'   // 음악/콘서트
  | 'B002'   // 국악
  | 'B003'   // 뮤지컬/오페라
  | 'C000'   // 무용/발레
  | 'D000'   // 전시
  | 'L000';  // 기타 (필터 노출 X, 폴백 전용)

// 사용자 표시용 분야 코드명 (Tailwind 클래스 친화적)
export type Genre =
  | 'theater'      // A000
  | 'concert'      // B000
  | 'gugak'        // B002
  | 'musical'      // B003
  | 'dance'        // C000
  | 'exhibition'   // D000
  | 'etc';         // L000

// 마니아용 세부 장르 프리셋 (realmCode + 키워드 결합으로 검색)
export type SubGenre = {
  label: string;
  realmCode: RealmCode;
  keyword?: string;
};

export interface Event {
  id: string;                    // seq
  title: string;
  realmCode: RealmCode;          // 매핑된 분류 코드
  genre: Genre;                  // 사용자 표시용 코드명
  realmName: string;             // 원본 한글 분야명 (디버그·폴백 표시)
  serviceName?: string;          // API 공식 서비스명
  posterUrl: string | null;      // thumbnail
  startDate: string;             // ISO "2026-05-15"
  endDate: string;
  venue: {
    name: string;                // place
    lat: number | null;          // gpsY (문자열→숫자, null 가능)
    lng: number | null;          // gpsX (문자열→숫자, null 가능)
    phone?: string;              // detail2에서만
  };
  region: {
    sido: string;                // area
    sigungu?: string;            // sigungu (신규)
  };
  price?: string;                // 자유 텍스트
  description?: string;          // contents1
  externalUrl?: string;          // url
}
