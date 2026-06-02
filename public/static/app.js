/* ============================================================
   더착한치과 — 2026 Interaction Engine
   GSAP + ScrollTrigger + Lenis (loaded via CDN in Layout)
   Graceful fallback to IntersectionObserver if libs absent.
   ============================================================ */
(function () {
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 900;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasLenis = typeof window.Lenis !== 'undefined';

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  var lenis = null;
  function initLenis() {
    if (!hasLenis || prefersReduced || isTouch) return;
    lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      lerp: 0.09,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    }
    document.documentElement.classList.add('lenis');
  }

  /* ---------- HEADER SCROLL STATE ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- MOBILE DRAWER ---------- */
  function initDrawer() {
    var toggle = document.querySelector('.nav-toggle');
    var drawer = document.querySelector('.mobile-drawer');
    var close = document.querySelector('.drawer-close');
    if (!toggle || !drawer) return;
    function open() { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; if (lenis) lenis.stop(); }
    function shut() { drawer.classList.remove('open'); document.body.style.overflow = ''; if (lenis) lenis.start(); }
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
  }

  /* ---------- CUSTOM CURSOR ---------- */
  function initCursor() {
    if (isTouch || prefersReduced) return;
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('cursor-on');
    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a,button,.magnetic,[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-mag') || '0.35');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- REVEAL (GSAP or IO fallback) ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal,.reveal-up,.reveal-scale,.line-reveal');
    if (prefersReduced) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    if (hasGSAP && window.ScrollTrigger) {
      els.forEach(function (el) {
        window.ScrollTrigger.create({
          trigger: el, start: 'top 88%',
          onEnter: function () { el.classList.add('in'); },
        });
      });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- HERO KINETIC TITLE ---------- */
  function initHeroTitle() {
    var title = document.querySelector('.hero-title');
    if (!title || prefersReduced) { if (title) title.classList.add('in'); return; }
    if (!hasGSAP) { title.classList.add('in'); return; }
    var lines = title.querySelectorAll('.line .word, .line .grad');
    window.gsap.set(lines, { yPercent: 115, opacity: 0 });
    window.gsap.to(lines, {
      yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.07,
      ease: 'expo.out', delay: 0.25,
    });
    // badge + sub + actions cascade
    window.gsap.from('.hero-badge', { y: 20, opacity: 0, duration: .8, delay: .1, ease: 'power3.out' });
    window.gsap.from('.hero-sub', { y: 24, opacity: 0, duration: .9, delay: .7, ease: 'power3.out' });
    window.gsap.from('.hero-actions', { y: 24, opacity: 0, duration: .9, delay: .85, ease: 'power3.out' });
    window.gsap.from('.hero-rail .m', { y: 20, opacity: 0, duration: .8, stagger: .1, delay: 1, ease: 'power3.out' });
  }

  /* ---------- HERO PARALLAX (mesh + content on scroll) ---------- */
  function initHeroParallax() {
    if (prefersReduced) return;
    var hero = document.querySelector('.hero');
    var mesh = document.querySelector('.hero-mesh');
    if (!hero) return;
    if (hasGSAP && window.ScrollTrigger) {
      if (mesh) window.gsap.to(mesh, { yPercent: 22, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      window.gsap.to('.hero-inner', { yPercent: 18, opacity: .3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
    // mouse-follow mesh
    if (!isTouch && mesh) {
      hero.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 30;
        var y = (e.clientY / window.innerHeight - 0.5) * 30;
        mesh.style.translate = x + 'px ' + y + 'px';
      });
    }
  }

  /* ---------- COUNT UP ---------- */
  function initCountUp() {
    var nums = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dur = 1600, start = null, isYear = target > 1900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(eased * target);
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

  /* ---------- STICKY SCROLL SEQUENCE ---------- */
  function initStickySequence() {
    var wrap = document.querySelector('.sticky-wrap');
    if (!wrap) return;
    var steps = wrap.querySelectorAll('.sticky-step');
    var visuals = wrap.querySelectorAll('.sticky-visual .v');
    var bar = wrap.querySelector('.sticky-progress .bar');
    var n = steps.length;
    function setActive(idx) {
      steps.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      visuals.forEach(function (v, i) { v.classList.toggle('active', i === idx); });
    }
    setActive(0);
    if (hasGSAP && window.ScrollTrigger && !prefersReduced) {
      window.ScrollTrigger.create({
        trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: function (self) {
          var idx = Math.min(n - 1, Math.floor(self.progress * n));
          setActive(idx);
          if (bar) bar.style.width = (self.progress * 100) + '%';
        },
      });
    } else {
      // fallback: observe each step section
      var stage = wrap.querySelector('.sticky-stage');
      window.addEventListener('scroll', function () {
        var r = wrap.getBoundingClientRect();
        var total = wrap.offsetHeight - window.innerHeight;
        var p = Math.min(1, Math.max(0, -r.top / total));
        var idx = Math.min(n - 1, Math.floor(p * n));
        setActive(idx);
        if (bar) bar.style.width = (p * 100) + '%';
      }, { passive: true });
    }
  }

  /* ---------- PARALLAX IMG ELEMENTS ---------- */
  function initParallaxImgs() {
    if (prefersReduced || !hasGSAP || !window.ScrollTrigger) return;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      window.gsap.to(el, { yPercent: amt * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- MARQUEE duplicate for seamless loop ---------- */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(function (track) {
      if (track.children.length === 1) {
        var clone = track.children[0].cloneNode(true);
        track.appendChild(clone);
      }
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
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

  /* ---------- BEFORE/AFTER SLIDER ---------- */
  function initBASliders() {
    document.querySelectorAll('.ba-slider').forEach(function (slider) {
      var after = slider.querySelector('.after');
      var handle = slider.querySelector('.handle');
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
      slider.addEventListener('touchstart', function (e) { if (slider.querySelector('.ba-lock')) return; move(e.touches[0].clientX); }, { passive: true });
      slider.addEventListener('touchmove', function (e) { if (slider.querySelector('.ba-lock')) return; move(e.touches[0].clientX); }, { passive: true });
    });
  }

  /* ---------- ANCHOR SMOOTH (via lenis) ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -90 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    initLenis();
    initHeader();
    initDrawer();
    initCursor();
    initMagnetic();
    initMarquee();
    initReveal();
    initHeroTitle();
    initHeroParallax();
    initParallaxImgs();
    initCountUp();
    initStickySequence();
    initFaq();
    initBASliders();
    initAnchors();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
