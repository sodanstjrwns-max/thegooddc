// 진료 페이지 최종 검토일(고정값). vite.config.ts 가 빌드 시 src/data/treatments.ts 의
// 마지막 커밋 날짜를 __TX_CONTENT_DATE__ 로 주입한다. 없으면 폴백(2026-09-29 기준 커밋 날짜).
// 스키마 lastReviewed/dateModified 와 화면 '최종 검토' 표기가 같은 값을 쓴다.
declare const __TX_CONTENT_DATE__: string | undefined
const injected = typeof __TX_CONTENT_DATE__ !== 'undefined' ? __TX_CONTENT_DATE__ : ''
export const TX_REVIEWED = /^\d{4}-\d{2}-\d{2}$/.test(injected) ? injected : '2026-08-18'

// ============================================================
// 사이트맵 lastmod · llms 최종 갱신용 콘텐츠 실제 수정일 (2026-09-29)
// 값 = 본문 줄을 마지막으로 바꾼 커밋 날짜(KST). scripts/content-dates.mjs 가 git blame 으로 산출해
// vite.config.ts 가 빌드 시 __CONTENT_DATES__ 로 주입. 얕은 클론·git 없음 → content-dates.fallback.json.
// ※ 예전엔 사이트맵이 new Date()(매일 오늘)를 찍었다. 날짜를 모르면 lastmod 를 생략한다.
// ============================================================
import FALLBACK from './content-dates.fallback.json'

export type ContentDates = {
  pages: Record<'home' | 'mission' | 'directions' | 'faq' | 'pricing' | 'reservation' | 'doctorsList' | 'areaTemplate' | 'areaHubTemplate' | 'encFallback', string>
  doctors: Record<string, string>
  areas: Record<string, string>
  encyclopedia: Record<string, string>
}
declare const __CONTENT_DATES__: ContentDates | null
export const CONTENT_DATES: ContentDates =
  (typeof __CONTENT_DATES__ !== 'undefined' && __CONTENT_DATES__ && __CONTENT_DATES__.pages ? __CONTENT_DATES__ : null) ||
  (FALLBACK as ContentDates)

const YMD = /^\d{4}-\d{2}-\d{2}$/
/** 'YYYY-MM-DD…' 문자열 → 앞 10자, 없음·무효 → '' (오늘로 대체하지 않음) */
export function toYmd(v: unknown): string {
  const d = typeof v === 'string' ? v.trim().slice(0, 10) : ''
  return YMD.test(d) && !Number.isNaN(Date.parse(d)) ? d : ''
}
/** 날짜 목록 중 가장 최근 YYYY-MM-DD (없으면 '') */
export function latestDate(...ds: unknown[]): string {
  return (ds as any[]).flat(2).map(toYmd).filter(Boolean).sort().pop() || ''
}
