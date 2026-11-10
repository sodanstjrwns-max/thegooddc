// ============================================================
// 구글 전용 검색 제외 (2026-11-10)
//
// 배경: 구글이 이 사이트를 사이트 단위로 판정해 홈 한 장만 색인하고 있다(직접 조치·기술 오류 없음,
//   백과·지역 조합을 대량 공개한 뒤 2~3일 만에 전체 탈락). 방문의 대부분은 네이버에서 오고 그 대부분이
//   백과·용어 페이지로 들어온다. 그래서 대량 생성 구역을 "구글에만" 검색 제외해, 구글이 보는 사이트를
//   병원 핵심 페이지로 줄여 재평가를 받는다.
//
// 방식: 요청 User-Agent 가 구글 크롤러(Googlebot·Google-InspectionTool)이고 경로가 아래 대상일 때만
//   200 HTML 응답에 `X-Robots-Tag: googlebot: noindex` 헤더를 붙인다(src/index.tsx 맨 바깥 미들웨어).
//   - 네이버(Yeti)·Bing·일반 방문자·AI 봇 응답은 헤더와 본문이 그대로다.
//   - HTML 메타 태그·robots.txt·sitemap·canonical·본문·스키마는 건드리지 않는다.
//   - 301·404 등 200 이 아닌 응답에는 붙이지 않는다.
//   - 이미 X-Robots-Tag 가 있는 응답(얇은 용어의 noindex, follow 등)은 구글 크롤러에게만 이 값으로 바꾼다.
//
// 대상(구글에만 가린다):
//   - /encyclopedia, /encyclopedia/* : 백과사전 목록과 용어 전체
//   - /area/* : 지역×진료 조합 (명지 고유 본문 2쪽 KEEP_AREA_PATHS 는 남긴다)
//   - /clinic/* : 지역 허브 (병원 소재지 허브 /clinic/myeongji 는 남긴다)
//   - 코드 시드 글(레포 SEED_COLUMNS 배열에서 나온 대행사 투입 글, lib/authorship.ts 의 c-seed-1~5 등)
// 남긴다: 홈, 진료, 의료진, 비용, 병원 소개, 오시는 길, 예약, FAQ, 공지, 진료 사례,
//   병원이 관리자 화면에서 올린 칼럼·후기·이야기 글(KV), /clinic/myeongji, 명지 고유 본문 2쪽.
//
// 되돌리는 방법: isGoogleHiddenPath 가 항상 false 를 돌려주게 하면 끝난다(다른 곳은 손댈 필요 없음).
// ============================================================
import { SEED_COLUMNS, BOARDS } from './content-store'
import { isAgencyColumn } from './authorship'

export const GOOGLE_HIDE_HEADER = 'googlebot: noindex'

/** 구글 검색 크롤러인가 — Googlebot(이미지·뉴스 등 변형 포함)·Google-InspectionTool. GoogleOther·AdsBot·Mediapartners·Google-Extended 는 아니다. */
export function isGoogleCrawler(ua: string | null | undefined): boolean {
  return /googlebot|google-inspectiontool/i.test(ua || '')
}

/** 지역 구역에서 남기는 주소: 병원 소재지(명지) 허브와 명지 고유 본문 2쪽(src/routes/myeongji-extra.tsx) */
const KEEP_CLINIC_PATHS = new Set<string>(['/clinic/myeongji'])
const KEEP_AREA_PATHS = new Set<string>(['/area/myeongji-conservative', '/area/myeongji-periodontics'])

/** 코드 시드 글 주소 — 레포 배열(SEED_COLUMNS)에서 나온 대행사 투입 글만. 병원이 관리자에서 올린 글은 해당 없음 */
const SEED_POST_PATHS = new Set<string>(
  SEED_COLUMNS.filter(isAgencyColumn).map((c) => `${BOARDS[c.board || 'column'].path}/${c.slug}`),
)

/** 구글에만 검색 제외할 경로인가 (pathname 기준, 쿼리 제외) */
export function isGoogleHiddenPath(path: string): boolean {
  if (path === '/encyclopedia' || path.startsWith('/encyclopedia/')) return true
  if (path.startsWith('/area/')) return !KEEP_AREA_PATHS.has(path)
  if (path.startsWith('/clinic/')) return !KEEP_CLINIC_PATHS.has(path)
  if (SEED_POST_PATHS.has(path)) return true
  return false
}
