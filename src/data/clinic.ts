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
  fax: '051-201-2853', // 공식 명함 확인 (2026-06)
  email: 'thegooddc@gmail.com', // 공식 채널 메일 (명함/계정 확인 2026-06)
  cohort: '8기',
  openedYear: 2015,
  openedDate: '2015-02-09', // 사업자등록증 개업년월일
  businessName: '더착한치과의원',
  // 사업자정보 (사업자등록증 확인 2026-06)
  businessRegNo: '606-39-03241', // 사업자등록번호
  medInstitutionNo: '', // 요양기관기호(선택)
  privacyOfficer: '황우석', // 개인정보보호책임자

  // 주소 (섹션 2)
  address: '부산 강서구 명지오션시티4로 59, 스타빌딩 6층 602호',
  addressRegion: '부산광역시',
  addressLocality: '강서구',
  addressDong: '명지동',
  postalCode: '46726',
  // 명지오션시티 좌표 (근사)
  geo: { lat: 35.0876, lng: 128.9105 },

  directions: {
    car: '스타빌딩 지하 1·2층 주차장 이용 (30대 주차 가능)',
    parkingTitle: '스타빌딩 지하 1·2층 (30대 주차 가능)',
    parkingDetail:
      '건물 내 지하 1층·지하 2층에 30대 주차가 가능합니다. ' +
      '스타빌딩 지하 1·2층이 만차일 경우, 주변 유료 주차장에 주차하신 뒤 ' +
      '영수증 사진과 이체받으실 계좌를 더착한치과(010-5958-2875)로 보내주시면 주차비를 지원해 드립니다.',
    parkingSupportPhone: '010-5958-2875',
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
    // 미션 — 병원 공식 문서 기준(편안한 마취·최소 절개 치료로 편안한 경험을 만든다)
    mission: '환자가 두려움 없이 치과를 찾을 수 있도록, 편안한 마취와 최소 절개 치료로 편안한 치료 경험을 만듭니다.',
    // 비전 — 병원 공식 문서 기준
    vision: '명지동에서 가장 편안한 임플란트 경험을 제공하는 치과',
    // 우리의 약속 — 모든 진료·상담·설명·서비스의 기준이 되는 한 문장
    promise: '우리는 환자의 두려움을 줄이고, 가장 편안한 치료 경험을 만드는 치과입니다.',
    // 핵심가치 — 병원 공식 문서의 다섯 가지 가치
    coreValues: [
      { title: '통증을 줄이기 위해 끝까지 노력합니다', desc: '환자의 작은 통증도 당연하게 여기지 않습니다. 더 편안한 치료를 위해 끊임없이 고민하고 노력합니다.', icon: 'heart' },
      { title: '회복 부담을 줄이는 방법을 선택합니다', desc: '불필요한 부담을 줄이고, 더 빠르고 편안하게 회복할 수 있는 치료를 우선합니다.', icon: 'bolt' },
      { title: '환자의 마음을 먼저 공감합니다', desc: '환자의 입장에서 먼저 생각하고, 두려움과 불안을 이해하며 따뜻하게 함께합니다.', icon: 'hand-holding-heart' },
      { title: '누구나 이해할 수 있도록 쉽게 설명합니다', desc: '전문용어보다 이해하기 쉬운 설명으로, 환자가 안심하고 치료를 결정할 수 있도록 돕습니다.', icon: 'comments' },
      { title: '안심할 때까지 책임집니다', desc: '치료가 끝나는 순간까지, 그리고 치료 후에도 환자가 믿고 의지할 수 있는 치과가 되겠습니다.', icon: 'shield-heart' },
    ],
    story:
      '치과에 대한 막연한 두려움 때문에 꼭 받아야 할 진료를 미루는 분들이 많습니다. ' +
      '더착한치과는 단순히 치아를 치료하는 병원이 아니라, ' +
      '치과가 무서워 치료를 미루던 환자도 안심하고 찾아올 수 있는 치과를 만들기 위해 시작했습니다. ' +
      '24년의 임상 경험과 디지털 기술을 더해, 편안한 마취와 최소 절개 치료로 ' +
      '환자분의 두려움을 안심으로 바꾸어 드리는 것이 우리의 약속입니다.',
  },

  // SNS (섹션 9) — Q36~38
  sns: {
    instagram: '',
    blog: '',
    youtube: '',
    kakao: 'https://pf.kakao.com/_yRxjxeV', // 더착한치과의원 공식 카카오톡 채널
    legacySite: 'http://thegooddc.com', // 기존(구) 홈페이지
  },

  // 분석·검색엔진 인증 (관리자페이지 또는 환경변수에서 주입 — 빈 값이면 미설치)
  // GA4 측정ID 발급: analytics.google.com → 관리 → 데이터 스트림 → 'G-' 코드
  // 네이버: searchadvisor.naver.com / 구글: search.google.com/search-console
  analytics: {
    ga4: '',          // 예: 'G-ABCD123XYZ' — 입력 즉시 방문/전환 추적 시작
    gtm: '',          // 예: 'GTM-XXXXXXX' — GTM을 쓸 경우(GA4와 택1 권장)
    naverVerify: '',  // 네이버 서치어드바이저 사이트 소유확인 메타값
    googleVerify: '', // 구글 서치콘솔 사이트 소유확인 메타값
    bingVerify: '',   // 빙 웹마스터도구 사이트 소유확인 메타값 (msvalidate.01)
  },

  domain: 'thegooddc.kr',
} as const

export type Clinic = typeof CLINIC
