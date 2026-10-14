// ============================================================
// 명지 진료 하위 페이지 신설 2장 — /area/myeongji-conservative(명지 충치치료), /area/myeongji-periodontics(명지 잇몸치료)
// (2026-10-14 하위 페이지 카드 3b단계: 명지 핵심 4장 → 6장)
// - 다른 지역×진료 템플릿(AreaPage) 대신 명지 본원 기준 고유 본문.
// - 사실 출처: src/data/clinic.ts(주소·주차·버스·진료시간), src/data/treatments.ts(보존·치주 진료 내용·장비),
//   src/data/areas.ts(명지 생활권), src/routes/myeongji-hub.tsx(진료 진행 방식). 새 사실을 지어내지 않는다.
// - FAQ 는 진료 페이지(/treatments/conservative·periodontics) FAQ 와 겹치지 않는 질문만. 화면 FAQ = FAQPage 스키마(1:1).
// ============================================================
import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb, FaqList } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { breadcrumbSchema, faqSchema, speakableSchema } from '../lib/seo'
import { HubLink } from '../lib/hub-link'
import { getMyeongjiCard, myeongjiPageSchema, MYEONGJI_CARDS, MYEONGJI_CARDS_UPDATED } from '../data/myeongji-cards'
import { MyeongjiLeadFigure } from '../components/MyeongjiCards'

type Sec = { h: string; p?: string[]; list?: { t: string; d: string }[]; ol?: string[] }
type Extra = {
  key: string
  heroLead: string
  description: string
  answer: string
  sections: Sec[]
  faqs: { q: string; a: string }[]
  related: { href: string; label: string }[]
}

const BUS = CLINIC.directions.bus
const BUS_LINE = [...BUS.general, ...BUS.seat, ...BUS.express].join('·')

const EXTRA: Record<string, Extra> = {
  conservative: {
    key: 'conservative',
    heroLead: '명지오션시티 스타빌딩 6층 — 충치 범위를 먼저 확인하고, 자연 치아를 살리는 방향으로 치료 방법을 나눕니다.',
    description:
      '명지 충치치료 — 더착한치과(명지오션시티4로 59 스타빌딩 6층). 충치 깊이에 따라 레진·인레이·신경치료를 나누는 기준, 러버댐·플라젠 신경치료기를 쓰는 신경치료, 월·수 20시 야간·토요일 오전 내원 동선을 안내합니다.',
    answer:
      '명지에서 충치치료를 알아보신다면 먼저 충치가 어디까지 진행됐는지를 확인하는 것이 순서입니다. 더착한치과는 명지오션시티4로 59 스타빌딩 6층 602호에 있으며, 충치 범위에 따라 레진·인레이·신경치료 가운데 필요한 방법을 나누어 안내합니다. 신경치료가 필요한 경우에는 러버댐으로 치료 부위를 격리하고 플라젠 신경치료기를 활용합니다.',
    sections: [
      {
        h: '명지 생활권에서 충치치료가 늦어지는 이유는 무엇일까요?',
        p: [
          '명지동은 명지오션시티와 명지국제신도시를 중심으로 신혼부부와 영유아 가정이 많은 신도시 생활권입니다. 아이 일정과 출퇴근을 함께 챙기다 보면 본인 치아는 "아직 아프지 않으니까" 하고 미루기 쉽습니다. 그런데 충치는 초기에 증상이 거의 없어, 시리거나 씹을 때 불편함이 느껴질 무렵에는 이미 상아질 이상으로 진행된 경우가 적지 않습니다.',
          '같은 충치라도 발견 시점이 빠를수록 치료가 간단하고 깎아 내는 양도 줄어듭니다. 그래서 명지 본원에서는 통증이 없더라도 정기 검진으로 초기 충치를 찾는 것을 먼저 권합니다. 평일 중 월·수요일은 저녁 8시까지, 토요일은 오전 8시부터 12시까지 진료하므로 퇴근 뒤나 주말 오전을 활용할 수 있습니다.',
        ],
      },
      {
        h: '레진·인레이·신경치료, 어떤 기준으로 나누나요?',
        p: ['치료 방법은 "어떤 재료가 좋은가"보다 충치가 얼마나 깊고 넓은지에 따라 정해집니다. 검사에서 확인한 범위를 기준으로 아래처럼 나누어 설명드립니다.'],
        list: [
          { t: '레진 충전', d: '법랑질이나 얕은 상아질에 머문 작은 충치. 충치를 제거한 자리를 치아색 재료로 채워 대체로 한 번의 내원으로 마무리합니다. 치아 삭제량이 가장 적습니다.' },
          { t: '인레이·온레이', d: '레진으로 채우기에는 범위가 넓은 중간 크기 충치. 본을 떠 제작한 수복물을 붙이므로 대체로 두 번 내원합니다.' },
          { t: '신경치료 후 크라운', d: '충치가 신경까지 침범한 경우. 감염된 신경 조직을 제거하고 뿌리 안을 소독·밀봉한 뒤, 약해진 치아(특히 어금니)는 크라운으로 보호하는 것이 일반적으로 권장됩니다.' },
          { t: '치아 균열 확인', d: '충치가 뚜렷하지 않은데 씹을 때 찌릿하거나 시리다면 금이 간 치아일 수 있어, 균열 여부를 함께 검사합니다.' },
        ],
      },
      {
        h: '신경치료가 필요하면 무엇이 달라지나요?',
        p: [
          '신경치료는 뿌리 안의 좁은 관을 깨끗하게 소독하는 정밀한 처치라 치료 환경이 결과에 영향을 줍니다. 더착한치과는 러버댐으로 치료 부위를 침과 세균으로부터 격리하고, 플라젠 신경치료기를 활용해 신경관 내부를 처치합니다.',
          '염증 정도에 따라 소독 횟수가 달라 여러 번 내원하게 되는 경우가 많으므로, 첫 진료 때 예상 일정을 함께 정합니다. 신경치료를 마친 치아는 수분 공급이 줄어 깨지기 쉬워지기 때문에, 치료가 끝난 뒤 크라운으로 덮을지까지 한 번에 계획하는 것이 좋습니다.',
        ],
      },
      {
        h: '명지 본원에서는 이런 순서로 진행합니다',
        ol: [
          '검사 — 불편한 부위를 듣고 임상 검사와 방사선 촬영으로 충치 범위와 신경 침범 여부를 확인합니다.',
          '설명 — 영상을 함께 보며 지금 꼭 필요한 치료와 지켜봐도 되는 부위를 나누어 안내합니다.',
          '치료 — 국소 마취 후 충치를 제거하고, 범위에 맞는 방법(레진·인레이·신경치료)으로 수복합니다.',
          '교합 확인 — 무는 높이와 맞물림을 조정해 자연스럽게 씹히도록 다듬습니다.',
          '점검 — 때운 경계 부위에 다시 생기는 충치를 일찍 찾도록 다음 검진 시기를 잡습니다.',
        ],
      },
      {
        h: '명지오션시티에서 오시는 길과 진료시간',
        p: [
          `본원은 ${CLINIC.address}에 있습니다. 명지시장·강서 기적의 도서관 쪽에서 가깝고, 명지국제신도시에서는 차로 오시기 편합니다. 스타빌딩 지하 1·2층에 30대 주차가 가능하며, 만차일 때는 주변 유료 주차장 이용 후 영수증을 보내 주시면 주차비를 지원해 드립니다.`,
          `버스는 ${BUS_LINE}번과 마을버스 ${BUS.village.join('·')}번이 본원 인근을 지납니다. 평일 점심시간(12:00~14:00)에는 진료가 쉬므로, 직장인이라면 월·수 저녁이나 토요일 오전 시간대를 예약하시는 편이 여러 번 내원해야 하는 치료 일정을 맞추기 수월합니다.`,
        ],
      },
    ],
    faqs: [
      { q: '명지에서 퇴근 후에 충치치료를 받을 수 있나요?', a: '월요일과 수요일은 저녁 8시까지 진료합니다. 평일 점심시간(12:00~14:00)에는 진료가 쉬고, 토요일은 오전 8시부터 12시까지 점심시간 없이 진료합니다. 일요일은 정기휴무입니다.' },
      { q: '신경치료 일정을 토요일 위주로 잡을 수 있나요?', a: '토요일 오전 진료 시간을 이용해 일정을 잡을 수 있습니다. 다만 소독 횟수는 염증 정도에 따라 달라지므로, 첫 진료에서 상태를 확인한 뒤 예상 내원 횟수와 간격을 함께 정합니다.' },
      { q: '예전에 때운 자리가 변색됐는데 다시 치료해야 하나요?', a: '변색만으로는 판단하기 어렵습니다. 때운 경계 부위에 충치가 새로 생겼는지, 수복물이 들떴는지를 검사로 확인한 뒤 다시 치료할지, 지켜볼지를 안내해 드립니다.' },
      { q: '충치치료 전에는 어떤 검사를 하나요?', a: '눈으로 보는 임상 검사와 방사선 촬영으로 충치 범위와 신경 침범 여부를 확인합니다. 씹을 때 찌릿한 통증이 있으면 치아 균열 여부도 함께 살펴봅니다.' },
    ],
    related: [
      { href: '/treatments/conservative', label: '충치치료(치과보존과) 자세히' },
      { href: '/treatments/prosthodontics', label: '크라운·보철치료' },
      { href: '/treatments/preventive', label: '예방·정기검진' },
    ],
  },
  periodontics: {
    key: 'periodontics',
    heroLead: '명지오션시티 스타빌딩 6층 — 잇몸 염증이 어디까지 진행됐는지 검사로 나눈 뒤, 단계에 맞춰 치료합니다.',
    description:
      '명지 잇몸치료 — 더착한치과(명지오션시티4로 59 스타빌딩 6층). 잇몸 출혈이 스케일링으로 충분한지 치근활택술·치주 수술까지 필요한지 나누는 기준, 당뇨·흡연과 잇몸, 월·수 20시 야간·토요일 오전 내원 안내.',
    answer:
      '명지에서 잇몸 출혈이나 붓기 때문에 치과를 찾으신다면, 먼저 염증이 잇몸에만 있는지(치은염) 치아를 받치는 뼈까지 진행됐는지(치주염)를 검사로 나누어야 합니다. 더착한치과는 명지오션시티4로 59 스타빌딩 6층 602호에서 잇몸 검사와 방사선 촬영으로 단계를 확인한 뒤 스케일링, 치근활택술, 필요한 경우 치주 수술 검토 순서로 안내합니다.',
    sections: [
      {
        h: '잇몸 출혈, 스케일링으로 충분한 경우와 아닌 경우',
        p: [
          '칫솔질할 때 피가 나거나 잇몸이 붓는다면 잇몸 질환의 신호일 수 있습니다. 염증이 잇몸에만 머문 치은염 단계라면 스케일링과 올바른 칫솔질로 회복을 기대할 수 있습니다. 하지만 치아를 지지하는 뼈까지 녹기 시작한 치주염 단계라면 잇몸 위 치석만 떼어 내는 것으로는 부족하고, 잇몸 속 뿌리 표면까지 정리하는 치료가 필요합니다.',
          '두 단계는 겉으로 보이는 증상만으로는 구분하기 어렵습니다. 그래서 치주낭(잇몸 주머니) 깊이와 출혈 여부를 재고, 방사선 사진으로 잇몸뼈 상태를 함께 확인한 뒤 치료 범위를 정합니다. 한 번 소실된 잇몸뼈는 자연적으로 회복되기 어려워, 초기에 단계를 정확히 나누는 것이 치아를 오래 쓰는 데 중요합니다.',
        ],
      },
      {
        h: '진행 단계별 잇몸치료 선택 기준',
        list: [
          { t: '잇몸 출혈·붓기만 있는 초기', d: '스케일링으로 치석과 세균막을 제거하고, 잇몸과 치아 경계를 닦는 칫솔질과 치간칫솔·치실 사용법을 함께 안내합니다.' },
          { t: '치주낭이 깊어진 치주염', d: '잇몸 깊은 곳의 치석과 염증 조직을 제거하고 뿌리 표면을 매끈하게 정리하는 치근활택술을 진행합니다.' },
          { t: '비수술 치료로 낫지 않는 깊은 치주낭', d: '잇몸을 열어 직접 처치하는 치주 수술을 검토하며, 필요하면 뼈 재생술을 병행할 수 있는지 함께 살펴봅니다.' },
          { t: '잇몸이 내려앉은 경우', d: '퇴축된 잇몸 라인을 확인하고 잇몸 이식·성형이 필요한지 검토합니다.' },
        ],
      },
      {
        h: '바쁜 생활권일수록 잇몸 관리가 미뤄지기 쉽습니다',
        p: [
          '잇몸병은 통증이 늦게 나타나는 편이라, 아이를 키우는 젊은 가족이 많은 명지오션시티·명지국제신도시 생활권이나 신호·녹산 산업단지로 출퇴근하는 직장인에게는 우선순위에서 밀리기 쉽습니다. 치아가 흔들리거나 치아 사이가 벌어지는 느낌이 들 때는 이미 상당히 진행된 경우가 많습니다.',
          '당뇨가 있으면 잇몸 염증이 악화되기 쉽고, 치주염은 혈당 조절을 어렵게 할 수 있어 두 가지를 함께 관리해야 합니다. 흡연도 잇몸 혈류를 줄여 치주염 진행을 앞당기는 것으로 알려져 있습니다. 해당된다면 진료 전에 미리 알려 주세요.',
        ],
      },
      {
        h: '잇몸치료가 임플란트·보철 계획과 연결되는 이유',
        p: [
          '잇몸과 잇몸뼈 상태는 임플란트를 심을 수 있는지, 브릿지나 크라운을 어디에 걸 수 있는지에도 영향을 줍니다. 더착한치과는 통합치의학과 전문의가 입안 전체를 함께 보고 치료 순서를 정하기 때문에, 잇몸 염증을 먼저 가라앉힌 뒤 보철·임플란트 계획을 이어 가는 식으로 순서를 나누어 안내합니다.',
          '치료가 끝난 뒤에도 정기 검진과 스케일링으로 재발을 막는 것이 핵심입니다. 일반적으로 6개월~1년 간격의 스케일링이 권장되며, 치주염을 앓은 적이 있거나 치석이 빨리 생기는 분은 잇몸 상태에 따라 더 짧은 주기를 안내해 드립니다.',
        ],
      },
      {
        h: '명지 본원 내원 안내',
        p: [
          `주소는 ${CLINIC.address}이며 스타빌딩 지하 1·2층에 30대 주차가 가능합니다. 버스는 ${BUS_LINE}번, 마을버스 ${BUS.village.join('·')}번을 이용하실 수 있습니다.`,
          '잇몸치료는 부위를 나누어 여러 번 진행하는 경우가 있어, 월·수 저녁 8시까지의 야간 진료와 토요일 오전(08:00~12:00) 진료를 활용하면 일정을 맞추기 수월합니다. 평일 점심시간(12:00~14:00)과 일요일은 진료하지 않습니다.',
        ],
      },
    ],
    faqs: [
      { q: '잇몸치료는 몇 번에 나눠서 받나요?', a: '진행 정도에 따라 다릅니다. 초기라면 스케일링과 관리 교육으로 마무리되기도 하고, 치근활택술이 필요한 경우에는 부위를 나누어 여러 번 진행하기도 합니다. 검사 후 예상 단계와 기간을 안내해 드립니다.' },
      { q: '당뇨가 있는데 잇몸치료를 받아도 되나요?', a: '당뇨와 잇몸 염증은 서로 영향을 주고받아 오히려 함께 관리하는 것이 중요합니다. 진료 전에 당뇨 여부와 복용 중인 약을 알려 주시면 상태에 맞춰 치료 계획을 세웁니다.' },
      { q: '퇴근 후나 토요일에 잇몸 검사를 받을 수 있나요?', a: '월요일과 수요일은 저녁 8시까지, 토요일은 오전 8시부터 12시까지 진료합니다. 평일 점심시간(12:00~14:00)과 일요일에는 진료하지 않습니다.' },
      { q: '잇몸치료 뒤 이가 시린 건 괜찮은가요?', a: '스케일링·치주 치료 후 일시적으로 이가 시리거나 잇몸이 예민할 수 있으며 대부분 점차 안정되는 경향입니다. 불편이 계속되면 내원해 확인받으시길 권합니다. 회복 양상에는 개인차가 있습니다.' },
    ],
    related: [
      { href: '/treatments/periodontics', label: '잇몸치료(치주과) 자세히' },
      { href: '/treatments/preventive', label: '스케일링·예방 진료' },
      { href: '/treatments/implant', label: '임플란트 진료 안내' },
    ],
  },
}

export function isMyeongjiExtra(key: string) {
  return key in EXTRA
}

export const MyeongjiExtraPage: FC<{ txKey: string }> = ({ txKey }) => {
  const x = EXTRA[txKey]
  const card = getMyeongjiCard(txKey)!
  const path = card.url
  const crumbs = [{ name: '홈', path: '/' }, { name: '진료안내', path: '/treatments' }, { name: card.name, path }]
  const siblings = MYEONGJI_CARDS.filter((c) => c.key !== txKey)
  return (
    <Layout
      title={card.title}
      description={x.description}
      path={path}
      ogImage={card.og}
      ogImageAlt={card.alt}
      keywords={[card.name, `명지 ${card.name.replace('명지 ', '')} 치과`, '명지 치과', '명지오션시티 치과', '강서구 명지 치과']}
      schemas={[
        myeongjiPageSchema(card, x.description),
        breadcrumbSchema(crumbs),
        faqSchema(x.faqs),
        speakableSchema(['h1', '.aeo-answer']),
      ]}
    >
      <section class="page-hero">
        <div class="container ph-inner">
          <div class="hero-badge"><i class="fa-solid fa-location-dot"></i> 부산광역시 강서구 명지동 · 명지오션시티</div>
          <h1>{card.name}</h1>
          <p>{x.heroLead}</p>
        </div>
      </section>
      <Breadcrumb items={crumbs} />

      <section class="sec">
        <div class="container article-body">
          <MyeongjiLeadFigure src={card.body} alt={card.alt} />
          <p class="hub-local-line" style="margin:0 0 20px;color:var(--ink-soft);line-height:1.75"><i class="fa-solid fa-location-dot" style="color:var(--brand);margin-right:6px"></i>본원 위치·진료시간·주차 안내: <HubLink /> ({CLINIC.name}, 명지오션시티 스타빌딩 6층)</p>
          <p class="aeo-answer"><strong class="aeo-tldr">한줄답:</strong> {x.answer}</p>
          <p style="color:var(--ink-soft);font-size:14px">일반 안내 정보입니다(기준일 {MYEONGJI_CARDS_UPDATED}). 치료 방법과 횟수는 검사 후 원장이 직접 판단해 안내하며, 개인차가 있습니다.</p>

          {x.sections.map((s) => (
            <>
              <h2>{s.h}</h2>
              {s.p?.map((t) => <p>{t}</p>)}
              {s.list && (
                <dl class="mjx-dl">
                  {s.list.map((li) => (<><dt>{li.t}</dt><dd>{li.d}</dd></>))}
                </dl>
              )}
              {s.ol && <ol class="mjx-ol">{s.ol.map((li) => <li>{li}</li>)}</ol>}
            </>
          ))}

          <div class="related-box">
            <h3><i class="fa-solid fa-book-medical" style="color:var(--brand);margin-right:8px"></i>{card.name.replace('명지 ', '')} 진료 자세히</h3>
            <div class="chip-row">
              {x.related.map((r) => <a href={r.href} class="chip"><i class="fa-solid fa-tooth"></i> {r.label}</a>)}
              <a href={`tel:${CLINIC.phoneRaw}`} class="chip"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>

          <div class="related-box">
            <h3><i class="fa-solid fa-layer-group" style="color:var(--brand);margin-right:8px"></i>명지에서 받을 수 있는 다른 진료</h3>
            <div class="chip-row">
              {siblings.map((c) => <a href={c.url} class="chip"><i class="fa-solid fa-tooth"></i> {c.name}</a>)}
            </div>
          </div>
        </div>
      </section>

      <section class="sec bg-sand">
        <div class="container">
          <div class="reveal" style="text-align:center;max-width:640px;margin:0 auto 40px">
            <div class="eyebrow" style="justify-content:center">FAQ</div>
            <h2 class="section-title" style="font-size:30px">{card.name} 자주 묻는 질문</h2>
          </div>
          <FaqList faqs={x.faqs} />
        </div>
      </section>

      <section class="sec-sm">
        <div class="container">
          <div class="cta-band reveal">
            <h2>{card.name}, 검사부터 상담하세요</h2>
            <p>{CLINIC.hoursNote}</p>
            <div class="hero-actions">
              <a href="/reservation" class="btn btn-accent"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href={`tel:${CLINIC.phoneRaw}`} class="btn btn-ghost"><i class="fa-solid fa-phone"></i> {CLINIC.phone}</a>
            </div>
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
.mjx-dl{display:grid;grid-template-columns:max-content 1fr;gap:10px 18px;margin:12px 0 28px}
.mjx-dl dt{font-weight:700;color:var(--ink)}.mjx-dl dd{margin:0;line-height:1.75}
.mjx-ol{padding-left:1.4em;display:grid;gap:8px;line-height:1.75;margin:8px 0 24px}
@media (max-width:640px){.mjx-dl{grid-template-columns:1fr;gap:4px}.mjx-dl dd{margin-bottom:10px}}
` }} />
    </Layout>
  )
}
