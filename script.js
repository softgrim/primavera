// ── URGENCY BANNER INIT ──
(function(){
  if(document.getElementById('urgency-banner')){
    document.body.classList.add('has-banner');
  }
})();

// ── NAV SLIDE DOWN ON SCROLL ──
(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  const THRESHOLD = 80;
  const MOBILE_BP = 1024;

  function checkNav(){
    // On tablet/mobile: always visible, no scroll gate
    if(window.innerWidth <= MOBILE_BP){
      nav.classList.add('nav-visible');
      return;
    }
    // Desktop: slide in after scrolling past threshold
    if(window.scrollY > THRESHOLD){
      nav.classList.add('nav-visible');
    } else {
      nav.classList.remove('nav-visible');
    }
  }

  window.addEventListener('scroll', checkNav, { passive:true });
  window.addEventListener('resize', checkNav, { passive:true });
  checkNav();
})();

// ── HAMBURGER MENU ──
(function(){
  const btn     = document.getElementById('nav-hamburger');
  const drawer  = document.getElementById('nav-drawer');
  const overlay = document.getElementById('nav-overlay');
  if(!btn || !drawer || !overlay) return;

  function openMenu(){
    btn.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    btn.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  // Close on any drawer link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeMenu();
  });
})();

// ── STICKY BOTTOM BAR — slide up after scrolling past hero ──
(function(){
  const bar = document.getElementById('sticky-bottom-bar');
  if(!bar) return;
  const threshold = window.innerHeight * 0.75;
  function check(){
    if(window.scrollY > threshold){
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

// ── FLOATING RIGHT CTA — slide in from right on scroll ──
(function(){
  const cta = document.getElementById('floating-cta');
  if(!cta) return;
  const threshold = window.innerHeight * 0.6;
  function check(){
    if(window.scrollY > threshold){
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

// ── PARALLAX LEMON EFFECT — scroll + mouse depth ──
(function(){
  const lemons = document.querySelectorAll('.lp-lemon');
  const closingLemons = document.querySelectorAll('.cl-lp');
  const productLemons = document.querySelectorAll('.prod-lp');
  let mx = 0, my = 0, cx = 0, cy = 0;
  let scrollY = 0, targetScrollY = 0;

  // Mouse parallax
  window.addEventListener('mousemove', e => {
    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    mx = (e.clientX - hw) / hw;
    my = (e.clientY - hh) / hh;
  });

  // Scroll parallax
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  let idleT = 0;
  function tick(){
    idleT += 0.006;
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.08;

    lemons.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0.5;
      const px = cx * depth * 22;
      const py = cy * depth * 14;
      const sy = scrollY * depth * 0.18;
      const fy = Math.sin(idleT + depth * 2.5) * 7;
      const rot = depth < 0.5 ? Math.sin(idleT * 0.7 + depth) * 4 : Math.sin(idleT * 0.5) * 1.5;
      el.style.transform = `translate(${px}px, ${py + fy - sy}px) rotate(${rot}deg)`;
    });

    closingLemons.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0.5;
      const px = cx * depth * 18;
      const py = cy * depth * 12;
      const fy = Math.sin(idleT * 0.9 + depth * 3.1) * 8;
      const rot = depth < 0.5 ? Math.sin(idleT * 0.65 + depth) * 5 : Math.sin(idleT * 0.45 + depth) * 2;
      el.style.transform = `translate(${px}px, ${py + fy}px) rotate(${rot}deg)`;
    });

    // Scroll parallax: offset relatif ke tengah section products
    const prodSec = document.querySelector('.products');
    let prodRelScroll = 0;
    if (prodSec) {
      const r = prodSec.getBoundingClientRect();
      // 0 saat section di tengah viewport, negatif saat scroll ke bawah
      prodRelScroll = (window.innerHeight * 0.5) - (r.top + r.height * 0.5);
    }

    productLemons.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0.5;
      const px = cx * depth * 32;
      const py = cy * depth * 22;
      // sy relatif ke posisi section — lemon bergerak seiring section masuk/keluar viewport
      const sy = prodRelScroll * depth * 0.38;
      const fy = Math.sin(idleT * 0.85 + depth * 2.8) * 16;
      const rot = depth < 0.4 ? Math.sin(idleT * 0.6 + depth) * 9 : Math.sin(idleT * 0.45 + depth) * 4;
      el.style.transform = `translate(${px}px, ${py + fy + sy}px) rotate(${rot}deg)`;
    });

    requestAnimationFrame(tick);
  }
  tick();
})();

// ── FLOATING BUBBLES — vertical only, natural bob ──
(function(){
  const bubbles = [
    { id:'fb1', ry:13, speed:0.0007, phase:0   },
    { id:'fb2', ry:10, speed:0.0009, phase:2.1 },
    { id:'fb3', ry:15, speed:0.0006, phase:4.2 },
    { id:'fb4', ry:11, speed:0.0010, phase:1.1 },
  ];

  bubbles.forEach(b => {
    const el = document.getElementById(b.id);
    if(!el) return;
    requestAnimationFrame(() => { b._el = el; });
  });

  let t = performance.now();
  function tick(now){
    const dt = now - t;
    t = now;
    bubbles.forEach(b => {
      if(!b._el) return;
      b.phase += b.speed * dt;
      const ty = Math.sin(b.phase) * b.ry;
      b._el.style.transform = `translateY(${ty}px)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.08});
document.querySelectorAll('.reveal-content').forEach(el => obs.observe(el));
