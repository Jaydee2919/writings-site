/* main.js — Writings Site Logic */

// ============================================================
// Theme Toggle
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

// Restore saved theme or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  setTheme('light');
} else {
  setTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// Sticky Nav — add "scrolled" class after scroll
// ============================================================
const nav = document.getElementById('main-nav');

const navObserver = new IntersectionObserver(
  ([entry]) => {
    nav.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { rootMargin: '-80px 0px 0px 0px' }
);

// Observe a sentinel element just below the top of the page
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(sentinel);
navObserver.observe(sentinel);

// ============================================================
// Scroll Reveal — Intersection Observer
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal-on-scroll:not(.revealed)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, Math.min(idx * 80, 300));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// ============================================================
// Essay Filter
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const essayCards = document.querySelectorAll('.essay-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide cards with smooth transition
    essayCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Re-trigger reveal if not yet revealed
        if (!card.classList.contains('revealed')) {
          revealObserver.observe(card);
        }
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// Animated Number Counters (on first view of stats)
// ============================================================
function animateNumber(el, target, suffix = '') {
  const isK = String(target).includes('k');
  const numericTarget = isK ? parseInt(target) * 1000 : parseInt(target);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * numericTarget);

    let display = current;
    if (isK && current >= 1000) {
      display = (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'k';
    }

    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.hero-stats');
let statsAnimated = false;
if (statsSection) {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateNumber(document.getElementById('stat-essays'), 24);
      animateNumber(document.getElementById('stat-thoughts'), 58);
      animateNumber(document.getElementById('stat-reads'), '12k');
      statsObserver.disconnect();
    }
  });
  statsObserver.observe(statsSection);
}

// ============================================================
// Load More (demo — toggles hidden cards)
// ============================================================
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    // In a real site, this would fetch more essays from a CMS/API
    loadMoreBtn.textContent = 'All Essays Loaded';
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = '0.5';
    loadMoreBtn.style.cursor = 'default';
  });
}

// ============================================================
// Subtle cursor glow (desktop only)
// ============================================================
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(155,127,244,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}
