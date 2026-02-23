// ═══════════════════════════════════════════
//  UniBarTech S.A.S — main.js
// ═══════════════════════════════════════════

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Animated stat counters ──
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(statsStrip);
}

// ── Scroll-reveal animations ──
const revealEls = document.querySelectorAll(
  '.about-card, .service-card, .mvv-card, .team-card, .tl-item, .legal-item, .ci-item, .folder-card'
);
if (revealEls.length) {
  const ro = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animationDelay = (i * 0.06) + 's';
        e.target.style.animation = 'fadeUp 0.5s ease both';
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => ro.observe(el));
}

// ── Contact form ──
function handleForm(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  if (msg) {
    msg.textContent = '✅ ¡Mensaje recibido! Te responderemos a la brevedad.';
    e.target.reset();
    setTimeout(() => { msg.textContent = ''; }, 5000);
  }
}
