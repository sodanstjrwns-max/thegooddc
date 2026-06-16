# 더착한치과 (The Good Dental Clinic)

부산 강서구 명지 · 통합치의학과 전문의 치과 — 하이엔드 인터랙티브 풀스택 홈페이지

## 프로젝트 개요
- **병원명**: 더착한치과 (대표원장 황우석 / 치의학박사 · 통합치의학과 전문의)
- **목표**: bdbddc.com(서울비디치과)급 SEO·퍼널·인링크 골격을 복제하되, 디자인은 신청서(Q24 따뜻하고 친근한 / Q25 블루) 기반으로 독창적으로 구현
- **미션**: "치과 통증의 두려움을 안심으로 바꾸겠습니다"
- **핵심 진료 TOP3**: 디지털 가이드 임플란트 · 투명교정 · 미니쉬(라미네이트)

## ✅ 완료된 기능
- **🏎️ 부가티급 SEO·AEO + 진료안내 볼륨 슈퍼 업글 (최신)**: ①**코어 진료 3종**(임플란트·투명교정·미니쉬) 볼륨 대확장 — 직답 Q&A 4개, 본문 섹션 6개, 비교표, **적응증(이런 분께 권합니다)·진료 과정(HowTo 타임라인)·주의사항·회복관리** 임상 메타 신설 ②핵심 일반진료 5종(충치·보철·교정·치주·사랑니)에도 임상 메타(적응증/주의/회복) 보강 ③신규 JSON-LD **MedicalWebPage**(의료 E-E-A-T: 검토 주체·검토일 `lastReviewed`)·**MedicalProcedure indication**(적응증)·**ItemList**(세부진료) 추가 → 진료 상세 1페이지에 **JSON-LD 13블록/14타입** 동시 노출(전부 파싱 유효) ④`/seo-health` 자가진단 확장 — 신규 6개 필수 체크 추가(핵심 진료 볼륨, 진료상세 MedicalWebPage/적응증/HowTo/임상섹션 라이브) → **필수 35/35, 권장 2/2, 100점**. 전부 의료광고법 준수(최상급·단정 배제, "개인차 있음")
- **📚 백과사전 FAQ 완비**: 누락 159개 용어 FAQ 수기 작성(`encyclopedia-faq.ts`, 외부 API 미사용) → 머지 후 전 용어 **200/200 FAQ** 보유
- **🆕 1차 SEO·기능 대확장 (8종)**: ①백과사전 **508개**로 증설 ②FAQ **과목당 20개 × 12과목 = 240개** (전부 의료광고법 안전 톤) ③**자동 인링크 엔진**(`src/lib/inlink.tsx`) — 핵심 용어 20개 기반, 진료 상세 본문·칼럼 본문에서 백과사전으로 자동 링크(블록당 최대 3개, 자기 페이지 제외) ④**R2 케이스 사진 4장 업로드** — 파노라마 전/후 + 구내 전/후, 관리자 드래그앤드롭 업로드, 미업로드 사진 자동 숨김, **애프터 사진은 파일 서빙 레이어에서 로그인 게이팅**(`/files/cases-after/*` 비회원 403 — 의료법) ⑤**지역 주소 자동완성** — 부산·경남 생활권 ~100개 동 데이터, 케이스 폼 입력 시 드롭다운 ⑥**블로그 에디터** — H2/H3/굵게/목록 툴바 + 다중 사진 드래그앤드롭 R2 업로드 + 작성자 선택 + 공개 페이지 리치 렌더러(RichBody) ⑦**관리자 회원 목록**(`/admin/members`, 마케팅 동의 배지) + **예약 관리**(`/admin/reservations`) ⑧**게시물 조회수** — KV 카운터, 칼럼 상세 표시 + 관리자 목록 집계
- **🆕 2차 설문(HWPX) 반영**: ①원장 약력 사실관계 보강(부산대 치의학박사·구강생화학교실, 최소침습·최소절개 철학) ②"믿음직한 장인" 톤으로 원장 소개·태그라인 재작성 ③임플란트 상세에 "AI가 제안하고 의사가 결정합니다" 섹션(좁은 부위·신경관 인접 접근, 절개 최소화→붓기 감소) ④환자 스토리 칼럼 3편(20년 틀니→AI 가이드 / 위치·간격의 중요성=저가 재수술 교훈 / 치과공포 극복) — 모두 의료법 안전 형식(개인차 고지 포함) ⑤케이스 시드 1건 추가
- **🆕 페이블 레이어(스토리텔링)**: 홈 환자 1인칭 여정 스크롤텔링 5장(Ⅰ두려움→Ⅱ안내자→Ⅲ계획→Ⅳ안심→Ⅴ소개, 스크롤 연동 스파인 진행선) + 페이션트 퍼널 10단계 인터랙티브 스토리맵(내원 전/내원/내원 후 필터 탭) + 전체 12개 진료 상세에 3막 우화 도입부(고민→계획→달라진 일상) + 서사형 CTA 마이크로카피("첫 걸음 내딛기"/"먼저 이야기 듣기"/"모든 이야기에는 첫 문장이 필요합니다"). 단일 진실 공급원 `src/data/story.ts`, 의료광고법 §B 필터 유지
- **메인 페이지**: 풀스크린 히어로, 스크롤 reveal/패럴랙스, 숫자 카운트업, 환자 퍼널 시각화
- **진료 페이지**: 핵심3 상세(직답 Q&A 4개·본문 6섹션·비교표·적응증·진료과정·주의사항·회복관리, 2,500자+) + 전체 10개 과목(직답 3·섹션 5·세부시술·비교표, 핵심 5과목은 임상 메타 보강). 본문은 데이터(`treatments.ts`) 드리븐 — TOC·HowTo·스키마 자동 생성
- **의료진**: 목록 + 개별 SSR 프로필(학력·경력 사실관계 원문, 진료 인링크)
- **비포/애프터**: 슬라이더 비교, 애프터 사진 로그인 게이팅(의료법), 진료·원장·지역 양방향 인링크
- **원장 칼럼**: SSR 칼럼 + Article/MedicalWebPage 스키마 + 관련 진료·의료진 인링크
- **백과사전**: 393개 용어(이 중 **상세 200개**는 각 약 1000자 본문 + 직답형 정의 + FAQ + 관련 진료 인링크), 카테고리 필터, 진료 자동 인링크. 상세 용어는 `DefinedTerm`·`FAQPage` 스키마로 AI검색(AEO) 최적화, 목록에서 "상세" 배지 우선 노출
- **🏎️ 부가티급 지역 SEO**: **12개 지역**(사상·김해·진해 추가) 각각 **고유 콘텐츠**(랜드마크·교통·본원까지 거리/시간·생활권 특성·지역 FAQ·소개 본문) 보유 → thin-content 0. **지역 허브 랜딩 페이지** `/clinic/[지역]`(12개) — 한 지역의 모든 진료를 묶는 권위 페이지에 `LocalBusiness(#localclinic)`·`CollectionPage`·`GeoCircle(서비스반경 20km)`·`City+AdministrativeArea+Landmarks` 스키마. **지역×진료** `/area/[지역]-[진료]`(48개)는 지역 고유 소개·교통·진료시간 직답 + **인링크 메시**(같은 지역 다른 진료 ↔ 인근 지역 동일 진료). 합계 **60개 지역 페이지**(sitemap-areas), 푸터·llms.txt 지역 링크 노출
- **인증**: 회원가입/로그인(HMAC 세션, HttpOnly Secure 쿠키 30일), 마이페이지
- **관리자**: 비밀번호 로그인(24시간 세션), 대시보드(회원·예약·공지·칼럼·케이스 집계)
- **관리자 콘텐츠 CRUD**: 공지사항·원장 칼럼·비포/애프터 케이스 작성/수정/삭제 (KV 저장, 코드 시드 fallback). 칼럼은 본문 단락 자동 파싱·자동 slug 생성. 케이스는 사진 없이 텍스트 메타데이터(진료분야·의료진·연령·성별·지역·기간·설명)만 관리(사진은 의료법 게이팅으로 추후). 모든 변경이 공개 페이지에 즉시 반영
- **예약**: 폼 → KV 저장 + Resend 이메일 알림(설정 시)
- **안내 페이지**: 미션, 오시는 길(지도/교통), 비용 안내, 통합 FAQ, 공지사항
- **🚀 SEO·AEO 슈퍼머신**: 전 페이지 메타·canonical·OG, **JSON-LD 22종**(Dentist/MedicalOrganization/Person/MedicalProcedure(+임상 메타 강화판)/FAQPage/QAPage/HowTo/BreadcrumbList/Article/City/Speakable/**WebSite+SearchAction**/**MedicalClinic(NAP·@id)**/AggregateRating/Review/ImageObject/DefinedTerm 등) — `medicalClinicSchema`·`webSiteSchema`를 Layout 전역에 주입해 모든 페이지가 병원 NAP·검색박스 구조화. **sitemap-index 패턴**(`/sitemap.xml` → main·treatments·content·encyclopedia·areas 5분할, 칼럼/공지 KV 동적 포함), robots.txt(AI 크롤러 10종 허용 + admin/api/seo-health 차단), **llms.txt(2.2만자: 백과사전 200·의료진·진료 전체) / llms-full.txt(14만자: 상세 용어 본문 임베드)**, IndexNow, **`.aeo-answer`·`.aeo-tldr` 직답 블록**(진료·지역 페이지), **`/seo-health` 자가진단 엔드포인트**(필수 23항목 자동 점검, `?format=html` 리포트) — 현재 **100점**
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
| `/clinic/:지역` | 지역 허브 랜딩 (예: `/clinic/myeongji` 명지 치과, 12개) |
| `/area/:지역-:진료` | 지역×진료 SEO (예: `/area/myeongji-implant`, 48개) |
| `/directions` `/pricing` `/faq` `/notice` `/reservation` | 안내 |
| `/auth/login` `/auth/register` `/auth/mypage` | 회원 |
| `/admin` `/admin/dashboard` | 관리자 로그인·대시보드 |
| `/admin/notices` `/admin/columns` `/admin/cases` | 관리자 공지·칼럼·케이스 CRUD (칼럼: 에디터 툴바+드래그앤드롭 / 케이스: 사진 4장+지역 자동완성) |
| `/admin/members` `/admin/reservations` | 관리자 회원 목록 · 예약 관리 |
| `/files/*` | R2 파일 서빙 (`cases-after/*`는 로그인 필요 — 의료법 게이팅) |
| `/sitemap.xml`(인덱스) `/sitemap-{main,treatments,content,encyclopedia,areas}.xml` | 분할 사이트맵 |
| `/robots.txt` `/llms.txt` `/llms-full.txt` | SEO·AEO 자산 |
| `/seo-health` (`?format=html`) | SEO·AEO 자가진단 (noindex, 필수 23항목 100점) |
| **API (공개)** | `POST /api/auth/register` `POST /api/auth/login` `GET /api/auth/logout` `POST /api/admin/login` `POST /api/reservation` |
| **API (admin 가드)** | `POST /api/admin/notices/{create,update,delete}` · `POST /api/admin/columns/{create,update,delete}` · `POST /api/admin/cases/{create,update,delete}` · `POST /api/admin/upload`(R2 이미지, 8MB) · `POST /api/admin/indexnow`(검색엔진 핑) |
| **API (공개 보조)** | `GET /api/regions?q=` 지역 자동완성 |

## 데이터 아키텍처
- **데이터 모델**: 병원정보(clinic), 의료진(doctors), 진료+FAQ(treatments), 지역(areas), 백과사전(encyclopedia) — TypeScript 단일 진실 공급원(`src/data/`)
- **스토리지**: Cloudflare KV — 회원(`user:*`)·예약(`reservation:*`)·조회수(`views:*`) + 공지(`content:notices`)·칼럼(`content:columns`)·케이스(`content:cases`) JSON 저장. KV가 비면 코드 시드(`src/lib/content-store.ts`)로 fallback → 공개 페이지가 절대 깨지지 않음. **Cloudflare R2**(바인딩 `R2`, 버킷 `thegooddental-media`) — 케이스 사진(`cases-after/` 게이팅) + 블로그 이미지(`media/` 공개 캡시)
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
- **플랫폼**: Cloudflare Pages + Workers (원장님 본인 CF 계정: sodanstjrwns@gmail.com)
- **프로덕션 URL**: https://thegooddental.pages.dev
- **CF 프로젝트명**: `thegooddental`
- **기술 스택**: Hono v4 (TS, SSR) + Vite + Vanilla JS + Tailwind CDN + Pretendard + Font Awesome
- **바인딩**: KV `4b7e7d15ad334a01a7c162043a51bec2` (회원·예약·콘텐츠·조회수) / R2 `thegooddental-media` (사진)
- **환경변수(Secrets, 설정완료)**: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SESSION_SECRET` · (미설정) `RESEND_API_KEY`, `NOTIFICATION_EMAIL`(예약 이메일 알림용)
- **상태**: ✅ 실배포 완료 — KV 작동 검증(회원가입/예약 ok), 관리자 로그인 검증, 전 라우트 200, 이탤릭 0·"무통" 0(의료광고법 안전), OG·파비콘 라이브
- **GitHub 저장소**: https://github.com/sodanstjrwns-max/thegooddc (branch `main`)
- **재배포(현재 운영 방식)**: AI 에이전트가 코드 변경 시 `npm run build && npx wrangler pages deploy dist --project-name thegooddental --branch main`로 즉시 라이브 반영
- **로컬 실행**: `npm run build && pm2 start ecosystem.config.cjs` → http://localhost:3000

### 🔁 영구 자동배포 켜는 법 (원장님 클릭 1회면 끝, 둘 중 택1)
> 참고: GitHub App 보안정책상 봇(에이전트)은 `.github/workflows/` 파일을 push할 수 없어
> 이 마지막 한 단계만 사람 손이 필요합니다. 그 전까지는 에이전트가 직접 배포로 빈틈없이 메꿉니다.

**방법 A — Cloudflare가 GitHub 직접 감시 (추천 · 제일 쉬움)**
1. https://dash.cloudflare.com → **Workers & Pages → `thegooddental`**
2. **Settings → Builds & deployments → Connect to Git**
3. 저장소 `sodanstjrwns-max/thegooddc` 선택, branch `main`
4. Build command: `npm run build` / Output directory: `dist`
→ 이후 push만 하면 CF가 알아서 빌드·배포. 워크플로 파일·비밀키 불필요.

**방법 B — GitHub Actions (워크플로 파일은 이미 준비됨: `.deploy-templates/deploy.yml`)**
1. GitHub 저장소 → **Add file → Create new file** → 파일명에 `.github/workflows/deploy.yml` 입력
2. `.deploy-templates/deploy.yml` 내용 복붙 → Commit
3. 저장소 **Settings → Secrets and variables → Actions**에 추가:
   - `CLOUDFLARE_API_TOKEN` (CF API 토큰)
   - `CLOUDFLARE_ACCOUNT_ID` = `62bec8960d128134b71384fc82cc0d5e`

### 🌐 커스텀 도메인 thegooddc.kr (CF 세팅 완료, 네임서버만 변경하면 자동 활성)
- CF 존·DNS(CNAME @/www)·Pages 도메인 연결 **전부 완료**, 상태 `pending`(네임서버 대기)
- **원장님 1회 작업**: 도메인 산 곳(가비아/후이즈 등) 로그인 → 네임서버를 아래로 변경
  - `alan.ns.cloudflare.com`
  - `samara.ns.cloudflare.com`
- 변경 후 수십분~수시간 내 자동으로 `active` 전환 → https://thegooddc.kr 라이브

## 원장님이 주셔야 채울 수 있는 실데이터 (현재 빈 값은 화면에서 자동 숨김 처리됨)
- 사업자등록번호(`businessRegNo`), 요양기관기호(선택)
- SNS 주소(인스타/블로그/유튜브/카카오 — 푸터 아이콘에 자동 노출)
- Google Analytics 4 측정 ID(`G-XXXX`), GTM ID(선택)
- 로고·원장·원내 실사진, 비포/애프터 실제 케이스 사진
- (예약 이메일 알림 원하면) `RESEND_API_KEY`, `NOTIFICATION_EMAIL`

## 미구현 / 다음 단계 (선택)
- 히어로 비주얼 실사진 적용 — 로고·원장 사진·원내 사진 수령 시
- 케이스 실사진 업로드(기능은 완성, 실제 사진 데이터만 필요)
- Google OAuth 실연동(현재 자리표시), 공지·케이스 상세형 조회수 확장(현재 칼럼 적용)

## 디자인 컨셉
- **"따뜻한 종이 위의 신뢰 블루" (Warm Paper × Trust Blue)** — 원장 설문 직접 반영: Q24 따뜻하고 친근한 + Q25 블루 + 믿음직한 장인 톤
- **컬러**: 웜 아이보리 종이(#FBFAF6) 바탕 + 트러스트 블루(#1E6FB8 / 딥 #114A7E / 라이트 #4A95D6) 액센트 + 웜 브라스(#B08D57) 보조 + 프레시 틸(#2DD4BF, 다크 스테이지 글로우 전용)
- **잉크**: 네이비 니어블랙(#1A222E) — 신뢰 컬러로 통일, 다크 스테이지는 딥 네이비(#152333)
- **시그니처 디테일**: 블루 그라디언트 버튼(깊이감) · 히어로 accent-word 손그림 밑줄 · 블루→틸 스크롤 프로그레스/퍼블 스파인 · 네이비+블루 듀얼 글로우 히어로 프레임
- **벡터 모션 그래픽** (src/components/vectors.tsx): ① 히어로 치아 블루프린트 SVG — 스트로크 드로잉(2.6s)→부유, 오빗 링 역방향 회전, 크로스헤어 호흡, 식립 타깃 펄스, 스캔라인 스윕, 데이터포인트 순차 블링크 ② CTA 여정 별자리 — 패스 따라 트래블링 글로우 도트(SMIL animateMotion)+노드 트윙클 ③ 퍼널 연결선 대시 흐름 ④ 페이블 스파인 글로우 헤드 — 전부 reduced-motion 대응
- **타이포**: Newsreader(라틴) + 나눔명조(한글) 세리프 헤드라인 + Pretendard 본문
- **에디토리얼 리듬**: 섹션 인덱스 넘버(01–06)·헤어라인 디바이더·대문자 키커·스크롤 마스킹 리빌

## 최종 수정일
2026-06-15 (🏎️ 부가티급 지역 SEO: 12개 지역 고유 콘텐츠·지역 허브 `/clinic/:area`(LocalBusiness/CollectionPage/GeoCircle/Landmarks)·지역×진료 48개 인링크 메시·총 60개 지역 페이지·푸터/llms 지역 링크 / seo-health 필수 29/29 100점)
2026-06-15 (🚀 SEO·AEO 슈퍼머신: JSON-LD 22종·전역 WebSite/MedicalClinic 주입·sitemap-index 5분할·llms.txt 2.2만자/llms-full 14만자·진료/지역 직답 블록·QAPage/HowTo/procedureRich·`/seo-health` 자가진단 100점)
2026-06-14 (실배포 검증 완료: 이탤릭 0·"무통" 0·OG/파비콘 라이브·전 라우트 200·회원가입/예약/관리자 API 검증 / 자동배포 가이드 A·B 완비 / thegooddc.kr 도메인 CF세팅 완료·네임서버 대기)
2026-06-15 (백과사전 상세 용어 200개 완성 — 각 약 1000자 본문 + FAQ + DefinedTerm/FAQPage 스키마, thin-content 대체로 AEO 강화)
2026-06-13 (1차 SEO·기능 대확장: 백과사전 508·FAQ 240·인링크 엔진·R2 사진·지역 자동완성·블로그 에디터·회원/예약 관리·조회수)
