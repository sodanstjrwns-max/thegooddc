import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, getTreatment } from '../data/treatments'
import { DOCTORS, getDoctor } from '../data/doctors'
import { TERMS, TERM_CATEGORIES, getTerm, getCoreTerms } from '../data/encyclopedia'
import { breadcrumbSchema, articleSchema, speakableSchema, faqSchema } from '../lib/seo'
import { InlinkText } from '../lib/inlink'
import type { Column } from '../lib/content-store'
import { SEED_COLUMNS, SEED_CASES } from '../lib/content-store'
import type { CaseItem } from '../lib/content-store'

// ============================================================
// 비포 / 애프터 (애프터 사진 로그인 게이팅)
// ============================================================
export const CasesPage: FC<{ loggedIn?: boolean; cases?: CaseItem[] }> = ({ loggedIn = false, cases = SEED_CASES }) => (
  <Layout
    title={`비포 / 애프터 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과의 진료 전후 사례를 확인하세요. 임플란트, 투명교정, 스마일 크라운 등 디지털 정밀 진료 케이스를 소개합니다."
    path="/cases"
    keywords={['강서구 치과 전후', '명지 임플란트 후기', '투명교정 전후', '스마일 크라운 전후']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '비포/애프터', path: '/cases' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-solid fa-images"></i> BEFORE / AFTER</div>
        <h1>비포 / 애프터</h1>
        <p>디지털 정밀 진료의 실제 사례입니다. 진료 후 사진은 의료법에 따라 로그인 후 확인하실 수 있습니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '비포/애프터', path: '/cases' }]} />

    {!loggedIn && (
      <section class="sec-sm">
        <div class="container">
          <div class="aeo-answer reveal" style="max-width:880px;margin:0 auto;display:flex;align-items:center;gap:16px;justify-content:center;text-align:center;flex-wrap:wrap">
            <i class="fa-solid fa-lock" style="color:var(--brand);font-size:22px"></i>
            <span>의료법에 따라 진료 <strong>후(After)</strong> 사진은 로그인한 회원만 열람할 수 있습니다.</span>
            <a href="/auth/login" class="btn btn-primary" style="padding:12px 24px"><i class="fa-solid fa-right-to-bracket"></i> 로그인</a>
          </div>
        </div>
      </section>
    )}

    <section class="sec" style={!loggedIn ? 'padding-top:20px' : ''}>
      <div class="container">
        <div class="ba-grid">
          {cases.map((cs) => {
            const t = getTreatment(cs.category)
            const dr = getDoctor(cs.doctor)
            return (
              <div class="ba-card reveal">
              {(() => {
                const hasBefore = !!(cs.photoPanoBefore || cs.photoOralBefore)
                const hasAfter = !!(cs.photoPanoAfter || cs.photoOralAfter)
                /* 사진이 한 장도 없으면 슬라이더 대신 '준비 중' 카드 */
                if (!hasBefore && !hasAfter) {
                  return (
                    <div class="ba-coming" aria-label="진료 사진 준비 중">
                      <i class="fa-regular fa-images"></i>
                      <span class="bc-title">진료 사진 준비 중</span>
                      <span class="bc-sub">실제 진료 전·후 사진을 정리하여 곧 공개할 예정입니다.</span>
                    </div>
                  )
                }
                /* 사진이 있으면 기존 Before/After 슬라이더 */
                return (
                  <div class="ba-slider">
                    {hasBefore ? (
                      <img src={`/files/${cs.photoPanoBefore || cs.photoOralBefore}`} alt={`${cs.title} 진료 전`} loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
                    ) : (
                      <div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#114A7E,#1E6FB8);color:rgba(255,255,255,0.7);font-size:14px;font-weight:700">진료 전 (Before)</div>
                    )}
                    {loggedIn ? (
                      hasAfter ? (
                        <img src={`/files/${cs.photoPanoAfter || cs.photoOralAfter}`} alt={`${cs.title} 진료 후`} loading="lazy" class="ba-after" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(0 0 0 50%)" />
                      ) : (
                        <div class="ba-after" style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#1E6FB8,#2DD4BF);color:#fff;font-size:14px;font-weight:700;clip-path:inset(0 0 0 50%)">진료 후 (After)</div>
                      )
                    ) : (
                      <div class="ba-after" style="position:absolute;inset:0;display:grid;place-items:center;background:var(--ink);color:rgba(255,255,255,0.8);font-size:13px;font-weight:700;clip-path:inset(0 0 0 50%);text-align:center;padding:20px">
                        <span><i class="fa-solid fa-lock" style="display:block;font-size:24px;margin-bottom:8px"></i>로그인 후<br />열람 가능</span>
                      </div>
                    )}
                    <div class="ba-handle"></div>
                    <span class="ba-label before">Before</span>
                    <span class="ba-label after">After</span>
                  </div>
                )
              })()}
                {/* 추가 사진 그리드 (업로드된 것만 노출, 애프터는 로그인 게이팅) */}
                {(() => {
                  const photos: { key?: string; label: string; after: boolean }[] = [
                    { key: cs.photoPanoBefore, label: '파노라마 (전)', after: false },
                    { key: cs.photoPanoAfter, label: '파노라마 (후)', after: true },
                    { key: cs.photoOralBefore, label: '구내 (전)', after: false },
                    { key: cs.photoOralAfter, label: '구내 (후)', after: true },
                  ].filter((p) => p.key)
                  if (photos.length === 0) return null
                  return (
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px;padding:10px 14px 0">
                      {photos.map((p) => (
                        <figure style="margin:0">
                          {p.after && !loggedIn ? (
                            <div style="aspect-ratio:4/3;border-radius:8px;background:var(--bg-2);display:grid;place-items:center;color:var(--ink-faint);font-size:11px;font-weight:700;text-align:center"><span><i class="fa-solid fa-lock"></i><br />로그인 필요</span></div>
                          ) : (
                            <img src={`/files/${p.key}`} alt={`${cs.title} ${p.label}`} loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px" />
                          )}
                          <figcaption style="font-size:11px;color:var(--ink-faint);text-align:center;margin-top:3px">{p.label}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )
                })()}
                <div style="padding:22px 24px">
                  <h2 style="font-size:18px;margin-bottom:8px">{cs.title}</h2>
                  <p style="color:var(--ink-soft);font-size:14px;margin:0 0 14px;line-height:1.6">{cs.desc}</p>
                  <div class="chip-row" style="gap:7px">
                    <span class="chip" style="font-size:12px;padding:6px 12px">{cs.age} {cs.gender}</span>
                    <span class="chip" style="font-size:12px;padding:6px 12px">{cs.area}</span>
                    <span class="chip" style="font-size:12px;padding:6px 12px">치료기간 {cs.period}</span>
                  </div>
                  <div class="chip-row" style="gap:7px;margin-top:8px">
                    {t && <a href={`/treatments/${t.slug}`} class="chip" style="font-size:12px;padding:6px 12px"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName}</a>}
                    {dr && <a href={`/doctors/${dr.slug}`} class="chip" style="font-size:12px;padding:6px 12px"><i class="fa-solid fa-user-doctor"></i> {dr.name}</a>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p style="text-align:center;color:var(--ink-soft);font-size:13px;margin-top:36px;line-height:1.7">
          ※ 위 사례는 개인의 구강 상태에 따라 결과가 다를 수 있으며, 모든 환자에게 동일한 결과를 보장하지 않습니다.
        </p>
      </div>
    </section>
  </Layout>
)

// ============================================================
// 원장 칼럼
// ============================================================

export const ColumnListPage: FC<{ columns?: Column[] }> = ({ columns = SEED_COLUMNS }) => (
  <Layout
    title={`원장 칼럼 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과 황우석 대표원장이 직접 쓰는 치과 건강 칼럼입니다. 임플란트, 교정, 심미치료에 대한 정확한 정보를 전합니다."
    path="/column"
    keywords={['치과 칼럼', '임플란트 정보', '강서구 치과 블로그', '명지 치과 칼럼']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-solid fa-pen-nib"></i> COLUMN</div>
        <h1>원장 칼럼</h1>
        <p>정확한 치과 정보를 직접 전합니다. 검증된 내용으로 건강한 선택을 돕겠습니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }]} />
    <section class="sec">
      <div class="container">
        <div class="tlist-grid">
          {columns.map((c) => {
            const dr = getDoctor(c.author)
            return (
              <a href={`/column/${c.slug}`} class={`card reveal col-list-card ${c.cover ? 'has-thumb' : ''}`} style="text-decoration:none">
                {c.cover && (
                  <div class="col-list-thumb">
                    <img src={c.cover} alt={c.coverAlt || c.title} loading="lazy" width="600" height="315" />
                  </div>
                )}
                <div class="col-list-body">
                  <div style="color:var(--ink-soft);font-size:13px;margin-bottom:10px">{c.date}</div>
                  <h2 style="font-size:21px;margin-bottom:12px;line-height:1.4">{c.title}</h2>
                  <p style="color:var(--ink-soft);font-size:15px;line-height:1.7;margin:0 0 16px">{c.excerpt}</p>
                  <span style="color:var(--brand);font-weight:700;font-size:14px">{dr?.name} {dr?.title} · 자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  </Layout>
)

// 리치 본문 렌더러: ### → H3, **x** → <strong>, - → <ul>, ![alt](url) → <img>, 일반 줄 → <p>+인링크
const RichBody: FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n')
  const out: any[] = []
  let listBuf: string[] = []
  const renderInline = (s: string): any => {
    // [링크](url) → <a>, **bold** → <strong>, *italic* → <em>, 나머지 인링크
    const linkParts = s.split(/(\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\))/g)
    return linkParts.map((seg) => {
      const lm = seg.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/)
      if (lm) {
        const ext = /^https?:\/\//.test(lm[2])
        return <a href={lm[2]} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} style="color:var(--accent-d);text-decoration:underline">{lm[1]}</a>
      }
      // bold
      const boldParts = seg.split(/\*\*(.+?)\*\*/g)
      return boldParts.map((bp, i) => {
        if (i % 2 === 1) return <strong>{bp}</strong>
        // italic
        const itParts = bp.split(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g)
        return itParts.map((ip, j) => (j % 2 === 1 ? <em>{ip}</em> : <InlinkText text={ip} max={2} />))
      })
    })
  }
  const flushList = () => {
    if (listBuf.length) {
      out.push(<ul>{listBuf.map((li) => <li>{renderInline(li)}</li>)}</ul>)
      listBuf = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushList(); continue }
    const img = line.match(/^!\[(.*?)\]\((.*?)\)$/)
    if (img) { flushList(); out.push(<img src={img[2]} alt={img[1] || '본문 이미지'} style="max-width:100%;border-radius:12px;margin:8px 0" loading="lazy" />); continue }
    if (line.startsWith('### ')) { flushList(); out.push(<h3>{line.slice(4)}</h3>); continue }
    if (line.startsWith('> ')) { flushList(); out.push(<blockquote class="col-quote">{renderInline(line.slice(2))}</blockquote>); continue }
    if (line.startsWith('- ')) { listBuf.push(line.slice(2)); continue }
    flushList()
    out.push(<p>{renderInline(line)}</p>)
  }
  flushList()
  return <>{out}</>
}

export const ColumnDetailPage: FC<{ slug: string; column?: Column | null; views?: number }> = ({ slug, column, views = 0 }) => {
  const c = column ?? SEED_COLUMNS.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Layout title="칼럼을 찾을 수 없습니다" description="요청하신 칼럼을 찾을 수 없습니다." path="/column">
        <section class="page-hero"><div class="container ph-inner"><h1>칼럼을 찾을 수 없습니다</h1><p><a href="/column" style="color:var(--blue);text-decoration:underline">칼럼 목록 보기</a></p></div></section>
      </Layout>
    )
  }
  const dr = getDoctor(c.author) ?? getDoctor('hwang-wooseok')!
  const t = getTreatment(c.related)
  // 대표이미지: 지정값 → 본문 첫 이미지 fallback
  const firstBodyImg = (() => {
    for (const b of c.body) {
      const m = (b.p || '').match(/!\[(.*?)\]\((.*?)\)/)
      if (m) return m[2]
    }
    return ''
  })()
  const cover = c.cover || firstBodyImg || ''
  // 본문 글자수(SEO wordCount)
  const wordCount = c.body.reduce((acc, b) => acc + (b.h?.length || 0) + (b.p?.replace(/!\[.*?\]\(.*?\)/g, '').length || 0), 0)
  return (
    <Layout
      title={`${c.title} | ${CLINIC.name} 원장 칼럼`}
      description={c.excerpt}
      path={`/column/${c.slug}`}
      ogType="article"
      ogImage={cover || undefined}
      keywords={['치과 칼럼', t?.shortName || '', '강서구 치과']}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }, { name: c.title, path: `/column/${c.slug}` }]),
        articleSchema({ title: c.title, description: c.excerpt, slug: c.slug, datePublished: c.date, dateModified: c.modified, authorSlug: dr.slug, authorName: dr.name, image: cover || undefined, wordCount: wordCount || undefined, section: t?.shortName || '치과 칼럼' }),
        speakableSchema(),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-pen-nib"></i> COLUMN · {c.date}{views > 0 && <span style="opacity:.75"> · 조회 {views.toLocaleString()}</span>}</div>
          <h1>{c.title}</h1>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }, { name: c.title, path: `/column/${c.slug}` }]} />
      <section class="sec">
        <div class="container article-body">
          {c.cover && <img src={c.cover} alt={c.coverAlt || c.title} class="col-cover" loading="eager" width="1200" height="630" />}
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:24px;border-bottom:1px solid var(--line);margin-bottom:32px">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent));display:grid;place-items:center;color:#fff"><i class="fa-solid fa-user-doctor"></i></div>
            <div>
              <a href={`/doctors/${dr.slug}`} style="font-weight:800;color:var(--ink)">{dr.name} {dr.title}</a>
              <div style="font-size:13px;color:var(--ink-soft)">{dr.license}</div>
            </div>
          </div>
          {c.body.map((b) => (<>{b.h && <h2>{b.h}</h2>}<RichBody text={b.p} /></>))}
          <div class="related-box">
            <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료 · 작성 의료진</h3>
            <div class="chip-row">
              {t && <a href={`/treatments/${t.slug}`} class="chip"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName}</a>}
              <a href={`/doctors/${dr.slug}`} class="chip"><i class="fa-solid fa-user-doctor"></i> {dr.name} {dr.title}</a>
            </div>
          </div>
          <p style="font-size:13px;color:var(--ink-soft)">최종 검토: {c.modified} · 감수 {dr.name} {dr.title} ({dr.license})</p>
        </div>
      </section>
    </Layout>
  )
}

// ============================================================
// 백과사전
// ============================================================
export const EncyclopediaListPage: FC<{ category?: string }> = ({ category }) => {
  const base = category ? TERMS.filter((t) => t.category === category) : TERMS
  // 상세 본문(1000자)을 가진 용어를 앞쪽에 우선 노출
  const filtered = [...base].sort((a, b) => {
    const ab = a.body && a.body.length ? 1 : 0
    const bb = b.body && b.body.length ? 1 : 0
    return bb - ab
  })
  const detailCount = TERMS.filter((t) => t.body && t.body.length > 0).length
  return (
    <Layout
      title={`치과 백과사전 | ${CLINIC.name} 강서구 명지`}
      description={`치과 용어와 진료 정보를 정리한 백과사전입니다. 임플란트, 교정, 신경치료 등 ${TERMS.length}개 이상의 용어를 쉽게 설명합니다.`}
      path="/encyclopedia"
      keywords={['치과 용어', '치과 백과사전', '임플란트 용어', '치과 정보']}
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }]), speakableSchema()]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-book"></i> ENCYCLOPEDIA</div>
          <h1>치과 백과사전</h1>
          <p>{TERMS.length}개 치과 용어를 수록했으며, 그중 {detailCount}개는 상세 해설로 자세히 설명합니다.</p>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }]} />
      <section class="sec-sm bg-sand">
        <div class="container">
          <div class="chip-row reveal">
            <a href="/encyclopedia" class={`chip ${!category ? 'active' : ''}`} style={!category ? 'background:var(--brand);color:#fff;border-color:var(--brand)' : ''}>전체</a>
            {TERM_CATEGORIES.map((cat) => (
              <a href={`/encyclopedia?cat=${encodeURIComponent(cat)}`} class="chip" style={category === cat ? 'background:var(--brand);color:#fff;border-color:var(--brand)' : ''}>{cat}</a>
            ))}
          </div>
        </div>
      </section>
      <section class="sec">
        <div class="container">
          <div class="tlist-grid">
            {filtered.slice(0, 120).map((term) => (
              <a href={`/encyclopedia/${term.slug}`} class="card reveal" style="padding:24px;text-decoration:none">
                <div style="font-size:12px;color:var(--brand);font-weight:700;margin-bottom:6px">
                  {term.category}
                  {term.body && term.body.length > 0 && (
                    <span style="margin-left:8px;font-size:11px;background:var(--brand);color:#fff;padding:2px 8px;border-radius:999px">상세</span>
                  )}
                </div>
                <h2 style="font-size:18px;margin-bottom:6px">{term.term}</h2>
                <p style="color:var(--ink-soft);font-size:14px;margin:0;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">{term.def}</p>
              </a>
            ))}
          </div>
          {filtered.length > 120 && <p style="text-align:center;color:var(--ink-soft);margin-top:30px">외 {filtered.length - 120}개 용어 수록</p>}
        </div>
      </section>
    </Layout>
  )
}

export const EncyclopediaDetailPage: FC<{ slug: string }> = ({ slug }) => {
  const term = getTerm(slug)
  if (!term) {
    return (
      <Layout title="용어를 찾을 수 없습니다" description="요청하신 용어를 찾을 수 없습니다." path="/encyclopedia">
        <section class="page-hero"><div class="container ph-inner"><h1>용어를 찾을 수 없습니다</h1><p><a href="/encyclopedia" style="color:var(--blue);text-decoration:underline">백과사전 보기</a></p></div></section>
      </Layout>
    )
  }
  const related = (term.related || []).map((s) => getTreatment(s)).filter(Boolean)
  const hasBody = term.body && term.body.length > 0
  const hasQa = term.qa && term.qa.length > 0
  // 같은 카테고리의 다른 상세 용어 추천 (백과사전 내부 인링크 강화)
  const sameCategory = TERMS.filter(
    (t) => t.category === term.category && t.slug !== term.slug && t.body && t.body.length > 0,
  ).slice(0, 6)
  const schemas: any[] = [
    breadcrumbSchema([{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }, { name: term.term, path: `/encyclopedia/${term.slug}` }]),
    speakableSchema(),
    // DefinedTerm 스키마 — AI·검색엔진이 용어 정의를 직접 인식
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: term.term,
      description: term.def,
      inDefinedTermSet: `${CLINIC.name} 치과 백과사전`,
    },
  ]
  if (hasQa) schemas.push(faqSchema(term.qa!))
  return (
    <Layout
      title={`${term.term}${term.reading ? ` (${term.reading})` : ''} | 치과 백과사전 · ${CLINIC.name}`}
      description={term.def.length > 150 ? term.def.slice(0, 150) : term.def}
      path={`/encyclopedia/${term.slug}`}
      keywords={[term.term, term.reading || '', term.category, '치과 용어', '강서구 명지 치과'].filter(Boolean)}
      schemas={schemas}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-book"></i> {term.category}</div>
          <h1>{term.term}</h1>
          {term.reading && <p>{term.reading}</p>}
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }, { name: term.term, path: `/encyclopedia/${term.slug}` }]} />
      <section class="sec">
        <div class="container article-body">
          {/* AEO 직답 — 정의 요약 */}
          <p class="aeo-answer">{term.def}</p>

          {/* 1000자 상세 본문 (자동 인링크 적용) */}
          {hasBody && (
            <div class="term-body">
              {term.body!.map((para) => (
                <p>
                  <InlinkText text={para} currentSlug={term.slug} />
                </p>
              ))}
            </div>
          )}

          {/* 자주 묻는 질문 (FAQ 스키마 연동) */}
          {hasQa && (
            <div class="term-faq">
              <h2><i class="fa-solid fa-circle-question" style="color:var(--brand);margin-right:8px"></i>자주 묻는 질문</h2>
              {term.qa!.map((item) => (
                <details class="faq-item" open>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          )}

          {/* 의료광고법 안내 */}
          {hasBody && (
            <p class="term-disclaimer">
              <i class="fa-solid fa-circle-info" style="margin-right:6px"></i>
              본 내용은 일반적인 치과 정보 제공을 목적으로 하며, 실제 진단·치료 방향과 결과는 개인의 상태에 따라 다를 수 있습니다. 정확한 사항은 정밀 진단과 상담을 통해 안내해 드립니다.
            </p>
          )}

          {related.length > 0 && (
            <div class="related-box">
              <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료</h3>
              <div class="chip-row">
                {related.map((t) => <a href={`/treatments/${t!.slug}`} class="chip"><i class={`fa-solid fa-${t!.icon}`}></i> {t!.shortName}</a>)}
                <a href="/cases" class="chip"><i class="fa-solid fa-images"></i> 비포/애프터</a>
              </div>
            </div>
          )}

          {/* 같은 분야 다른 용어 — 백과사전 내부 인링크 */}
          {sameCategory.length > 0 && (
            <div class="related-box">
              <h3><i class="fa-solid fa-book-open" style="color:var(--brand);margin-right:8px"></i>같은 분야 용어 더 보기</h3>
              <div class="chip-row">
                {sameCategory.map((t) => (
                  <a href={`/encyclopedia/${t.slug}`} class="chip">{t.term}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}


