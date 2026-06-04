import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS, CORE_TREATMENTS } from '../data/treatments'
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
      description={`${CLINIC.name}는 "${CLINIC.philosophy.mission}"는 미션으로 강서구 명지에서 정확하고 편안한 진료를 제공합니다. ${CLINIC.philosophy.vision}.`}
      path="/mission"
      keywords={['강서구 치과 소개', '명지 치과 철학', '더착한치과 미션']}
      schemas={[breadcrumbSchema([{ name: '홈', path: '/' }, { name: '병원소개', path: '/mission' }]), speakableSchema()]}
    >
      <section class="page-hero has-img">
        <div class="bg" data-parallax="0.12" style="background-image:url('/images/hero.webp')"></div>
        <div class="container">
          <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '병원소개', path: '/mission' }]} />
          <div class="eyebrow">OUR MISSION</div>
          <h1>치과 통증의 두려움을<br /><span class="grad">안심으로</span> 바꾸겠습니다</h1>
          <p>{CLINIC.philosophy.vision}</p>
        </div>
      </section>

      <section class="sec">
        <div class="container article-body">
          <div class="reveal" style="text-align:center;margin-bottom:20px"><div class="eyebrow" style="justify-content:center">OUR STORY</div></div>
          <h2 class="aeo-answer" style="border:none;background:none;font-size:clamp(22px,3vw,30px);font-weight:800;text-align:center;color:var(--ink);line-height:1.5;padding:0">
            "{CLINIC.philosophy.mission}"
          </h2>
          <p style="text-align:center;font-size:18px">{CLINIC.philosophy.story}</p>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 50px">
            <div class="eyebrow" style="justify-content:center">CORE VALUES</div>
            <h2 class="section-title">우리가 지키는 세 가지 가치</h2>
          </div>
          <div class="value-grid">
            {CLINIC.philosophy.coreValues.map((v, i) => (
              <div class="value-card reveal" data-delay={String(i + 1)}>
                <div class="vc-icon"><i class={`fa-solid fa-${v.icon}`}></i></div>
                <h3>{v.title}</h3><p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="container">
          <div class="doctor-card reveal">
            <div class="doctor-photo"><i class="fa-solid fa-user-doctor"></i></div>
            <div>
              <span class="license">{doctor.license}</span>
              <h2 class="section-title" style="font-size:30px;margin-bottom:12px">{doctor.name} {doctor.title}</h2>
              <p style="color:var(--ink-soft);line-height:1.85;margin-bottom:20px">{doctor.philosophy}</p>
              <a href={`/doctors/${doctor.slug}`} class="btn btn-outline"><i class="fa-solid fa-arrow-right"></i> 의료진 소개</a>
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
        <div class="reveal" style="border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm)">
          <iframe
            title="더착한치과 지도"
            width="100%" height="420" style="border:0;display:block"
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${CLINIC.geo.lat},${CLINIC.geo.lng}&z=16&output=embed`}
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
        <h1>비용 안내</h1>
        <p>투명한 비용 안내를 원칙으로 합니다.</p>
      </div>
    </section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '비용 안내', path: '/pricing' }]} />

    <section class="sec">
      <div class="container article-body">
        <p class="aeo-answer">
          치과 진료비용은 환자분의 구강 상태, 진료 범위, 사용 재료에 따라 달라집니다.
          더착한치과는 정밀 진단 후 진료 계획과 함께 정확한 비용을 충분히 설명드린 뒤 진료를 시작합니다.
          비급여 진료비용은 병원 내 게시되어 있으며, 상담 시 자세히 안내해 드립니다.
        </p>
        <h2>비급여 진료비 고지 안내</h2>
        <p>본 병원은 의료법 제45조에 따라 비급여 진료비용을 병원 내에 게시하고 있습니다. 정확한 비용은 진단 결과에 따라 개인별로 안내되므로, 내원하여 상담받으시기를 권합니다.</p>
        <h2>건강보험 적용 진료</h2>
        <p>스케일링(연 1회), 충치치료, 신경치료, 잇몸치료 등 일부 진료는 건강보험이 적용됩니다. 자세한 적용 범위는 내원 시 안내해 드립니다.</p>
        <div class="related-box">
          <h3><i class="fa-solid fa-phone" style="color:var(--brand);margin-right:8px"></i>비용 상담 문의</h3>
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
              <p style="color:var(--ink-soft);margin:0;line-height:1.7">{n.body}</p>
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
    description="더착한치과 온라인 진료 예약. 원하시는 진료와 날짜를 남겨주시면 빠르게 연락드립니다."
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

    <section class="sec">
      <div class="container">
        <form class="form-card" id="reservation-form" method="post" action="/api/reservation">
          <div class="field"><label>이름 *</label><input name="name" required placeholder="성함을 입력해 주세요" /></div>
          <div class="field"><label>연락처 *</label><input name="phone" required type="tel" placeholder="010-0000-0000" /></div>
          <div class="field">
            <label>희망 진료</label>
            <select name="treatment">
              <option value="">선택해 주세요</option>
              {TREATMENTS.map((t) => <option value={t.shortName}>{t.name}</option>)}
              <option value="기타/상담">기타 / 상담</option>
            </select>
          </div>
          <div class="field"><label>희망 날짜</label><input name="date" type="date" /></div>
          <div class="field"><label>문의 내용</label><textarea name="message" rows={4} placeholder="궁금하신 점을 자유롭게 적어주세요"></textarea></div>
          <div class="field checkbox-row">
            <input type="checkbox" name="agree" required id="agree" />
            <label for="agree" style="font-weight:400">개인정보 수집·이용에 동의합니다. 수집된 정보는 예약 상담 목적으로만 사용됩니다. *</label>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-regular fa-paper-plane"></i> 예약 신청하기</button>
          <p id="reservation-result" style="text-align:center;margin-top:16px;font-weight:700"></p>
        </form>
      </div>
    </section>

    <script dangerouslySetInnerHTML={{ __html: `
      document.getElementById('reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target; const r = document.getElementById('reservation-result');
        const data = Object.fromEntries(new FormData(f));
        r.textContent = '전송 중...'; r.style.color = 'var(--ink-soft)';
        try {
          const res = await fetch('/api/reservation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
          const j = await res.json();
          if (j.ok) { r.textContent = '예약 신청이 접수되었습니다. 곧 연락드리겠습니다.'; r.style.color = 'var(--brand)'; f.reset(); }
          else { r.textContent = j.error || '오류가 발생했습니다. 전화로 문의해 주세요.'; r.style.color = '#c0392b'; }
        } catch(err) { r.textContent = '오류가 발생했습니다. 전화로 문의해 주세요.'; r.style.color = '#c0392b'; }
      });
    `}}></script>
  </Layout>
)
