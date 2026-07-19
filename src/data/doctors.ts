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
  videoId?: string // YouTube 영상 ID (소개 영상)
  videoTitle?: string // 영상 섹션 제목
}

export const DOCTORS: Doctor[] = [
  {
    slug: 'hwang-wooseok',
    name: '황우석',
    title: '대표원장',
    license: '치의학박사 · 통합치의학과 전문의',
    photo: '/images/doctor-hwang.webp',
    tagline: '저는 진료실에서 생각합니다 — 말보다 결과로 신뢰를 쌓습니다',
    intro: [
      '저는 진료실에서 생각합니다. 강의실이 아니라 진료실에서. 논문이 아니라 환자분 앞에서.',
      '2002년 처음 치과의사가 됐고, 2015년 명지에 더착한치과의원을 열었습니다. ' +
        '임플란트를 15,000개 심으면서 한 가지를 확신하게 됐습니다. ' +
        '교과서에 나온 정답보다, 지금 이 환자분에게 맞는 답이 더 중요하다는 것.',
      '저는 행동하는 사람입니다. 계획보다 실행을 먼저 합니다. ' +
        '긴 설명보다 정확한 처치가 환자분을 더 안심시킬 때가 많다는 걸 압니다. ' +
        '그래서 말보다 결과로 신뢰를 쌓는 방식을 택했습니다.',
      '더착한치과의 기준은 하나입니다. ' +
        '치과의사의 만족이 아니라, 환자분이 두렵지 않고 아프지 않고 붓지 않는 것.',
      '이 기준을 지키기 위해 무절개 AI 임플란트를 배웠습니다. 3단계 무통마취 시스템을 만들었습니다. ' +
        '살릴 수 있는 치아는 살리고, 필요 없는 치료는 권하지 않기로 했습니다.',
      '통합치의학과 전문의, 부산대학교 치의학 박사, 전 부산대학교 치과대학 외래교수. ' +
        '이 경력이 자랑이 아니라 진료의 무게가 되길 원합니다.',
    ],
    career: [
      '부산대학교 치의학박사 학위 취득 (구강생화학교실)',
      '보건복지부 인증 통합치의학과 전문의',
      '전) 부산대학교 치과대학 외래교수 역임',
      '대한통합치의학과 정회원',
      '대한디지털치의학회 정회원',
      '대한치과보철학회 정회원',
      '대한구강악안면임플란트학회 정회원',
      '대한치과이식(임플란트)학회 정회원',
      'CAD/CAM MASTER CLASS 7·8·9기 수료',
      'IMPLANT MASTER CLASS 7·8·9기 수료',
      '치과 임상 24년 · 임플란트 식립 15,000여 케이스',
    ],
    specialties: ['implant', 'clear-aligner', 'minish'],
    philosophy:
      '더착한치과의 기준은 하나입니다 — 치과의사의 만족이 아니라, ' +
      '환자분이 두렵지 않고 아프지 않고 붓지 않는 것. ' +
      '살릴 수 있는 치아는 살리고, 필요 없는 치료는 권하지 않습니다.',
    videoId: 'cjRTwsNgyPM',
    videoTitle: '영상으로 만나는 황우석 대표원장',
  },
]

export function getDoctor(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug)
}
