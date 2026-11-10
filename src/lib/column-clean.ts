// ============================================================
// 게시글 공개 표시용 정리 (2026-11-10) — 원고를 고치는 것이 아니라, 글에 같이 붙여 넣어진 작업 메모를 화면 단계에서 가린다.
// 운영 데이터(KV content:columns)는 건드리지 않는다. 관리자 화면은 원본 그대로 보인다(listColumns).
// 적용: listPublicColumns(목록·사이트맵·RSS·llms·관련 글)와 게시글 상세 — 본문·요약·제목·주소가 모두 이 결과를 쓴다.
//
// 가리는 것 (2026-11-10 운영 데이터 219건에서 실제로 걸리는 형태만):
//  1) 라벨 줄: 줄 시작이 '메타 디스크립션:', '메타 설명:', '메타 제목:', 'URL 슬러그(제안):', '(본문) 핵심 키워드(N개):' 인 줄
//     ('**라벨**:', '- **라벨:**' 표기 포함. 소제목 칸에 라벨만 있고 값이 아래 한 줄인 묶음 포함)
//  2) 그 묶음의 머리말: '## SEO 메타데이터', '## 메타 정보 (홈페이지 업로드용)', '## 본문', '## CTA (…)',
//     그리고 라벨 묶음 바로 앞에 한 줄로 놓인 '메타 정보' ('##' 없는 표기는 바로 뒤가 라벨 묶음일 때만)
//  3) 글 앞에 붙은 작업 기록: '콘텐츠 갭 분석합니다'로 시작해 '제목 옵션' 목록까지 이어지는 구간,
//     또는 '제목 옵션 3개' 한 줄과 바로 뒤의 '[호기심형] …' 후보 목록
//  4) 가려진 구간에 딸린 구분선(─── / ---)
//  5) 제목 앞 유형 라벨('호기심형: ' 등), 제목 끝의 짝 없는 ']'
//  6) 요약(excerpt)에 섞인 '콘텐츠 갭 분석합니다…' 이후
// 본문 중간 문장 속에 같은 낱말이 나와도(줄 시작이 아니면) 건드리지 않는다.
// ============================================================
import type { Column, ColumnBlock } from './content-store'

/** 글 id → 공개 주소(slug). 데이터의 slug 에 작업 메모가 들어간 글만. 옛 주소는 새 주소로 301 (content-store getColumnRedirect). */
export const PUBLIC_SLUG_BY_ID: Record<string, string> = {
  'c-ms6zj9ex-8efp9': '치아가-몇개-남아야', // 제목 「치아가 몇개 남아야....」 — 데이터 slug 는 '콘텐츠-갭-분석합니다-…'
}
export const publicSlugOf = (c: Pick<Column, 'id' | 'slug'>): string => PUBLIC_SLUG_BY_ID[c.id] || c.slug

const LABEL = '(?:메타\\s?(?:디스크립션|설명|제목)|URL\\s?슬러그(?:\\s?제안)?|(?:본문\\s?)?핵심\\s?키워드(?:\\s?\\d+개)?)'
const LABEL_LINE = new RegExp(`^\\s*(?:[-*•]\\s+)?(?:\\*\\*)?${LABEL}(?:\\*\\*)?\\s*[:：]`)
const LABEL_ONLY = new RegExp(`^\\s*(?:\\*\\*)?${LABEL}(?:\\*\\*)?\\s*[:：]\\s*(?:\\*\\*)?\\s*$`)
const SCAFFOLD_LINE = /^\s*#{1,3}\s*(?:SEO\s*메타\s?데이터|메타\s?정보(?:\s*\([^)]*\))?|본문|CTA(?:\s*\([^)]*\))?)\s*$/i
const BUNDLE_HEAD = /^\s*#{0,3}\s*(?:SEO\s*메타\s?데이터|메타\s?정보)(?:\s*\([^)]*\))?\s*$/i
const SEP_LINE = /^(?:[\s─━—–\-=*_]{3,}|\s*⸻+\s*)$/
const GAP_START = /^\s*콘텐츠 갭 분석합니다/
const GAP_END = /^\s*(?:글 작성합니다|제목 옵션)|\[[^\]]{1,12}형\]/
const GAP_CONT = /^\s*(?:\*\*)?(?:지금까지 다룬 홈페이지 칼럼|아직 다루지 않은 주제|선택 주제|선택 이유)/
const GAP_SCAN = 25 // 작업 기록 끝(제목 옵션)을 찾는 최대 블록 수
const TITLE_OPTS = /^\s*제목 옵션(?:\s*\d+개)?\s*[:：]?\s*$/
const TYPE_TAG = /\[[^\]]{1,12}형\]/
const QUICK = /메타|슬러그|키워드|콘텐츠 갭|제목 옵션|^\s*#{1,3}\s*(?:본문|CTA)/m

const linesOf = (s?: string) => String(s || '').split('\n').map((l) => l.trim()).filter(Boolean)
const blockText = (b: ColumnBlock) => `${b?.h || ''}\n${b?.p || ''}`
const isSep = (b: ColumnBlock) => !String(b?.h || '').trim() && !!String(b?.p || '').trim() && SEP_LINE.test(String(b?.p || ''))

/** 블록 전체가 메모(라벨 묶음·머리말)인가 */
function isMemoBlock(b: ColumnBlock): boolean {
  const h = String(b?.h || '').trim()
  const ls = linesOf(b?.p)
  if (h) {
    // 소제목 칸에 라벨만 있고 값이 아래 한 줄 / 소제목 칸이 '라벨: 값' 이고 나머지도 전부 라벨 줄
    if (LABEL_ONLY.test(h)) return ls.length <= 1
    if (LABEL_LINE.test(h)) return ls.every((l) => LABEL_LINE.test(l))
    return false
  }
  if (!ls.length) return false
  return ls.every((l) => LABEL_LINE.test(l)) || (ls.length === 1 && SCAFFOLD_LINE.test(ls[0]))
}

/** 본문 블록에서 작업 메모를 뺀 새 배열 (걸리는 것이 없으면 원본 배열 그대로 반환) */
export function cleanBody(body: ColumnBlock[]): ColumnBlock[] {
  if (!Array.isArray(body) || !body.length) return body || []
  if (!body.some((b) => QUICK.test(blockText(b)))) return body
  const n = body.length
  const drop = new Array<boolean>(n).fill(false)
  const edited: (ColumnBlock | null)[] = new Array(n).fill(null)

  // 글 앞 작업 기록: '콘텐츠 갭 분석합니다' ~ '제목 옵션' 목록(+뒤 구분선)
  for (let i = 0; i < n; i++) {
    if (!GAP_START.test(blockText(body[i]).trim())) continue
    let end = -1
    for (let j = i + 1; j < Math.min(n, i + 1 + GAP_SCAN); j++) if (GAP_END.test(String(body[j].h || '')) || GAP_END.test(String(body[j].p || ''))) end = j
    if (end < 0) { end = i; while (end + 1 < n && GAP_CONT.test(blockText(body[end + 1]).trim())) end++ }
    for (let j = i; j <= end; j++) drop[j] = true
    i = end
  }

  // '제목 옵션 N개' 한 줄 + 바로 뒤 후보 목록([○○형] 표기가 있는 블록, 최대 3개)
  for (let i = 0; i < n; i++) {
    if (drop[i] || String(body[i]?.h || '').trim()) continue
    const ls = linesOf(body[i]?.p)
    if (ls.length !== 1 || !TITLE_OPTS.test(ls[0])) continue
    drop[i] = true
    for (let j = i + 1; j < n && j <= i + 3 && TYPE_TAG.test(blockText(body[j])); j++) drop[j] = true
  }

  for (let i = 0; i < n; i++) {
    if (drop[i]) continue
    const b = body[i]
    if (isMemoBlock(b)) { drop[i] = true; continue }
    // 일반 블록 안에 섞인 라벨 줄만 뺀다 (소제목은 그대로)
    const raw = String(b?.p || '').split('\n')
    if (raw.some((l) => LABEL_LINE.test(l))) {
      const kept = raw.filter((l) => !LABEL_LINE.test(l)).join('\n').trim()
      if (!kept && !String(b?.h || '').trim()) drop[i] = true
      else edited[i] = { ...b, p: kept }
    }
  }
  if (!drop.some(Boolean) && !edited.some(Boolean)) return body

  // 라벨 묶음 바로 앞의 머리말 한 줄('메타 정보' 등)
  for (let i = n - 2; i >= 0; i--) {
    if (drop[i] || String(body[i]?.h || '').trim()) continue
    const ls = linesOf(body[i]?.p)
    if (ls.length !== 1 || !BUNDLE_HEAD.test(ls[0])) continue
    let z = i + 1; while (z < n && isSep(body[z]) && !drop[z]) z++
    if (z < n && drop[z]) drop[i] = true
  }

  // 가려진 구간에 딸린 구분선: 구간 사이, 글 끝 구간 바로 앞, 글 첫머리 구간 바로 뒤
  for (let i = 0; i < n; i++) {
    if (!isSep(body[i]) || drop[i]) continue
    let a = i - 1; while (a >= 0 && isSep(body[a]) && !drop[a]) a--
    let z = i + 1; while (z < n && isSep(body[z]) && !drop[z]) z++
    const prevDropped = a >= 0 && drop[a], nextDropped = z < n && drop[z]
    const restAllDropped = (from: number) => { for (let k = from; k < n; k++) if (!drop[k] && !isSep(body[k])) return false; return true }
    const headAllDropped = (to: number) => { for (let k = 0; k <= to; k++) if (!drop[k] && !isSep(body[k])) return false; return true }
    if ((prevDropped && nextDropped) || (nextDropped && restAllDropped(z)) || (prevDropped && headAllDropped(a))) drop[i] = true
  }
  return body.map((b, i) => edited[i] || b).filter((_, i) => !drop[i])
}

/** 요약: '콘텐츠 갭 분석합니다…' 이후를 잘라낸다. 문장 중간에서 끊기면 말줄임표 */
export function cleanExcerpt(s?: string | null): string {
  const src = String(s || '')
  const i = src.indexOf('콘텐츠 갭 분석합니다')
  if (i < 0) return src
  const head = src.slice(0, i).trim()
  return !head || /[.!?…。”"’')\]]$/.test(head) ? head : `${head}…`
}

const TITLE_TYPE_PREFIX = /^\s*(?:\[\s*(?:호기심|직접\s?정보|정보|반직관|안심|반직관\s?\/\s?안심|공감|질문)형\s*\]\s*[:：]?|(?:호기심|직접\s?정보|정보|반직관|안심|반직관\s?\/\s?안심|공감|질문)형\s*[:：])\s*/
/** 제목: 앞의 유형 라벨('호기심형: '), 끝의 짝 없는 ']' 제거 */
export function cleanTitle(s?: string | null): string {
  let t = String(s || '').replace(TITLE_TYPE_PREFIX, '')
  if (/\]\s*$/.test(t) && (t.match(/\[/g) || []).length < (t.match(/\]/g) || []).length) t = t.replace(/\]\s*$/, '')
  return t.trim() || String(s || '')
}

/** 공개 표시용 글 (원본 객체는 그대로 두고 새 객체 반환) */
export function publicColumn<T extends Column>(c: T): T {
  const slug = publicSlugOf(c)
  const title = cleanTitle(c.title)
  const excerpt = cleanExcerpt(c.excerpt)
  const body = cleanBody(c.body)
  if (slug === c.slug && title === c.title && excerpt === (c.excerpt || '') && body === c.body) return c
  // dataSlug: 주소를 코드 매핑으로 바꾼 글의 원래 slug — slug 로 문구를 고르는 곳(지역 안내 한 줄)이 예전과 같은 문구를 내도록
  return { ...c, slug, title, excerpt, body, ...(slug !== c.slug ? { dataSlug: c.slug } : {}) }
}
