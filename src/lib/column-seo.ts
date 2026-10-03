// ============================================================
// 원장 칼럼·비포애프터 SEO/AEO 헬퍼 — PFWE-COLUMN-CASE-SEO.md (2026-10-03)
// 원칙: 새 문장을 지어내지 않는다. 요약·FAQ·사례 요약은 저장된 본문/필드 값만으로 만든다.
// ============================================================
import type { Column, ColumnBlock, CaseItem } from './content-store'
import { visibleTextLength } from './thin-content'

/** 마크다운 조각 → 화면 텍스트 (이미지 제거, 링크·강조 기호 제거) */
export function mdPlain(s?: string | null): string {
  return String(s || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(?<!\*)\*(?!\*)([^*]+?)\*/g, '$1')
    .replace(/^\s*(###\s+|-\s+|>\s+)/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 핵심 답변 박스: 본문 첫 단락(인사말 문장 제외)의 앞 2~3문장 */
export function answerSummary(body: ColumnBlock[], max = 230): string {
  for (const b of body || []) {
    // 첫 단락: ### 소제목·목록 앞의 일반 문장들
    const lines = String(b.p || '').split('\n').map((l) => l.trim()).filter(Boolean)
    const paras = lines.filter((l) => !/^(###\s|!\[|-\s|>\s)/.test(l))
    const text = mdPlain(paras.join(' '))
    if (text.length < 40) continue
    const sentences = (text.match(/[^.!?。]+[.!?。]+(?=\s|$)|[^.!?。]+$/g) || [text])
      .map((x) => x.trim())
      .filter((x) => x && !/^안녕하세요/.test(x))
    let out = ''
    for (const s of sentences) {
      if (out && (out + ' ' + s).length > max) break
      out = out ? `${out} ${s}` : s
      if (out.length >= 120 && sentences.indexOf(s) >= 1) break
    }
    if (out.length > max + 40) out = out.slice(0, max).replace(/\s+\S*$/, '') + '…'
    if (out.length >= 40) return out
  }
  return ''
}

const QUESTION_END = /(\?|？|까요|나요|가요|을까|할까|되나요|있나요|없나요|하나요|인가요)\s*[.!]?$/

/** 질문형 소제목(블록 h = 화면 H2, '### ' = 화면 H3) + 이어지는 본문 → FAQ (화면 문구 그대로) */
export function faqsFromBlocks(body: ColumnBlock[], maxItems = 20, maxAnswer = 900): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = []
  const seen = new Set<string>()
  const push = (qRaw: string, aRaw: string) => {
    const q = mdPlain(qRaw).replace(/^(?:Q\s*\d*\s*[.:)])\s*/i, '').trim()
    if (!q || q.length > 200 || !QUESTION_END.test(q) || seen.has(q) || out.length >= maxItems) return
    let a = mdPlain(aRaw).replace(/^(?:A\s*\d*\s*[.:)])\s*/i, '').trim()
    if (a.length < 10) return
    if (a.length > maxAnswer) a = a.slice(0, maxAnswer).replace(/\s+\S*$/, '') + '…'
    seen.add(q)
    out.push({ q, a })
  }
  for (const b of body || []) {
    const p = String(b.p || '')
    // 블록 첫 '### ' 이전 텍스트 = 블록 소제목(H2)의 답
    const parts = p.split(/^###\s+/m)
    if (b.h) push(b.h, parts[0])
    for (const part of parts.slice(1)) {
      const nl = part.indexOf('\n')
      const head = nl >= 0 ? part.slice(0, nl) : part
      const rest = nl >= 0 ? part.slice(nl + 1) : ''
      push(head, rest)
    }
  }
  return out
}

/** 서버 페이지네이션 */
export function paginate(total: number, rawPage: string | undefined, size: number) {
  const pages = Math.max(1, Math.ceil(total / size))
  const valid = rawPage === undefined || /^[1-9]\d*$/.test(rawPage)
  const page = valid && rawPage ? parseInt(rawPage, 10) : 1
  return { page, pages, size, offset: (page - 1) * size, valid: valid && page <= pages }
}

export function pageHref(base: string, n: number): string {
  return n <= 1 ? base : `${base}${base.includes('?') ? '&' : '?'}page=${n}`
}

// ---------- 비포애프터 ----------
/** 사례 제목 규칙: {진료명} 사례 — {부위/내용}, {치료 기간} (환자 식별정보 없음, 저장값만) */
export function caseHeadline(cs: CaseItem, txName?: string): string {
  const period = String(cs.period || '').trim()
  return `${txName || '치과 치료'} 사례 — ${cs.title}${period ? `, ${period}` : ''}`
}

/** 구조 필드 → 요약 행 (데이터에 있는 값만) */
export function caseSummaryRows(cs: CaseItem, txName?: string, doctorLabel?: string): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  rows.push({ label: '진료', value: txName || '치과 치료' })
  if (cs.title) rows.push({ label: '치료 내용', value: cs.title })
  if (cs.period) rows.push({ label: '치료 기간', value: cs.period })
  const shots: string[] = []
  if (cs.photoPanoBefore || cs.photoPanoAfter) shots.push('파노라마')
  if (cs.photoOralBefore || cs.photoOralAfter) shots.push('구내 사진')
  if (shots.length) rows.push({ label: '기록 자료', value: `${shots.join('·')} (진료 전 공개 · 진료 후 회원 공개)` })
  if (doctorLabel) rows.push({ label: '담당 원장', value: doctorLabel })
  return rows
}

/**
 * 얇은 사례 판정 — 진료 설명(desc) 고유 본문 300자 미만이면 noindex,follow + 사이트맵 제외.
 * 이음치과(79fab5b)·더착한 후기/이야기 게시판과 같은 기준. 자동 요약은 판정에 넣지 않는다.
 * 설명을 보강하면 자동으로 색인 복귀.
 */
export const THIN_CASE_MIN_CHARS = 300
export function isThinCase(cs: Pick<CaseItem, 'desc'>): boolean {
  return visibleTextLength(cs.desc) < THIN_CASE_MIN_CHARS
}

/** 칼럼 관련 진료 slug 가 같은 최신 글 n편 (없으면 최신 글) */
export function relatedColumns(all: Column[], cur: Column, n = 3): Column[] {
  const others = all.filter((x) => x.slug !== cur.slug && (x.board || 'column') === 'column')
  const same = cur.related ? others.filter((x) => x.related === cur.related) : []
  const rest = others.filter((x) => !same.includes(x))
  return [...same, ...rest].slice(0, n)
}

export function ymd(v?: string | null): string | undefined {
  const m = String(v || '').match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : undefined
}
