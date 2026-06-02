// ============================================================
// 더착한치과 — 클라이언트 인터랙션
// 스크롤 reveal / 카운트업 / 헤더 / 모바일 메뉴 / 패럴랙스
// 성능: transform/opacity 위주, prefers-reduced-motion 존중
// ============================================================
(function () {
  'use strict'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---------- Header scroll ----------
  const header = document.querySelector('.site-header')
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add('scrolled')
      else header.classList.remove('scrolled')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  // ---------- Mobile menu ----------
  const toggle = document.querySelector('.nav-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('mobile-open')
      const open = header.classList.contains('mobile-open')
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>'
      header.classList.add('scrolled')
    })
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal, .reveal-scale')
  if (reduce) {
    reveals.forEach((el) => el.classList.add('in'))
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    reveals.forEach((el) => io.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('in'))
  }

  // ---------- Count up ----------
  const counters = document.querySelectorAll('[data-count]')
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target
          const target = parseFloat(el.dataset.count)
          const suffix = el.dataset.suffix || ''
          const dur = 1600
          const start = performance.now()
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            const val = target * eased
            el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          io2.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    counters.forEach((el) => io2.observe(el))
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || '')))
  }

  // ---------- Parallax (hero bg) ----------
  if (!reduce) {
    const px = document.querySelectorAll('[data-parallax]')
    if (px.length) {
      let ticking = false
      const update = () => {
        const y = window.scrollY
        px.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.3
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`
        })
        ticking = false
      }
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true }
      }, { passive: true })
    }
  }

  // ---------- Smooth anchor ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id.length > 1) {
        const t = document.querySelector(id)
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) }
      }
    })
  })

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item')
      item.classList.toggle('open')
    })
  })

  // ---------- Before/After slider ----------
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const handle = slider.querySelector('.ba-handle')
    const after = slider.querySelector('.ba-after')
    if (!handle || !after) return
    let dragging = false
    const move = (clientX) => {
      const rect = slider.getBoundingClientRect()
      let pct = ((clientX - rect.left) / rect.width) * 100
      pct = Math.max(0, Math.min(100, pct))
      after.style.clipPath = `inset(0 0 0 ${pct}%)`
      handle.style.left = pct + '%'
    }
    slider.addEventListener('mousedown', (e) => { dragging = true; move(e.clientX) })
    window.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX) })
    window.addEventListener('mouseup', () => { dragging = false })
    slider.addEventListener('touchstart', (e) => { dragging = true; move(e.touches[0].clientX) }, { passive: true })
    slider.addEventListener('touchmove', (e) => { if (dragging) move(e.touches[0].clientX) }, { passive: true })
    slider.addEventListener('touchend', () => { dragging = false })
  })
})();
