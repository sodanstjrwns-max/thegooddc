// 비급여 수가 — KV 저장 + 관리자 편집 지원
// 기존 하드코딩 데이터(data/pricing.ts)를 seed 기본값으로 사용하고,
// 관리자가 /admin/fees 에서 저장하면 KV(fees:v1)가 우선한다.
// 항목별 isPublic 토글: 공개 페이지(/pricing)에는 isPublic!==false 항목만 노출.
import { PRICING, PRICING_UPDATED, PRICING_UNIT_NOTE } from '../data/pricing'

const KV_KEY = 'fees:v1'

export interface FeeItem {
  code?: string
  sub: string
  detail?: string
  cost: string
  note?: string
  isPublic: boolean // false면 공개 페이지에서 숨김 (관리자 화면엔 항상 표시)
  highlight?: boolean
}
export interface FeeGroup {
  category: string
  icon: string
  groupNote?: string
  items: FeeItem[]
}
export interface FeesDoc {
  updated: string
  unitNote: string
  groups: FeeGroup[]
}

// 하드코딩 PRICING → FeesDoc (모든 항목 공개 기본값)
export function seedFees(): FeesDoc {
  return {
    updated: PRICING_UPDATED,
    unitNote: PRICING_UNIT_NOTE,
    groups: PRICING.map((g) => ({
      category: g.category,
      icon: g.icon,
      items: g.items.map((it) => ({
        code: it.code,
        sub: it.sub,
        detail: it.detail,
        cost: it.cost,
        note: it.note,
        isPublic: true,
      })),
    })),
  }
}

// 방어적 정규화 — 외부(KV)에서 온 JSON을 신뢰 가능한 형태로 강제
function normalize(raw: any): FeesDoc | null {
  if (!raw || !Array.isArray(raw.groups)) return null
  const groups: FeeGroup[] = raw.groups
    .map((g: any) => ({
      category: String(g?.category ?? '').slice(0, 120),
      icon: String(g?.icon ?? 'tooth').slice(0, 40),
      groupNote: g?.groupNote ? String(g.groupNote).slice(0, 400) : undefined,
      items: Array.isArray(g?.items)
        ? g.items
            .map((it: any) => ({
              code: it?.code ? String(it.code).slice(0, 40) : undefined,
              sub: String(it?.sub ?? '').slice(0, 200),
              detail: it?.detail ? String(it.detail).slice(0, 200) : undefined,
              cost: String(it?.cost ?? '').slice(0, 100),
              note: it?.note ? String(it.note).slice(0, 400) : undefined,
              isPublic: it?.isPublic !== false,
              highlight: !!it?.highlight,
            }))
            .filter((it: FeeItem) => it.sub)
        : [],
    }))
    .filter((g: FeeGroup) => g.category)
  if (!groups.length) return null
  return {
    updated: String(raw.updated ?? PRICING_UPDATED).slice(0, 40),
    unitNote: String(raw.unitNote ?? PRICING_UNIT_NOTE).slice(0, 200),
    groups,
  }
}

// 관리자 편집 원본 (모든 항목 — 비공개 포함)
export async function loadFees(env: any): Promise<FeesDoc> {
  try {
    if (env?.KV) {
      const raw = await env.KV.get(KV_KEY, 'json')
      const doc = normalize(raw)
      if (doc) return doc
    }
  } catch (e) {
    console.error('loadFees error', e)
  }
  return seedFees()
}

// 공개 페이지용 — 비공개 항목·빈 그룹 제거
export function toPublic(doc: FeesDoc): FeesDoc {
  const groups = doc.groups
    .map((g) => ({ ...g, items: g.items.filter((it) => it.isPublic !== false) }))
    .filter((g) => g.items.length > 0)
  return { ...doc, groups }
}

export async function saveFees(env: any, incoming: any): Promise<{ ok: boolean; error?: string }> {
  const doc = normalize(incoming)
  if (!doc) return { ok: false, error: 'invalid data' }
  if (!env?.KV) return { ok: false, error: 'KV unavailable' }
  await env.KV.put(KV_KEY, JSON.stringify(doc))
  return { ok: true }
}
