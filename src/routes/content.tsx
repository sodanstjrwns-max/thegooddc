import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, getTreatment } from '../data/treatments'
import { DOCTORS, getDoctor } from '../data/doctors'
import { TERMS, TERM_CATEGORIES, getTerm, getCoreTerms } from '../data/encyclopedia'
import { breadcrumbSchema, articleSchema, speakableSchema } from '../lib/seo'
import type { Column } from '../lib/content-store'
import { SEED_COLUMNS, SEED_CASES } from '../lib/content-store'
import type { CaseItem } from '../lib/content-store'

// ============================================================
// 비포 / 애프터 (애프터 사진 로그인 게이팅)
// ============================================================
export const CasesPage: FC<{ loggedIn?: boolean; cases?: CaseItem[] }> = ({ loggedIn = false, cases = SEED_CASES }) => (
  <Layout
    title={`비포 / 애프터 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과의 진료 전후 사례를 확인하세요. 임플란트, 투명교정, 미니쉬 등 디지털 정밀 진료 케이스를 소개합니다."
    path="/cases"
    keywords={['강서구 치과 전후', '명지 임플란트 후기', '투명교정 전후', '미니쉬 전후']}
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
        <div class="tlist-grid">
          {cases.map((cs) => {
            const t = getTreatment(cs.category)
            const dr = getDoctor(cs.doctor)
            return (
              <div class="card reveal" style="overflow:hidden">
                {/* Before/After slider */}
                <div class="ba-slider">
                  <div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#114A7E,#1E6FB8);color:rgba(255,255,255,0.7);font-size:14px;font-weight:700">진료 전 (Before)</div>
                  {loggedIn ? (
                    <div class="ba-after" style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#1E6FB8,#2DD4BF);color:#fff;font-size:14px;font-weight:700;clip-path:inset(0 0 0 50%)">진료 후 (After)</div>
                  ) : (
                    <div class="ba-after" style="position:absolute;inset:0;display:grid;place-items:center;background:var(--ink);color:rgba(255,255,255,0.8);font-size:13px;font-weight:700;clip-path:inset(0 0 0 50%);text-align:center;padding:20px">
                      <span><i class="fa-solid fa-lock" style="display:block;font-size:24px;margin-bottom:8px"></i>로그인 후<br />열람 가능</span>
                    </div>
                  )}
                  <div class="ba-handle"></div>
                  <span class="ba-label before">Before</span>
                  <span class="ba-label after">After</span>
                </div>
                <div style="padding:22px 24px">
                  <h3 style="font-size:18px;margin-bottom:8px">{cs.title}</h3>
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
              <a href={`/column/${c.slug}`} class="card reveal" style="padding:32px;text-decoration:none">
                <div style="color:var(--ink-soft);font-size:13px;margin-bottom:10px">{c.date}</div>
                <h3 style="font-size:21px;margin-bottom:12px;line-height:1.4">{c.title}</h3>
                <p style="color:var(--ink-soft);font-size:15px;line-height:1.7;margin:0 0 16px">{c.excerpt}</p>
                <span style="color:var(--brand);font-weight:700;font-size:14px">{dr?.name} {dr?.title} · 자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  </Layout>
)

export const ColumnDetailPage: FC<{ slug: string; column?: Column | null }> = ({ slug, column }) => {
  const c = column ?? SEED_COLUMNS.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Layout title="칼럼을 찾을 수 없습니다" description="요청하신 칼럼을 찾을 수 없습니다." path="/column">
        <section class="page-hero"><div class="container ph-inner"><h1>칼럼을 찾을 수 없습니다</h1><p><a href="/column" style="color:var(--blue);text-decoration:underline">칼럼 목록 보기</a></p></div></section>
      </Layout>
    )
  }
  const dr = getDoctor(c.author)!
  const t = getTreatment(c.related)
  return (
    <Layout
      title={`${c.title} | ${CLINIC.name} 원장 칼럼`}
      description={c.excerpt}
      path={`/column/${c.slug}`}
      ogType="article"
      keywords={['치과 칼럼', t?.shortName || '', '강서구 치과']}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }, { name: c.title, path: `/column/${c.slug}` }]),
        articleSchema({ title: c.title, description: c.excerpt, slug: c.slug, datePublished: c.date, dateModified: c.modified, authorSlug: dr.slug, authorName: dr.name }),
        speakableSchema(),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-pen-nib"></i> COLUMN · {c.date}</div>
          <h1>{c.title}</h1>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '원장 칼럼', path: '/column' }, { name: c.title, path: `/column/${c.slug}` }]} />
      <section class="sec">
        <div class="container article-body">
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:24px;border-bottom:1px solid var(--line);margin-bottom:32px">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent));display:grid;place-items:center;color:#fff"><i class="fa-solid fa-user-doctor"></i></div>
            <div>
              <a href={`/doctors/${dr.slug}`} style="font-weight:800;color:var(--ink)">{dr.name} {dr.title}</a>
              <div style="font-size:13px;color:var(--ink-soft)">{dr.license}</div>
            </div>
          </div>
          {c.body.map((b) => (<><h2>{b.h}</h2><p>{b.p}</p></>))}
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
  const filtered = category ? TERMS.filter((t) => t.category === category) : TERMS
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
          <p>{TERMS.length}개 이상의 치과 용어와 진료 정보를 쉽게 풀어 설명합니다.</p>
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
                <div style="font-size:12px;color:var(--brand);font-weight:700;margin-bottom:6px">{term.category}</div>
                <h3 style="font-size:18px;margin-bottom:6px">{term.term}</h3>
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
  return (
    <Layout
      title={`${term.term} | 치과 백과사전 · ${CLINIC.name}`}
      description={`${term.term}: ${term.def}`}
      path={`/encyclopedia/${term.slug}`}
      keywords={[term.term, term.category, '치과 용어']}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }, { name: term.term, path: `/encyclopedia/${term.slug}` }]),
        speakableSchema(),
      ]}
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
          <p class="aeo-answer">{term.def}</p>
          {related.length > 0 && (
            <div class="related-box">
              <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료</h3>
              <div class="chip-row">
                {related.map((t) => <a href={`/treatments/${t!.slug}`} class="chip"><i class={`fa-solid fa-${t!.icon}`}></i> {t!.shortName}</a>)}
                <a href="/cases" class="chip"><i class="fa-solid fa-images"></i> 비포/애프터</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}


