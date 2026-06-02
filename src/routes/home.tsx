import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, GENERAL_TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { speakableSchema } from '../lib/seo'

const CORE_IMG: Record<string, string> = {
  implant: '/images/core-implant.webp',
  'clear-aligner': '/images/core-aligner.webp',
  minish: '/images/core-minish.webp',
}

const PROCESS = [
  { no: '01', ic: 'magnifying-glass', t: '편하게 문의하세요', d: '전화 한 통, 온라인 한 줄이면 충분합니다. 어떤 고민이든 부담 없이 시작하세요.' },
  { no: '02', ic: 'cube', t: '3D로 정밀 진단', d: '3D CT와 구강 스캐너로 눈에 보이지 않는 부분까지 정확하게 들여다봅니다.' },
  { no: '03', ic: 'comments', t: '충분히 설명드립니다', d: '꼭 필요한 진료만, 왜 필요한지 이해하실 때까지 함께 이야기합니다.' },
  { no: '04', ic: 'face-smile', t: '편안하게 치료받으세요', d: '통증을 최소화하는 마취 시스템으로, 치과의 두려움을 안심으로 바꿉니다.' },
]

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
      {/* ===================== HERO ===================== */}
      <section class="hero">
        <div class="hero-mesh">
          <span class="blob b1"></span><span class="blob b2"></span>
          <span class="blob b3"></span><span class="blob b4"></span>
        </div>
        <div class="hero-grid"></div>
        <div class="hero-noise"></div>

        <div class="container hero-inner">
          <div class="hero-badge">
            <span class="dot"></span> 부산 강서구 명지 · 통합치의학과 전문의
          </div>
          <h1 class="hero-title">
            <span class="line"><span class="word">치과의</span> <span class="word">두려움을</span></span>
            <span class="line"><span class="grad word">안심</span><span class="word">으로</span> <span class="word">바꿉니다</span></span>
          </h1>
          <p class="hero-sub">
            {CLINIC.catchphrase}. 디지털 가이드와 AI 진단으로 한 번에 정확하게,
            통증을 최소화한 편안한 진료를 약속합니다.
          </p>
          <div class="hero-actions">
            <a href="/reservation" class="btn btn-accent btn-lg magnetic"><i class="fa-regular fa-calendar-check"></i> 진료 예약하기</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost btn-lg magnetic"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
          </div>
        </div>

        <div class="hero-rail">
          <div class="m"><div class="v">24<span style="font-size:.5em">년</span></div><div class="l">임상 경력</div></div>
          <div class="m"><div class="v">2015</div><div class="l">개원</div></div>
          <div class="m"><div class="v">10<span style="font-size:.5em">과목</span></div><div class="l">통합 진료</div></div>
        </div>

        <div class="scroll-ind"><div class="mouse"></div><span>SCROLL</span></div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <span>
            디지털 가이드 임플란트 <i class="fa-solid fa-circle"></i>
            투명교정 <i class="fa-solid fa-circle"></i>
            미니쉬 · 라미네이트 <i class="fa-solid fa-circle"></i>
            원내 기공실 <i class="fa-solid fa-circle"></i>
            야간진료 <i class="fa-solid fa-circle"></i>
            통합치의학과 전문의 <i class="fa-solid fa-circle"></i>
          </span>
        </div>
      </div>

      {/* ===================== PHILOSOPHY / BENTO ===================== */}
      <section class="sec bg-paper">
        <div class="container-wide">
          <div class="reveal" style="max-width:760px;margin-bottom:56px">
            <div class="eyebrow">OUR PHILOSOPHY</div>
            <h2 class="section-title">정확하게, 빠르게,<br />그리고 편안하게.</h2>
            <p class="section-lead">화려한 말 대신 정확한 진단과 꼼꼼한 설명. 더착한치과가 진료실에서 매일 지키는 약속입니다.</p>
          </div>

          <div class="bento">
            {/* big dark mission card */}
            <article class="bento-card dark span-7 row-2 reveal">
              <div class="bc-ic"><i class="fa-solid fa-heart"></i></div>
              <h3 style="font-size:clamp(1.5rem,2.6vw,2.2rem)">{CLINIC.brandSlogan}</h3>
              <p style="max-width:46ch;margin-top:14px">
                치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루는 분들이 많습니다.
                더착한치과는 "치과가 무섭지 않은 곳"을 만들기 위해 시작했습니다.
              </p>
            </article>

            {CLINIC.philosophy.coreValues.map((v, i) => (
              <article class={`bento-card span-5 reveal`} data-delay={String(i + 1)}>
                <div class="bc-ic"><i class={`fa-solid fa-${v.icon}`}></i></div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}

            {/* teal stat strip */}
            <article class="bento-card teal span-4 reveal" data-delay="1">
              <div class="bc-ic"><i class="fa-solid fa-clock"></i></div>
              <h3><span data-count="24">0</span><span style="font-size:.5em">년</span></h3>
              <p>한 분 한 분 쌓아온 임상 경험</p>
            </article>
            <article class="bento-card img span-8 reveal" data-delay="2">
              <div class="bg" style="background-image:url('/images/digital-system.webp')"></div>
              <div class="bc-ic" style="background:rgba(255,255,255,.16);color:#fff"><i class="fa-solid fa-microchip"></i></div>
              <h3>원내 디지털 기공실 운영</h3>
              <p>밀링기 2대 · 3D 프린터 3대로 보철물을 병원 안에서 직접, 더 빠르고 정확하게 제작합니다.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== CORE TREATMENTS (editorial) ===================== */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="margin-bottom:clamp(40px,6vw,72px);max-width:720px">
            <div class="eyebrow">SIGNATURE CARE</div>
            <h2 class="section-title">가장 자신 있는<br />세 가지 진료</h2>
            <p class="section-lead">디지털 정밀 진단을 기반으로, 더착한치과가 집중하는 핵심 진료를 소개합니다.</p>
          </div>

          <div class="core-stack">
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class="core-row reveal" aria-label={`${t.name} 자세히 보기`}>
                <div class="core-copy">
                  <span class="idx">0{i + 1} — SIGNATURE</span>
                  <h3>{t.name}</h3>
                  <div class="tag">{t.tagline}</div>
                  <p>{t.summary || t.tagline}</p>
                  <div class="chips">
                    {t.keywords.slice(0, 3).map((k) => <span class="chip">#{k}</span>)}
                  </div>
                  <span class="core-more">자세히 보기 <span class="arr"><i class="fa-solid fa-arrow-right"></i></span></span>
                </div>
                <div class="core-media">
                  <div class="bg" style={`background-image:url('${CORE_IMG[t.slug] || '/images/hero.webp'}')`}></div>
                  <div class="num-watermark">0{i + 1}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STICKY SCROLL SEQUENCE (process) ===================== */}
      <section class="sticky-wrap" style={`height:${(PROCESS.length + 1) * 100}vh`}>
        <div class="sticky-stage">
          <div class="bgglow"></div>
          <div class="container sticky-inner">
            <div class="sticky-steps" style="min-height:clamp(220px,40vh,340px)">
              <div class="eyebrow" style="color:var(--teal-glow);position:absolute;top:-50px">PATIENT JOURNEY</div>
              {PROCESS.map((p, i) => (
                <div class={`sticky-step${i === 0 ? ' active' : ''}`}>
                  <div class="step-no">STEP {p.no}</div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
            <div class="sticky-visual">
              {PROCESS.map((p, i) => (
                <div class={`v${i === 0 ? ' active' : ''}`}><i class={`fa-solid fa-${p.ic}`}></i></div>
              ))}
            </div>
          </div>
          <div class="sticky-progress"><div class="bar"></div></div>
        </div>
      </section>

      {/* ===================== DOCTOR ===================== */}
      <section class="sec bg-paper">
        <div class="container">
          <div class="doctor-card reveal">
            <div class="doctor-photo" style={doctor.photo ? `background-image:url('${doctor.photo}')` : ''}>
              {!doctor.photo && <i class="fa-solid fa-user-doctor"></i>}
            </div>
            <div>
              <span class="license">{doctor.license}</span>
              <h2 class="section-title" style="font-size:clamp(1.8rem,3.4vw,2.6rem);margin-bottom:10px">{doctor.name} {doctor.title}</h2>
              <p class="section-lead" style="margin-bottom:22px;color:var(--teal-glow)">{doctor.tagline}</p>
              <p style="color:var(--d-fg-soft);line-height:1.85;margin-bottom:30px;max-width:50ch">"{doctor.philosophy}"</p>
              <a href={`/doctors/${doctor.slug}`} class="btn btn-accent magnetic"><i class="fa-solid fa-user-doctor"></i> 의료진 소개 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ALL TREATMENTS ===================== */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="margin-bottom:48px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px">
            <div style="max-width:560px">
              <div class="eyebrow">FULL CARE</div>
              <h2 class="section-title">전체 진료 안내</h2>
            </div>
            <a href="/treatments" class="btn btn-outline magnetic">전체 진료 보기 <i class="fa-solid fa-arrow-right"></i></a>
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

      {/* ===================== CTA ===================== */}
      <section class="sec-sm bg-paper">
        <div class="container">
          <div class="cta-band reveal">
            <h2>치과가 두려우셨나요?<br />이제 안심하고 오세요.</h2>
            <p>{CLINIC.address} · {CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent btn-lg magnetic"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost btn-lg magnetic"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
