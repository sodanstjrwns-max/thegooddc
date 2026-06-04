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
      var after = slider.querySelector('.after') || slider.querySelector('.ba-after');
      var handle = slider.querySelector('.handle') || slider.querySelector('.ba-handle');
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

  /* ---- SPOTLIGHT (mouse glow) ---- */
  function initGlow() {
    if (prefersReduced) return;
    var cards = document.querySelectorAll('[data-glow]');
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
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

  function init() {
    initHeader(); initDrawer(); initReveal(); initCountUp(); initFaq(); initBA(); initAnchors();
    initGlow(); initTilt(); initRing();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
