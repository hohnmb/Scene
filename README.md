# SCENE — 한국 문화공연 큐레이션 플랫폼

국내 공연·전시 정보를 한 곳에서 탐색하고, 캘린더·지도·카드 뷰로 쉽게 찾아보는 Next.js 웹 애플리케이션입니다.

**배포 주소:** [https://scene-three-delta.vercel.app](https://scene-three-delta.vercel.app)

---

## 문서

| 문서 | 설명 |
|------|------|
| [PRD.md](PRD.md) | 제품 요구사항 — 기능 명세, API 스펙, 데이터 모델, 개발 일정 |
| [DESIGN.md](DESIGN.md) | 디자인 시스템 — 컬러 토큰, 타이포그래피, 컴포넌트 가이드 |

---

## 주요 기능

- **멀티 뷰** — 카드 그리드 / 캘린더 / 지도(카카오맵 클러스터링) 자유 전환
- **통합 필터** — 장르·지역·날짜·키워드·무료공연 필터 + 무한 스크롤
- **홈 큐레이션** — 추천 공연, 마감 임박 공연 자동 선별
- **공연 상세** — 포스터·위치·예매 링크·미니맵 한 화면에 표시
- **저장 기능** — 북마크한 공연 로컬스토리지에 영구 저장
- **공유** — URL 클립보드 복사

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19 |
| 언어 | TypeScript 5 (strict) |
| 데이터 패칭 | TanStack Query v5 (무한 스크롤) |
| 상태 관리 | Zustand v5 |
| 스타일링 | Tailwind CSS v4 |
| 지도 | Kakao Maps JS SDK |
| 캘린더 | react-big-calendar |
| 외부 API | 한국문화정보원 공공 API, Kakao Local API |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 홈 (큐레이션)
│   ├── explore/page.tsx          # 탐색 (필터 + 멀티뷰)
│   ├── event/[id]/page.tsx       # 공연 상세
│   ├── saved/page.tsx            # 저장된 공연
│   └── api/
│       ├── events/period/        # 기간별 목록
│       ├── events/area/          # 지역별 목록
│       ├── events/realm/         # 장르별 목록
│       ├── events/bounds/        # 지도 뷰포트 내 목록
│       ├── events/[id]/          # 공연 상세
│       └── geocode/              # 주소 → 좌표 변환
├── components/
│   ├── layout/                   # Header 등 공통 레이아웃
│   ├── home/                     # 홈 전용 컴포넌트
│   ├── event/                    # 공연 카드·배지·미니맵 등
│   ├── filter/                   # 필터 사이드바·칩
│   └── view/                     # ViewToggle·CalendarView·MapView
├── hooks/                        # TanStack Query 훅
├── stores/                       # Zustand 스토어 (필터, 저장)
├── lib/
│   ├── api/culture-server.ts     # 공공 API 클라이언트 + 정규화
│   ├── mappers/realm.ts          # 장르 코드 ↔ 한국어 매핑
│   └── utils/                    # 날짜 포맷, clsx 유틸
└── types/event.ts                # Event 인터페이스 + 열거형
```

---

## 시작하기

### 사전 준비

- Node.js 18 이상
- [한국문화정보원 공공데이터 API 키](https://www.culture.go.kr/data/openapi/openapiView.do)
- [Kakao Developers 앱 키](https://developers.kakao.com) (JavaScript 키 + REST API 키)

### 설치

```bash
git clone <repository-url>
cd Scene_pjt
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
# 한국문화정보원 API 키 (디코딩된 형식)
CULTURE_API_KEY_DECODED=your_api_key_here

# Kakao 지도 JS SDK 키 (클라이언트 노출)
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_js_key

# Kakao Local API 키 (서버 전용, 주소 → 좌표 변환)
KAKAO_REST_API_KEY=your_kakao_rest_key

# 실제 API 대신 목 데이터 사용 여부 (개발용)
USE_FIXTURE=false
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 (hot-reload)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 장르 코드 매핑

| 코드 | 장르 |
|------|------|
| A000 | 연극 |
| B000 | 음악·콘서트 |
| B002 | 국악 |
| B003 | 뮤지컬·오페라 |
| C000 | 무용·발레 |
| D000 | 전시 |
| L000 | 기타 |

---

## 데이터 흐름

```
브라우저
  └─ TanStack Query 훅
       └─ Next.js API Route (/api/events/*)
            └─ culture-server.ts
                 └─ 한국문화정보원 공공 API (XML)
                      → fast-xml-parser → Event[] JSON 반환
```

주소 → 좌표 변환은 `/api/geocode` 라우트를 통해 Kakao Local API로 처리됩니다.  
지도 렌더링은 Kakao Maps JS SDK를 클라이언트에서 직접 사용합니다.

---

## 개발 팁

- `USE_FIXTURE=true` 설정 시 실제 API 없이 목 데이터로 개발할 수 있습니다.
- 컴포넌트 경로 단축: `@/*` → `src/*` (tsconfig paths 설정)
- 외부 이미지 도메인 제한 없음 (공공 API 포스터 URL 대응을 위해 `next.config.ts`에서 허용)
