// ============================================================
// 관리자 통계 페이지 (/admin/stats)
// 데이터: PF 중앙 대시보드 API — 토큰은 서버사이드에서만 사용
// ============================================================

export const STATS_KEY = 'a8edcf4adf130dcd56e2e50dc93d667ef039ea541847b489'
const STATS_ENDPOINT = 'https://pf-dashboard-2nt.pages.dev/api/stats/thegooddc.kr'

export interface StatsData {
  domain: string
  configured: boolean
  hasGa?: boolean
  updatedAt?: string
  range?: { start: string; end: string }
  gsc?: {
    clicks: number; impressions: number; ctr: number; position: number | null
    delta: { clicks: number | null; impressions: number | null; ctr: number | null; position: number | null }
    topQueries: { query: string; clicks: number; impressions: number }[]
    topPages: { page: string; clicks: number; impressions: number }[]
    dailyClicks: { date: string; clicks: number }[]
  } | null
  ga?: {
    users: number; sessions: number; pageviews: number; avgDuration: number; leads: number
    delta: { users: number | null; sessions: number | null; leads: number | null }
    dailyUsers: { date: string; users: number; sessions: number }[]
  } | null
  ai?: {
    sessions: number; share: number; delta: number | null
    bySource: Record<string, number>
    topLandingPages?: { page: string; sessions: number }[]
  } | null
}

export async function fetchDashboardStats(): Promise<StatsData | null> {
  try {
    const res = await fetch(STATS_ENDPOINT, {
      headers: { Authorization: `Bearer ${STATS_KEY}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return (await res.json()) as StatsData
  } catch {
    return null
  }
}

// ---------- 헬퍼 ----------
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
const num = (n: number | null | undefined) => (n == null || !Number.isFinite(n) ? '-' : n.toLocaleString('ko-KR'))

function deltaBadge(v: number | null | undefined, invert = false): string {
  if (v == null || !Number.isFinite(v)) return ''
  if (v === 0) return '<span class="m-d flat">보합</span>'
  const up = v > 0
  const good = invert ? !up : up
  return `<span class="m-d ${good ? 'good' : 'bad'}">${up ? '▲' : '▼'} ${Math.abs(v)}%</span>`
}

function sparkline(values: number[], stroke: string, fillOpacity = 0.12): string {
  if (!values.length) return '<p class="empty-line">데이터가 아직 없습니다.</p>'
  const w = 600, h = 70, pad = 6
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0
  const pt = (v: number, i: number) => `${(pad + i * step).toFixed(1)},${(h - pad - (v / max) * (h - pad * 2)).toFixed(1)}`
  const line = values.map(pt).join(' ')
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:70px;display:block" role="img" aria-label="일별 추이 그래프">
    <polygon points="${pad},${h - pad} ${line} ${(pad + (values.length - 1) * step).toFixed(1)},${h - pad}" fill="${stroke}" opacity="${fillOpacity}"/>
    <polyline points="${line}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`
}

const AI_LABELS: Record<string, string> = { chatgpt: 'ChatGPT', perplexity: 'Perplexity', claude: 'Claude', gemini: 'Gemini', etc: '기타 AI' }

function buildInsights(d: StatsData): string[] {
  const ins: string[] = []
  const g = d.gsc, a = d.ga, ai = d.ai
  if (g) {
    if (g.delta?.clicks != null && g.delta.clicks >= 20) ins.push(`최근 28일 검색 클릭이 이전 기간 대비 ${g.delta.clicks}% 증가했습니다. 상승 흐름이 유지되고 있습니다.`)
    else if (g.delta?.clicks != null && g.delta.clicks <= -20) ins.push(`검색 클릭이 이전 기간 대비 ${Math.abs(g.delta.clicks)}% 감소했습니다. 최근 콘텐츠의 색인 상태를 점검할 시점입니다.`)
    if (g.impressions > 0 && g.clicks < 100) ins.push(`노출 ${num(g.impressions)}회 대비 클릭 ${num(g.clicks)}회 — 노출이 먼저 쌓이고 클릭이 따라오는 초기 구간의 정상적인 흐름입니다.`)
    if (g.position != null && g.position > 20) ins.push(`평균 게재순위 ${g.position}위 — 롱테일 키워드부터 순위가 앞으로 이동하는 시기입니다.`)
    else if (g.position != null && g.position > 0 && g.position <= 10) ins.push(`평균 게재순위 ${g.position}위로 구글 1페이지권에 진입했습니다.`)
    if (ins.length < 4 && g.topQueries?.length) ins.push(`현재 유입 상위 검색어는 "${g.topQueries[0].query}"입니다. 관련 콘텐츠를 보강하면 유입 확대에 유리합니다.`)
  }
  if (ai && ai.share >= 1) ins.push(`AI 검색(ChatGPT·Perplexity 등) 유입 비중이 ${ai.share}%입니다. AEO 구조화 세팅이 작동하고 있습니다.`)
  if (a && a.leads > 0) ins.push(`최근 28일간 전화·예약 등 리드 액션이 ${num(a.leads)}건 발생했습니다.`)
  const fillers = [
    '사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅이 적용되어 색인은 자동으로 진행됩니다.',
    '칼럼·공지 등 콘텐츠를 꾸준히 발행할수록 롱테일 노출 확대 속도가 빨라집니다.',
    '통계는 구글 검색콘솔·GA4 기준 최근 28일 데이터이며 매일 자동 갱신됩니다.',
  ]
  for (const f of fillers) { if (ins.length >= 3) break; ins.push(f) }
  return ins.slice(0, 5)
}

// ---------- 페이지 ----------
export function renderStatsPage(d: StatsData | null): string {
  const configured = !!d?.configured
  const g = configured ? d?.gsc : null
  const a = configured ? d?.ga : null
  const ai = configured ? d?.ai : null
  const emphasize = !configured || (g ? g.clicks < 100 : true)

  const timeline = `
    <ol class="timeline">
      <li><b>0~1개월</b><span>색인</span></li>
      <li><b>1~3개월</b><span>롱테일 노출</span></li>
      <li><b>3~6개월</b><span>지역+진료 키워드</span></li>
      <li><b>6개월~</b><span>경쟁 키워드 본순위</span></li>
    </ol>`

  const expectCard = `
  <section class="card expect ${emphasize ? 'big' : 'slim'}">
    <h2><span class="ico">⏳</span> 검색 순위는 시간이 필요합니다</h2>
    ${emphasize ? '<p class="expect-msg">신규 사이트는 색인과 순위 안착까지 시간이 걸립니다. 본격적인 순위 경쟁은 개설 6개월부터 시작됩니다. 사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅은 모두 완료되어 있습니다.</p>' : ''}
    ${timeline}
  </section>`

  let body = ''
  if (!configured) {
    body = `
  <section class="card wait">
    <h3>데이터 연동 대기 중</h3>
    <p>구글 검색콘솔·GA4 데이터 연동이 준비되는 대로 이 페이지에 최근 28일 검색·방문 통계가 자동으로 표시됩니다.</p>
  </section>`
  } else {
    const gaCards = d!.hasGa && a
      ? `
      <div class="metric"><div class="m-l">방문 사용자</div><div class="m-v">${num(a.users)}</div>${deltaBadge(a.delta?.users)}</div>
      <div class="metric"><div class="m-l">세션</div><div class="m-v">${num(a.sessions)}</div>${deltaBadge(a.delta?.sessions)}</div>
      <div class="metric"><div class="m-l">리드(전화·예약)</div><div class="m-v">${num(a.leads)}</div>${deltaBadge(a.delta?.leads)}</div>
      <div class="metric"><div class="m-l">AI 검색 유입</div><div class="m-v">${num(ai?.sessions)}</div><div class="m-sub">전체의 ${ai?.share ?? 0}%</div>${deltaBadge(ai?.delta)}</div>`
      : `<div class="metric pending" style="grid-column:1/-1"><div class="m-l">GA4 방문 분석</div><div class="m-v" style="font-size:18px">GA 연동 예정</div><div class="m-sub">연동 완료 후 사용자·세션·리드·AI 유입이 표시됩니다.</div></div>`

    const queriesRows = (g?.topQueries ?? []).slice(0, 10).map((q, i) =>
      `<tr><td class="rk">${i + 1}</td><td>${esc(q.query)}</td><td class="tr-num">${num(q.clicks)}</td><td class="tr-num">${num(q.impressions)}</td></tr>`).join('')
    const pagesRows = (g?.topPages ?? []).slice(0, 10).map((p, i) => {
      const path = String(p.page || '').replace(/^https?:\/\/[^/]+/, '') || '/'
      return `<tr><td class="rk">${i + 1}</td><td class="pg">${esc(path)}</td><td class="tr-num">${num(p.clicks)}</td><td class="tr-num">${num(p.impressions)}</td></tr>`
    }).join('')
    const aiRows = ai
      ? Object.entries(ai.bySource || {}).map(([k, v]) =>
        `<tr><td>${esc(AI_LABELS[k] || k)}</td><td class="tr-num">${num(v as number)}</td></tr>`).join('')
      : ''

    body = `
  <section class="card">
    <h3>검색 성과 <span class="cap">구글 검색콘솔 · 최근 28일</span></h3>
    <div class="metrics">
      <div class="metric"><div class="m-l">클릭</div><div class="m-v">${num(g?.clicks)}</div>${deltaBadge(g?.delta?.clicks)}</div>
      <div class="metric"><div class="m-l">노출</div><div class="m-v">${num(g?.impressions)}</div>${deltaBadge(g?.delta?.impressions)}</div>
      <div class="metric"><div class="m-l">CTR</div><div class="m-v">${g ? (g.ctr * 100).toFixed(2) + '%' : '-'}</div>${deltaBadge(g?.delta?.ctr)}</div>
      <div class="metric"><div class="m-l">평균 게재순위</div><div class="m-v">${g?.position ?? '-'}</div>${deltaBadge(g?.delta?.position, true)}</div>
    </div>
    <div class="spark"><p class="spark-t">일별 검색 클릭</p>${sparkline((g?.dailyClicks ?? []).map((x) => x.clicks), '#0C7CA4')}</div>
  </section>

  <section class="card">
    <h3>방문·전환 <span class="cap">GA4 · 최근 28일</span></h3>
    <div class="metrics">${gaCards}</div>
    ${d!.hasGa && a ? `<div class="spark"><p class="spark-t">일별 방문 사용자</p>${sparkline((a.dailyUsers ?? []).map((x) => x.users), '#43C8F4')}</div>` : ''}
  </section>

  <div class="tables">
    <section class="card">
      <h3>상위 검색어 TOP 10</h3>
      ${queriesRows ? `<table><thead><tr><th></th><th>검색어</th><th class="tr-num">클릭</th><th class="tr-num">노출</th></tr></thead><tbody>${queriesRows}</tbody></table>` : '<p class="empty-line">집계된 검색어가 아직 없습니다.</p>'}
    </section>
    <section class="card">
      <h3>상위 유입 페이지 TOP 10</h3>
      ${pagesRows ? `<table><thead><tr><th></th><th>페이지</th><th class="tr-num">클릭</th><th class="tr-num">노출</th></tr></thead><tbody>${pagesRows}</tbody></table>` : '<p class="empty-line">집계된 페이지가 아직 없습니다.</p>'}
    </section>
    <section class="card">
      <h3>AI 검색 소스별 유입</h3>
      ${aiRows ? `<table><thead><tr><th>소스</th><th class="tr-num">세션</th></tr></thead><tbody>${aiRows}</tbody></table>` : '<p class="empty-line">GA 연동 후 표시됩니다.</p>'}
    </section>
  </div>`
  }

  const insights = d ? buildInsights(d) : ['통계 서버와의 연결이 원활하지 않습니다. 잠시 후 새로고침해 주세요.', '사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅은 정상 적용되어 있습니다.', '데이터 연동이 준비되는 대로 이 페이지에 자동으로 표시됩니다.']
  const insightsHtml = `
  <section class="card">
    <h3>자동 인사이트</h3>
    <ul class="insights">${insights.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  </section>`

  const rangeTxt = d?.range ? `${d.range.start} ~ ${d.range.end}` : '최근 28일'

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>검색·방문 통계 | 더착한치과 관리자</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>
:root{--ink:#1A222E;--soft:#6A737E;--faint:#9AA1AA;--accent:#0C7CA4;--accent-l:#43C8F4;--bg:#F2F5F7;--line:#E1E7EC;--good:#177245;--bad:#B03A2E}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,sans-serif;background:var(--bg);color:var(--ink);font-size:15px;line-height:1.6}
.topbar{background:var(--ink);color:#fff;padding:14px 22px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.topbar b{font-size:16px;letter-spacing:-.01em}
.topbar .cap{color:rgba(255,255,255,.55);font-size:12.5px}
.topbar a{margin-left:auto;color:#fff;text-decoration:none;font-size:13px;background:rgba(255,255,255,.12);padding:6px 14px;border-radius:20px}
.topbar a:hover{background:rgba(255,255,255,.22)}
main{max-width:1080px;margin:0 auto;padding:26px 18px 60px;display:flex;flex-direction:column;gap:18px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px 24px}
.card h3{font-size:16.5px;margin-bottom:14px;letter-spacing:-.01em}
.card h3 .cap{font-size:12px;color:var(--faint);font-weight:500;margin-left:8px}
.expect h2{font-size:20px;letter-spacing:-.01em;margin-bottom:10px}
.expect .ico{margin-right:4px}
.expect.big{border-color:var(--accent);border-width:1.5px;background:linear-gradient(180deg,#F4FAFD,#fff);padding:30px 28px}
.expect.big h2{font-size:24px;color:var(--accent-d,#08597A)}
.expect-msg{color:var(--soft);max-width:720px;margin-bottom:18px}
.expect.slim{padding:16px 24px}.expect.slim h2{font-size:16px;margin-bottom:8px}
.timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;list-style:none;counter-reset:tl}
.timeline li{background:#F6F9FB;border:1px solid var(--line);border-radius:10px;padding:12px 14px;position:relative}
.timeline li b{display:block;font-size:13px;color:var(--accent)}
.timeline li span{font-size:13.5px;font-weight:600}
.expect.slim .timeline li{padding:8px 12px}
.wait{border-style:dashed;text-align:center;padding:34px}
.wait h3{color:var(--accent)}
.wait p{color:var(--soft);max-width:520px;margin:0 auto}
.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.metric{background:#F8FAFB;border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.metric .m-l{font-size:12.5px;color:var(--soft)}
.metric .m-v{font-size:24px;font-weight:800;letter-spacing:-.02em;margin:2px 0}
.metric .m-sub{font-size:12px;color:var(--faint)}
.m-d{font-size:12px;font-weight:700}.m-d.good{color:var(--good)}.m-d.bad{color:var(--bad)}.m-d.flat{color:var(--faint)}
.metric.pending{border-style:dashed;color:var(--soft)}
.spark{margin-top:16px}
.spark-t{font-size:12.5px;color:var(--soft);margin-bottom:4px}
.tables{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.tables .card:last-child{grid-column:1/-1}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left}
th{font-size:11.5px;color:var(--faint);text-transform:uppercase;letter-spacing:.05em}
td.rk{color:var(--faint);width:28px}
td.tr-num,th.tr-num{text-align:right;font-variant-numeric:tabular-nums}
td.pg{word-break:break-all}
tr:last-child td{border-bottom:0}
.insights{list-style:none;display:flex;flex-direction:column;gap:8px}
.insights li{background:#F6F9FB;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;padding:10px 14px;font-size:14px}
.foot{color:var(--faint);font-size:12.5px;text-align:center}
.empty-line{color:var(--faint);font-size:13.5px;padding:8px 0}
@media(max-width:760px){.timeline{grid-template-columns:1fr 1fr}.tables{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="topbar"><b>더착한치과 검색·방문 통계</b><span class="cap">${esc(rangeTxt)} · 구글 검색콘솔 + GA4</span><a href="/admin/dashboard">관리자 대시보드</a></header>
<main>
${expectCard}
${body}
${insightsHtml}
<p class="foot">데이터: 구글 검색콘솔 · GA4 (최근 28일)${d?.updatedAt ? ` · 갱신 ${esc(String(d.updatedAt).slice(0, 16).replace('T', ' '))}` : ''} · 이 페이지는 검색엔진에 노출되지 않습니다.</p>
</main>
</body>
</html>`
}
