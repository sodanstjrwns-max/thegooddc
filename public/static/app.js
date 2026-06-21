/* ============================================================
   더착한치과 — Interaction (calm & light)
   부드러운 리빌, 헤더, 모바일 메뉴, FAQ, 카운트업, before/after.
   요란한 모션 없음. 읽기 쉽고 가볍게.
   ============================================================ */
(function () {
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- HEADER scroll ---- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() { header.classList.toggle('scrolled', window.scrollY > 30); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- SCROLL PROGRESS fallback (browsers without animation-timeline: scroll()) ---- */
  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    if (CSS && CSS.supports && CSS.supports('animation-timeline: scroll()')) return; // CSS handles it
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? (h.scrollTop || window.scrollY) / max : 0) + ')';
    }
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
  }

  /* ---- MOBILE drawer ---- */
  function initDrawer() {
    var toggle = document.querySelector('.nav-toggle');
    var drawer = document.querySelector('.drawer');
    var backdrop = document.querySelector('.drawer-backdrop');
    var close = document.querySelector('.drawer-close');
    if (!toggle || !drawer) return;
    function open() {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function shut() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    if (backdrop) backdrop.addEventListener('click', shut);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
  }

  /* ---- REVEAL on scroll ---- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal,.reveal-up,.reveal-scale');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });

    /* failsafe: any element already within (or above) the viewport that the
       observer didn't catch (fast scroll, large sections) is revealed. */
    function sweep() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92) { el.classList.add('in'); io.unobserve(el); }
      });
    }
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
    sweep();

    /* absolute failsafe: 가로 캐러셀 등 observer/sweep가 못 잡는 요소도
       4초 후에는 무조건 노출해 콘텐츠가 사라지지 않도록 보장 */
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
    }, 4000);
  }

  /* ---- COUNT UP ---- */
  function initCountUp() {
    var nums = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dur = 1500, start = null, isYear = target > 1900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = isYear ? val : val.toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = isYear ? target : target.toLocaleString();
      }
      requestAnimationFrame(step);
    }
    if (prefersReduced) { nums.forEach(function (el) { el.textContent = el.getAttribute('data-count'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        item.classList.toggle('open');
        a.style.maxHeight = open ? '0px' : a.scrollHeight + 'px';
      });
    });
  }

  /* ---- BEFORE/AFTER slider ---- */
  function initBA() {
    document.querySelectorAll('.ba-slider').forEach(function (slider) {
      // .ba-after(이미지/패널)를 우선 선택. (.after 단독은 'After' 라벨과 충돌하므로 제외)
      var after = slider.querySelector('.ba-after');
      var handle = slider.querySelector('.ba-handle') || slider.querySelector('.handle');
      if (!after || !handle) return;
      var dragging = false;
      function move(clientX) {
        var r = slider.getBoundingClientRect();
        var pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
        after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
        handle.style.left = pct + '%';
      }
      slider.addEventListener('mousedown', function (e) { if (slider.querySelector('.ba-lock')) return; dragging = true; move(e.clientX); });
      window.addEventListener('mousemove', function (e) { if (dragging) move(e.clientX); });
      window.addEventListener('mouseup', function () { dragging = false; });
      slider.addEventListener('touchmove', function (e) { if (slider.querySelector('.ba-lock')) return; move(e.touches[0].clientX); }, { passive: true });
    });
  }

  /* ---- SPOTLIGHT (mouse glow) — sets @property typed --glow-x/--glow-y ---- */
  function initGlow() {
    if (prefersReduced) return;
    var cards = document.querySelectorAll('[data-glow]');
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--glow-y', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---- 3D TILT ---- */
  function initTilt() {
    if (prefersReduced || window.matchMedia('(hover: none)').matches) return;
    var MAX = 7; // deg
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var raf = null;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = 'perspective(900px) rotateX(' + (-py * MAX).toFixed(2) + 'deg) rotateY(' + (px * MAX).toFixed(2) + 'deg) translateY(-6px)';
        });
      });
      card.addEventListener('pointerleave', function () {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ---- PROGRESS RING ---- */
  function initRing() {
    var rings = document.querySelectorAll('.ring[data-ring]');
    if (!rings.length) return;
    function fill(el) {
      var pct = parseFloat(el.getAttribute('data-ring')) || 0;
      var circ = 2 * Math.PI * 52; // r=52
      var off = circ - (pct / 100) * circ;
      el.style.setProperty('--off', off);
      el.classList.add('on');
    }
    if (prefersReduced || !('IntersectionObserver' in window)) { rings.forEach(fill); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { fill(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    rings.forEach(function (el) { io.observe(el); });
  }

  /* ---- MAGNETIC BUTTONS — 커서를 끌어당김 ---- */
  function initMagnetic() {
    if (prefersReduced || window.matchMedia('(hover: none)').matches) return;
    var PULL = 0.32, MAXP = 14; // 끌림 비율 / 최대 px
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var raf = null;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * PULL;
        var dy = (e.clientY - (r.top + r.height / 2)) * PULL;
        dx = Math.max(-MAXP, Math.min(MAXP, dx));
        dy = Math.max(-MAXP, Math.min(MAXP, dy));
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          btn.style.setProperty('--mag-x', dx.toFixed(1) + 'px');
          btn.style.setProperty('--mag-y', dy.toFixed(1) + 'px');
        });
      });
      btn.addEventListener('pointerleave', function () {
        if (raf) cancelAnimationFrame(raf);
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ---- CUSTOM GLOW CURSOR — 마우스 따라다니는 빛 ---- */
  function initCursor() {
    if (prefersReduced || window.matchMedia('(hover: none)').matches) return;
    var dot = document.createElement('div');
    dot.className = 'glow-cursor';
    document.body.appendChild(dot);
    var x = 0, y = 0, cx = 0, cy = 0, raf = null, shown = false;
    function loop() {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!shown) { dot.classList.add('on'); shown = true; if (!raf) loop(); }
    });
    window.addEventListener('pointerleave', function () { dot.classList.remove('on'); });
    // 인터랙티브 요소 위에서 커지게
    document.querySelectorAll('a,button,[data-magnetic],[data-tilt],.bento-card,.assure-card,.core-card').forEach(function (el) {
      el.addEventListener('pointerenter', function () { dot.classList.add('big'); });
      el.addEventListener('pointerleave', function () { dot.classList.remove('big'); });
    });
  }

  /* ---- FILM GRAIN overlay ---- */
  function initGrain() {
    if (prefersReduced) return;
    if (document.querySelector('.grain')) return;
    var g = document.createElement('div');
    g.className = 'grain';
    g.setAttribute('aria-hidden', 'true');
    document.body.appendChild(g);
  }

  /* ---- FABLE spine fallback (no scroll-timeline support) ---- */
  function initFableSpine() {
    var fill = document.querySelector('.fable-spine-fill');
    var track = document.querySelector('.fable-track');
    if (!fill || !track) return;
    if (CSS && CSS.supports && CSS.supports('animation-timeline: scroll()')) return;
    function upd() {
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.85 - r.top) / (r.height + vh * 0.5);
      progress = Math.max(0, Math.min(1, progress));
      fill.style.transform = 'scaleY(' + progress + ')';
    }
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd, { passive: true });
  }

  /* ---- PATIENT FUNNEL phase filter ---- */
  function initFunnel() {
    var tabs = document.querySelectorAll('.fp-tab');
    var steps = document.querySelectorAll('.funnel-step');
    if (!tabs.length || !steps.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var phase = tab.getAttribute('data-phase');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        steps.forEach(function (s) {
          s.classList.toggle('dim', phase !== 'all' && s.getAttribute('data-phase') !== phase);
        });
      });
    });
  }

  /* ---- Smooth anchors ---- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ---- CONVERSION TRACKING ----
     data-track="phone|reservation|kakao|directions" 가 달린 요소 클릭을
     GA4 이벤트로 전송. gtag 미설치 시(=ID 미입력) 조용히 무시.
     페이션트 퍼널: 인지→방문→상담의 핵심 전환점을 측정한다. */
  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params || {});
      } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push(Object.assign({ event: name }, params || {}));
      }
    } catch (e) { /* 추적 실패는 사용자 경험에 영향 없음 */ }
  }

  var TRACK_EVENT = {
    phone:       'click_phone',        // 전화 상담
    reservation: 'click_reservation',  // 예약 페이지 진입
    kakao:       'click_kakao',         // 카카오 채널 상담
    directions:  'click_directions'    // 길찾기
  };

  function initTracking() {
    document.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
      if (!el) return;
      var kind = el.getAttribute('data-track');
      var loc = el.getAttribute('data-track-loc') || 'unknown';
      var evt = TRACK_EVENT[kind] || ('click_' + kind);
      track(evt, { event_category: 'engagement', event_label: loc, conversion_type: kind, location: loc });
    }, { passive: true });

    /* 예약 폼 제출 = 최상위 전환. data-track-form 으로 표시된 폼 */
    var resForm = document.querySelector('form[data-track-form="reservation"]');
    if (resForm) {
      resForm.addEventListener('submit', function () {
        track('reservation_submit', { event_category: 'conversion', event_label: 'reservation_form', conversion_type: 'reservation_submit' });
        track('generate_lead', { event_category: 'conversion', value: 1, currency: 'KRW' });
      });
    }
  }

  /* PWA: 서비스 워커 등록 (오프라인 + 앱 설치) */
  function initPWA() {
    if (!('serviceWorker' in navigator)) return;
    if (location.pathname.indexOf('/admin') === 0) return; /* 관리자 화면 제외 */
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  }

  function init() {
    initHeader(); initProgress(); initDrawer(); initReveal(); initCountUp(); initFaq(); initBA(); initAnchors();
    initGlow(); initTilt(); initRing();
    initGrain(); initFableSpine(); initFunnel();
    initTracking(); initPWA();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
