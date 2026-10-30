/* 더착한치과 메인 스크롤 몰입 연출 (GSAP ScrollTrigger + Lenis)
   - 톤: 따뜻한 종이 위의 에디토리얼 — 느리고 깊은 이징, 짧은 이동 거리, '책장을 넘기듯'
   - 글자는 모두 HTML에 그대로 두고 움직임만 더한다(크롤러·AEO 영향 없음, JS 꺼져도 전부 보임)
   - 동작 줄이기 사용자는 아무것도 하지 않는다 / 관성 스크롤은 마우스·트랙패드에서만 */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // app.js 의 reveal 이 먼저 붙은 뒤 시작해 클래스를 넘겨받는다
  function boot() { setTimeout(start, 160); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start() {
  var root = document.documentElement;
  root.classList.add('mx');
  var mobile = matchMedia('(max-width: 767px)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var EASE = 'expo.out';

  // 기존 .reveal(IntersectionObserver)은 히어로 밖에서만 넘겨받는다 — 히어로는 첫 화면 등장이 이미 진행 중
  document.querySelectorAll('main .reveal, main .reveal-up, main .reveal-scale').forEach(function (el) {
    if (el.closest('.hero')) return;
    el.classList.remove('reveal', 'reveal-up', 'reveal-scale', 'reveal-d1', 'reveal-d2', 'reveal-d3', 'in');
  });

  // 1) 관성 스크롤 — 마우스·트랙패드 환경만 (터치는 기본 스크롤)
  //    이 사이트 HTML 은 doctype 이 없어 호환 모드(BackCompat)로 렌더된다 — 그 모드에선 Lenis 가 창을 못 움직이므로 표준 모드일 때만
  var lenis = null;
  if (fine && window.Lenis && document.compatMode === 'CSS1Compat') {
    lenis = new Lenis({ duration: 1.3, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        lenis.scrollTo(target, { offset: -88 });
      }, true);
    });
  }

  // ── 엔진: 화면에 들어오면 한 번 재생, 빠르게 지나쳐도 끝 상태 보장
  var TIMING = ['duration', 'ease', 'stagger', 'delay'];
  var claimed = [];
  function claim(list) { gsap.utils.toArray(list).forEach(function (el) { claimed.push(el); }); }
  function isClaimed(el) { return claimed.some(function (c) { return c === el || c.contains(el) || el.contains(c); }); }
  function enter(targets, vars, trigger, startAt) {
    targets = gsap.utils.toArray(targets);
    if (!targets.length) return null;
    claim(targets);
    var from = {}, to = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, paused: true,
      onStart: function () { gsap.set(targets, { transition: 'none' }); },
      onComplete: function () { gsap.set(targets, { clearProps: 'opacity,transform,transition,clipPath' }); } };
    Object.keys(vars).forEach(function (k) { (TIMING.indexOf(k) > -1 ? to : from)[k] = vars[k]; });
    if ('clipPath' in from) to.clipPath = 'inset(0% 0% 0% 0%)';
    var tw = gsap.fromTo(targets, from, to);
    ScrollTrigger.create({ trigger: trigger || targets[0], start: startAt || 'top 88%', once: true, onEnter: function () {
      tw.play();
      setTimeout(function () { if (tw.progress() < 1) tw.progress(1); }, (tw.totalDuration() + 0.6) * 1000);
    } });
    return tw;
  }
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.textContent.split(/(\s+)/);
      if (parts.join('').trim() === '') return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var w = document.createElement('span'); w.className = 'mx-w';
        var i = document.createElement('span'); i.className = 'mx-wi'; i.textContent = p;
        w.appendChild(i); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.mx-wi');
  }
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return gsap.utils.toArray((ctx || document).querySelectorAll(sel)); };
  function scrub(target, from, to, st) {
    claim(target);
    return gsap.fromTo(target, from, Object.assign({ ease: 'none', scrollTrigger: Object.assign({ scrub: true }, st) }, to));
  }
  // 사진 시차: CSS translate 속성만 움직여 기존 hover 확대(transform)와 겹치지 않게
  function drift(img, box, amt) {
    if (!img || !box) return;
    box.classList.add('mx-par');
    gsap.fromTo(img, { translate: '0 ' + (-amt) + '%' }, { translate: '0 ' + amt + '%', ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ── 히어로: 원장 사진은 액자 안에서 천천히, 수치 카드는 서로 다른 속도로 — 종이 위 깊이감
  var hero = $('.hero');
  if (hero) {
    var hs = { trigger: hero, start: 'top top', end: 'bottom top' };
    drift($('.hero-frame img', hero), $('.hero-frame', hero), mobile ? 4 : 7);
    var s1 = $('.hero-stat.s1', hero), s2 = $('.hero-stat.s2', hero);
    if (s1) scrub(s1, { y: 0 }, { y: mobile ? -24 : -90 }, hs);
    if (s2) scrub(s2, { y: 0 }, { y: mobile ? -50 : -170 }, hs);
    // 히어로 글은 첫 등장(1s)이 끝난 뒤에만 스크롤에 연결한다
    var ht = $('.hero-text', hero);
    if (ht && !mobile) setTimeout(function () {
      gsap.set(ht, { transition: 'none' });
      scrub(ht, { y: 0, opacity: 1 }, { y: -80, opacity: 0.25 }, hs);
    }, 1300);
  }

  // ── 섹션 제목: CSS 의 줄 마스크 대신 낱말이 한 장씩 올라옴 (에디토리얼 세리프에 맞춰 느리게)
  $$('main .shead h2, .cta-band h2, #home-faq h2').forEach(function (h) {
    h.classList.add('mx-head');
    enter(splitWords(h), { yPercent: 105, duration: 1.25, ease: EASE, stagger: 0.055 }, h, 'top 88%');
  });
  $$('main .shead .eyebrow, main .shead > p, #home-faq .eyebrow, #home-faq h2 + p, .cta-band .eyebrow, .cta-band .inner > p').forEach(function (el) {
    if (isClaimed(el)) return;
    enter(el, { y: 16, opacity: 0, duration: 1.1, ease: EASE }, el, 'top 90%');
  });

  // ── 다섯 장짜리 이야기: 이야기 카드가 책장처럼 등뼈 쪽에서 펼쳐지고, 지금 읽는 장의 번호가 켜짐
  var chapters = $$('.fable-chapter');
  chapters.forEach(function (ch) {
    var card = $('.fable-card', ch), marker = $('.fable-marker', ch);
    gsap.set(ch, { perspective: 1400 });
    enter(card, { rotateY: mobile ? 0 : -14, x: mobile ? 0 : -30, y: mobile ? 30 : 0, opacity: 0, transformOrigin: '0% 50%',
      duration: 1.3, ease: EASE }, ch, 'top 85%');
    enter(marker, { scale: 0.4, opacity: 0, duration: 0.9, ease: 'back.out(2)' }, ch, 'top 85%');
    ScrollTrigger.create({ trigger: ch, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: ch, className: 'mx-on' } });
  });
  var coda = $('.fable-coda');
  if (coda) {
    coda.classList.add('mx-read');
    claim(coda);
    gsap.fromTo(splitWords(coda), { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: coda, start: 'top 88%', end: 'top 52%', scrub: true } });
  }

  // 숫자 세기(기존 app.js)가 0→최종값으로 자랄 때 칸 높이가 출렁이지 않게 최종 폭을 미리 잡아 둔다 (CLS)
  $$('.statband [data-count], .hero-stat [data-count]').forEach(function (n) {
    n.style.display = 'inline-block'; n.style.whiteSpace = 'nowrap'; n.style.textAlign = 'center';
    n.style.minWidth = Math.ceil(n.getBoundingClientRect().width) + 'px';
  });

  // ── 숫자 띠: 칸마다 아래에서 인쇄되듯 올라옴 (숫자 세기는 기존 그대로)
  var stats = $$('.statband .item');
  if (stats.length) enter(stats, { clipPath: 'inset(100% 0% 0% 0%)', y: 24, duration: 1.1, ease: EASE, stagger: 0.09 }, stats[0], 'top 90%');

  // ── 세 가지 약속: 카드가 한 장씩 내려앉고 번호가 따라옴
  var assure = $$('.assure-card');
  if (assure.length) {
    enter(assure, { y: mobile ? 40 : 80, scale: 0.94, opacity: 0, duration: 1.3, ease: EASE, stagger: 0.14 }, assure[0], 'top 88%');
    enter($$('.assure-card .idx'), { x: -18, opacity: 0, duration: 1, ease: EASE, stagger: 0.14, delay: 0.35 }, assure[0], 'top 88%');
  }

  // ── 철학: 원장의 문장이 스크롤에 맞춰 한 낱말씩 밝아짐, 가치 3줄은 오른쪽에서 차례로
  var bq = $('.philo-quote blockquote');
  if (bq) {
    bq.classList.add('mx-read');
    claim($('.philo-quote'));
    gsap.fromTo(splitWords(bq), { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: bq, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    var pq = $('.philo-quote');
    enter([$('.mark', pq), $('cite', pq)], { y: 20, opacity: 0, duration: 1.1, ease: EASE, stagger: 0.25 }, pq, 'top 85%');
  }
  var values = $$('.philo-values .value-row');
  if (values.length) enter(values, { x: mobile ? 30 : 70, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.12 }, values[0], 'top 88%');

  // ── 핵심 진료 3: 살짝 눕혀진 카드가 차례로 일어서고, 사진은 카드 안에서 천천히 흐름
  var core = $('.core-grid');
  if (core) {
    gsap.set(core, { perspective: 1200 });
    enter(core.children, { y: mobile ? 40 : 90, rotateX: mobile ? 0 : 10, opacity: 0, transformOrigin: '50% 0%',
      duration: 1.3, ease: EASE, stagger: 0.12 }, core, 'top 86%');
    $$('.core-card .cc-img').forEach(function (b) { drift($('img', b), b, 5); });
  }

  // ── 명지 진료 6장: 격자 대각선 방향으로 물결치듯
  var mj = $$('.mj-cards > li');
  if (mj.length) {
    enter(mj, { y: mobile ? 36 : 64, opacity: 0, duration: 1.15, ease: EASE,
      stagger: { each: 0.08, grid: 'auto', from: 'start' } }, mj[0], 'top 88%');
    $$('.mj-card-img').forEach(function (b) { drift($('img', b), b, 4); });
  }

  // ── 디지털(어두운 무대): 큰 카드가 다가오고 나머지 장비 카드는 깊은 곳에서 떠오름
  var feat = $('.bento .b-feature');
  if (feat) {
    scrub(feat, { scale: mobile ? 0.95 : 0.88, opacity: 0.35 }, { scale: 1, opacity: 1 }, { trigger: feat, start: 'top bottom', end: 'top 40%' });
    drift($('.bento-img img', feat), $('.bento-img', feat), 6);
  }
  var bentos = $$('.bento > .bento-card').filter(function (b) { return b !== feat; });
  if (bentos.length) enter(bentos, { scale: 0.86, y: 50, opacity: 0, duration: 1.2, ease: EASE,
    stagger: { each: 0.1, from: 'center' } }, $('.bento'), 'top 70%');
  var chipsB = $$('.bento-chips > span');
  if (chipsB.length) enter(chipsB, { y: 14, scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.08, delay: 0.4 }, chipsB[0], 'top 92%');

  // ── 원내 공간: 큰 사진은 문이 열리듯 가운데서 양쪽으로, 작은 사진은 옆에서 미끄러져 들어옴
  var spaceF = $('.space-card.space-feature');
  if (spaceF) enter(spaceF, { clipPath: 'inset(0% 50% 0% 50%)', duration: 1.5, ease: 'expo.inOut' }, spaceF, 'top 82%');
  var spaceS = $$('.space-card:not(.space-feature)');
  if (spaceS.length) enter(spaceS, { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.3, ease: 'expo.inOut', stagger: 0.15, delay: 0.25 }, spaceS[0], 'top 85%');
  $$('.space-card').forEach(function (f) { drift($('img', f), f, 5); });

  // ── 대표원장: 사진이 아래에서 위로 드러나고, 자격 칩은 하나씩 톡
  var dph = $('.doctor-photo');
  if (dph) {
    enter(dph, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, dph, 'top 82%');
    var rib = $('.ribbon', dph);
    if (rib) enter(rib, { x: -30, opacity: 0, duration: 1, ease: EASE, delay: 0.9 }, dph, 'top 82%');
    drift($('img', dph), dph, 5);
  }
  var dinfo = $('.doctor-info');
  if (dinfo) {
    enter([$('.lic', dinfo), $('h3', dinfo), $('.tl', dinfo), $('.ph-text', dinfo)].filter(Boolean),
      { y: 30, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1 }, dinfo, 'top 86%');
    enter($$('.cred', dinfo), { y: 16, scale: 0.85, opacity: 0, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.07 }, $('.doctor-creds', dinfo), 'top 92%');
  }

  // ── 직접 집도: 세 장이 엇갈린 높이에서 내려와 나란히 섬
  var ops = $$('.op-card');
  if (ops.length) {
    enter(ops, { y: function (i) { return mobile ? 40 : 60 + i * 40; }, opacity: 0, duration: 1.3, ease: EASE, stagger: 0.12 }, ops[0], 'top 86%');
    ops.forEach(function (f) { drift($('img', f), f, 5); });
  }

  // ── 진료 이야기: 좌우에서 번갈아 들어옴
  var cases = $$('.case-card');
  cases.forEach(function (c, i) {
    enter(c, { x: mobile ? 0 : (i % 2 ? 60 : -60), y: mobile ? 40 : 20, opacity: 0, duration: 1.25, ease: EASE }, c, 'top 88%');
    drift($('.case-photo img', c), $('.case-photo', c), 4);
  });

  // ── 진료 기준표: 한 줄씩 쓰여지듯, 체크 표시는 뒤따라 톡
  var crow = $$('.compare-table .row');
  if (crow.length) {
    claim($('.compare-table'));
    enter(crow, { x: -26, opacity: 0, duration: 1, ease: EASE, stagger: 0.09 }, crow[0], 'top 88%');
    enter($$('.compare-table .cell.us i'), { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.4)', stagger: 0.09, delay: 0.4 }, crow[0], 'top 88%');
  }

  // ── 모든 진료과: 칩이 가운데부터 퍼지며 톡톡
  var tl = $$('.tlist-grid > .tlist-card');
  if (tl.length) enter(tl, { scale: 0.82, y: 20, opacity: 0, duration: 0.8, ease: 'back.out(1.6)',
    stagger: { each: 0.05, grid: 'auto', from: 'center' } }, $('.tlist-grid'), 'top 88%');

  // ── 자주 묻는 질문: 질문이 차례로
  var faqs = $$('.home-faq-item');
  if (faqs.length) { claim($('.home-faq-list')); enter(faqs, { y: 24, opacity: 0, duration: 1, ease: EASE, stagger: 0.07 }, faqs[0], 'top 90%'); }

  // ── 오시는 길: 지도가 살짝 다가오고 안내 블록은 차례로
  var vmap = $('.visit-map');
  if (vmap) {
    claim($('.visit-grid'));
    enter(vmap, { scale: 0.95, y: 30, opacity: 0, duration: 1.3, ease: EASE }, vmap, 'top 86%');
    enter($$('.visit-info .visit-block'), { y: 30, opacity: 0, duration: 1.1, ease: EASE, stagger: 0.1, delay: 0.15 }, vmap, 'top 86%');
  }

  // ── 첫 문장(CTA): 여정의 별자리가 스크롤에 맞춰 하나씩 켜짐
  var band = $('.cta-band');
  if (band) {
    var nodes = $$('.ctav-node', band);
    if (nodes.length) {
      claim(nodes);
      var ntl = gsap.timeline({ scrollTrigger: { trigger: band, start: 'top 85%', end: 'center 45%', scrub: true } });
      nodes.forEach(function (n, i) {
        ntl.fromTo(n, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%', transformBox: 'fill-box' },
          { opacity: 1, scale: 1.6, duration: 0.6, ease: 'power2.out' }, i * 0.45)
          .to(n, { scale: 1, duration: 0.4 }, i * 0.45 + 0.6);
      });
    }
    var acts = $$('.cta-band .actions > a');
    if (acts.length) enter(acts, { y: 24, opacity: 0, duration: 1, ease: EASE, stagger: 0.1 }, acts[0], 'top 95%');
  }

  // ── 나머지: 아직 아무 연출이 없는 블록은 기본 등장
  $$('main section > .container > *, main section > .container-wide > *').forEach(function (el) {
    if (el.closest('.hero, .marquee-band') || /STYLE|SCRIPT/.test(el.tagName) || isClaimed(el)) return;
    if (el.getBoundingClientRect().height < 8) return;
    enter(el, { y: 40, opacity: 0, duration: 1.2, ease: EASE }, el, 'top 90%');
  });

  // 주소에 #앵커가 있으면 — 트리거 계산이 브라우저의 앵커 이동을 끊으므로 다시 그 자리로
  var touched = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { touched = true; }, { once: true, passive: true }); });
  function toHash() {
    var id = location.hash;
    if (touched) return;
    if (id.length < 2) return;
    var t; try { t = document.querySelector(decodeURIComponent(id)); } catch (e) { return; }
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.pageYOffset - 88;
    if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
  }
  ScrollTrigger.refresh();
  toHash();
  // 이미지가 늦게 로드되면 위치 다시 계산
  window.addEventListener('load', function () { ScrollTrigger.refresh(); toHash(); });
  }
})();
