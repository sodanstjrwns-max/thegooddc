import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS, CORE_TREATMENTS } from '../data/treatments'
import { PRICING, PRICING_UPDATED, PRICING_UNIT_NOTE } from '../data/pricing'
import { DOCTORS } from '../data/doctors'
import { breadcrumbSchema, faqSchema, speakableSchema } from '../lib/seo'
import type { Notice } from '../lib/content-store'
import { SEED_NOTICES } from '../lib/content-store'

// ===== 미션 / 병원소개 =====
export const MissionPage: FC = () => {
  const doctor = DOCTORS[0]
  return (
    <Layout
      title={`병원소개 | ${CLINIC.name} — ${CLINIC.brandSlogan}`}
      description={`${CLINIC.name}는 「${CLINIC.philosophy.mission}」는 미션으로 강서구 명지에서 정확하고 편안한 진료를 제공합니다. ${CLINIC.philosophy.vision}.`}
      path="/mission"
      keywords={['강서구 치과 소개', '명지 치과 철학', '더착한치과 미션']}
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '병원소개', path: '/mission' }]), speakableSchema()]}
    >
      <section class="page-hero has-img">
        <div class="bg" data-parallax="0.12" style="background-image:url('/images/interior-reception.webp')"></div>
        <div class="container">
          <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '병원소개', path: '/mission' }]} />
          <div class="eyebrow">OUR MISSION</div>
          <h1>치과 통증의 두려움을<br /><span class="grad">안심으로</span> 바꾸겠습니다</h1>
          <p>{CLINIC.philosophy.vision}</p>
        </div>
      </section>

      {/* OUR STORY — 텍스트 + 실제 인테리어 사진 */}
      <section class="sec">
        <div class="container">
          <div class="mis-story">
            <div class="ms-text reveal">
              <div class="eyebrow">OUR STORY</div>
              <h2>"치과가 무섭지 않은 곳"을<br />만들고 싶었습니다</h2>
              <p>치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루는 분들이 많습니다. 더착한치과는 바로 그 두려움을 덜어드리기 위해 시작했습니다.</p>
              <p>24년의 임상 경험과 디지털 기술을 더해, 정확하면서도 편안한 진료로 환자분의 두려움을 안심으로 바꾸어 드리는 것 — 그것이 우리의 약속입니다.</p>
              <div class="ms-sign"><span class="line"></span> 더착한치과 의료진 일동</div>
            </div>
            <div class="mis-photo reveal reveal-d1">
              <img src="/images/interior-lounge.webp" alt="더착한치과 대기 라운지 — 편안한 공간" loading="lazy" />
              <span class="cap">환자분이 가장 먼저 마주하는 편안한 공간</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES — 사진 배경 카드 */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 44px">
            <div class="eyebrow center">CORE VALUES</div>
            <h2 class="section-title">우리가 지키는 세 가지 가치</h2>
          </div>
          <div class="mis-values">
            {[
              { ...CLINIC.philosophy.coreValues[0], bg: '/images/op-guide.webp' },
              { ...CLINIC.philosophy.coreValues[1], bg: '/images/op-focus.webp' },
              { ...CLINIC.philosophy.coreValues[2], bg: '/images/interior-1.webp' },
            ].map((v, i) => (
              <div class={`mis-val reveal reveal-d${i + 1}`}>
                <div class="bg" style={`background-image:url('${v.bg}')`}></div>
                <div class="v-inner">
                  <div class="v-ico"><i class={`fa-solid fa-${v.icon}`}></i></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPACE — 공간 갤러리 */}
      <section class="sec">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 44px">
            <div class="eyebrow center">OUR SPACE</div>
            <h2 class="section-title">정돈된 공간, 안심되는 첫인상</h2>
            <p style="color:var(--ink-soft)">서울대학교 치과병원 시스템을 기준으로 설계한 진료 환경입니다.</p>
          </div>
          <div class="mis-gallery reveal">
            <figure class="wide tall">
              <img src="/images/interior-reception.webp" alt="더착한치과 리셉션" loading="lazy" />
              <figcaption>리셉션 · 안내 데스크</figcaption>
            </figure>
            <figure>
              <img src="/images/interior-1.webp" alt="진료실" loading="lazy" />
              <figcaption>진료실</figcaption>
            </figure>
            <figure>
              <img src="/images/interior-2.webp" alt="상담실" loading="lazy" />
              <figcaption>상담 공간</figcaption>
            </figure>
            <figure class="wide">
              <img src="/images/interior-lounge.webp" alt="대기 라운지" loading="lazy" />
              <figcaption>대기 라운지</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ON-SITE — 진료 현장 */}
      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 44px">
            <div class="eyebrow center">ON-SITE</div>
            <h2 class="section-title">원장이 직접, 정밀하게</h2>
          </div>
          <div class="mis-onsite reveal">
            <figure>
              <img src="/images/op-team.webp" alt="협진 시스템" loading="lazy" />
              <figcaption><i class="fa-solid fa-people-group"></i> 체계적인 협진 시스템</figcaption>
            </figure>
            <figure>
              <img src="/images/op-focus.webp" alt="정밀 진료" loading="lazy" />
              <figcaption><i class="fa-solid fa-crosshairs"></i> 디지털 정밀 진료</figcaption>
            </figure>
            <figure>
              <img src="/images/op-light.webp" alt="감염관리" loading="lazy" />
              <figcaption><i class="fa-solid fa-shield-halved"></i> 철저한 감염관리</figcaption>
            </figure>
          </div>
          <p style="text-align:center;color:var(--ink-soft);font-size:.86rem;margin-top:22px">※ 실제 진료 현장을 촬영한 사진이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.</p>
        </div>
      </section>

      {/* 대표원장 (실사진) */}
      <section class="sec">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 40px">
            <div class="eyebrow center">DIRECTOR</div>
            <h2 class="section-title">진료를 책임지는 사람</h2>
          </div>
          <div class="mis-doctor reveal">
            <div class="md-photo">
              <img src={doctor.photo} alt={`${doctor.name} ${doctor.title}`} loading="lazy" />
              <span class="ribbon">임플란트 15,000+ 케이스</span>
            </div>
            <div class="md-body">
              <span class="license">{doctor.license}</span>
              <h2>{doctor.name} <small>{doctor.title}</small></h2>
              <p>{doctor.philosophy}</p>
              <div class="actions" style="display:flex;flex-wrap:wrap;gap:12px">
                <a href={`/doctors/${doctor.slug}`} class="btn btn-accent"><i class="fa-solid fa-user-doctor"></i> 의료진 자세히 보기</a>
                <a href="/reservation" class="btn btn-outline"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

// ===== 오시는 길 =====
export const DirectionsPage: FC = () => (
  <Layout
    title={`오시는 길 · 진료시간 | ${CLINIC.name} 강서구 명지`}
    description={`${CLINIC.name} 위치 안내. ${CLINIC.address}. ${CLINIC.directions.car}. 진료시간 ${CLINIC.hoursNote}.`}
    path="/directions"
    keywords={['강서구 치과 위치', '명지 치과 오시는길', '명지오션시티 치과', '더착한치과 진료시간']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '오시는 길', path: '/directions' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-solid fa-location-dot"></i> DIRECTIONS</div>
        <h1>오시는 길</h1>
        <p>{CLINIC.address}</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '오시는 길', path: '/directions' }]} />

    <section class="sec">
      <div class="container split">
        <div class="reveal">
          <h2 class="section-title" style="font-size:30px;margin-bottom:24px">진료 시간</h2>
          <table class="hours-table">
            {CLINIC.hours.map((h) => (
              <tr>
                <td>{h.day}</td>
                <td class={h.closed ? 'closed' : ''}>{h.time}{h.note ? ` (${h.note})` : ''}</td>
              </tr>
            ))}
          </table>
          <p style="margin-top:18px;color:var(--ink-soft);font-size:15px"><i class="fa-solid fa-circle-info" style="color:var(--brand);margin-right:6px"></i>점심시간 12:00 - 14:00 (토요일 제외)</p>
          <div style="margin-top:28px"><a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-primary"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a></div>
        </div>
        <div class="reveal" data-delay="2">
          <h2 class="section-title" style="font-size:30px;margin-bottom:24px">교통 안내</h2>
          <div class="sub-card" style="margin-bottom:16px">
            <h4><i class="fa-solid fa-car" style="margin-right:8px"></i>자가용</h4>
            <p>{CLINIC.directions.car}</p>
          </div>
          <div class="sub-card">
            <h4><i class="fa-solid fa-bus" style="margin-right:8px"></i>버스</h4>
            <p style="margin-bottom:6px"><strong>일반:</strong> {CLINIC.directions.bus.general.join(', ')}</p>
            <p style="margin-bottom:6px"><strong>좌석:</strong> {CLINIC.directions.bus.seat.join(', ')}</p>
            <p style="margin-bottom:6px"><strong>급행:</strong> {CLINIC.directions.bus.express.join(', ')}</p>
            <p style="margin:0"><strong>마을:</strong> {CLINIC.directions.bus.village.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec-sm bg-sand">
      <div class="container">
        <div class="reveal map-block">
          <div class="map-bar">
            <div class="map-bar-info">
              <strong><i class="fa-solid fa-location-dot"></i> {CLINIC.name}</strong>
              <span>{CLINIC.address}</span>
            </div>
            <div class="map-bar-links">
              <a class="btn btn-ghost btn-sm" href={`https://map.kakao.com/link/to/${encodeURIComponent(CLINIC.name)},${CLINIC.geo.lat},${CLINIC.geo.lng}`} target="_blank" rel="noopener"><i class="fa-solid fa-diamond-turn-right"></i> 카카오맵 길찾기</a>
              <a class="btn btn-ghost btn-sm" href={`https://www.google.com/maps/dir/?api=1&destination=${CLINIC.geo.lat},${CLINIC.geo.lng}`} target="_blank" rel="noopener"><i class="fa-brands fa-google"></i> 구글맵 길찾기</a>
            </div>
          </div>
          <iframe
            title="더착한치과 위치 지도"
            width="100%" height="440" style="border:0;display:block"
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${CLINIC.geo.lng - 0.008}%2C${CLINIC.geo.lat - 0.005}%2C${CLINIC.geo.lng + 0.008}%2C${CLINIC.geo.lat + 0.005}&layer=mapnik&marker=${CLINIC.geo.lat}%2C${CLINIC.geo.lng}`}
          ></iframe>
        </div>
      </div>
    </section>
  </Layout>
)

// ===== 통합 FAQ =====
export const FaqPage: FC = () => {
  const allFaqs = TREATMENTS.flatMap((t) => t.faq)
  return (
    <Layout
      title={`자주 묻는 질문 | ${CLINIC.name} 강서구 명지 치과`}
      description="더착한치과 진료에 대해 자주 묻는 질문을 모았습니다. 임플란트, 투명교정, 미니쉬, 충치, 잇몸치료 등 진료별 궁금증을 확인하세요."
      path="/faq"
      keywords={['강서구 치과 질문', '임플란트 질문', '투명교정 비용', '명지 치과 FAQ']}
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: 'FAQ', path: '/faq' }]), faqSchema(allFaqs.slice(0, 30)), speakableSchema()]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-circle-question"></i> FAQ</div>
          <h1>자주 묻는 질문</h1>
          <p>진료별로 가장 많이 받는 질문을 모았습니다. 더 궁금한 점은 언제든 전화로 문의해 주세요.</p>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: 'FAQ', path: '/faq' }]} />

      <section class="sec">
        <div class="container">
          {TREATMENTS.filter((t) => t.faq.length).map((t, i) => (
            <div class="reveal" style="margin-bottom:50px">
              <h2 class="section-title" style="font-size:26px;margin-bottom:20px">
                <i class={`fa-solid fa-${t.icon}`} style="color:var(--brand);margin-right:10px"></i>{t.shortName}
              </h2>
              <FaqList faqs={t.faq} />
              <div style="margin-top:16px"><a href={`/treatments/${t.slug}`} class="chip"><i class="fa-solid fa-arrow-right"></i> {t.shortName} 자세히 보기</a></div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

// ===== 비용 안내 =====
export const PricingPage: FC = () => (
  <Layout
    title={`비용 안내 | ${CLINIC.name} 강서구 명지 치과`}
    description="더착한치과 비급여 진료비용 안내입니다. 정확한 비용은 정밀 진단 후 개인별 상태에 따라 상담 시 안내해 드립니다."
    path="/pricing"
    keywords={['강서구 치과 비용', '임플란트 비용', '명지 치과 가격']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '비용 안내', path: '/pricing' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-solid fa-won-sign"></i> PRICING</div>
        <h1>비급여 진료비용 안내</h1>
        <p>의료법 제45조에 따라 비급여 진료비용을 투명하게 고지합니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '비용 안내', path: '/pricing' }]} />

    <section class="sec-sm">
      <div class="container">
        <div class="reveal" style="max-width:860px;margin:0 auto">
          <p class="aeo-answer">
            치과 진료비용은 환자분의 구강 상태·진료 범위·사용 재료에 따라 달라집니다.
            더착한치과는 정밀 진단 후 진료 계획과 함께 정확한 비용을 충분히 설명드린 뒤 진료를 시작합니다.
          </p>
        </div>
      </div>
    </section>

    {/* 비급여 수가표 */}
    <section class="sec-sm">
      <div class="container">
        <div class="price-meta reveal">
          <span><i class="fa-regular fa-calendar"></i> 기준일 {PRICING_UPDATED}</span>
          <span><i class="fa-solid fa-circle-info"></i> {PRICING_UNIT_NOTE}</span>
        </div>

        {PRICING.map((g) => (
          <div class="price-block reveal">
            <h2 class="price-cat"><i class={`fa-solid fa-${g.icon}`}></i> {g.category}</h2>
            <div class="price-table-wrap">
              <table class="price-table">
                <thead>
                  <tr>
                    <th class="c-sub">항목</th>
                    <th class="c-detail">상세</th>
                    <th class="c-cost">비용(원)</th>
                    <th class="c-note">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((it) => {
                    const free = it.cost === '비용 없음' || it.cost === 'X'
                    return (
                      <tr>
                        <td class="c-sub" data-label="항목">{it.sub}</td>
                        <td class="c-detail" data-label="상세">{it.detail || '—'}</td>
                        <td class={`c-cost${free ? ' is-free' : ''}`} data-label="비용">{it.cost === 'X' ? '별도 문의' : it.cost}</td>
                        <td class="c-note" data-label="비고">{it.note || ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div class="price-notice reveal">
          <h3><i class="fa-solid fa-circle-exclamation"></i> 안내사항</h3>
          <ul>
            <li>위 금액은 비급여 진료비용이며, <strong>진찰료 및 각종 검사료 등 진료비용은 포함하지 않습니다.</strong></li>
            <li>‘~’ 표기는 ‘이상’을 의미하며, 환자분의 구강 상태·재료·범위에 따라 비용이 달라질 수 있습니다.</li>
            <li>스케일링(연 1회), 충치치료, 신경치료, 잇몸치료 등 일부 진료는 건강보험이 적용됩니다.</li>
            <li>정확한 비용은 정밀 진단 후 개인별 상태에 따라 상담 시 안내해 드립니다.</li>
          </ul>
        </div>

        <div class="related-box reveal" style="margin-top:28px">
          <h3><i class="fa-solid fa-phone" style="color:var(--accent);margin-right:8px"></i>비용 상담 문의</h3>
          <div class="chip-row">
            <a href={`tel:${CLINIC.phoneRaw}`} class="chip"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            <a href="/reservation" class="chip"><i class="fa-regular fa-calendar-check"></i> 상담 예약</a>
          </div>
        </div>
      </div>
    </section>
  </Layout>
)

// ===== 공지사항 (정적 데모) =====
export const NoticePage: FC<{ notices?: Notice[] }> = ({ notices = SEED_NOTICES }) => {
  return (
    <Layout
      title={`공지사항 | ${CLINIC.name}`}
      description="더착한치과 공지사항 및 진료 안내입니다. 휴진 안내, 야간진료, 진료 시스템 소식을 확인하세요."
      path="/notice"
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '공지사항', path: '/notice' }])]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-bullhorn"></i> NOTICE</div>
          <h1>공지사항</h1>
        </div>
      </section>
      <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '공지사항', path: '/notice' }]} />
      <section class="sec">
        <div class="container" style="max-width:820px">
          {notices.map((n) => (
            <div class="card reveal" style="padding:28px 30px;margin-bottom:16px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                {n.pinned && <span class="license" style="margin:0;background:var(--brand);color:#fff">중요</span>}
                <span style="color:var(--ink-soft);font-size:14px">{n.date}</span>
              </div>
              <h3 style="font-size:20px;margin-bottom:8px">{n.title}</h3>
              {n.image && (
                <img src={n.image} alt={n.imageAlt || n.title} loading="lazy" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;margin:6px 0 16px" />
              )}
              <p style="color:var(--ink-soft);margin:0;line-height:1.7;white-space:pre-line">{n.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

// ===== 예약 =====
export const ReservationPage: FC = () => (
  <Layout
    title={`진료 예약 | ${CLINIC.name} 강서구 명지 치과`}
    description="부산 강서구 명지 더착한치과 온라인 진료 예약. 임플란트·투명교정·미니쉬·충치·잇몸 진료를 원하시는 날짜와 시간으로 신청하시면 확인 후 빠르게 연락드립니다."
    path="/reservation"
    keywords={['강서구 치과 예약', '명지 치과 예약', '더착한치과 예약']}
    schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '진료 예약', path: '/reservation' }])]}
  >
    <section class="page-hero">
      <div class="container ph-inner">
        <div class="hero-badge"><i class="fa-regular fa-calendar-check"></i> RESERVATION</div>
        <h1>진료 예약</h1>
        <p>예약 정보를 남겨주시면 확인 후 빠르게 연락드립니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '진료 예약', path: '/reservation' }]} />

    {/* 진료 여정 — 예약 후 이렇게 진행됩니다 (안심 프로세스) */}
    <section class="journey" aria-label="진료 진행 과정">
      <div class="container">
        <div class="shead center">
          <span class="eyebrow center">How It Works</span>
          <h2>예약하시면, <span class="gold">이렇게 진행됩니다</span></h2>
          <p>처음 오셔도 당황하지 않으시도록 진료 흐름을 미리 안내해 드립니다.</p>
        </div>
        <ol class="jn-track">
          {[
            { ic: 'phone-volume', t: '예약·확인 연락', d: '신청 내용을 확인하고 가장 편한 시간으로 예약을 잡아드립니다.' },
            { ic: 'comments', t: '충분한 상담', d: '증상과 걱정을 충분히 듣고, 서두르지 않고 설명드립니다.' },
            { ic: 'cube', t: '3D 정밀 진단', d: '3D CT·구강스캔으로 현재 상태를 함께 화면으로 확인합니다.' },
            { ic: 'list-check', t: '맞춤 치료 계획', d: '꼭 필요한 진료만, 우선순위와 비용을 투명하게 안내합니다.' },
            { ic: 'tooth', t: '정밀 치료', d: '계획한 대로 단계를 나눠 부담 없이 진행합니다.' },
            { ic: 'heart-pulse', t: '사후 관리', d: '치료 후에도 정기 점검으로 건강을 오래 지켜드립니다.' },
          ].map((s, i) => (
            <li class="jn-step reveal">
              <span class="jn-no">{String(i + 1).padStart(2, '0')}</span>
              <span class="jn-ico"><i class={`fa-solid fa-${s.ic}`}></i></span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section class="sec">
      <div class="container rsv-wrap">
        {/* 진행 단계 표시 — 퍼널 시각화 */}
        <ol class="rsv-steps" aria-label="예약 진행 단계">
          <li class="rsv-step active" data-step="1"><span class="rsv-num">1</span><span class="rsv-lbl">진료 선택</span></li>
          <li class="rsv-step" data-step="2"><span class="rsv-num">2</span><span class="rsv-lbl">일정 선택</span></li>
          <li class="rsv-step" data-step="3"><span class="rsv-num">3</span><span class="rsv-lbl">연락처 입력</span></li>
          <li class="rsv-step done-step" data-step="4"><span class="rsv-num"><i class="fa-solid fa-check"></i></span><span class="rsv-lbl">신청 완료</span></li>
        </ol>

        <form class="form-card rsv-form" id="reservation-form" method="post" action="/api/reservation" data-track-form="reservation">
          {/* STEP 1 — 진료 선택 (칩) */}
          <fieldset class="rsv-fieldset">
            <legend><span class="rsv-badge">1</span> 어떤 진료가 필요하세요?</legend>
            <div class="rsv-chips" id="treatment-chips" role="radiogroup" aria-label="희망 진료">
              {TREATMENTS.map((t) => (
                <button type="button" class="rsv-chip" data-value={t.shortName} role="radio" aria-checked="false">
                  <i class={`fa-solid fa-${t.icon || 'tooth'}`}></i> {t.shortName}
                </button>
              ))}
              <button type="button" class="rsv-chip" data-value="기타/상담" role="radio" aria-checked="false">
                <i class="fa-solid fa-comments"></i> 기타 / 상담
              </button>
            </div>
            <input type="hidden" name="treatment" id="treatment-input" />
          </fieldset>

          {/* STEP 2 — 일정 (날짜 + 시간대 칩) */}
          <fieldset class="rsv-fieldset">
            <legend><span class="rsv-badge">2</span> 언제 방문하고 싶으세요?</legend>
            <div class="field"><label>희망 날짜</label><input name="date" type="date" id="rsv-date" /></div>
            <label class="rsv-sublabel">희망 시간대</label>
            <div class="rsv-chips time" id="time-chips" role="radiogroup" aria-label="희망 시간대">
              {['오전 (09–12시)', '점심 (12–14시)', '오후 (14–17시)', '저녁 (17–20시)', '상관없음'].map((slot) => (
                <button type="button" class="rsv-chip sm" data-value={slot} role="radio" aria-checked="false">{slot}</button>
              ))}
            </div>
            <input type="hidden" name="timeSlot" id="time-input" />
            <p class="rsv-hint"><i class="fa-regular fa-clock"></i> 월·수 야간 20시까지 / 토 오전 진료 / 일요일 휴무</p>
          </fieldset>

          {/* STEP 3 — 연락처 */}
          <fieldset class="rsv-fieldset">
            <legend><span class="rsv-badge">3</span> 어디로 연락드릴까요?</legend>
            <div class="field"><label>이름 *</label><input name="name" required placeholder="성함을 입력해 주세요" /></div>
            <div class="field"><label>연락처 *</label><input name="phone" required type="tel" placeholder="010-0000-0000" inputmode="numeric" /></div>
            <div class="field"><label>문의 내용</label><textarea name="message" rows={3} placeholder="증상이나 궁금하신 점을 자유롭게 적어주세요 (선택)"></textarea></div>
            <div class="field checkbox-row">
              <input type="checkbox" name="agree" required id="agree" />
              <label for="agree" style="font-weight:400">개인정보 수집·이용에 동의합니다. 수집된 정보는 예약 상담 목적으로만 사용됩니다. *</label>
            </div>
          </fieldset>

          <button type="submit" class="btn btn-primary rsv-submit" data-track="reservation" data-track-loc="reservation_form">
            <i class="fa-regular fa-paper-plane"></i> 예약 신청하기
          </button>
          <p class="rsv-trust"><i class="fa-solid fa-lock"></i> 입력하신 정보는 안전하게 보호되며 예약 상담 목적으로만 사용됩니다.</p>
          <p id="reservation-result" style="text-align:center;margin-top:16px;font-weight:700"></p>
        </form>
      </div>
    </section>

    <script dangerouslySetInnerHTML={{ __html: `
      (function(){
        var steps = Array.prototype.slice.call(document.querySelectorAll('.rsv-step'));
        function setStep(n){
          steps.forEach(function(s){
            var sn = parseInt(s.getAttribute('data-step'),10);
            s.classList.toggle('active', sn === n);
            s.classList.toggle('done', sn < n);
          });
        }
        // 칩 라디오 그룹 (진료 / 시간대)
        function bindChips(groupId, inputId, onpick){
          var group = document.getElementById(groupId);
          var input = document.getElementById(inputId);
          if(!group||!input) return;
          group.addEventListener('click', function(e){
            var chip = e.target.closest('.rsv-chip');
            if(!chip) return;
            group.querySelectorAll('.rsv-chip').forEach(function(c){ c.classList.remove('on'); c.setAttribute('aria-checked','false'); });
            chip.classList.add('on'); chip.setAttribute('aria-checked','true');
            input.value = chip.getAttribute('data-value');
            if(onpick) onpick();
          });
        }
        bindChips('treatment-chips','treatment-input', function(){ setStep(2); });
        bindChips('time-chips','time-input', function(){ setStep(3); });
        var dateEl = document.getElementById('rsv-date');
        if(dateEl){
          var t=new Date(); t.setDate(t.getDate()); dateEl.min = t.toISOString().split('T')[0];
          dateEl.addEventListener('change', function(){ setStep(3); });
        }
        var phoneEl = document.querySelector('#reservation-form input[name=phone]');
        if(phoneEl){ phoneEl.addEventListener('focus', function(){ setStep(3); }); }

        var form = document.getElementById('reservation-form');
        form.addEventListener('submit', async function(e){
          e.preventDefault();
          var f = e.target; var r = document.getElementById('reservation-result');
          var data = Object.fromEntries(new FormData(f));
          var btn = f.querySelector('.rsv-submit');
          r.textContent = '전송 중...'; r.style.color = 'var(--ink-soft)';
          if(btn){ btn.disabled = true; btn.style.opacity = '.6'; }
          try {
            var res = await fetch('/api/reservation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
            var j = await res.json();
            if (j.ok) {
              r.innerHTML = '<i class="fa-solid fa-circle-check"></i> 예약 신청이 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.';
              r.style.color = 'var(--brand)';
              setStep(4);
              f.reset();
              document.querySelectorAll('.rsv-chip.on').forEach(function(c){ c.classList.remove('on'); c.setAttribute('aria-checked','false'); });
              try {
                var g = window.gtag;
                if (typeof g === 'function') {
                  g('event', 'reservation_submit', { event_category:'conversion', event_label:'reservation_form', conversion_type:'reservation_submit' });
                  g('event', 'generate_lead', { event_category:'conversion', value:1, currency:'KRW' });
                } else if (window.dataLayer) { window.dataLayer.push({ event:'reservation_submit' }); }
              } catch(_) {}
            } else {
              r.textContent = j.error || '오류가 발생했습니다. 전화로 문의해 주세요.'; r.style.color = '#c0392b';
              if(btn){ btn.disabled = false; btn.style.opacity = '1'; }
            }
          } catch(err) {
            r.textContent = '오류가 발생했습니다. 전화(051-203-2875)로 문의해 주세요.'; r.style.color = '#c0392b';
            if(btn){ btn.disabled = false; btn.style.opacity = '1'; }
          }
        });
      })();
    `}}></script>
  </Layout>
)
