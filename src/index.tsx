import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { CLINIC } from './data/clinic'
import { TREATMENTS } from './data/treatments'
import { DOCTORS } from './data/doctors'
import { TERMS } from './data/encyclopedia'
import { getAreaCombinations, AREAS } from './data/areas'
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
import { AreaPage } from './routes/area'
import { LoginPage, RegisterPage, MyPage, AdminLoginPage, AdminDashboard, AdminNoticesPage, AdminColumnsPage, AdminCasesPage } from './routes/auth'
import {
  listNotices, createNotice, updateNotice, deleteNotice,
  listColumns, getColumn, createColumn, updateColumn, deleteColumn,
  listCases, createCase, updateCase, deleteCase,
} from './lib/content-store'

type Bindings = {
  KV?: KVNamespace
  ADMIN_PASSWORD?: string
  ADMIN_SESSION_SECRET?: string
  SESSION_SECRET?: string
  RESEND_API_KEY?: string
  NOTIFICATION_EMAIL?: string
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())

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
app.get('/', (c) => c.html(<HomePage />))
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
app.get('/column/:slug', async (c) => c.html(<ColumnDetailPage slug={c.req.param('slug')} column={await getColumn(c.env, c.req.param('slug'))} />))
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
  const [notices, columns, cases] = await Promise.all([listNotices(c.env), listColumns(c.env), listCases(c.env)])
  return c.html(<AdminDashboard stats={{ members, reservations, notices: notices.length, columns: columns.length, cases: cases.length }} />)
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
  return c.html(<AdminColumnsPage columns={await listColumns(c.env)} ok={c.req.query('ok')} />)
})
app.get('/admin/cases', async (c) => {
  const s = await getSession(c, 'admin')
  if (!s) return c.redirect('/admin')
  return c.html(<AdminCasesPage cases={await listCases(c.env)} ok={c.req.query('ok')} />)
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
app.post('/api/admin/notices/create', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await createNotice(c.env, {
    title: String(f.title || ''),
    body: String(f.body || ''),
    date: String(f.date || ''),
    pinned: f.pinned === 'on' || f.pinned === 'true',
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
  await createColumn(c.env, {
    title: String(f.title || ''),
    slug: String(f.slug || ''),
    excerpt: String(f.excerpt || ''),
    date: String(f.date || ''),
    author: String(f.author || 'hwang-wooseok'),
    related: String(f.related || ''),
    bodyText: String(f.bodyText || ''),
  })
  return c.redirect('/admin/columns?ok=created')
})
app.post('/api/admin/columns/update', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await updateColumn(c.env, String(f.id || ''), {
    title: String(f.title || ''),
    slug: String(f.slug || ''),
    excerpt: String(f.excerpt || ''),
    date: String(f.date || ''),
    author: String(f.author || 'hwang-wooseok'),
    related: String(f.related || ''),
    bodyText: String(f.bodyText || ''),
  })
  return c.redirect('/admin/columns?ok=updated')
})
app.post('/api/admin/columns/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await deleteColumn(c.env, String(f.id || ''))
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
  })
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
  })
  return c.redirect('/admin/cases?ok=updated')
})
app.post('/api/admin/cases/delete', async (c) => {
  if (!(await requireAdmin(c))) return c.redirect('/admin')
  const f = await c.req.parseBody()
  await deleteCase(c.env, String(f.id || ''))
  return c.redirect('/admin/cases?ok=deleted')
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
            from: 'noreply@thegooddental.kr',
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

// Google OAuth placeholder
app.get('/api/auth/google', (c) => {
  return c.html(legalPage('Google 로그인 준비 중', '<p>Google OAuth 연동은 배포 시 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET 환경변수 설정 후 활성화됩니다.</p><p><a href="/auth/login">로그인으로 돌아가기</a></p>'))
})

// ============================================================
// SEO FILES
// ============================================================
app.get('/robots.txt', (c) => {
  const body = `User-agent: *\nAllow: /\n\n# AI crawlers welcome\nUser-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: https://${CLINIC.domain}/sitemap.xml`
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

app.get('/sitemap.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const now = new Date().toISOString().slice(0, 10)
  const urls: { loc: string; pri: string }[] = [
    { loc: '/', pri: '1.0' },
    { loc: '/mission', pri: '0.8' },
    { loc: '/treatments', pri: '0.9' },
    { loc: '/doctors', pri: '0.8' },
    { loc: '/cases', pri: '0.7' },
    { loc: '/column', pri: '0.7' },
    { loc: '/encyclopedia', pri: '0.6' },
    { loc: '/directions', pri: '0.7' },
    { loc: '/faq', pri: '0.7' },
    { loc: '/pricing', pri: '0.6' },
    { loc: '/notice', pri: '0.5' },
    { loc: '/reservation', pri: '0.8' },
  ]
  TREATMENTS.forEach((t) => urls.push({ loc: `/treatments/${t.slug}`, pri: t.category === 'core' ? '0.9' : '0.7' }))
  DOCTORS.forEach((d) => urls.push({ loc: `/doctors/${d.slug}`, pri: '0.8' }))
  getAreaCombinations().forEach((combo) => urls.push({ loc: combo.url, pri: '0.6' }))
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${base}${u.loc}</loc><lastmod>${now}</lastmod><priority>${u.pri}</priority></url>`)
    .join('\n')}\n</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

app.get('/sitemap-encyclopedia.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  const now = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${TERMS.map(
    (t) => `  <url><loc>${base}/encyclopedia/${t.slug}</loc><lastmod>${now}</lastmod><priority>0.4</priority></url>`
  ).join('\n')}\n</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

app.get('/llms.txt', (c) => {
  const body = `# ${CLINIC.name} (${CLINIC.nameEn})

> ${CLINIC.philosophy.mission} 부산 강서구 명지의 통합치의학과 전문의 치과입니다.

## 병원 정보
- 위치: ${CLINIC.address}
- 전화: ${CLINIC.phone}
- 진료시간: ${CLINIC.hoursNote}
- 대표원장: ${CLINIC.director} (치의학박사, 통합치의학과 전문의, 24년 임상경험)

## 핵심 진료
${TREATMENTS.filter((t) => t.category === 'core').map((t) => `- ${t.name}: ${t.tagline} → https://${CLINIC.domain}/treatments/${t.slug}`).join('\n')}

## 전체 진료
${TREATMENTS.filter((t) => t.category === 'general').map((t) => `- ${t.name} → https://${CLINIC.domain}/treatments/${t.slug}`).join('\n')}

## 주요 페이지
- 병원소개: https://${CLINIC.domain}/mission
- 의료진: https://${CLINIC.domain}/doctors
- 비포/애프터: https://${CLINIC.domain}/cases
- 자주 묻는 질문: https://${CLINIC.domain}/faq
- 진료 예약: https://${CLINIC.domain}/reservation
`
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

app.get('/llms-full.txt', (c) => {
  let body = `# ${CLINIC.name} 전체 정보\n\n${CLINIC.philosophy.story}\n\n`
  TREATMENTS.forEach((t) => {
    body += `## ${t.name}\n${t.tagline}\n${t.summary}\n`
    t.qa.forEach((qa) => { body += `Q: ${qa.question}\nA: ${qa.answer}\n` })
    body += '\n'
  })
  return c.text(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

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
        <link rel="stylesheet" href="/static/style.css" />
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
        <title>페이지를 찾을 수 없습니다 | {CLINIC.name}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <section class="hero" style="min-height:100vh">
          <div class="hero-bg"></div><div class="hero-overlay"></div>
          <div class="container" style="text-align:center;color:#fff;position:relative">
            <div style="font-size:120px;font-weight:900;line-height:1;opacity:0.3">404</div>
            <h1 style="font-size:36px;margin:20px 0">페이지를 찾을 수 없습니다</h1>
            <p style="opacity:0.9;margin-bottom:30px">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
            <div class="hero-actions" style="justify-content:center">
              <a href="/" class="btn btn-accent"><i class="fa-solid fa-house"></i> 홈으로</a>
              <a href="/treatments" class="btn btn-ghost"><i class="fa-solid fa-tooth"></i> 진료 안내</a>
            </div>
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
