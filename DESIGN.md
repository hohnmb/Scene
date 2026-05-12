# DESIGN.md: SCENE — 디자인 시스템 명세서

> 문화 마니아를 위한 공연·전시 큐레이션 캘린더
> 작성일: 2026-05-12
> 버전: **v1.2 (PRD v1.2 정합성 반영)**
> 용도: Figma Make / Google Stitch 프롬프트 + Claude Code 디자인 가이드

### 📌 v1.2 변경사항 (2026-05-12)
- API 교체 (한눈에보는문화정보조회서비스)에 따른 분야 체계 완전 재정의
- **장르 컬러 매핑을 PRD v1.2 마니아 타겟 6개 + 기타 1개로 변경** (이전 10개 → 7개)
- realmCode 기반으로 통일 (`A000`=theater, `B000`=concert 등)
- 변경된 분야명에 맞춰 폴백 SVG·아이콘 매핑 갱신
- Figma 프롬프트 v1.2 갱신 (6개 분야 컬러로 재작성)
- 컬러 토큰 prefix를 RealmCode 친화적으로 정리

### 📌 v1.1 변경사항 (참고용 - 이전)
- 장르 컬러 매핑을 가상 8개에서 실제 분야 10개로 변경했으나, API 교체로 v1.2에서 다시 재정의됨

---

## 1. 디자인 컨셉

### 1.1 한 줄 정의
**"갤러리처럼 차분하고, 무대처럼 집중되는 디자인"**

### 1.2 디자인 원칙

1. **Content First** — 포스터·이미지가 주인공. UI는 액자 역할
2. **Calm Sophistication** — 화려한 그라데이션·과한 애니메이션 지양. 절제된 고급스러움
3. **Dense but Breathable** — 마니아는 정보 밀도를 선호. 단, 충분한 여백으로 답답하지 않게
4. **Genre as Identity** — 장르별 컬러로 시각적 분류 + 강한 정체성

### 1.3 무드보드 키워드
- 갤러리 도록 (Exhibition catalog)
- 재즈 클럽 야간 조명
- 미드센추리 인쇄물
- 도쿄·베를린 문화 매거진

### 1.4 레퍼런스 (검색 키워드)
- Magazine layout dark mode
- Letterboxd UI (영화 큐레이션 앱 참고)
- Bandcamp Daily
- Sennep, Pentagram 웹사이트
- "MoMA app design"

---

## 2. 컬러 시스템

### 2.1 베이스 컬러 (다크 모드 우선)

```css
/* Background */
--bg-base: #0A0A0F;        /* 거의 검정 (전체 배경) */
--bg-elevated: #14141C;    /* 카드·모달 배경 */
--bg-overlay: #1C1C26;     /* 호버·드롭다운 */

/* Text */
--text-primary: #FAFAFA;   /* 본문·제목 */
--text-secondary: #A1A1AA; /* 보조 텍스트·메타 */
--text-tertiary: #52525B;  /* 비활성·플레이스홀더 */

/* Border */
--border-subtle: #27272A;
--border-default: #3F3F46;

/* Brand */
--brand-primary: #6366F1;  /* 인디고 — 액션 버튼·링크 */
--brand-accent: #C9A961;   /* 골드 — 강조·찜 활성 */
```

### 2.2 장르 컬러 (Color Coding)

> PRD v1.2의 마니아 타겟 분야 6개 + 기타 폴백 1개 = 총 7개.
> 카드 배지·캘린더 이벤트 막대·필터 칩·지도 마커에 일관 적용.

| Genre 코드 | RealmCode | 한글명 | HEX | 톤 | 활용 메모 |
|---|---|---|---|---|---|
| `theater` | A000 | 연극 | `#8B6BA8` | 보라 | 무대 조명 보라톤 |
| `concert` | B000 | 음악/콘서트 | `#C9A961` | 골드 | 재즈·락·일렉트로닉 등 세부장르 베이스 |
| `gugak` | B002 | 국악 | `#7B9E7E` | 청록 | 한국적 색감 |
| `musical` | B003 | 뮤지컬/오페라 | `#D8536B` | 와인 레드 | 화려·강렬 |
| `dance` | C000 | 무용/발레 | `#E89B5C` | 따뜻한 오렌지 | 동적·열정 |
| `exhibition` | D000 | 전시 | `#E8E4D9` | 오프화이트 | 갤러리 무드 |
| `etc` | L000 | 기타 | `#A1A1AA` | 중성 회색 | 분류 폴백 (필터 미노출) |

**Tailwind 토큰 등록** (theme.extend.colors.genre):
```ts
colors: {
  genre: {
    theater:    '#8B6BA8',
    concert:    '#C9A961',
    gugak:      '#7B9E7E',
    musical:    '#D8536B',
    dance:      '#E89B5C',
    exhibition: '#E8E4D9',
    etc:        '#A1A1AA',
  }
}
```

> ⚠️ Tailwind safelist에 `bg-genre-*`, `text-genre-*`, `border-genre-*` 7개씩 등록 필수 (동적 클래스 purge 방지).

### 2.3 세부 장르 (SubGenre) 컬러 처리

세부 장르는 별도 컬러를 가지지 않고 **부모 분야의 컬러를 그대로 사용**한다. 칩 라벨에 부모 분야명을 작게 병기:

```
[ 재즈 · 음악/콘서트 ]      ← concert 컬러 (골드)
[ 현대미술 · 전시 ]         ← exhibition 컬러 (오프화이트)
[ 모던 클래식 · 음악/콘서트 ] ← concert 컬러 (골드)
[ 실험극 · 연극 ]           ← theater 컬러 (보라)
[ 컨템퍼러리 댄스 · 무용/발레 ] ← dance 컬러 (오렌지)
```

이유: 컬러를 더 늘리면 시각 정보 과부하. 부모 분야 컬러로 통일이 정보 위계상 맞음.

### 2.4 시맨틱 컬러

```css
--color-success: #4ADE80;
--color-warning: #FBBF24;
--color-error: #F87171;
--color-info: #60A5FA;
```

### 2.5 라이트 모드 (선택, v1.1)
이번 MVP는 다크 모드 단일. 라이트 모드는 향후 추가.

---

## 3. 타이포그래피

### 3.1 폰트

```css
--font-sans: 'Pretendard', 'Inter', system-ui, sans-serif;
--font-display: 'Pretendard', 'Inter', system-ui, sans-serif; /* 동일, weight로 차별화 */
--font-mono: 'JetBrains Mono', monospace; /* 메타데이터·날짜 */
```

- Pretendard: 국문 (CDN 또는 self-host)
- Inter: 영문 폴백
- JetBrains Mono: 시간·가격 등 숫자 영역에 톤 변화용 (선택)

### 3.2 타입 스케일

| 토큰 | size | line-height | weight | 사용처 |
|---|---|---|---|---|
| `text-display` | 56px | 1.1 | 700 | 홈 히어로 |
| `text-h1` | 40px | 1.2 | 700 | 페이지 제목 |
| `text-h2` | 32px | 1.25 | 600 | 섹션 제목 |
| `text-h3` | 24px | 1.3 | 600 | 카드 제목·서브섹션 |
| `text-h4` | 20px | 1.35 | 600 | 작은 제목 |
| `text-body-lg` | 18px | 1.6 | 400 | 상세 페이지 본문 |
| `text-body` | 16px | 1.6 | 400 | 일반 본문 |
| `text-body-sm` | 14px | 1.5 | 400 | 보조 정보 |
| `text-caption` | 12px | 1.4 | 500 | 메타·라벨·배지 |
| `text-overline` | 11px | 1.3 | 600 | 대문자 라벨 (`letter-spacing: 0.08em`) |

### 3.3 타이포 규칙
- 제목·강조: `font-weight: 600~700`
- 본문: `font-weight: 400`, `line-height: 1.6` (한글 가독성 핵심)
- 모바일에서 display·h1은 한 단계 작게 (`-8px` 정도)

---

## 4. 스페이싱 & 레이아웃

### 4.1 스페이싱 토큰 (8px 그리드)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 4.2 반경 (Border Radius)

```css
--radius-sm: 6px;   /* 배지·태그 */
--radius-md: 10px;  /* 버튼·인풋 */
--radius-lg: 16px;  /* 카드 */
--radius-xl: 24px;  /* 모달·큰 컨테이너 */
--radius-full: 9999px; /* 원형 */
```

### 4.3 그림자

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
--shadow-md: 0 4px 12px rgba(0,0,0,0.5);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.6);
--shadow-glow: 0 0 24px rgba(99,102,241,0.3); /* 강조 요소 */
```

### 4.4 브레이크포인트

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

### 4.5 그리드 (탐색 페이지 카드)

| 화면 | 컬럼 수 | gap |
|---|---|---|
| 모바일 (< 640px) | 1 | 16px |
| 태블릿 (640~1023px) | 2 | 20px |
| 데스크톱 (1024~1279px) | 3 | 24px |
| 와이드 (≥ 1280px) | 4 | 24px |

### 4.6 컨테이너 최대 너비
- 본문 컨테이너: `max-width: 1440px`, 좌우 패딩 `24px`(모바일) ~ `48px`(데스크톱)
- 상세 페이지 본문 영역: `max-width: 720px` (긴 텍스트 가독성)

---

## 5. 컴포넌트 명세

### 5.1 EventCard (행사 카드)

**구조 (위에서 아래)**:
1. **포스터 이미지** — 종횡비 3:4, `border-radius: 16px 16px 0 0`
   - `posterUrl`이 `null`이면 **분야별 폴백 SVG** 사용 (`/public/fallback/{genre}.svg`)
   - 폴백 시: 분야 컬러 배경 + 분야 한글명 + 분야 아이콘 (lucide 매핑)
2. **우상단 찜 버튼** (하트 아이콘) — 절대 위치, 반투명 배경
3. **좌상단 GenreBadge** — 분야명 + 분야 컬러
4. **좌하단 메타 배지** (조건부) — 절대 위치
   - `venue.lat`/`venue.lng`가 `null`이면 `위치정보 없음` 배지 (반투명 검정 + 흰 텍스트, lucide `MapPinOff` 아이콘)
5. **카드 본문** (`padding: 16px`)
   - 제목 (`text-h3`, max 2줄 ellipsis)
   - 기간 (`text-body-sm`, `text-secondary`, lucide `Calendar` 아이콘)
   - 장소 (`text-body-sm`, `text-secondary`, lucide `MapPin` 아이콘) — `place` 그대로 표시
   - 가격 (`text-caption`, 우측 정렬, 골드 컬러) — 자유 텍스트 그대로 ("30,000원"/"무료"/"전석 5만원")

**상태**:
- Default: `bg-elevated`
- Hover: `transform: translateY(-4px)`, `shadow-md`, 포스터 약간 확대 (`scale(1.03)`)
- Loading: 스켈레톤 (포스터·텍스트 자리에 placeholder 회색)
- 폴백 포스터 시: hover scale 적용하지 않음 (확대해도 무의미)

### 5.2 FilterChip (필터 칩)

**기본 (분야 / 지역 단일 값)**: 텍스트 + 선택 시 좌측 체크 아이콘
- Default: `bg-overlay`, `border: 1px solid border-subtle`, `text-secondary`
- Selected: 분야 컬러 배경 (12% 알파) + 분야 컬러 테두리 + 분야 컬러 텍스트
- `border-radius: full`, `padding: 6px 14px`, `font-size: 14px`

**SubGenre 프리셋 칩 (재즈·현대미술 등)**: 부모 분야 컬러 + 보조 라벨
```
┌──────────────────────┐
│ 🎵 재즈              │  ← 큰 라벨 (분야 컬러)
│    음악/콘서트        │  ← 작은 라벨 (text-secondary, 11px)
└──────────────────────┘
```
- 부모 분야 컬러를 베이스로 사용
- "마니아 추천" 섹션에 별도 묶음으로 노출 (탐색 페이지 필터 상단)
- 선택 시 분야 필터(realmCode) + 키워드 검색이 자동 적용됨 (PRD 6.2 SubGenre 타입 참조)
- **추천 프리셋 8개 (v1.2)**:
  - 재즈 (B000 음악/콘서트 + "재즈")
  - 락 (B000 음악/콘서트 + "락")
  - 일렉트로닉 (B000 음악/콘서트 + "일렉트로닉")
  - 모던 클래식 (B000 음악/콘서트 + "모던")
  - 현대미술 (D000 전시 + "현대")
  - 사진전 (D000 전시 + "사진")
  - 실험극 (A000 연극 + "실험")
  - 컨템퍼러리 댄스 (C000 무용/발레 + "컨템퍼러리")

### 5.3 Button

**Variants**:
- **Primary**: `bg-brand-primary`, `text-white`, hover 시 10% 밝게
- **Secondary**: `bg-bg-overlay`, `border: 1px solid border-default`, `text-primary`
- **Ghost**: 배경 없음, hover 시 `bg-overlay`
- **Icon**: 정사각형, 아이콘 only

**Sizes**: sm(32px) / md(40px) / lg(48px)
**Radius**: `radius-md`
**Font**: weight 500, size 14~16px

### 5.4 GenreBadge

장르명 + 장르 컬러 배경 (반투명 12% + 텍스트는 100% 컬러)
- `border-radius: full`, `padding: 4px 10px`, `font-size: 12px`, `font-weight: 600`

### 5.5 Input / SearchBar

- 높이 44px (데스크톱) / 48px (모바일, 터치 영역)
- `bg-overlay`, `border: 1px solid border-default`
- Focus: `border: brand-primary`, `box-shadow: 0 0 0 3px rgba(99,102,241,0.2)`
- 검색 인풋: 좌측 돋보기 아이콘, 우측 X(클리어) 버튼

### 5.6 ViewToggle (카드 / 캘린더 / 지도)

세그먼티드 컨트롤 형태
- 컨테이너: `bg-overlay`, `radius-md`, `padding: 4px`
- 활성 탭: `bg-bg-base`, `shadow-sm`
- 비활성: 텍스트만, `text-secondary`

### 5.7 CalendarCell (캘린더 날짜 셀)

- 정사각형 또는 1:1.2 비율
- 상단 좌측에 날짜 (text-body-sm)
- 오늘: 날짜를 동그라미로 강조 (`bg-brand-primary`, `text-white`)
- 이벤트 표시: 가로 막대 (장르 컬러), 최대 3개 + "+N more"
- 빈 셀: 텍스트만, hover 시 배경 살짝 변화

### 5.8 MapMarker / Cluster

- 단일 마커: 장르 컬러 핀, 흰색 테두리
- 클러스터: 원형, 개수 표시, `bg-brand-primary`, 흰색 텍스트
- 인포윈도우: `bg-elevated`, `radius-lg`, 미니 카드 (포스터 썸네일 + 제목 + 기간)

### 5.9 Skeleton

- 베이스: `bg-overlay`
- 애니메이션: shimmer (좌→우 흐르는 그라데이션, 1.5s 반복)

### 5.10 EmptyState

- 중앙 정렬, 아이콘 (lucide `Calendar` / `MapPin`), 메시지, CTA 버튼
- `text-secondary`, `padding-y: 80px`

### 5.11 PosterFallback (포스터 폴백)

`posterUrl`이 `null`인 행사를 위한 분야별 폴백 이미지.

**구조**:
- 3:4 비율 (EventCard 포스터 영역과 동일)
- 배경: 분야 컬러를 어둡게 (60% darken) + 분야 컬러 대각선 그라데이션
- 중앙: 분야 아이콘 (96px, 흰색 30% 알파)
- 하단: 분야 한글명 (`text-h4`, 흰색 70% 알파)

**분야 → lucide 아이콘 매핑 (v1.2)**:
| Genre | RealmCode | 한글명 | 아이콘 |
|---|---|---|---|
| theater | A000 | 연극 | `Drama` |
| concert | B000 | 음악/콘서트 | `Music` |
| gugak | B002 | 국악 | `Music3` |
| musical | B003 | 뮤지컬/오페라 | `Mic2` |
| dance | C000 | 무용/발레 | `Sparkles` |
| exhibition | D000 | 전시 | `ImageIcon` |
| etc | L000 | 기타 | `LayoutGrid` |

**구현 권장**:
- 정적 SVG 7개를 `/public/fallback/{genre}.svg`에 미리 만들어두고 `next/image`로 로드
- 또는 React 컴포넌트로 동적 생성 (`<PosterFallback genre={genre} />`)

### 5.12 NoLocationBadge (위치정보 없음 배지)

`venue.lat/lng`가 `null`인 행사를 표시하는 메타 배지.

**구조**:
- 아이콘: lucide `MapPinOff` (12px)
- 라벨: "위치정보 없음"
- 배경: `rgba(0,0,0,0.6)` (반투명 검정)
- 텍스트: 흰색 70% 알파, 11px, weight 500
- `padding: 4px 8px`, `border-radius: full`
- 표시 위치: EventCard 좌하단 (포스터 영역 안), 상세 페이지 미니맵 영역 자리에 inline 메시지로

### 5.13 PriceTag (가격 표시)

API의 `price`는 자유 텍스트("30,000원", "전석 5만원", "무료", "유료" 등). 일관된 표시를 위한 처리.

**규칙**:
- 텍스트에 "무료" 포함 → 초록 (`color-success`) + lucide `Gift` 아이콘
- 텍스트에 "유료"만 있고 금액 없음 → 골드 + "유료" 라벨
- 금액 텍스트가 있음 → 골드 + 금액 그대로
- 빈 문자열 / `null` → 표시 안 함
- 모두 `text-caption`, 우측 정렬

### 5.14 EmptyEventCard (결과 0건 카드)

필터 결과가 0건일 때 카드 그리드 자리에 표시.

**구조**:
- 그리드 전체 폭을 차지 (`grid-column: 1 / -1`)
- 중앙 정렬, 패딩 `padding-y: 120px`
- 아이콘: lucide `SearchX` (64px, `text-tertiary`)
- 제목: "조건에 맞는 행사가 없어요" (`text-h3`)
- 서브: "필터를 조금 풀어보거나, 기간을 넓혀보세요" (`text-body`, `text-secondary`)
- CTA: "필터 초기화" 버튼 (Secondary variant)

---

## 6. 화면별 디자인 명세

### 6.1 홈 (`/`)

**섹션 구조 (위→아래)**:
1. **헤더** (sticky)
   - 좌측: 로고 "SCENE"
   - 중앙: 검색바 (max-w 480px)
   - 우측: 찜 아이콘(+개수 배지), 메뉴
2. **히어로**
   - 큰 카피: "이번 달, 놓치지 말아야 할" (text-display)
   - 서브 카피: "공연과 전시를 한눈에"
   - CTA 버튼: "탐색 시작" → `/explore`
   - 배경: 큰 포스터 이미지 1장(블러+오버레이) 또는 추상적 그라데이션
3. **오늘의 추천** (P3, 가능 시)
   - 섹션 제목: "오늘의 추천"
   - 가로 스크롤 캐러셀 (카드 3~5개)
4. **이번 주 하이라이트**
   - 섹션 제목 + "전체 보기" 링크
   - 카드 그리드 4개
5. **분야별 진입점**
   - PRD v1.2의 마니아 타겟 6개 분야를 큰 컬러 블록으로 배치 → 클릭 시 해당 분야 필터(realmCode) 적용된 `/explore`로 이동
   - 그리드: 데스크톱 3열 × 2행, 태블릿 3열 × 2행, 모바일 2열 × 3행
   - 블록 구조: 분야 컬러 배경(약 30% 알파) + 분야 아이콘 + 분야 한글명
   - 기타(L000)는 노출하지 않음
6. **마니아 추천** (옵션, P3)
   - SubGenre 프리셋 칩 8개를 가로 스크롤 캐러셀로 표시
   - 클릭 시 자동 필터 적용된 `/explore`로 이동
7. **푸터**
   - 데이터 출처: 한국문화정보원 (링크)
   - GitHub 링크

### 6.2 탐색 (`/explore`)

**레이아웃**: 좌측 필터 사이드바 (280px 고정) + 우측 결과 영역

**데스크톱 — 좌측 사이드바 (위→아래)**:
- 검색바 (`keyword` 파라미터)
- **마니아 추천 (SubGenre 프리셋)** — 칩 8개, 2~3열 그리드 형태로 묶어서 표시
- **분야 필터** — **6개 분야 칩** (다중 선택 가능, 분야 컬러로 강조). 기타(L000)는 미노출
- **지역 필터** — 계층 드롭다운 (시·도 `sido` → 시·군·구 `sigungu`)
- **기간 필터** — 빠른 선택 (오늘/이번 주/이번 달) + 사용자 지정 범위 (date-fns로 YYYYMMDD 변환)
- **무료만 보기 토글** (price 필드에 "무료" 포함 여부)
- "필터 초기화" 버튼 (Ghost variant)

**데스크톱 — 우측**:
- 상단: 결과 개수 + 정렬 드롭다운(등록일/공연명/지역, API `sortStdr` 매핑) + ViewToggle(카드/캘린더/지도)
- 본문: 선택한 뷰에 따라 카드 그리드 / 캘린더 / 지도
- 결과 0건 시: `EmptyEventCard` (5.14 참조)

**모바일**:
- 필터는 바텀시트 (하단 fixed 버튼 "필터" → 클릭 시 열림)
- ViewToggle은 상단 sticky

### 6.3 행사 상세 (`/event/[id]`)

**레이아웃** (데스크톱):
- 좌측 (40%): 포스터 (고정, 클릭 시 라이트박스)
- 우측 (60%):
  - 장르 배지 + 제목 (text-h1)
  - 메타 정보 (기간·시간·장소·가격) — 아이콘 + 텍스트 형태로 깔끔하게
  - 액션 버튼 영역: "찜하기" / "예매하기"(외부) / "공유"
  - 출연/주최
  - 소개 본문 (max-width 640px, line-height 1.7)
  - **장소 미니맵 (높이 240px)** — `venue.lat/lng`가 있으면 카카오맵, 없으면 카카오 로컬 API로 폴백 변환 시도 → 그래도 없으면 미니맵 영역을 `NoLocationBadge` + 주소 텍스트로 대체
  - 가격: `PriceTag` 컴포넌트 사용
  - 비슷한 행사 추천 (같은 분야 4개)

**모바일**:
- 포스터 풀폭 → 정보 영역 세로로 쌓임
- 액션 버튼은 하단 sticky

### 6.4 찜 목록 (`/saved`)

- 상단: 제목 "찜한 행사 (N건)", 정렬 드롭다운, "전체 삭제"
- 본문: EventCard 그리드 (탐색 페이지와 동일 카드)
- 빈 상태: EmptyState 컴포넌트 + "탐색하러 가기" CTA

### 6.5 캘린더 뷰 (탐색 내)

- 상단: 월 네비게이션 (← 2026.05 →), 월/주 토글
- 캘린더 그리드: 7열 × 5~6행
- 셀당 이벤트 최대 3개 + "+N more" — 막대 색은 분야 컬러
- 더보기 클릭 시 모달로 그날의 행사 전체 표시
- 행사 기간이 며칠에 걸치는 경우: 시작일·종료일 셀에만 표시 (전체 칠하지 않음, 시각 혼잡 방지)

### 6.6 지도 뷰 (탐색 내)

- 좌측: 지도 (전체 영역의 65%) — 카카오맵
- 우측: 보이는 영역 내 행사 리스트 (스크롤)
- 좌상단 플로팅: "현재 위치" 버튼 (lucide `Locate`)
- 우상단 플로팅: "결과 N건" 카운터
- 지도 영역 이동 시 디바운스 500ms 후 `gpsxfrom/to/yfrom/to`로 API 재조회
- **좌표 없는 행사 처리**: 지도 뷰에서는 마커로 표시하지 않되, 우측 리스트 하단 별도 섹션 "위치정보 없음 (N건)"으로 노출 → 해당 행사는 마커 없이 클릭 시 상세 페이지로
- 모바일: 지도 전체 + 하단 가로 스크롤 카드 캐러셀 (좌표 있는 행사만)

---

## 7. 인터랙션 & 모션

### 7.1 애니메이션 원칙
- 짧고 정제됨: 대부분 `200~300ms`, `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- 과한 바운스·튀는 효과 금지
- 모션 감소 설정(`prefers-reduced-motion`) 존중

### 7.2 핵심 인터랙션

| 요소 | 동작 |
|---|---|
| 카드 hover | translateY(-4px) + 그림자 + 포스터 scale(1.03), 300ms |
| 페이지 전환 | fade 200ms |
| 모달 열림 | 배경 fade + 본체 scale(0.95→1) 250ms |
| 필터 적용 | 결과 영역 fade(300ms) + 스켈레톤 |
| 찜 버튼 | 하트 scale(1→1.3→1) + 컬러 변경 250ms |
| 무한스크롤 로드 | 하단 스피너 회전 |

---

## 8. 아이콘

**라이브러리**: `lucide-react`
**스타일**: 1.5px stroke, 24px 기본

**핵심 아이콘**:
- 메뉴: `Menu`
- 검색: `Search`
- 필터: `SlidersHorizontal`
- 찜: `Heart` (활성 시 `fill-current`)
- 공유: `Share2`
- 위치: `MapPin`
- 시간: `Clock`
- 캘린더: `Calendar`
- 카드 뷰: `LayoutGrid`
- 지도 뷰: `Map`
- 외부 링크: `ExternalLink`
- 닫기: `X`
- 더보기: `ChevronRight`, `MoreHorizontal`

---

## 9. 접근성

- 모든 인터랙션 요소: `focus-visible` 링 표시 (`outline: 2px solid brand-primary`)
- 컬러 대비: WCAG AA (본문 4.5:1, 큰 텍스트 3:1)
- 키보드: Tab 순서 자연스럽게, Esc로 모달 닫기
- 이미지: 의미 있는 모든 `<img>`에 `alt` (포스터는 행사명)
- 폼: `<label>` 명시
- 스크린리더: 장르 컬러는 아이콘·텍스트로도 표현 (색만으로 정보 전달 금지)
- 다크 모드만 제공하므로 `prefers-color-scheme` 감지는 생략

---

## 10. Figma Make / Google Stitch 프롬프트 (복붙용)

> 아래 프롬프트를 Figma Make 또는 Google Stitch에 그대로 붙여넣어 시안 생성.
> PRD v1.2의 마니아 타겟 분야 6개 + 기타 1개에 정렬됨.

```
Design a culture event curation web app called "SCENE" for culture enthusiasts (mania users) who want to discover concerts and exhibitions in Korea. The app pulls data from the Korea Culture Information Service Agency open API ("한눈에보는문화정보조회서비스").

Visual Style:
- Dark mode only, background near-black (#0A0A0F), card background (#14141C), overlay (#1C1C26)
- Sophisticated, calm, gallery-catalog aesthetic — like a printed magazine
- Posters and images are the heroes, UI is a minimal frame
- Typography: Pretendard for Korean, Inter for English, bold display headers, 1.6 line-height body
- Primary accent: indigo #6366F1, secondary accent: gold #C9A961

Genre Color Coding (6 mania-targeted categories + 1 fallback, from realmCode):
- Theater 연극 (A000): purple #8B6BA8
- Music/Concert 음악/콘서트 (B000): gold #C9A961 (parent of jazz, rock, electronic, modern classical)
- Gugak 국악 (B002): sage green #7B9E7E
- Musical/Opera 뮤지컬/오페라 (B003): wine red #D8536B
- Dance/Ballet 무용/발레 (C000): warm orange #E89B5C
- Exhibition 전시 (D000): off-white #E8E4D9 (parent of contemporary art, photography)
- Etc 기타 (L000): neutral gray #A1A1AA (fallback, not exposed in filters)

Required Screens:
1. Home — hero section with bold typography "이번 달, 놓치지 말아야 할", today's picks carousel, this week's highlights grid (4 cards), 6 genre entry blocks (3x2 grid), mania subgenre preset chips carousel (재즈/락/일렉트로닉/모던 클래식/현대미술/사진전/실험극/컨템퍼러리 댄스)
2. Explore — left sidebar (280px) with search, 8 mania subgenre preset chips section, 6 genre filter chips, region hierarchy dropdown (sido → sigungu), date range picker (today/this week/this month/custom), free-only toggle. Right side with result count + sort dropdown (등록일/공연명/지역) + view toggle (card grid / calendar / map)
3. Event Detail — large poster on left, details on right (genre badge, title, period, venue, price tag, description, similar events grid), mini map for venue (with fallback "no location info" state)
4. Calendar View — month grid with genre-colored event bars in cells (max 3 per cell + "+N more")
5. Map View — Kakao Map with clustered markers + side list of visible events + separate "no location info" section at bottom of list
6. Saved — grid of saved events

Key Components:
- EventCard: 3:4 poster aspect (with genre-colored SVG fallback when poster is null), genre badge top-left, heart button top-right, "위치정보 없음" badge bottom-left when coordinates are null, title (2-line ellipsis), date, venue, price tag
- SubGenre preset chip: two-line label format with main label (parent genre color) + small parent category name below — e.g. "재즈 / 음악/콘서트", "현대미술 / 전시"
- Filter chips: pill-shaped, selected state uses parent genre color
- Empty state card: spans full grid width, centered icon + message + reset filters CTA
- Poster fallback: dark gradient of genre color + large genre icon (lucide) + genre name in Korean
- Price tag: green for free (무료), gold for paid amounts

Mood references: Letterboxd dark mode, magazine layouts, jazz club ambient lighting, MoMA app design, Pentagram website
```

---

## 11. Claude Code 작업 지시

> Claude Code가 코드에서 일관성을 유지하도록 다음을 따른다:

1. **디자인 토큰을 `app/globals.css` 또는 `tailwind.config.ts`에 등록**
   - 위 컬러·스페이싱·반경 값을 CSS 변수 또는 Tailwind theme extend로
   - 장르 컬러는 `theme.extend.colors.genre` 네임스페이스에 **7개 키**로 (`theater`, `concert`, `gugak`, `musical`, `dance`, `exhibition`, `etc`)

2. **shadcn/ui 컴포넌트 커스터마이징**
   - `components.json`에서 base color를 zinc/slate 기반으로 잡고, 위 토큰으로 override
   - 다크 모드 전용 (light 모드는 만들지 않음)

3. **컴포넌트 폴더 구조**
   ```
   components/
     ui/           # shadcn 기본 컴포넌트
     event/        # EventCard, EventDetail, PosterFallback, NoLocationBadge, PriceTag, EmptyEventCard
     filter/       # FilterSidebar, FilterChip, SubGenrePresetChip
     view/         # CardView, CalendarView, MapView
     layout/       # Header, Footer, Container
   ```

4. **장르 컬러 클래스 동적 생성 방지**
   - Tailwind safelist에 `bg-genre-{name}`, `text-genre-{name}`, `border-genre-{name}` 등록 (7개 분야 × 필요 prefix)
   - 또는 정적 매핑 객체로 처리 (`const GENRE_BG = { theater: 'bg-genre-theater', ... }`)

5. **이미지·폴백 처리 규칙**
   - 이미지는 항상 `next/image` 사용
   - 포스터: `posterUrl ?? null` 체크 후 null이면 `<PosterFallback genre={genre} />` 렌더
   - 좌표: `lat == null || lng == null` 체크 후 null이면 `<NoLocationBadge />` 표시
   - 가격: `<PriceTag value={price} />` 컴포넌트로 위임

6. **PRD ↔ DESIGN 정합성 유지**
   - PRD v1.2의 Genre 타입 7개 (`theater`/`concert`/`gugak`/`musical`/`dance`/`exhibition`/`etc`) = 이 문서 2.2의 컬러 매핑 7개 = 일치 필수
   - RealmCode ↔ Genre 매핑은 PRD 6.2의 REALM_MAP 상수와 1:1 매칭
   - SubGenre 프리셋 8개는 PRD 6.2의 SubGenre 타입과 1:1 매칭
   - 기타(L000/etc)는 폴백 전용, 필터·홈 분야 진입점에 노출하지 않음

---

## 12. 산출물 체크리스트

이번 디자인 단계 완료 기준:

- [ ] Figma 시안 3장 이상 (홈, 탐색, 상세) — 분야 컬러 7개(6개 + 기타) 적용
- [ ] 컬러·타이포·스페이싱 토큰을 `tailwind.config.ts`에 등록
- [ ] 장르 컬러 7개 + safelist 등록
- [ ] shadcn/ui 기본 컴포넌트 설치 + 커스터마이징
- [ ] 분야별 폴백 SVG 7종 (`/public/fallback/{genre}.svg`) 제작
- [ ] 핵심 컴포넌트 구현: EventCard, GenreBadge, FilterChip, SubGenrePresetChip, PosterFallback, NoLocationBadge, PriceTag, EmptyEventCard
- [ ] 반응형 그리드 동작 확인 (모바일·태블릿·데스크톱)
- [ ] 데이터 누락 케이스 (포스터 null / 좌표 null / 가격 빈문자열) UI 확인
- [ ] PRD v1.2의 RealmCode ↔ Genre 매핑과 컬러 매핑 정합성 검증

---

**문서 끝.**
