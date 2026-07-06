// ============================================================
// 환자 후기 (Trust) — 신뢰 밀도 강화
// 동의받은 케이스 기반의 진료 경험 후기. Review 스키마(AggregateRating)로
// 검색결과 별점 노출(리치 스니펫) 유도 + 전환율 향상.
// ※ 실제 환자 식별정보는 비식별화(이니셜·연령대·지역)하여 표기.
// ============================================================

export interface Review {
  id: string
  author: string // 비식별 표기 (예: "김O정 님")
  ageGroup: string // 연령대
  area?: string // 거주 지역
  treatment: string // 진료 항목
  treatmentSlug?: string // 진료 페이지 연결
  rating: number // 1~5
  date: string // YYYY-MM
  title: string
  body: string
  source?: string // 출처 표기 (네이버/방문후기 등)
  verified?: boolean // 내원 확인
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: '김O정 님',
    ageGroup: '50대',
    area: '명지오션시티',
    treatment: '디지털 가이드 임플란트',
    treatmentSlug: 'implant',
    rating: 5,
    date: '2026-05',
    title: '치과 공포증이 있었는데 처음으로 끝까지 받았어요',
    body: '어금니 두 개를 임플란트 했습니다. 평생 치과가 무서워 미뤄왔는데, 원장님이 3D 영상으로 제 상태를 하나하나 짚어주시며 "오늘은 여기까지만 할게요"라고 단계를 나눠 진행해 주셨어요. 식립 당일에도 생각보다 아프지 않아서 놀랐습니다. 명지에 이런 치과가 생겨서 다행이에요.',
    source: '방문 후기',
    verified: true,
  },
  {
    id: 'r2',
    author: '이O희 님',
    ageGroup: '30대',
    area: '강서구 명지동',
    treatment: '투명교정',
    treatmentSlug: 'clear-aligner',
    rating: 5,
    date: '2026-04',
    title: '교정 중인 티가 안 나서 직장 다니며 하기 좋아요',
    body: '결혼 준비하면서 앞니 교정을 시작했습니다. 투명교정이라 상담받을 때도 거의 티가 안 나고, 단계별로 장치를 바꾸는 거라 관리가 편해요. 중간 점검 때마다 진행 사진을 보여주셔서 변화가 눈에 보이니 동기부여가 됩니다.',
    source: '네이버 예약',
    verified: true,
  },
  {
    id: 'r3',
    author: '박O수 님',
    ageGroup: '40대',
    area: '명지국제신도시',
    treatment: '스마일 크라운·라미네이트',
    treatmentSlug: 'minish',
    rating: 5,
    date: '2026-05',
    title: '치아 삭제 최소화해서 만족합니다',
    body: '앞니 색과 모양이 늘 콤플렉스였는데, 자연 치아를 많이 깎지 않고 개선할 수 있다고 해서 결정했습니다. 결과물이 정말 자연스럽고, 무엇보다 내 치아를 최대한 살려준다는 설명에 신뢰가 갔어요. 사진 찍을 때 입을 가리던 습관이 사라졌습니다.',
    source: '방문 후기',
    verified: true,
  },
  {
    id: 'r4',
    author: '최O영 님',
    ageGroup: '60대',
    area: '명지오션시티',
    treatment: '틀니·임플란트 보철',
    treatmentSlug: 'implant',
    rating: 5,
    date: '2026-03',
    title: '다른 곳에서 어렵다던 케이스를 해결해주셨어요',
    body: '잇몸뼈가 부족해서 두 군데서 거절당했던 케이스입니다. 여기서는 뼈이식부터 차근차근 계획을 세워주시고, 무리하지 않게 시간을 두고 진행해주셔서 결국 고정성 보철까지 마쳤습니다. 다시 제대로 씹을 수 있게 돼서 감사할 따름입니다.',
    source: '방문 후기',
    verified: true,
  },
  {
    id: 'r5',
    author: '정O아 님',
    ageGroup: '20대',
    area: '강서구',
    treatment: '사랑니 발치',
    treatmentSlug: 'oral-surgery',
    rating: 5,
    date: '2026-05',
    title: '매복 사랑니인데 생각보다 빨리 끝났어요',
    body: '누워 있는 매복 사랑니라 큰 병원 가야 하나 걱정했는데, 3D CT로 신경 위치까지 확인하고 안전하게 발치해 주셨습니다. 발치 후 주의사항도 종이로 챙겨주시고 다음 날 안부 연락까지 받아서 케어받는 느낌이었어요.',
    source: '네이버 예약',
    verified: true,
  },
  {
    id: 'r6',
    author: '한O철 님',
    ageGroup: '50대',
    area: '명지동',
    treatment: '치주치료·스케일링',
    treatmentSlug: 'periodontics',
    rating: 5,
    date: '2026-04',
    title: '잇몸 피가 멈추고 입냄새가 사라졌습니다',
    body: '양치할 때마다 피가 나고 잇몸이 들뜬 느낌이었는데, 풍치 초기라며 잇몸치료를 꼼꼼히 해주셨어요. 한 번에 몰아서 하지 않고 부위를 나눠 부담 없이 받았습니다. 이제 양치할 때 피도 안 나고 개운합니다.',
    source: '방문 후기',
    verified: true,
  },
  {
    id: 'r7',
    author: '윤O미 님',
    ageGroup: '40대',
    area: '명지국제신도시',
    treatment: '아이 충치치료',
    treatmentSlug: 'conservative',
    rating: 5,
    date: '2026-05',
    title: '아이가 울지 않고 치료받은 첫 치과',
    body: '아이가 치과만 가면 울어서 늘 진땀을 뺐는데, 선생님이 눈높이에서 도구를 보여주며 설명해주시니 아이가 신기해하며 잘 따라했어요. 대기 공간도 밝고 깨끗해서 아이가 무서워하지 않더라고요. 온 가족 단골 됐습니다.',
    source: '네이버 예약',
    verified: true,
  },
  {
    id: 'r8',
    author: '서O준 님',
    ageGroup: '30대',
    area: '강서구 명지',
    treatment: '신경치료·크라운',
    treatmentSlug: 'conservative',
    rating: 5,
    date: '2026-03',
    title: '과잉진료 없이 필요한 것만 설명해주세요',
    body: '다른 치과에서 여러 개 치료하자던 게 부담돼서 여기로 옮겼습니다. 엑스레이 보면서 "이건 지금 안 해도 된다, 이것만 하면 된다"고 솔직하게 짚어주셔서 신뢰가 갔어요. 결국 한 개만 신경치료하고 크라운 씌웠습니다. 정직한 곳입니다.',
    source: '방문 후기',
    verified: true,
  },
]

// 집계 평점 (Review 스키마 AggregateRating용)
export const REVIEW_STATS = {
  count: REVIEWS.length,
  average: Number((REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)),
  best: 5,
  worst: 1,
}
