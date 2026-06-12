import type { FC } from 'hono/jsx'

/* ============================================================
   VECTOR MOTION GRAPHICS — Warm Paper × Trust Blue
   히어로: AI 디지털 가이드 블루프린트 (치아 라인아트 드로잉 +
           오빗 링 + 크로스헤어 + 스캔라인 + 데이터 포인트)
   CTA:   환자 여정 별자리 패스 (글로우 도트 트래블)
   모든 모션은 CSS 애니메이션 (reduced-motion 대응은 style.css)
   ============================================================ */

/** 히어로 프레임 안의 치아 블루프린트 벡터 — 다크 네이비 스테이지 위 */
export const HeroToothVector: FC = () => (
  <svg class="htv" viewBox="0 0 400 500" fill="none" aria-hidden="true" role="presentation">
    <defs>
      <linearGradient id="htvScan" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(45,212,191,0)" />
        <stop offset=".5" stop-color="rgba(45,212,191,.85)" />
        <stop offset="1" stop-color="rgba(45,212,191,0)" />
      </linearGradient>
      <radialGradient id="htvHalo" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="rgba(30,111,184,.32)" />
        <stop offset="1" stop-color="rgba(30,111,184,0)" />
      </radialGradient>
    </defs>

    {/* 블루프린트 그리드 */}
    <g class="htv-grid" stroke="rgba(124,196,240,.07)" stroke-width="1">
      <path d="M50 0V500M100 0V500M150 0V500M200 0V500M250 0V500M300 0V500M350 0V500" />
      <path d="M0 50H400M0 100H400M0 150H400M0 200H400M0 250H400M0 300H400M0 350H400M0 400H400M0 450H400" />
    </g>

    {/* 중심 헤일로 */}
    <circle cx="200" cy="235" r="170" fill="url(#htvHalo)" class="htv-halo" />

    {/* 뷰파인더 코너 브래킷 */}
    <g class="htv-corners" stroke="rgba(124,196,240,.45)" stroke-width="2" stroke-linecap="round">
      <path d="M30 52V30h22" /><path d="M348 30h22v22" />
      <path d="M370 448v22h-22" /><path d="M52 470H30v-22" />
    </g>

    {/* 오빗 링 — 정밀 가이드 궤도 */}
    <g class="htv-orbit">
      <circle cx="200" cy="235" r="152" stroke="rgba(124,196,240,.22)" stroke-width="1.5" stroke-dasharray="3 11" />
      <circle cx="200" cy="83" r="4" fill="rgba(124,196,240,.7)" />
    </g>
    <g class="htv-orbit rev">
      <circle cx="200" cy="235" r="118" stroke="rgba(45,212,191,.25)" stroke-width="1.5" stroke-dasharray="2 13" />
      <circle cx="318" cy="235" r="3" fill="rgba(45,212,191,.8)" />
    </g>

    {/* 크로스헤어 — 디지털 가이드 조준선 */}
    <g class="htv-cross" stroke="rgba(124,196,240,.32)" stroke-width="1.5" stroke-linecap="round">
      <path d="M200 42v50M200 378v50M22 235h48M330 235h48" />
      <circle cx="200" cy="235" r="3" fill="rgba(124,196,240,.45)" stroke="none" />
    </g>

    {/* ── 치아 라인아트 (어금니) — 스트로크 드로잉 ── */}
    <g class="htv-float">
      <path
        class="htv-tooth"
        pathLength="1000"
        d="M200 128
           C 174 102, 124 110, 113 150
           C 105 180, 117 212, 125 244
           C 133 278, 137 334, 157 334
           C 175 334, 169 270, 200 270
           C 231 270, 225 334, 243 334
           C 263 334, 267 278, 275 244
           C 283 212, 295 180, 287 150
           C 276 110, 226 102, 200 128 Z"
        stroke="#9FD4F5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
      />
      {/* 교두(cusp) 디테일 */}
      <path class="htv-cusp" pathLength="100" d="M148 165 Q 200 196 252 165"
        stroke="rgba(159,212,245,.55)" stroke-width="2.5" stroke-linecap="round" />
      {/* 식립 타깃 마커 — 좌측 치근단 */}
      <g class="htv-target">
        <circle cx="158" cy="330" r="13" stroke="#2DD4BF" stroke-width="2" />
        <path d="M158 311v8M158 341v8M139 330h8M169 330h8" stroke="#2DD4BF" stroke-width="2" stroke-linecap="round" />
      </g>
    </g>

    {/* 스캔 라인 — 위→아래 스윕 */}
    <g class="htv-scan">
      <rect x="86" y="0" width="228" height="2.5" rx="1.25" fill="url(#htvScan)" />
    </g>

    {/* 데이터 포인트 — 블링크 */}
    <g class="htv-plus" stroke="rgba(124,196,240,.6)" stroke-width="1.5" stroke-linecap="round">
      <path class="p1" d="M92 148h12M98 142v12" />
      <path class="p2" d="M304 176h12M310 170v12" />
      <path class="p3" d="M298 326h12M304 320v12" />
      <path class="p4" d="M104 296h12M110 290v12" />
    </g>

    {/* 블루프린트 라벨 */}
    <text x="32" y="466" class="htv-label">AI DIGITAL GUIDE</text>
    <text x="318" y="48" class="htv-label" text-anchor="end">3D CT</text>
  </svg>
)

/** CTA 밴드 배경 — 환자 여정 별자리 패스 + 트래블링 글로우 도트 */
export const JourneyPathVector: FC = () => (
  <svg class="ctav" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" role="presentation">
    <path
      id="ctav-path"
      d="M-60 300 C 160 200, 280 350, 480 258 C 680 172, 800 330, 1000 232 C 1120 178, 1200 230, 1280 198"
      stroke="rgba(124,196,240,.16)" stroke-width="1.5" stroke-dasharray="2 9"
    />
    {/* 여정 노드 — 별자리 */}
    <g fill="rgba(124,196,240,.5)">
      <circle class="ctav-node n1" cx="120" cy="242" r="3" />
      <circle class="ctav-node n2" cx="360" cy="296" r="3.5" />
      <circle class="ctav-node n3" cx="600" cy="222" r="3" />
      <circle class="ctav-node n4" cx="850" cy="290" r="3.5" />
      <circle class="ctav-node n5" cx="1080" cy="208" r="3" />
    </g>
    {/* 트래블링 도트 — 환자의 여정 */}
    <g class="ctav-dot">
      <circle r="11" fill="rgba(45,212,191,.16)">
        <animateMotion dur="11s" repeatCount="indefinite"><mpath href="#ctav-path" /></animateMotion>
      </circle>
      <circle r="3.5" fill="#2DD4BF">
        <animateMotion dur="11s" repeatCount="indefinite"><mpath href="#ctav-path" /></animateMotion>
      </circle>
    </g>
  </svg>
)
