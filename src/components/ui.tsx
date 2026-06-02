import type { FC } from 'hono/jsx'
import type { FAQ } from '../data/treatments'

export const Breadcrumb: FC<{ items: { name: string; path: string }[] }> = ({ items }) => (
  <nav class="breadcrumb container" aria-label="현재 위치">
    {items.map((item, i) => (
      <>
        {i > 0 && <span>›</span>}
        {i === items.length - 1 ? <strong style="color:var(--ink)">{item.name}</strong> : <a href={item.path}>{item.name}</a>}
      </>
    ))}
  </nav>
)

export const FaqList: FC<{ faqs: FAQ[] }> = ({ faqs }) => (
  <div class="faq-list">
    {faqs.map((f) => (
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">
          <span><i class="fa-solid fa-q" style="color:var(--brand);margin-right:10px"></i>{f.q}</span>
          <i class="fa-solid fa-chevron-down faq-icon"></i>
        </button>
        <div class="faq-a"><p>{f.a}</p></div>
      </div>
    ))}
  </div>
)

export const SectionHead: FC<{ eyebrow?: string; title: string; lead?: string; center?: boolean }> = ({ eyebrow, title, lead, center }) => (
  <div class={`reveal ${center ? 'sec-head-center' : ''}`} style={center ? 'text-align:center;max-width:720px;margin:0 auto 56px' : 'margin-bottom:56px'}>
    {eyebrow && <div class="eyebrow" style={center ? 'justify-content:center' : ''}>{eyebrow}</div>}
    <h2 class="section-title">{title}</h2>
    {lead && <p class="section-lead" style={center ? 'margin:0 auto' : ''}>{lead}</p>}
  </div>
)
