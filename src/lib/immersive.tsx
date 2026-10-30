// 메인 홈 스크롤 몰입 연출 — 홈에서만 불러온다 (2026-10-30 미리보기)
// 캐시 버스팅: 빌드 시 public/static/immersive.{css,js} 내용 해시 (vite.config.ts define)
declare const __IMMERSIVE_CSS_V__: string
declare const __IMMERSIVE_JS_V__: string

export const ImmersiveHead = () => <link rel="stylesheet" href={`/static/immersive.css?v=${__IMMERSIVE_CSS_V__}`} />

export const ImmersiveScripts = () => (
  <>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
    <script src={`/static/immersive.js?v=${__IMMERSIVE_JS_V__}`} defer></script>
  </>
)
