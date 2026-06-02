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

const ASSURE = [
  { ic: 'face-smile', t: '아프지 않게', d: '무통 마취 시스템으로 치료 중 통증을 최소화합니다. 치과가 무섭지 않도록.' },
  { ic: 'handshake-angle', t: '과잉진료 없이', d: '꼭 필요한 진료만, 충분히 설명드린 뒤에 시작합니다. 부담 없이 상담받으세요.' },
  { ic: 'crosshairs', t: '정확하고 빠르게', d: '디지털 가이드와 AI 진단으로 한 번에 정확하게. 원내 기공실로 빠르게.' },
]

const JOURNEY = [
  { ic: 'phone', t: '편하게 문의', d: '전화 한 통이면 충분합니다. 어떤 고민이든 부담 없이.' },
  { ic: 'cube', t: '3D 정밀 진단', d: '3D CT·구강 스캐너로 정확하게 들여다봅니다.' },
  { ic: 'comments', t: '충분한 설명', d: '꼭 필요한 진료만, 이해하실 때까지 설명드립니다.' },
  { ic: 'heart', t: '편안한 치료', d: '무통 마취로 두려움을 안심으로 바꿉니다.' },
]

export const HomePage: FC = () => {
  const doctor = DOCTORS[0]
  return (
    <Layout
      title={`${CLINIC.name} | 강서구 명지 임플란트·투명교정·미니쉬 치과`}
      description="더착한치과는 부산 강서구 명지에서 무통 마취와 디지털 가이드로 아프지 않은 임플란트·투명교정·미니쉬 치료를 제공합니다. 과잉진료 없이, 통합치의학과 전문의 24년 임상 경험."
      path="/"
      keywords={['강서구 치과', '명지 치과', '명지 임플란트', '강서구 임플란트', '부산 투명교정', '명지오션시티 치과', '안 아픈 치과']}
      schemas={[speakableSchema()]}
    >
      {/* ===================== HERO ===================== */}
      <section class="hero">
        <div class="container hero-inner">
          <div class="reveal">
            <div class="hero-badge"><span class="dot"></span> 부산 강서구 명지 · 통합치의학과 전문의</div>
            <h1 class="hero-title">
              치과의 두려움을<br /><span class="hl">안심</span>으로 바꿉니다
            </h1>
            <p class="hero-sub">
              아프지 않게, 과잉진료 없이, 정확하게. 무통 마취와 디지털 가이드로
              한 분 한 분 편안한 진료를 약속하는 더착한치과입니다.
            </p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-primary btn-lg"><i class="fa-regular fa-calendar-check"></i> 진료 예약하기</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost btn-lg"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
            <div class="hero-trust">
              <span class="tc"><i class="fa-solid fa-check"></i> 무통 마취</span>
              <span class="tc"><i class="fa-solid fa-check"></i> 과잉진료 없음</span>
              <span class="tc"><i class="fa-solid fa-check"></i> 야간진료 (월·수)</span>
            </div>
          </div>
          <div class="hero-visual reveal" data-delay="2">
            <img class="hero-img" src="/images/hero-warm.webp" alt="더착한치과의 밝고 따뜻한 진료 공간" width="700" height="595" />
            <div class="hero-float f1">
              <div class="fic"><i class="fa-solid fa-face-smile"></i></div>
              <div><div class="ft">치과 공포</div><div class="fv">안심으로</div></div>
            </div>
            <div class="hero-float f2">
              <div class="fic"><i class="fa-solid fa-tooth"></i></div>
              <div><div class="ft">임상 경력</div><div class="fv">24년</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ASSURANCE ===================== */}
      <section class="sec-sm bg-paper">
        <div class="container">
          <div class="assure">
            {ASSURE.map((a, i) => (
              <div class="assure-card reveal" data-delay={String(i + 1)}>
                <div class="ic"><i class={`fa-solid fa-${a.ic}`}></i></div>
                <div><h3>{a.t}</h3><p>{a.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PHILOSOPHY / VALUES ===================== */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="max-width:680px;margin-bottom:48px">
            <div class="eyebrow">우리의 약속</div>
            <h2 class="section-title">정확하게, 빠르게,<br />그리고 편안하게</h2>
            <p class="section-lead">화려한 말 대신 정확한 진단과 꼼꼼한 설명. 더착한치과가 진료실에서 매일 지키는 세 가지 약속입니다.</p>
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

      {/* ===================== CORE TREATMENTS ===================== */}
      <section class="sec bg-paper">
        <div class="container">
          <div class="reveal" style="margin-bottom:48px;max-width:680px">
            <div class="eyebrow">핵심 진료</div>
            <h2 class="section-title">가장 자신 있는 세 가지 진료</h2>
            <p class="section-lead">디지털 정밀 진단을 기반으로, 더착한치과가 집중하는 핵심 진료를 소개합니다.</p>
          </div>
          <div class="core-grid">
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class="core-card reveal" data-delay={String(i + 1)}>
                <div class="cc-img" style={`background-image:url('${CORE_IMG[t.slug] || '/images/hero-warm.webp'}')`}>
                  <span class="cc-num">0{i + 1}</span>
                </div>
                <div class="cc-body">
                  <h3>{t.name}</h3>
                  <div class="cc-tag">{t.tagline}</div>
                  <p>{t.summary || t.tagline}</p>
                  <span class="cc-more">자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== DIGITAL SPLIT ===================== */}
      <section class="sec bg-sand">
        <div class="container split">
          <div class="reveal">
            <div class="eyebrow peach">디지털 진료 시스템</div>
            <h2 class="section-title">원내 기공실에서<br />직접, 더 빠르고 정확하게</h2>
            <p class="section-lead">보철물 제작을 외부에 맡기지 않습니다. 병원 안에서 직접 만들어 진료 기간을 줄이고 정밀도를 높입니다.</p>
            <ul class="feature-list">
              <li><span class="fi"><i class="fa-solid fa-cube"></i></span><div><h4>원내 기공실 운영</h4><p>밀링기 2대 · 3D 프린터 3대로 환자 구강에 맞는 보철을 신속하게 제작합니다.</p></div></li>
              <li><span class="fi"><i class="fa-solid fa-microchip"></i></span><div><h4>AI 디지털 가이드 임플란트</h4><p>3D CT와 구강 스캐너로 식립 위치를 미리 정밀 설계합니다.</p></div></li>
              <li><span class="fi"><i class="fa-solid fa-wave-square"></i></span><div><h4>정밀 신경치료기</h4><p>플라젠 신경치료기로 자연 치아를 최대한 보존합니다.</p></div></li>
            </ul>
          </div>
          <div class="split-img reveal" data-delay="2" style="background-image:url('/images/digital-system.webp')"></div>
        </div>
      </section>

      {/* ===================== DOCTOR ===================== */}
      <section class="sec bg-paper">
        <div class="container">
          <div class="reveal" style="margin-bottom:40px;max-width:680px">
            <div class="eyebrow">의료진</div>
            <h2 class="section-title">한 분이 처음부터 끝까지</h2>
          </div>
          <div class="doctor-card reveal">
            <div class="doctor-photo" style={doctor.photo ? `background-image:url('${doctor.photo}')` : ''}>
              {!doctor.photo && <i class="fa-solid fa-user-doctor"></i>}
            </div>
            <div>
              <span class="license">{doctor.license}</span>
              <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,2.1rem);margin-bottom:8px">{doctor.name} {doctor.title}</h2>
              <p style="color:var(--blue);font-weight:600;margin-bottom:18px;font-size:1.05rem">{doctor.tagline}</p>
              <p style="color:var(--ink-soft);line-height:1.85;margin-bottom:26px;max-width:52ch">"{doctor.philosophy}"</p>
              <a href={`/doctors/${doctor.slug}`} class="btn btn-outline"><i class="fa-solid fa-user-doctor"></i> 의료진 소개 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== JOURNEY ===================== */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="margin-bottom:44px;max-width:680px">
            <div class="eyebrow">진료 과정</div>
            <h2 class="section-title">처음 오신 순간부터<br />편안하게 안내합니다</h2>
          </div>
          <div class="journey">
            {JOURNEY.map((s, i) => (
              <div class="journey-step reveal" data-delay={String(i + 1)}>
                <div class="jn">{i + 1}</div>
                <div class="jic"><i class={`fa-solid fa-${s.ic}`}></i></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ALL TREATMENTS ===================== */}
      <section class="sec bg-paper">
        <div class="container">
          <div class="reveal" style="margin-bottom:44px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:18px">
            <div style="max-width:560px">
              <div class="eyebrow">전체 진료</div>
              <h2 class="section-title">한 곳에서 받는 모든 치과 진료</h2>
            </div>
            <a href="/treatments" class="btn btn-ghost">전체 진료 보기 <i class="fa-solid fa-arrow-right"></i></a>
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
      <section class="sec-sm bg-sand">
        <div class="container">
          <div class="cta-band reveal">
            <h2>치과가 두려우셨나요?<br />이제 안심하고 오세요.</h2>
            <p>{CLINIC.address} · {CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-white btn-lg"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-lg" style="background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.4)"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
