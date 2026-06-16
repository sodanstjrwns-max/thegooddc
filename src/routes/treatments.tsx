import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS, CORE_TREATMENTS, GENERAL_TREATMENTS, getTreatment } from '../data/treatments'
import { getDoctor } from '../data/doctors'
import { TREATMENT_FABLES, STORY_CTA } from '../data/story'
import { breadcrumbSchema, faqSchema, procedureSchema, speakableSchema, procedureRichSchema, howToSchema, qaPageSchema, imageObjectSchema, medicalWebPageSchema, itemListSchema } from '../lib/seo'
import { InlinkText } from '../lib/inlink'

const CORE_IMG: Record<string, string> = {
  implant: '/images/core-implant.webp',
  'clear-aligner': '/images/core-aligner.webp',
  minish: '/images/core-minish.webp',
}

// 진료별 임상 메타데이터 (procedureRichSchema 강화용 — AI가 깊게 인용)
const PROC_META: Record<string, { bodyLocation?: string; preparation?: string; followup?: string; howPerformed?: string }> = {
  implant: {
    bodyLocation: '상·하악 치조골',
    preparation: '3D CT 촬영과 구강 스캔으로 골량·신경 위치를 분석하고, 디지털 가이드를 제작합니다.',
    followup: '식립 후 정기 검진으로 골유착 상태를 확인하며, 보철 장착 후에도 주기적 관리를 권장합니다.',
    howPerformed: '디지털 가이드를 이용해 계획된 위치에 임플란트 픽스처를 식립하고, 골유착 후 지대주와 보철을 연결합니다.',
  },
  'clear-aligner': {
    bodyLocation: '치열 전체',
    preparation: '디지털 스캔으로 치아 배열을 분석하고, 시뮬레이션으로 이동 경로를 설계합니다.',
    followup: '교정 종료 후 유지장치(리테이너)를 착용해 안정화하며 정기적으로 경과를 확인합니다.',
    howPerformed: '단계별 투명 장치를 순차 교체하며 치아를 계획된 위치로 점진적으로 이동시킵니다.',
  },
  minish: {
    bodyLocation: '전치부·구치부 치아 표면',
    preparation: '심미 분석과 모의 제작(목업)으로 형태와 색조를 사전에 디자인합니다.',
    followup: '부착 후 교합을 점검하고, 정기 검진으로 변연 적합도를 관리합니다.',
    howPerformed: '최소 삭제 후 정밀 제작된 세라믹을 치아 표면에 접착해 형태와 색을 개선합니다.',
  },
  integrated: {
    bodyLocation: '구강 전체',
    preparation: '문진·임상 검사·방사선 촬영으로 구강 전반을 진단하고 치료 우선순위를 설계합니다.',
    followup: '치료 후 정기 검진과 위생 관리로 구강 건강을 유지하도록 안내합니다.',
    howPerformed: '응급 처치 → 잇몸 기초 → 충치·신경 → 보철·심미 순으로 단계별 통합 치료를 진행합니다.',
  },
  conservative: {
    bodyLocation: '치아 경조직·치수',
    preparation: '정밀 진단으로 충치 범위와 치아 균열 여부를 파악합니다.',
    followup: '신경치료 후 크라운으로 보호하고, 정기 검진으로 경계 부위 재발을 관리합니다.',
    howPerformed: '충치 범위에 따라 레진 충전, 인레이, 신경치료 등으로 자연 치아를 보존하며 수복합니다.',
  },
  prosthodontics: {
    bodyLocation: '결손·손상 치아 부위',
    preparation: '구강 스캔과 영상으로 잔존 치아·잇몸뼈 상태를 분석해 보철 방식을 설계합니다.',
    followup: '장착 후 교합을 점검하고, 경계 부위 위생 관리와 정기 검진으로 수명을 관리합니다.',
    howPerformed: '원내 기공실에서 정밀 제작한 크라운·브릿지·틀니를 장착해 기능과 형태를 복원합니다.',
  },
  orthodontics: {
    bodyLocation: '치열 전체',
    preparation: '3D 스캔·세팔로 등 영상 분석으로 치아 배열과 골격 관계를 진단합니다.',
    followup: '교정 후 유지장치(리테이너)를 착용해 결과를 안정화하고 정기 점검합니다.',
    howPerformed: '투명교정 또는 브라켓 교정으로 치아를 계획된 위치로 점진적으로 이동시킵니다.',
  },
  periodontics: {
    bodyLocation: '치주 조직(잇몸·치조골)',
    preparation: '치주낭 깊이 측정과 방사선 촬영으로 치주 상태를 정밀 진단합니다.',
    followup: '정기 스케일링과 유지 관리로 재발을 예방하고 잇몸 건강을 유지합니다.',
    howPerformed: '진행 정도에 따라 스케일링, 치근활택술, 치주 수술 등으로 단계적으로 치료합니다.',
  },
  'oral-surgery': {
    bodyLocation: '구강·악안면 부위',
    preparation: '매복 사랑니는 신경 손상 위험 평가를 위해 3D CT로 위치를 확인합니다.',
    followup: '발치 후 혈병 유지와 지혈 관리를 안내하고, 부기·통증 경과를 확인합니다.',
    howPerformed: '국소마취 후 사랑니·매복치 발치 및 외과적 처치를 안전하게 진행합니다.',
  },
  preventive: {
    bodyLocation: '구강 전체',
    preparation: '정기 검진과 위험도 평가로 충치·잇몸병 예방 계획을 세웁니다.',
    followup: '개인별 검진 주기와 위생 관리법을 안내해 꾸준한 예방을 돕습니다.',
    howPerformed: '스케일링, 불소도포, 실란트(치아 홈메우기) 등으로 질환을 미리 예방합니다.',
  },
  imaging: {
    bodyLocation: '치아·악골·턱관절',
    preparation: '진료 목적에 맞는 영상 검사를 선택하고 방호 장비를 적용합니다.',
    followup: '촬영 영상을 환자와 함께 확인하며 진단 근거를 설명합니다.',
    howPerformed: '파노라마, 3D CT, 교익 촬영, 구강 스캔 등으로 정밀 진단 데이터를 채득합니다.',
  },
  'oral-medicine': {
    bodyLocation: '턱관절·구강 점막·저작근',
    preparation: '턱 움직임·근육 촉진·소리 확인과 필요시 영상으로 원인을 평가합니다.',
    followup: '증상 변화에 따라 장치·습관 교정 효과를 점검하며 단계적으로 관리합니다.',
    howPerformed: '생활 습관 교정, 물리치료, 약물치료, 스플린트 치료 등 보존적 방법을 우선합니다.',
  },
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
              <div class="ico"><i class={`fa-solid fa-${t.icon}`}></i></div>
              <div class="tc-body">
                <div class="nm">{t.shortName}</div>
                <div class="sub">{t.name}</div>
              </div>
              <i class="fa-solid fa-arrow-right tc-go"></i>
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
  const fable = TREATMENT_FABLES[t.slug]
  const meta = PROC_META[t.slug]
  const heroImg = CORE_IMG[t.slug]

  // AEO: 진료 과정을 HowTo로 구조화 — process(명시적 단계) 우선, 없으면 섹션 기반
  const howToSteps = t.process && t.process.length
    ? t.process.map((p) => ({ name: p.step, text: p.desc }))
    : t.sections.slice(0, 6).map((s) => ({ name: s.heading, text: s.body.slice(0, 280) }))

  const richSchemas: object[] = [
    breadcrumbSchema([
      { name: '홈', path: '/' },
      { name: '진료안내', path: '/treatments' },
      { name: t.shortName, path: `/treatments/${t.slug}` },
    ]),
    // 강화 MedicalProcedure(임상 메타 + 적응증 포함)
    procedureRichSchema({ name: t.name, slug: t.slug, summary: t.summary, ...meta, indications: t.indications, status: t.recovery }),
    // 의료 콘텐츠 신뢰 신호(검토 주체·검토일) — 구글 의료 E-E-A-T
    medicalWebPageSchema({
      name: `${t.name} | ${CLINIC.name}`,
      path: `/treatments/${t.slug}`,
      description: t.summary,
      about: t.name,
      doctorName: doctor?.name,
      doctorLicense: doctor?.license,
    }),
    faqSchema(t.faq),
    speakableSchema(),
  ]
  // 대표 질문 1개를 QAPage로 강조 (직답 인용 가능성↑)
  if (t.qa.length > 0) {
    richSchemas.push(qaPageSchema({ question: t.qa[0].question, answer: t.qa[0].answer }))
  }
  // 과정형 섹션이 2개 이상이면 HowTo 추가
  if (howToSteps.length >= 2) {
    richSchemas.push(howToSchema({ name: `${t.shortName} 진료 과정`, description: t.summary, steps: howToSteps }))
  }
  // 세부 진료가 있으면 ItemList 구조화
  if (t.subProcedures && t.subProcedures.length) {
    richSchemas.push(itemListSchema({ name: `${t.shortName} 세부 진료`, path: `/treatments/${t.slug}`, items: t.subProcedures }))
  }
  // 대표 이미지가 있으면 ImageObject
  if (heroImg) {
    richSchemas.push(imageObjectSchema({ url: heroImg, caption: `${CLINIC.name} ${t.name}` }))
  }

  return (
    <Layout
      title={`${t.name} | ${CLINIC.name} 강서구 명지`}
      description={t.summary}
      path={`/treatments/${t.slug}`}
      keywords={t.keywords}
      ogImage={heroImg}
      schemas={richSchemas}
    >
      <section class="page-hero has-img">
        <div class="bg" data-parallax="0.12" style={`background-image:url('${CORE_IMG[t.slug] || '/images/hero.webp'}')`}></div>
        <div class="container ph-inner">
          <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: t.shortName, path: `/treatments/${t.slug}` }]} />
          <div class="eyebrow">{t.category === 'core' ? 'SIGNATURE CARE' : 'TREATMENT'}</div>
          <h1>{t.name}</h1>
          <p>{t.tagline}</p>
          <div class="hero-actions" style="margin-top:30px">
            <a href="/reservation" class="btn btn-accent magnetic"><i class="fa-regular fa-calendar-check"></i> {STORY_CTA.reserve}</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost magnetic"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
          </div>
        </div>
      </section>

      {/* ===== 페이블: 3막 우화 도입부 ===== */}
      {fable && (
        <section class="t-fable" aria-label="환자 이야기">
          <div class="container">
            <div class="t-fable-grid">
              <article class="t-fable-act reveal">
                <span class="act-no">제1막</span>
                <span class="act-label">어떤 고민</span>
                <p>{fable.act1}</p>
              </article>
              <article class="t-fable-act reveal reveal-d1">
                <span class="act-no">제2막</span>
                <span class="act-label">함께 세운 계획</span>
                <p>{fable.act2}</p>
              </article>
              <article class="t-fable-act reveal reveal-d2">
                <span class="act-no">제3막</span>
                <span class="act-label">달라진 일상</span>
                <p>{fable.act3}</p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section class="sec">
        <div class="container">
          <div class="detail-layout">
            {/* sticky TOC */}
            <aside class="detail-toc">
              <div class="toc-label">목차</div>
              <ul>
                {t.qa.length > 0 && <li><a href="#qa">핵심 Q&A</a></li>}
                {t.indications && <li><a href="#indications">이런 분께 권합니다</a></li>}
                {t.sections.map((s, i) => <li><a href={`#sec-${i}`}>{s.heading}</a></li>)}
                {t.process && <li><a href="#process">진료 과정</a></li>}
                {t.subProcedures && <li><a href="#sub">세부 진료</a></li>}
                {t.comparison && <li><a href="#cmp">비교 안내</a></li>}
                {t.cautions && <li><a href="#cautions">주의사항</a></li>}
                {t.recovery && <li><a href="#recovery">회복·관리</a></li>}
                <li><a href="#related">관련 진료</a></li>
              </ul>
            </aside>

            <div class="article-body" style="margin:0">
              {/* AEO: 질문형 H2 + 직답 (AI 답변 엔진이 그대로 인용하기 좋은 형태) */}
              {t.qa.length > 0 && (
                <div id="qa" class="aeo-qa-block">
                  {t.qa.map((qa) => (
                    <>
                      <h2>{qa.question}</h2>
                      <p class="aeo-answer"><strong class="aeo-tldr">한줄답:</strong> {qa.answer}</p>
                    </>
                  ))}
                </div>
              )}

              {/* 적응증: 이런 분께 권합니다 (AEO — "누구에게 필요한가" 직답) */}
              {t.indications && (
                <div id="indications" class="reveal">
                  <h2>이런 분께 권합니다</h2>
                  <ul class="indication-list">
                    {t.indications.map((it) => (
                      <li><i class="fa-solid fa-circle-check" style="color:var(--brand);margin-right:10px"></i>{it}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 본문 섹션 */}
              {t.sections.map((s, i) => (
                <div id={`sec-${i}`} class="reveal">
                  <h2>{s.heading}</h2>
                  <p><InlinkText text={s.body} exclude={[t.slug]} /></p>
                </div>
              ))}

              {/* 진료 과정 (HowTo 시각화 — 단계별 타임라인) */}
              {t.process && (
                <div id="process" class="reveal">
                  <h2>진료는 이렇게 진행됩니다</h2>
                  <ol class="process-steps">
                    {t.process.map((p) => (
                      <li class="process-step">
                        <div class="ps-head">{p.step}</div>
                        <div class="ps-desc">{p.desc}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

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

              {/* 주의사항·고려사항 (의료광고법 준수 — 정확한 정보 제공) */}
              {t.cautions && (
                <div id="cautions" class="reveal">
                  <h2>진료 전 알아두면 좋은 점</h2>
                  <ul class="caution-list">
                    {t.cautions.map((cau) => (
                      <li><i class="fa-solid fa-circle-info" style="color:var(--blue);margin-right:10px"></i>{cau}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 회복·관리 안내 */}
              {t.recovery && (
                <div id="recovery" class="reveal">
                  <h2>진료 후 회복과 관리</h2>
                  <p class="recovery-note"><i class="fa-solid fa-heart-pulse" style="color:var(--brand);margin-right:8px"></i>{t.recovery}</p>
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
            <h2>{t.shortName} 이야기의 첫 문장을 써보세요</h2>
            <p>정밀 진단 후 개인별 맞춤 진료 계획을 함께 설계합니다.</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> {STORY_CTA.reserve}</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {STORY_CTA.call}</a>
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
