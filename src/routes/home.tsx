import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, GENERAL_TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { speakableSchema } from '../lib/seo'

export const HomePage: FC = () => {
  const doctor = DOCTORS[0]
  return (
    <Layout
      title={`${CLINIC.name} | 강서구 명지 임플란트·투명교정·미니쉬 치과`}
      description="더착한치과는 부산 강서구 명지에서 디지털 가이드 임플란트, 투명교정, 미니쉬 심미치료를 통증을 최소화한 편안한 진료로 제공합니다. 통합치의학과 전문의 24년 임상 경험."
      path="/"
      keywords={['강서구 치과', '명지 치과', '명지 임플란트', '강서구 임플란트', '부산 투명교정', '명지오션시티 치과']}
      schemas={[speakableSchema()]}
    >
      {/* ===== HERO ===== */}
      <section class="hero">
        <div class="hero-bg has-img" data-parallax="0.15"></div>
        <div class="hero-overlay"></div>
        <div class="container hero-inner">
          <div class="hero-badge reveal"><i class="fa-solid fa-tooth"></i> 부산 강서구 명지 · 통합치의학과 전문의</div>
          <h1 class="reveal" data-delay="1">
            치과의 두려움을<br /><span class="grad">안심으로</span> 바꿉니다
          </h1>
          <p class="hero-sub reveal" data-delay="2">
            {CLINIC.catchphrase}. 디지털 가이드와 AI 진단으로 한 번에 정확하게,
            통증을 최소화한 편안한 진료를 약속합니다.
          </p>
          <div class="hero-actions reveal" data-delay="3">
            <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> 진료 예약하기</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
          </div>
        </div>
        <div class="scroll-ind"><div class="mouse"></div><span>SCROLL</span></div>
      </section>

      {/* ===== STATS (countup) ===== */}
      <section class="sec-sm">
        <div class="container">
          <div class="stats">
            <div class="stat reveal" data-delay="1"><div class="num"><span data-count="24" data-suffix="년">0</span></div><div class="lbl">치과 임상 경력</div></div>
            <div class="stat reveal" data-delay="2"><div class="num"><span data-count="10">0</span></div><div class="lbl">진료 전문 과목</div></div>
            <div class="stat reveal" data-delay="3"><div class="num"><span data-count="3">0</span></div><div class="lbl">원내 3D 프린터</div></div>
            <div class="stat reveal" data-delay="4"><div class="num"><span data-count="2015">0</span></div><div class="lbl">개원 연도</div></div>
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY / VALUES ===== */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:720px;margin:0 auto 56px">
            <div class="eyebrow" style="justify-content:center">OUR PHILOSOPHY</div>
            <h2 class="section-title">정확하게, 빠르게, 편안하게</h2>
            <p class="section-lead" style="margin:0 auto">더착한치과가 진료실에서 지키는 세 가지 약속입니다.</p>
          </div>
          <div class="value-grid">
            {CLINIC.philosophy.coreValues.map((v, i) => (
              <div class="value-card reveal" data-delay={String(i + 1)}>
                <div class="vc-icon"><i class={`fa-solid fa-${v.icon}`}></i></div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CORE TREATMENTS ===== */}
      <section class="sec">
        <div class="container">
          <div class="reveal" style="margin-bottom:56px">
            <div class="eyebrow">SIGNATURE CARE</div>
            <h2 class="section-title">더착한치과의 핵심 진료</h2>
            <p class="section-lead">디지털 정밀 진단을 기반으로, 가장 자신 있는 세 가지 진료를 소개합니다.</p>
          </div>
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

      {/* ===== SPLIT: Digital ===== */}
      <section class="sec bg-sand">
        <div class="container split">
          <div class="reveal">
            <div class="eyebrow">DIGITAL DENTISTRY</div>
            <h2 class="section-title" style="font-size:clamp(28px,4vw,42px)">원내 기공실과<br />AI 디지털 시스템</h2>
            <p class="section-lead">보철물 제작을 외부에 맡기지 않습니다. 병원 안에서 직접, 더 정확하고 빠르게.</p>
            <ul class="feature-list">
              <li><span class="fi"><i class="fa-solid fa-cube"></i></span><div><h4>원내 기공실 운영</h4><p>밀링기 2대 · 3D 프린터 3대로 환자 구강에 맞는 보철을 신속하게 제작합니다.</p></div></li>
              <li><span class="fi"><i class="fa-solid fa-microchip"></i></span><div><h4>디지털 가이드 임플란트</h4><p>3D CT와 구강 스캐너로 식립 위치를 미리 정밀 설계합니다.</p></div></li>
              <li><span class="fi"><i class="fa-solid fa-wave-square"></i></span><div><h4>정밀 신경치료기</h4><p>플라젠 신경치료기로 자연 치아를 최대한 보존합니다.</p></div></li>
            </ul>
          </div>
          <div class="split-img reveal-scale" data-delay="2" style="background-image:url('/images/digital-system.webp');background-size:cover;background-position:center"></div>
        </div>
      </section>

      {/* ===== DOCTOR ===== */}
      <section class="sec">
        <div class="container">
          <div class="doctor-card reveal">
            <div class="doctor-photo"><i class="fa-solid fa-user-doctor"></i></div>
            <div>
              <span class="license">{doctor.license}</span>
              <h2 class="section-title" style="font-size:32px;margin-bottom:8px">{doctor.name} {doctor.title}</h2>
              <p class="section-lead" style="margin-bottom:20px">{doctor.tagline}</p>
              <p style="color:var(--ink-soft);line-height:1.85;margin-bottom:24px">{doctor.philosophy}</p>
              <a href={`/doctors/${doctor.slug}`} class="btn btn-outline"><i class="fa-solid fa-user-doctor"></i> 의료진 소개 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PATIENT FUNNEL ===== */}
      <section class="sec bg-ink">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:720px;margin:0 auto 50px">
            <div class="eyebrow" style="justify-content:center;color:var(--accent)">YOUR JOURNEY</div>
            <h2 class="section-title" style="color:#fff">처음 오신 순간부터<br />다시 찾으실 때까지</h2>
          </div>
          <div class="value-grid" style="grid-template-columns:repeat(4,1fr);gap:18px">
            {[
              { ic: 'magnifying-glass', t: '검색·상담', d: '전화·온라인으로 편하게 문의하세요.' },
              { ic: 'stethoscope', t: '정밀 진단', d: '3D 영상으로 정확하게 진단합니다.' },
              { ic: 'comments', t: '충분한 설명', d: '꼭 필요한 진료만 설명드립니다.' },
              { ic: 'face-smile', t: '편안한 치료', d: '통증을 최소화한 진료를 진행합니다.' },
            ].map((s, i) => (
              <div class="reveal" data-delay={String(i + 1)} style="text-align:center;padding:20px">
                <div style="width:70px;height:70px;border-radius:20px;background:rgba(45,212,191,0.15);color:var(--accent);display:grid;place-items:center;font-size:28px;margin:0 auto 18px">
                  <i class={`fa-solid fa-${s.ic}`}></i>
                </div>
                <h3 style="color:#fff;font-size:19px;margin-bottom:8px">{s.t}</h3>
                <p style="color:rgba(255,255,255,0.65);font-size:14px;margin:0">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL TREATMENTS ===== */}
      <section class="sec">
        <div class="container">
          <div class="reveal" style="margin-bottom:48px">
            <div class="eyebrow">FULL CARE</div>
            <h2 class="section-title">전체 진료 안내</h2>
          </div>
          <div class="tlist-grid">
            {[...CORE_TREATMENTS, ...GENERAL_TREATMENTS].map((t, i) => (
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

      {/* ===== CTA ===== */}
      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>치과가 두려우셨나요?<br />이제 안심하고 오세요.</h2>
            <p>{CLINIC.address} · {CLINIC.hoursNote}</p>
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
