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
    tagline: '말은 적어도, 손은 정확합니다 — 24년의 임상',
    intro: [
      '안녕하세요, 더착한치과 대표원장 황우석입니다.',
      '저는 말이 많은 의사는 아닙니다. 대신 24년간 진료실에서 한 가지는 분명히 배웠습니다. ' +
        '환자분의 마음을 안심시키는 건 화려한 말이 아니라, 정확한 진단과 정직한 설명, 그리고 결과로 보여드리는 진료라는 것입니다.',
      '제 진료의 원칙은 최소 침습·최소 절개입니다. ' +
        '디지털 가이드와 AI 기반 시스템을 진료에 적극 도입한 이유도 오직 하나 — ' +
        '덜 자르고, 덜 붓고, 한 번에 정확하게 끝내기 위해서입니다. ' +
        '치과가 두려운 곳이 아니라 안심하고 맡길 수 있는 곳이 되도록 노력하겠습니다.',
    ],
    career: [
      '부산대학교 치의학박사 학위 취득 (구강생화학교실)',
      '보건복지부 인증 통합치의학과 전문의',
      '전) 부산대학교 치과대학 외래교수 역임',
      '대한통합치과학회 정회원',
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
      '최소 침습, 최소 절개를 지향합니다. ' +
      '덜 자르고 덜 붓게, 한 번에 정확하게 — 꼭 필요한 진료만 충분히 설명드린 뒤에 시작합니다.',
  },
]

export function getDoctor(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug)
}
