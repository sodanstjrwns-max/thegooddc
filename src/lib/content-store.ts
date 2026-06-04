// ============================================================
// Content Store — KV 기반 공지/칼럼 CRUD (코드 시드 fallback)
// KV가 비어있으면 시드 데이터를 반환하고, admin이 처음 저장하면
// KV가 source of truth가 된다. → 공개 페이지가 절대 깨지지 않음.
// ============================================================

export interface Notice {
  id: string
  title: string
  body: string
  pinned: boolean
  date: string // YYYY-MM-DD
  modified: string
}

export interface ColumnBlock {
  h: string
  p: string
}

export interface Column {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string // YYYY-MM-DD
  modified: string
  author: string // doctor id
  related: string // treatment slug
  body: ColumnBlock[]
}

const KV_NOTICES = 'content:notices'
const KV_COLUMNS = 'content:columns'

// ---------- 시드 데이터 (KV가 비었을 때 fallback) ----------
export const SEED_NOTICES: Notice[] = [
  { id: 'n-seed-1', pinned: true, date: '2026-05-25', modified: '2026-05-25', title: '6월 5일~6일 휴진 안내', body: '6월 5일(금)부터 6일(토)까지 휴진합니다. 진료 예약에 참고 부탁드립니다.' },
  { id: 'n-seed-2', pinned: false, date: '2026-05-01', modified: '2026-05-01', title: '수요일·월요일 야간진료 안내', body: '월요일과 수요일은 오후 8시까지 야간진료를 운영합니다.' },
  { id: 'n-seed-3', pinned: false, date: '2026-04-10', modified: '2026-04-10', title: '디지털 가이드 임플란트 시스템 도입', body: '보다 정밀한 진료를 위해 AI 기반 디지털 가이드 임플란트 시스템을 운영하고 있습니다.' },
]

export const SEED_COLUMNS: Column[] = [
  {
    id: 'c-seed-1',
    slug: 'why-digital-implant',
    title: '디지털 가이드 임플란트, 왜 정확할까요?',
    excerpt: '3D CT와 구강 스캐너로 식립 위치를 미리 설계하는 디지털 가이드 임플란트의 원리를 쉽게 설명합니다.',
    date: '2026-05-20',
    modified: '2026-05-20',
    author: 'hwang-wooseok',
    related: 'implant',
    body: [
      { h: '임플란트의 정확도는 어디서 결정될까요?', p: '임플란트는 잇몸뼈 속 신경과 혈관을 피해 가장 안정적인 위치에 식립하는 정밀한 작업입니다. 식립 위치가 조금만 달라져도 결과에 영향을 줄 수 있기 때문에, 사전 설계가 매우 중요합니다.' },
      { h: '디지털 가이드가 하는 일', p: '디지털 가이드 임플란트는 3D CT와 구강 스캔 데이터를 컴퓨터에서 분석해 식립 위치·깊이·각도를 미리 설계합니다. 그리고 그 설계대로 제작한 수술용 가이드를 사용하기 때문에, 계획한 위치에 정밀하게 식립할 수 있습니다.' },
      { h: '환자에게 어떤 점이 좋을까요?', p: '사전 설계를 통해 시술 과정의 변수를 줄이고, 보다 예측 가능한 진료가 가능합니다. 더착한치과는 원내 기공실과 결합해 진단부터 보철까지 효율적으로 진행합니다.' },
    ],
  },
  {
    id: 'c-seed-2',
    slug: 'clear-aligner-tips',
    title: '투명교정, 결과를 좌우하는 착용 습관',
    excerpt: '투명교정은 장치를 빼고 낄 수 있는 만큼, 착용 습관이 결과에 큰 영향을 줍니다. 핵심 관리법을 안내합니다.',
    date: '2026-05-12',
    modified: '2026-05-12',
    author: 'hwang-wooseok',
    related: 'clear-aligner',
    body: [
      { h: '투명교정의 장점과 책임', p: '투명교정은 눈에 잘 띄지 않고 식사·양치 시 분리할 수 있어 편리합니다. 다만 그만큼 정해진 시간을 꾸준히 착용하는 자기 관리가 결과에 중요합니다.' },
      { h: '권장 착용 시간', p: '일반적으로 식사와 양치 시간을 제외하고 하루 대부분 착용하는 것이 권장됩니다. 착용 시간이 부족하면 계획한 치아 이동이 늦어질 수 있습니다.' },
      { h: '관리 팁', p: '장치를 뺀 뒤에는 청결하게 보관하고, 식사 후 양치를 한 뒤 다시 착용하는 습관을 들이는 것이 좋습니다.' },
    ],
  },
]

// ---------- KV helpers ----------
function getKV(env: any): KVNamespace | null {
  return env?.KV ?? null
}

async function readList<T>(env: any, key: string, seed: T[]): Promise<T[]> {
  const kv = getKV(env)
  if (!kv) return seed // 로컬에서 KV 미바인딩 시에도 시드로 동작
  try {
    const raw = await kv.get(key)
    if (!raw) return seed
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : seed
  } catch {
    return seed
  }
}

async function writeList<T>(env: any, key: string, list: T[]): Promise<boolean> {
  const kv = getKV(env)
  if (!kv) return false
  await kv.put(key, JSON.stringify(list))
  return true
}

// ---------- id / slug 유틸 ----------
function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
function today(): string {
  return new Date().toISOString().slice(0, 10)
}
function slugify(s: string): string {
  const base = (s || '').toString().trim().toLowerCase()
    .replace(/[^\w가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
  return base || `post-${Date.now().toString(36)}`
}

// ============================================================
// NOTICES
// ============================================================
export async function listNotices(env: any): Promise<Notice[]> {
  const list = await readList<Notice>(env, KV_NOTICES, SEED_NOTICES)
  // 고정 글 먼저, 그다음 날짜 내림차순
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return (b.date || '').localeCompare(a.date || '')
  })
}

export async function createNotice(env: any, input: Partial<Notice>): Promise<Notice> {
  const list = await readList<Notice>(env, KV_NOTICES, SEED_NOTICES)
  const n: Notice = {
    id: newId('n'),
    title: (input.title || '제목 없음').toString().trim(),
    body: (input.body || '').toString().trim(),
    pinned: !!input.pinned,
    date: (input.date || today()).toString(),
    modified: today(),
  }
  await writeList(env, KV_NOTICES, [n, ...list])
  return n
}

export async function updateNotice(env: any, id: string, input: Partial<Notice>): Promise<Notice | null> {
  const list = await readList<Notice>(env, KV_NOTICES, SEED_NOTICES)
  const idx = list.findIndex((x) => x.id === id)
  if (idx === -1) return null
  const updated: Notice = {
    ...list[idx],
    title: input.title !== undefined ? input.title.toString().trim() : list[idx].title,
    body: input.body !== undefined ? input.body.toString().trim() : list[idx].body,
    pinned: input.pinned !== undefined ? !!input.pinned : list[idx].pinned,
    date: input.date !== undefined ? input.date.toString() : list[idx].date,
    modified: today(),
  }
  list[idx] = updated
  await writeList(env, KV_NOTICES, list)
  return updated
}

export async function deleteNotice(env: any, id: string): Promise<boolean> {
  const list = await readList<Notice>(env, KV_NOTICES, SEED_NOTICES)
  const next = list.filter((x) => x.id !== id)
  if (next.length === list.length) return false
  await writeList(env, KV_NOTICES, next)
  return true
}

// ============================================================
// COLUMNS
// ============================================================
export async function listColumns(env: any): Promise<Column[]> {
  const list = await readList<Column>(env, KV_COLUMNS, SEED_COLUMNS)
  return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export async function getColumn(env: any, slug: string): Promise<Column | null> {
  const list = await readList<Column>(env, KV_COLUMNS, SEED_COLUMNS)
  return list.find((x) => x.slug === slug) ?? null
}

// body를 폼에서 받을 때: 줄바꿈 2개 단위 단락, 각 단락 첫 줄=소제목(옵션)
export function parseBodyText(raw: string): ColumnBlock[] {
  const text = (raw || '').toString().replace(/\r\n/g, '\n').trim()
  if (!text) return []
  return text.split(/\n{2,}/).map((chunk) => {
    const lines = chunk.split('\n')
    if (lines.length >= 2) {
      return { h: lines[0].trim(), p: lines.slice(1).join(' ').trim() }
    }
    return { h: '', p: lines[0].trim() }
  }).filter((b) => b.p || b.h)
}

export function bodyToText(body: ColumnBlock[]): string {
  return (body || []).map((b) => (b.h ? `${b.h}\n${b.p}` : b.p)).join('\n\n')
}

export async function createColumn(env: any, input: Partial<Column> & { bodyText?: string }): Promise<Column> {
  const list = await readList<Column>(env, KV_COLUMNS, SEED_COLUMNS)
  let slug = input.slug ? slugify(input.slug) : slugify(input.title || '')
  // slug 중복 방지
  if (list.some((x) => x.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  const c: Column = {
    id: newId('c'),
    slug,
    title: (input.title || '제목 없음').toString().trim(),
    excerpt: (input.excerpt || '').toString().trim(),
    date: (input.date || today()).toString(),
    modified: today(),
    author: (input.author || 'hwang-wooseok').toString(),
    related: (input.related || '').toString(),
    body: input.bodyText !== undefined ? parseBodyText(input.bodyText) : (input.body || []),
  }
  await writeList(env, KV_COLUMNS, [c, ...list])
  return c
}

export async function updateColumn(env: any, id: string, input: Partial<Column> & { bodyText?: string }): Promise<Column | null> {
  const list = await readList<Column>(env, KV_COLUMNS, SEED_COLUMNS)
  const idx = list.findIndex((x) => x.id === id)
  if (idx === -1) return null
  let slug = list[idx].slug
  if (input.slug !== undefined && input.slug !== '') {
    const s = slugify(input.slug)
    if (s !== list[idx].slug && list.some((x, i) => i !== idx && x.slug === s)) {
      slug = `${s}-${Date.now().toString(36).slice(-4)}`
    } else {
      slug = s
    }
  }
  const updated: Column = {
    ...list[idx],
    slug,
    title: input.title !== undefined ? input.title.toString().trim() : list[idx].title,
    excerpt: input.excerpt !== undefined ? input.excerpt.toString().trim() : list[idx].excerpt,
    date: input.date !== undefined ? input.date.toString() : list[idx].date,
    author: input.author !== undefined ? input.author.toString() : list[idx].author,
    related: input.related !== undefined ? input.related.toString() : list[idx].related,
    body: input.bodyText !== undefined ? parseBodyText(input.bodyText) : (input.body !== undefined ? input.body : list[idx].body),
    modified: today(),
  }
  list[idx] = updated
  await writeList(env, KV_COLUMNS, list)
  return updated
}

export async function deleteColumn(env: any, id: string): Promise<boolean> {
  const list = await readList<Column>(env, KV_COLUMNS, SEED_COLUMNS)
  const next = list.filter((x) => x.id !== id)
  if (next.length === list.length) return false
  await writeList(env, KV_COLUMNS, next)
  return true
}
