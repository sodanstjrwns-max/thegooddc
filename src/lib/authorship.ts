// ===== 게시글 작성 주체 (2026-10-08, 사용자 승인) =====
// 원장을 저자·감수자로 표시하는 건 원장이 쓰거나 검토했다는 근거가 있을 때만 한다.
//
// 대행사 투입 칼럼 — 원장 작성·검토 근거 없음 (KV content:columns 에 그대로 남아 있는 코드 시드):
//   c-seed-1 why-digital-implant / c-seed-2 clear-aligner-tips / c-seed-4 implant-spacing-matters
//     ← src/lib/content-store.ts SEED_COLUMNS (커밋 1174a75·d59daca, 2026-06-04 관리자 CRUD 구축 시 시드)
//   c-seed-3 denture-20years-implant / c-seed-5 dental-fear-story
//     ← 같은 SEED_COLUMNS, 커밋 dff7683 (2026-06-12 '환자 스토리 칼럼' 대행사 작성)
//   (rv-seed-1·st-seed-1 시드는 후기·이야기 게시판 안내글 — 아래 규칙으로 이미 병원 발행)
// → 작성·발행 = 병원(#medicalclinic), reviewedBy·lastReviewed 없음, 화면엔 일반 건강정보 안내.
//
// 원장 칼럼 게시판에서 병원이 관리자 에디터로 원장을 지정해 올린 글은 기존 표시(원장 작성·감수)를 유지한다.
// 치료 후기·치과 이야기 게시판 글은 원장이 쓴 글이 아니다(후기=환자, 이야기=병원 소식) — 작성자 필드가
// 관리자 폼 기본값(유일한 원장)으로 채워졌을 뿐이므로 원장 저자·감수 스키마를 붙이지 않는다.
// 관리자에서 '병원 발행'(author = 'clinic')을 고르면 원장 이름이 붙지 않는다(새 글 기본값).
import { getDoctor } from '../data/doctors'

export const AGENCY_SEED_COLUMN_IDS = new Set<string>([
  'c-seed-1', 'c-seed-2', 'c-seed-3', 'c-seed-4', 'c-seed-5',
  'rv-seed-1', 'st-seed-1',
])
export const CLINIC_AUTHOR = 'clinic'
export const CLINIC_GENERAL_INFO_NOTE = '일반 건강정보입니다. 진료 판단은 내원 상담에서 원장이 직접 합니다.'

export const isAgencyColumn = (c: { id?: string | null }) => AGENCY_SEED_COLUMN_IDS.has(String(c.id || ''))

/** 원장 저자를 표시해도 되는 글(원장 칼럼 게시판·시드 아님·원장 지정)이면 그 원장, 아니면 undefined(= 병원 발행). */
export const columnDoctor = (c: { id?: string | null; author?: string | null; board?: string | null }) =>
  (c.board || 'column') !== 'column' || isAgencyColumn(c) || !c.author ? undefined : getDoctor(c.author)
