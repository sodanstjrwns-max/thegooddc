# 더착한치과 (The Good Dental Clinic)

부산 강서구 명지 · 통합치의학과 전문의 치과 — 하이엔드 인터랙티브 풀스택 홈페이지

## 프로젝트 개요
- **병원명**: 더착한치과 (대표원장 황우석 / 치의학박사 · 통합치의학과 전문의)
- **목표**: bdbddc.com(서울비디치과)급 SEO·퍼널·인링크 골격을 복제하되, 디자인은 신청서(Q24 따뜻하고 친근한 / Q25 블루) 기반으로 독창적으로 구현
- **미션**: "치과 통증의 두려움을 안심으로 바꾸겠습니다"
- **핵심 진료 TOP3**: 디지털 가이드 임플란트 · 투명교정 · 미니쉬(라미네이트)

## ✅ 완료된 기능
- **메인 페이지**: 풀스크린 히어로, 스크롤 reveal/패럴랙스, 숫자 카운트업, 환자 퍼널 시각화
- **진료 페이지**: 핵심3 상세(각 1,500자+, AEO 질문형 H2+직답, 세부시술, 비교표) + 전체 10개 과목
- **의료진**: 목록 + 개별 SSR 프로필(학력·경력 사실관계 원문, 진료 인링크)
- **비포/애프터**: 슬라이더 비교, 애프터 사진 로그인 게이팅(의료법), 진료·원장·지역 양방향 인링크
- **원장 칼럼**: SSR 칼럼 + Article/MedicalWebPage 스키마 + 관련 진료·의료진 인링크
- **백과사전**: 500+ 용어, 카테고리 필터, 진료 자동 인링크
- **지역 SEO**: 8개 지역 × 핵심 3진료 = 24개 조합 페이지 (`/area/[지역]-[진료]`)
- **인증**: 회원가입/로그인(HMAC 세션, HttpOnly Secure 쿠키 30일), 마이페이지
- **관리자**: 비밀번호 로그인(24시간 세션), 대시보드(회원·예약·공지·칼럼 집계)
- **관리자 콘텐츠 CRUD**: 공지사항·원장 칼럼 작성/수정/삭제 (KV 저장, 코드 시드 fallback). 칼럼은 본문 단락 자동 파싱·자동 slug 생성. 모든 변경이 공개 페이지에 즉시 반영
- **예약**: 폼 → KV 저장 + Resend 이메일 알림(설정 시)
- **안내 페이지**: 미션, 오시는 길(지도/교통), 비용 안내, 통합 FAQ, 공지사항
- **SEO/AEO**: 전 페이지 메타·canonical·OG, JSON-LD(Dentist/LocalBusiness/Person/MedicalProcedure/FAQPage/BreadcrumbList/Article/City/Speakable), sitemap.xml + sitemap-encyclopedia.xml, robots.txt(AI 크롤러 허용), llms.txt / llms-full.txt
- **404**: 커스텀 페이지

## 기능 진입 URI
| 경로 | 설명 |
|---|---|
| `/` | 메인 |
| `/mission` | 병원소개·미션 |
| `/treatments` · `/treatments/:slug` | 진료 목록·상세 |
| `/doctors` · `/doctors/:slug` | 의료진 목록·상세 |
| `/cases` | 비포/애프터 (애프터는 로그인 필요) |
| `/column` · `/column/:slug` | 원장 칼럼 |
| `/encyclopedia` · `/encyclopedia/:slug` | 백과사전 (`?cat=` 필터) |
| `/area/:지역-:진료` | 지역 SEO (예: `/area/myeongji-implant`) |
| `/directions` `/pricing` `/faq` `/notice` `/reservation` | 안내 |
| `/auth/login` `/auth/register` `/auth/mypage` | 회원 |
| `/admin` `/admin/dashboard` | 관리자 로그인·대시보드 |
| `/admin/notices` `/admin/columns` | 관리자 공지·칼럼 CRUD 화면 |
| `/sitemap.xml` `/robots.txt` `/llms.txt` | SEO |
| **API (공개)** | `POST /api/auth/register` `POST /api/auth/login` `GET /api/auth/logout` `POST /api/admin/login` `POST /api/reservation` |
| **API (admin 가드)** | `POST /api/admin/notices/{create,update,delete}` · `POST /api/admin/columns/{create,update,delete}` |

## 데이터 아키텍처
- **데이터 모델**: 병원정보(clinic), 의료진(doctors), 진료+FAQ(treatments), 지역(areas), 백과사전(encyclopedia) — TypeScript 단일 진실 공급원(`src/data/`)
- **스토리지**: Cloudflare KV — 회원·예약 + 공지(`content:notices`)·칼럼(`content:columns`) JSON 저장. KV가 비면 코드 시드(`src/lib/content-store.ts`)로 fallback → 공개 페이지가 절대 깨지지 않음. 확장 시 R2(이미지/케이스), D1(조회수) 추가 가능
- **세션**: Web Crypto HMAC-SHA256 서명 토큰 → HttpOnly Secure 쿠키

## 의료광고법 컴플라이언스 (§B 필터 적용)
- 수치 자랑("15000개")·최상급("제일")·단정("무통") 표현 자동 순화
- 비급여 가격·이벤트 표현 전면 제외
- 애프터 사진 로그인 게이팅, 환자 후기 미사용
- 의료 정보 작성자/감수 표시, 결과 차이 고지문(푸터)
- 자격·경력(치의학박사, 통합치의학과 전문의, 24년)은 사실관계 원문 유지

## 사용자 가이드
1. 메인에서 핵심 진료(임플란트/투명교정/미니쉬) 또는 GNB 메가메뉴로 탐색
2. 진료 상세 → FAQ 확인 → 우측 하단 플로팅 버튼(전화/예약)으로 상담
3. 비포/애프터 애프터 사진은 회원가입·로그인 후 열람
4. 관리자는 `/admin` (기본 비밀번호: 환경변수 `ADMIN_PASSWORD`)

## 배포
- **플랫폼**: Cloudflare Pages + Workers
- **기술 스택**: Hono v4 (TS, SSR) + Vite + Vanilla JS + Tailwind CDN + Pretendard + Font Awesome
- **환경변수(Secrets)**: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SESSION_SECRET`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, (선택) `GOOGLE_CLIENT_ID/SECRET`
- **상태**: ✅ 로컬 작동 확인 (PM2 + wrangler pages dev, 전 라우트 200 / 404 정상)
- **로컬 실행**: `npm run build && pm2 start ecosystem.config.cjs` → http://localhost:3000

## 미구현 / 다음 단계
- 히어로 비주얼 실사진 적용 (현재 그라데이션+아이콘 플레이스홀더) — 신청서 제출 사진 또는 생성 이미지로 교체 예정
- 관리자 케이스(비포/애프터) CRUD — 공지·칼럼은 완료, 케이스는 동일 패턴으로 확장 예정
- Google OAuth 실연동(현재 자리표시), 조회수 실측(D1 is_bot 집계)
- IndexNow / Google Ping 자동 제출, _headers / _redirects
- 커스텀 도메인 연결 (thegooddental.kr)

## 디자인 컨셉
- **Editorial Calm 2.0** (줌클리니컬) — 따뜻한 아이볼리(#FBFAF6) + 세이지 티틸(#3A6B5E) 강조 + brass(#B08D57) 보조
- **타이포**: Newsreader(라틴) + 나눔명조(한글) 세리프 헤드라인 + Pretendard 본문
- **에디토리얼 리듬**: 섹션 인덱스 넘버(01–06)·헤어라인 디바이더·대문자 키커·스크롤 마스킹 리빌

## 최종 수정일
2026-06-04
