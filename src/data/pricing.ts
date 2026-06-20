// ============================================================
// 더착한치과 — 2026 비급여 진료비용 고지 (의료법 제45조)
// 출처: 원내 게시 「2026 비급여 수가표」 (2026-06 확인)
// 단위: 원(KRW). '~' 는 '이상'(케이스별 차등)을 의미.
// ============================================================

export const PRICING_UPDATED = '2026-06-20' // 최종 갱신일
export const PRICING_UNIT_NOTE = '단위: 원 (VAT 포함, 1치아 기준은 비고 참조)'

export interface PriceItem {
  code?: string // 보건복지부 코드(있을 경우)
  sub: string // 소분류
  detail?: string // 상세분류
  cost: string // 비용(표기 그대로). '비용 없음'/'X' 등 텍스트 허용
  note?: string // 비고
}

export interface PriceGroup {
  category: string // 중분류
  icon: string // FontAwesome 아이콘
  items: PriceItem[]
}

export const PRICING: PriceGroup[] = [
  {
    category: '치과 처치·수술료',
    icon: 'tooth',
    items: [
      { code: 'UZ0040012', sub: '인레이 간접충전 (세라믹 등)', detail: '세라믹', cost: '350,000', note: '광범위한 우식·상실성 치아 병소를 아말감·직접 레진으로 수복할 수 없을 때 시행 · 1치아 기준, 재료 구분' },
      { code: 'UZ0040022', sub: '온레이 간접충전 (세라믹 등)', detail: '세라믹', cost: '400,000', note: '광범위한 우식·상실성 치아 병소를 아말감·직접 레진으로 수복할 수 없을 때 시행 · 1치아 기준, 재료 구분' },
      { sub: '크라운', detail: '지르코니아', cost: '550,000', note: '1치아 기준, 재료 구분' },
      { code: 'U02390000', sub: '광중합형 복합레진 충전', detail: '소구치', cost: '100,000', note: '1치아 기준, 재료 구분' },
      { code: 'U02400000', sub: '광중합형 복합레진 충전', detail: '대구치', cost: '110,000', note: '1치아 기준, 재료 구분' },
      { code: 'U02410000', sub: '광중합형 복합레진 충전', detail: '전치', cost: '150,000', note: '1치아 기준, 재료 구분' },
      { code: 'UZ0050001', sub: '광중합형 복합레진 충전', detail: '마모(치경부)', cost: '80,000', note: '1치아 기준, 재료 구분' },
      { code: 'UZ0050002', sub: '광중합형 복합레진 충전', detail: '코아 (1면)', cost: '80,000', note: '1치아 기준, 재료 구분' },
      { code: 'UW3021047', sub: '치석제거', detail: '전악', cost: '70,000', note: '충치·치주질환 예방 목적, 착색 제거, 교정치료 전·후 시행' },
      { code: 'UZ0360001', sub: '스프린트', detail: '이갈이 장치', cost: '400,000~' },
      { sub: '치조골 이식술', detail: '골 이식술', cost: '300,000~' },
      { sub: '치조골 이식술', detail: '상악동 거상술', cost: '500,000~' },
      { sub: '불소바니쉬 도포', detail: '전악', cost: '30,000' },
      { sub: '포스트', detail: '포스트코어', cost: '160,000', note: '1치아 기준, 재료 구분' },
      { sub: '포스트', detail: '기성 금속', cost: '160,000', note: '1치아 기준, 재료 구분' },
    ],
  },
  {
    category: '치과의 보철료',
    icon: 'teeth',
    items: [
      { code: 'UB0010011', sub: '네비게이션 임플란트 (1치당)', detail: '지르코니아', cost: '1,000,000~', note: '임플란트 1치아 기준 식립술·상부구조·보철수술 포함 / 치료재료대 포함 / 임플란트 수술 전 골조직·연조직 처치 비용은 제외' },
      { sub: '틀니', detail: '완전틀니', cost: '1,500,000', note: '1악당 기준, 재료 구분' },
      { sub: '틀니', detail: '부분틀니', cost: '1,500,000', note: '1악당 기준, 재료 구분' },
      { sub: '틀니', detail: '임시틀니', cost: '300,000', note: '1악당 기준, 재료 구분' },
      { sub: '틀니', detail: '임플란트 틀니', cost: '1,500,000', note: '1악당 기준, 재료 구분' },
      { sub: '임시치아', detail: '임시의치', cost: '100,000', note: '1치아 기준, 재료 구분' },
      { sub: '임시치아', detail: '고리가의치', cost: '100,000', note: '1치아 기준, 재료 구분' },
    ],
  },
  {
    category: '제증명 수수료',
    icon: 'file-lines',
    items: [
      { code: 'PDZ010000', sub: '진단서', detail: '일반', cost: '10,000' },
      { code: 'PDZ010001', sub: '진단서', detail: '병사용진단서', cost: '20,000' },
      { code: 'PDE010001', sub: '진단서', detail: '영문진단서', cost: '20,000' },
      { code: 'PDZ020001', sub: '상해 진단서', detail: '3주 미만', cost: '50,000' },
      { code: 'PDZ020002', sub: '상해 진단서', detail: '3주 이상', cost: '100,000' },
      { code: 'PDZ090002', sub: '확인서', detail: '보험사 양식', cost: '5,000' },
      { code: 'PDZ090004', sub: '확인서', detail: '통원', cost: '3,000' },
      { sub: '확인서', detail: '진료', cost: '3,000' },
      { code: 'PDZ090007', sub: '확인서', detail: '치료', cost: '3,000', note: '학교·직장·기타 제출용' },
      { code: 'PDZ140001', sub: '향후진료비추정서', detail: '천만원 미만', cost: '50,000' },
      { code: 'PDZ140002', sub: '향후진료비추정서', detail: '천만원 이상', cost: '100,000' },
      { sub: '소견서', detail: '일반', cost: '별도 안내' },
      { code: 'PDZ110101', sub: '진료기록 사본', detail: '1~5매', cost: '1,000', note: '검사결과지·경과기록지 등' },
      { sub: '진료기록 사본', detail: '6매 이상', cost: '2,000', note: '검사결과지·경과기록지 등' },
      { code: 'PDZ110102', sub: '진료기록 사본', detail: '이메일', cost: '1,000', note: '검사결과지·경과기록지 등' },
      { code: 'PDZ110003', sub: '진료기록 영상', detail: '필름', cost: 'X', note: 'X-ray·CT·MRI 등 영상자료' },
      { code: 'PDZ110006', sub: '진료기록 영상', detail: 'USB', cost: '10,000', note: 'X-ray·CT·MRI 등 영상자료' },
      { code: 'PDZ160000', sub: '제증명서 사본', detail: '1매당', cost: '1,000' },
      { sub: '진료비 영수증', cost: '비용 없음' },
      { sub: '진료의뢰서', cost: '비용 없음' },
      { sub: '치료비 계획서', cost: '비용 없음' },
    ],
  },
]
