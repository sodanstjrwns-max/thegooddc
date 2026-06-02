import type { FC, PropsWithChildren } from 'hono/jsx'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, GENERAL_TREATMENTS } from '../data/treatments'
import { canonical, dentistSchema, organizationSchema } from '../lib/seo'

interface LayoutProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  ogImage?: string
  schemas?: object[]
  ogType?: string
}

const FA = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css'
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css'

export const Layout: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const { title, description, path, keywords, ogImage, schemas = [], ogType = 'website', children } = props
  const url = canonical(path)
  const img = ogImage ? canonical(ogImage) : canonical('/images/hero.webp')
  const allSchemas = [dentistSchema(), organizationSchema(), ...schemas]

  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        <link rel="canonical" href={url} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content={CLINIC.name} />

        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={CLINIC.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={img} />
        <meta property="og:locale" content="ko_KR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={img} />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
        <meta name="theme-color" content={CLINIC.brand.primary} />

        {/* Fonts & Icons */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin="anonymous" />
        <link rel="stylesheet" href={PRETENDARD} />
        <link rel="stylesheet" href={FA} />
        <link rel="stylesheet" href="/static/style.css" />

        {/* JSON-LD */}
        {allSchemas.map((s) => (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
        ))}
      </head>
      <body>
        <Header />
        <MobileDrawer />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
        {/* 2026 interaction libs */}
        <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
        <script src="/static/app.js" defer></script>
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('load',function(){if(window.gsap&&window.ScrollTrigger){window.gsap.registerPlugin(window.ScrollTrigger);window.ScrollTrigger.refresh();}});` }} />
      </body>
    </html>
  )
}

const Header: FC = () => (
  <header class="site-header">
    <div class="container-wide nav-inner">
      <a href="/" class="brand-logo" aria-label={`${CLINIC.name} 홈`}>
        <span class="mark"><i class="fa-solid fa-tooth"></i></span>
        <span>{CLINIC.name}</span>
      </a>
      <nav aria-label="주 메뉴">
        <ul class="gnb">
          <li><a href="/mission">병원소개</a></li>
          <li><a href="/doctors">의료진</a></li>
          <li>
            <a href="/treatments">진료안내 <i class="fa-solid fa-chevron-down" style="font-size:11px;margin-left:4px"></i></a>
            <div class="mega">
              <div class="mega-title">핵심 진료</div>
              {CORE_TREATMENTS.map((t) => (
                <a href={`/treatments/${t.slug}`}>
                  <span class="ic"><i class={`fa-solid fa-${t.icon}`}></i></span>
                  <span>{t.shortName}<small>{t.tagline}</small></span>
                </a>
              ))}
              <div class="mega-title">전체 진료</div>
              {GENERAL_TREATMENTS.map((t) => (
                <a href={`/treatments/${t.slug}`}>
                  <span class="ic"><i class={`fa-solid fa-${t.icon}`}></i></span>
                  <span>{t.shortName}</span>
                </a>
              ))}
            </div>
          </li>
          <li>
            <a href="/cases">콘텐츠 <i class="fa-solid fa-chevron-down" style="font-size:11px;margin-left:4px"></i></a>
            <div class="mega" style="min-width:340px;grid-template-columns:1fr">
              <a href="/cases"><span class="ic"><i class="fa-solid fa-images"></i></span><span>비포 / 애프터</span></a>
              <a href="/column"><span class="ic"><i class="fa-solid fa-pen-nib"></i></span><span>원장 칼럼</span></a>
              <a href="/encyclopedia"><span class="ic"><i class="fa-solid fa-book"></i></span><span>치과 백과사전</span></a>
            </div>
          </li>
          <li>
            <a href="/directions">안내 <i class="fa-solid fa-chevron-down" style="font-size:11px;margin-left:4px"></i></a>
            <div class="mega" style="min-width:340px;grid-template-columns:1fr">
              <a href="/directions"><span class="ic"><i class="fa-solid fa-location-dot"></i></span><span>오시는 길 · 진료시간</span></a>
              <a href="/pricing"><span class="ic"><i class="fa-solid fa-won-sign"></i></span><span>비용 안내</span></a>
              <a href="/faq"><span class="ic"><i class="fa-solid fa-circle-question"></i></span><span>자주 묻는 질문</span></a>
              <a href="/notice"><span class="ic"><i class="fa-solid fa-bullhorn"></i></span><span>공지사항</span></a>
            </div>
          </li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a href={`tel:${CLINIC.phoneRaw}`} class="btn-call magnetic" data-mag="0.25"><i class="fa-solid fa-phone"></i><span>{CLINIC.phone}</span></a>
        <button class="nav-toggle" aria-label="메뉴 열기"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  </header>
)

const MobileDrawer: FC = () => (
  <div class="mobile-drawer" aria-hidden="true">
    <button class="drawer-close" aria-label="메뉴 닫기"><i class="fa-solid fa-xmark"></i></button>
    <a href="/mission">병원소개</a>
    <a href="/doctors">의료진</a>
    <a href="/treatments">진료안내</a>
    {CORE_TREATMENTS.map((t) => <a href={`/treatments/${t.slug}`} class="sub">— {t.shortName}</a>)}
    <a href="/cases">비포 / 애프터</a>
    <a href="/column">원장 칼럼</a>
    <a href="/encyclopedia">치과 백과사전</a>
    <a href="/directions">오시는 길 · 진료시간</a>
    <a href="/faq">자주 묻는 질문</a>
    <a href="/reservation">진료 예약</a>
  </div>
)

const Footer: FC = () => (
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">{CLINIC.name}</div>
          <p style="margin:0 0 8px">{CLINIC.brandSlogan}</p>
          <p style="margin:0;opacity:0.8">{CLINIC.address}</p>
          <div class="footer-sns">
            <a href={`tel:${CLINIC.phoneRaw}`} aria-label="전화"><i class="fa-solid fa-phone"></i></a>
            <a href="/directions" aria-label="오시는 길"><i class="fa-solid fa-location-dot"></i></a>
            <a href="/reservation" aria-label="예약"><i class="fa-regular fa-calendar-check"></i></a>
          </div>
        </div>
        <div>
          <h4>진료안내</h4>
          <ul class="footer-links">
            {CORE_TREATMENTS.map((t) => <li><a href={`/treatments/${t.slug}`}>{t.shortName}</a></li>)}
            <li><a href="/treatments">전체 진료보기</a></li>
          </ul>
        </div>
        <div>
          <h4>병원안내</h4>
          <ul class="footer-links">
            <li><a href="/mission">병원소개</a></li>
            <li><a href="/doctors">의료진</a></li>
            <li><a href="/cases">비포/애프터</a></li>
            <li><a href="/column">원장 칼럼</a></li>
            <li><a href="/directions">오시는 길</a></li>
          </ul>
        </div>
        <div>
          <h4>고객지원</h4>
          <ul class="footer-links">
            <li><a href="/reservation">진료예약</a></li>
            <li><a href="/faq">자주 묻는 질문</a></li>
            <li><a href="/pricing">비용 안내</a></li>
            <li><a href="/notice">공지사항</a></li>
            <li><a href="/encyclopedia">치과 백과사전</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>
          상호: {CLINIC.businessName} &nbsp;|&nbsp; 대표자: {CLINIC.director} &nbsp;|&nbsp; 대표전화: {CLINIC.phone}<br />
          주소: {CLINIC.address} &nbsp;|&nbsp; 개원: {CLINIC.openedYear}년
        </div>
        <div style="display:flex;gap:16px">
          <a href="/privacy">개인정보처리방침</a>
          <a href="/terms">이용약관</a>
          <a href="/sitemap.xml">사이트맵</a>
        </div>
      </div>
      <p class="footer-legal">
        ※ 본 홈페이지의 의료 정보는 일반적인 안내이며, 진료 효과 및 부작용은 환자 개인의 상태에 따라 다를 수 있습니다.
        정확한 진단과 치료 계획은 반드시 내원하여 의료진과 상담하시기 바랍니다. 비급여 진료비용은 병원 내 게시 및 상담 시 안내해 드립니다.
        본 사이트는 의료법 및 의료광고 사전심의 관련 규정을 준수합니다. © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
      </p>
    </div>
  </footer>
)

const FloatingCTA: FC = () => (
  <div class="floating-cta">
    <a href={`tel:${CLINIC.phoneRaw}`} class="fab fab-call" aria-label="전화 상담">
      <i class="fa-solid fa-phone"></i><span class="tip">전화 상담</span>
    </a>
    <a href="/reservation" class="fab fab-reserve" aria-label="진료 예약">
      <i class="fa-regular fa-calendar-check"></i><span class="tip">진료 예약</span>
    </a>
  </div>
)
