// ============================================================
// Medium 동적 칼럼 — @wsh216 RSS를 엣지에서 fetch → 파싱 → KV 캐싱
// 캐시 TTL: 1시간(정상). Medium 장애 시 마지막 정상 캐시로 폴백.
// → 원장님이 Medium에 새 글 올리면 최대 1시간 안에 자동 반영.
// ============================================================

export interface MediumPost {
  title: string
  link: string
  date: string // YYYY.MM.DD
  excerpt: string
  cover: string
}

const FEED_URL = 'https://medium.com/feed/@wsh216'
const KV_CACHE = 'medium:posts:v1'
const CACHE_TTL_SEC = 3600 // 1시간

// 내부 메모/한글 글 등 영어 칼럼이 아닌 항목 제외
function isEnglishColumn(title: string): boolean {
  if (!title) return false
  if (/기존 Medium|확인합니다/.test(title)) return false
  // 한글 비중이 30% 넘으면 영어 칼럼 아님
  const korean = (title.match(/[가-힣]/g) || []).length
  if (korean > title.length * 0.3) return false
  return true
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2019;/g, '\u2019')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
}

function stripTags(s: string): string {
  return decodeEntities(
    stripCdata(s)
      .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTitle(t: string): string {
  return stripTags(t).replace(/^#+\s*/, '').trim()
}

const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
}

function formatDate(pubDate: string): string {
  const m = pubDate.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/)
  if (!m) return ''
  const day = m[1].padStart(2, '0')
  return `${m[3]}.${MONTHS[m[2]] || '01'}.${day}`
}

function parseFeed(xml: string): MediumPost[] {
  const items = xml.split('<item>').slice(1)
  const posts: MediumPost[] = []

  for (const raw of items) {
    const block = raw.split('</item>')[0]

    const titleM = block.match(/<title>([\s\S]*?)<\/title>/)
    const title = cleanTitle(titleM ? titleM[1] : '')
    if (!isEnglishColumn(title)) continue

    const linkM = block.match(/<link>([\s\S]*?)<\/link>/)
    const link = (linkM ? decodeEntities(linkM[1]) : '').split('?')[0].trim()
    if (!link) continue

    const pubM = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
    const date = formatDate(pubM ? pubM[1] : '')

    const contentM = block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)
    const content = contentM ? contentM[1] : ''

    // 커버 이미지: 추적 픽셀(stat?event) 제외한 첫 cdn-images 이미지
    let cover = ''
    const imgs = content.match(/<img[^>]+src="(https:\/\/cdn-images-1\.medium\.com\/[^"]+)"/g) || []
    for (const imgTag of imgs) {
      const src = (imgTag.match(/src="([^"]+)"/) || [])[1] || ''
      if (src && !/stat\?event|freeze/.test(src)) { cover = decodeEntities(src); break }
    }

    // 발췌: 제목과 다른 첫 의미 있는 문단
    const paras = content.match(/<p[^>]*>([\s\S]*?)<\/p>/g) || []
    let excerpt = ''
    for (const p of paras) {
      const txt = stripTags(p)
      if (txt.length > 40 && txt.toLowerCase() !== title.toLowerCase()) { excerpt = txt; break }
    }
    if (!excerpt) {
      for (const p of paras) { const txt = stripTags(p); if (txt.length > 40) { excerpt = txt; break } }
    }
    if (excerpt.length > 170) excerpt = excerpt.slice(0, 170).replace(/\s+\S*$/, '') + '\u2026'

    posts.push({ title, link, date, excerpt, cover })
  }

  return posts
}

// 공개 API: KV 캐시 우선, 만료 시 재fetch, 실패 시 폴백
export async function listMediumPosts(env: any): Promise<MediumPost[]> {
  const kv = env?.KV
  let cached: { at: number; posts: MediumPost[] } | null = null

  if (kv) {
    try {
      const rawCache = await kv.get(KV_CACHE)
      if (rawCache) cached = JSON.parse(rawCache)
    } catch { /* ignore */ }
  }

  const fresh = cached && (Date.now() - cached.at) < CACHE_TTL_SEC * 1000
  if (fresh && cached) return cached.posts

  // 캐시 만료 or 없음 → 새로 fetch 시도 (8초 타임아웃 방어)
  try {
    const res = await fetch(FEED_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheGoodDentalBot/1.0; +https://thegooddc.kr)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`RSS ${res.status}`)
    const xml = await res.text()
    const posts = parseFeed(xml)
    if (posts.length && kv) {
      try {
        await kv.put(KV_CACHE, JSON.stringify({ at: Date.now(), posts }), { expirationTtl: CACHE_TTL_SEC * 24 })
      } catch { /* ignore */ }
    }
    if (posts.length) return posts
  } catch (e) {
    console.error('[medium] fetch/parse failed:', (e as Error)?.message)
  }

  // fetch 실패 → 마지막 정상 캐시(만료됐어도) 폴백
  if (cached && cached.posts.length) return cached.posts
  return []
}
