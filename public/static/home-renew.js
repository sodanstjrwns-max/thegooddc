/* 더착한치과 새 홈 (2026-11-23, routes/home-renew.tsx) — 스크롤 연출 · 클릭 측정 */
;(function () {
  var doc = document.documentElement
  var RM = doc.classList.contains('rm')
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var mobile = matchMedia('(max-width:860px)')

  /* ---- 등장: 제목 줄 마스크 · 본문 · 사진 ---- */
  var heads = $$('.h-xl,.h-lg,.h-md,.dr-name').filter(function (h) { return !h.closest('.hero') })
  var rvs = $$('[data-rv],[data-clip]').filter(function (h) { return !h.closest('.hero') })
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    heads.concat(rvs).forEach(function (el) { io.observe(el) })
  } else {
    heads.concat(rvs).forEach(function (el) { el.classList.add('in') })
  }
  // 인트로가 걷힌 뒤 첫 화면 등장
  var seen = false
  try { seen = sessionStorage.getItem('tg_intro') === '1'; sessionStorage.setItem('tg_intro', '1') } catch (e) {}
  var intro = $('.intro')
  if (seen && intro) intro.style.display = 'none'
  setTimeout(function () {
    $$('.hero-h,.hero [data-rv]').forEach(function (el, i) { setTimeout(function () { el.classList.add('in') }, i * 110) })
  }, RM || seen ? 60 : 1850)

  /* ---- 숫자 올라가기 ---- */
  var counts = $$('[data-count]')
  if ('IntersectionObserver' in window && !RM) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return
        cio.unobserve(e.target)
        var el = e.target, to = +el.dataset.count, comma = el.hasAttribute('data-comma')
        var from = to > 1900 && to < 2100 ? to - 24 : 0, t0 = performance.now(), dur = 1600
        ;(function tick(t) {
          var p = Math.min(1, (t - t0) / dur), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 4)))
          el.textContent = comma ? v.toLocaleString('en-US') : String(v)
          if (p < 1) requestAnimationFrame(tick)
        })(t0)
      })
    }, { threshold: 0.5 })
    counts.forEach(function (c) { cio.observe(c) })
  }

  /* ---- 지금 진료 중인지 (KST) ---- */
  ;(function () {
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 540) * 60000)
    var d = now.getDay(), m = now.getHours() * 60 + now.getMinutes()
    var today = $('.vs-h [data-day="' + d + '"]'); if (today) today.classList.add('today')
    var live = $('[data-live]'); if (!live) return
    var H = {}; try { H = JSON.parse(live.getAttribute('data-hours') || '{}') } catch (e) {}
    var t = function (v) { return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0') }
    var h = H[d], txt = '오늘은 휴진'
    if (h) {
      if (m < h[0]) txt = '오늘 ' + t(h[0]) + ' 진료 시작'
      else if (m >= h[1]) txt = '오늘 진료 종료'
      else if (h.length > 2 && m >= h[2] && m < h[3]) txt = '점심시간 · ' + t(h[3]) + ' 재개'
      else { txt = '진료 중 · ' + t(h[1]) + '까지'; live.classList.add('on') }
    }
    live.querySelector('b').textContent = txt
  })()

  /* ---- 클릭 측정 (기존 app.js 와 같은 이벤트 이름) ---- */
  var TRACK = { phone: 'click_phone', reservation: 'click_reservation', kakao: 'click_kakao', directions: 'click_directions' }
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-track]') : null
    if (!el) return
    var kind = el.getAttribute('data-track'), loc = el.getAttribute('data-track-loc') || 'unknown'
    var p = { event_category: 'engagement', event_label: loc, conversion_type: kind, location: loc }
    try {
      if (typeof window.gtag === 'function') window.gtag('event', TRACK[kind] || ('click_' + kind), p)
      else if (window.dataLayer && window.dataLayer.push) window.dataLayer.push(Object.assign({ event: TRACK[kind] || ('click_' + kind) }, p))
    } catch (e) {}
  }, { passive: true })
  if ('serviceWorker' in navigator) addEventListener('load', function () { navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {}) })

  /* ---- 메뉴 ---- */
  var menu = $('.hd-menu'), drawer = $('#drawer'), lenis = null
  if (menu) menu.addEventListener('click', function () {
    var open = menu.getAttribute('aria-expanded') !== 'true'
    menu.setAttribute('aria-expanded', String(open))
    menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
    drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open))
    if (lenis) open ? lenis.stop() : lenis.start()
    document.body.style.overflow = open ? 'hidden' : ''
  })

  /* ---- 머리 줄: 내려가면 숨고 올라오면 나옴 ---- */
  var hd = $('#hd'), lastY = 0, bar = $('.prog i')
  function onScroll(y) {
    hd.classList.toggle('sc', y > 20)
    hd.classList.toggle('hide', y > lastY && y > 600 && !drawer.classList.contains('open'))
    lastY = y
    var max = doc.scrollHeight - innerHeight
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')'
  }
  addEventListener('scroll', function () { onScroll(scrollY) }, { passive: true })
  onScroll(scrollY)

  if (RM || !window.gsap || !window.ScrollTrigger) return
  gsap.registerPlugin(ScrollTrigger)

  /* ---- 관성 스크롤 ---- */
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, prevent: function () { var o = document.getElementById('npop-overlay'); return !!(o && !o.hidden && !o.classList.contains('npop-compact')) || document.body.style.overflow === 'hidden' } })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
  }

  /* ---- 커서 ---- */
  var cur = $('.cur')
  if (cur && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' })
    addEventListener('mousemove', function (e) { qx(e.clientX); qy(e.clientY) }, { passive: true })
    document.addEventListener('mouseover', function (e) { cur.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,summary'))) })
    $$('.mag').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 }) })
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.5)' }) })
    })
  }

  var ST = function (el, extra) { return Object.assign({ trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }, extra || {}) }

  /* ---- 01 첫 화면: 원장 사진 틀이 병원 전체로 펼쳐짐 ---- */
  ;(function () {
    var hero = $('.hero'); if (!hero) return
    var pin = $('.hero-pin'), cs = function (v) { return getComputedStyle(pin).getPropertyValue(v).trim() }
    var from = function () { return 'inset(' + cs('--bt') + ' ' + cs('--br') + ' ' + cs('--bb') + ' ' + cs('--bl') + ' round 28px)' }
    var tl = gsap.timeline({ scrollTrigger: ST(hero), defaults: { ease: 'none' } })
    tl.fromTo('.hero-media', { clipPath: from }, { clipPath: 'inset(0vh 0vw 0vh 0vw round 0px)', duration: 0.62, ease: 'power2.inOut' }, 0.04)
      .to('.hero-copy', { autoAlpha: 0, x: -60, duration: 0.26 }, 0.04)
      .to('.hero-scroll,.hero-name', { autoAlpha: 0, duration: 0.14 }, 0.04)
      .to('.hero-i1', { autoAlpha: 0, scale: 1.08, duration: 0.3 }, 0.2)
      .to('.hero-shade', { opacity: 1, duration: 0.3 }, 0.3)
      .fromTo('.hero-i2 img', { scale: 1.22 }, { scale: 1, duration: 0.9 }, 0.04)
      .fromTo('.hero-cap', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.58)
  })()

  /* ---- 03 다섯 장: 세로 스크롤 → 가로 이동, 회색(두려움)에서 맑은 하늘색(안심)으로 ---- */
  ;(function () {
    var fb = $('.fb'); if (!fb) return
    var track = $('.fb-track'), pin = $('.fb-pin')
    var dist = function () { return -(track.scrollWidth - innerWidth) }
    var tl = gsap.timeline({ scrollTrigger: ST(fb), defaults: { ease: 'none' } })
    tl.to(track, { x: dist, duration: 1 }, 0)
      .fromTo(pin, { '--fbbg': '#E3E8EB' }, { '--fbbg': '#D6F1FC', duration: 1 }, 0)
      .fromTo('.fb-line i', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      .fromTo('.fb-line b', { left: '0%' }, { left: '100%', duration: 1 }, 0)
    $$('.fb-ch').forEach(function (ch) {
      gsap.fromTo(ch.querySelector('.fb-no'), { yPercent: 30, rotate: -8 }, { yPercent: -10, rotate: 4, ease: 'none', scrollTrigger: { trigger: ch, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } })
    })
  })()

  /* ---- 05 세 가지 약속: 걱정에 줄을 긋고 약속이 켜짐 ---- */
  ;(function () {
    var pm = $('.pm'); if (!pm) return
    var rows = $$('.pm-row')
    gsap.set('.pm-w i', { scaleX: 0 }); gsap.set('.pm-w', { color: 'rgba(255,255,255,.92)' }); gsap.set('.pm-a', { autoAlpha: 0.12, x: 30 })
    var tl = gsap.timeline({ scrollTrigger: ST(pm, { start: 'top top', end: 'bottom bottom' }), defaults: { ease: 'none' } })
    rows.forEach(function (r, i) {
      var at = 0.06 + i * 0.3
      tl.to(r.querySelector('.pm-w i'), { scaleX: 1, duration: 0.12, ease: 'power2.inOut' }, at)
        .to(r.querySelector('.pm-w'), { color: 'rgba(255,255,255,.28)', duration: 0.1 }, at + 0.08)
        .to(r.querySelector('.pm-a'), { autoAlpha: 1, x: 0, duration: 0.14, ease: 'power2.out' }, at + 0.1)
    })
    tl.to({}, { duration: 0.08 })
  })()

  /* ---- 07 쌓이는 카드: 아래 카드가 올라오면 위 카드가 살짝 물러남 ---- */
  $$('.co-card').forEach(function (c, i, all) {
    if (i === all.length - 1) return
    gsap.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: 0.93, filter: 'brightness(0.95)', ease: 'none', scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } })
  })

  /* ---- 10 공간: 작은 창이 화면 전체로 ---- */
  ;(function () {
    var st = $('.sp-stage'); if (!st) return
    var media = $('.sp-media'), from = getComputedStyle(media).clipPath
    var tl = gsap.timeline({ scrollTrigger: ST(st), defaults: { ease: 'none' } })
    tl.fromTo(media, { clipPath: mobile.matches ? 'inset(58% 7% 12% 7% round 24px)' : 'inset(56% 24% 7% 24% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6, ease: 'power2.inOut' }, 0.05)
      .fromTo('.sp-media img', { scale: 1.3 }, { scale: 1, duration: 0.95 }, 0.05)
      .to('.sp-shade', { opacity: 1, duration: 0.3 }, 0.25)
      .to('.sp-copy', { color: '#fff', y: function () { return innerHeight * 0.16 }, duration: 0.34 }, 0.25)
      .to('.sp-pin', { '--emc': '#43C8F4', duration: 0.3 }, 0.25)
  })()

  /* ---- 흐르는 요소들 ---- */
  var drbg = $('.dr-bg')
  if (drbg) gsap.fromTo(drbg, { xPercent: 4 }, { xPercent: -38, ease: 'none', scrollTrigger: { trigger: '.dr', start: 'top bottom', end: 'bottom top', scrub: true } })
  if (!mobile.matches) $$('[data-par]').forEach(function (el) {
    var v = +el.dataset.par
    gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
  })
  $$('.mj-ph img,.cs-ph img,.sp-g img').forEach(function (img) {
    gsap.fromTo(img, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } })
  })

  addEventListener('load', function () { ScrollTrigger.refresh() })
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh() })
})()
