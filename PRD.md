# PRD: SCENE — 문화 마니아를 위한 공연·전시 큐레이션 캘린더

> Claude Code 바이브코딩용 제품 요구사항 문서 (Product Requirements Document)
> 작성일: 2026-05-12
> 버전: **v1.2 (공식 명세서 PDF 검증 반영)**
> 개발 기간: 2주 (10 작업일)

### 📌 v1.2 변경사항 (2026-05-12)
- **API 교체**: 폐기된 "공연전시정보조회서비스" → **"한눈에보는문화정보조회서비스"**로 전환
- **Base URL 확정**: `https://apis.data.go.kr/B553457/cultureinfo` (HTTPS 지원)
- **응답 포맷**: JSON 직접 응답 가능 (`returnType=JSON`) → XML 파싱 불필요, `fast-xml-parser` 의존성 제거
- **일 호출 한도**: 1,000회 → **10,000회** (TanStack Query staleTime 완화 가능)
- **엔드포인트명 정확화**: `/period2`, `/area2`, `/realm2`, `/detail2`, `/livelihood2` (숫자 2 접미사)
- **파라미터명 변경**: `cPage`/`rows` → `PageNo`/`numOfrows`, `seq`는 query 파라미터
- **분야 코드 체계 교체**: 가상 10개 → **realmCode 12개 공식 체계** 기반으로 재정의
- **마니아 타겟 분야 6개로 좁힘**: 연극·음악/콘서트·국악·뮤지컬/오페라·무용/발레·전시 (아동/가족·도서·체육·기타 등은 필터 노출 제외)
- **serviceTp 파라미터 추가**: `A`(공연/전시) 기본 고정, B(행사/축제)/C(교육/체험) 제외
- **livelihood2 엔드포인트 신규 발견**: 문화캘린더 전용 데이터, F-04 캘린더 뷰에 활용
- **응답 필드 보강**: `sigungu`, `serviceName`, `contents1`, `phone`, `url` 추가
- **변경사항 v1.1 (이전)**: 한국문화정보원 공연전시정보조회서비스 검증 → 본 v1.2에서 사실상 폐기됨

### 📌 v1.1 변경사항 (참고용 - 이전)
- 한국문화정보원 공연전시정보조회서비스 API 검증 시도 (해당 API는 폐기 확인됨, v1.2에서 교체)

---

## 1. 프로젝트 개요

### 1.1 제품명
**SCENE** — "이번 달, 놓치지 말아야 할 공연과 전시"

### 1.2 한 줄 요약
**한국문화정보원 "한눈에보는문화정보조회서비스"** 공공데이터 API를 활용하여, 문화 마니아가 관심 장르의 공연·전시를 **필터·캘린더·지도** 세 가지 뷰로 탐색하고 놓치지 않게 해주는 큐레이션 웹 앱.

### 1.3 배경 및 문제 정의
- 마니아층 사용자는 네이버·인터파크·국립극장·예술의전당·각 미술관 사이트를 **개별로 들락거리며** 정보를 수집해야 함
- 기존 예매 사이트는 "예매" 중심이라 **장르 큐레이션·일정 한눈에 보기**에 약함
- 한 달치 라인업을 빠르게 훑고, 동선을 짜고, 관심 행사를 모아두는 도구가 부족함

### 1.4 솔루션
공공데이터 API에서 공연·전시 정보를 가져와, **마니아 친화적 필터링 + 캘린더 뷰 + 지도 뷰 + 찜 기능**을 제공하는 단일 웹 앱.

---

## 2. 사용자 정의

### 2.1 타겟 페르소나

**김재즈 (29세, 회사원)**
- 재즈·현대미술 애호가
- 월 2~3회 공연·전시 관람
- 통근길·점심시간에 핸드폰으로 정보 탐색
- "내가 좋아하는 장르만 모아서 한 달 단위로 보고 싶다"
- 마음에 든 공연은 일단 찜해두고 나중에 예매 결정

### 2.2 사용 시나리오

**시나리오 A — 이번 달 탐색**
> 김재즈는 통근길에 SCENE을 열어 "재즈"·"서울" 필터를 적용한다. 캘린더 뷰로 전환해 한 달치 재즈 공연을 훑는다. 토요일에 흥미로운 공연 2개를 발견해 찜한다.

**시나리오 B — 동선 기반 탐색**
> 주말 약속 장소가 종로다. 김재즈는 지도 뷰를 열어 종로 근처 미술관·갤러리를 살핀다. 마커를 눌러 현재 진행 중인 전시를 확인하고 약속 전에 들를 곳을 정한다.

**시나리오 C — 빠른 의사결정**
> 점심시간, 친구가 "오늘 저녁에 공연 뭐 있어?"라고 묻는다. 김재즈는 홈 화면의 "오늘의 추천"에서 두 개를 골라 공유한다.

---

## 3. 기능 명세

### 3.1 우선순위 정의
- **P0**: MVP 필수. 없으면 제품 성립 불가
- **P1**: 핵심 차별점. Week 2에 반드시 구현
- **P2**: 시간 여유 시 구현. 포기 가능
- **P3**: 향후 버전. 이번 스코프에서 제외

### 3.2 기능 목록

#### [P0] F-01 행사 리스트 + 무한스크롤
- **설명**: 공연·전시 카드를 그리드로 표시. 스크롤 시 추가 로드.
- **요구사항**:
  - 카드: 포스터 이미지, 제목, 장르 배지, 기간, 장소, 가격
  - 페이지당 20개 로드, 스크롤 끝에서 다음 페이지 자동 호출
  - 로딩 스켈레톤 UI
  - 빈 결과 처리 (필터 결과 0건 시)
- **데이터 소스**: 한국문화정보원 공연전시정보조회 API

#### [P0] F-02 다중 필터 + 검색
- **설명**: 분야·지역·기간·키워드로 행사 필터링.
- **요구사항**:
  - **serviceTp 고정**: 모든 API 호출에 `serviceTp=A`(공연/전시) 기본 적용. 행사/축제·교육/체험은 마니아 타겟 외이므로 노출 제외
  - **분야 (realmCode 기준, 마니아 타겟 6개)**:
    | realmCode | 한글명 |
    |---|---|
    | `A000` | 연극 |
    | `B000` | 음악/콘서트 |
    | `B002` | 국악 |
    | `B003` | 뮤지컬/오페라 |
    | `C000` | 무용/발레 |
    | `D000` | 전시 |
  - **세부 장르 (재즈, 모던 클래식 등)**: realmCode + 키워드 결합 (예: `realmCode=B000` + `keyword=재즈`). 마니아용 프리셋 칩 8개로 노출 (재즈/락/일렉트로닉/현대미술/사진전/모던 클래식/실험극/컨템퍼러리 댄스)
  - **지역**: 시·도 17개(`sido` 파라미터) + 시·군·구(`sigungu` 파라미터, 시·도 선택 후 활성화). 응답의 `area`·`sigungu` 필드와 매핑
  - **기간**: 오늘/이번 주/이번 달/사용자 지정 범위 — `from`/`to` 파라미터에 YYYYMMDD 포맷으로 전달
  - **키워드**: 제목·장소 검색 (API `keyword` 파라미터 활용)
  - **정렬**: `sortStdr` 파라미터 (1=등록일, 2=공연명, 3=지역)
  - URL 쿼리스트링 동기화 (공유·새로고침 시 필터 유지)
  - Zustand 전역 상태로 관리

#### [P0] F-03 행사 상세 페이지
- **설명**: 행사 단건의 모든 정보 표시.
- **요구사항**:
  - 포스터(확대 가능), 제목, 부제, 장르
  - 기간, 시간, 장소(지도 미니뷰), 가격, 출연진
  - 소개 본문
  - 외부 예매 링크(있는 경우)
  - 찜 버튼 (F-06과 연동)
  - 공유 버튼 (URL 복사)
  - 라우팅: `/event/[id]`

#### [P1] F-04 캘린더 뷰
- **설명**: 월·주 단위로 행사를 캘린더에 표시.
- **요구사항**:
  - 월 뷰 / 주 뷰 토글
  - 날짜 셀에 해당일 진행 행사 (최대 3개 + "더보기")
  - 셀 클릭 시 해당일 행사 리스트 모달
  - 이벤트 클릭 시 상세 페이지로 이동
  - 색상: 분야별 컬러 코딩 (6개 + 기타)
  - 라이브러리: `react-big-calendar` 또는 `FullCalendar`
  - **데이터 소스**: 기본은 `/period2` 결과 가공. 단, livelihood2(문화캘린더정보 목록조회)도 활용 검토 — 응답 필드가 다르므로(orgName, regDate 등) Day 8 첫 시도에서 더 적합하면 전환

#### [P1] F-05 지도 뷰
- **설명**: 행사장 위치를 지도에 마커로 표시.
- **요구사항**:
  - 카카오맵 JS SDK 사용
  - 마커 클러스터링 (밀집 지역 묶음)
  - 마커 클릭 시 인포윈도우 (제목·기간·간단 정보 + "자세히")
  - 현재 위치 기반 "주변 행사" 버튼
  - **지도 영역 이동 시 API의 `gpsxfrom`/`gpsxto`/`gpsyfrom`/`gpsyto` 파라미터로 영역 내 행사만 재조회** (서버 사이드 필터링)
  - 좌표 누락 행사 처리: 카카오 로컬 API로 `place` 필드(주소)를 좌표로 변환하여 폴백
  - 사이드 리스트는 지도 영역과 동기화

#### [P2] F-06 관심 행사 찜·저장
- **설명**: 사용자가 관심 행사를 저장하고 모아볼 수 있다.
- **요구사항**:
  - 카드·상세 페이지에 찜 버튼(하트)
  - localStorage 기반 (DB 없이 빠르게 구현)
  - Zustand `persist` 미들웨어 사용
  - 찜 목록 페이지 `/saved` — 카드 리스트 + 정렬(찜한 순/시작일순)
  - 찜 개수 헤더에 표시

#### [P3] F-07 오늘의 추천 (홈 큐레이션)
- **설명**: 홈 화면에서 "오늘의 추천", "이번 주 하이라이트" 큐레이션 섹션 제공.
- **요구사항**:
  - 오늘의 추천: 오늘 진행 중인 행사 중 무작위 3개 (또는 인기도 기준)
  - 이번 주 하이라이트: 이번 주 시작 행사 중 5개
  - 가로 스크롤 캐러셀
- **참고**: 시간 여유 시에만 구현

---

## 4. 페이지 구조

### 4.1 라우트 맵

```
/                  → 홈 (큐레이션 + 빠른 진입)
/explore           → 탐색 (필터 + 리스트 / 캘린더 / 지도 뷰 토글)
/event/[id]        → 행사 상세
/saved             → 찜 목록 (P2)
```

### 4.2 화면 구성 요약

| 페이지 | 주요 컴포넌트 | 우선순위 |
|---|---|---|
| 홈 | 헤더, 검색바, 오늘의 추천 캐러셀, 이번 주 하이라이트 | P0 (오늘의 추천은 P3) |
| 탐색 | 필터 사이드바, 뷰 토글(카드·캘린더·지도), 결과 영역 | P0 |
| 상세 | 포스터, 정보 박스, 지도 미니뷰, 찜·공유 | P0 |
| 찜 목록 | 카드 리스트, 정렬, 빈 상태 | P2 |

---

## 5. 기술 스택

### 5.1 프론트엔드
| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 15 (App Router) | 커리큘럼 메인. **API Route 프록시 권장** (키 보호 목적) |
| 언어 | TypeScript | strict 모드 |
| 스타일 | Tailwind CSS | utility-first |
| UI 컴포넌트 | shadcn/ui | 디자인 시스템 |
| 클라이언트 상태 | Zustand (+ persist) | 필터·찜·지도 영역 |
| 서버 상태 | TanStack Query | API 캐싱·무한스크롤 (`staleTime: 2분`, 일 한도 10,000회 여유 활용) |
| 캘린더 | react-big-calendar | 가볍고 커스텀 쉬움 |
| 지도 | 카카오맵 JS SDK | 한국 데이터 최적 |
| 폼 | React Hook Form (필요 시) | - |
| 아이콘 | lucide-react | - |
| 날짜 처리 | date-fns | YYYYMMDD ↔ ISO 변환 |

> ❌ ~~fast-xml-parser~~ — API가 `returnType=JSON` 옵션 지원하므로 XML 파서 불필요. JSON 직접 받음.

### 5.2 데이터·API

#### 5.2.1 메인 API: 한국문화정보원 한눈에보는문화정보조회서비스

- **공식 명칭**: 한국문화정보원_한눈에보는문화정보조회서비스
- **데이터셋 ID**: 15138937 (공공데이터포털)
- **Base URL**: `https://apis.data.go.kr/B553457/cultureinfo` ✅ **HTTPS 지원**
- **응답 포맷**: XML (기본) 또는 **JSON** (`returnType=JSON` 파라미터로 선택 가능)
- **인증**: `serviceKey` 파라미터 — **Decoding 키** 사용 (URL 인코딩은 클라이언트에서 자동 처리)
- **인증키 발급**: 공공데이터포털 활용신청 → **자동 승인 (즉시)**
- **개발계정 일 호출 한도**: **10,000회** (운영계정은 활용사례 등록 시 증가 가능)
- **TanStack Query 정책**: `staleTime: 2분`, `gcTime: 10분` (한도 여유로 실시간성 우선)
- **현재 활용신청 수**: 534건 (안정 운영, 마지막 수정 2025-08-21)
- **이용허락범위**: 제한 없음

#### 5.2.2 엔드포인트 5종 (PDF 명세 기준)

| 엔드포인트 | 용도 | 필수 파라미터 | 핵심 선택 파라미터 |
|---|---|---|---|
| `/period2` | 기간별 문화정보목록조회 | `serviceKey`, `PageNo`, `numOfrows` | `from`, `to`, `keyword`, `serviceTp`, gps좌표 영역 4종 |
| `/area2` | 지역별 문화정보목록조회 | `serviceKey`, `PageNo`, `numOfrows` | `sido`, `sigungu`, `from`, `to`, `keyword`, `place`, `sortStdr` |
| `/realm2` | 분야별 문화정보목록조회 | `serviceKey`, `PageNo`, `numOfrows` | `realmCode`, `from`, `to`, `sido`, `keyword`, `sortStdr` |
| `/detail2` | 문화정보 상세정보조회 | `serviceKey`, `seq` | (없음) |
| `/livelihood2` | 문화캘린더정보 목록조회 | `serviceKey`, `PageNo`, `numOfrows` | `keyword` |

**공통 파라미터 명세 (PDF 기준)**:
- `serviceKey` (필수, string): Decoding 인증키
- `PageNo` (필수, string): 페이지 번호 (1부터)
- `numOfrows` (필수, string): 페이지당 결과 수 (대문자 N·소문자 rows 주의)
- `from`, `to` (string): YYYYMMDD 포맷
- `keyword` (string): 검색 키워드
- `gpsxfrom`, `gpsxto` (string): 경도 하한·상한
- `gpsyfrom`, `gpsyto` (string): 위도 하한·상한
- `serviceTp` (string): 서비스 구분 — `A`(공연/전시) / `B`(행사/축제) / `C`(교육/체험) → **본 프로젝트는 `A` 고정**
- `sido` (string): 시·도
- `sigungu` (string): 시·군·구
- `place` (string): 장소 키워드
- `sortStdr` (string): 정렬 — `1`(등록일) / `2`(공연명) / `3`(지역)
- `realmCode` (string): 분류 코드 — A000(연극)/B000(음악/콘서트)/B002(국악)/B003(뮤지컬/오페라)/C000(무용/발레)/D000(전시)/E000(아동/가족)/F000(행사/축제)/G000(교육/체험)/H000(도서)/I000(체육)/L000(기타)
- `returnType` (string): 응답 포맷 — 기본 XML, `JSON`으로 설정 시 JSON 응답

#### 5.2.3 보조 API: 카카오맵 + 카카오 로컬

- **카카오맵 JS SDK**: 지도 렌더링·마커·클러스터링
- **카카오 로컬 API**: 주소 → 좌표 변환 (gpsX/Y 누락 행사 폴백용)
- **인증**: JavaScript 키 + REST API 키 (카카오 개발자 콘솔)

#### 5.2.4 통신 아키텍처 (프록시는 권장)

```
[Browser]
   ↓ HTTPS
[Next.js API Route] (서버 사이드, 권장)
   ↓ HTTPS
[apis.data.go.kr API] (JSON or XML)
   ↑ JSON 응답
[Browser ← TanStack Query 캐싱]
```

**프록시 권장 이유 (강제는 아님)**:
1. ~~mixed content~~ → HTTPS 지원으로 해소됨
2. **serviceKey 보호** — 클라이언트에 노출되면 안 됨 (서버 환경변수로 관리). 이게 프록시의 주된 이유로 격상
3. 응답 정규화·에러 핸들링 일원화

**환경변수 (`.env.local`)**:
```
CULTURE_API_KEY_DECODED=...        # 한국문화정보원 (서버 전용, NEXT_PUBLIC_ 안 붙임!)
NEXT_PUBLIC_KAKAO_MAP_KEY=...      # 카카오맵 JS 키 (클라이언트 노출 OK)
KAKAO_REST_API_KEY=...             # 카카오 로컬 (서버 전용)
```

#### 5.2.5 API Route 구조

```
app/api/events/
  period/route.ts      → /period2 프록시
  area/route.ts        → /area2 프록시
  realm/route.ts       → /realm2 프록시
  bounds/route.ts      → /period2 + gps 영역 파라미터 조합 프록시
  [id]/route.ts        → /detail2 프록시
  calendar/route.ts    → /livelihood2 프록시 (F-04 활용 검토용)
app/api/geocode/
  route.ts             → 카카오 주소→좌표 변환 프록시
```

### 5.3 배포·인프라
- **배포**: Vercel
- **저장소**: GitHub (브랜치 전략: `main` + feature 브랜치)
- **DB**: 없음 (찜은 localStorage)
- **환경변수**: Vercel 프로젝트 설정에 등록

---

## 6. 데이터 모델

### 6.1 API 응답 → 앱 내부 타입 매핑

**원본: 한눈에보는문화정보조회서비스 (JSON 응답, `returnType=JSON`)**

**목록 응답 (period2 / area2 / realm2)**:

| API 필드 (원본) | 앱 내부 필드 | 타입 | 비고 |
|---|---|---|---|
| `body.items.item.seq` | `id` | string | 고유 ID |
| `body.items.item.title` | `title` | string | 행사명 |
| `body.items.item.startDate` (YYYYMMDD) | `startDate` | string (ISO) | date-fns로 변환 |
| `body.items.item.endDate` (YYYYMMDD) | `endDate` | string (ISO) | date-fns로 변환 |
| `body.items.item.place` | `venue.name` | string | 장소명 또는 주소 |
| `body.items.item.realmName` | `realmName` | string | 한글 분야명 (디버그·표시용) |
| `body.items.item.area` | `region.sido` | string | 시·도 |
| `body.items.item.sigungu` | `region.sigungu` | string | 시·군·구 (신규) |
| `body.items.item.thumbnail` | `posterUrl` | string \| null | 누락 가능 → 폴백 처리 |
| `body.items.item.gpsX` | `venue.lng` | number \| null | 경도 (누락 가능, 문자열→숫자 변환) |
| `body.items.item.gpsY` | `venue.lat` | number \| null | 위도 (누락 가능, 문자열→숫자 변환) |
| `body.items.item.serviceName` | `serviceName` | string | 공식 서비스명 (디버그용) |

**상세 응답 추가 필드 (detail2)**:

| API 필드 | 앱 내부 필드 | 타입 | 비고 |
|---|---|---|---|
| `body.items.item.price` | `price` | string | 자유 텍스트 ("30,000원"/"무료" 등) |
| `body.items.item.contents1` | `description` | string \| null | 상세 설명 |
| `body.items.item.url` | `externalUrl` | string \| null | 외부 상세 링크 |
| `body.items.item.phone` | `venue.phone` | string \| null | 장소 전화번호 |

> ⚠️ realmCode는 응답에 직접 포함되지 않을 수 있음. realmName을 realmCode로 역매핑하는 함수 필요 (`lib/mappers/realm.ts`).

### 6.2 Event 타입 정의

```typescript
// 분야 코드 (PDF 명세 12개 중 마니아 타겟 6개 + 기타 폴백)
type RealmCode =
  | 'A000'   // 연극
  | 'B000'   // 음악/콘서트
  | 'B002'   // 국악
  | 'B003'   // 뮤지컬/오페라
  | 'C000'   // 무용/발레
  | 'D000'   // 전시
  | 'L000';  // 기타 (필터 노출 X, 폴백 전용)

// 사용자 표시용 분야 코드명 (Tailwind 클래스 친화적)
type Genre =
  | 'theater'      // A000
  | 'concert'      // B000
  | 'gugak'        // B002
  | 'musical'      // B003
  | 'dance'        // C000
  | 'exhibition'   // D000
  | 'etc';         // L000

// 한글명 ↔ realmCode ↔ Genre 매핑 (lib/mappers/realm.ts에 구현)
const REALM_MAP: Record<RealmCode, { genre: Genre; korean: string }> = {
  'A000': { genre: 'theater',    korean: '연극' },
  'B000': { genre: 'concert',    korean: '음악/콘서트' },
  'B002': { genre: 'gugak',      korean: '국악' },
  'B003': { genre: 'musical',    korean: '뮤지컬/오페라' },
  'C000': { genre: 'dance',      korean: '무용/발레' },
  'D000': { genre: 'exhibition', korean: '전시' },
  'L000': { genre: 'etc',        korean: '기타' },
};

// 마니아용 세부 장르 프리셋 (realmCode + 키워드 결합으로 검색)
type SubGenre = {
  label: string;       // 사용자 표시명
  realmCode: RealmCode;
  keyword?: string;
};
// 예시 (8개 프리셋):
// { label: '재즈', realmCode: 'B000', keyword: '재즈' }
// { label: '락', realmCode: 'B000', keyword: '락' }
// { label: '일렉트로닉', realmCode: 'B000', keyword: '일렉트로닉' }
// { label: '모던 클래식', realmCode: 'B000', keyword: '모던' }
// { label: '현대미술', realmCode: 'D000', keyword: '현대' }
// { label: '사진전', realmCode: 'D000', keyword: '사진' }
// { label: '실험극', realmCode: 'A000', keyword: '실험' }
// { label: '컨템퍼러리 댄스', realmCode: 'C000', keyword: '컨템퍼러리' }

interface Event {
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
  // 상세 페이지에서만 채워지는 필드
  price?: string;                // 자유 텍스트
  description?: string;          // contents1
  externalUrl?: string;          // url
}
```

### 6.3 클라이언트 상태 (Zustand)

```typescript
// 필터 스토어
interface FilterStore {
  realmCodes: RealmCode[];          // 분야 다중 선택 (6개 중)
  subGenres: SubGenre[];            // 세부 장르 프리셋
  sido?: string;                    // 시·도 단일 선택
  sigungu?: string;                 // 시·군·구 단일 선택
  dateRange: { from: Date; to: Date } | null;
  keyword: string;
  mapBounds: MapBounds | null;      // 지도 영역 검색용
  sortStdr: '1' | '2' | '3';        // 1=등록일, 2=공연명, 3=지역
  // setters...
  reset: () => void;
}

interface MapBounds {
  swLat: number;  // 남서 위도 (gpsyfrom)
  swLng: number;  // 남서 경도 (gpsxfrom)
  neLat: number;  // 북동 위도 (gpsyto)
  neLng: number;  // 북동 경도 (gpsxto)
}

// 찜 스토어 (persist)
interface SavedStore {
  saved: Event[];
  toggle: (event: Event) => void;
  isSaved: (id: string) => boolean;
  clear: () => void;
}
```

### 6.4 데이터 소스 추상화 (백업 전환 대비)

```typescript
interface EventDataSource {
  searchByPeriod(params: PeriodParams): Promise<Event[]>;
  searchByArea(params: AreaParams): Promise<Event[]>;
  searchByRealm(params: RealmParams): Promise<Event[]>;
  searchByBounds(params: BoundsParams): Promise<Event[]>;
  getDetail(id: string): Promise<Event>;
}

// 기본 구현체
class CultureInfoDataSource implements EventDataSource {
  // 한눈에보는문화정보조회서비스 (B553457/cultureinfo)
}
```

---

## 7. 비기능 요구사항

### 7.1 성능
- 초기 로드 LCP < 2.5초
- 필터 변경 응답 < 1초
- 무한스크롤 추가 로드 < 1초
- Lighthouse 성능 점수 85점 이상
- 이미지: Next.js Image 컴포넌트 + lazy loading

### 7.2 반응형
- 데스크톱: 1280px 이상 (3~4열 그리드)
- 태블릿: 768~1279px (2열 그리드)
- 모바일: ~767px (1열 그리드, 필터는 바텀시트)

### 7.3 접근성
- 시맨틱 HTML
- 키보드 네비게이션
- 이미지 alt 텍스트
- 색상 대비 WCAG AA 충족

### 7.4 SEO
- Next.js Metadata API로 페이지별 메타태그
- 상세 페이지 OG 이미지 (포스터)
- 사이트맵 자동 생성

---

## 8. 디자인 방향

### 8.1 톤·무드
- 마니아 친화적 — 차분하고 깊이 있는 톤
- 다크 모드 우선 (선택), 라이트 모드 지원
- 포스터 이미지가 주인공 → 배경·UI는 절제

### 8.2 컬러 (제안)
- Primary: 짙은 인디고 또는 와인 (#1E1B4B 등)
- Accent: 장르별 컬러 코딩 (재즈=골드, 클래식=네이비, 전시=오프화이트)
- Background: 거의 검정에 가까운 다크 (#0A0A0F)
- Text: 흰색 + 회색 톤

### 8.3 타이포
- 국문: Pretendard
- 영문: Inter
- 제목은 크고 굵게, 본문은 읽기 편하게

> Figma·Google Stitch에서 디자인 시안 제작 시 위 톤을 가이드로 사용. 상세 디자인 시스템은 `DESIGN.md`에서 별도 정의.

---

## 9. 개발 일정 (2주 / 10 작업일)

### Week 1 — 기반 + 핵심
| Day | 작업 | 산출물 |
|---|---|---|
| 1 | PRD·DESIGN.md 확정, Figma 시안 (홈/탐색/상세), 공공데이터포털 인증키 신청 | 설계 문서 + 시안 + 키 신청 완료 |
| 2 | Next.js 셋업, Tailwind·shadcn·Zustand·TanStack Query·fast-xml-parser 설치, 디자인 토큰 | 빈 프로젝트 |
| 3 | **API Route 프록시 5종 구현** (`/api/events/*`), XML→JSON 파서, `EventDataSource` 인터페이스, 타입 정의 | `lib/api/culture.ts` + API 라우트 + 더미 fixture |
| 4 | 행사 리스트 + 무한스크롤 (F-01), 폴백 이미지·"위치정보 없음" 처리 | `/explore` 카드 뷰 |
| 5 | 필터·검색 (F-02), 분야 + 세부 장르 프리셋 칩, URL 동기화 | 필터 동작 |
| 6 | 행사 상세 페이지 (F-03), 카카오 로컬 API 폴백 좌표 변환 | `/event/[id]` |
| 7 | 캐싱·로딩·에러 상태 정리, 반응형 1차 | Week 1 마감 |

### Week 2 — 확장 + 마감
| Day | 작업 | 산출물 |
|---|---|---|
| 8 | 캘린더 뷰 (F-04) | 월/주 뷰 |
| 9 | 지도 뷰 (F-05), 클러스터링 | 지도 + 마커 |
| 10 | 찜 기능 (F-06), localStorage persist | `/saved` |
| 11 | 홈 큐레이션 (P3 가능 시), 반응형 점검 | 홈 완성 |
| 12 | 성능 최적화 (이미지·코드 스플리팅), 접근성 | Lighthouse 85+ |
| 13 | 버그 수정, README, Vercel 배포 | 라이브 URL |
| 14 | 회고, 포트폴리오 정리, 시연 영상 | 발표 자료 |

---

## 10. 성공 지표 (Definition of Done)

### 10.1 기능 완성도
- [ ] P0 기능 100% 동작
- [ ] P1 기능 100% 동작
- [ ] P2 찜 기능 동작
- [ ] 모든 페이지 반응형 (모바일·태블릿·데스크톱)

### 10.2 품질
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개
- [ ] Lighthouse 성능 ≥ 85
- [ ] 키보드만으로 핵심 플로우 사용 가능

### 10.3 배포·문서
- [ ] Vercel 라이브 배포 완료
- [ ] README에 스크린샷·기술 스택·실행 방법
- [ ] 시연 영상 1~2분
- [ ] GitHub 커밋 메시지 컨벤션 준수

---

## 11. 스코프 외 (Out of Scope)

이번 MVP에서 **하지 않는** 것:
- 사용자 회원가입·로그인
- 댓글·리뷰·평점 (DB 필요)
- 예매 기능 (외부 링크로만 연결)
- 푸시 알림
- 다국어 (한국어만)
- 결제·티켓팅
- 운영자 페이지·관리자 기능

→ 향후 v2에서 고려.

---

## 12. 리스크와 대응

| 리스크 | 가능성 | 대응 |
|---|---|---|
| 좌표(gpsX/Y) 누락 행사 | **확정 (자주 발생)** | 카카오 로컬 API로 `place` 주소 → 좌표 변환 폴백. 그래도 실패하면 지도 뷰에서 제외 + "위치정보 없음" 배지로 리스트에 표시 |
| 포스터 이미지(thumbnail) 누락 | **확정 (자주 발생)** | 분야별 폴백 SVG 7종 (6개 분야 + 기타) 미리 제작 (`/public/fallback/{genre}.svg`) |
| API Rate Limit (일 10,000회) | 낮음 | TanStack Query `staleTime: 2분`, 동일 필터 조합 캐싱. 일 한도 여유로 무한스크롤 자유롭게 가능 |
| 서비스 키 발급 직후 활성화 지연 | 가능성 있음 | 더미 데이터 fixture 준비 → UI 개발은 키 없이도 진행 가능 |
| ~~API HTTP-only~~ | **해소됨** | API가 HTTPS(`apis.data.go.kr`) 지원 → 프록시는 키 보호 목적으로만 |
| 재즈 등 세부 장르가 API에 별도로 없음 | **확정** | `realmCode=B000` + `keyword=재즈` 결합. SubGenre 프리셋 칩 8개로 UX 우회 |
| realmName → realmCode 역매핑 누락값 | 중간 | `lib/mappers/realm.ts`에서 알 수 없는 한글명은 `L000`(기타)로 폴백 |
| `numOfrows` 등 파라미터 대소문자 혼동 | **확정 (실수 위험)** | `PageNo`, `numOfrows` (대소문자 정확히 일치 필요). 타입 가드 / 상수 정의 |
| 카카오맵 키 도메인 제한 | 중간 | 로컬은 `localhost`, 배포는 Vercel 도메인 등록. 키 노출되어도 도메인 제한으로 보호 |
| 캘린더 라이브러리 커스터마이징 난이도 | 중간 | Day 8 첫 4시간 안에 안 풀리면 단순 리스트 뷰로 폴백. livelihood2 엔드포인트 활용 검토 |
| 데이터 부족 시 | 낮음 | `EventDataSource` 인터페이스 추상화로 백업 API 전환 가능 |
| 2주 일정 초과 | 높음 | P2·P3는 과감히 포기, P0+P1만 완성 우선 |

---

## 13. Claude Code 작업 지시

> 이 PRD를 Claude Code에 전달할 때 다음 순서로 진행:

1. **초기 셋업**: "이 PRD v1.2를 읽고 Next.js 15 + TypeScript + Tailwind + shadcn/ui 프로젝트를 셋업해줘. `@tanstack/react-query`, `zustand`, `date-fns`, `lucide-react`도 같이 설치. (XML 파서는 불필요 — API가 JSON 직접 응답 지원) 폴더 구조는 `app/`, `app/api/`, `components/`, `lib/`, `stores/`, `types/`, `public/fallback/`로 잡고, 기본 디자인 토큰까지 설정해줘."

2. **타입·매핑 우선**: "`types/event.ts`에 Event·RealmCode·Genre·SubGenre 타입을 정의해줘. `lib/mappers/realm.ts`에 REALM_MAP 상수와 realmName(한글) → RealmCode 역매핑 함수(`mapRealmNameToCode`, 알 수 없는 값은 `L000` 폴백)를 작성. `lib/utils/date.ts`에 YYYYMMDD ↔ ISO 변환 유틸."

3. **API Route 프록시 6종**: "`app/api/events/period/route.ts`, `area/route.ts`, `realm/route.ts`, `bounds/route.ts`, `[id]/route.ts`, `calendar/route.ts`를 만들고, 공통 로직(serviceKey 주입, `returnType=JSON` 강제, `serviceTp=A` 기본 적용, 응답 정규화)은 `lib/api/culture-server.ts`에 추출. Base URL은 `https://apis.data.go.kr/B553457/cultureinfo`. 에러·빈 응답·인증키 미등록 케이스 처리. 인증키 없는 동안 동작하도록 `USE_FIXTURE=true` 환경변수면 `lib/api/fixtures.ts`의 더미 데이터 반환."

4. **EventDataSource 추상화**: "클라이언트 호출용 `lib/api/data-source.ts`를 만들어서 위 API Route들을 호출하는 `CultureInfoDataSource` 클래스를 구현. `EventDataSource` 인터페이스로 추상화."

5. **TanStack Query 훅**: "`hooks/useEvents.ts`, `hooks/useEventDetail.ts`, `hooks/useEventsByBounds.ts`, `hooks/useCalendarEvents.ts`를 만들고 `staleTime: 2분`, 무한스크롤은 useInfiniteQuery."

6. **기능 순차 구현**: F-01 → F-02 → F-03 → F-04 → F-05 → F-06 순서로, 각 기능 단위로 커밋.

7. **각 단계 후 확인**: 한 기능 끝나면 동작 확인 → 다음 단계.

---

**문서 끝.**
