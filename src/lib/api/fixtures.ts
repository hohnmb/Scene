import { Event } from '@/types/event';

export function getFixtures(): Event[] {
  return [
    {
      id: "fixture-1",
      title: "[더미] 제 1회 서울 재즈 페스티벌 가상 데이터",
      realmCode: "B000",
      genre: "concert",
      realmName: "대중음악",
      posterUrl: null,
      startDate: "2026-05-15",
      endDate: "2026-05-16",
      venue: {
        name: "올림픽공원",
        lat: 37.5204,
        lng: 127.1265
      },
      region: {
        sido: "서울"
      },
      price: "150,000원",
      description: "가상의 재즈 페스티벌 데이터입니다."
    },
    {
      id: "fixture-2",
      title: "[더미] 무료 현대미술 전시회",
      realmCode: "D000",
      genre: "exhibition",
      realmName: "미술",
      posterUrl: null,
      startDate: "2026-05-01",
      endDate: "2026-06-30",
      venue: {
        name: "서울시립미술관",
        lat: 37.5641,
        lng: 126.9738
      },
      region: {
        sido: "서울"
      },
      price: "무료",
      description: "무료로 즐기는 미술 전시회."
    }
  ];
}

export function getFixtureDetail(id: string): Event | null {
  const items = getFixtures();
  return items.find(e => e.id === id) || items[0];
}
