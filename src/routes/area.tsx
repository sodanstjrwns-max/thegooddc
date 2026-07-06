import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { getArea, getNeighborAreas, AREA_TREATMENTS } from '../data/areas'
import { getTreatment, CORE_TREATMENTS } from '../data/treatments'
import {
  breadcrumbSchema, faqSchema, citySchema, cityRichSchema, speakableSchema,
  qaPageSchema, areaLocalBusinessSchema, serviceAreaSchema, collectionPageSchema,
} from '../lib/seo'

const BUS_ALL = [
  ...CLINIC.directions.bus.general,
  ...CLINIC.directions.bus.seat,
  ...CLINIC.directions.bus.express,
]
const HOURS_LINE = `평일 09:00-18:00(월·수 야간 20:00), 토 08:00-12:00 · ${CLINIC.hoursNote}`

// ============================================================
// 지역 × 진료 조합 SEO 페이지: /area/:areaSlug-:treatmentSlug
// ============================================================
export const AreaPage: FC<{ areaSlug: string; treatmentSlug: string }> = ({ areaSlug, treatmentSlug }) => {
  const area = getArea(areaSlug)
  const t = getTreatment(treatmentSlug)
  if (!area || !t) return <AreaNotFound />

  const kw = `${area.name} ${t.shortName}`
  const neighbors = getNeighborAreas(areaSlug, 4)
  const otherTreatments = AREA_TREATMENTS.filter((x) => x.slug !== t.slug)

  const localFaqs = [
    { q: `${kw} 치과는 어디에 있나요?`, a: `${CLINIC.name}는 ${CLINIC.address}에 위치하며, ${area.desc} 지역에서 가까워 ${area.name} 지역 환자분들이 편리하게 내원하실 수 있습니다.` },
    { q: `${area.name}에서 ${t.shortName} 진료를 받을 수 있나요?`, a: `네, ${CLINIC.name}는 ${area.fullName} 인근에서 ${t.name} 진료를 제공합니다. 통합치의학과 전문의가 정밀 진단 후 진료 계획을 안내해 드립니다.` },
    ...(area.distance ? [{ q: `${area.name}에서 ${CLINIC.name}까지 얼마나 걸리나요?`, a: `${area.distance}${area.transit ? ` (${area.transit})` : ''}. ${HOURS_LINE}` }] : []),
    ...(area.localFaq || []),
    ...t.faq.slice(0, 2),
  ]

  return (
    <Layout
      title={`${kw} | ${CLINIC.name} 강서구 명지 치과`}
      description={`${area.fullName} 인근 ${t.name} 진료. ${area.distance || ''} ${CLINIC.name}는 ${t.summary.slice(0, 80)}`}
      path={`/area/${areaSlug}-${treatmentSlug}`}
      keywords={[kw, `${area.name} 치과`, `${kw} 치과`, `${area.name} ${t.shortName} 잘하는곳`, ...t.keywords.slice(0, 2)]}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: kw, path: `/area/${areaSlug}-${treatmentSlug}` }]),
        cityRichSchema(area),
        faqSchema(localFaqs),
        qaPageSchema({ question: `${area.name}에서 ${t.shortName} 진료를 받을 수 있나요?`, answer: localFaqs[1].a }),
        serviceAreaSchema(20),
        speakableSchema(),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-location-dot"></i> {area.fullName}</div>
          <h1>{area.name} {t.shortName}</h1>
          <p>{area.desc}에서 가까운 {CLINIC.name}의 {t.name} 진료를 안내합니다.</p>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: kw, path: `/area/${areaSlug}-${treatmentSlug}` }]} />

      <section class="sec">
        <div class="container article-body">
          {/* AEO 직답 */}
          <h2>{area.name}에서 {t.shortName} 진료, {CLINIC.name}</h2>
          <p class="aeo-answer">
            <strong class="aeo-tldr">한줄답:</strong> {CLINIC.name}는 {CLINIC.address}에 위치해 {area.desc} 지역에서 {area.distance ? area.distance : '가까운 거리'}입니다.
            {t.name} 진료를 찾으시는 {area.name} 지역 환자분께 통합치의학과 전문의가 정확한 진단과 편안한 진료를 제공합니다.
          </p>

          {/* 지역 고유 소개 (thin-content 제거) */}
          {area.intro && <p>{area.intro}</p>}

          {/* 진료 핵심 섹션 (2개) */}
          {t.sections.slice(0, 2).map((s) => (<><h2>{s.heading}</h2><p>{s.body}</p></>))}

          {/* 오시는 길 · 교통 · 진료시간 */}
          <div class="related-box">
            <h3><i class="fa-solid fa-route" style="color:var(--brand);margin-right:8px"></i>{area.name}에서 오시는 길 · 진료시간</h3>
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>주소:</strong> {CLINIC.address}</p>
            {area.transit && <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>{area.name}→본원:</strong> {area.transit}{area.distance ? ` · ${area.distance}` : ''}</p>}
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>자가용:</strong> {CLINIC.directions.car}</p>
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>버스:</strong> {BUS_ALL.join(', ')}</p>
            <p style="margin:0 0 14px;color:var(--ink-soft)"><strong>진료시간:</strong> {HOURS_LINE}</p>
            <div class="chip-row">
              <a href="/directions" class="chip"><i class="fa-solid fa-location-dot"></i> 오시는 길 자세히</a>
              <a href={`/treatments/${t.slug}`} class="chip"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName} 자세히</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="chip"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>

          {/* 지역×진료 인링크 메시: 같은 지역 다른 진료 */}
          <div class="related-box">
            <h3><i class="fa-solid fa-layer-group" style="color:var(--brand);margin-right:8px"></i>{area.name}에서 받을 수 있는 다른 진료</h3>
            <div class="chip-row">
              {otherTreatments.map((ot) => (
                <a href={`/area/${area.slug}-${ot.slug}`} class="chip"><i class="fa-solid fa-tooth"></i> {area.name} {ot.name}</a>
              ))}
              <a href={`/clinic/${area.slug}`} class="chip"><i class="fa-solid fa-hospital"></i> {area.name} 치과 전체보기</a>
            </div>
          </div>

          {/* 이웃 지역 인링크 메시 */}
          <div class="related-box">
            <h3><i class="fa-solid fa-map-location-dot" style="color:var(--brand);margin-right:8px"></i>인근 지역 {t.shortName}</h3>
            <div class="chip-row">
              {neighbors.map((n) => (
                <a href={`/area/${n.slug}-${t.slug}`} class="chip"><i class="fa-solid fa-location-dot"></i> {n.name} {t.shortName}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 40px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title" style="font-size:30px">{kw} 자주 묻는 질문</h2>
          </div>
          <FaqList faqs={localFaqs} />
        </div>
      </section>

      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>{area.name}에서 {t.shortName}, 지금 상담하세요</h2>
            <p>{CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

// ============================================================
// 지역 허브(랜딩) 페이지: /clinic/:areaSlug
// 한 지역의 모든 진료를 묶는 대표 페이지 — 로컬 검색 권위 페이지
// ============================================================
export const AreaHubPage: FC<{ areaSlug: string }> = ({ areaSlug }) => {
  const area = getArea(areaSlug)
  if (!area) return <AreaNotFound />

  const neighbors = getNeighborAreas(areaSlug, 5)
  const hubFaqs = [
    { q: `${area.name}에서 가까운 치과는 어디인가요?`, a: `${CLINIC.name}는 ${CLINIC.address}에 위치해 ${area.fullName}에서 ${area.distance || '가까운 거리'}입니다. ${area.transit || ''}` },
    { q: `${area.name}에서 어떤 진료를 받을 수 있나요?`, a: `${CLINIC.name}는 임플란트, 투명교정, 스마일 크라운 심미치료, 치아교정을 포함한 통합치의학과 전 과목 진료를 제공합니다. ${area.name} 지역 환자분이 한 곳에서 모든 진료를 받으실 수 있습니다.` },
    { q: `${area.name}에서 ${CLINIC.name} 진료시간은 어떻게 되나요?`, a: HOURS_LINE },
    ...(area.localFaq || []),
  ]

  const hubItems = AREA_TREATMENTS.map((ot) => ({ name: `${area.name} ${ot.name}`, url: `/area/${area.slug}-${ot.slug}` }))

  return (
    <Layout
      title={`${area.name} 치과 | ${CLINIC.name} — 임플란트·교정·심미치료`}
      description={`${area.fullName} 인근 치과 ${CLINIC.name}. ${area.distance || ''} 임플란트·투명교정·스마일 크라운·치아교정 통합 진료. ${area.intro?.slice(0, 60) || ''}`}
      path={`/clinic/${area.slug}`}
      keywords={[`${area.name} 치과`, `${area.name} 임플란트`, `${area.name} 교정`, `${area.name} 치과 추천`, `${area.fullName} 치과`]}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: `${area.name} 치과`, path: `/clinic/${area.slug}` }]),
        areaLocalBusinessSchema(area),
        cityRichSchema(area),
        collectionPageSchema({ name: `${area.name} 치과 진료 안내`, path: `/clinic/${area.slug}`, description: `${area.fullName} 인근 ${CLINIC.name}의 진료 안내`, items: hubItems }),
        faqSchema(hubFaqs),
        qaPageSchema({ question: `${area.name}에서 가까운 치과는 어디인가요?`, answer: hubFaqs[0].a }),
        serviceAreaSchema(20),
        speakableSchema(),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-location-dot"></i> {area.fullName}</div>
          <h1>{area.name} 치과, {CLINIC.name}</h1>
          <p>{area.desc} — 임플란트·교정·심미치료를 한 곳에서.</p>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: `${area.name} 치과`, path: `/clinic/${area.slug}` }]} />

      <section class="sec">
        <div class="container article-body">
          <h2>{area.name}에서 가까운 치과를 찾으신다면</h2>
          <p class="aeo-answer">
            <strong class="aeo-tldr">한줄답:</strong> {CLINIC.name}는 {CLINIC.address}에 위치해 {area.fullName}에서 {area.distance || '가까운 거리'}입니다.
            통합치의학과 전문의가 임플란트·투명교정·스마일 크라운·치아교정을 정밀하게 진료합니다.
          </p>
          {area.intro && <p>{area.intro}</p>}

          {/* 지역 랜드마크 */}
          {area.landmarks && area.landmarks.length > 0 && (
            <p><strong>{area.name} 주요 위치:</strong> {area.landmarks.join(' · ')} 인근에서 내원하기 편리합니다.</p>
          )}

          {/* 진료 허브 카드 */}
          <h2>{area.name}에서 받을 수 있는 진료</h2>
          <div class="chip-row" style="margin-bottom:24px">
            {AREA_TREATMENTS.map((ot) => {
              const td = getTreatment(ot.slug)
              return (
                <a href={`/area/${area.slug}-${ot.slug}`} class="chip">
                  <i class={`fa-solid fa-${td?.icon || 'tooth'}`}></i> {area.name} {ot.name}
                </a>
              )
            })}
          </div>

          {/* 핵심 진료 자세히 */}
          <h2>핵심 진료 안내</h2>
          <div class="sub-grid">
            {CORE_TREATMENTS.map((td) => (
              <a href={`/treatments/${td.slug}`} class="sub-card" style="text-decoration:none;display:block">
                <h3><i class={`fa-solid fa-${td.icon}`} style="color:var(--brand);margin-right:6px"></i>{td.shortName}</h3>
                <p>{td.tagline}</p>
              </a>
            ))}
          </div>

          {/* 오시는 길 */}
          <div class="related-box">
            <h3><i class="fa-solid fa-route" style="color:var(--brand);margin-right:8px"></i>{area.name}에서 오시는 길 · 진료시간</h3>
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>주소:</strong> {CLINIC.address}</p>
            {area.transit && <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>{area.name}→본원:</strong> {area.transit}{area.distance ? ` · ${area.distance}` : ''}</p>}
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>자가용:</strong> {CLINIC.directions.car}</p>
            <p style="margin:0 0 12px;color:var(--ink-soft)"><strong>버스:</strong> {BUS_ALL.join(', ')}</p>
            <p style="margin:0 0 14px;color:var(--ink-soft)"><strong>진료시간:</strong> {HOURS_LINE}</p>
            <div class="chip-row">
              <a href="/directions" class="chip"><i class="fa-solid fa-location-dot"></i> 오시는 길 자세히</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="chip"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
              <a href="/reservation" class="chip"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
            </div>
          </div>

          {/* 이웃 지역 허브 인링크 */}
          <div class="related-box">
            <h3><i class="fa-solid fa-map-location-dot" style="color:var(--brand);margin-right:8px"></i>인근 지역 치과 안내</h3>
            <div class="chip-row">
              {neighbors.map((n) => (
                <a href={`/clinic/${n.slug}`} class="chip"><i class="fa-solid fa-hospital"></i> {n.name} 치과</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 40px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title" style="font-size:30px">{area.name} 치과 자주 묻는 질문</h2>
          </div>
          <FaqList faqs={hubFaqs} />
        </div>
      </section>

      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>{area.name}에서 가까운 치과, 지금 상담하세요</h2>
            <p>{CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

const AreaNotFound: FC = () => (
  <Layout title="페이지를 찾을 수 없습니다" description="요청하신 지역 진료 정보를 찾을 수 없습니다." path="/">
    <section class="page-hero"><div class="container ph-inner"><h1>페이지를 찾을 수 없습니다</h1><p><a href="/treatments" style="color:var(--blue);text-decoration:underline">진료 안내 보기</a></p></div></section>
  </Layout>
)
