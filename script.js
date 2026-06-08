// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cx += (mx - cx) * 0.18;
  cy += (my - cy) * 0.18;
  rx += (mx - rx) * 0.09;
  ry += (my - ry) * 0.09;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  ring.style.left   = rx + 'px';
  ring.style.top    = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .pill, .project-link-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.transform   = 'translate(-50%,-50%) scale(1.5)';
    ring.style.borderColor = 'rgba(255,111,60,.9)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform   = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = 'rgba(255,111,60,.5)';
  });
});

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 500);

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Back to Top
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== REVEAL ANIMATIONS =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  revealObserver.observe(el);
});

// ===== HERO COUNTER =====
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isFloat = String(target).includes('.');
    let start = 0;
    const dur = 1800;
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = start + (target - start) * ease;
      el.textContent = isFloat ? val.toFixed(2) + suffix : Math.floor(val) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-num').forEach(el => counterObserver.observe(el));

// ===== INTERACTIVE BLACK HOLE =====
(function initBlackhole() {
  const canvas = document.getElementById('blackhole-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cx_bh, cy_bh;
  let mouseX = 0.5, mouseY = 0.5;
  let targetX = 0.5, targetY = 0.5;
  let isHovering = false;
  let time = 0;

  // Particle system
  const PARTICLE_COUNT = 320;
  const particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx_bh = W * 0.72;
    cy_bh = H * 0.5;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      const angle = Math.random() * Math.PI * 2;
      const radius = init
        ? 80 + Math.random() * Math.max(W, H) * 0.5
        : Math.max(W, H) * 0.4 + Math.random() * Math.max(W, H) * 0.35;
      this.x = cx_bh + Math.cos(angle) * radius;
      this.y = cy_bh + Math.sin(angle) * radius;
      this.vx = 0;
      this.vy = 0;
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.55 + 0.15;
      this.size = Math.random() * 1.8 + 0.3;
      this.hue = 15 + Math.random() * 25;
      this.trail = [];
      this.maxTrail = Math.floor(3 + Math.random() * 8);
      this.alive = true;
    }

    update(bx, by, pull) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();

      const dx = bx - this.x;
      const dy = by - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Gravity
      const grav = pull * 18000 / (dist * dist + 10);
      this.vx += (dx / dist) * grav;
      this.vy += (dy / dist) * grav;

      // Tangential orbit
      const tang = pull * 1.4 / (dist * 0.01 + 1);
      this.vx += (-dy / dist) * tang * 0.012;
      this.vy += ( dx / dist) * tang * 0.012;

      // Drag
      this.vx *= 0.985;
      this.vy *= 0.985;

      this.x += this.vx;
      this.y += this.vy;

      this.alpha += (this.targetAlpha - this.alpha) * 0.03;

      // Remove if swallowed
      if (dist < 12) { this.alive = false; }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawBlackhole(bx, by, pull) {
    // Accretion disk glow layers
    const layers = [
      { r: 120 + pull * 30, alpha: 0.03, color: '255,111,60' },
      { r:  80 + pull * 20, alpha: 0.06, color: '255,111,60' },
      { r:  50 + pull * 12, alpha: 0.10, color: '255,154,118' },
      { r:  30 + pull * 8,  alpha: 0.18, color: '255,190,160' },
    ];

    layers.forEach(l => {
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, l.r);
      g.addColorStop(0,   `rgba(${l.color},${l.alpha * 2})`);
      g.addColorStop(0.4, `rgba(${l.color},${l.alpha})`);
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(bx, by, l.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Event horizon disk ring
    for (let i = 0; i < 3; i++) {
      const ringR = 22 + i * 6;
      const ringAlpha = 0.6 - i * 0.18;
      const sweep = time * (0.4 + i * 0.12);
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(sweep);
      ctx.scale(1, 0.3 + i * 0.1);
      const g2 = ctx.createRadialGradient(0, 0, ringR - 4, 0, 0, ringR + 4);
      g2.addColorStop(0, `rgba(255,190,160,${ringAlpha})`);
      g2.addColorStop(0.5, `rgba(255,111,60,${ringAlpha * 0.6})`);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = g2;
      ctx.lineWidth = 3 - i;
      ctx.stroke();
      ctx.restore();
    }

    // Singularity (pure black core)
    const coreR = 18 + pull * 5;
    const cg = ctx.createRadialGradient(bx, by, 0, bx, by, coreR + 8);
    cg.addColorStop(0,   'rgba(0,0,0,1)');
    cg.addColorStop(0.7, 'rgba(0,0,0,0.97)');
    cg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(bx, by, coreR + 8, 0, Math.PI * 2);
    ctx.fillStyle = cg;
    ctx.fill();

    // Lensing highlight arc
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(time * 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, coreR + 2, -0.5, 0.8);
    ctx.strokeStyle = `rgba(255,210,186,${0.4 + pull * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ff9a76';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    time += 0.008;

    // Lerp black hole position based on mouse
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    const bx = cx_bh + (targetX - 0.72) * W * 0.15;
    const by = cy_bh + (targetY - 0.5)  * H * 0.25;

    const pull = isHovering ? 1.6 : 1.0;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Subtle space background dots
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 173.13 + time * 0.3) % W + W) % W;
      const sy = ((i * 89.7  + time * 0.2) % H + H) % H;
      const sz = 0.5 + Math.sin(time + i) * 0.3;
      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Draw particles
    particles.forEach((p, idx) => {
      p.update(bx, by, pull);

      // Trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.strokeStyle = `hsla(${p.hue},80%,70%,${p.alpha * 0.45})`;
        ctx.lineWidth = p.size * 0.6;
        ctx.stroke();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},80%,75%,${p.alpha})`;
      ctx.fill();

      if (!p.alive) particles[idx] = new Particle();
    });

    // Gravitational lensing warp effect
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const lg = ctx.createRadialGradient(bx, by, 10, bx, by, 180);
    lg.addColorStop(0,   'rgba(255,111,60,0.12)');
    lg.addColorStop(0.4, 'rgba(255,178,138,0.06)');
    lg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(bx, by, 180, 0, Math.PI * 2);
    ctx.fillStyle = lg;
    ctx.fill();
    ctx.restore();

    drawBlackhole(bx, by, pull);

    requestAnimationFrame(draw);
  }

  // Mouse interaction — only within hero section
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top)  / rect.height;
    isHovering = true;
  });
  hero.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseX = 0.72;
    mouseY = 0.5;
  });

  // Touch support
  hero.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouseX = (t.clientX - rect.left) / rect.width;
    mouseY = (t.clientY - rect.top)  / rect.height;
    isHovering = true;
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('resize', () => {
    resize();
    cx_bh = W * 0.72;
    cy_bh = H * 0.5;
  });

  resize();
  draw();
})();

// ===== TYPING EFFECT IN HERO =====
(function initTyping() {
  const roles = [
    'AI Engineer',
    'OpenBMC Contributor',
    'ROS2 Developer',
    'Robotics Enthusiast',
    'Open Source Advocate'
  ];

  // Inject typing element into hero-sub
  const heroSub = document.getElementById('hero-sub');
  if (!heroSub) return;

  const typed = document.createElement('span');
  typed.id = 'typed-role';
  typed.style.cssText = 'color:#e2e2e8;font-weight:500;';
  const blink = document.createElement('span');
  blink.textContent = '|';
  blink.style.cssText = 'color:#ff7b54;animation:blink 1s step-end infinite;';

  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);

  heroSub.innerHTML = '';
  heroSub.appendChild(typed);
  heroSub.appendChild(blink);

  const line2 = document.createElement('br');
  const loc = document.createTextNode('based in Kollam, Kerala — India');
  heroSub.appendChild(line2);
  heroSub.appendChild(loc);

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const role = roles[ri];
    if (deleting) {
      typed.textContent = role.substring(0, ci - 1);
      ci--;
    } else {
      typed.textContent = role.substring(0, ci + 1);
      ci++;
    }

    let delay = deleting ? 40 : 90;
    if (!deleting && ci === role.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 500; }

    setTimeout(type, delay);
  }
  setTimeout(type, 1400);
})();

console.log('%c🚀 Akash A — Portfolio', 'color:#ff7b54;font-size:20px;font-weight:700;');