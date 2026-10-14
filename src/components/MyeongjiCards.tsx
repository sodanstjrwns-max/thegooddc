// 명지 진료 6장 사진 카드 그리드 — 홈·"부산 명지 치과" 허브 공용 (2026-10-14)
// 화면 카드 = myeongjiItemListSchema() 와 같은 순서·이름·URL·사진 (1:1)
import type { FC } from 'hono/jsx'
import { MYEONGJI_CARDS } from '../data/myeongji-cards'

const CSS = `
.mj-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.mj-card{display:flex;flex-direction:column;height:100%;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;color:var(--ink);text-decoration:none;box-shadow:var(--sh-xs);transition:box-shadow .4s var(--ease-out),border-color .4s,transform .4s var(--ease-out)}
.mj-card:hover{box-shadow:var(--sh-md);border-color:var(--line-2);transform:translateY(-3px)}
.mj-card:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.mj-card-img{display:block;aspect-ratio:1/1;overflow:hidden;background:var(--bg-2)}
.mj-card-img img,.article-body .mj-card-img img{display:block;width:100%;height:100%;object-fit:cover;margin:0;border-radius:0;transition:transform .7s var(--ease-out)}
.mj-card:hover .mj-card-img img{transform:scale(1.04)}
.mj-card-body{display:flex;flex-direction:column;gap:8px;padding:20px 22px 22px;position:relative;flex:1}
.mj-card-tag{font-size:var(--fs-eyebrow);letter-spacing:.14em;color:var(--accent);font-weight:600}
.mj-card-title{font-family:var(--serif-kr);font-size:1.3rem;line-height:1.35;letter-spacing:-.02em;color:var(--ink)}
.mj-card-line{color:var(--ink-soft);font-size:.95rem;line-height:1.6;padding-right:28px}
.mj-card-arrow{position:absolute;right:20px;bottom:20px;color:var(--accent);font-size:1.05rem;transition:transform .3s var(--ease-out)}
.mj-card:hover .mj-card-arrow{transform:translate(3px,-3px)}
@media (max-width:900px){.mj-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
@media (max-width:520px){.mj-cards{grid-template-columns:1fr 1fr;gap:12px}.mj-card-body{padding:14px 14px 16px}.mj-card-title{font-size:1.05rem}.mj-card-line{font-size:.84rem;padding-right:0}.mj-card-arrow{display:none}.mj-card-tag{font-size:.66rem;letter-spacing:.08em}}
`

export const MyeongjiCardGrid: FC<{ idPrefix: string }> = ({ idPrefix }) => (
  <>
    <ul class="mj-cards" role="list">
      {MYEONGJI_CARDS.map((c, i) => (
        <li>
          <a class="mj-card" href={c.url} aria-labelledby={`${idPrefix}-${c.key}`}>
            <span class="mj-card-img"><img src={c.thumb} width="600" height="600" loading="lazy" decoding="async" alt={c.name} /></span>
            <span class="mj-card-body">
              <span class="mj-card-tag" aria-hidden="true">0{i + 1} / {c.tag}</span>
              <strong class="mj-card-title" id={`${idPrefix}-${c.key}`}>{c.name}</strong>
              <span class="mj-card-line">{c.line}</span>
              <span class="mj-card-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
            </span>
          </a>
        </li>
      ))}
    </ul>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
  </>
)

/** 하위 페이지 본문 첫 대표 사진 (og 와 같은 크롭) */
export const MyeongjiLeadFigure: FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <figure style="margin:0 0 28px;border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-2);aspect-ratio:1200/630">
    <img src={src} width="1200" height="630" alt={alt} fetchpriority="high" decoding="async" style="display:block;width:100%;height:100%;object-fit:cover;margin:0;border-radius:0" />
  </figure>
)
