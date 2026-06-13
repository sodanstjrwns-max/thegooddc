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

export interface CaseItem {
  id: string
  title: string
  category: string // treatment slug
  doctor: string // doctor slug
  age: string
  gender: string
  area: string
  period: string
  desc: string
  modified: string
  // R2 사진 키 (의료법: after는 로그인 게이팅)
  photoPanoBefore?: string // 파노라마 전
  photoPanoAfter?: string // 파노라마 후
  photoOralBefore?: string // 구내 전
  photoOralAfter?: string // 구내 후
}

const KV_NOTICES = 'content:notices'
const KV_COLUMNS = 'content:columns'
const KV_CASES = 'content:cases'

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
  {
    id: 'c-seed-3',
    slug: 'denture-20years-implant',
    title: '20년 틀니를 쓰셨던 분의 임플란트 이야기',
    excerpt: '잇몸뼈가 부족해 임플란트가 어렵다는 이야기를 듣고 오랜 기간 틀니로 지내신 분도, 정밀한 디지털 설계로 다시 검토할 수 있습니다.',
    date: '2026-06-10',
    modified: '2026-06-10',
    author: 'hwang-wooseok',
    related: 'implant',
    body: [
      { h: '"뼈가 부족해서 안 된다"는 말, 끝이 아닐 수 있습니다', p: '젊은 시절부터 치아 상태가 좋지 않아 하나둘 발치하게 되고, 잇몸뼈가 부족해 임플란트가 어렵다는 이야기를 들은 뒤 20년 가까이 틀니로 지내신 60대 환자분이 계셨습니다. 큰 기대 없이 마지막이라는 마음으로 내원하셨습니다.' },
      { h: '남아 있는 뼈를 최대한 활용하는 설계', p: '오랜 틀니 사용으로 잇몸뼈가 많이 줄어든 상태였지만, AI 임플란트 가이드 시스템으로 3D CT 데이터를 분석해 남아 있는 뼈를 최대한 활용할 수 있는 위치와 각도를 정밀하게 계획했고, 단계적으로 치료를 진행했습니다.' },
      { h: '식사가 달라지면 일상이 달라집니다', p: '치료를 마친 뒤 정기검진에서 "20년 동안 안 될 거라 생각했는데, 먹고 싶은 것을 마음껏 먹을 수 있게 됐다"는 말씀을 들었습니다. 다만 잇몸뼈 상태와 치료 가능 여부는 환자 개인마다 다르므로, 정밀 진단을 통해 확인하시기 바랍니다.' },
    ],
  },
  {
    id: 'c-seed-4',
    slug: 'implant-spacing-matters',
    title: '임플란트, 개수보다 "위치와 간격"이 중요한 이유',
    excerpt: '임플란트는 많이 심는 것이 아니라 정확한 위치에 적절한 간격으로 심는 것이 중요합니다. 간격이 무너지면 임플란트 주위염으로 이어질 수 있습니다.',
    date: '2026-06-05',
    modified: '2026-06-05',
    author: 'hwang-wooseok',
    related: 'implant',
    body: [
      { h: '임플란트끼리 너무 가까우면 생기는 일', p: '임플란트 사이의 거리가 지나치게 가까우면 그 사이 잇몸과 뼈가 건강하게 유지되기 어렵고, 관리가 잘 되지 않아 임플란트 주위염으로 이어질 수 있습니다. 심한 경우 식립한 임플란트를 제거해야 하는 상황도 생깁니다.' },
      { h: '많이 심는 것보다, 바르게 심는 것', p: '윗턱에 과도하게 많은 개수가 좁은 간격으로 식립되어 주위염이 진행된 상태로 내원하신 분이 계셨습니다. 문제가 된 임플란트를 제거한 뒤, AI 가이드 시스템으로 정확한 위치에 적절한 간격을 두고 더 적은 개수로 다시 계획하여 치료를 진행했습니다.' },
      { h: '재수술은 첫 수술보다 어렵습니다', p: '임플란트는 다시 심는 것이 처음 심는 것보다 까다롭습니다. 그래서 처음부터 정확한 진단과 설계가 중요합니다. 비용만으로 결정하기보다, 어떤 진단 과정과 설계 시스템을 거치는지 함께 확인해 보시기 바랍니다. 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.' },
    ],
  },
  {
    id: 'c-seed-5',
    slug: 'dental-fear-story',
    title: '치과가 무서워 몇 년을 미루셨다면',
    excerpt: '어릴 적 아픈 기억으로 치과를 미루다 상태가 나빠진 뒤에야 내원하시는 분들이 많습니다. 두려움이 큰 분일수록 첫걸음을 돕는 진료 과정을 소개합니다.',
    date: '2026-05-30',
    modified: '2026-05-30',
    author: 'hwang-wooseok',
    related: 'integrated',
    body: [
      { h: '두려움은 치아보다 빨리 자랍니다', p: '어릴 적 치과 치료의 아픈 기억 때문에 치과만 생각하면 가슴이 두근거릴 정도로 두려움이 크셨던 50대 환자분이 계셨습니다. 치료를 미루는 사이 상태가 나빠져 제대로 씹기 어려웠고, 소화 불편까지 이어졌다고 하셨습니다. 앞니가 부러지고 나서야 더 미룰 수 없다는 마음으로 내원하셨습니다.' },
      { h: '충분한 상담이 먼저입니다', p: '치료보다 먼저 한 일은 충분히 이야기를 듣는 것이었습니다. 어떤 점이 가장 두려운지 확인한 뒤, 통증 부담을 줄이는 마취 시스템으로 진행했습니다. 마취가 끝난 뒤 "이미 끝난 것이냐"고 되물으시고는, 평생 무서워서 미룬 것이 후회된다고 말씀하셨습니다.' },
      { h: '씹는 즐거움은 건강의 시작입니다', p: '이후 필요한 치료를 차근차근 진행했고, 저작 기능이 회복되면서 식사와 소화 불편감도 나아졌다고 하셨습니다. 치과 공포가 큰 분일수록, 첫 상담에서 두려움부터 말씀해 주세요. 그 속도에 맞춰 진행하겠습니다. 치료 경과는 개인에 따라 다를 수 있습니다.' },
    ],
  },
]

export const SEED_CASES: CaseItem[] = [
  { id: 'cs-seed-1', title: '디지털 가이드 임플란트 케이스', age: '50대', gender: '남성', category: 'implant', area: '강서구 명지동', doctor: 'hwang-wooseok', period: '약 3개월', desc: '상실된 어금니를 디지털 가이드 임플란트로 회복한 사례입니다. 정밀 설계를 통해 안정적인 식립을 진행했습니다.', modified: '2026-05-01' },
  { id: 'cs-seed-2', title: '투명교정 전후', age: '20대', gender: '여성', category: 'clear-aligner', area: '강서구 명지동', doctor: 'hwang-wooseok', period: '약 12개월', desc: '앞니의 가벼운 배열을 투명교정으로 자연스럽게 개선한 사례입니다.', modified: '2026-05-01' },
  { id: 'cs-seed-3', title: '미니쉬 심미 치료', age: '30대', gender: '여성', category: 'minish', area: '부산 강서구', doctor: 'hwang-wooseok', period: '약 2주', desc: '자연 치아 삭제를 최소화하며 앞니의 색과 형태를 개선한 심미 치료 사례입니다.', modified: '2026-05-01' },
  { id: 'cs-seed-5', title: '오랜 틀니 사용 후 AI 가이드 임플란트', age: '60대', gender: '여성', category: 'implant', area: '강서구 명지동', doctor: 'hwang-wooseok', period: '약 6개월', desc: '잇몸뼈가 부족해 오랜 기간 틀니를 사용하시던 분의 사례입니다. AI 가이드 시스템으로 남아 있는 뼈를 최대한 활용하는 위치를 정밀 설계하여 단계적으로 진행했습니다.', modified: '2026-06-10' },
  { id: 'cs-seed-4', title: '다수 임플란트 회복', age: '60대', gender: '남성', category: 'implant', area: '경남 김해 장유', doctor: 'hwang-wooseok', period: '약 4개월', desc: '여러 개의 치아를 잃은 경우 정밀 설계로 저작 기능을 회복한 사례입니다.', modified: '2026-05-01' },
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
    // 리치 마커(###, -, ![, **)가 있으면 줄바꿈 보존, 아니면 한 단락으로 합침
    if (lines.length >= 2) {
      const first = lines[0].trim()
      const rest = lines.slice(1)
      const hasRich = rest.some((l) => /^(###\s|-\s|!\[)/.test(l.trim()))
      // 첫 줄 자체가 리치 마커면 소제목 없는 블록
      if (/^(###\s|-\s|!\[)/.test(first)) return { h: '', p: lines.join('\n').trim() }
      return { h: first, p: hasRich ? rest.join('\n').trim() : rest.join(' ').trim() }
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

// ============================================================
// CASES (비포/애프터 — 텍스트 메타데이터만, 사진은 의료법 게이팅 유지)
// ============================================================
export async function listCases(env: any): Promise<CaseItem[]> {
  return await readList<CaseItem>(env, KV_CASES, SEED_CASES)
}

export async function createCase(env: any, input: Partial<CaseItem>): Promise<CaseItem> {
  const list = await readList<CaseItem>(env, KV_CASES, SEED_CASES)
  const cs: CaseItem = {
    id: newId('cs'),
    title: (input.title || '제목 없음').toString().trim(),
    category: (input.category || '').toString(),
    doctor: (input.doctor || 'hwang-wooseok').toString(),
    age: (input.age || '').toString().trim(),
    gender: (input.gender || '').toString().trim(),
    area: (input.area || '').toString().trim(),
    period: (input.period || '').toString().trim(),
    desc: (input.desc || '').toString().trim(),
    modified: today(),
    photoPanoBefore: (input.photoPanoBefore || '').toString() || undefined,
    photoPanoAfter: (input.photoPanoAfter || '').toString() || undefined,
    photoOralBefore: (input.photoOralBefore || '').toString() || undefined,
    photoOralAfter: (input.photoOralAfter || '').toString() || undefined,
  }
  await writeList(env, KV_CASES, [cs, ...list])
  return cs
}

export async function updateCase(env: any, id: string, input: Partial<CaseItem>): Promise<CaseItem | null> {
  const list = await readList<CaseItem>(env, KV_CASES, SEED_CASES)
  const idx = list.findIndex((x) => x.id === id)
  if (idx === -1) return null
  const updated: CaseItem = {
    ...list[idx],
    title: input.title !== undefined ? input.title.toString().trim() : list[idx].title,
    category: input.category !== undefined ? input.category.toString() : list[idx].category,
    doctor: input.doctor !== undefined ? input.doctor.toString() : list[idx].doctor,
    age: input.age !== undefined ? input.age.toString().trim() : list[idx].age,
    gender: input.gender !== undefined ? input.gender.toString().trim() : list[idx].gender,
    area: input.area !== undefined ? input.area.toString().trim() : list[idx].area,
    period: input.period !== undefined ? input.period.toString().trim() : list[idx].period,
    desc: input.desc !== undefined ? input.desc.toString().trim() : list[idx].desc,
    modified: today(),
    photoPanoBefore: input.photoPanoBefore !== undefined && input.photoPanoBefore !== '' ? input.photoPanoBefore.toString() : list[idx].photoPanoBefore,
    photoPanoAfter: input.photoPanoAfter !== undefined && input.photoPanoAfter !== '' ? input.photoPanoAfter.toString() : list[idx].photoPanoAfter,
    photoOralBefore: input.photoOralBefore !== undefined && input.photoOralBefore !== '' ? input.photoOralBefore.toString() : list[idx].photoOralBefore,
    photoOralAfter: input.photoOralAfter !== undefined && input.photoOralAfter !== '' ? input.photoOralAfter.toString() : list[idx].photoOralAfter,
  }
  list[idx] = updated
  await writeList(env, KV_CASES, list)
  return updated
}

export async function deleteCase(env: any, id: string): Promise<boolean> {
  const list = await readList<CaseItem>(env, KV_CASES, SEED_CASES)
  const next = list.filter((x) => x.id !== id)
  if (next.length === list.length) return false
  await writeList(env, KV_CASES, next)
  return true
}
