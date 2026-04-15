/* ═══════════════════════════════════════════════════════════════════════════
   CHAVE MESTRA CAST — SCRIPTS
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── LOADER ─────────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Trigger first reveal
    revealOnScroll();
  }, 2400);
});

document.body.style.overflow = 'hidden';

/* ── THEME TOGGLE ───────────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Persist theme
const savedTheme = localStorage.getItem('chave-mestra-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('chave-mestra-theme', next);
});

/* ── HEADER SCROLL ──────────────────────────────────────────────────────── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MOBILE MENU ────────────────────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  if (nav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on nav link click
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── REVEAL ON SCROLL ───────────────────────────────────────────────────── */
function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 100;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

revealOnScroll();

/* ── EPISODES CAROUSEL ──────────────────────────────────────────────────── */
(function initEpisodesCarousel() {
  const carousel = document.getElementById('episodiosCarousel');
  const dotsContainer = document.getElementById('episodiosDots');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.ep-card');
  const total = cards.length;
  let current = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const card = cards[current];
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    updateDots();
  }

  // Scroll sync dots
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 24;
    current = Math.round(scrollLeft / cardWidth);
    current = Math.max(0, Math.min(current, total - 1));
    updateDots();
  }, { passive: true });

  // Prev/Next buttons
  const wrap = carousel.closest('.carousel-wrap');
  wrap.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
  wrap.querySelector('.next').addEventListener('click', () => goTo(current + 1));
})();

/* ── TESTIMONIALS CAROUSEL ──────────────────────────────────────────────── */
(function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let perView = window.innerWidth < 640 ? 1 : 2;

  // Create dots
  const dotCount = Math.ceil(total / perView);
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === Math.floor(current / perView));
    });
  }

  function goTo(slideIndex) {
    current = slideIndex * perView;
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => {
    const idx = Math.floor(current / perView);
    goTo(Math.max(0, idx - 1));
  });

  nextBtn.addEventListener('click', () => {
    const idx = Math.floor(current / perView);
    goTo(Math.min(dotCount - 1, idx + 1));
  });

  // Auto-advance
  let autoplay = setInterval(() => {
    const idx = Math.floor(current / perView);
    goTo((idx + 1) % dotCount);
  }, 5000);

  track.closest('.testimonials-carousel').addEventListener('mouseenter', () => {
    clearInterval(autoplay);
  });

  track.closest('.testimonials-carousel').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      const idx = Math.floor(current / perView);
      goTo((idx + 1) % dotCount);
    }, 5000);
  });

  // Responsive
  window.addEventListener('resize', () => {
    perView = window.innerWidth < 640 ? 1 : 2;
    goTo(0);
  });
})();

/* ── SMOOTH ACTIVE NAV ──────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── FORM SUBMISSIONS ───────────────────────────────────────────────────── */
document.getElementById('contatoForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Mensagem Enviada!';
  btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Inscrito!';
  setTimeout(() => {
    btn.textContent = original;
    e.target.reset();
  }, 2500);
});

/* ── PARALLAX ORBS ──────────────────────────────────────────────────────── */
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const xPct = (clientX / window.innerWidth - 0.5) * 20;
  const yPct = (clientY / window.innerHeight - 0.5) * 20;

  document.querySelectorAll('.hero-bg-orbs .orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${xPct * factor}px, ${yPct * factor}px)`;
  });
}, { passive: true });

/* ── COUNTER ANIMATION ──────────────────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-item strong');

  const animateCounter = (el) => {
    const raw = el.textContent;
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(num * ease);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
