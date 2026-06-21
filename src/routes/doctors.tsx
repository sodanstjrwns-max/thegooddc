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
              <span class="license"><i class="fa-solid fa-certificate"></i>{d.license}</span>
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

      {d.videoId && (
        <section class="sec doc-video" aria-label="원장 소개 영상">
          <div class="container">
            <div class="shead center" style="margin-bottom:34px">
              <span class="eyebrow center">Introduction Film</span>
              <h2>{d.videoTitle || `영상으로 만나는 ${d.name} ${d.title}`}</h2>
              <p>진료 철학과 진료실의 모습을 영상으로 직접 확인해 보세요.</p>
            </div>
            <div class="video-frame reveal" data-glow>
              <div class="bento-glow"></div>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${d.videoId}?rel=0&modestbranding=1`}
                title={`${d.name} ${d.title} 소개 영상`}
                loading="lazy"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

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

      {/* 진료실에서 — 원장 직접 집도 실사 갤러리 (대표원장 전용) */}
      {d.slug === 'hwang-wooseok' && (
        <section class="sec doc-clinic" aria-label="진료실에서">
          <div class="container">
            <div class="shead center" style="margin-bottom:38px">
              <span class="eyebrow center">In the Operating Room</span>
              <h2>진료실에서, <span>직접 집도합니다</span></h2>
              <p>상담부터 식립까지, 황우석 대표원장이 직접 진료합니다. 디지털 가이드와 최소 절개를 지향합니다.</p>
            </div>
            <figure class="doc-feature reveal" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/doctor-surgery-wide.webp" alt="황우석 대표원장이 스태프와 함께 임플란트 수술을 진행하는 모습" loading="lazy" />
              <figcaption><i class="fa-solid fa-user-doctor"></i> 디지털 가이드 임플란트 수술 — 직접 집도</figcaption>
            </figure>
            <div class="doc-clinic-grid">
              <figure class="doc-card reveal reveal-d1" data-glow><div class="bento-glow"></div><img src="/images/op-guide.webp" alt="가이드 수술 식립 과정" loading="lazy" /><figcaption>가이드 식립</figcaption></figure>
              <figure class="doc-card reveal reveal-d2" data-glow><div class="bento-glow"></div><img src="/images/op-focus.webp" alt="현미경급 집중 진료" loading="lazy" /><figcaption>정밀 진료</figcaption></figure>
              <figure class="doc-card reveal reveal-d3" data-glow><div class="bento-glow"></div><img src="/images/op-assist.webp" alt="스태프와 협진하는 모습" loading="lazy" /><figcaption>협진 시스템</figcaption></figure>
              <figure class="doc-card reveal reveal-d4" data-glow><div class="bento-glow"></div><img src="/images/case-consult.webp" alt="환자와 상담하는 원장" loading="lazy" /><figcaption>충분한 상담</figcaption></figure>
            </div>
            <p class="cases-note reveal">
              <i class="fa-solid fa-circle-info"></i> 실제 진료 현장을 촬영한 사진이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.
            </p>
          </div>
        </section>
      )}

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
