import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, getTreatment } from '../data/treatments'
import { DOCTORS, getDoctor } from '../data/doctors'
import { TERMS, TERM_CATEGORIES, getTerm, getCoreTerms, isThinTerm } from '../data/encyclopedia'
import { breadcrumbSchema, articleSchema, blogPostingSchema, speakableSchema, faqSchema } from '../lib/seo'
import { InlinkText } from '../lib/inlink'
import type { Column, BoardKind, BoardMeta } from '../lib/content-store'
import { SEED_COLUMNS, SEED_CASES, BOARDS } from '../lib/content-store'
import type { CaseItem } from '../lib/content-store'
import type { MediumPost } from '../lib/medium'
import { answerSummary, faqsFromBlocks, caseHeadline, caseSummaryRows, pageHref, ymd } from '../lib/column-seo'

const SITE = `https://${CLINIC.domain}`

/** 서버 렌더 페이지 이동 (?page=N, a 태그) */
const Pager: FC<{ base: string; page: number; pages: number; label: string }> = ({ base, page, pages, label }) => {
  if (pages <= 1) return null
  return (
    <nav class="ssr-pager" aria-label={label}>
      {page > 1 && <a href={pageHref(base, page - 1)} rel="prev">← 이전</a>}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
        n === page ? <span class="current" aria-current="page">{n}</span> : <a href={pageHref(base, n)}>{n}</a>)}
      {page < pages && <a href={pageHref(base, page + 1)} rel="next">다음 →</a>}
    </nav>
  )
}

// ============================================================
// 비포 / 애프터 (애프터 사진 로그인 게이팅)
// ============================================================
export const CasesPage: FC<{ loggedIn?: boolean; cases?: CaseItem[]; category?: string; page?: number; pages?: number; total?: number; offset?: number; categories?: { slug: string; name: string; n: number }[] }> = ({ loggedIn = false, cases = SEED_CASES, category = '', page = 1, pages = 1, total, offset = 0, categories = [] }) => {
  const catT = category ? getTreatment(category) : undefined
  const base = category ? `/cases?category=${category}` : '/cases'
  const path = pageHref(base, page)
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE}${path}#collection`,
    name: catT ? `${catT.shortName} 비포/애프터 사례` : '비포/애프터 사례',
    url: `${SITE}${path}`,
    isPartOf: { '@id': `${SITE}/#website` },
    ...(catT ? { about: { '@id': `${SITE}/treatments/${catT.slug}/#procedure` } } : {}),
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total ?? cases.length,
      itemListElement: cases.map((cs, i) => ({ '@type': 'ListItem', position: offset + i + 1, url: `${SITE}/cases/${cs.id}`, name: caseHeadline(cs, getTreatment(cs.category)?.shortName) })),
    },
  }
  const crumbs = [{ name: '홈', path: '/' }, { name: '비포/애프터', path: '/cases' }, ...(catT ? [{ name: catT.shortName, path: base }] : [])]
  return (
  <Layout
    title={catT
      ? `${catT.shortName} 비포/애프터 사례${page > 1 ? ` ${page}페이지` : ''} | ${CLINIC.name}`
      : `비포 / 애프터${page > 1 ? ` ${page}페이지` : ''} | ${CLINIC.name} 강서구 명지 치과`}
    description={catT
      ? `${CLINIC.name} ${catT.shortName} 진료 사례 ${total ?? cases.length}건 — 진료 내용·치료 기간과 진료 전 사진을 공개합니다(진료 후 사진은 회원 공개). 결과에는 개인차가 있습니다.`
      : '더착한치과의 진료 전후 사례를 확인하세요. 임플란트, 투명교정, 스타일네이트 등 디지털 정밀 진료 케이스를 소개합니다.'}
    path={path}
    keywords={['강서구 치과 전후', '명지 임플란트 후기', '투명교정 전후', '스타일네이트 전후']}
    schemas={[breadcrumbSchema(crumbs), collection]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-solid fa-images"></i> BEFORE / AFTER</div>
        <h1>{catT ? `${catT.shortName} 비포 / 애프터` : '비포 / 애프터'}</h1>
        <p>디지털 정밀 진료의 실제 사례입니다. 진료 후 사진은 의료법에 따라 로그인 후 확인하실 수 있습니다.</p>
      </div>
    </section>
    <Breadcrumb items={crumbs} />

    {categories.length > 0 && (
      <section class="sec-sm" style="padding-bottom:0">
        <div class="container">
          <nav class="chip-row case-filter" aria-label="진료별 사례" style="justify-content:center">
            <a href="/cases" class={`chip${category ? '' : ' is-active'}`} aria-current={category ? undefined : 'page'}>전체</a>
            {categories.map((ct) => (
              <a href={`/cases?category=${ct.slug}`} class={`chip${category === ct.slug ? ' is-active' : ''}`} aria-current={category === ct.slug ? 'page' : undefined}>{ct.name} <span style="opacity:.6">{ct.n}</span></a>
            ))}
          </nav>
        </div>
      </section>
    )}

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
                      <img src={`/files/${cs.photoPanoBefore || cs.photoOralBefore}`} alt={`${t?.shortName || '치과'} 치료 전 — ${cs.title}`} loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
                    ) : (
                      <div style="position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(135deg,#114A7E,#1E6FB8);color:rgba(255,255,255,0.7);font-size:14px;font-weight:700">진료 전 (Before)</div>
                    )}
                    {loggedIn ? (
                      hasAfter ? (
                        <img src={`/files/${cs.photoPanoAfter || cs.photoOralAfter}`} alt={`${t?.shortName || '치과'} 치료 후 — ${cs.title}`} loading="lazy" decoding="async" class="ba-after" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(0 0 0 50%)" />
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
                            <img src={`/files/${p.key}`} alt={`${t?.shortName || '치과'} 치료 ${p.after ? '후' : '전'} — ${p.label.replace(/ \((전|후)\)$/, '')}`} loading="lazy" decoding="async" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px" />
                          )}
                          <figcaption style="font-size:11px;color:var(--ink-faint);text-align:center;margin-top:3px">{p.label}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )
                })()}
                <div style="padding:22px 24px">
                  <h2 style="font-size:18px;margin-bottom:8px"><a href={`/cases/${cs.id}`} style="color:inherit">{caseHeadline(cs, t?.shortName)}</a></h2>
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
        <Pager base={base} page={page} pages={pages} label="비포/애프터 목록 페이지" />
        <p style="text-align:center;color:var(--ink-soft);font-size:13px;margin-top:36px;line-height:1.7">
          ※ 위 사례는 개인의 구강 상태에 따라 결과가 다를 수 있으며, 모든 환자에게 동일한 결과를 보장하지 않습니다.
        </p>
      </div>
    </section>
  </Layout>
  )
}

// ============================================================
// 비포 / 애프터 상세 (/cases/:id) — 사례별 개별 URL (PFWE 표준 B)
// 진료 후 사진은 기존과 같이 로그인 게이트(/files/cases-after/* 403), 텍스트는 공개
// ============================================================
export const CaseDetailPage: FC<{ cs: CaseItem; loggedIn?: boolean; noindex?: boolean; relatedColumns?: Column[]; sameCases?: CaseItem[] }> = ({ cs, loggedIn = false, noindex = false, relatedColumns = [], sameCases = [] }) => {
  const t = getTreatment(cs.category)
  const dr = getDoctor(cs.doctor)
  const txName = t?.shortName
  const headline = caseHeadline(cs, txName)
  const path = `/cases/${cs.id}`
  const url = `${SITE}${path}`
  const rows = caseSummaryRows(cs, txName, dr ? `${dr.name} ${dr.title}` : undefined)
  const descText = String(cs.desc || '').replace(/\s+/g, ' ').trim()
  let description = `${headline}. ${descText || rows.map((r) => `${r.label} ${r.value}`).join(', ')}`
  if (description.length < 80) description = `${description} ${CLINIC.name} 진료 사례(결과는 개인차 있음).`
  if (description.length > 160) description = description.slice(0, 157).replace(/\s+\S*$/, '') + '…'
  const reviewed = ymd(cs.modified)
  const reviewerId = dr ? `${SITE}/doctors/${dr.slug}/#person` : undefined
  const beforePhotos = [
    { key: cs.photoPanoBefore, label: '파노라마' },
    { key: cs.photoOralBefore, label: '구내 사진' },
  ].filter((x) => x.key)
  const afterPhotos = [
    { key: cs.photoPanoAfter, label: '파노라마' },
    { key: cs.photoOralAfter, label: '구내 사진' },
  ].filter((x) => x.key)
  const crumbs = [
    { name: '홈', path: '/' },
    { name: '비포/애프터', path: '/cases' },
    ...(t ? [{ name: t.shortName, path: `/cases?category=${t.slug}` }] : []),
    { name: headline, path },
  ]
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: headline,
        description,
        inLanguage: 'ko-KR',
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        ...(t ? { about: { '@id': `${SITE}/treatments/${t.slug}/#procedure` } } : {}),
        ...(reviewerId ? { reviewedBy: { '@id': reviewerId } } : {}),
        ...(reviewed ? { lastReviewed: reviewed, dateModified: reviewed } : {}),
        // 진료 전 사진만 공개 → ImageObject 는 공개 사진만
        ...(beforePhotos.length ? { image: beforePhotos.map((p) => ({ '@type': 'ImageObject', url: `${SITE}/files/${p.key}`, caption: `${txName || '치과'} 치료 전 — ${p.label}` })) } : {}),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.answer-summary'] },
        publisher: { '@id': `${SITE}/#medicalclinic` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: crumbs.map((cr, i) => ({ '@type': 'ListItem', position: i + 1, name: cr.name, item: `${SITE}${cr.path === '/' ? '/' : cr.path}` })),
      },
    ],
  }
  return (
    <Layout title={`${headline} | ${CLINIC.name}`} description={description} path={path} noindex={noindex} schemas={[graph]}
      keywords={[`${txName || '치과'} 사례`, `${txName || '치과'} 전후`, '강서구 치과', '명지 치과']}>
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-images"></i> BEFORE / AFTER{reviewed ? ` · ${reviewed}` : ''}</div>
          <h1>{headline}</h1>
        </div>
      </section>
      <Breadcrumb items={crumbs} />
      <section class="sec">
        <div class="container article-body">
          <div class="aeo-answer answer-summary" id="case-summary" aria-label="사례 요약">
            <p class="answer-summary-label">사례 요약</p>
            <dl class="case-summary-dl">
              {rows.map((r) => (<><dt>{r.label}</dt><dd>{r.value}</dd></>))}
            </dl>
          </div>

          {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
            <div class="case-photo-grid">
              {beforePhotos.map((p, i) => (
                <figure>
                  <img src={`/files/${p.key}`} alt={`${txName || '치과'} 치료 전 — ${p.label}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                  <figcaption>진료 전 · {p.label}</figcaption>
                </figure>
              ))}
              {afterPhotos.map((p) => (
                <figure>
                  {loggedIn
                    ? <img src={`/files/${p.key}`} alt={`${txName || '치과'} 치료 후 — ${p.label}`} loading="lazy" decoding="async" />
                    : <div class="case-photo-lock"><span><i class="fa-solid fa-lock"></i><br />진료 후 사진은<br />로그인 후 열람</span></div>}
                  <figcaption>진료 후 · {p.label}</figcaption>
                </figure>
              ))}
            </div>
          )}
          {!loggedIn && afterPhotos.length > 0 && (
            <p style="text-align:center;margin:12px 0 0"><a href="/auth/login" class="btn btn-outline" style="padding:10px 20px"><i class="fa-solid fa-right-to-bracket"></i> 로그인하고 진료 후 사진 보기</a></p>
          )}

          {descText && (
            <>
              <h2>진료 과정</h2>
              {String(cs.desc).split(/\r?\n+/).map((x) => x.trim()).filter(Boolean).map((para) => <p>{para}</p>)}
            </>
          )}
          <p style="font-size:13px;color:var(--ink-soft);line-height:1.7">
            ※ 촬영 조건을 동일하게 맞춰 기록한 사례이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다. 모든 환자에게 동일한 결과를 보장하지 않습니다.
            {reviewed ? <> 최종 검토: <time datetime={reviewed}>{reviewed}</time></> : null}{dr ? ` · 담당 ${dr.name} ${dr.title} (${dr.license})` : ''}
          </p>

          <div class="related-box">
            <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료 · 칼럼</h3>
            <div class="chip-row">
              {t && <a href={`/treatments/${t.slug}`} class="chip"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName} 진료 안내</a>}
              {t && <a href={`/cases?category=${t.slug}`} class="chip"><i class="fa-solid fa-images"></i> {t.shortName} 사례 더 보기</a>}
              {dr && <a href={`/doctors/${dr.slug}`} class="chip"><i class="fa-solid fa-user-doctor"></i> {dr.name} {dr.title}</a>}
            </div>
            {relatedColumns.length > 0 && (
              <>
                <h3 style="margin-top:24px">관련 원장 칼럼</h3>
                <ul class="col-link-list">{relatedColumns.map((c) => <li><a href={`/column/${c.slug}`}>{c.title}</a></li>)}</ul>
              </>
            )}
            {sameCases.length > 0 && (
              <>
                <h3 style="margin-top:24px">같은 진료의 다른 사례</h3>
                <ul class="col-link-list">{sameCases.map((x) => <li><a href={`/cases/${x.id}`}>{caseHeadline(x, txName)}</a></li>)}</ul>
              </>
            )}
          </div>
          <div style="margin-top:28px;text-align:center">
            <a href="/cases" class="btn btn-outline"><i class="fa-solid fa-list"></i> 비포/애프터 목록으로</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

// ============================================================
// 원장 칼럼
// ============================================================

export const ColumnListPage: FC<{ columns?: Column[]; mediumPosts?: MediumPost[]; board?: BoardKind; page?: number; pages?: number; total?: number; offset?: number }> = ({ columns = SEED_COLUMNS, mediumPosts = [], board = 'column', page = 1, pages = 1, total, offset = 0 }) => {
  const b: BoardMeta = BOARDS[board]
  const isColumn = board === 'column'
  const detailBase = isColumn ? '/column' : b.path
  const path = pageHref(b.path, page)
  // CollectionPage + ItemList (이 페이지에 실린 글) — 서버 페이지네이션과 같은 순서
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE}${path}#collection`,
    name: page > 1 ? `${b.heroTitle} ${page}페이지` : b.heroTitle,
    url: `${SITE}${path}`,
    description: b.metaDesc,
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total ?? columns.length,
      itemListElement: columns.map((c, i) => ({ '@type': 'ListItem', position: offset + i + 1, url: `${SITE}${detailBase}/${c.slug}`, name: c.title })),
    },
  }
  return (
  <Layout
    title={page > 1 ? `${b.heroTitle} ${page}페이지 | ${CLINIC.name}` : `${b.heroTitle} | ${CLINIC.name} 강서구 명지 치과`}
    description={page > 1 ? `${b.metaDesc} (${page}페이지)` : b.metaDesc}
    path={path}
    keywords={b.keywords}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: b.label, path: b.path }]), collection]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class={`fa-solid fa-${b.icon}`}></i> {b.badge}</div>
        <h1>{b.heroTitle}</h1>
        <p>{b.heroDesc}</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: b.label, path: b.path }]} />
    <section class="sec">
      <div class="container">
        {columns.length === 0 ? (
          <div class="aeo-answer reveal" style="max-width:720px;margin:0 auto;text-align:center;padding:40px 24px">
            <i class={`fa-solid fa-${b.icon}`} style="color:var(--brand);font-size:28px;margin-bottom:12px"></i>
            <p style="margin:0">아직 등록된 글이 없습니다. 곧 새로운 소식으로 찾아뵙겠습니다.</p>
          </div>
        ) : (
        <div class="tlist-grid">
          {columns.map((c) => {
            const dr = getDoctor(c.author)
            return (
              <a href={`${detailBase}/${c.slug}`} class={`card reveal col-list-card ${c.cover ? 'has-thumb' : ''}`} style="text-decoration:none">
                {c.cover && (
                  <div class="col-list-thumb">
                    <img src={c.cover} alt={c.coverAlt || c.title} loading="lazy" width="600" height="315" />
                  </div>
                )}
                <div class="col-list-body">
                  <div style="color:var(--ink-soft);font-size:13px;margin-bottom:10px">{c.date}</div>
                  <h2 style="font-size:21px;margin-bottom:12px;line-height:1.4">{c.title}</h2>
                  <p style="color:var(--ink-soft);font-size:15px;line-height:1.7;margin:0 0 16px">{c.excerpt}</p>
                  <span style="color:var(--brand);font-weight:700;font-size:14px">{isColumn && dr ? `${dr.name} ${dr.title} · ` : ''}자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </a>
            )
          })}
        </div>
        )}
        <Pager base={b.path} page={page} pages={pages} label={`${b.label} 목록 페이지`} />
      </div>
    </section>

    {isColumn && page === 1 && mediumPosts.length > 0 && (
      <section class="sec en-column-sec" id="english-column">
        <div class="container">
          <div class="en-column-head reveal">
            <div class="hero-badge en-badge"><i class="fa-brands fa-medium"></i> ENGLISH COLUMN</div>
            <h2>Dr. Hwang’s English Column</h2>
            <p>Essays on dentistry, patient care, and clinical judgment — written in English by Dr. Woo-seok Hwang, published on Medium.</p>
          </div>
          <div class="tlist-grid en-column-grid">
            {mediumPosts.map((m) => (
              <a href={m.link} target="_blank" rel="noopener noreferrer" class={`card reveal col-list-card ${m.cover ? 'has-thumb' : ''}`} style="text-decoration:none">
                {m.cover && (
                  <div class="col-list-thumb">
                    <img src={m.cover} alt={m.title} loading="lazy" width="600" height="315" />
                  </div>
                )}
                <div class="col-list-body">
                  <div style="color:var(--ink-soft);font-size:13px;margin-bottom:10px">{m.date} · Medium</div>
                  <h3 style="font-size:20px;margin-bottom:12px;line-height:1.4">{m.title}</h3>
                  <p style="color:var(--ink-soft);font-size:15px;line-height:1.7;margin:0 0 16px">{m.excerpt}</p>
                  <span style="color:var(--brand);font-weight:700;font-size:14px">Read on Medium <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:12px"></i></span>
                </div>
              </a>
            ))}
          </div>
          <div class="en-column-more">
            <a href="https://medium.com/@wsh216" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              <i class="fa-brands fa-medium"></i> View all on Medium
            </a>
          </div>
        </div>
      </section>
    )}
  </Layout>
  )
}

// 리치 본문 렌더러: ### → H3, **x** → <strong>, - → <ul>, ![alt](url) → <img>, 일반 줄 → <p>+인링크
const RichBody: FC<{ text: string; altBase?: string; imgStart?: number }> = ({ text, altBase, imgStart = 0 }) => {
  let imgN = imgStart
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
    if (img) {
      flushList(); imgN++
      // alt 없음·파일명(1.png 등)이면 글 제목 기반 alt (PFWE 칼럼 표준 A3)
      const rawAlt = (img[1] || '').trim()
      const badAlt = !rawAlt || /^[\w\-. ()]+\.(png|jpe?g|webp|gif|heic)$/i.test(rawAlt) || rawAlt === '본문 이미지'
      const alt = badAlt ? (altBase ? `${altBase} 관련 이미지 ${imgN}` : '본문 이미지') : rawAlt
      out.push(<img src={img[2]} alt={alt} style="max-width:100%;border-radius:12px;margin:8px 0" loading="lazy" decoding="async" />)
      continue
    }
    if (line.startsWith('### ')) { flushList(); out.push(<h3>{line.slice(4)}</h3>); continue }
    if (line.startsWith('> ')) { flushList(); out.push(<blockquote class="col-quote">{renderInline(line.slice(2))}</blockquote>); continue }
    if (line.startsWith('- ')) { listBuf.push(line.slice(2)); continue }
    flushList()
    out.push(<p>{renderInline(line)}</p>)
  }
  flushList()
  return <>{out}</>
}

export const ColumnDetailPage: FC<{ slug: string; column?: Column | null; views?: number; board?: BoardKind; noindex?: boolean; related?: Column[]; relatedCases?: CaseItem[] }> = ({ slug, column, views = 0, board = 'column', noindex = false, related = [], relatedCases = [] }) => {
  const bm: BoardMeta = BOARDS[board]
  const c = column ?? SEED_COLUMNS.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Layout title={`글을 찾을 수 없습니다 | ${bm.label}`} description="요청하신 글을 찾을 수 없습니다." path={bm.path} noindex>
        <section class="page-hero"><div class="container ph-inner"><h1>글을 찾을 수 없습니다</h1><p><a href={bm.path} style="color:var(--blue);text-decoration:underline">{bm.label} 목록 보기</a></p></div></section>
      </Layout>
    )
  }
  const isColumn = board === 'column'
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
  const path = `${bm.path}/${c.slug}`
  const url = `${SITE}${path}`
  const summary = isColumn ? answerSummary(c.body) : ''
  const faqs = isColumn ? faqsFromBlocks(c.body) : []
  const authorId = `${SITE}/doctors/${dr.slug}/#person`
  const coverAbs = cover ? (/^https?:\/\//.test(cover) ? cover : `${SITE}${cover}`) : `${SITE}/images/og-default.jpg`
  const reviewed = ymd(c.modified) || ymd(c.date)
  // 원장 칼럼: @graph(MedicalWebPage + BlogPosting + Physician + BreadcrumbList + FAQPage) @id 상호참조
  const columnGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'Physician'],
        '@id': authorId,
        name: dr.name,
        jobTitle: dr.title,
        description: dr.license,
        url: `${SITE}/doctors/${dr.slug}`,
        image: `${SITE}${dr.photo}`,
        worksFor: { '@id': `${SITE}/#medicalclinic` },
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: c.title,
        description: c.excerpt,
        inLanguage: 'ko-KR',
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#article` },
        ...(t ? { about: { '@id': `${SITE}/treatments/${t.slug}/#procedure` } } : {}),
        reviewedBy: { '@id': authorId },
        ...(reviewed ? { lastReviewed: reviewed } : {}),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: summary ? ['h1', '.answer-summary'] : ['h1'] },
        publisher: { '@id': `${SITE}/#medicalclinic` },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: c.title.slice(0, 110),
        description: c.excerpt,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        image: { '@type': 'ImageObject', url: coverAbs },
        ...(ymd(c.date) ? { datePublished: ymd(c.date) } : {}),
        ...(reviewed ? { dateModified: reviewed } : {}),
        author: { '@id': authorId },
        publisher: { '@id': `${SITE}/#medicalclinic` },
        isPartOf: { '@id': `${SITE}/#website` },
        ...(t ? { about: { '@id': `${SITE}/treatments/${t.slug}/#procedure` }, articleSection: t.shortName } : { articleSection: bm.label }),
        ...(wordCount ? { wordCount } : {}),
        inLanguage: 'ko-KR',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: bm.label, item: `${SITE}${bm.path}` },
          ...(t ? [{ '@type': 'ListItem', position: 3, name: t.shortName, item: `${SITE}/treatments/${t.slug}` }] : []),
          { '@type': 'ListItem', position: t ? 4 : 3, name: c.title, item: url },
        ],
      },
      ...(faqs.length >= 2 ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }] : []),
    ],
  }
  // <title>: 원장 칼럼은 '{제목} | 더착한치과' (PFWE 표준 A2). 후기·이야기 게시판은 기존 형식 유지
  return (
    <Layout
      title={isColumn ? `${c.title} | ${CLINIC.name}` : `${c.title} | ${CLINIC.name} ${bm.label}`}
      description={c.excerpt}
      path={path}
      noindex={noindex}
      ogType="article"
      ogImage={cover || undefined}
      article={{ published: ymd(c.date), modified: reviewed, section: t?.shortName || bm.label, author: isColumn ? `${dr.name} ${dr.title}` : undefined }}
      keywords={[bm.label, t?.shortName || '', '강서구 치과']}
      schemas={isColumn ? [columnGraph] : [
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: bm.label, path: bm.path }, { name: c.title, path: `${bm.path}/${c.slug}` }]),
        articleSchema({ title: c.title, description: c.excerpt, slug: c.slug, datePublished: c.date, dateModified: c.modified, authorSlug: dr.slug, authorName: dr.name, image: cover || undefined, wordCount: wordCount || undefined, section: t?.shortName || bm.label }),
        speakableSchema(['h1', '.article-body > p:first-of-type']),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class={`fa-solid fa-${bm.icon}`}></i> {bm.badge} · {c.date}{views > 0 && <span style="opacity:.75"> · 조회 {views.toLocaleString()}</span>}</div>
          <h1>{c.title}</h1>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: bm.label, path: bm.path }, { name: c.title, path: `${bm.path}/${c.slug}` }]} />
      <section class="sec">
        <div class="container article-body">
          {c.cover && <img src={c.cover} alt={c.coverAlt || c.title} class="col-cover" loading="eager" width="1200" height="630" />}
          {isColumn && (
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:24px;border-bottom:1px solid var(--line);margin-bottom:32px">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent));display:grid;place-items:center;color:#fff"><i class="fa-solid fa-user-doctor"></i></div>
            <div>
              <a href={`/doctors/${dr.slug}`} style="font-weight:800;color:var(--ink)">{dr.name} {dr.title}</a>
              <div style="font-size:13px;color:var(--ink-soft)">{dr.license}</div>
            </div>
          </div>
          )}
          {summary && (
            <div class="aeo-answer answer-summary" id="column-answer" aria-label="핵심 답변">
              <p class="answer-summary-label">핵심 답변</p>
              <p>{summary}</p>
            </div>
          )}
          {(() => {
            let n = 0
            return c.body.map((blk) => {
              const start = n
              n += (String(blk.p || '').match(/^\s*!\[/gm) || []).length
              return (<>{blk.h && <h2>{blk.h}</h2>}<RichBody text={blk.p} altBase={c.title} imgStart={start} /></>)
            })
          })()}
          {isColumn && (
          <aside class="col-author-box" aria-label="작성·감수">
            <a href={`/doctors/${dr.slug}`} class="col-author-photo"><img src={dr.photo} alt={`${dr.name} ${dr.title}`} width="88" height="88" loading="lazy" decoding="async" /></a>
            <div>
              <p class="col-author-role">작성·감수</p>
              <p class="col-author-name"><a href={`/doctors/${dr.slug}`}>{dr.name} {dr.title}</a></p>
              <p class="col-author-line">{dr.license}</p>
              {dr.career?.[0] && <p class="col-author-line">{dr.career[0]}</p>}
              {reviewed && <p class="col-author-line">최종 검토일 <time datetime={reviewed}>{reviewed}</time></p>}
              <p class="col-author-note">※ 이 글은 일반적인 건강 정보이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.</p>
            </div>
          </aside>
          )}
          {isColumn && (
          <div class="related-box">
            <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료 · 작성 의료진</h3>
            <div class="chip-row">
              {t && <a href={`/treatments/${t.slug}`} class="chip"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName} 진료 안내</a>}
              {t && relatedCases.length > 0 && <a href={`/cases?category=${t.slug}`} class="chip"><i class="fa-solid fa-images"></i> {t.shortName} 비포/애프터</a>}
              <a href={`/doctors/${dr.slug}`} class="chip"><i class="fa-solid fa-user-doctor"></i> {dr.name} {dr.title}</a>
            </div>
            {related.length > 0 && (
              <>
                <h3 style="margin-top:24px">함께 읽으면 좋은 칼럼</h3>
                <ul class="col-link-list">
                  {related.map((r) => <li><a href={`/column/${r.slug}`}>{r.title}</a></li>)}
                </ul>
              </>
            )}
            {relatedCases.length > 0 && (
              <>
                <h3 style="margin-top:24px">관련 비포/애프터 사례</h3>
                <ul class="col-link-list">
                  {relatedCases.map((cs) => <li><a href={`/cases/${cs.id}`}>{caseHeadline(cs, getTreatment(cs.category)?.shortName)}</a></li>)}
                </ul>
              </>
            )}
          </div>
          )}
          {!isColumn && <p style="font-size:13px;color:var(--ink-soft)">본 글은 개인의 경험이며, 치료 결과는 환자의 상태에 따라 다를 수 있습니다. 등록일: {c.date}</p>}
          <div style="margin-top:28px;text-align:center">
            <a href={bm.path} class="btn btn-outline"><i class="fa-solid fa-list"></i> {bm.label} 목록으로</a>
          </div>
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
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '백과사전', path: '/encyclopedia' }]), speakableSchema(['h1', '.page-hero h1 + p'])]}
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
      <Layout title="용어를 찾을 수 없습니다" description="요청하신 용어를 찾을 수 없습니다." path="/encyclopedia" noindex>
        <section class="page-hero"><div class="container ph-inner"><h1>용어를 찾을 수 없습니다</h1><p><a href="/encyclopedia" style="color:var(--blue);text-decoration:underline">백과사전 보기</a></p></div></section>
      </Layout>
    )
  }
  const related = (term.related || []).map((s) => getTreatment(s)).filter(Boolean)
  const seeTerms = (term.see || []).map((s) => getTerm(s)).filter((t) => t && t.slug !== term.slug)
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
      ...(term.updated ? { dateModified: term.updated } : {}),
    },
  ]
  if (hasQa) schemas.push(faqSchema(term.qa!))
  // 본문 없는 thin 용어는 noindex,follow (사이트맵도 제외 — src/data/encyclopedia.ts isThinTerm)
  const thin = isThinTerm(term)
  return (
    <Layout
      title={`${term.term}${term.reading ? ` (${term.reading})` : ''} | 치과 백과사전 · ${CLINIC.name}`}
      description={term.def.length > 150 ? term.def.slice(0, 150) : term.def}
      path={`/encyclopedia/${term.slug}`}
      keywords={[term.term, term.reading || '', term.category, '치과 용어', '강서구 명지 치과'].filter(Boolean)}
      schemas={schemas}
      noindex={thin}
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

          {/* 보강 용어: 소제목별 본문 (encyclopedia-enrich.ts) */}
          {term.sections && term.sections.length > 0 && (
            <div class="term-body">
              {term.sections.map((sec) => (
                <>
                  <h2>{sec.h}</h2>
                  {sec.p.map((para) => (
                    <p>
                      <InlinkText text={para} currentSlug={term.slug} />
                    </p>
                  ))}
                </>
              ))}
              <p class="term-reviewed" style="color:var(--ink-soft);font-size:14px">일반 건강정보입니다. 진료 판단은 내원 상담에서 원장이 직접 합니다.</p>
            </div>
          )}

          {/* 1000자 상세 본문 (자동 인링크 적용) */}
          {hasBody && !(term.sections && term.sections.length) && (
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

          {/* 보강 용어: 함께 보면 좋은 용어 */}
          {seeTerms.length > 0 && (
            <div class="related-box">
              <h3><i class="fa-solid fa-book-medical" style="color:var(--brand);margin-right:8px"></i>함께 보면 좋은 용어</h3>
              <div class="chip-row">
                {seeTerms.map((t) => (
                  <a href={`/encyclopedia/${t!.slug}`} class="chip">{t!.term}</a>
                ))}
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


