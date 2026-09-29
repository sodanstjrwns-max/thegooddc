// 진료 페이지 최종 검토일(고정값). vite.config.ts 가 빌드 시 src/data/treatments.ts 의
// 마지막 커밋 날짜를 __TX_CONTENT_DATE__ 로 주입한다. 없으면 폴백(2026-09-29 기준 커밋 날짜).
// 스키마 lastReviewed/dateModified 와 화면 '최종 검토' 표기가 같은 값을 쓴다.
declare const __TX_CONTENT_DATE__: string | undefined
const injected = typeof __TX_CONTENT_DATE__ !== 'undefined' ? __TX_CONTENT_DATE__ : ''
export const TX_REVIEWED = /^\d{4}-\d{2}-\d{2}$/.test(injected) ? injected : '2026-08-18'
