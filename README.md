# 더착한치과 공식 홈페이지 (thegooddc.kr)

> 부산 강서구 명지오션시티 **더착한치과** 공식 웹사이트
> Hono SSR + Cloudflare Pages 기반 초경량·초고속 + 풀 SEO/AEO + 방문·전환 추적 내장

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **병원명** | 더착한치과 (The Good Dental Clinic) |
| **대표원장** | 황우석 |
| **주소** | 부산 강서구 명지오션시티4로 59, 스타빌딩 601·602호 |
| **대표전화** | 051-203-2875 |
| **사업자등록번호** | 606-39-03241 |
| **공식 도메인** | https://thegooddc.kr |
| **기술 스택** | Hono v4 (SSR) · Cloudflare Pages · Vite v6 · TypeScript |
| **목표** | 서부산 지역 검색 1순위 + 방문→상담 전환 측정으로 데이터 기반 운영 |

---

## 2. 주요 기능 (현재 완료)

### 공개 사이트
- **반응형 풀페이지**: 홈 / 병원소개 / 의료진 / 진료안내(13종) / 비포애프터 / 원장칼럼 / 치과백과사전(393개 용어) / 오시는길 / 비용안내 / FAQ / 공지사항 / 진료예약
- **지역 SEO 랜딩**: 13개 지역 × 4개 진료 조합 + 지역 허브 페이지 (`/clinic/:area`, `/area/:area-:treatment`)
- **홈 팝업 공지** · 스크롤 진행바 · 모바일 드로어 메뉴

### SEO / AEO (AI 검색 최적화)
- JSON-LD 구조화 데이터 20+종 (MedicalClinic / Dentist / Article / FAQPage / GeoCircle 등)
- `robots.txt`: 13종 AI 봇 허용(GPTBot/ClaudeBot/PerplexityBot 등) + 악성 스크래퍼 차단
- `llms.txt`: AI 직답형 FAQ + 요일별 진료시간 + 좌표/교통
- 사이트맵 인덱스 + 5개 하위 사이트맵(이미지 사이트맵 포함)
- IndexNow 즉시 색인 요청 (관리자 버튼)
- **SEO 자가진단**: `/seo-health` (100점 만점 자동 채점)

### 방문·전환 추적 (NEW) — 데이터 기반 운영의 핵심
- **GA4 + GTM + Google Consent Mode v2** (의료 개인정보·광고법 안전 동의 기반)
- **전환 자동 측정**: 전화·예약·카카오·길찾기 클릭 + 예약폼 제출(`generate_lead`)
- **관리자에서 ID만 입력 → 즉시 작동** (코드 수정·재배포 불필요)
- 네이버 서치어드바이저 / 구글 서치콘솔 소유확인 메타 자동 주입

### 예약 운영 (NEW) — 병원이 매일 쓰는 운영 루프
- **예약 운영 대시보드** `/admin/reservations`: 상태관리(신규→확정→완료/취소), 이름·연락처 실시간 검색, 상태별 필터
- **CSV 내보내기**: 엑셀에서 바로 열리는 UTF-8 BOM CSV (`/api/admin/reservations/export`)
- **안내문 한 번에 복사**: 환자에게 보낼 예약 확인 문자 템플릿을 클립보드로 복사
- **운영 분석** `/admin/analytics`: 전환 퍼널(접수→확정→완료)·전환율, 인기 진료 TOP, 요일/시간대 예약 패턴 (순수 CSS 차트)

### PWA (NEW) — 홈 화면 앱 설치
- `/manifest.webmanifest` + 서비스워커(`/sw.js`)로 **모바일 홈 화면 설치** 지원
- 오프라인 폴백 페이지(`/offline`) — 네트워크 끊겨도 전화 연결 안내
- 정적 자원 cache-first, 페이지 network-first 캐싱 전략

### 전환·신뢰 강화 (NEW) — 매출 직결 + "팬" 만들기
- **환자 후기 섹션** (홈 `/#reviews`): 8건 후기 카드 + 평균 평점 + **AggregateRating·Review 스키마**(검색결과 별점 노출)
- **예약폼 UX 퍼널화** (`/reservation`): 4단계 진행 표시 + 진료/시간대 **칩 선택** + 단계 자동 진행 + 제출 안심 문구
- **진료 여정 시각화** (`/reservation` 상단): "예약하면 이렇게 진행됩니다" 6단계 안심 프로세스
- **Before/After 슬라이더**: 드래그/터치로 진료 전후 비교 (셀렉터 버그 수정 완료)
- **플로팅 상담바**: 모바일 하단 고정 — 카카오·전화상담·예약하기 원터치(텍스트 라벨)

### 접근성·성능 (a11y / Web Vitals)
- 본문 바로가기(skip-link), 키보드 포커스 가시성, 시맨틱 마크업
- 모든 이미지 `aspect-ratio` 컨테이너로 CLS 방지, lazy 로딩, 헤더 로고 `fetchpriority=high`
- 세리프 폰트·Font Awesome 비차단(non-blocking) 로드로 렌더 블로킹 제거

---

## 3. 기능별 진입 경로 (URI)

### 공개 페이지
| 경로 | 설명 |
|------|------|
| `/` | 홈 (FAQ 아코디언 포함) |
| `/mission` | 병원소개 |
| `/doctors`, `/doctors/:slug` | 의료진 목록·상세 |
| `/treatments`, `/treatments/:slug` | 진료안내 목록·상세 |
| `/cases` | 비포/애프터 (after 사진은 로그인 게이팅) |
| `/column`, `/column/:slug` | 원장 칼럼 목록·상세 |
| `/encyclopedia`, `/encyclopedia/:slug` | 치과 백과사전 (`?cat=` 카테고리 필터) |
| `/directions` `/pricing` `/faq` `/notice` `/reservation` | 안내·예약 |
| `/manifest.webmanifest` `/sw.js` `/offline` | PWA (앱 설치·오프라인) |
| `/clinic/:area` | 지역 허브 (예: `/clinic/myeongji`) |
| `/area/:area-:treatment` | 지역×진료 랜딩 |
| `/privacy` `/terms` | 개인정보처리방침·이용약관 |

### SEO 산출물
| 경로 | 설명 |
|------|------|
| `/sitemap.xml` | 사이트맵 인덱스 |
| `/sitemap-main.xml` `/sitemap-treatments.xml` `/sitemap-content.xml` `/sitemap-encyclopedia.xml` `/sitemap-areas.xml` | 하위 사이트맵 |
| `/robots.txt` `/llms.txt` | 크롤러·AI 안내 |
| `/seo-health` | SEO 자가진단 (`?format=html` 표 보기) |

### 관리자 (로그인 필요)
| 경로 | 설명 |
|------|------|
| `/admin` | 관리자 로그인 |
| `/admin/dashboard` | 대시보드 (현황 + **추적 연결 상태 카드**) |
| `/admin/notices` | 공지·팝업 관리 |
| `/admin/columns` | 원장 칼럼 (사진 드롭·커버·실시간 미리보기 슈퍼 에디터) |
| `/admin/cases` | 비포/애프터 케이스 관리 |
| `/admin/members` | 회원 조회 |
| **`/admin/reservations`** | **예약 운영 (상태관리·검색·필터·CSV·안내문 복사)** |
| **`/admin/analytics`** | **운영 분석 (전환 퍼널·인기진료·요일/시간대 패턴)** |
| **`/admin/settings`** | **추적·분석 설정 (GA4/GTM/네이버/구글)** |

---

## 4. 추적·분석 설정 방법 (원장님 직접 운영)

### GA4(방문·전환 분석) 연결 — 5분
1. https://analytics.google.com 접속 → 속성 만들기
2. **관리 → 데이터 스트림 → 웹** → ‘G-’로 시작하는 **측정 ID** 복사
3. `/admin/settings` 의 **GA4 측정 ID** 칸에 붙여넣고 **저장**
4. 끝! 사이트 전체에 즉시 적용, 실시간 방문·전화·예약 전환이 수집됩니다.

### 측정되는 전환 이벤트 (페이션트 퍼널)
| 이벤트 | 의미 |
|--------|------|
| `click_phone` | 전화 상담 클릭 (헤더/플로팅/푸터 위치 구분) |
| `click_reservation` | 예약 버튼·페이지 진입 |
| `reservation_submit` / `generate_lead` | **예약 폼 제출 = 최상위 전환** |
| `click_kakao` | 카카오 채널 상담 |
| `click_directions` | 길찾기 |

> 개인정보 보호: **Consent Mode v2** 로 광고 식별자는 기본 차단, 익명 방문 통계만 수집 → 의료광고·개인정보 안전.

### 검색엔진 등록
- 네이버: https://searchadvisor.naver.com → 메타태그의 `content` 값을 `/admin/settings` 네이버 칸에 입력
- 구글: https://search.google.com/search-console → 동일하게 구글 칸에 입력

---

## 5. 데이터 구조 · 저장소

| 데이터 | 저장 방식 |
|--------|-----------|
| 병원 기본정보 | `src/data/clinic.ts` (코드 — Single Source of Truth) |
| 진료/의료진/지역/백과사전 | `src/data/*.ts` (코드 시드) |
| 공지·칼럼·케이스 | **Cloudflare KV** (`content:notices` / `content:columns` / `content:cases`), 비었을 땐 코드 시드 fallback |
| 추적 설정 | **Cloudflare KV** (`content:settings`), 우선순위 = 환경변수 > KV > 코드 |
| 회원·예약 | Cloudflare KV (`user:*` / `reservation:*`) |
| 케이스 사진 | **Cloudflare R2** |

설정 우선순위: 배포 시 환경변수(`GA4_ID` 등)로 고정하면 관리자 입력보다 우선 적용(잠금 표시).

---

## 6. 배포 · 운영

### 배포 (Cloudflare Pages)
```bash
npm run build
npx wrangler pages deploy dist --project-name thegooddental
```
- **Cloudflare 프로젝트**: `thegooddental`
- **커스텀 도메인**: thegooddc.kr (연결 완료)
- **GitHub**: https://github.com/sodanstjrwns-max/thegooddc

### 로컬 개발
```bash
npm run build
pm2 start ecosystem.config.cjs   # http://localhost:3000
```

### 콘텐츠 수정 (코드 불필요)
- 공지/칼럼/케이스: `/admin` 로그인 후 관리자 페이지에서 직접 작성·수정
- 신규 글 작성 후 대시보드의 **[검색엔진 색인요청]** 버튼으로 즉시 색인 요청 권장

### 정적 파일(CSS/JS) 수정 시
- `src/lib/asset-version.ts` 의 `ASSET_VERSION` 값을 올려야 캐시가 갱신됩니다.

---

## 7. 유지보수 체크리스트

- [ ] 진료시간·전화·주소 변경 → `src/data/clinic.ts` 수정 후 재배포 (사이트 전역 자동 반영)
- [ ] 새 칼럼/공지 → 관리자 페이지에서 작성 → 색인요청
- [ ] GA4·검색엔진 → `/admin/settings` 에서 ID 관리
- [ ] 월 1회 `/seo-health` 로 SEO 상태 100점 유지 확인
- [ ] 분기 1회 GA4에서 전환(전화·예약) 추이 확인 → 광고·콘텐츠 의사결정

---

## 8. 기술 메모

- **런타임**: Cloudflare Workers(Pages) — Node.js API/파일시스템 미사용, Web 표준 API만 사용
- **추적 주입 패턴**: 요청 미들웨어가 `getSettings(env)` prefetch → 런타임 홀더 → `Layout` 동기 렌더
- **SEO 스키마**: `src/lib/seo.ts` (canonical은 항상 `https://thegooddc.kr` 기준)

---

**Platform**: Cloudflare Pages · **Status**: ✅ Active · **Last Updated**: 2026-06-21
© 2026 더착한치과. 본 사이트는 의료법 및 의료광고 사전심의 관련 규정을 준수합니다.
