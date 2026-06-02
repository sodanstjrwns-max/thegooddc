import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { getArea } from '../data/areas'
import { getTreatment } from '../data/treatments'
import { breadcrumbSchema, faqSchema, citySchema, speakableSchema } from '../lib/seo'

// 지역 × 진료 조합 SEO 페이지: /area/:areaSlug-:treatmentSlug
export const AreaPage: FC<{ areaSlug: string; treatmentSlug: string }> = ({ areaSlug, treatmentSlug }) => {
  const area = getArea(areaSlug)
  const t = getTreatment(treatmentSlug)
  if (!area || !t) {
    return (
      <Layout title="페이지를 찾을 수 없습니다" description="요청하신 지역 진료 정보를 찾을 수 없습니다." path="/">
        <section class="page-hero"><div class="container ph-inner"><h1>페이지를 찾을 수 없습니다</h1><p><a href="/treatments" style="color:#fff;text-decoration:underline">진료 안내 보기</a></p></div></section>
      </Layout>
    )
  }

  const kw = `${area.name} ${t.shortName}`
  const localFaqs = [
    { q: `${kw} 치과는 어디에 있나요?`, a: `${CLINIC.name}는 ${CLINIC.address}에 위치하며, ${area.desc} 지역에서 가까워 ${area.name} 지역 환자분들이 편리하게 내원하실 수 있습니다.` },
    { q: `${area.name}에서 ${t.shortName} 진료를 받을 수 있나요?`, a: `네, ${CLINIC.name}는 ${area.fullName} 인근에서 ${t.name} 진료를 제공합니다. 통합치의학과 전문의가 정밀 진단 후 진료 계획을 안내해 드립니다.` },
    ...t.faq.slice(0, 3),
  ]

  return (
    <Layout
      title={`${kw} | ${CLINIC.name} 강서구 명지`}
      description={`${area.fullName} 인근 ${t.name} 진료. ${CLINIC.name}는 ${t.summary.slice(0, 90)}`}
      path={`/area/${areaSlug}-${treatmentSlug}`}
      keywords={[`${kw}`, `${area.name} 치과`, `${kw} 치과`, ...t.keywords.slice(0, 2)]}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: kw, path: `/area/${areaSlug}-${treatmentSlug}` }]),
        citySchema(area),
        faqSchema(localFaqs),
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
          <h2>{area.name}에서 {t.shortName} 진료, {CLINIC.name}</h2>
          <p class="aeo-answer">
            {CLINIC.name}는 {CLINIC.address}에 위치해 {area.desc} 지역에서 가까운 거리에 있습니다.
            {t.name} 진료를 찾으시는 {area.name} 지역 환자분께 통합치의학과 전문의가 정확한 진단과 편안한 진료를 제공합니다.
          </p>
          {t.sections.slice(0, 2).map((s) => (<><h2>{s.heading}</h2><p>{s.body}</p></>))}

          <div class="related-box">
            <h3><i class="fa-solid fa-circle-info" style="color:var(--brand);margin-right:8px"></i>{area.name}에서 오시는 길</h3>
            <p style="margin:0 0 14px;color:var(--ink-soft)"><strong>주소:</strong> {CLINIC.address}</p>
            <p style="margin:0 0 14px;color:var(--ink-soft)"><strong>자가용:</strong> {CLINIC.directions.car}</p>
            <div class="chip-row">
              <a href="/directions" class="chip"><i class="fa-solid fa-location-dot"></i> 오시는 길 자세히</a>
              <a href={`/treatments/${t.slug}`} class="chip"><i class={`fa-solid fa-${t.icon}`}></i> {t.shortName} 자세히</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="chip"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
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
