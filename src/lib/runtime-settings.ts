// ============================================================
// 런타임 설정 홀더 — 요청 미들웨어가 getSettings 결과를 여기 담고,
// 동기 컴포넌트(Layout)가 렌더 시점에 읽는다.
// Cloudflare Workers는 단일 요청을 동기적으로 렌더(await 직후)하므로,
// 미들웨어 prefetch → 모듈변수 저장 → 동기 read 패턴이 안전하다.
// ============================================================
import type { SiteSettings } from './content-store'

const EMPTY: SiteSettings = { ga4: '', gtm: '', naverVerify: '', googleVerify: '' }

let _active: SiteSettings = { ...EMPTY }

export function setActiveSettings(s: SiteSettings | null | undefined): void {
  _active = s ? { ...EMPTY, ...s } : { ...EMPTY }
}

export function getActiveSettings(): SiteSettings {
  return _active
}
