// ============================================================
// "부산 명지 치과" 대표 키워드 허브 — /clinic/myeongji (2026-10-08 지역 핵심 키워드 SEO)
// - URL 유지, 다른 지역 허브(AreaHubPage) 템플릿 대신 명지오션시티 본원 기준의 고유 본문으로 렌더.
// - 사실 출처: src/data/clinic.ts(주소·주차·버스·진료시간·개원), src/data/doctors.ts(대표원장 학위·자격·경력),
//   src/data/treatments.ts(진료 목록), src/data/areas.ts(명지 랜드마크). 새 사실을 지어내지 않는다.
// - 화면 FAQ 와 FAQPage 스키마는 MYEONGJI_HUB_FAQS 한 배열을 같이 쓴다 (1:1).
// ============================================================
import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS } from '../data/treatments'
import { breadcrumbSchema, faqSchema, speakableSchema, canonical, CLINIC_ID } from '../lib/seo'

export const MYEONGJI_HUB_PATH = '/clinic/myeongji'
/** 허브 본문을 실제로 바꾼 날짜 (사이트맵 lastmod·dateModified·화면 검토일 공용, 고정값) */
export const MYEONGJI_HUB_UPDATED = '2026-10-08'
export const MYEONGJI_HUB_TITLE = '부산 명지 치과 | 더착한치과 — 명지오션시티4로 스타빌딩 6층'
const H1 = '부산 명지 치과, 더착한치과'
const DESC =
  '부산 명지 치과 더착한치과 — 명지오션시티4로 59 스타빌딩 6층 602호. 2015년 명지 개원, 치의학박사·통합치의학과 전문의 황우석 대표원장. 월·수 20시 야간, 토 08~12시 진료, 일요일 휴무. 지하 1·2층 주차 30대. ☎ 051-203-2875'

const ANSWER =
  '부산 명지에서 치과를 찾으신다면, 더착한치과는 명지오션시티4로 59 스타빌딩 6층 602호에 있습니다. 2015년 명지에 문을 연 뒤 치의학박사·통합치의학과 전문의인 황우석 대표원장이 진료하고 있으며, 월·수요일은 저녁 8시까지, 토요일은 오전 8시부터 12시까지 진료합니다(일요일 휴무).'

export const MYEONGJI_HUB_FAQS: { q: string; a: string }[] = [
  { q: '일요일에도 진료하나요?', a: '일요일은 정기휴무입니다. 토요일은 오전 8시부터 12시까지 점심시간 없이 진료하고, 평일 중 월·수요일은 저녁 8시까지 야간진료를 합니다.' },
  { q: '평일 점심시간은 언제인가요?', a: '월요일부터 금요일까지 점심시간은 12시부터 14시까지입니다. 이 시간에는 진료가 쉬므로 방문 시간을 피해 주세요. 토요일은 점심시간 없이 진료합니다.' },
  { q: '스타빌딩 주차장이 꽉 차 있으면 어떻게 하나요?', a: '스타빌딩 지하 1·2층에 30대 주차가 가능합니다. 만차일 때는 주변 유료 주차장에 주차하신 뒤 영수증 사진과 이체받을 계좌를 010-5958-2875로 보내 주시면 주차비를 지원해 드립니다.' },
  { q: '버스로는 어떻게 가나요?', a: '본원 인근으로 일반버스 58-2·168·3·520번, 좌석버스 58-1번(심야 포함), 급행 1009번, 마을버스 강서구17·20·9-2·21번이 다닙니다. 출발지에 맞는 노선은 오시는 길 페이지에서 확인하실 수 있습니다.' },
  { q: '누가 진료하나요?', a: '황우석 대표원장이 진료합니다. 부산대학교 치의학박사(구강생화학교실), 보건복지부 인증 통합치의학과 전문의이며 부산대학교 치과대학 외래교수를 지냈습니다.' },
  { q: '예약은 어떻게 하나요?', a: '전화(051-203-2875), 네이버 예약, 카카오톡 채널, 홈페이지 진료 예약 중 편한 방법을 이용하시면 됩니다. 첫 방문이라면 불편한 부위나 원하는 진료를 미리 알려 주시면 검사 준비에 도움이 됩니다.' },
]

const BUS = CLINIC.directions.bus
const TX_NOTE: Record<string, string> = {
  implant: '3D CT·구강 스캔으로 위치를 설계하는 디지털 가이드 임플란트',
  'clear-aligner': '탈착식 투명 장치로 하는 교정',
  minish: '치아를 덜 다듬고 시작하는 최소삭제 라미네이트',
  integrated: '통합치의학과 전문의가 입안 전체를 함께 진단',
  conservative: '충치·신경치료로 자연 치아 보존',
  prosthodontics: '크라운·브릿지·틀니',
  orthodontics: '브라켓 교정 등 치아교정 전반',
  periodontics: '잇몸 출혈·치주염 관리와 치료',
  'oral-surgery': '사랑니 발치 등 외과 처치',
  preventive: '스케일링·불소·정기 검진',
  imaging: '3D CT 등 디지털 영상 진단',
  'oral-medicine': '턱관절·구강 점막 질환',
}
const NEARBY = [
  { slug: 'gukje-newtown', name: '명지국제신도시' },
  { slug: 'gangseo', name: '강서구' },
  { slug: 'sinho', name: '신호' },
  { slug: 'noksan', name: '녹산' },
]

export const MyeongjiHubPage: FC = () => {
  const url = canonical(MYEONGJI_HUB_PATH)
  const crumbs = [{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: '부산 명지 치과', path: MYEONGJI_HUB_PATH }]
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': ['WebPage', 'MedicalWebPage'],
      '@id': `${url}#webpage`,
      url,
      name: MYEONGJI_HUB_TITLE,
      headline: H1,
      description: DESC,
      inLanguage: 'ko-KR',
      isPartOf: { '@id': `https://${CLINIC.domain}/#website` },
      about: { '@id': CLINIC_ID },
      mainEntity: { '@id': CLINIC_ID },
      areaServed: [
        { '@type': 'Place', name: '부산광역시 강서구 명지동' },
        { '@type': 'Place', name: '명지오션시티' },
        { '@type': 'Place', name: '명지국제신도시' },
      ],
      reviewedBy: { '@type': 'Person', '@id': `https://${CLINIC.domain}/doctors/hwang-wooseok/#person`, name: CLINIC.director },
      lastReviewed: MYEONGJI_HUB_UPDATED,
      dateModified: MYEONGJI_HUB_UPDATED,
    },
    breadcrumbSchema(crumbs),
    faqSchema(MYEONGJI_HUB_FAQS),
    speakableSchema(['h1', '.aeo-answer']),
  ]
  return (
    <Layout title={MYEONGJI_HUB_TITLE} description={DESC} path={MYEONGJI_HUB_PATH}
      keywords={['부산 명지 치과', '명지 치과', '명지오션시티 치과', '명지동 치과', '강서구 명지 치과', '명지 일요일 치과', '명지 야간진료 치과']}
      schemas={schemas}>
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-location-dot"></i> 부산광역시 강서구 명지동 · 명지오션시티</div>
          <h1>{H1}</h1>
          <p>명지오션시티4로 스타빌딩 6층 — 2015년부터 명지에서 진료하고 있습니다.</p>
        </div>
      </section>
      <Breadcrumb items={crumbs} />

      <section class="sec">
        <div class="container article-body">
          <p class="aeo-answer"><strong class="aeo-tldr">한줄답:</strong> {ANSWER}</p>
          <p style="color:var(--ink-soft);font-size:14px">감수 {CLINIC.director} {CLINIC.directorTitle} · 최종 검토 {MYEONGJI_HUB_UPDATED}</p>

          <h2>명지오션시티 어디에 있나요?</h2>
          <p>주소는 <strong>{CLINIC.address}</strong>(명지동)입니다. 명지오션시티 생활권 안에 있어 명지시장, 강서 기적의 도서관 쪽에서도 가깝고, 명지국제신도시에서는 차로 오시기 편합니다.</p>
          <dl class="hub-spec">
            <dt>자가용</dt><dd>{CLINIC.directions.parkingTitle}. 만차일 때는 주변 유료 주차장 이용 후 영수증 사진과 계좌를 {CLINIC.directions.parkingSupportPhone}로 보내 주시면 주차비를 지원합니다.</dd>
            <dt>일반버스</dt><dd>{BUS.general.join(' · ')}</dd>
            <dt>좌석·급행</dt><dd>{[...BUS.seat, ...BUS.express].join(' · ')}</dd>
            <dt>마을버스</dt><dd>{BUS.village.join(' · ')}</dd>
            <dt>상세 안내</dt><dd><a href="/directions">오시는 길 · 진료시간 자세히 보기</a></dd>
          </dl>

          <h2>진료시간은 어떻게 되나요?</h2>
          <table class="hub-hours">
            <thead><tr><th>요일</th><th>진료</th><th>점심</th></tr></thead>
            <tbody>
              {CLINIC.hours.map((h) => (
                <tr><td>{h.day}</td><td>{h.time}{h.note && !h.closed ? ` (${h.note})` : ''}</td><td>{h.lunch || '—'}</td></tr>
              ))}
            </tbody>
          </table>
          <p>월·수요일은 저녁 8시까지 진료해 퇴근 뒤 방문이 가능하고, 토요일은 아침 8시에 시작하므로 주말 오전 일찍 진료를 마칠 수 있습니다. 일요일은 정기휴무입니다.</p>

          <h2>어떤 의료진이 진료하나요?</h2>
          <p><a href="/doctors/hwang-wooseok"><strong>{CLINIC.director} 대표원장</strong></a>은 2002년 치과의사가 되었고 2015년 명지에 더착한치과의원을 열었습니다. 부산대학교에서 치의학박사 학위(구강생화학교실)를 받았고, 보건복지부 인증 통합치의학과 전문의이며, 부산대학교 치과대학 외래교수를 지냈습니다. 통합치의학과는 한 진료 과목에 치우치지 않고 입안 전체를 함께 보고 치료 순서를 정하는 분야로, 임플란트·보철·보존 치료가 얽힌 경우에 계획을 한 번에 세우는 데 강점이 있습니다.</p>

          <h2>명지 본원에서 받을 수 있는 진료</h2>
          <ul class="hub-tx">
            {TREATMENTS.map((t) => (
              <li><a href={`/treatments/${t.slug}`}><strong>{t.shortName}</strong></a>{TX_NOTE[t.slug] ? ` — ${TX_NOTE[t.slug]}` : ''}</li>
            ))}
          </ul>
          <p>명지 기준 진료별 안내: <a href="/area/myeongji-implant">명지 임플란트</a> · <a href="/area/myeongji-clear-aligner">명지 투명교정</a> · <a href="/area/myeongji-minish">명지 스타일네이트</a> · <a href="/area/myeongji-orthodontics">명지 치아교정</a></p>

          <h2>처음 방문하면 어떻게 진행되나요?</h2>
          <ol class="hub-steps">
            <li id="step-1"><strong>예약</strong> — 전화·네이버 예약·카카오톡·홈페이지 중 편한 방법으로 시간을 정합니다.</li>
            <li id="step-2"><strong>내원</strong> — 스타빌딩 지하 주차장에 주차한 뒤 6층 602호로 올라오세요.</li>
            <li id="step-3"><strong>문진·검사</strong> — 불편한 곳을 듣고, 필요하면 3D CT와 구강 스캔으로 상태를 확인합니다.</li>
            <li id="step-4"><strong>설명</strong> — 영상을 함께 보며 지금 꼭 필요한 치료와 미뤄도 되는 치료를 나누어 안내합니다.</li>
            <li id="step-5"><strong>치료·관리</strong> — 동의한 계획대로 진행하고 다음 점검 일정을 잡습니다.</li>
          </ol>

          <div class="related-box">
            <h3><i class="fa-solid fa-map-location-dot" style="color:var(--brand);margin-right:8px"></i>명지 인근 지역 안내</h3>
            <div class="chip-row">
              {NEARBY.map((n) => <a href={`/clinic/${n.slug}`} class="chip"><i class="fa-solid fa-hospital"></i> {n.name} 치과</a>)}
            </div>
          </div>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 40px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title" style="font-size:30px">부산 명지 치과 자주 묻는 질문</h2>
          </div>
          <FaqList faqs={MYEONGJI_HUB_FAQS} />
        </div>
      </section>

      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>명지오션시티 더착한치과 예약·문의</h2>
            <p>{CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
              <a href={CLINIC.sns.naverBooking} target="_blank" rel="noopener" class="btn btn-ghost">네이버 예약</a>
              <a href={CLINIC.sns.kakao} target="_blank" rel="noopener" class="btn btn-ghost">카카오톡</a>
            </div>
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
.hub-spec{display:grid;grid-template-columns:max-content 1fr;gap:8px 16px;margin:16px 0 28px}
.hub-spec dt{font-weight:700}.hub-spec dd{margin:0}
.hub-hours{width:100%;border-collapse:collapse;margin:8px 0 16px}
.hub-hours th,.hub-hours td{border-bottom:1px solid rgba(22,38,58,.12);padding:10px 8px;text-align:left}
.hub-tx{padding-left:1.2em;display:grid;gap:8px;line-height:1.7}
.hub-steps{padding-left:1.4em;display:grid;gap:8px;line-height:1.7}
@media (max-width:640px){.hub-spec{grid-template-columns:1fr}}
` }} />
    </Layout>
  )
}
