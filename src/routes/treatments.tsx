import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS, CORE_TREATMENTS, GENERAL_TREATMENTS, getTreatment } from '../data/treatments'
import { getDoctor } from '../data/doctors'
import { breadcrumbSchema, faqSchema, procedureSchema, speakableSchema } from '../lib/seo'

const CORE_IMG: Record<string, string> = {
  implant: '/images/core-implant.webp',
  'clear-aligner': '/images/core-aligner.webp',
  minish: '/images/core-minish.webp',
}

// ===== 진료 목록 페이지 =====
export const TreatmentsListPage: FC = () => (
  <Layout
    title={`진료안내 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과의 전체 진료 안내입니다. 디지털 가이드 임플란트, 투명교정, 미니쉬 심미치료부터 충치·잇몸·보철·사랑니까지 강서구 명지에서 한 곳에서."
    path="/treatments"
    keywords={['강서구 치과 진료', '명지 치과', '임플란트', '투명교정', '미니쉬']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }])]}
  >
    <section class="page-hero has-img">
      <div class="bg" data-parallax="0.12" style="background-image:url('/images/core-implant.webp')"></div>
      <div class="container ph-inner">
        <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }]} />
        <div class="eyebrow">TREATMENTS</div>
        <h1>진료 안내</h1>
        <p>디지털 정밀 진단을 기반으로, 한 분 한 분께 꼭 필요한 진료를 정확하게 설계합니다.</p>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="reveal" style="margin-bottom:40px"><div class="eyebrow">SIGNATURE</div><h2 class="section-title" style="font-size:34px">핵심 진료</h2></div>
        <div class="core-grid">
          {CORE_TREATMENTS.map((t, i) => (
            <a href={`/treatments/${t.slug}`} class={`core-card core-${i + 1} reveal`} data-delay={String(i + 1)}>
              <span class="num-tag">0{i + 1}</span>
              <h3>{t.name}</h3>
              <p>{t.tagline}</p>
              <span class="more">자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section class="sec bg-sand">
      <div class="container">
        <div class="reveal" style="margin-bottom:40px"><div class="eyebrow">FULL CARE</div><h2 class="section-title" style="font-size:34px">전체 진료 과목</h2></div>
        <div class="tlist-grid">
          {GENERAL_TREATMENTS.map((t, i) => (
            <a href={`/treatments/${t.slug}`} class="tlist-card reveal" data-delay={String((i % 3) + 1)}>
              <div class="tc-icon"><i class={`fa-solid fa-${t.icon}`}></i></div>
              <h3>{t.name}</h3>
              <p>{t.tagline}</p>
              <span class="go">자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  </Layout>
)

// ===== 진료 상세 페이지 =====
export const TreatmentDetailPage: FC<{ slug: string }> = ({ slug }) => {
  const t = getTreatment(slug)
  if (!t) return <NotFoundInline />
  const doctor = getDoctor(t.doctorSlug)
  const related = t.relatedTreatments.map((s) => getTreatment(s)).filter(Boolean)

  return (
    <Layout
      title={`${t.name} | ${CLINIC.name} 강서구 명지`}
      description={t.summary}
      path={`/treatments/${t.slug}`}
      keywords={t.keywords}
      schemas={[
        breadcrumbSchema([
          { name: '홈', path: '/' },
          { name: '진료안내', path: '/treatments' },
          { name: t.shortName, path: `/treatments/${t.slug}` },
        ]),
        procedureSchema(t),
        faqSchema(t.faq),
        speakableSchema(),
      ]}
    >
      <section class="page-hero has-img">
        <div class="bg" data-parallax="0.12" style={`background-image:url('${CORE_IMG[t.slug] || '/images/hero.webp'}')`}></div>
        <div class="container ph-inner">
          <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: t.shortName, path: `/treatments/${t.slug}` }]} />
          <div class="eyebrow">{t.category === 'core' ? 'SIGNATURE CARE' : 'TREATMENT'}</div>
          <h1>{t.name}</h1>
          <p>{t.tagline}</p>
          <div class="hero-actions" style="margin-top:30px">
            <a href="/reservation" class="btn btn-accent magnetic"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost magnetic"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="container">
          <div class="detail-layout">
            {/* sticky TOC */}
            <aside class="detail-toc">
              <div class="toc-label">목차</div>
              <ul>
                {t.qa.length > 0 && <li><a href="#qa">핵심 Q&A</a></li>}
                {t.sections.map((s, i) => <li><a href={`#sec-${i}`}>{s.heading}</a></li>)}
                {t.subProcedures && <li><a href="#sub">세부 진료</a></li>}
                {t.comparison && <li><a href="#cmp">비교 안내</a></li>}
                <li><a href="#related">관련 진료</a></li>
              </ul>
            </aside>

            <div class="article-body" style="margin:0">
              {/* AEO: 질문형 H2 + 직답 */}
              {t.qa.length > 0 && (
                <div id="qa">
                  {t.qa.map((qa) => (
                    <>
                      <h2>{qa.question}</h2>
                      <p class="aeo-answer">{qa.answer}</p>
                    </>
                  ))}
                </div>
              )}

              {/* 본문 섹션 */}
              {t.sections.map((s, i) => (
                <div id={`sec-${i}`} class="reveal">
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                </div>
              ))}

              {/* 세부 시술 */}
              {t.subProcedures && (
                <div id="sub" class="reveal">
                  <h2>세부 진료 안내</h2>
                  <div class="sub-grid">
                    {t.subProcedures.map((sp) => (
                      <div class="sub-card"><h4>{sp.name}</h4><p>{sp.desc}</p></div>
                    ))}
                  </div>
                </div>
              )}

              {/* 비교표 */}
              {t.comparison && (
                <div id="cmp" class="reveal">
                  <h2>{t.comparison.title}</h2>
                  <table class="cmp-table">
                    <thead><tr>{t.comparison.columns.map((c) => <th>{c}</th>)}</tr></thead>
                    <tbody>{t.comparison.rows.map((row) => <tr>{row.map((cell) => <td>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}

              {/* 인링크 */}
              <div id="related">
                {doctor && (
                  <div class="related-box reveal">
                    <h3><i class="fa-solid fa-user-doctor" style="color:var(--brand);margin-right:8px"></i>담당 의료진</h3>
                    <a href={`/doctors/${doctor.slug}`} class="chip"><i class="fa-solid fa-stethoscope"></i> {doctor.name} {doctor.title} · {doctor.license}</a>
                  </div>
                )}
                {related.length > 0 && (
                  <div class="related-box reveal">
                    <h3><i class="fa-solid fa-link" style="color:var(--brand);margin-right:8px"></i>관련 진료 · 콘텐츠</h3>
                    <div class="chip-row">
                      {related.map((r) => <a href={`/treatments/${r!.slug}`} class="chip"><i class={`fa-solid fa-${r!.icon}`}></i> {r!.shortName}</a>)}
                      <a href="/cases" class="chip"><i class="fa-solid fa-images"></i> 비포/애프터</a>
                      <a href={`/encyclopedia/${t.slug}`} class="chip"><i class="fa-solid fa-book"></i> 백과사전</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 48px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title">{t.shortName} 자주 묻는 질문</h2>
          </div>
          <FaqList faqs={t.faq} />
        </div>
      </section>

      {/* CTA */}
      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>{t.shortName}, 정확한 진단부터 시작하세요</h2>
            <p>정밀 진단 후 개인별 맞춤 진료 계획을 안내해 드립니다.</p>
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

const NotFoundInline: FC = () => (
  <Layout title="페이지를 찾을 수 없습니다" description="요청하신 진료 정보를 찾을 수 없습니다." path="/treatments">
    <section class="page-hero"><div class="container ph-inner"><h1>진료 정보를 찾을 수 없습니다</h1><p><a href="/treatments" style="color:var(--blue);text-decoration:underline">전체 진료 보기</a></p></div></section>
  </Layout>
)

export { TREATMENTS }
