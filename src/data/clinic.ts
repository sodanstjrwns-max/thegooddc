// ============================================================
// 더착한치과 — 병원 핵심 데이터 (Single Source of Truth)
// §B 의료광고법 자동 필터 적용 완료 / 사실관계 원문 유지
// ============================================================

export const CLINIC = {
  // 기본 정보 (섹션 1~2)
  name: '더착한치과',
  nameEn: 'The Good Dental Clinic',
  brandSlogan: '치과 통증의 두려움을 안심으로 바꾸겠습니다',
  catchphrase: '더 빠르고 정확한, 더착한치과',
  director: '황우석',
  directorTitle: '대표원장',
  phone: '051-203-2875',
  phoneRaw: '0512032875',
  email: 'wsh216@gmail.com',
  cohort: '8기',
  openedYear: 2015,
  businessName: '더착한치과의원',

  // 주소 (섹션 2)
  address: '부산 강서구 명지오션시티4로 59, 스타빌딩 601·602호',
  addressRegion: '부산광역시',
  addressLocality: '강서구',
  addressDong: '명지동',
  postalCode: '46726',
  // 명지오션시티 좌표 (근사)
  geo: { lat: 35.0876, lng: 128.9105 },

  directions: {
    car: '강서 기적의 도서관 무료주차 후 도보 5분',
    bus: {
      general: ['58-2', '168', '3', '520'],
      seat: ['58-1', '58-1(심야)'],
      express: ['1009'],
      village: ['강서구17', '강서구20', '강서구9-2', '강서구21'],
    },
  },

  // 진료시간 (섹션 2)
  hours: [
    { day: '월', time: '09:00 - 20:00', lunch: '12:00 - 14:00', closed: false, note: '야간진료' },
    { day: '화', time: '09:00 - 18:00', lunch: '12:00 - 14:00', closed: false },
    { day: '수', time: '09:00 - 20:00', lunch: '12:00 - 14:00', closed: false, note: '야간진료' },
    { day: '목', time: '09:00 - 18:00', lunch: '12:00 - 14:00', closed: false },
    { day: '금', time: '09:00 - 18:00', lunch: '12:00 - 14:00', closed: false },
    { day: '토', time: '08:00 - 12:00', lunch: null, closed: false, note: '점심시간 없음' },
    { day: '일', time: '정기휴무', lunch: null, closed: true },
  ],
  hoursNote: '매주 일요일 정기휴무 · 점심시간 12:00-14:00 (토요일 제외)',

  // 브랜딩 (섹션 6) — Q24 따뜻하고 친근한 / Q25 블루
  brand: {
    mood: '따뜻하고 친근한',
    primary: '#1E6FB8', // 신뢰의 블루 (메인)
    primaryDark: '#114A7E',
    primaryLight: '#4A95D6',
    accent: '#2DD4BF', // 청량한 틸 포인트 (안심·치유)
    sand: '#F4F1EC', // 따뜻한 배경 톤
    ink: '#16263A', // 깊은 네이비 텍스트
  },

  // 철학 (섹션 5) — Q20~23 기반, 약점은 강점으로 리프레이밍
  philosophy: {
    mission: '치과 통증의 두려움을 안심으로 바꾸겠습니다.',
    vision: '서부산 강서구에서 가장 믿고 오래 다닐 수 있는 치과',
    coreValues: [
      { title: '정확하게', desc: '디지털 가이드와 AI 기반 정밀 진단으로 한 번에 정확한 진료를 설계합니다.', icon: 'crosshairs' },
      { title: '빠르게', desc: '원내 기공실과 디지털 시스템으로 진료 과정을 효율적으로 단축합니다.', icon: 'bolt' },
      { title: '편안하게', desc: '통증을 최소화하는 마취 시스템으로 치과 공포를 안심으로 바꿉니다.', icon: 'heart' },
    ],
    story:
      '치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루는 분들이 많습니다. ' +
      '더착한치과는 "치과가 무섭지 않은 곳"을 만들기 위해 시작했습니다. ' +
      '24년의 임상 경험과 디지털 기술을 더해, 정확하면서도 편안한 진료로 ' +
      '환자분의 두려움을 안심으로 바꾸어 드리는 것이 우리의 약속입니다.',
  },

  // SNS (섹션 9) — Q36~38
  sns: {
    instagram: '',
    blog: '',
    youtube: '',
    kakao: '',
  },

  // GA4 / GTM (배포 시 교체)
  analytics: {
    ga4: 'G-XXXXXXXXXX',
    gtm: 'GTM-XXXXXXX',
  },

  domain: 'thegooddental.kr',
} as const

export type Clinic = typeof CLINIC
