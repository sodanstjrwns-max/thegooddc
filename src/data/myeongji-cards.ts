// ============================================================
// 명지 진료 하위 페이지 6장 사진 카드 (2026-10-14 하위 페이지 카드 3b단계)
// - /area/myeongji-* 핵심 6개(임플란트·투명교정·스타일네이트·치아교정 + 신설 충치치료·잇몸치료)
// - 페이지마다 고유 대표 사진 1장을 네 곳에 같이 쓴다:
//   og:image(1200×630 jpg) · 본문 첫 <img>(같은 크롭의 1200×630 webp) · 스키마 image · 사이트맵 image:image
//   카드 썸네일은 같은 원본의 600×600 정사각 크롭(webp).
// - 사진 출처: implant·clear-aligner = 원내 실사(doctor-surgery-wide·doctor-consult),
//   나머지 4장 = AI 생성(GPT Image 2.5, 원본 tools/subpage-cards/gen/thegooddc/) — 결과·전후 암시 없음.
// - 카드 한 줄 설명은 진료 데이터(src/data/treatments.ts)의 기존 tagline 을 그대로 쓴다.
// ============================================================
import { getTreatment } from './treatments'

export const MYEONGJI_CARDS_UPDATED = '2026-10-14'
const BASE = 'https://thegooddc.kr'

export type MyeongjiCard = {
  key: string // = 진료 slug
  name: string // 카드·ItemList 이름 = "명지 {진료}"
  tag: string
  title: string // 하위 페이지 <title>
  alt: string // 대표 사진 alt (페이지 주제)
  line: string // 카드 한 줄 (진료 데이터 tagline)
  url: string
  og: string // 1200×630 jpg
  body: string // 1200×630 webp (본문 첫 이미지)
  thumb: string // 600×600 webp
}

const RAW: { key: string; short: string; tag: string; title: string; alt: string }[] = [
  { key: 'implant', short: '임플란트', tag: 'IMPLANT', title: '명지 임플란트 | 3D CT로 위치부터 설계하는 가이드 식립 — 더착한치과', alt: '명지 임플란트 — 대표원장이 스태프와 함께 임플란트 수술을 진행하는 모습' },
  { key: 'clear-aligner', short: '투명교정', tag: 'CLEAR ALIGNER', title: '명지 투명교정 | 구강 스캔으로 시작하는 탈착식 교정 — 더착한치과', alt: '명지 투명교정 — 대표원장이 디지털 영상으로 진단 계획을 살펴보는 모습' },
  { key: 'minish', short: '스타일네이트', tag: 'MINIMAL PREP', title: '명지 스타일네이트 | 덜 깎는 라미네이트가 맞는 경우 — 더착한치과', alt: '명지 스타일네이트 — 얇은 세라믹 라미네이트 시편과 셰이드 가이드' },
  { key: 'orthodontics', short: '치아교정', tag: 'ORTHODONTICS', title: '명지 치아교정 | 브라켓 교정 시작 전 확인할 것 — 더착한치과', alt: '명지 치아교정 — 브라켓과 와이어가 장착된 치아 교정 모형' },
  { key: 'conservative', short: '충치치료', tag: 'CAVITY CARE', title: '명지 충치치료 | 레진·인레이·신경치료 고르는 기준 — 더착한치과', alt: '명지 충치치료 — 러버댐과 기구를 준비한 보존 치료 진료실' },
  { key: 'periodontics', short: '잇몸치료', tag: 'GUM CARE', title: '명지 잇몸치료 | 잇몸 출혈, 스케일링으로 충분할까 — 더착한치과', alt: '명지 잇몸치료 — 스케일링 기구와 치간칫솔을 준비하는 진료실' },
]

export const MYEONGJI_CARDS: MyeongjiCard[] = RAW.map((r) => ({
  key: r.key,
  name: `명지 ${r.short}`,
  tag: r.tag,
  title: r.title,
  alt: r.alt,
  line: getTreatment(r.key)?.tagline || '',
  url: `/area/myeongji-${r.key}`,
  og: `/images/cards/myeongji-${r.key}-1200x630.jpg`,
  body: `/images/cards/myeongji-${r.key}-1200.webp`,
  thumb: `/images/cards/myeongji-${r.key}-600.webp`,
}))

/** 신설 하위 페이지(진료 템플릿이 아닌 고유 본문) */
export const MYEONGJI_EXTRA_KEYS = ['conservative', 'periodontics']

export function getMyeongjiCard(key: string): MyeongjiCard | undefined {
  return MYEONGJI_CARDS.find((c) => c.key === key)
}

export const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${BASE}${p}`)

/** 화면 카드와 1:1 ItemList (같은 순서·이름·URL·사진) */
export function myeongjiItemListSchema(pagePath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${abs(pagePath === '/' ? '' : pagePath)}#myeongji-cards`,
    name: '명지 진료 안내',
    numberOfItems: MYEONGJI_CARDS.length,
    itemListElement: MYEONGJI_CARDS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: abs(c.url),
      image: abs(c.thumb),
    })),
  }
}

/** 하위 페이지 MedicalWebPage (image·primaryImageOfPage = og 와 같은 사진) */
export function myeongjiPageSchema(card: MyeongjiCard, description: string) {
  const url = abs(card.url)
  return {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'MedicalWebPage'],
    '@id': `${url}#webpage`,
    url,
    name: card.title,
    headline: card.name,
    description,
    inLanguage: 'ko-KR',
    image: abs(card.og),
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(card.og), width: 1200, height: 630, caption: card.alt },
    isPartOf: { '@id': `${BASE}/#website` },
    about: { '@id': `${BASE}/treatments/${card.key}/#procedure` },
    publisher: { '@id': `${BASE}/#medicalclinic` },
    dateModified: MYEONGJI_CARDS_UPDATED,
  }
}
