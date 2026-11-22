// ============================================================
// 새 홈 (2026-11-23 리뉴얼) — 흰 바탕 + 로고 시안/딥틸, 스크롤 무대 연출
// - head(제목·설명·스키마·측정)는 기존 홈과 같은 값(homeSeo)을 Layout bare 모드로 그대로 쓴다.
// - 본문 문구·수치는 기존 홈과 같은 데이터에서 가져온다 (data/* · home.tsx HOME_FAQS).
// - 스타일·스크립트: public/static/home-renew.{css,js} (내용 해시로 캐시 갱신)
// - 제목 서체는 쓰는 글자만 남긴 사본 — 문구를 고치면 scripts/subset-home-fonts.py 를 다시 실행.
// - 예전 홈으로 되돌리기: src/index.tsx 의 HOME_RENEWAL = false
// ============================================================
import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import { Layout } from '../components/Layout'
import { CLINIC } from '../data/clinic'
import { CORE_TREATMENTS, GENERAL_TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { STORY_CHAPTERS, STORY_CTA, CASE_STORIES } from '../data/story'
import { MYEONGJI_CARDS } from '../data/myeongji-cards'
import { AREAS } from '../data/areas'
import { HUB_PATH, HUB_ANCHOR } from '../lib/hub-link'
import { HOME_FAQS, homeSeo, NoticePopups } from './home'
import type { Notice } from '../lib/content-store'

declare const __HOME_RENEW_CSS_V__: string
declare const __HOME_RENEW_JS_V__: string

const FA = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css'

const e = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ln = (...lines: string[]) => lines.map((l) => `<span class="ln"><span class="ph">${l}</span></span>`).join(' ')
const pb = (...parts: string[]) => parts.map((p) => `<span class="pb">${p}</span>`).join(' ')
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const icoCal = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 9 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const icoTel = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
const icoTalk = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c-4.7 0-8.5 3-8.5 6.8 0 2.4 1.5 4.5 3.9 5.7L6.5 20l3.7-2.5c.6.1 1.2.1 1.8.1 4.7 0 8.5-3 8.5-6.8S16.7 4 12 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'

const NAV: [string, string][] = [['병원소개', '/mission'], ['의료진', '/doctors'], ['진료안내', '/treatments'], ['콘텐츠', '/cases'], ['안내', '/directions']]
const DRAWER: [string, string][] = [
  ['병원소개', '/mission'], ['의료진', '/doctors'], ['진료안내', '/treatments'], ['치료 후기', '/reviews-board'], ['비포 / 애프터', '/cases'],
  ['치과 이야기', '/story-board'], ['원장 칼럼', '/column'], ['치과 백과사전', '/encyclopedia'], ['오시는 길 · 진료시간', '/directions'],
  ['비용 안내', '/pricing'], ['자주 묻는 질문', '/faq'], ['공지사항', '/notice'],
]

// ---- 기존 홈과 같은 문구 (home.tsx 의 MARQUEE · STATS · ASSURE · COMPARE · 장비 구역) ----
const MARQUEE = ['디지털 가이드 임플란트', '투명교정', '스타일네이트', '원내 기공실', '편안한 마취 시스템', '통합치의학 전문의', '치의학박사', '3D CT 정밀 진단', '구강 스캐너', '24년 임상 경력', '과잉진료 없는 진료', '10개 진료과 통합']
const STATS = [
  { n: 24, u: '년', l: '대표원장 임상 경력', comma: false },
  { n: 15000, u: '여 케이스', l: '임플란트 식립 경험', comma: true },
  { n: 10, u: '개 진료과', l: '대학병원급 통합 진료', comma: false },
  { n: 2015, u: '', l: '명지 지역 개원', comma: false },
]
// 걱정(줄이 그어지는 말) → 약속(기존 홈 ASSURE 그대로)
const PROMISE = [
  { worry: '아플까 봐', t: '아프지 않게', d: '편안한 마취 시스템으로 치료 중 통증을 최소화합니다. 치과가 무섭지 않은 곳을 만듭니다.' },
  { worry: '더 권할까 봐', t: '과잉진료 없이', d: '꼭 필요한 진료만, 충분히 설명드린 뒤에 시작합니다. 부담 없이 상담부터 받으세요.' },
  { worry: '오래 걸릴까 봐', t: '정확하고 빠르게', d: '디지털 가이드·AI 진단으로 한 번에 정확하게, 원내 기공실로 기다림 없이 빠르게.' },
]
const CORE_EXTRA: Record<string, { en: string; img: string; lines?: string[] }> = {
  implant: { en: 'Implant', img: '/images/core-implant-v2.webp', lines: ['디지털 가이드', '임플란트'] },
  'clear-aligner': { en: 'Clear Aligner', img: '/images/core-aligner-v2.webp' },
  minish: { en: 'Minimal Prep', img: '/images/core-minish-v2.webp', lines: ['스타일네이트', '· 라미네이트'] },
}
const DIGITAL: { k: string; t: string; d: string; chips?: string[] }[] = [
  { k: 'AI Guided', t: 'AI 디지털 가이드 임플란트', d: '인공지능이 최적의 식립 경로를 제안하면 의사가 최종 확인합니다. 좁고 신경관과 가까운 부위도 계획대로 — 절개와 붓기를 줄이는 방향으로 진행합니다.' },
  { k: 'In-house Lab', t: '원내 기공실', d: '보철물을 외부에 맡기지 않습니다. 원내에서 직접 제작해 제작 기간과 내원 횟수를 줄입니다.', chips: ['밀링기 2대', '3D 프린터 3대', '구강 스캐너'] },
  { k: '3D Scan', t: '구강 스캐너 정밀 진단', d: '입안을 3D로 그대로 스캔해 본뜨는 불편 없이 정확하게 진단합니다.' },
  { k: 'Endodontics', t: '플라젠 신경치료기', d: '정밀 신경치료로 자연치아를 최대한 보존하는 진료를 지향합니다.' },
  { k: 'Comfort', t: '편안한 마취 시스템', d: '치료 중 통증을 최소화해, 치과가 무섭지 않은 곳을 만듭니다.' },
]
const STANDARD: [string, string][] = [
  ['진료 설계', '3D CT · AI 디지털 가이드'],
  ['보철물 제작', '원내 기공실 (밀링기·3D프린터)'],
  ['통증 관리', '편안한 마취 시스템'],
  ['진료 범위', '10개 진료과 통합 진료'],
  ['상담 방식', '꼭 필요한 진료만 설명'],
]

// 진료시간 → 머리 줄 '진료 중' 표시용 (요일 번호: 일 0 ~ 토 6)
const DAY_NO: Record<string, number> = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 }
const hm = (s: string) => { const m = /(\d{2}):(\d{2})/.exec(s); return m ? Number(m[1]) * 60 + Number(m[2]) : 0 }
const HOURS_JSON = JSON.stringify(Object.fromEntries(CLINIC.hours.filter((h) => !h.closed).map((h) => {
  const [a, b] = h.time.split('-').map((x) => hm(x))
  const l = h.lunch ? h.lunch.split('-').map((x) => hm(x)) : null
  return [DAY_NO[h.day], l ? [a, b, l[0], l[1]] : [a, b]]
})))

function buildBody(): string {
  const doctor = DOCTORS[0]
  const TEL = CLINIC.phone
  const TELRAW = CLINIC.phoneRaw
  const ADDR = CLINIC.address
  const ALL = [...CORE_TREATMENTS, ...GENERAL_TREATMENTS]
  const mapQ = encodeURIComponent(CLINIC.name + ' ' + CLINIC.addressDong)
  const book = (loc: string) => `href="/reservation" data-track="reservation" data-track-loc="${loc}"`
  const tel = (loc: string) => `href="tel:${TELRAW}" data-track="phone" data-track-loc="${loc}"`
  const kakao = CLINIC.sns.kakao

  return `
<div class="intro" aria-hidden="true">
  <div class="intro-in">
    <img src="/static/logo-mark@2x.png" alt="" width="64" height="90">
    <p class="intro-w"><span class="intro-a">두려움<i></i></span><span class="intro-b">안심</span></p>
    <p class="lat">The Good Dental Clinic · Myeongji</p>
  </div>
</div>
<a class="skip" href="#main">본문 바로가기</a>
<div class="prog" aria-hidden="true"><i></i></div>
<div class="cur" aria-hidden="true"><i></i></div>

<header class="hd" id="hd">
  <a class="hd-logo" href="/" aria-label="${e(CLINIC.name)} 홈"><img src="/static/logo-full@2x.png" alt="${e(CLINIC.name)}" width="309" height="96" fetchpriority="high" decoding="async"></a>
  <nav class="hd-nav" aria-label="주 메뉴">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <div class="hd-act">
    <span class="live" data-live data-hours='${HOURS_JSON}' role="status"><i></i><b>진료 시간 안내</b></span>
    <a class="hd-tel" ${tel('header')}>${TEL}</a>
    <a class="hd-login" href="/auth/login" data-track="login" data-track-loc="header">로그인·가입</a>
    <a class="btn btn-cy hd-book" ${book('header')}>예약</a>
    <button class="hd-menu" type="button" aria-expanded="false" aria-controls="drawer" aria-label="메뉴 열기"><i></i><i></i></button>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
  <nav aria-label="전체 메뉴">${DRAWER.map(([t, h], i) => `<a href="${h}"><span class="lat">${String(i + 1).padStart(2, '0')}</span><b>${t}</b></a>`).join('')}</nav>
  <div class="drawer-foot">
    <a ${tel('drawer')} class="drawer-tel">${TEL}</a>
    <p>${e(ADDR)}</p>
    <p class="drawer-auth"><a href="/auth/login" data-track="login" data-track-loc="drawer">로그인</a> · <a href="/auth/register" data-track="register" data-track-loc="drawer">회원가입</a>${kakao ? ` · <a href="${kakao}" target="_blank" rel="noopener" data-track="kakao" data-track-loc="drawer">카카오톡 상담</a>` : ''}</p>
  </div>
</div>

<main id="main" tabindex="-1">

<section class="hero" aria-labelledby="heroTitle">
  <div class="hero-pin">
    <div class="hero-media">
      <div class="hero-i2"><img src="/images/interior-reception.webp" alt="더착한치과 메인 인포메이션 데스크와 라운지" width="1600" height="1065" decoding="async"></div>
      <div class="hero-i1"><img src="/images/director-lobby.webp" alt="${e(CLINIC.name)} 대표원장 ${e(doctor.name)} — 통합치의학 전문의" width="900" height="1125" fetchpriority="high" decoding="sync"></div>
      <div class="hero-shade"></div>
      <p class="hero-name"><b>${e(doctor.name)}</b> 대표원장<small>치의학박사 · 통합치의학 전문의</small></p>
      <div class="hero-cap">
        <p class="lat">Since 2015 — Myeongji Ocean City</p>
        <p class="hero-cap-t lead">${pb('24년 임상,', '임플란트 15,000여 케이스.')} ${pb('실력으로 안심시켜드리는', '진료를 약속합니다.')}</p>
      </div>
    </div>
    <div class="hero-copy">
      <p class="eyebrow ko"><i></i>부산 명지 치과 · 통합치의학 전문의 진료</p>
      <h1 class="hero-h" id="heroTitle">${ln('치과 통증의 두려움을', '<mark class="hl">안심</mark>으로', '바꿉니다')}</h1>
      <p class="hero-sub" data-rv>${pb('치의학박사·통합치의학 전문의가', '디지털 가이드로')} ${pb('꼭 필요한 진료만 정확하게.')} ${pb('명지에서 오래 믿고 다니는', '치과를 만듭니다.')}</p>
      <div class="hero-cta" data-rv>
        <a class="btn btn-ink mag" ${book('hero')}>${icoCal}<span>${e(STORY_CTA.reserve)}</span></a>
        <a class="btn btn-line mag" ${tel('hero')}>${icoTel}<span>${TEL}</span></a>
      </div>
      <ul class="hero-trust" data-rv><li>편안한 마취 시스템</li><li>과잉진료 없는 진료</li><li>원내 기공실 보유</li></ul>
    </div>
    <p class="hero-scroll lat" aria-hidden="true"><i></i>Scroll</p>
  </div>
</section>

<section class="ans" aria-labelledby="ansTitle">
  <div class="wrap ans-in">
    <h2 class="ans-k" id="ansTitle">더착한치과는 어떤 곳인가요?</h2>
    <p class="ans-p" data-rv>더착한치과는 부산 강서구 명지오션시티 스타빌딩 6층에 있는 치과입니다. 2015년부터 명지에서, 치의학박사·통합치의학과 전문의 ${e(doctor.name)} 대표원장이 24년 임상 경험과 디지털 가이드 임플란트로 진료합니다. 편안한 마취로 통증을 줄이고, 꼭 필요한 진료만 설명드린 뒤에 시작합니다.</p>
    <dl class="spec">
      <div data-rv><dt>위치</dt><dd>${e(ADDR)} · <a href="${HUB_PATH}">부산 명지 치과</a> 안내</dd></div>
      <div data-rv><dt>진료 시간</dt><dd>월·수 09:00–20:00(야간) · 화·목·금 09:00–18:00 · 토 08:00–12:00 · 일요일 정기휴무</dd></div>
      <div data-rv><dt>의료진</dt><dd><a href="/doctors/${doctor.slug}">${e(doctor.name)} 대표원장</a> — ${e(doctor.license)}</dd></div>
      <div data-rv><dt>진료</dt><dd>${CORE_TREATMENTS.map((t) => `<a href="/treatments/${t.slug}">${e(t.shortName)}</a>`).join(' · ')} · <a href="/treatments">10개 진료과 통합 진료</a></dd></div>
      <div data-rv><dt>예약</dt><dd><a ${tel('answer')}>${TEL}</a> · <a ${book('answer')}>온라인 예약</a>${CLINIC.sns.naverBooking ? ` · <a href="${CLINIC.sns.naverBooking}" target="_blank" rel="noopener" data-track="naver_booking" data-track-loc="answer">네이버 예약</a>` : ''}</dd></div>
      <div data-rv><dt>주차</dt><dd>스타빌딩 지하 1·2층 30대 · 만차 시 주차비 지원</dd></div>
    </dl>
  </div>
</section>

<div class="marq" aria-hidden="true"><div class="marq-t">${[...MARQUEE, ...MARQUEE].map((m) => `<span>${m}</span><i></i>`).join('')}</div></div>

<section class="fb" id="fable-story" aria-labelledby="fbTitle">
  <div class="fb-pin">
    <header class="fb-hd">
      <p class="eyebrow"><i></i>A Patient’s Fable</p>
      <h2 class="h-lg" id="fbTitle">${ln('어떤 환자의', '<em>다섯 장짜리</em> 이야기')}</h2>
    </header>
    <div class="fb-track">
      ${STORY_CHAPTERS.map((s, i) => `<article class="fb-ch" id="fable-ch-${i + 1}">
        <span class="fb-no lat" aria-hidden="true">0${i + 1}</span>
        <p class="fb-label lat">Chapter ${i + 1} — ${e(s.label)}</p>
        <h3>${e(s.title)}</h3>
        <p class="fb-n">${e(s.narration)}</p>
        <div class="fb-g"><b>더착한치과의 답</b><p>${e(s.guide)}</p></div>
      </article>`).join('\n      ')}
      <div class="fb-end"><p>${pb('당신의 다음 장(章)을', '함께 쓰겠습니다')}</p><a class="btn btn-ink mag" ${book('fable')}>${icoCal}<span>${e(STORY_CTA.reserve)}</span></a></div>
    </div>
    <div class="fb-bar" aria-hidden="true"><span>두려움</span><div class="fb-line"><i></i><b></b></div><span class="on">안심</span></div>
  </div>
</section>

<section class="st" aria-label="숫자로 보는 더착한치과">
  <div class="wrap st-g">
    ${STATS.map((s) => `<div class="st-i" data-rv><p class="st-n"><span class="lat" data-count="${s.n}"${s.comma ? ' data-comma' : ''}>${s.comma ? s.n.toLocaleString('en-US') : s.n}</span>${s.u ? `<small>${s.u}</small>` : ''}</p><p class="st-l">${s.l}</p></div>`).join('\n    ')}
  </div>
</section>

<section class="pm" aria-labelledby="pmTitle">
  <div class="pm-pin">
    <div class="wrap pm-in">
      <header class="pm-hd">
        <p class="eyebrow on-d"><i></i>Why The Good Dental</p>
        <h2 class="h-lg" id="pmTitle">${ln('치과가 무섭다는 분께,', '<em>세 가지를 약속</em>드립니다')}</h2>
      </header>
      <ol class="pm-list">
        ${PROMISE.map((p, i) => `<li class="pm-row">
          <span class="pm-idx lat">0${i + 1}</span>
          <p class="pm-w" aria-hidden="true"><span>${p.worry}<i></i></span></p>
          <div class="pm-a"><h3>${p.t}</h3><p>${p.d}</p></div>
        </li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>

<section class="phi sec" aria-labelledby="phiTitle">
  <div class="wrap phi-g">
    <div class="phi-q">
      <p class="eyebrow"><i></i>Our Promise</p>
      <blockquote id="phiTitle" class="h-md">${ln('환자가 두려움 없이', '치과를 찾을 수 있도록,', '편안한 마취와 최소 절개 치료로', '<em>편안한 치료 경험</em>을 만듭니다.')}</blockquote>
      <p class="phi-c" data-rv><b>${e(doctor.name)} ${e(doctor.title)}</b> ${e(CLINIC.businessName)} · 치의학박사 · 통합치의학과 전문의</p>
    </div>
    <ol class="phi-v">
      ${CLINIC.philosophy.coreValues.map((v, i) => `<li data-rv><span class="lat">0${i + 1}</span><div><h3>${e(v.title)}</h3><p>${e(v.desc)}</p></div></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="co sec" aria-labelledby="coTitle">
  <div class="wrap">
    <header class="sec-hd">
      <p class="eyebrow"><i></i>Signature Treatments</p>
      <h2 class="h-lg" id="coTitle">${ln('가장 자신 있는', '<em>세 가지 진료</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('디지털 장비, 24년의 임상,', '그리고 원내 기공실.')} ${pb('핵심 진료를 한 곳에서 정확하게.')}</p>
    </header>
    <div class="co-stack">
      ${CORE_TREATMENTS.map((t, i) => { const x = CORE_EXTRA[t.slug] || { en: '', img: '' }; return `<a class="co-card co-${i}" href="/treatments/${t.slug}" style="--i:${i}">
        <div class="co-tx">
          <p class="co-no lat">0${i + 1} <span>/ 0${CORE_TREATMENTS.length}</span></p>
          <p class="co-tag">${e(t.shortName)}<span class="lat">${x.en}</span></p>
          <h3>${(x.lines || [t.name]).map((n) => `<span class="pb">${e(n)}</span>`).join(' ')}</h3>
          <p class="co-line">${e(t.tagline)}</p>
          <span class="co-more">자세히 보기 ${arrow}</span>
        </div>
        <div class="co-img">${x.img ? `<img src="${x.img}" alt="${e(t.name)}" width="1000" height="750" loading="lazy" decoding="async">` : ''}</div>
      </a>` }).join('\n      ')}
    </div>
  </div>
</section>

<section class="mj sec" id="myeongji-care" aria-labelledby="mj-home-title">
  <div class="wrap">
    <header class="sec-hd row">
      <div><p class="eyebrow"><i></i>Myeongji Care Guide</p>
      <h2 class="h-lg" id="mj-home-title">${ln('명지에서 받는', '<em>여섯 가지 진료</em>')}</h2></div>
      <p class="sec-lead" data-rv>${pb('명지오션시티 본원 기준으로')} ${pb('진료별 선택 기준과 내원 정보를')} ${pb('한 장씩 정리했습니다.')}</p>
    </header>
    <div class="mj-g">
      ${MYEONGJI_CARDS.map((c) => `<a class="mj-c" href="${c.url}" data-rv>
        <div class="mj-ph"><img src="${c.thumb}" alt="${e(c.alt)}" width="600" height="600" loading="lazy" decoding="async"></div>
        <p class="lat">${e(c.tag)}</p><h3>${e(c.name)}</h3><p class="mj-l">${e(c.line)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="dg sec" aria-labelledby="dgTitle">
  <div class="wrap dg-g">
    <div class="dg-left">
      <p class="eyebrow"><i></i>Digital Dentistry</p>
      <h2 class="h-lg" id="dgTitle">${ln('장비가 만드는', '<em>정확함의 차이</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('밀링기 2대 · 3D 프린터 3대 ·', '구강 스캐너.')} ${pb('진단부터 보철 제작까지 한 곳에서.')}</p>
      <figure class="dg-ph" data-clip><img src="/images/doctor-consult.webp" alt="${e(doctor.name)} 대표원장이 3D 파노라마 영상으로 환자에게 진료 계획을 설명하는 모습" width="1000" height="1000" loading="lazy" decoding="async"></figure>
    </div>
    <ol class="dg-list">
      ${DIGITAL.map((d, i) => `<li data-rv><span class="lat dg-no">0${i + 1}</span><div><p class="lat dg-k">${d.k}</p><h3>${d.t}</h3><p>${d.d}</p>${d.chips ? `<ul class="chips">${d.chips.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}</div></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="sp" id="clinic-space" aria-labelledby="spTitle">
  <div class="sp-stage"><div class="sp-pin">
    <div class="sp-media"><img src="/images/interior-lounge.webp" alt="더착한치과 대기 공간 — 우드톤 셸 체어 라운지" width="1600" height="1065" loading="lazy" decoding="async"><div class="sp-shade"></div></div>
    <div class="sp-copy">
      <p class="eyebrow"><i></i>Our Space</p>
      <h2 class="h-xl" id="spTitle">${ln('오시면,', '먼저 <em>편안해집니다</em>')}</h2>
      <p class="sp-lead">${pb('우드톤의 따뜻한 라운지와 넓은 동선.')} ${pb('치과 특유의 긴장을 덜어내도록')} ${pb('설계한 공간입니다.')}</p>
    </div>
  </div></div>
  <div class="wrap sp-g">
    <figure data-rv><img src="/images/interior-reception.webp" alt="더착한치과 메인 인포메이션 데스크와 라운지 — 원형 샹들리에 천장과 대리석 데스크" width="1600" height="1065" loading="lazy" decoding="async"><figcaption>메인 라운지 &amp; 인포메이션</figcaption></figure>
    <figure data-rv><img src="/images/interior-1.webp" alt="더착한치과 우드톤 라운지 전경 — 넓은 동선과 따뜻한 조명" width="1200" height="799" loading="lazy" decoding="async"><figcaption>우드톤 라운지 전경</figcaption></figure>
  </div>
</section>

<section class="dr sec" aria-labelledby="drTitle">
  <p class="dr-bg lat" aria-hidden="true">Dr. Hwang Wooseok</p>
  <div class="wrap dr-g">
    <figure class="dr-ph" data-clip><img src="${doctor.photo}" alt="${e(doctor.name)} ${e(doctor.title)}" width="900" height="1200" loading="lazy" decoding="async"><figcaption>${e(doctor.title)}</figcaption></figure>
    <div class="dr-tx">
      <p class="eyebrow ko"><i></i>${e(doctor.license)}</p>
      <h2 class="dr-name" id="drTitle">${ln(`${e(doctor.name)} <small>${e(doctor.title)}</small>`)}</h2>
      <p class="dr-tl h-md">${ln('저는 진료실에서 생각합니다 —', '말보다 <em>결과로</em> 신뢰를 쌓습니다')}</p>
      <p class="dr-p" data-rv>${e(doctor.philosophy)}</p>
      <ul class="chips" data-rv><li>치의학박사</li><li>통합치의학과 전문의</li><li>24년 임상 경력</li><li>디지털 가이드 임플란트</li></ul>
      <a class="btn btn-ink mag" href="/doctors/${doctor.slug}" data-rv><span>원장 프로필 자세히 보기</span>${arrow}</a>
    </div>
  </div>
</section>

<section class="op sec" id="operating" aria-labelledby="opTitle">
  <div class="wrap">
    <header class="sec-hd">
      <p class="eyebrow"><i></i>Hands-on Care</p>
      <h2 class="h-lg" id="opTitle">${ln('상담부터 식립까지,', '<em>원장이 직접</em>')}</h2>
      <p class="sec-lead" data-rv>${pb(`진단·상담·수술을 ${e(doctor.name)} 대표원장이`, '직접 진행합니다.')} ${pb('디지털 가이드와 최소 절개로,', '한 번에 정확하게.')}</p>
    </header>
    <div class="op-g">
      <figure class="op-c" data-par="-6"><img src="/images/op-team.webp" alt="${e(doctor.name)} 대표원장이 스태프와 함께 임플란트 수술을 진행하는 모습" width="800" height="1000" loading="lazy" decoding="async"><figcaption><span class="lat">01</span>직접 집도</figcaption></figure>
      <figure class="op-c" data-par="8"><img src="/images/op-focus.webp" alt="현미경급 집중으로 정밀하게 진료하는 모습" width="800" height="1000" loading="lazy" decoding="async"><figcaption><span class="lat">02</span>정밀 진료</figcaption></figure>
      <figure class="op-c" data-par="-4"><img src="/images/op-light.webp" alt="수술 조명 아래 식립을 진행하는 모습" width="800" height="1000" loading="lazy" decoding="async"><figcaption><span class="lat">03</span>정확한 식립</figcaption></figure>
    </div>
    <p class="note">실제 진료 현장을 촬영한 사진이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.</p>
  </div>
</section>

<section class="cs sec" id="case-stories" aria-labelledby="csTitle">
  <div class="wrap">
    <header class="sec-hd">
      <p class="eyebrow"><i></i>From the Chair</p>
      <h2 class="h-lg" id="csTitle">${ln('원장이 직접 들려주는', '<em>진료 이야기</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('24년 진료실에서 만난 분들의 이야기입니다.')} ${pb('개인정보 보호를 위해', '익명으로 각색했습니다.')}</p>
    </header>
    <div class="cs-list">
      ${CASE_STORIES.map((c, i) => `<article class="cs-c" data-rv>
        <div class="cs-ph"><img src="${c.image}" alt="${e(c.alt)}" width="800" height="500" loading="lazy" decoding="async"><span>${e(c.tag)}</span></div>
        <div class="cs-tx"><p class="lat cs-no">Story 0${i + 1}</p><h3>${e(c.title)}</h3>${c.body.map((b) => `<p>${e(b)}</p>`).join('')}<p class="cs-meta">${e(c.meta)}</p></div>
      </article>`).join('\n      ')}
    </div>
    <p class="note">위 사례는 실제 진료 경험을 바탕으로 하나, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.</p>
  </div>
</section>

<section class="sd sec" aria-labelledby="sdTitle">
  <div class="wrap sd-g">
    <header>
      <p class="eyebrow"><i></i>The Standard</p>
      <h2 class="h-lg" id="sdTitle">${ln('더착한치과가', '<em>진료하는 방식</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('같은 진료라도 장비와 시스템에 따라', '결과가 달라집니다.')} ${pb('더착한치과의 기준을 공개합니다.')}</p>
    </header>
    <dl class="sd-l">
      ${STANDARD.map(([k, v], i) => `<div data-rv><dt><span class="lat">0${i + 1}</span>${k}</dt><dd>${v}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="al sec" aria-labelledby="alTitle">
  <div class="wrap">
    <header class="sec-hd">
      <p class="eyebrow"><i></i>All Departments</p>
      <h2 class="h-lg" id="alTitle">${ln('한 곳에서 받는', '<em>모든 치과 진료</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('대학병원과 동일한 진료 시스템으로')} ${pb('10개 진료과를 통합 운영합니다.')}</p>
    </header>
    <div class="al-g">
      ${ALL.map((t, i) => `<a href="/treatments/${t.slug}" data-rv><span class="lat">${String(i + 1).padStart(2, '0')}</span><b>${e(t.shortName)}</b><small>${e(t.name)}</small>${arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="fq sec" id="home-faq" aria-labelledby="fqTitle">
  <div class="wrap fq-g">
    <header>
      <p class="eyebrow"><i></i>FAQ</p>
      <h2 class="h-lg" id="fqTitle">${ln('자주 묻는', '<em>질문</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('위치·진료시간·주차 등')} ${pb('가장 많이 물어보시는 내용을', '모았습니다.')}</p>
      <a class="btn btn-line" href="/faq" data-rv><span>전체 자주 묻는 질문 보기</span>${arrow}</a>
    </header>
    <div class="fq-l">
      ${HOME_FAQS.map((f, i) => `<details${i === 0 ? ' open' : ''} data-rv><summary><span class="lat">Q${i + 1}</span>${e(f.q)}<i></i></summary><p>${e(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="vs sec" id="visit" aria-labelledby="vsTitle">
  <div class="wrap">
    <header class="sec-hd">
      <p class="eyebrow"><i></i>Visit Us</p>
      <h2 class="h-lg" id="vsTitle">${ln('오시는 길,', '<em>어렵지 않습니다</em>')}</h2>
      <p class="sec-lead" data-rv>${pb('명지오션시티 스타빌딩 6층.')} ${pb('지하 주차장 30대 ·', '주차비 지원까지 챙겨드립니다.')}</p>
    </header>
    <div class="vs-g">
      <div class="vs-map" data-rv>
        <iframe title="더착한치과 위치 지도" src="https://www.google.com/maps?q=${encodeURIComponent(ADDR)}&amp;hl=ko&amp;z=17&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <div class="vs-apps">
          <a href="https://map.naver.com/p/search/${mapQ}" target="_blank" rel="noopener noreferrer" data-track="map" data-track-loc="home-visit-naver">네이버 지도</a>
          <a href="https://map.kakao.com/link/search/${mapQ}" target="_blank" rel="noopener noreferrer" data-track="map" data-track-loc="home-visit-kakao">카카오맵</a>
          <a href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(ADDR)}" target="_blank" rel="noopener noreferrer" data-track="map" data-track-loc="home-visit-google">길찾기</a>
        </div>
      </div>
      <div class="vs-info">
        <div class="vs-b" data-rv><h3>주소</h3><p class="vs-addr">${e(ADDR)}</p><a class="vs-tel lat" ${tel('home-visit')}>${TEL}</a></div>
        <div class="vs-b" data-rv><h3>진료시간</h3>
          <ul class="vs-h">${CLINIC.hours.map((h) => `<li data-day="${DAY_NO[h.day]}"${h.closed ? ' class="off"' : ''}><b>${h.day}</b><span${h.closed ? '' : ' class="lat"'}>${h.time}</span>${'note' in h && h.note ? `<em>${h.note}</em>` : ''}</li>`).join('')}</ul>
          <p class="note">${e(CLINIC.hoursNote)}</p>
        </div>
        <div class="vs-b" data-rv><h3>주차</h3><p>${e(CLINIC.directions.parkingDetail)}</p></div>
      </div>
    </div>
  </div>
</section>

<section class="cta" aria-labelledby="ctaTitle">
  <div class="cta-ring" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap cta-in">
    <p class="eyebrow on-c"><i></i>Your First Sentence</p>
    <h2 class="h-xl" id="ctaTitle">${ln('모든 이야기에는', '<em>첫 문장</em>이 필요합니다')}</h2>
    <p class="cta-p" data-rv>${pb('전화 한 통, 예약 한 번.')} ${pb('그것이 당신 이야기의', '첫 문장이 됩니다.')}</p>
    <div class="cta-b" data-rv>
      <a class="btn btn-w mag" ${book('cta')}>${icoCal}<span>${e(STORY_CTA.reserve)}</span></a>
      <a class="btn btn-wl mag" ${tel('cta')}>${icoTel}<span>${e(STORY_CTA.call)}</span></a>
    </div>
  </div>
</section>
</main>

<footer class="ft">
  <div class="wrap">
    <div class="ft-top">
      <div class="ft-brand">
        <a href="/"><img src="/static/logo-full@2x.png" alt="${e(CLINIC.name)}" width="206" height="64" loading="lazy"></a>
        <p>${e(CLINIC.brandSlogan)}</p>
        <p class="ft-addr">${e(ADDR)}</p>
        <p class="ft-quick"><a ${tel('footer')}>전화 ${TEL}</a><a href="/directions" data-track="directions" data-track-loc="footer">오시는 길</a><a ${book('footer')}>예약</a>${kakao ? `<a href="${kakao}" target="_blank" rel="noopener" data-track="kakao" data-track-loc="footer">카카오톡 채널</a>` : ''}</p>
      </div>
      <div class="ft-col"><p class="ft-h">진료안내</p>${CORE_TREATMENTS.map((t) => `<a href="/treatments/${t.slug}">${e(t.shortName)}</a>`).join('')}<a href="/treatments">전체 진료보기</a></div>
      <div class="ft-col"><p class="ft-h">병원안내</p><a href="/mission">병원소개</a><a href="/doctors">의료진</a><a href="/reviews-board">치료 후기</a><a href="/cases">비포/애프터</a><a href="/story-board">치과 이야기</a><a href="/directions">오시는 길</a></div>
      <div class="ft-col"><p class="ft-h">고객지원</p><a href="/reservation">진료예약</a><a href="/faq">자주 묻는 질문</a><a href="/pricing">비용 안내</a><a href="/notice">공지사항</a><a href="/encyclopedia">치과 백과사전</a></div>
      <div class="ft-col"><p class="ft-h">지역 안내</p>${AREAS.slice(0, 8).map((a) => a.slug === 'myeongji' ? `<a href="${HUB_PATH}">${e(HUB_ANCHOR)}</a>` : `<a href="/clinic/${a.slug}">${e(a.name)} 치과</a>`).join('')}</div>
    </div>
    <div class="ft-bottom">
      <p>상호: ${e(CLINIC.businessName)} | 대표자: ${e(CLINIC.director)} | 사업자등록번호: ${CLINIC.businessRegNo} | 대표전화: ${TEL} | 팩스: ${CLINIC.fax} | 개원: ${CLINIC.openedYear}년<br>주소: ${e(ADDR)} | 개인정보보호책임자: ${e(CLINIC.privacyOfficer)}</p>
      <p class="ft-links"><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a><a href="/sitemap.xml">사이트맵</a></p>
    </div>
    <p class="ft-dis">※ 본 홈페이지의 의료 정보는 일반적인 안내이며, 진료 효과 및 부작용은 환자 개인의 상태에 따라 다를 수 있습니다. 정확한 진단과 치료 계획은 반드시 내원하여 의료진과 상담하시기 바랍니다. 비급여 진료비용은 병원 내 게시 및 상담 시 안내해 드립니다. 본 사이트는 의료법 및 의료광고 사전심의 관련 규정을 준수합니다. © ${new Date().getFullYear()} ${e(CLINIC.name)}. All rights reserved.</p>
  </div>
</footer>

<nav class="bar" aria-label="빠른 상담">
  ${kakao ? `<a href="${kakao}" target="_blank" rel="noopener" class="bar-k" aria-label="카카오톡 상담" data-track="kakao" data-track-loc="float">${icoTalk}</a>` : ''}
  <a ${tel('float')}>${icoTel}<span>전화상담</span></a>
  <a ${book('float')} class="bar-m">${icoCal}<span>예약하기</span></a>
</nav>
`
}

const BODY = buildBody()

const Head: FC<{ fa: boolean }> = ({ fa }) => (
  <>
    <link rel="preload" as="image" href="/images/director-lobby.webp" fetchpriority="high" />
    <link rel="preload" as="font" type="font/woff2" href="/static/fonts/scd-800.woff2" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap" />
    {/* 공지 팝업의 아이콘 — 팝업이 있을 때만 */}
    {fa && <link rel="stylesheet" href={FA} media="print" onload="this.media='all'" />}
    <link rel="stylesheet" href={`/static/home-renew.css?v=${__HOME_RENEW_CSS_V__}`} />
    <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.className="js"+(matchMedia("(prefers-reduced-motion: reduce)").matches?" rm":"")' }} />
  </>
)

export const HomeRenewPage: FC<{ popups?: Notice[] }> = ({ popups = [] }) => (
  <Layout {...homeSeo()} bare headExtra={<Head fa={popups.length > 0} />}>
    {popups.length > 0 && <NoticePopups notices={popups} />}
    {raw(BODY)}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js" defer></script>
    <script src={`/static/home-renew.js?v=${__HOME_RENEW_JS_V__}`} defer></script>
  </Layout>
)
