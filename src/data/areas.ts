// ============================================================
// 지역 SEO 데이터 (§G-3) — 부가티급 지역 SEO 엔진
// Q6 주소(부산 강서구 명지) 기반 인근 유입 지역 × 핵심 진료 조합
// 각 지역에 고유 콘텐츠(랜드마크/교통/거리/특성/FAQ)를 부여해 thin-content 제거
// ============================================================

export interface Area {
  slug: string
  name: string // 표시명
  fullName: string // 행정 전체명 (City 스키마)
  desc: string // 지역 특성 한 줄
  // ── 지역 고유 콘텐츠 (지역 SEO·AEO 강화용) ──
  region?: '부산' | '경남' // 광역 구분
  landmarks?: string[] // 대표 랜드마크 (지역 신뢰 신호)
  transit?: string // 본원까지 교통편 안내
  distance?: string // 본원까지 거리·소요시간
  population?: string // 생활권 특성 (가족/신도시/산업단지 등)
  intro?: string // 지역 소개 문단 (고유 본문, 약 200자)
  localFaq?: { q: string; a: string }[] // 지역 특화 FAQ
}

// 강서구 명지오션시티 인근 + 서부산·동부산 유입 지역 (대폭 확장)
export const AREAS: Area[] = [
  {
    slug: 'myeongji',
    name: '명지',
    fullName: '부산광역시 강서구 명지동',
    desc: '명지오션시티·명지국제신도시 인근',
    region: '부산',
    landmarks: ['명지오션시티', '명지국제신도시', '강서 기적의 도서관', '명지시장'],
    transit: '본원이 위치한 생활권으로 도보·자가용 모두 5분 내외',
    distance: '본원 소재지 (명지오션시티4로)',
    population: '신혼부부·영유아 가정이 많은 신도시 생활권',
    intro:
      '명지동은 명지오션시티와 명지국제신도시를 중심으로 빠르게 성장한 강서구의 대표 신도시입니다. 더착한치과는 바로 이 명지 생활권 한가운데에 자리해, 자녀 진료부터 부모님 임플란트까지 온 가족이 가까이에서 진료받을 수 있습니다.',
    localFaq: [
      { q: '명지에서 더착한치과까지 얼마나 걸리나요?', a: '더착한치과는 명지오션시티4로에 위치해 명지동 어디서든 도보 또는 자가용으로 5분 내외에 도착하실 수 있습니다.' },
      { q: '명지국제신도시에서도 가까운가요?', a: '네, 명지국제신도시 생활권에서 차량으로 5~10분 거리로, 평일 야간(월·수 20:00)과 토요일 오전 진료도 운영합니다.' },
    ],
  },
  {
    slug: 'gukje-newtown',
    name: '명지국제신도시',
    fullName: '부산광역시 강서구 명지국제신도시',
    desc: '국제신도시 생활권 — 실제 검색 빈도 높은 지명',
    region: '부산',
    landmarks: ['명지국제신도시', '이마트 명지점', '명지국제외국인학교', '르노삼성대로'],
    transit: '르노삼성대로 경유 자가용 5~10분, 버스 다수 노선 연결',
    distance: '본원까지 약 2~3km, 차량 5~10분',
    population: '교육 환경을 중시하는 젊은 가족 중심 계획도시',
    intro:
      '명지국제신도시는 잘 정비된 계획도시로 젊은 가족과 학생 인구가 많은 지역입니다. 교정·소아 진료 수요가 높은 만큼, 더착한치과는 투명교정과 정기 구강검진을 통해 자녀의 성장기 구강 건강을 체계적으로 관리합니다.',
    localFaq: [
      { q: '명지국제신도시에서 교정 상담을 받을 수 있나요?', a: '네, 더착한치과는 명지국제신도시 인근에서 투명교정·치아교정 상담을 제공하며, 디지털 스캔으로 정밀하게 진단합니다.' },
    ],
  },
  {
    slug: 'gangseo',
    name: '강서구',
    fullName: '부산광역시 강서구',
    desc: '서부산 강서구 전역',
    region: '부산',
    landmarks: ['강서구청', '부산김해경전철', '에코델타시티', '르노삼성자동차'],
    transit: '강서구 전역에서 자가용·경전철·버스로 접근 용이',
    distance: '강서구 중심지 기준 차량 10~20분',
    population: '신도시·산업단지·전원이 공존하는 서부산 행정 중심',
    intro:
      '강서구는 명지·녹산·대저·가락 등 다양한 생활권을 아우르는 서부산의 행정 중심지입니다. 더착한치과는 강서구 명지에 위치해 구 전역에서 접근이 편리하며, 임플란트·교정·심미치료까지 한 곳에서 통합 진료를 제공합니다.',
    localFaq: [
      { q: '강서구에서 임플란트 잘하는 치과를 찾고 있어요.', a: '더착한치과는 강서구 명지에서 디지털 가이드 임플란트를 진행합니다. 3D CT 정밀 진단 후 개인별 식립 계획을 안내해 드립니다.' },
    ],
  },
  {
    slug: 'sinho',
    name: '신호',
    fullName: '부산광역시 강서구 신호동',
    desc: '신호지구 인근',
    region: '부산',
    landmarks: ['신호산업단지', '신호항', '르노코리아 부산공장'],
    transit: '신호대교·명지 경유 자가용 약 10분',
    distance: '본원까지 약 5km, 차량 약 10분',
    population: '산업단지 근로자·인근 거주 가정',
    intro:
      '신호동은 신호산업단지를 중심으로 한 생활권으로, 명지와 인접해 접근성이 좋습니다. 더착한치과는 평일 야간 진료를 운영해 직장인 환자분도 퇴근 후 편안하게 내원하실 수 있습니다.',
  },
  {
    slug: 'noksan',
    name: '녹산',
    fullName: '부산광역시 강서구 녹산동',
    desc: '녹산국가산업단지 인근',
    region: '부산',
    landmarks: ['녹산국가산업단지', '부산진해경제자유구역', '녹산공단'],
    transit: '명지 방향 자가용 약 10~15분',
    distance: '본원까지 약 6~8km, 차량 약 15분',
    population: '대규모 산업단지 근로자 생활권',
    intro:
      '녹산동은 녹산국가산업단지를 끼고 있어 직장인 인구가 많은 지역입니다. 더착한치과는 산업단지에서 가까운 명지에 위치하며, 야간·토요일 진료로 바쁜 근로자분들의 치과 방문 부담을 덜어드립니다.',
  },
  {
    slug: 'jangyu',
    name: '장유',
    fullName: '경상남도 김해시 장유',
    desc: '김해 장유 신도시 인근',
    region: '경남',
    landmarks: ['장유신도시', '롯데워터파크', '장유율하카페거리', '김해장유농공단지'],
    transit: '남해고속도로·서부산유통지구 경유 자가용 약 15~20분',
    distance: '본원까지 약 10~12km, 차량 약 15~20분',
    population: '김해 최대 신도시 — 젊은 가족 밀집',
    intro:
      '장유는 김해 최대 규모의 신도시로 젊은 가족이 많은 생활권입니다. 부산 명지와 인접해 더착한치과로의 접근이 편리하며, 장유 지역 환자분들이 임플란트·교정 진료를 위해 꾸준히 내원하고 계십니다.',
    localFaq: [
      { q: '김해 장유에서 부산 명지 치과까지 갈 만한가요?', a: '장유에서 더착한치과까지는 차량으로 약 15~20분 거리로, 남해고속도로를 이용하면 편리합니다. 정밀 진단과 통합 진료를 위해 내원하시는 장유 환자분이 많습니다.' },
    ],
  },
  {
    slug: 'hwajeon',
    name: '화전',
    fullName: '부산광역시 강서구 화전동',
    desc: '화전지구·화전산업단지 인근',
    region: '부산',
    landmarks: ['화전산업단지', '화전지구'],
    transit: '명지 방향 자가용 약 10분',
    distance: '본원까지 약 5km, 차량 약 10분',
    population: '산업단지·신규 주거지 생활권',
    intro:
      '화전동은 화전산업단지와 신규 주거지가 형성된 강서구 생활권입니다. 명지와 가까워 더착한치과 접근이 수월하며, 정기 검진부터 임플란트까지 가족 단위 진료가 가능합니다.',
  },
  {
    slug: 'dadae',
    name: '다대포',
    fullName: '부산광역시 사하구 다대동',
    desc: '사하구 다대포 인근',
    region: '부산',
    landmarks: ['다대포해수욕장', '몰운대', '다대포항'],
    transit: '을숙도대교 경유 자가용 약 15분',
    distance: '본원까지 약 8~10km, 차량 약 15분',
    population: '해안 주거 생활권',
    intro:
      '다대포는 부산 서남단 해안 생활권으로, 을숙도대교를 통해 명지와 빠르게 연결됩니다. 더착한치과는 다대포 환자분들에게 편안한 진료 환경과 정밀 진단을 제공합니다.',
  },
  {
    slug: 'hadan',
    name: '하단',
    fullName: '부산광역시 사하구 하단동',
    desc: '사하구 하단·에코델타 인근',
    region: '부산',
    landmarks: ['하단오거리', '동아대학교 승학캠퍼스', '에코델타시티', '하단역'],
    transit: '을숙도대교·명지 경유 자가용 약 10~15분, 지하철 1호선 하단역',
    distance: '본원까지 약 6~8km, 차량 약 10~15분',
    population: '대학가·신도시가 어우러진 사하구 거점',
    intro:
      '하단은 동아대학교와 에코델타시티를 끼고 있는 사하구의 거점 생활권입니다. 을숙도대교를 통해 명지와 가까워, 더착한치과로 내원하시는 하단·사하구 환자분이 꾸준히 늘고 있습니다.',
    localFaq: [
      { q: '하단에서 명지 치과까지 대중교통으로 갈 수 있나요?', a: '하단에서 명지 방향 버스 노선을 이용하거나 차량으로 10~15분이면 더착한치과에 도착하실 수 있습니다.' },
    ],
  },
  // ── 신규 확장 지역 (서부산·동부산 유입 강화) ──
  {
    slug: 'sasang',
    name: '사상',
    fullName: '부산광역시 사상구',
    desc: '사상 서부터미널·지하철 생활권',
    region: '부산',
    landmarks: ['부산서부시외버스터미널', '사상역(지하철·경전철)', '괘법르네시떼', '삼락생태공원'],
    transit: '경전철·지하철 2호선 사상역, 자가용 명지 방향 약 15~20분',
    distance: '본원까지 약 10km, 차량 약 15~20분',
    population: '교통 요지·상업·주거 복합 생활권',
    intro:
      '사상구는 서부산의 교통 요지로 지하철·경전철·버스터미널이 모인 생활권입니다. 명지로의 접근이 편리해, 사상 환자분들이 임플란트·교정 진료를 위해 더착한치과를 찾고 계십니다.',
  },
  {
    slug: 'gimhae',
    name: '김해',
    fullName: '경상남도 김해시',
    desc: '김해시 전역 — 부산 인접 경남 거점',
    region: '경남',
    landmarks: ['김해국제공항', '김해시청', '연지공원', '부산김해경전철'],
    transit: '경전철·자가용으로 명지 방향 약 15~25분',
    distance: '본원까지 약 10~15km, 차량 약 20분',
    population: '경남 동부 최대 도시 생활권',
    intro:
      '김해시는 부산과 맞닿은 경남 동부의 거점 도시로, 경전철과 도로망으로 명지와 긴밀하게 연결됩니다. 더착한치과는 김해 환자분들에게 부산권 통합치의학 진료를 가까운 거리에서 제공합니다.',
    localFaq: [
      { q: '김해에서 부산 명지 치과로 내원하기 편한가요?', a: '김해 주요 지역에서 더착한치과까지 차량으로 15~25분, 부산김해경전철로도 접근이 가능합니다. 정밀 진단을 위해 김해에서 내원하시는 분이 많습니다.' },
    ],
  },
  {
    slug: 'jinhae',
    name: '진해',
    fullName: '경상남도 창원시 진해구',
    desc: '진해 용원·웅동 — 부산 강서 인접',
    region: '경남',
    landmarks: ['용원항', '진해해양공원', '부산신항', '웅동지구'],
    transit: '가덕·녹산 경유 자가용 약 20~25분',
    distance: '본원까지 약 12~15km, 차량 약 20~25분',
    population: '부산신항 배후 주거·산업 생활권',
    intro:
      '진해구 용원·웅동 지역은 부산신항과 강서구에 인접해 명지로의 이동이 수월합니다. 더착한치과는 진해권 환자분들에게도 정밀 진단 기반의 임플란트·교정 진료를 제공합니다.',
  },
]

// 지역 SEO 페이지를 생성할 핵심 진료
export const AREA_TREATMENTS = [
  { slug: 'implant', name: '임플란트' },
  { slug: 'clear-aligner', name: '투명교정' },
  { slug: 'minish', name: '미니쉬' },
  { slug: 'orthodontics', name: '치아교정' },
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

// 지역 허브(랜딩) 페이지 URL 목록
export function getAreaHubs() {
  return AREAS.map((a) => ({ area: a, url: `/clinic/${a.slug}` }))
}

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

// 본원과 같은 지역(이웃) 추천 — 인링크 메시용
export function getNeighborAreas(slug: string, limit = 4): Area[] {
  const self = getArea(slug)
  if (!self) return AREAS.slice(0, limit)
  // 같은 region 우선, 자기 자신 제외
  const sameRegion = AREAS.filter((a) => a.slug !== slug && a.region === self.region)
  const others = AREAS.filter((a) => a.slug !== slug && a.region !== self.region)
  return [...sameRegion, ...others].slice(0, limit)
}
