// ============================================================
// Google Indexing API 자동 색인 모듈 (Cloudflare Workers / Web Crypto)
// ------------------------------------------------------------
// 동작 흐름:
//   1) 서비스 계정 JSON(client_email + private_key)을 env(GOOGLE_SA_JSON)에서 읽음
//   2) Web Crypto(RS256)로 JWT 자체 서명 → OAuth2 access_token 교환
//   3) indexing.googleapis.com/v3/urlNotifications:publish 로 URL 알림 전송
//
// 사전 준비(원장님/관리자):
//   • Google Cloud 콘솔에서 "Indexing API" 사용 설정
//   • 서비스 계정 생성 → JSON 키 발급
//   • 그 서비스 계정 이메일을 Search Console 속성에 "소유자"로 추가
//   • Cloudflare Pages 환경변수 GOOGLE_SA_JSON 에 JSON 전체를 붙여넣기 (Secret 권장)
//
// 키가 없으면 모든 함수가 조용히 no-op → 사이트는 절대 깨지지 않음.
// ============================================================

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri?: string
}

export interface IndexResult {
  ok: boolean
  url: string
  status?: number
  skipped?: boolean
  error?: string
}

// ---- base64url 유틸 ----
function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array
  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input)
  } else if (input instanceof Uint8Array) {
    bytes = input
  } else {
    bytes = new Uint8Array(input)
  }
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// ---- PEM(PKCS#8) → CryptoKey ----
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '')
  const bin = atob(clean)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

// ---- 서비스 계정 JSON 파싱 (env에서) ----
function readServiceAccount(env: any): ServiceAccount | null {
  const raw = (env?.GOOGLE_SA_JSON ?? '').toString().trim()
  if (!raw) return null
  try {
    const j = JSON.parse(raw)
    if (j && j.client_email && j.private_key) {
      return { client_email: j.client_email, private_key: j.private_key, token_uri: j.token_uri }
    }
  } catch { /* malformed */ }
  return null
}

// ---- JWT 생성 + 서명 ----
async function buildJwt(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`
  const key = await importPrivateKey(sa.private_key)
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned))
  return `${unsigned}.${b64url(sig)}`
}

// ---- access_token 교환 ----
async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  const jwt = await buildJwt(sa)
  const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  if (!res.ok) return null
  const j = await res.json<{ access_token?: string }>().catch(() => null)
  return j?.access_token ?? null
}

// ============================================================
// 공개 함수: URL 하나를 구글에 색인 알림
// type: 'URL_UPDATED'(신규/수정) | 'URL_DELETED'(삭제)
// 키 미설정/실패 시 throw 안 함 → 콘텐츠 저장 흐름을 절대 방해하지 않음.
// ============================================================
export async function notifyGoogleIndex(
  env: any,
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
): Promise<IndexResult> {
  const sa = readServiceAccount(env)
  if (!sa) return { ok: false, url, skipped: true, error: 'GOOGLE_SA_JSON 미설정' }
  try {
    const token = await getAccessToken(sa)
    if (!token) return { ok: false, url, error: 'access_token 발급 실패' }
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, type }),
    })
    if (res.ok) return { ok: true, url, status: res.status }
    const txt = await res.text().catch(() => '')
    return { ok: false, url, status: res.status, error: txt.slice(0, 200) }
  } catch (e: any) {
    return { ok: false, url, error: (e?.message || String(e)).slice(0, 200) }
  }
}

// 여러 URL 동시 처리 (Promise.allSettled — 일부 실패해도 진행)
export async function notifyGoogleIndexMany(
  env: any,
  urls: string[],
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
): Promise<IndexResult[]> {
  const uniq = [...new Set(urls.filter(Boolean))]
  const settled = await Promise.allSettled(uniq.map((u) => notifyGoogleIndex(env, u, type)))
  return settled.map((s, i) =>
    s.status === 'fulfilled' ? s.value : { ok: false, url: uniq[i], error: 'rejected' },
  )
}

// 서비스 계정 설정 여부 (admin 진단용)
export function isGoogleIndexingConfigured(env: any): boolean {
  return readServiceAccount(env) !== null
}
