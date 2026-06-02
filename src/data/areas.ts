// ============================================================
// 지역 SEO 데이터 (§G-3)
// Q6 주소(부산 강서구 명지) 기반 인근 유입 지역 × 핵심 진료 조합
// ============================================================

export interface Area {
  slug: string
  name: string // 표시명
  fullName: string // 행정 전체명 (City 스키마)
  desc: string // 지역 특성 한 줄
}

// 강서구 명지오션시티 인근 + 서부산 유입 지역
export const AREAS: Area[] = [
  { slug: 'myeongji', name: '명지', fullName: '부산광역시 강서구 명지동', desc: '명지오션시티·명지국제신도시 인근' },
  { slug: 'gangseo', name: '강서구', fullName: '부산광역시 강서구', desc: '서부산 강서구 전역' },
  { slug: 'sinho', name: '신호', fullName: '부산광역시 강서구 신호동', desc: '신호지구 인근' },
  { slug: 'noksan', name: '녹산', fullName: '부산광역시 강서구 녹산동', desc: '녹산산업단지 인근' },
  { slug: 'jangyu', name: '장유', fullName: '경상남도 김해시 장유', desc: '김해 장유 신도시 인근' },
  { slug: 'hwajeon', name: '화전', fullName: '부산광역시 강서구 화전동', desc: '화전지구 인근' },
  { slug: 'dadae', name: '다대포', fullName: '부산광역시 사하구 다대동', desc: '사하구 다대포 인근' },
  { slug: 'hadan', name: '하단', fullName: '부산광역시 사하구 하단동', desc: '사하구 하단 인근' },
]

// 지역 SEO 페이지를 생성할 핵심 진료
export const AREA_TREATMENTS = [
  { slug: 'implant', name: '임플란트' },
  { slug: 'clear-aligner', name: '투명교정' },
  { slug: 'minish', name: '미니쉬' },
]

// 모든 지역×진료 조합 생성
export function getAreaCombinations() {
  const combos: { area: Area; treatment: { slug: string; name: string }; url: string }[] = []
  for (const area of AREAS) {
    for (const t of AREA_TREATMENTS) {
      combos.push({
        area,
        treatment: t,
        url: `/area/${area.slug}-${t.slug}`,
      })
    }
  }
  return combos
}

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}
