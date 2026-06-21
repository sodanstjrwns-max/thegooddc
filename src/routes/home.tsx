import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, GENERAL_TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { STORY_CHAPTERS, PATIENT_FUNNEL, FUNNEL_PHASES, STORY_CTA, CASE_STORIES } from '../data/story'
import { HeroToothVector, JourneyPathVector } from '../components/vectors'
import { speakableSchema, faqSchema } from '../lib/seo'

// 홈 핵심 FAQ — 검색·AI 답변 노출도가 가장 높은 페이지의 직답형 FAQPage
const HOME_FAQS = [
  { q: '더착한치과는 어디에 있나요?', a: `${CLINIC.address}에 있습니다. 명지국제신도시·강서구·김해 장유·사하구 하단에서 가깍습니다.` },
  { q: '야간 진료를 하나요?', a: '월요일과 수요일은 저녁 8시(20:00)까지 야간 진료를 합니다.' },
  { q: '토요일에도 진료하나요?', a: '네, 토요일 오전 8시부터 12시까지 점심시간 없이 진료합니다. 일요일은 정기휴무입니다.' },
  { q: '주차가 가능한가요?', a: `${CLINIC.directions.car}.` },
  { q: '어떤 진료를 받을 수 있나요?', a: '디지털 가이드 임플란트, 투명교정, 미니쉬·라미네이트 심미치료를 비롯해 통합치의학과 전반의 진료를 제공합니다.' },
]
import type { Notice } from '../lib/content-store'

const CORE_IMG: Record<string, string> = {
  implant: '/images/core-implant-v2.webp',
  'clear-aligner': '/images/core-aligner-v2.webp',
  minish: '/images/core-minish-v2.webp',
}

const ASSURE = [
  { ic: 'face-smile', t: '아프지 않게', d: '편안한 마취 시스템으로 치료 중 통증을 최소화합니다. 치과가 무섭지 않은 곳을 만듭니다.' },
  { ic: 'handshake-angle', t: '과잉진료 없이', d: '꼭 필요한 진료만, 충분히 설명드린 뒤에 시작합니다. 부담 없이 상담부터 받으세요.' },
  { ic: 'crosshairs', t: '정확하고 빠르게', d: '디지털 가이드·AI 진단으로 한 번에 정확하게, 원내 기공실로 기다림 없이 빠르게.' },
]

const STATS = [
  { n: 24, u: '년', l: '대표원장 임상 경력' },
  { n: 10, u: '개 진료과', l: '대학병원급 통합 진료' },
  { n: 6, u: '개', l: '독립 진료·디지털 장비' },
  { n: 2015, u: '', l: '명지 지역 개원', year: true },
]


const MARQUEE = [
  '디지털 가이드 임플란트', '투명교정', '미니쉬', '원내 기공실', '편안한 마취 시스템',
  '통합치의학 전문의', '치의학박사', '3D CT 정밀 진단', '구강 스캐너', '24년 임상 경력',
  '과잉진료 없는 진료', '10개 진료과 통합',
]

const COMPARE = [
  { label: '진료 설계', us: '3D CT · AI 디지털 가이드', them: '경험·감에 의존' },
  { label: '보철물 제작', us: '원내 기공실 (밀링기·3D프린터)', them: '외부 기공소 위탁' },
  { label: '통증 관리', us: '편안한 마취 시스템', them: '일반 마취' },
  { label: '진료 범위', us: '10개 진료과 통합 진료', them: '일부 과목만' },
  { label: '상담 방식', us: '꼭 필요한 진료만 설명', them: '획일적 안내' },
]

export const HomePage: FC<{ popup?: Notice | null }> = ({ popup }) => {
  const doctor = DOCTORS[0]
  return (
    <Layout
      title="더착한치과 | 강서구 명지 임플란트·투명교정·미니쉬 치과"
      description="부산 강서구 명지 더착한치과. 치의학박사·통합치의학 전문의가 24년 임상 경험과 디지털 가이드 AI 임플란트로 정확하게 진료합니다. 편안한 마취 진료, 꼭 필요한 진료만."
      keywords={['명지 치과', '명지 임플란트', '명지 교정', '국제신도시 치과', '국제신도시 임플란트', '국제신도시 교정', '강서구 임플란트', '서부산 임플란트', 'AI 가이드 임플란트', '무통마취 치과']}
      path="/"
      schemas={[speakableSchema(), faqSchema(HOME_FAQS)]}
    >
      {popup && <NoticePopup notice={popup} />}
      {/* ===================== HERO — editorial asymmetric ===================== */}
      <section class="hero">
        <div class="container-wide hero-inner">
          <div class="hero-text reveal">
            <span class="hero-badge"><i class="fa-solid fa-location-dot"></i> 부산 강서구 명지 · 통합치의학 전문의 진료</span>
            <h1 class="kinetic">
              <span class="line">치과의 두려움을</span>
              <span class="line"><span class="accent-word">안심</span>으로</span>
              <span class="line">바꿉니다</span>
            </h1>
            <p class="lead">
              치의학박사·통합치의학 전문의가 24년의 임상 경험과 디지털 기술로
              꼭 필요한 진료만 정확하게. 명지에서 오래 믿고 다니는 치과를 만듭니다.
            </p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-gold btn-lg"><i class="fa-solid fa-calendar-check"></i> {STORY_CTA.reserve}</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost btn-lg"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
            <ul class="hero-trust">
              <li class="tc"><i class="fa-solid fa-check"></i><span>편안한 마취 시스템</span></li>
              <li class="tc"><i class="fa-solid fa-check"></i><span>과잉진료 없는 진료</span></li>
              <li class="tc"><i class="fa-solid fa-check"></i><span>원내 기공실 보유</span></li>
            </ul>
          </div>
          <aside class="hero-visual reveal reveal-d1">
            <figure class="hero-frame">
              <HeroToothVector />
            </figure>
            <div class="hero-stat s1">
              <div class="n"><span data-count="24">24</span><span class="u">년</span></div>
              <div class="l">대표원장 임상 경력</div>
            </div>
            <div class="hero-stat s2">
              <div class="n"><span data-count="10">10</span><span class="u">개과</span></div>
              <div class="l">대학병원급 통합진료</div>
            </div>
          </aside>
        </div>
      </section>

      {/* ===================== FABLE — 환자 1인칭 여정 스크롤텔링 (5장) ===================== */}
      <section class="fable" id="fable-story" aria-label="환자 여정 이야기">
        <div class="container">
          <div class="shead center" data-index="00">
            <span class="eyebrow center">A Patient&rsquo;s Fable</span>
            <h2>어떤 환자의 <em>다섯 장짜리 이야기</em></h2>
            <p>치과가 두려웠던 한 사람이 안심을 되찾기까지. 당신의 이야기일지도 모릅니다.</p>
          </div>
          <div class="fable-track">
            <div class="fable-spine" aria-hidden="true"><span class="fable-spine-fill"></span></div>
            {STORY_CHAPTERS.map((ch, i) => (
              <article class={`fable-chapter reveal ${i % 2 === 1 ? 'alt' : ''}`} id={`fable-ch-${i + 1}`}>
                <div class="fable-marker" aria-hidden="true">
                  <span class="fable-no">{ch.no}</span>
                </div>
                <div class="fable-card" data-glow>
                  <div class="bento-glow"></div>
                  <span class="fable-kicker"><i class={`fa-solid fa-${ch.icon}`}></i> {ch.label}</span>
                  <h3>{ch.title}</h3>
                  <p class="fable-narration">{ch.narration}</p>
                  <div class="fable-guide">
                    <span class="fg-label"><i class="fa-solid fa-tooth"></i> 더착한치과의 답</span>
                    <p>{ch.guide}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p class="fable-coda reveal">{STORY_CTA.heroEnd}</p>
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
          <div class="shead" data-index="01">
            <span class="eyebrow">Why The Good Dental</span>
            <h2>치과가 무섭다는 분께,<br /><em>세 가지를 약속</em>드립니다</h2>
            <p>치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루지 않도록. 더착한치과의 진료 원칙입니다.</p>
          </div>
          <div class="assure-grid" data-tilt-scope>
            {ASSURE.map((a, i) => (
              <article class={`assure-card reveal reveal-d${i + 1}`} data-glow>
                <div class="bento-glow"></div>
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
          <div class="shead" data-index="02">
            <span class="eyebrow">Signature Treatments</span>
            <h2>가장 자신 있는 <em>세 가지 진료</em></h2>
            <p>디지털 장비, 24년의 임상, 그리고 원내 기공실. 핵심 진료를 한 곳에서 정확하게.</p>
          </div>
          <div class="core-grid" data-tilt-scope>
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class={`core-card reveal reveal-d${i + 1}`} data-tilt data-glow>
                <div class="bento-glow"></div>
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

      {/* ===================== DIGITAL — BENTO GRID ===================== */}
      <section class="digital">
        <div class="bento-noise"></div>
        <div class="container">
          <div class="shead center" data-index="03" style="margin-bottom:54px">
            <span class="eyebrow on-navy center">Digital Dentistry</span>
            <h2>장비가 만드는 <span>정확함의 차이</span></h2>
            <p>밀링기 2대 · 3D 프린터 3대 · 구강 스캐너. 진단부터 보철 제작까지 한 곳에서.</p>
          </div>

          <div class="bento" data-tilt-scope>
            {/* big feature — AI guide */}
            <article class="bento-card b-feature reveal" data-tilt data-glow>
              <div class="bento-glow"></div>
              <div class="bento-img">
                <img src="/images/doctor-consult.webp" alt="황우석 대표원장이 3D 파노라마 영상으로 환자에게 진료 계획을 설명하는 모습" loading="lazy" />
                <div class="bento-img-grad"></div>
              </div>
              <div class="bento-body">
                <span class="bento-kicker"><i class="fa-solid fa-microchip"></i> AI Guided</span>
                <h3>AI 디지털 가이드<br />임플란트</h3>
                <p>3D CT 데이터로 식립 위치·깊이·각도를 컴퓨터에서 미리 설계하고, 수술용 가이드로 계획한 위치에 정밀하게 식립합니다.</p>
              </div>
            </article>

            {/* stat ring — accuracy */}
            <article class="bento-card b-ring reveal reveal-d1" data-glow>
              <div class="bento-glow"></div>
              <div class="ring" data-ring="98">
                <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" cx="60" cy="60" r="52"/></svg>
                <div class="ring-num"><span data-count="98">0</span><i>%</i></div>
              </div>
              <div class="bento-body">
                <h4>디지털 설계 정확도</h4>
                <p>계획 대비 식립 오차를 최소화</p>
              </div>
            </article>

            {/* in-house lab */}
            <article class="bento-card b-lab reveal reveal-d2" data-tilt data-glow>
              <div class="bento-glow"></div>
              <div class="bento-body">
                <span class="bento-kicker"><i class="fa-solid fa-print"></i> In-house Lab</span>
                <h3>원내 기공실</h3>
                <p>보철물을 외부에 맡기지 않습니다. 원내에서 직접 제작해 제작 기간과 내원 횟수를 줄입니다.</p>
                <div class="bento-chips">
                  <span><b>2</b> 밀링기</span>
                  <span><b>3</b> 3D 프린터</span>
                  <span><i class="fa-solid fa-cube"></i> 구강 스캐너</span>
                </div>
              </div>
            </article>

            {/* plagen */}
            <article class="bento-card b-plagen reveal reveal-d1" data-glow>
              <div class="bento-glow"></div>
              <div class="bento-icon"><i class="fa-solid fa-bolt-lightning"></i></div>
              <div class="bento-body">
                <h4>플라젠 신경치료기</h4>
                <p>정밀 신경치료로 자연치아를 최대한 보존하는 진료를 지향합니다.</p>
              </div>
            </article>

            {/* painless */}
            <article class="bento-card b-pain reveal reveal-d2" data-glow>
              <div class="bento-glow"></div>
              <div class="bento-icon"><i class="fa-solid fa-shield-heart"></i></div>
              <div class="bento-body">
                <h4>편안한 마취 시스템</h4>
                <p>치료 중 통증을 최소화해, 치과가 무섭지 않은 곳을 만듭니다.</p>
              </div>
            </article>

            {/* scan strip */}
            <article class="bento-card b-scan reveal reveal-d3" data-tilt data-glow>
              <div class="bento-glow"></div>
              <div class="bento-body">
                <span class="bento-kicker"><i class="fa-solid fa-tooth"></i> 3D Scan</span>
                <h3>구강 스캐너 정밀 진단</h3>
                <p>입안을 3D로 그대로 스캔해 본뜨는 불편 없이 정확하게 진단합니다.</p>
              </div>
              <div class="bento-dots"><span></span><span></span><span></span></div>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <section class="marquee-band">
        <div class="marquee" data-marquee>
          <div class="marquee-track">
            {MARQUEE.concat(MARQUEE).map((m) => (
              <span class="mq-item"><i class="fa-solid fa-circle"></i> {m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SPACE — 실제 원내 공간 ===================== */}
      <section class="space" id="clinic-space" aria-label="더착한치과 원내 공간">
        <div class="container">
          <div class="shead center" data-index="04" style="margin-bottom:46px">
            <span class="eyebrow center">Our Space</span>
            <h2>오시면, <span>먼저 편안해집니다</span></h2>
            <p>우드톤의 따뜻한 라운지와 넓은 동선. 치과 특유의 긴장을 덜어내도록 설계한 공간입니다.</p>
          </div>
          <div class="space-grid">
            <figure class="space-card space-feature reveal" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/interior-reception.webp" alt="더착한치과 메인 인포메이션 데스크와 라운지 — 원형 샹들리에 천장과 대리석 데스크" loading="lazy" />
              <figcaption><i class="fa-solid fa-couch"></i> 메인 라운지 &amp; 인포메이션</figcaption>
            </figure>
            <figure class="space-card reveal reveal-d1" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/interior-lounge.webp" alt="더착한치과 대기 공간 — 우드톤 셸 체어 라운지" loading="lazy" />
              <figcaption><i class="fa-solid fa-mug-hot"></i> 대기 라운지</figcaption>
            </figure>
            <figure class="space-card reveal reveal-d2" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/interior-1.webp" alt="더착한치과 우드톤 라운지 전경 — 넓은 동선과 따뜻한 조명" loading="lazy" />
              <figcaption><i class="fa-solid fa-tree"></i> 우드톤 라운지 전경</figcaption>
            </figure>
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

      {/* ===================== OPERATING — 원장이 직접 집도합니다 ===================== */}
      <section class="operating" id="operating" aria-label="원장이 직접 집도합니다">
        <div class="container">
          <div class="shead center" style="margin-bottom:40px">
            <span class="eyebrow center">Hands-on Care</span>
            <h2>상담부터 식립까지, <span>원장이 직접</span></h2>
            <p>진단·상담·수술을 황우석 대표원장이 직접 진행합니다. 디지털 가이드와 최소 절개로, 한 번에 정확하게.</p>
          </div>
          <div class="op-grid" data-tilt-scope>
            <figure class="op-card reveal" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/op-team.webp" alt="황우석 대표원장이 스태프와 함께 임플란트 수술을 진행하는 모습" loading="lazy" />
              <figcaption><i class="fa-solid fa-user-doctor"></i> 직접 집도</figcaption>
            </figure>
            <figure class="op-card reveal reveal-d1" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/op-focus.webp" alt="현미경급 집중으로 정밀하게 진료하는 모습" loading="lazy" />
              <figcaption><i class="fa-solid fa-crosshairs"></i> 정밀 진료</figcaption>
            </figure>
            <figure class="op-card reveal reveal-d2" data-glow>
              <div class="bento-glow"></div>
              <img src="/images/op-light.webp" alt="수술 조명 아래 식립을 진행하는 모습" loading="lazy" />
              <figcaption><i class="fa-solid fa-tooth"></i> 정확한 식립</figcaption>
            </figure>
          </div>
          <p class="cases-note reveal">
            <i class="fa-solid fa-circle-info"></i> 실제 진료 현장을 촬영한 사진이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* ===================== CASE STORIES — 원장이 들려주는 진료 이야기 ===================== */}
      <section class="cases" id="case-stories" aria-label="원장이 들려주는 진료 이야기">
        <div class="container">
          <div class="shead center" data-index="05">
            <span class="eyebrow center">From the Chair</span>
            <h2>원장이 직접 들려주는 <em>진료 이야기</em></h2>
            <p>24년 진료실에서 만난 분들의 이야기입니다. 개인정보 보호를 위해 익명으로 각색했습니다.</p>
          </div>
          <div class="cases-grid" data-tilt-scope>
            {CASE_STORIES.map((c, i) => (
              <article class={`case-card reveal reveal-d${(i % 4) + 1}`} data-glow>
                <div class="bento-glow"></div>
                <div class="case-photo">
                  <img src={c.image} alt={c.alt} loading="lazy" />
                  <span class="case-kicker"><i class={`fa-solid fa-${c.icon}`}></i> {c.tag}</span>
                </div>
                <div class="case-text">
                  <h3>{c.title}</h3>
                  <p class="case-body">{c.body}</p>
                  <span class="case-meta"><i class="fa-solid fa-tooth"></i> {c.meta}</span>
                </div>
              </article>
            ))}
          </div>
          <p class="cases-note reveal">
            <i class="fa-solid fa-circle-info"></i> 위 사례는 실제 진료 경험을 바탕으로 하나, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* ===================== PATIENT FUNNEL — 10단계 스토리맵 ===================== */}
      <section class="funnel" id="patient-funnel">
        <div class="container">
          <div class="shead center" data-index="06">
            <span class="eyebrow center">Patient Funnel &mdash; 10 Steps</span>
            <h2>처음 알게 된 순간부터<br /><em>소개하는 순간까지</em></h2>
            <p>환자분의 여정 전체를 10단계로 설계했습니다. 어느 단계에 계시든, 그 자리에서 편안하게 시작하시면 됩니다.</p>
          </div>

          <div class="funnel-phases" role="tablist" aria-label="여정 단계 필터">
            <button class="fp-tab active" data-phase="all" role="tab" aria-selected="true">전체</button>
            {FUNNEL_PHASES.map((p) => (
              <button class="fp-tab" data-phase={p.key} role="tab" aria-selected="false">{p.label}<small>{p.en}</small></button>
            ))}
          </div>

          <div class="funnel-map">
            <div class="funnel-line" aria-hidden="true"></div>
            {PATIENT_FUNNEL.map((s, i) => (
              <div class={`funnel-step reveal reveal-d${(i % 4) + 1}`} data-phase={s.phase}>
                <span class="fs-num">{String(s.step).padStart(2, '0')}</span>
                <div class="fs-ico"><i class={`fa-solid fa-${s.icon}`}></i></div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <span class={`fs-phase fs-${s.phase}`}>{FUNNEL_PHASES.find((p) => p.key === s.phase)!.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COMPARE ===================== */}
      <section class="compare">
        <div class="container">
          <div class="shead center" data-index="07">
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
          <div class="shead center" data-index="08">
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

      {/* ===================== 자주 묻는 질문 (AEO·FAQPage) ===================== */}
      <section class="sec bg-sand" id="home-faq">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 36px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title" style="font-size:30px">자주 묻는 질문</h2>
            <p style="color:var(--ink-soft);margin-top:8px">위치·진료시간·주차 등 가장 많이 물어보시는 내용을 모았습니다.</p>
          </div>
          <div class="home-faq-list reveal">
            {HOME_FAQS.map((f, i) => (
              <details class="home-faq-item" {...(i === 0 ? { open: true } : {})}>
                <summary><i class="fa-solid fa-circle-question" style="color:var(--brand);margin-right:10px"></i>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div style="text-align:center;margin-top:28px">
            <a href="/faq" class="btn btn-outline"><i class="fa-solid fa-list-ul"></i> 전체 자주 묻는 질문 보기</a>
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND — 서사형 ===================== */}
      <section class="cta-band">
        <JourneyPathVector />
        <div class="container inner">
          <span class="eyebrow on-navy">Your First Sentence</span>
          <h2>모든 이야기에는<br /><span class="gold">첫 문장</span>이 필요합니다</h2>
          <p>{STORY_CTA.ctaDesc}</p>
          <div class="actions">
            <a href="/reservation" class="btn btn-gold btn-lg"><i class="fa-solid fa-calendar-check"></i> {STORY_CTA.reserve}</a>
            <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost on-navy btn-lg"><i class="fa-solid fa-phone"></i> {STORY_CTA.call}</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

// ===================== 공지 팝업 (홈 첫 화면) =====================
// 관리자가 "팝업으로 띄우기"를 켠 공지를 모달로 노출.
// "오늘 하루 보지 않기"는 localStorage에 (id + 날짜)를 저장해 제어.
const NoticePopup: FC<{ notice: Notice }> = ({ notice }) => {
  const POPUP_CSS = `
.npop-ov{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,32,.55);backdrop-filter:blur(3px);animation:npop-fade .25s ease}
.npop-ov.show{display:flex}
@keyframes npop-fade{from{opacity:0}to{opacity:1}}
.npop{width:100%;max-width:420px;background:var(--card,#fff);border-radius:18px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.32);animation:npop-up .3s cubic-bezier(.16,1,.3,1)}
@keyframes npop-up{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
.npop-head{background:linear-gradient(135deg,var(--accent,#1f6f6b),var(--accent-d,#155350));color:#fff;padding:20px 24px;position:relative}
.npop-head .npop-eyebrow{font-size:12px;font-weight:700;letter-spacing:.08em;opacity:.85;display:flex;align-items:center;gap:7px}
.npop-head h2{margin:8px 0 0;font-size:21px;line-height:1.35;color:#fff;word-break:keep-all}
.npop-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border:none;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.npop-x:hover{background:rgba(255,255,255,.34)}
.npop-body{padding:22px 24px;color:var(--ink,#2b2b2b);font-size:15px;line-height:1.7;white-space:pre-line;max-height:46vh;overflow-y:auto}
.npop-date{font-size:12.5px;color:var(--ink-faint,#9aa);margin-bottom:10px}
.npop-actions{display:flex;gap:10px;padding:0 24px 22px}
.npop-actions .btn{flex:1;justify-content:center}
.npop-foot{display:flex;align-items:center;justify-content:space-between;padding:13px 24px;border-top:1px solid var(--line,#eee);background:var(--bg-2,#f7f7f5)}
.npop-foot label{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft,#666);cursor:pointer;user-select:none}
.npop-foot input{width:17px;height:17px}
.npop-foot .npop-close2{background:none;border:none;font-size:13px;font-weight:700;color:var(--ink-soft,#666);cursor:pointer;padding:4px}
@media(max-width:480px){.npop{max-width:100%} .npop-head h2{font-size:19px}}
`
  const POPUP_JS = `
(function(){
  var id=${JSON.stringify(notice.id)};
  var mod=${JSON.stringify(notice.modified || notice.date || '')};
  var key='npop_dismiss_'+id;
  try{
    var saved=localStorage.getItem(key);
    // 저장값 형식: "YYYY-MM-DD|modified". 오늘이거나 내용이 그대로면 숨김.
    if(saved){
      var parts=saved.split('|');
      var savedDate=parts[0], savedMod=parts[1]||'';
      var todayStr=new Date().toISOString().slice(0,10);
      // 공지 내용이 수정됐으면 다시 노출
      if(savedMod===mod && savedDate===todayStr) return;
    }
  }catch(e){}
  var ov=document.getElementById('npop-overlay');
  if(!ov) return;
  // 약간의 지연 후 등장(첫 화면 인지 후)
  setTimeout(function(){ ov.classList.add('show'); document.body.style.overflow='hidden'; }, 600);
  function close(){
    ov.classList.remove('show'); document.body.style.overflow='';
    var dontShow=document.getElementById('npop-dont');
    if(dontShow && dontShow.checked){
      try{ localStorage.setItem(key, new Date().toISOString().slice(0,10)+'|'+mod); }catch(e){}
    }
  }
  ov.querySelectorAll('[data-npop-close]').forEach(function(b){ b.addEventListener('click', close); });
  ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && ov.classList.contains('show')) close(); });
})();
`
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: POPUP_CSS }} />
      <div id="npop-overlay" class="npop-ov" role="dialog" aria-modal="true" aria-labelledby="npop-title">
        <div class="npop">
          <div class="npop-head">
            <span class="npop-eyebrow"><i class="fa-solid fa-bullhorn"></i> 더착한치과 공지</span>
            <h2 id="npop-title">{notice.title}</h2>
            <button type="button" class="npop-x" data-npop-close aria-label="닫기"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="npop-body">
            {notice.date && <div class="npop-date"><i class="fa-regular fa-calendar"></i> {notice.date}</div>}
            {notice.body}
          </div>
          <div class="npop-actions">
            <a href="/notice" class="btn btn-gold btn-sm"><i class="fa-solid fa-list"></i> 공지 전체보기</a>
            <a href="/reservation" class="btn btn-ghost btn-sm"><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
          <div class="npop-foot">
            <label><input type="checkbox" id="npop-dont" /> 오늘 하루 보지 않기</label>
            <button type="button" class="npop-close2" data-npop-close>닫기</button>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: POPUP_JS }} />
    </>
  )
}
