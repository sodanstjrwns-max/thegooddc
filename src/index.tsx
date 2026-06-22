import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { CLINIC } from './data/clinic'
import { ASSET_VERSION } from './lib/asset-version'
import { TREATMENTS } from './data/treatments'
import { DOCTORS } from './data/doctors'
import { TERMS, DETAILED_TERMS } from './data/encyclopedia'
import { getAreaCombinations, getAreaHubs, getArea, AREAS } from './data/areas'
import { searchRegions } from './data/regions'
import {
  signSession, verifySession, hashPassword,
  parseCookies, cookieString, clearCookie, type SessionPayload,
} from './lib/auth'

// Pages
import { HomePage } from './routes/home'
import { TreatmentsListPage, TreatmentDetailPage } from './routes/treatments'
import { DoctorsListPage, DoctorDetailPage } from './routes/doctors'
import { MissionPage, DirectionsPage, FaqPage, PricingPage, NoticePage, ReservationPage } from './routes/pages'
import { CasesPage, ColumnListPage, ColumnDetailPage, EncyclopediaListPage, EncyclopediaDetailPage } from './routes/content'
import { AreaPage, AreaHubPage } from './routes/area'
import { LoginPage, RegisterPage, MyPage, AdminLoginPage, AdminDashboard, AdminNoticesPage, AdminColumnsPage, AdminCasesPage, AdminMembersPage, AdminReservationsPage, AdminSettingsPage, AdminAnalyticsPage } from './routes/auth'
import {
  listNotices, createNotice, updateNotice, deleteNotice, getActivePopupNotice,
  listColumns, getColumn, createColumn, updateColumn, deleteColumn,
  listCases, createCase, updateCase, deleteCase,
  getSettings, getSettingsDiagnostic, saveSettings,
  listReservations, updateReservation, deleteReservation, buildResStats, reservationsToCsv,
} from './lib/content-store'
import { setActiveSettings } from './lib/runtime-settings'
import { notifyGoogleIndex, notifyGoogleIndexMany, isGoogleIndexingConfigured } from './lib/google-indexing'

// 절대 URL 헬퍼 (자동 색인용)
const SITE_ORIGIN = `https://${CLINIC.domain}`
const absUrl = (path: string) => `${SITE_ORIGIN}${path.startsWith('/') ? path : '/' + path}`

type Bindings = {
  KV?: KVNamespace
  R2?: R2Bucket
  ADMIN_PASSWORD?: string
  ADMIN_SESSION_SECRET?: string
  SESSION_SECRET?: string
  RESEND_API_KEY?: string
  NOTIFICATION_EMAIL?: string
  // 분석·검색엔진 인증 (배포 시 환경변수로 고정 가능 — KV/clinic 시드보다 우선)
  GA4_ID?: string
  GTM_ID?: string
  NAVER_VERIFY?: string
  GOOGLE_VERIFY?: string
  BING_VERIFY?: string
  GOOGLE_SA_JSON?: string  // 구글 Indexing API 서비스 계정 JSON (자동 색인용)
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())

// 모든 HTML 요청 전에 분석 설정을 prefetch → 런타임 홀더에 주입 (Layout이 동기 read)
// API/정적 라우트는 건너뛰어 KV 읽기 오버헤드 최소화
app.use('*', async (c, next) => {
  const p = c.req.path
  if (!p.startsWith('/api/') && !p.startsWith('/static/')) {
    try {
      const s = await getSettings(c.env, CLINIC.analytics)
      setActiveSettings(s)
    } catch {
      setActiveSettings(null)
    }
  }
  await next()
})

const SECRET = (c: any) => c.env?.SESSION_SECRET || 'dev-session-secret-change-me'
const ADMIN_SECRET = (c: any) => c.env?.ADMIN_SESSION_SECRET || 'dev-admin-secret-change-me'
const ADMIN_PW = (c: any) => c.env?.ADMIN_PASSWORD || 'admin1234'

async function getSession(c: any, role: 'member' | 'admin'): Promise<SessionPayload | null> {
  const cookies = parseCookies(c.req.header('Cookie'))
  const token = role === 'admin' ? cookies['admin_session'] : cookies['session']
  if (!token) return null
  const secret = role === 'admin' ? ADMIN_SECRET(c) : SECRET(c)
  const s = await verifySession(token, secret)
  return s && s.role === role ? s : null
}

// ============================================================
// PAGE ROUTES
// ============================================================
app.get('/', async (c) => c.html(<HomePage popup={await getActivePopupNotice(c.env)} />))
app.get('/mission', (c) => c.html(<MissionPage />))
app.get('/treatments', (c) => c.html(<TreatmentsListPage />))
app.get('/treatments/:slug', (c) => c.html(<TreatmentDetailPage slug={c.req.param('slug')} />))
app.get('/doctors', (c) => c.html(<DoctorsListPage />))
app.get('/doctors/:slug', (c) => c.html(<DoctorDetailPage slug={c.req.param('slug')} />))
app.get('/directions', (c) => c.html(<DirectionsPage />))
app.get('/faq', (c) => c.html(<FaqPage />))
app.get('/pricing', (c) => c.html(<PricingPage />))
app.get('/notice', async (c) => c.html(<NoticePage notices={await listNotices(c.env)} />))
app.get('/reservation', (c) => c.html(<ReservationPage />))
app.get('/column', async (c) => c.html(<ColumnListPage columns={await listColumns(c.env)} />))
app.get('/column/:slug', async (c) => {
  const slug = c.req.param('slug')
  const views = await bumpView(c.env, `column:${slug}`)
  return c.html(<ColumnDetailPage slug={slug} column={await getColumn(c.env, slug)} views={views} />)
})
app.get('/encyclopedia', (c) => c.html(<EncyclopediaListPage category={c.req.query('cat')} />))
app.get('/encyclopedia/:slug', (c) => c.html(<EncyclopediaDetailPage slug={c.req.param('slug')} />))

app.get('/cases', async (c) => {
  const session = await getSession(c, 'member')
  return c.html(<CasesPage loggedIn={!!session} cases={await listCases(c.env)} />)
})

// 지역 SEO: /area/:areaSlug-:treatmentSlug
app.get('/area/:combo', (c) => {
  const combo = c.req.param('combo')
  // 마지막 하이픈 기준으로 분리하되, treatment slug가 하이픈 포함(clear-aligner) 가능
  const treatmentSlugs = TREATMENTS.map((t) => t.slug)
  let matched: { area: string; treatment: string } | null = null
  for (const ts of treatmentSlugs) {
    if (combo.endsWith(`-${ts}`)) {
      matched = { area: combo.slice(0, combo.length - ts.length - 1), treatment: ts }
      break
    }
  }
  if (!matched) return c.notFound()
  return c.html(<AreaPage areaSlug={matched.area} treatmentSlug={matched.treatment} />)
})

// 지역 허브(랜딩) 페이지 — 한 지역의 모든 진료를 묶는 권위 페이지
app.get('/clinic/:area', (c) => {
  const area = c.req.param('area')
  if (!getArea(area)) return c.notFound()
  return c.html(<AreaHubPage areaSlug={area} />)
})

// Auth pages
app.get('/auth/login', (c) => c.html(<LoginPage />))
app.get('/auth/register', (c) => c.html(<RegisterPage />))
app.get('/auth/mypage', async (c) => {
  const s = await getSession(c, 'member')
  return c.html(<MyPage user={s ? { name: s.name || '회원', email: s.email || '' } : undefined} />)
})

// Admin pages
app.get('/admin', async (c) => {
  const s = await getSession(c, 'admin')
  if (s) return c.redirect('/admin/dashboard')
  return c.html(<AdminLoginPage />)
})
app.get('/admin/dashboard', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  let members = 0, reservations = 0
  if (c.env.KV) {
    const m = await c.env.KV.list({ prefix: 'user:' })
    members = m.keys.length
    const r = await c.env.KV.list({ prefix: 'reservation:' })
    reservations = r.keys.length
  }
  const [notices, columns, cases, popup, diag] = await Promise.all([listNotices(c.env), listColumns(c.env), listCases(c.env), getActivePopupNotice(c.env), getSettingsDiagnostic(c.env, CLINIC.analytics)])
  return c.html(<AdminDashboard stats={{ members, reservations, notices: notices.length, columns: columns.length, cases: cases.length }} popup={popup} diag={diag} />)
})

// Admin settings (추적·분석)
app.get('/admin/settings', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  const diag = await getSettingsDiagnostic(c.env, CLINIC.analytics)
  return c.html(<AdminSettingsPage diag={diag} ok={c.req.query('ok')} googleIndexOn={isGoogleIndexingConfigured(c.env)} />)
})

// Admin content management UI
app.get('/admin/notices', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  return c.html(<AdminNoticesPage notices={await listNotices(c.env)} ok={c.req.query('ok')} />)
})
app.get('/admin/columns', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  const columns = await listColumns(c.env)
  const views = await getViews(c.env, columns.map((x) => `column:${x.slug}`))
  return c.html(<AdminColumnsPage columns={columns} ok={c.req.query('ok')} views={views} />)
})
app.get('/admin/cases', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  return c.html(<AdminCasesPage cases={await listCases(c.env)} ok={c.req.query('ok')} />)
})
// 관리자 회원 목록
app.get('/admin/members', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  const members: any[] = []
  if (c.env.KV) {
    const list = await c.env.KV.list({ prefix: 'user:' })
    for (const k of list.keys) {
      const raw = await c.env.KV.get(k.name)
      if (raw) {
        try {
          const u = JSON.parse(raw)
          members.push({ name: u.name || '-', email: u.email || k.name.slice(5), phone: u.phone || '-', marketing: !!u.marketing, createdAt: u.createdAt || 0 })
        } catch {}
      }
    }
    members.sort((a, b) => b.createdAt - a.createdAt)
  }
  return c.html(<AdminMembersPage members={members} />)
})
// 관리자 예약 목록
app.get('/admin/reservations', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  const items = await listReservations(c.env)
  const stats = buildResStats(items)
  return c.html(<AdminReservationsPage items={items} stats={stats} />)
})

app.get('/admin/analytics', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  const items = await listReservations(c.env)
  const stats = buildResStats(items)
  return c.html(<AdminAnalyticsPage stats={stats} />)
})

// Legal pages
app.get('/privacy', (c) => c.html(legalPage('개인정보처리방침', PRIVACY_TEXT)))
app.get('/terms', (c) => c.html(legalPage('이용약관', TERMS_TEXT)))

// ============================================================
// API ROUTES
// ============================================================
app.post('/api/auth/register', async (c) => {
  try {
    const { name, email, phone, password, marketing } = await c.req.json()
    if (!name || !email || !phone || !password) return c.json({ ok: false, error: '필수 항목을 입력해 주세요.' })
    if (!c.env.KV) return c.json({ ok: false, error: '저장소가 설정되지 않았습니다. (개발 환경)' })
    const exists = await c.env.KV.get(`user:${email}`)
    if (exists) return c.json({ ok: false, error: '이미 가입된 이메일입니다.' })
    const pwHash = await hashPassword(password, email)
    await c.env.KV.put(`user:${email}`, JSON.stringify({ name, email, phone, pwHash, marketing: !!marketing, createdAt: Date.now() }))
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false, error: '가입 중 오류가 발생했습니다.' })
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!c.env.KV) return c.json({ ok: false, error: '저장소가 설정되지 않았습니다. (개발 환경)' })
    const raw = await c.env.KV.get(`user:${email}`)
    if (!raw) return c.json({ ok: false, error: '가입되지 않은 이메일입니다.' })
    const user = JSON.parse(raw)
    const pwHash = await hashPassword(password, email)
    if (pwHash !== user.pwHash) return c.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' })
    const token = await signSession({ sub: email, role: 'member', name: user.name, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, SECRET(c))
    c.header('Set-Cookie', cookieString('session', token, 60 * 60 * 24 * 30))
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false, error: '로그인 중 오류가 발생했습니다.' })
  }
})

app.get('/api/auth/logout', (c) => {
  c.header('Set-Cookie', clearCookie('session'))
  return c.redirect('/')
})

app.post('/api/admin/login', async (c) => {
  try {
    const { password } = await c.req.json()
    if (password !== ADMIN_PW(c)) return c.json({ ok: false, error: '비밀번호가 올바르지 않습니다.' })
    const token = await signSession({ sub: 'admin', role: 'admin', exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, ADMIN_SECRET(c))
    c.header('Set-Cookie', cookieString('admin_session', token, 60 * 60 * 24))
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false, error: '오류가 발생했습니다.' })
  }
})
app.get('/api/admin/logout', (c) => {
  c.header('Set-Cookie', clearCookie('admin_session'))
  return c.redirect('/admin')
})

// ============================================================
// ADMIN CONTENT CRUD (admin 세션 가드 · form-encoded, POST→redirect)
// ============================================================
async function requireAdmin(c: any): Promise<boolean> {
  return !!(await getSession(c, 'admin'))
}

// ----- NOTICES -----
// 예약 상태/메모 업데이트
app.post('/api/admin/reservations/update', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  const key = String(f.key || '')
  const status = String(f.status || '') as any
  const valid = ['new', 'confirmed', 'done', 'canceled']
  if (key && valid.includes(status)) await updateReservation(c.env, key, { status })
  if (f.memo !== undefined) await updateReservation(c.env, key, { memo: String(f.memo) })
  return c.redirect('/admin/reservations')
})

// 예약 삭제
app.post('/api/admin/reservations/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  const key = String(f.key || '')
  if (key) await deleteReservation(c.env, key)
  return c.redirect('/admin/reservations')
})

// 예약 CSV 내보내기 (엑셀 한글 깨짐 방지 위해 UTF-8 BOM 부착)
app.get('/api/admin/reservations/export', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const items = await listReservations(c.env)
  const csv = '\uFEFF' + reservationsToCsv(items)
  const fname = `reservations_${new Date().toISOString().slice(0, 10)}.csv`
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fname}"`,
    },
  })
})

// 추적·분석 설정 저장 (KV)
app.post('/api/admin/settings', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await saveSettings(c.env, {
    ga4: String(f.ga4 ?? ''),
    gtm: String(f.gtm ?? ''),
    naverVerify: String(f.naverVerify ?? ''),
    googleVerify: String(f.googleVerify ?? ''),
    bingVerify: String(f.bingVerify ?? ''),
  })
  return c.redirect('/admin/settings?ok=saved')
})

app.post('/api/admin/notices/create', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await createNotice(c.env, {
    title: String(f.title || ''),
    body: String(f.body || ''),
    date: String(f.date || ''),
    pinned: f.pinned === 'on' || f.pinned === 'true',
    popup: f.popup === 'on' || f.popup === 'true',
    popupUntil: String(f.popupUntil || ''),
    image: String(f.image || ''),
    imageAlt: String(f.imageAlt || ''),
  })
  return c.redirect('/admin/notices?ok=created')
})
app.post('/api/admin/notices/update', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await updateNotice(c.env, String(f.id || ''), {
    title: String(f.title || ''),
    body: String(f.body || ''),
    date: String(f.date || ''),
    pinned: f.pinned === 'on' || f.pinned === 'true',
    popup: f.popup === 'on' || f.popup === 'true',
    popupUntil: String(f.popupUntil || ''),
    image: String(f.image || ''),
    imageAlt: String(f.imageAlt || ''),
  })
  return c.redirect('/admin/notices?ok=updated')
})
app.post('/api/admin/notices/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await deleteNotice(c.env, String(f.id || ''))
  return c.redirect('/admin/notices?ok=deleted')
})

// ----- COLUMNS -----
app.post('/api/admin/columns/create', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  const col = await createColumn(c.env, {
    title: String(f.title || ''),
    slug: String(f.slug || ''),
    excerpt: String(f.excerpt || ''),
    date: String(f.date || ''),
    author: String(f.author || 'hwang-wooseok'),
    related: String(f.related || ''),
    cover: String(f.cover || ''),
    coverAlt: String(f.coverAlt || ''),
    bodyText: String(f.bodyText || ''),
  })
  // 새 칼럼 → 구글 자동 색인 요청 (백그라운드, 실패해도 발행에 영향 없음)
  c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl(`/column/${col.slug}`), 'URL_UPDATED'))
  return c.redirect('/admin/columns?ok=created')
})
app.post('/api/admin/columns/update', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  const upd = await updateColumn(c.env, String(f.id || ''), {
    title: String(f.title || ''),
    slug: String(f.slug || ''),
    excerpt: String(f.excerpt || ''),
    date: String(f.date || ''),
    author: String(f.author || 'hwang-wooseok'),
    related: String(f.related || ''),
    cover: String(f.cover || ''),
    coverAlt: String(f.coverAlt || ''),
    bodyText: String(f.bodyText || ''),
  })
  // 수정된 칼럼 → 구글 재색인 요청 (콘텐츠 갱신 신호)
  if (upd) c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl(`/column/${upd.slug}`), 'URL_UPDATED'))
  return c.redirect('/admin/columns?ok=updated')
})
app.post('/api/admin/columns/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  const id = String(f.id || '')
  // 삭제 전 slug 확보 → 구글에 URL_DELETED 알림 (검색결과에서 빠르게 제거)
  const target = (await listColumns(c.env)).find((x) => x.id === id)
  await deleteColumn(c.env, id)
  if (target?.slug) c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl(`/column/${target.slug}`), 'URL_DELETED'))
  return c.redirect('/admin/columns?ok=deleted')
})

// 비포/애프터 케이스 CRUD
app.post('/api/admin/cases/create', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await createCase(c.env, {
    title: String(f.title || ''),
    category: String(f.category || ''),
    doctor: String(f.doctor || 'hwang-wooseok'),
    age: String(f.age || ''),
    gender: String(f.gender || ''),
    area: String(f.area || ''),
    period: String(f.period || ''),
    desc: String(f.desc || ''),
    photoPanoBefore: String(f.photoPanoBefore || ''),
    photoPanoAfter: String(f.photoPanoAfter || ''),
    photoOralBefore: String(f.photoOralBefore || ''),
    photoOralAfter: String(f.photoOralAfter || ''),
  })
  // 새 비포애프터 → /cases 목록 페이지 재색인 요청 (개별 URL 없음)
  c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl('/cases'), 'URL_UPDATED'))
  return c.redirect('/admin/cases?ok=created')
})
app.post('/api/admin/cases/update', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await updateCase(c.env, String(f.id || ''), {
    title: String(f.title || ''),
    category: String(f.category || ''),
    doctor: String(f.doctor || 'hwang-wooseok'),
    age: String(f.age || ''),
    gender: String(f.gender || ''),
    area: String(f.area || ''),
    period: String(f.period || ''),
    desc: String(f.desc || ''),
    photoPanoBefore: String(f.photoPanoBefore || ''),
    photoPanoAfter: String(f.photoPanoAfter || ''),
    photoOralBefore: String(f.photoOralBefore || ''),
    photoOralAfter: String(f.photoOralAfter || ''),
  })
  // 수정된 비포애프터 → /cases 재색인 요청
  c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl('/cases'), 'URL_UPDATED'))
  return c.redirect('/admin/cases?ok=updated')
})
app.post('/api/admin/cases/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await deleteCase(c.env, String(f.id || ''))
  // 케이스 삭제 후 /cases 목록 갱신 신호 (페이지 자체는 유지되므로 UPDATED)
  c.executionCtx?.waitUntil(notifyGoogleIndex(c.env, absUrl('/cases'), 'URL_UPDATED'))
  return c.redirect('/admin/cases?ok=deleted')
})

// ── 수동 일괄 색인: 주요 페이지 + 전체 칼럼을 구글에 재색인 요청 ──
// 초기 등록 직후, 또는 대량 갱신 후 한 번에 밀어넣을 때 사용.
app.post('/api/admin/index/reindex-all', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const cols = await listColumns(c.env)
  const urls = [
    absUrl('/'), absUrl('/mission'), absUrl('/treatments'), absUrl('/doctors'),
    absUrl('/cases'), absUrl('/column'), absUrl('/encyclopedia'),
    absUrl('/directions'), absUrl('/faq'), absUrl('/pricing'),
    ...cols.map((x) => absUrl(`/column/${x.slug}`)),
  ]
  c.executionCtx?.waitUntil(notifyGoogleIndexMany(c.env, urls, 'URL_UPDATED'))
  return c.redirect('/admin/settings?ok=reindex')
})

// 색인 API 연결 진단 (JSON) — 단일 URL 테스트 색인
app.get('/api/admin/index/test', async (c) => {
  if (!(await requireAdmin(c))) return c.json({ ok: false, error: 'unauthorized' }, 401)
  const r = await notifyGoogleIndex(c.env, absUrl('/'), 'URL_UPDATED')
  return c.json(r)
})

// ============================================================
// 조회수 (KV 카운터)
// ============================================================
async function bumpView(env: Bindings, key: string): Promise<number> {
  if (!env.KV) return 0
  try {
    const cur = parseInt((await env.KV.get(`views:${key}`)) || '0', 10) || 0
    const next = cur + 1
    await env.KV.put(`views:${key}`, String(next))
    return next
  } catch { return 0 }
}
async function getViews(env: Bindings, keys: string[]): Promise<Record<string, number>> {
  const out: Record<string, number> = {}
  if (!env.KV) return out
  await Promise.all(keys.map(async (k) => {
    out[k] = parseInt((await env.KV!.get(`views:${k}`)) || '0', 10) || 0
  }))
  return out
}

// ============================================================
// 지역 주소 자동완성 API
// ============================================================
app.get('/api/regions', (c) => {
  const q = c.req.query('q') || ''
  return c.json({ results: searchRegions(q) })
})

// ============================================================
// R2 파일 업로드 / 서빙 (의료법: after 사진 로그인 게이팅)
// ============================================================
app.post('/api/admin/upload', async (c) => {
  if (!(await requireAdmin(c))) return c.json({ ok: false, error: '관리자 권한이 필요합니다.' }, 401)
  if (!c.env.R2) return c.json({ ok: false, error: 'R2 스토리지가 설정되지 않았습니다.' }, 500)
  try {
    const form = await c.req.parseBody()
    const file = form.file as File
    const kind = String(form.kind || 'media') // 'after' = 로그인 게이팅 대상
    if (!file || typeof file === 'string') return c.json({ ok: false, error: '파일이 없습니다.' }, 400)
    if (!/^image\//.test(file.type)) return c.json({ ok: false, error: '이미지 파일만 업로드할 수 있습니다.' }, 400)
    if (file.size > 8 * 1024 * 1024) return c.json({ ok: false, error: '8MB 이하 이미지만 업로드할 수 있습니다.' }, 400)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const prefix = kind === 'after' ? 'cases-after' : 'media'
    const key = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    await c.env.R2.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })
    return c.json({ ok: true, key, url: `/files/${key}` })
  } catch (e) {
    return c.json({ ok: false, error: '업로드 중 오류가 발생했습니다.' }, 500)
  }
})

app.get('/files/*', async (c) => {
  if (!c.env.R2) return c.notFound()
  const key = c.req.path.replace(/^\/files\//, '')
  if (!key) return c.notFound()
  // 의료법 게이팅: 애프터 사진은 회원/관리자만
  if (key.startsWith('cases-after/')) {
    const member = await getSession(c, 'member')
    const admin = await getSession(c, 'admin')
    if (!member && !admin) return c.text('로그인 후 열람할 수 있습니다.', 403)
  }
  const obj = await c.env.R2.get(key)
  if (!obj) return c.notFound()
  return new Response(obj.body as any, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': key.startsWith('cases-after/') ? 'private, max-age=300' : 'public, max-age=31536000, immutable',
    },
  })
})

app.post('/api/reservation', async (c) => {
  try {
    const data = await c.req.json()
    if (!data.name || !data.phone || !data.agree) return c.json({ ok: false, error: '필수 항목과 개인정보 동의를 확인해 주세요.' })
    const id = `reservation:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    if (c.env.KV) await c.env.KV.put(id, JSON.stringify({ ...data, createdAt: Date.now(), status: 'new' }))
    // Resend 이메일 알림 (설정된 경우)
    if (c.env.RESEND_API_KEY && c.env.NOTIFICATION_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'noreply@thegooddc.kr',
            to: c.env.NOTIFICATION_EMAIL,
            subject: `[더착한치과] 새 예약 신청 - ${data.name}`,
            text: `이름: ${data.name}\n연락처: ${data.phone}\n진료: ${data.treatment || '-'}\n날짜: ${data.date || '-'}\n내용: ${data.message || '-'}`,
          }),
        })
      } catch {}
    }
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false, error: '예약 접수 중 오류가 발생했습니다.' })
  }
})

// ============================================================
// PWA (앱 설치 / 오프라인)
// ============================================================

// 웹 앱 매니페스트 — 홈 화면 설치 시 사용
app.get('/manifest.webmanifest', (c) => {
  return c.json({
    name: CLINIC.name,
    short_name: CLINIC.name,
    description: CLINIC.brandSlogan,
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: CLINIC.brand.primary,
    lang: 'ko',
    categories: ['medical', 'health'],
    icons: [
      { src: '/static/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: '예약 신청', short_name: '예약', url: '/reservation', icons: [{ src: '/static/icon-192.png', sizes: '192x192' }] },
      { name: '오시는 길', short_name: '오시는 길', url: '/directions', icons: [{ src: '/static/icon-192.png', sizes: '192x192' }] },
    ],
  }, 200, { 'Content-Type': 'application/manifest+json; charset=utf-8', 'Cache-Control': 'public, max-age=86400' })
})

// 서비스 워커 — 오프라인 대응 (정적 자원 cache-first, 페이지 network-first)
app.get('/sw.js', (c) => {
  const sw = `// 더착한치과 Service Worker
const CACHE = 'tgdc-v${ASSET_VERSION}';
const OFFLINE_URL = '/offline';
const PRECACHE = [
  '/',
  '/offline',
  '/static/style.css?v=${ASSET_VERSION}',
  '/static/app.js?v=${ASSET_VERSION}',
  '/static/icon-192.png',
  '/static/icon-512.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // API / 관리자 화면은 항상 네트워크
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // 정적 자원: cache-first
  if (url.pathname.startsWith('/static/')) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // 페이지(HTML): network-first → 실패 시 캐시 → 오프라인
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL)))
    );
    return;
  }
});
`
  return c.body(sw, 200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'Service-Worker-Allowed': '/' })
})

// 오프라인 폴백 페이지
app.get('/offline', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>오프라인 · ${CLINIC.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Pretendard',-apple-system,sans-serif;background:#f5f8fc;color:#114A7E;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px}
  .wrap{max-width:380px}
  .ic{font-size:56px;margin-bottom:16px}
  h1{font-size:22px;margin-bottom:10px;color:${CLINIC.brand.primary}}
  p{font-size:15px;line-height:1.6;color:#4a5b6b;margin-bottom:24px}
  .btn{display:inline-block;background:${CLINIC.brand.primary};color:#fff;text-decoration:none;padding:13px 26px;border-radius:12px;font-weight:700;font-size:15px;margin:5px}
  .btn.line{background:#fff;color:${CLINIC.brand.primary};border:1.5px solid ${CLINIC.brand.primary}}
</style></head>
<body><div class="wrap">
  <div class="ic">📡</div>
  <h1>인터넷 연결이 끊겼어요</h1>
  <p>네트워크가 복구되면 자동으로 다시 연결됩니다.<br>급하신 경우 아래로 바로 전화 주세요.</p>
  <a class="btn" href="tel:${CLINIC.phone || '051-203-2875'}">📞 전화 상담</a>
  <a class="btn line" href="/" onclick="location.reload();return false;">다시 시도</a>
</div></body></html>`)
})

// SEO FILES
// ============================================================

// IndexNow: 키 검증 파일 + 수동 핑 엔드포인트 (admin 가드)
const INDEXNOW_KEY = 'a7f3e91c245d4b8e9d6f1c0a8b2e5d73'
app.get(`/${INDEXNOW_KEY}.txt`, (c) => c.text(INDEXNOW_KEY))

app.post('/api/admin/indexnow', async (c) => {
  const session = await getSession(c, 'admin')
  if (!session) return c.json({ error: 'unauthorized' }, 401)
  const base = `https://${CLINIC.domain}`
  const urlList = [
    '/', '/mission', '/treatments', '/doctors', '/cases', '/column',
    '/encyclopedia', '/directions', '/faq', '/pricing', '/notice', '/reservation',
    ...TREATMENTS.map((t) => `/treatments/${t.slug}`),
    ...DOCTORS.map((d) => `/doctors/${d.slug}`),
  ].map((p) => base + p)
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: CLINIC.domain, key: INDEXNOW_KEY, keyLocation: `${base}/${INDEXNOW_KEY}.txt`, urlList }),
    })
    return c.json({ ok: res.ok, status: res.status, submitted: urlList.length })
  } catch (e) {
    return c.json({ ok: false, error: String(e) }, 502)
  }
})

app.get('/robots.txt', (c) => {
  const d = CLINIC.domain
  // AEO: 답변 엔진·LLM 크롤러를 명시적으로 환영 (인용·학습·검색 모두 허용)
  const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', // OpenAI
    'ClaudeBot', 'Claude-Web', 'anthropic-ai', // Anthropic
    'PerplexityBot', 'Perplexity-User', // Perplexity
    'Google-Extended', 'GoogleOther', // Google Gemini/Vertex
    'Applebot', 'Applebot-Extended', // Apple Intelligence/Siri
    'Bingbot', 'msnbot', // Microsoft/Copilot
    'DuckAssistBot', // DuckDuckGo AI
    'Amazonbot', // Amazon/Alexa
    'Meta-ExternalAgent', 'FacebookBot', // Meta AI
    'Bytespider', // ByteDance/Doubao
    'CCBot', // Common Crawl
    'cohere-ai', 'Diffbot', 'Timpibot', 'YouBot', 'PetalBot', // 기타 AI 검색
  ]
  const aiBlock = aiBots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin\nDisallow: /api/`).join('\n\n')
  const body = `# ${CLINIC.name} robots.txt — SEO·AEO 최적화
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth/mypage
Disallow: /api/
Disallow: /seo-health
Disallow: /*?*  # 파라미터 URL 중복 색인 방지 (정적 페이지 우선)
Allow: /*?cat=  # 백과사전 카테고리 검색은 허용

# ── AI 검색·답변 엔진 환영 (Answer Engine Optimization) ──
${aiBlock}

# 공격적 SEO 스크래퍼 차단 (서버 부하·콘텐츠 도용 방지)
User-agent: SemrushBot
Disallow: /
User-agent: AhrefsBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: DotBot
Disallow: /

# ── 사이트맵 (검색엔진 색인 가속) ──
Sitemap: https://${d}/sitemap.xml
Sitemap: https://${d}/sitemap-main.xml
Sitemap: https://${d}/sitemap-treatments.xml
Sitemap: https://${d}/sitemap-content.xml
Sitemap: https://${d}/sitemap-encyclopedia.xml
Sitemap: https://${d}/sitemap-areas.xml

# AI 인용용 핵심 정보 요약: https://${d}/llms.txt`
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

// 🚀 Sitemap Index — 검색엔진이 분할된 사이트맵을 한번에 발견
app.get('/sitemap.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const now = new Date().toISOString().slice(0, 10)
  const maps = ['sitemap-main.xml', 'sitemap-treatments.xml', 'sitemap-content.xml', 'sitemap-encyclopedia.xml', 'sitemap-areas.xml']
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${maps
    .map((m) => `  <sitemap><loc>${base}/${m}</loc><lastmod>${now}</lastmod></sitemap>`)
    .join('\n')}\n</sitemapindex>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

function urlsetXml(base: string, urls: { loc: string; pri: string; lastmod?: string }[]) {
  const now = new Date().toISOString().slice(0, 10)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${base}${u.loc}</loc><lastmod>${u.lastmod || now}</lastmod><priority>${u.pri}</priority></url>`)
    .join('\n')}\n</urlset>`
}

// 메인 페이지군
app.get('/sitemap-main.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const urls = [
    { loc: '/', pri: '1.0' },
    { loc: '/mission', pri: '0.8' },
    { loc: '/treatments', pri: '0.9' },
    { loc: '/doctors', pri: '0.8' },
    { loc: '/cases', pri: '0.7' },
    { loc: '/column', pri: '0.7' },
    { loc: '/encyclopedia', pri: '0.7' },
    { loc: '/directions', pri: '0.7' },
    { loc: '/faq', pri: '0.8' },
    { loc: '/pricing', pri: '0.6' },
    { loc: '/notice', pri: '0.5' },
    { loc: '/reservation', pri: '0.8' },
  ]
  return c.text(urlsetXml(base, urls), 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// 진료 + 의료진
app.get('/sitemap-treatments.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const urls: { loc: string; pri: string }[] = []
  TREATMENTS.forEach((t) => urls.push({ loc: `/treatments/${t.slug}`, pri: t.category === 'core' ? '0.9' : '0.7' }))
  DOCTORS.forEach((d) => urls.push({ loc: `/doctors/${d.slug}`, pri: '0.8' }))
  return c.text(urlsetXml(base, urls), 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// 칼럼 + 공지 (KV 동적 콘텐츠) — 이미지 사이트맵(칼럼 대표이미지) 포함
app.get('/sitemap-content.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  const now = new Date().toISOString().slice(0, 10)
  type CUrl = { loc: string; pri: string; lastmod?: string; img?: { url: string; caption?: string } }
  const urls: CUrl[] = []
  let latestColumn = ''
  try {
    const columns = await listColumns(c.env)
    columns.forEach((col: any) => {
      // 칼럼 대표이미지: 지정 cover → 본문 첫 이미지 fallback
      let img = col.cover || ''
      if (!img && Array.isArray(col.body)) {
        for (const b of col.body) {
          const m = (b?.p || '').match(/!\[(.*?)\]\((.*?)\)/)
          if (m) { img = m[2]; break }
        }
      }
      const lastmod = (col.modified || col.date || '').slice(0, 10) || now
      if (lastmod > latestColumn) latestColumn = lastmod
      urls.push({
        loc: `/column/${col.slug}`,
        pri: '0.7',
        lastmod,
        img: img ? { url: /^https?:\/\//.test(img) ? img : `${base}${img}`, caption: col.coverAlt || col.title } : undefined,
      })
    })
  } catch {}
  // 공지 목록 페이지는 1회만, lastmod는 최신 공지 기준
  try {
    const notices = await listNotices(c.env)
    if (notices.length) {
      const latest = notices.map((n: any) => (n.modified || n.date || '').slice(0, 10)).filter(Boolean).sort().pop()
      urls.push({ loc: `/notice`, pri: '0.5', lastmod: latest || now })
    }
  } catch {}
  const body = urls.length ? urls : [{ loc: '/column', pri: '0.7' } as CUrl]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body
    .map((u) => {
      const imgTag = u.img ? `\n    <image:image><image:loc>${esc(u.img.url)}</image:loc>${u.img.caption ? `<image:caption>${esc(u.img.caption)}</image:caption>` : ''}</image:image>` : ''
      return `  <url><loc>${base}${u.loc}</loc><lastmod>${u.lastmod || now}</lastmod><priority>${u.pri}</priority>${imgTag}</url>`
    })
    .join('\n')}\n</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// 백과사전 — 상세 200개는 우선순위 높임
app.get('/sitemap-encyclopedia.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const detailSlugs = new Set(DETAILED_TERMS.map((t) => t.slug))
  const urls = TERMS.map((t) => ({
    loc: `/encyclopedia/${t.slug}`,
    pri: detailSlugs.has(t.slug) ? '0.6' : '0.4',
  }))
  return c.text(urlsetXml(base, urls), 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// 지역 허브 + 지역×진료 조합
app.get('/sitemap-areas.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const urls: { loc: string; pri: string }[] = []
  // 지역 허브(랜딩)는 권위 페이지 — 우선순위 높임
  getAreaHubs().forEach((h) => urls.push({ loc: h.url, pri: '0.7' }))
  getAreaCombinations().forEach((combo) => urls.push({ loc: combo.url, pri: '0.6' }))
  return c.text(urlsetXml(base, urls.length ? urls : [{ loc: '/directions', pri: '0.7' }]), 200, {
    'Content-Type': 'application/xml; charset=utf-8',
  })
})

// ===== SEO·AEO 자동 진단 엔드포인트 =====
// 정적 데이터 기반으로 sitemap 누락·메타·스키마·AEO 자산을 점검해 JSON 리포트 반환
app.get('/seo-health', async (c) => {
  const base = `https://${CLINIC.domain}`
  const checks: { name: string; ok: boolean; detail: string; weight?: 'critical' | 'recommended' }[] = []
  const add = (name: string, ok: boolean, detail: string, weight: 'critical' | 'recommended' = 'critical') => checks.push({ name, ok, detail, weight })

  // 1) 콘텐츠 수량 점검
  add('진료 페이지', TREATMENTS.length > 0, `${TREATMENTS.length}개 진료 (핵심 ${TREATMENTS.filter(t => t.category === 'core').length})`)
  add('의료진 페이지', DOCTORS.length > 0, `${DOCTORS.length}명`)
  add('백과사전 전체', TERMS.length > 0, `${TERMS.length}개 용어`)
  add('백과사전 상세(본문)', DETAILED_TERMS.length >= 200, `${DETAILED_TERMS.length}개 상세 (목표 200)`)
  add('지역×진료 조합', getAreaCombinations().length > 0, `${getAreaCombinations().length}개 (지역 ${AREAS.length})`)
  add('지역 허브 페이지', getAreaHubs().length >= 10, `${getAreaHubs().length}개 (/clinic/:area)`)
  const areaNoIntro = AREAS.filter((a) => !a.intro || a.intro.length < 80).map((a) => a.slug)
  add('지역 고유 콘텐츠(intro)', areaNoIntro.length <= AREAS.length * 0.3, areaNoIntro.length ? `intro 부족 ${areaNoIntro.length}개` : '전 지역 고유 본문 보유')

  // 2) 진료 데이터 품질 (AEO 핵심: qa/summary/faq 누락 탐지)
  const noQa = TREATMENTS.filter(t => !t.qa || t.qa.length === 0).map(t => t.slug)
  const noSummary = TREATMENTS.filter(t => !t.summary || t.summary.length < 50).map(t => t.slug)
  const noFaq = TREATMENTS.filter(t => !t.faq || t.faq.length === 0).map(t => t.slug)
  add('진료 직답(qa) 보유', noQa.length === 0, noQa.length ? `누락: ${noQa.join(', ')}` : '전체 보유')
  add('진료 메타 description(summary)', noSummary.length === 0, noSummary.length ? `부족: ${noSummary.join(', ')}` : '전체 50자+ 보유')
  add('진료 FAQ 보유', noFaq.length === 0, noFaq.length ? `누락: ${noFaq.join(', ')}` : '전체 보유')
  // 코어 진료 볼륨(qa≥3 & sections≥5) — 핵심 페이지 품질
  const coreThin = TREATMENTS.filter(t => t.category === 'core').filter(t => (t.qa?.length || 0) < 3 || (t.sections?.length || 0) < 5).map(t => t.slug)
  add('핵심 진료 볼륨(qa3+/섹션5+)', coreThin.length === 0, coreThin.length ? `보강 필요: ${coreThin.join(', ')}` : '핵심 진료 전부 충실')
  // 진료 임상 메타 풀세트(적응증/과정/주의/회복) 보유 — AEO·의료 신뢰 E-E-A-T
  const withClinical = TREATMENTS.filter(t => t.indications?.length && t.process?.length && t.cautions?.length && t.recovery).length
  add('진료 임상 메타 풀세트(적응증/과정/주의/회복)', withClinical === TREATMENTS.length, `풀세트 ${withClinical}/${TREATMENTS.length}`, 'recommended')
  // 진료 과정(process) 타임라인 — HowTo 스키마 근거
  const withProcess = TREATMENTS.filter(t => t.process?.length).length
  add('진료 과정 타임라인(process→HowTo)', withProcess === TREATMENTS.length, `보유 ${withProcess}/${TREATMENTS.length}`, 'recommended')

  // 3) 백과사전 상세 품질 점검
  const detailNoBody = DETAILED_TERMS.filter((t: any) => !t.body || t.body.length === 0).map((t: any) => t.slug)
  const detailNoFaq = DETAILED_TERMS.filter((t: any) => !t.qa || t.qa.length === 0).length
  add('백과사전 상세 본문', detailNoBody.length === 0, detailNoBody.length ? `본문 누락 ${detailNoBody.length}개` : '전체 본문 보유')
  // FAQ는 향후 보강 권장 항목 — 점수에는 미반영, 현황만 표기
  add('백과사전 상세 FAQ(권장·향후보강)', detailNoFaq === 0, `FAQ 보유 ${DETAILED_TERMS.length - detailNoFaq}/${DETAILED_TERMS.length}`, 'recommended')

  // 4) 핵심 SEO·AEO 자산 라이브 점검 (self-fetch)
  const assets = [
    { path: '/robots.txt', type: 'text/plain', must: 'Sitemap:' },
    { path: '/sitemap.xml', type: 'xml', must: 'sitemapindex' },
    { path: '/sitemap-main.xml', type: 'xml', must: '<urlset' },
    { path: '/sitemap-treatments.xml', type: 'xml', must: '<urlset' },
    { path: '/sitemap-content.xml', type: 'xml', must: '<urlset' },
    { path: '/sitemap-encyclopedia.xml', type: 'xml', must: '<urlset' },
    { path: '/sitemap-areas.xml', type: 'xml', must: '<urlset' },
    { path: '/llms.txt', type: 'text/plain', must: '병원 정보' },
    { path: '/llms-full.txt', type: 'text/plain', must: '병원' },
  ]
  const origin = new URL(c.req.url).origin
  for (const a of assets) {
    try {
      const r = await fetch(`${origin}${a.path}`)
      const txt = await r.text()
      const ok = r.ok && txt.includes(a.must)
      add(`자산 ${a.path}`, ok, ok ? `HTTP ${r.status}, ${txt.length.toLocaleString()}자` : `HTTP ${r.status}, '${a.must}' 누락`)
    } catch (e: any) {
      add(`자산 ${a.path}`, false, `fetch 실패: ${e?.message || e}`)
    }
  }

  // 5) 홈페이지 스키마·메타 점검
  try {
    const r = await fetch(`${origin}/`)
    const html = await r.text()
    add('홈 canonical', html.includes('rel="canonical"'), html.includes('rel="canonical"') ? '있음' : '누락')
    add('홈 OG 태그', html.includes('property="og:title"'), html.includes('property="og:image"') ? 'OG+이미지 있음' : '부분')
    add('홈 JSON-LD WebSite', html.includes('"@type":"WebSite"') || html.includes('"WebSite"'), 'SearchAction')
    add('홈 JSON-LD MedicalClinic', html.includes('MedicalClinic'), '#medicalclinic @id')
    add('홈 JSON-LD Dentist', html.includes('"Dentist"'), '')
  } catch (e: any) {
    add('홈 점검', false, `fetch 실패: ${e?.message || e}`)
  }

  // 6) 지역 허브 페이지 스키마 점검 (대표 1개)
  try {
    const r = await fetch(`${origin}/clinic/myeongji`)
    const html = await r.text()
    add('지역허브 라이브', r.ok && html.includes('명지 치과'), `HTTP ${r.status}`)
    add('지역허브 LocalBusiness', html.includes('localclinic'), '#localclinic @id')
    add('지역허브 CollectionPage', html.includes('CollectionPage'), '진료 ItemList')
    add('지역허브 GeoCircle 서비스반경', html.includes('GeoCircle'), '20km 반경')
  } catch (e: any) {
    add('지역허브 점검', false, `fetch 실패: ${e?.message || e}`)
  }

  // 7) 진료 상세 슈퍼 스키마 점검 (대표: 임플란트)
  try {
    const r = await fetch(`${origin}/treatments/implant`)
    const html = await r.text()
    add('진료상세 라이브', r.ok && html.includes('임플란트'), `HTTP ${r.status}`)
    add('진료상세 MedicalWebPage(E-E-A-T)', html.includes('MedicalWebPage') && html.includes('lastReviewed'), '검토주체·검토일')
    add('진료상세 MedicalProcedure 적응증', html.includes('MedicalIndication'), 'indication 노출')
    add('진료상세 HowTo 진료과정', html.includes('"HowTo"'), '단계 구조화')
    add('진료상세 임상 섹션 렌더', html.includes('이런 분께 권합니다') && html.includes('진료 후 회복'), '적응증·회복 본문')
  } catch (e: any) {
    add('진료상세 점검', false, `fetch 실패: ${e?.message || e}`)
  }

  // 점수는 critical 항목 기준, 권장 항목은 별도 표기
  const critical = checks.filter(c => c.weight !== 'recommended')
  const passed = critical.filter(c => c.ok).length
  const total = critical.length
  const score = Math.round((passed / total) * 100)
  const recommended = checks.filter(c => c.weight === 'recommended')
  const recPassed = recommended.filter(c => c.ok).length

  // ?format=html 이면 사람이 보기 좋은 표, 기본은 JSON
  if (c.req.query('format') === 'html') {
    const icon = (ck: typeof checks[number]) => ck.ok ? '✅' : (ck.weight === 'recommended' ? '⚠️' : '❌')
    const rows = checks.map(ck => `<tr class="${ck.ok ? 'ok' : (ck.weight === 'recommended' ? 'warn' : 'ng')}"><td>${icon(ck)}</td><td>${ck.name}</td><td>${ck.detail}</td></tr>`).join('')
    return c.html(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>SEO Health · ${CLINIC.name}</title><meta name="robots" content="noindex"><style>body{font-family:system-ui,sans-serif;max-width:860px;margin:40px auto;padding:0 20px;color:#222}h1{font-size:22px}.score{font-size:48px;font-weight:800;color:${score >= 90 ? '#1a7f37' : score >= 70 ? '#bf8700' : '#cf222e'}}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:14px}td{padding:8px 10px;border-bottom:1px solid #eee}tr.ng{background:#fff5f5}tr.warn{background:#fffbe6}.muted{color:#888;font-size:13px}</style></head><body><h1>SEO·AEO 슈퍼머신 자가진단</h1><div class="score">${score}점</div><p class="muted">필수 ${passed}/${total} 통과 · 권장 ${recPassed}/${recommended.length} · ${base} · ${new Date().toISOString().slice(0,19)}Z</p><table><thead><tr><td></td><td>항목</td><td>상세</td></tr></thead><tbody>${rows}</tbody></table></body></html>`)
  }

  return c.json({
    site: CLINIC.name,
    base,
    score,
    passed,
    total,
    recommended: `${recPassed}/${recommended.length}`,
    checkedAt: new Date().toISOString(),
    checks,
  })
})

app.get('/llms.txt', (c) => {
  const d = CLINIC.domain
  const body = `# ${CLINIC.name} (${CLINIC.nameEn})

> ${CLINIC.philosophy.mission} 부산 강서구 명지의 통합치의학과 전문의 치과입니다.

이 파일은 AI 검색·답변 엔진(ChatGPT, Perplexity, Claude, Gemini 등)이 ${CLINIC.name}의 핵심 정보를 정확히 인용하도록 돕기 위해 제공됩니다.

## 병원 정보
- 정식명칭: ${CLINIC.name} (${CLINIC.nameEn})
- 위치: ${CLINIC.address}
- 좌표: 위도 ${CLINIC.geo.lat}, 경도 ${CLINIC.geo.lng}
- 전화: ${CLINIC.phone}
- 대표원장: ${CLINIC.director} ${CLINIC.directorTitle} (치의학박사, 통합치의학과 전문의)
- 개원: ${CLINIC.openedYear}년
- 진료지역: 부산 강서구 명지, 부산 강서구, 김해, 창원 생활권
- 공식 웹사이트: https://${d}
- 카카오톡 채널: ${CLINIC.sns.kakao}

## 진료시간 (요일별)
${CLINIC.hours.map((h: any) => `- ${h.day}요일: ${h.closed ? '정기휴무' : `${h.time}${h.lunch ? ` (점심 ${h.lunch})` : ' (점심시간 없음)'}${h.note ? ` · ${h.note}` : ''}`}`).join('\n')}
- 요약: ${CLINIC.hoursNote}

## 자주 묻는 질문 (AI 인용용 핵심 답변)
- Q. 더착한치과는 어디에 있나요? A. 부산 강서구 명지오션시티4로 59 스타빌딩 601·602호에 있습니다. 명지국제신도시·강서구·김해 장유·사하구 하단에서 가깝습니다.
- Q. 야간 진료를 하나요? A. 월요일과 수요일은 저녁 8시(20:00)까지 진료합니다.
- Q. 토요일 진료를 하나요? A. 네, 토요일 오전 8시부터 12시까지 점심시간 없이 진료합니다. (일요일은 정기휴무)
- Q. 어떤 진료를 받을 수 있나요? A. 디지털 가이드 임플란트, 투명교정, 미니쉬·라미네이트 등 심미치료를 비롯해 통합치의학과 전반의 진료를 제공합니다.
- Q. 주차가 가능한가요? A. ${CLINIC.directions.car}.
- Q. 대표원장은 누구인가요? A. ${CLINIC.director} ${CLINIC.directorTitle}(치의학박사, 통합치의학과 전문의)입니다.

## 핵심 진료
${TREATMENTS.filter((t) => t.category === 'core').map((t) => `- ${t.name}: ${t.tagline} → https://${d}/treatments/${t.slug}`).join('\n')}

## 일반 진료
${TREATMENTS.filter((t) => t.category !== 'core').map((t) => `- ${t.name} → https://${d}/treatments/${t.slug}`).join('\n')}

## 의료진
${DOCTORS.map((doc: any) => `- ${doc.name} ${doc.title || ''} (${doc.license || ''}) → https://${d}/doctors/${doc.slug}`).join('\n')}

## 진료 가능 지역 (내원 가능 지역 · 지역별 안내 페이지)
${CLINIC.name}는 부산 강서구 명지에 위치하며 아래 지역에서 가까워 내원이 편리합니다. 각 지역별 안내 페이지를 제공합니다.
${AREAS.map((a) => `- ${a.name} (${a.fullName}): ${a.distance || a.desc}${a.transit ? ` · ${a.transit}` : ''} → https://${d}/clinic/${a.slug}`).join('\n')}

## 지역 × 진료 안내 (${getAreaCombinations().length}개)
지역별로 임플란트·투명교정·미니쉬·치아교정 안내 페이지를 제공합니다. 예) https://${d}/area/myeongji-implant (명지 임플란트)

## 치과 용어 백과사전 (상세 ${DETAILED_TERMS.length}개)
환자가 자주 검색하는 치과 용어를 각 약 1,000자로 정확하게 설명합니다.
${DETAILED_TERMS.map((t) => `- ${t.term}: ${t.def} → https://${d}/encyclopedia/${t.slug}`).join('\n')}

## 주요 페이지
- 병원소개: https://${d}/mission
- 의료진: https://${d}/doctors
- 비포/애프터: https://${d}/cases
- 자주 묻는 질문: https://${d}/faq
- 진료비 안내: https://${d}/pricing
- 오시는 길: https://${d}/directions
- 진료 예약: https://${d}/reservation
- 전체 상세 정보: https://${d}/llms-full.txt

## 안내
홈페이지의 의료 정보는 일반적인 안내이며, 정확한 진단과 치료는 반드시 내원 상담을 통해 이루어집니다. 치료 결과에는 개인차가 있습니다.
`
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

app.get('/llms-full.txt', (c) => {
  const d = CLINIC.domain
  let body = `# ${CLINIC.name} 전체 정보 (AI 인용용 풀텍스트)\n\n`
  body += `${CLINIC.philosophy?.story || ''}\n\n`
  body += `## 병원 개요\n- 명칭: ${CLINIC.name} (${CLINIC.nameEn})\n- 주소: ${CLINIC.address}\n- 전화: ${CLINIC.phone}\n- 진료시간: ${CLINIC.hoursNote}\n- 대표원장: ${CLINIC.director} ${CLINIC.directorTitle}\n\n`

  body += `# 진료 안내\n\n`
  TREATMENTS.forEach((t) => {
    body += `## ${t.name}\n${t.tagline || ''}\n${t.summary || ''}\nURL: https://${d}/treatments/${t.slug}\n`
    ;(t.qa || []).forEach((qa: any) => { body += `Q: ${qa.question}\nA: ${qa.answer}\n` })
    body += '\n'
  })

  body += `# 치과 용어 백과사전 (상세 ${DETAILED_TERMS.length}개)\n\n`
  DETAILED_TERMS.forEach((t) => {
    body += `## ${t.term}${t.reading ? ` (${t.reading})` : ''}\n`
    body += `분류: ${t.category}\n`
    body += `정의: ${t.def}\n`
    if (t.body && t.body.length) body += `${t.body.join('\n')}\n`
    if (t.qa && t.qa.length) t.qa.forEach((qa: any) => { body += `Q: ${qa.q}\nA: ${qa.a}\n` })
    body += `URL: https://${d}/encyclopedia/${t.slug}\n\n`
  })

  body += `\n---\n홈페이지의 의료 정보는 일반적인 안내이며, 정확한 진단과 치료는 반드시 내원 상담을 통해 이루어집니다. 치료 결과에는 개인차가 있습니다.\n`
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

// 납품 안내서 (정적 HTML, noindex)
import handoverHtml from '../public/handover-thegooddc-2026.html?raw'
app.get('/handover-thegooddc-2026.html', (c) => c.html(handoverHtml))

// 404
app.notFound((c) => c.html(notFoundPage(), 404))

export default app

// ===== helpers =====
function legalPage(title: string, html: string) {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | {CLINIC.name}</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href={`/static/style.css?v=${ASSET_VERSION}`} />
      </head>
      <body>
        <section class="page-hero"><div class="container ph-inner" style="padding-top:60px"><h1>{title}</h1></div></section>
        <section class="sec"><div class="container article-body" dangerouslySetInnerHTML={{ __html: html }}></div></section>
        <div class="container" style="padding-bottom:60px"><a href="/" class="btn btn-outline"><i class="fa-solid fa-house"></i> 홈으로</a></div>
      </body>
    </html>
  )
}

function notFoundPage() {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, follow" />
        <title>페이지를 찾을 수 없습니다 | {CLINIC.name}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" />
        <link rel="stylesheet" href={`/static/style.css?v=${ASSET_VERSION}`} />
      </head>
      <body>
        <section class="hero" style="min-height:100vh">
          <div class="hero-bg"></div><div class="hero-overlay"></div>
          <div class="container" style="text-align:center;color:#fff;position:relative;max-width:680px">
            <div style="font-size:120px;font-weight:900;line-height:1;opacity:0.3">404</div>
            <h1 style="font-size:36px;margin:20px 0">페이지를 찾을 수 없습니다</h1>
            <p style="opacity:0.9;margin-bottom:30px">요청하신 페이지가 존재하지 않거나 이동되었습니다.<br />아래 메뉴에서 원하시는 정보를 찾아보세요.</p>
            <div class="hero-actions" style="justify-content:center;margin-bottom:28px">
              <a href="/" class="btn btn-accent"><i class="fa-solid fa-house"></i> 홈으로</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost" data-track="phone" data-track-loc="404"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
            <nav aria-label="추천 링크" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
              <a href="/treatments" class="chip" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.3)">진료 안내</a>
              <a href="/doctors" class="chip" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.3)">의료진</a>
              <a href="/cases" class="chip" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.3)">비포/애프터</a>
              <a href="/directions" class="chip" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.3)">오시는 길</a>
              <a href="/reservation" class="chip" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.3)">진료 예약</a>
            </nav>
          </div>
        </section>
      </body>
    </html>
  )
}

const PRIVACY_TEXT = `<p>${CLINIC.name}(이하 '병원')는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다.</p>
<h2>1. 수집하는 개인정보 항목</h2><p>병원은 회원가입 및 진료 예약 상담을 위해 이름, 연락처, 이메일을 수집합니다.</p>
<h2>2. 개인정보의 이용 목적</h2><p>수집된 개인정보는 진료 예약 접수 및 상담 안내 목적으로만 이용됩니다.</p>
<h2>3. 개인정보의 보유 및 이용 기간</h2><p>관련 법령에 따라 일정 기간 보관 후 안전하게 파기합니다.</p>
<h2>4. 마케팅 정보 수신</h2><p>선택 동의 시에만 진료 안내 및 이벤트 정보를 발송하며, 언제든지 수신을 거부할 수 있습니다.</p>`

const TERMS_TEXT = `<p>본 약관은 ${CLINIC.name} 홈페이지 이용에 관한 조건을 규정합니다.</p>
<h2>제1조 (목적)</h2><p>본 약관은 홈페이지가 제공하는 서비스의 이용 조건 및 절차를 정함을 목적으로 합니다.</p>
<h2>제2조 (서비스의 제공)</h2><p>병원은 진료 안내, 예약 상담, 콘텐츠 제공 등의 서비스를 제공합니다.</p>
<h2>제3조 (의료 정보 안내)</h2><p>홈페이지의 의료 정보는 일반적인 안내이며, 정확한 진단과 치료는 반드시 내원 상담을 통해 이루어집니다.</p>`
