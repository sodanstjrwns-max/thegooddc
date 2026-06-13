// ============================================================
// 자동 인링크 엔진 (섹션 5 — SEO 내부링크)
// 본문 텍스트에서 백과사전 핵심 용어를 찾아 자동으로 링크 처리
// - 핵심 용어(CORE_TERMS)만 대상 (과링크 방지)
// - 용어당 1회만 링크 (첫 등장)
// - 블록당 최대 링크 수 제한
// ============================================================
import type { FC } from 'hono/jsx'
import { getCoreTerms } from '../data/encyclopedia'

interface LinkTarget {
  term: string
  slug: string
}

// 긴 용어 우선 매칭 (예: '임플란트 주위염'이 '임플란트'보다 먼저)
let _targets: LinkTarget[] | null = null
function getTargets(): LinkTarget[] {
  if (!_targets) {
    _targets = getCoreTerms()
      .map((t) => ({ term: t.term.replace(/\(.*\)$/, '').trim(), slug: t.slug }))
      .filter((t) => t.term.length >= 2)
      .sort((a, b) => b.term.length - a.term.length)
  }
  return _targets
}

/**
 * 텍스트를 분석해 백과사전 용어를 <a> 링크로 변환한 JSX 조각 배열을 반환
 * @param text 원본 텍스트
 * @param maxLinks 블록당 최대 링크 수 (기본 3)
 * @param exclude 링크 제외할 slug (현재 페이지 자기참조 방지)
 */
export function inlink(text: string, maxLinks = 3, exclude: string[] = []) {
  const targets = getTargets().filter((t) => !exclude.includes(t.slug))
  type Hit = { start: number; end: number; slug: string; word: string }
  const hits: Hit[] = []
  const usedSlugs = new Set<string>()

  for (const t of targets) {
    if (hits.length >= maxLinks) break
    if (usedSlugs.has(t.slug)) continue
    const idx = text.indexOf(t.term)
    if (idx === -1) continue
    // 이미 잡힌 구간과 겹치면 스킵
    const overlaps = hits.some((h) => idx < h.end && idx + t.term.length > h.start)
    if (overlaps) continue
    hits.push({ start: idx, end: idx + t.term.length, slug: t.slug, word: t.term })
    usedSlugs.add(t.slug)
  }

  if (hits.length === 0) return [text]

  hits.sort((a, b) => a.start - b.start)
  const out: any[] = []
  let cursor = 0
  for (const h of hits) {
    if (h.start > cursor) out.push(text.slice(cursor, h.start))
    out.push(
      <a href={`/encyclopedia/${h.slug}`} class="inlink" title={`백과사전: ${h.word}`}>
        {h.word}
      </a>
    )
    cursor = h.end
  }
  if (cursor < text.length) out.push(text.slice(cursor))
  return out
}

/** <p> 본문용 인링크 컴포넌트 */
export const InlinkText: FC<{ text: string; max?: number; exclude?: string[] }> = ({ text, max = 3, exclude = [] }) => {
  return <>{inlink(text, max, exclude)}</>
}
