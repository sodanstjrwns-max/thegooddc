import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { DOCTORS, getDoctor } from '../data/doctors'
import { getTreatment } from '../data/treatments'
import { breadcrumbSchema, personSchema } from '../lib/seo'

export const DoctorsListPage: FC = () => (
  <Layout
    title={`의료진 소개 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과 의료진을 소개합니다. 치의학박사, 통합치의학과 전문의 황우석 대표원장의 24년 임상 경험으로 정확하고 편안한 진료를 제공합니다."
    path="/doctors"
    keywords={['강서구 치과 의료진', '명지 치과 원장', '통합치의학과 전문의', '치의학박사']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '의료진', path: '/doctors' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="eyebrow">MEDICAL STAFF</div>
        <h1>의료진 소개</h1>
        <p>정확한 진단과 꼼꼼한 설명으로 환자분의 신뢰를 쌓아가는 더착한치과 의료진입니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '의료진', path: '/doctors' }]} />

    <section class="sec">
      <div class="container" style="display:flex;flex-direction:column;gap:32px">
        {DOCTORS.map((d) => (
          <a href={`/doctors/${d.slug}`} class="doctor-card reveal" style="text-decoration:none">
            <div class="doctor-photo" style={d.photo ? `background-image:url('${d.photo}')` : ''}>{!d.photo && <i class="fa-solid fa-user-doctor"></i>}</div>
            <div>
              <span class="license">{d.license}</span>
              <h2 class="section-title" style="font-size:clamp(1.6rem,3vw,2rem);margin-bottom:8px;color:var(--ink)">{d.name} {d.title}</h2>
              <p class="section-lead" style="margin-bottom:18px;color:var(--blue);font-weight:700">{d.tagline}</p>
              <p style="color:var(--ink-soft);line-height:1.8;margin-bottom:22px">{d.philosophy}</p>
              <span class="btn btn-accent" style="pointer-events:none">프로필 자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        ))}
      </div>
    </section>
  </Layout>
)

export const DoctorDetailPage: FC<{ slug: string }> = ({ slug }) => {
  const d = getDoctor(slug)
  if (!d) {
    return (
      <Layout title="의료진을 찾을 수 없습니다" description="요청하신 의료진 정보를 찾을 수 없습니다." path="/doctors">
        <section class="page-hero"><div class="container ph-inner"><h1>의료진 정보를 찾을 수 없습니다</h1><p><a href="/doctors" style="color:var(--blue);text-decoration:underline">의료진 전체 보기</a></p></div></section>
      </Layout>
    )
  }
  const specialties = d.specialties.map((s) => getTreatment(s)).filter(Boolean)

  return (
    <Layout
      title={`${d.name} ${d.title} | ${CLINIC.name} 의료진`}
      description={`${CLINIC.name} ${d.name} ${d.title} (${d.license}). ${d.tagline}`}
      path={`/doctors/${d.slug}`}
      keywords={['강서구 치과 원장', d.name, '통합치의학과 전문의', '명지 치과']}
      schemas={[
        breadcrumbSchema([{ name: '홈', path: '/' }, { name: '의료진', path: '/doctors' }, { name: d.name, path: `/doctors/${d.slug}` }]),
        personSchema(d),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '의료진', path: '/doctors' }, { name: d.name, path: `/doctors/${d.slug}` }]} />
          <div class="eyebrow">{d.license}</div>
          <h1>{d.name} {d.title}</h1>
          <p>{d.tagline}</p>
        </div>
      </section>

      <section class="sec">
        <div class="container split">
          <div class="split-img reveal-scale" style={d.photo ? `background-image:url('${d.photo}');background-size:cover;background-position:center top;aspect-ratio:3/4` : 'display:grid;place-items:center;color:rgba(255,255,255,0.6);font-size:80px;aspect-ratio:3/4'}>
            {!d.photo && <i class="fa-solid fa-user-doctor"></i>}
          </div>
          <div class="reveal">
            <span class="license" style="display:inline-block;font-size:.82rem;font-weight:700;color:var(--blue);background:rgba(30,111,184,.1);padding:6px 14px;border-radius:100px;margin-bottom:14px">{d.license}</span>
            <h2 class="section-title" style="font-size:clamp(1.6rem,3vw,2rem);margin:0 0 24px">인사말</h2>
            {d.intro.map((p) => <p style="color:var(--ink-soft);line-height:1.9;margin-bottom:16px;font-size:1.05rem">{p}</p>)}
          </div>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container article-body">
          <h2>학력 및 경력</h2>
          <ul class="career-timeline">
            {d.career.map((c) => <li><span style="font-weight:600;color:var(--ink)">{c}</span></li>)}
          </ul>

          {specialties.length > 0 && (
            <div class="related-box" style="margin-top:36px">
              <h3><i class="fa-solid fa-tooth" style="color:var(--brand);margin-right:8px"></i>{d.name} {d.title}의 주요 진료</h3>
              <div class="chip-row">
                {specialties.map((t) => <a href={`/treatments/${t!.slug}`} class="chip"><i class={`fa-solid fa-${t!.icon}`}></i> {t!.shortName}</a>)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>{d.name} {d.title}과 상담하세요</h2>
            <p>정확한 진단과 충분한 설명으로 시작하는 진료</p>
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
