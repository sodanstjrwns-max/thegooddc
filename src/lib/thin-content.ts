/**
 * 얇은(thin) 게시글 판정 — GSC "크롤링됨-미색인" 정리용 (2026-09-29)
 *
 * 원칙 (PF Web Engine 공통 규칙, 이음치과 79fab5b 와 동일):
 *  - 글 고유 본문(소제목+단락, 이미지 마크다운·태그 제거, 공백 제외 글자 수)이 기준 미만이면
 *    <meta name="robots" content="noindex, follow"> + X-Robots-Tag + 사이트맵 제외.
 *  - 글과 내부 링크는 그대로 유지 → 본문을 보강하면 기준을 넘는 즉시 자동 색인 복귀.
 *
 * 적용 게시판: 치료 후기(reviews)·치과 이야기(story) — 사진 위주 짧은 글이 많음.
 *   2026-09-29 라이브 크롤 실측: 후기 11건 중 8건, 이야기 22건 중 9건이 고유 본문 300자 미만.
 *   원장 칼럼(column)은 최소 354자·중앙값 2,788자라 대상 아님.
 */
import type { Column } from './content-store'

export const THIN_BOARD_POST_MIN_CHARS = 300
export const THIN_BOARDS = new Set(['reviews', 'story'])
export const NOINDEX_FOLLOW = 'noindex, follow'

/** HTML/마크다운 → 화면에 보이는 글자 수 (이미지 마크다운·태그·엔티티·공백 제외) */
export function visibleTextLength(s?: string | null): number {
  if (!s) return 0
  return String(s)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[#*_>`\-|]+/g, ' ')
    .replace(/\s+/g, '')
    .length
}

export function columnBodyLength(col: Pick<Column, 'body'>): number {
  return (col.body || []).reduce((n, b) => n + visibleTextLength(b?.h) + visibleTextLength(b?.p), 0)
}

/** 후기·이야기 게시판 글 중 본문이 기준 미만인 글 */
export function isThinBoardPost(col: Pick<Column, 'body' | 'board'>): boolean {
  const board = col.board || 'column'
  if (!THIN_BOARDS.has(board)) return false
  return columnBodyLength(col) < THIN_BOARD_POST_MIN_CHARS
}
