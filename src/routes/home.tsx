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
  { ic: 'face-smile', t: '아프지 않게', d: '무통 마취 시스템으로 치료 중 통증을 최소화합니다. 치과가 무섭지 않은 곳을 만듭니다.' },
  { ic: 'handshake-angle', t: '과잉진료 없이', d: '꼭 필요한 진료만, 충분히 설명드린 뒤에 시작합니다. 부담 없이 상담부터 받으세요.' },
  { ic: 'crosshairs', t: '정확하고 빠르게', d: '디지털 가이드·AI 진단으로 한 번에 정확하게, 원내 기공실로 기다림 없이 빠르게.' },
]

const STATS = [
  { n: 24, u: '년', l: '대표원장 임상 경력' },
  { n: 10, u: '개 진료과', l: '대학병원급 통합 진료' },
  { n: 6, u: '개', l: '독립 진료·디지털 장비' },
  { n: 2015, u: '', l: '명지 지역 개원', year: true },
]

const JOURNEY = [
  { ic: 'phone', t: '편하게 문의', d: '전화 한 통, 또는 온라인 예약. 어떤 고민이든 부담 없이 말씀하세요.' },
  { ic: 'cube', t: '3D 정밀 진단', d: '3D CT·구강 스캐너로 입안을 정확하게 들여다봅니다.' },
  { ic: 'comments', t: '충분한 설명', d: '꼭 필요한 진료만, 이해하실 때까지 설명드립니다.' },
  { ic: 'heart', t: '편안한 치료', d: '무통 마취로 두려움을 안심으로 바꿉니다.' },
]

const COMPARE = [
  { label: '진료 설계', us: '3D CT · AI 디지털 가이드', them: '경험·감에 의존' },
  { label: '보철물 제작', us: '원내 기공실 (밀링기·3D프린터)', them: '외부 기공소 위탁' },
  { label: '통증 관리', us: '무통 마취 시스템', them: '일반 마취' },
  { label: '진료 범위', us: '10개 진료과 통합 진료', them: '일부 과목만' },
  { label: '상담 방식', us: '꼭 필요한 진료만 설명', them: '획일적 안내' },
]

export const HomePage: FC = () => {
  const doctor = DOCTORS[0]
  return (
    <Layout
      title="더착한치과 | 강서구 명지 임플란트·투명교정·미니쉬 치과"
      description="부산 강서구 명지 더착한치과. 치의학박사·통합치의학 전문의가 24년 임상 경험과 디지털 가이드 AI 임플란트로 정확하게 진료합니다. 무통 마취·과잉진료 없는 진료."
      schemas={[speakableSchema()]}
    >
      {/* ===================== HERO ===================== */}
      <section class="hero">
        <div class="container-wide hero-inner">
          <div class="hero-text">
            <span class="hero-badge"><i class="fa-solid fa-location-dot"></i> 부산 강서구 명지 · 통합치의학 전문의 진료</span>
            <h1>
              치과의 두려움을<br />
              <span class="gold">안심</span>으로 바꿉니다
            </h1>
            <p class="lead">
              치의학박사·통합치의학 전문의가 24년의 임상 경험과 디지털 기술로
              꼭 필요한 진료만 정확하게. 명지에서 오래 믿고 다니는 치과를 만듭니다.
            </p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-gold btn-lg"><i class="fa-solid fa-calendar-check"></i> 진료 예약하기</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost on-navy btn-lg"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
            <div class="hero-trust">
              <div class="tc"><i class="fa-solid fa-circle-check"></i><span>무통 마취 시스템</span></div>
              <div class="tc"><i class="fa-solid fa-circle-check"></i><span>과잉진료 없는 진료</span></div>
              <div class="tc"><i class="fa-solid fa-circle-check"></i><span>원내 기공실 보유</span></div>
            </div>
          </div>
          <div class="hero-visual reveal">
            <div class="hero-frame">
              <div class="ph"><i class="fa-solid fa-tooth"></i></div>
            </div>
            <div class="hero-stat s1">
              <div class="n"><span data-count="24">24</span><span class="u">년</span></div>
              <div class="l">대표원장 임상 경력</div>
            </div>
            <div class="hero-stat s2">
              <div class="n"><span data-count="10">10</span><span class="u">개과</span></div>
              <div class="l">대학병원급 통합진료</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STAT BAND ===================== */}
      <section class="statband">
        <div class="container-wide grid">
          {STATS.map((s) => (
            <div class="item">
              <div class="n">
                <span data-count={String(s.n)}>{s.year ? s.n : 0}</span>{s.u && <span class="u">{s.u}</span>}
              </div>
              <div class="l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ASSURANCE ===================== */}
      <section class="assure">
        <div class="container">
          <div class="shead">
            <span class="eyebrow">Why The Good Dental</span>
            <h2>치과가 무섭다는 분께,<br /><em>세 가지를 약속</em>드립니다</h2>
            <p>치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루지 않도록. 더착한치과의 진료 원칙입니다.</p>
          </div>
          <div class="assure-grid">
            {ASSURE.map((a, i) => (
              <article class={`assure-card reveal reveal-d${i + 1}`}>
                <span class="idx">0{i + 1}</span>
                <div class="ico"><i class={`fa-solid fa-${a.ic}`}></i></div>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PHILOSOPHY ===================== */}
      <section class="philo">
        <div class="container philo-grid">
          <div class="philo-quote reveal">
            <span class="mark">&ldquo;</span>
            <blockquote>{CLINIC.philosophy.mission}</blockquote>
            <cite>
              {doctor.name} {doctor.title}
              <span>{CLINIC.businessName} · 치의학박사 · 통합치의학과 전문의</span>
            </cite>
          </div>
          <div class="philo-values">
            {CLINIC.philosophy.coreValues.map((v) => (
              <div class="value-row reveal">
                <div class="ico"><i class={`fa-solid fa-${v.icon}`}></i></div>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CORE TREATMENTS ===================== */}
      <section class="core">
        <div class="container">
          <div class="shead">
            <span class="eyebrow">Signature Treatments</span>
            <h2>가장 자신 있는 <em>세 가지 진료</em></h2>
            <p>디지털 장비, 24년의 임상, 그리고 원내 기공실. 핵심 진료를 한 곳에서 정확하게.</p>
          </div>
          <div class="core-grid">
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class={`core-card reveal reveal-d${i + 1}`}>
                <div class="cc-img">
                  {CORE_IMG[t.slug] ? <img src={CORE_IMG[t.slug]} alt={t.name} loading="lazy" /> : <div class="ph"><i class={`fa-solid fa-${t.icon}`}></i></div>}
                  <span class="cc-num">0{i + 1}</span>
                </div>
                <div class="cc-body">
                  <span class="tag">{t.shortName}</span>
                  <h3>{t.name}</h3>
                  <p>{t.tagline}</p>
                  <span class="cc-more">자세히 보기 <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== DIGITAL ===================== */}
      <section class="digital">
        <div class="container digital-grid">
          <div class="reveal">
            <div class="shead" style="margin-bottom:0">
              <span class="eyebrow on-navy">Digital Dentistry</span>
              <h2>원내 기공실에서<br /><span>직접, 더 빠르고 정확하게</span></h2>
              <p>보철물을 외부에 맡기지 않습니다. 밀링기 2대·3D 프린터 3대·구강 스캐너로 진료의 정확도와 속도를 함께 높입니다.</p>
            </div>
            <div class="dfeatures">
              <div class="dfeature">
                <div class="ico"><i class="fa-solid fa-microchip"></i></div>
                <div><h4>AI 디지털 가이드 임플란트</h4><p>3D CT 데이터로 식립 위치를 컴퓨터에서 미리 설계해 정확하게 진행합니다.</p></div>
              </div>
              <div class="dfeature">
                <div class="ico"><i class="fa-solid fa-print"></i></div>
                <div><h4>원내 기공실 (밀링기·3D프린터)</h4><p>보철물을 원내에서 제작해 제작 기간과 내원 횟수를 줄입니다.</p></div>
              </div>
              <div class="dfeature">
                <div class="ico"><i class="fa-solid fa-bolt-lightning"></i></div>
                <div><h4>플라젠 신경치료기</h4><p>정밀 신경치료 장비로 자연치아를 최대한 보존하는 진료를 지향합니다.</p></div>
              </div>
            </div>
          </div>
          <div class="digital-visual reveal">
            <img src="/images/digital-system.webp" alt="원내 디지털 기공 시스템" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ===================== DOCTOR ===================== */}
      <section class="doctor">
        <div class="container doctor-grid">
          <div class="doctor-photo reveal">
            {doctor.photo ? <img src={doctor.photo} alt={`${doctor.name} ${doctor.title}`} loading="lazy" /> : <div class="ph"><i class="fa-solid fa-user-doctor"></i></div>}
            <span class="ribbon">{doctor.title}</span>
          </div>
          <div class="doctor-info reveal">
            <span class="lic"><i class="fa-solid fa-certificate"></i> {doctor.license}</span>
            <h3>{doctor.name} <span>{doctor.title}</span></h3>
            <p class="tl">{doctor.tagline}</p>
            <p class="ph-text">{doctor.philosophy}</p>
            <div class="doctor-creds">
              <span class="cred"><i class="fa-solid fa-graduation-cap"></i> 치의학박사</span>
              <span class="cred"><i class="fa-solid fa-award"></i> 통합치의학과 전문의</span>
              <span class="cred"><i class="fa-solid fa-tooth"></i> 24년 임상 경력</span>
              <span class="cred"><i class="fa-solid fa-microchip"></i> 디지털 가이드 임플란트</span>
            </div>
            <a href={`/doctors/${doctor.slug}`} class="btn btn-primary">원장 프로필 자세히 보기 <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      {/* ===================== JOURNEY ===================== */}
      <section class="journey">
        <div class="container">
          <div class="shead center">
            <span class="eyebrow center">Patient Journey</span>
            <h2>처음 오신 순간부터,<br /><em>편안하게 안내</em>합니다</h2>
          </div>
          <div class="journey-grid">
            {JOURNEY.map((j) => (
              <div class="journey-step reveal">
                <span class="num"></span>
                <div class="ico"><i class={`fa-solid fa-${j.ic}`}></i></div>
                <h4>{j.t}</h4>
                <p>{j.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COMPARE ===================== */}
      <section class="compare">
        <div class="container">
          <div class="shead center">
            <span class="eyebrow center">The Difference</span>
            <h2>왜 <span class="gold">더착한치과</span>일까요?</h2>
            <p>같은 진료라도 장비와 시스템에 따라 결과가 달라집니다.</p>
          </div>
          <div class="compare-table reveal">
            <div class="row head">
              <div class="cell">진료 항목</div>
              <div class="cell us">더착한치과</div>
              <div class="cell">일반 치과</div>
            </div>
            {COMPARE.map((c) => (
              <div class="row">
                <div class="cell label" data-l="항목">{c.label}</div>
                <div class="cell us" data-l="더착한치과"><i class="fa-solid fa-circle-check"></i>{c.us}</div>
                <div class="cell them" data-l="일반 치과"><i class="fa-solid fa-minus"></i>{c.them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ALL TREATMENTS ===================== */}
      <section class="tlist">
        <div class="container">
          <div class="shead center">
            <span class="eyebrow center">All Departments</span>
            <h2>한 곳에서 받는 <em>모든 치과 진료</em></h2>
            <p>대학병원과 동일한 진료 시스템으로 10개 진료과를 통합 운영합니다.</p>
          </div>
          <div class="tlist-grid">
            {[...CORE_TREATMENTS, ...GENERAL_TREATMENTS].map((t) => (
              <a href={`/treatments/${t.slug}`} class="tlist-card reveal">
                <div class="ico"><i class={`fa-solid fa-${t.icon}`}></i></div>
                <div>
                  <div class="nm">{t.shortName}</div>
                  <div class="sub">{t.name}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <section class="cta-band">
        <div class="container inner">
          <span class="eyebrow on-navy">Reservation</span>
          <h2>치과가 두려우셨다면,<br />이제 <span class="gold">안심</span>하고 오세요</h2>
          <p>전화 한 통이면 충분합니다. 어떤 고민이든 부담 없이 상담받으세요.</p>
          <div class="actions">
            <a href="/reservation" class="btn btn-gold btn-lg"><i class="fa-solid fa-calendar-check"></i> 진료 예약하기</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost on-navy btn-lg"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
