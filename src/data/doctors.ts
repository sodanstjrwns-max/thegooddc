// ============================================================
// 의료진 데이터 (섹션 4)
// ★ 사실관계(자격·경력·학위) 창작 금지 — Q17·18 원문만 사용
// ============================================================

export interface Doctor {
  slug: string
  name: string
  title: string // 직책
  license: string // 면허·전문의 (사실관계 — 창작 금지)
  photo: string
  tagline: string
  intro: string[]
  career: string[] // 학력·경력 (원문)
  specialties: string[] // 잘하는 진료 (treatments slug와 연결)
  philosophy: string
}

export const DOCTORS: Doctor[] = [
  {
    slug: 'hwang-wooseok',
    name: '황우석',
    title: '대표원장',
    license: '치의학박사 · 통합치의학과 전문의',
    photo: '/images/doctor-hwang.webp',
    tagline: '24년의 임상 경험, 한 분 한 분께 정확하게',
    intro: [
      '안녕하세요, 더착한치과 대표원장 황우석입니다.',
      '24년간 진료실에서 환자분들을 만나며 한 가지 확신이 생겼습니다. ' +
        '좋은 치료는 화려한 말이 아니라 정확한 진단과 꼼꼼한 설명에서 시작된다는 것입니다.',
      '디지털 가이드와 AI 기반 시스템을 진료에 적극 도입한 이유도 ' +
        '오직 하나, 환자분께 한 번에 정확한 진료를 드리기 위해서입니다. ' +
        '치과가 두려운 곳이 아니라 안심하고 맡길 수 있는 곳이 되도록 노력하겠습니다.',
    ],
    career: [
      '치의학박사 (Ph.D.)',
      '보건복지부 인증 통합치의학과 전문의',
      '24년 치과 임상 경력',
      '다수의 임플란트 임상 경험',
      '대한치과 관련 다수 학회·세미나 참석',
      '디지털 가이드 임플란트 · AI 진단 시스템 운용',
    ],
    specialties: ['implant', 'clear-aligner', 'minish'],
    philosophy:
      '정확하고 꼼꼼하게 설명드리는 것이 환자분과의 신뢰를 쌓는 첫걸음이라 믿습니다. ' +
      '꼭 필요한 진료만, 충분히 설명드린 뒤에 시작합니다.',
  },
]

export function getDoctor(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug)
}
