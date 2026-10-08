/**
 * "부산 명지 치과" 허브(/clinic/myeongji)로 보내는 내부 링크 (2026-10-08 허브 내부 링크 몰아주기)
 *
 * - 앵커 텍스트는 대표 키워드 "부산 명지 치과" 그대로, nofollow 없음.
 * - 한 페이지에 허브 링크는 최대 2개(전역 푸터 1 + 본문 1). 허브 자신에는 넣지 않는다.
 * - 칼럼 끝 문장은 slug 해시로 4개 문형 중 하나를 고정 선택 (글마다 같은 문장 반복 방지).
 * - 문장 속 사실(스타빌딩 6층·주차·월·수 야간·토요일 오전)은 data/clinic.ts·허브 본문에 이미 있는 값만.
 */
import type { FC } from 'hono/jsx'
import { CLINIC } from '../data/clinic'

export const HUB_PATH = '/clinic/myeongji'
export const HUB_ANCHOR = '부산 명지 치과'

export function slugHash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

const COLUMN_LINES: [string, string][] = [
  [`${CLINIC.name}는 `, '를 찾으시는 명지오션시티·명지동 이웃분들께 진료시간과 버스·주차 정보를 따로 모아 안내하고 있습니다.'],
  ['글을 읽고 직접 상담을 받아 보고 싶어지셨다면, ', ' 안내 페이지에서 스타빌딩 6층 위치와 요일별 진료시간을 먼저 살펴보세요.'],
  ['월·수 야간 진료와 토요일 오전 진료를 포함한 내원 정보는 ', ' 안내에 한데 정리해 두었습니다.'],
  ['명지오션시티 근처에서 다니기 편한 ', `를 알아보고 계시다면 ${CLINIC.name}의 찾아오는 길과 의료진 소개를 함께 확인해 보세요.`],
]

export const HubLink: FC = () => <a href={HUB_PATH} style="color:inherit;text-decoration:underline;text-underline-offset:3px;font-weight:700">{HUB_ANCHOR}</a>

/** 칼럼·이야기 본문 끝 지역 안내 1문장 */
export const ColumnHubLine: FC<{ slug: string }> = ({ slug }) => {
  const [pre, post] = COLUMN_LINES[slugHash(slug || '') % COLUMN_LINES.length]
  return (
    <p class="hub-local-line" style="margin:40px 0 0;padding:16px 20px;border-left:3px solid var(--brand);background:var(--bg-2);border-radius:10px;line-height:1.75">
      {pre}<HubLink />{post}
    </p>
  )
}

/** 본문(마크다운) 안에 이미 허브 링크가 있는지 — 있으면 문장 블록 생략(페이지당 2개 이하) */
export function textHasHubLink(text: string): boolean {
  return /\]\((?:https?:\/\/(?:www\.)?thegooddc\.kr)?\/clinic\/myeongji\/?[)#?]/i.test(text || '') || /href=["'](?:https?:\/\/(?:www\.)?thegooddc\.kr)?\/clinic\/myeongji\/?["'#?]/i.test(text || '')
}
