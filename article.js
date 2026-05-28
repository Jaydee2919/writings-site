/* article.js — Article page logic */

// ============================================================
// Reading Progress Bar
// ============================================================
const progressBar = document.getElementById('reading-progress');
const articleBody = document.getElementById('article-body');

function updateProgress() {
  if (!progressBar || !articleBody) return;

  const rect = articleBody.getBoundingClientRect();
  const articleTop = articleBody.offsetTop;
  const articleHeight = articleBody.offsetHeight;
  const windowHeight = window.innerHeight;

  const scrolled = window.scrollY + windowHeight - articleTop;
  const total = articleHeight;

  const progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);
  progressBar.style.width = progress + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(progress));
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ============================================================
// Estimated reading time (counts words in article content)
// ============================================================
const articleContent = document.querySelector('.article-content');
if (articleContent) {
  const words = articleContent.textContent.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 220); // avg reading speed
  const readTimeEl = document.querySelector('.article-meta .read-time');
  if (readTimeEl) {
    readTimeEl.textContent = `${minutes} min read`;
  }
}

// ============================================================
// Scroll-reveal for article paragraphs (subtle fade)
// ============================================================
const paras = document.querySelectorAll('.article-content p, .article-content h2, .article-quote');
const paraObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        paraObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

// Only apply if motion is not reduced
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  paras.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1)';
    paraObserver.observe(el);
  });
}
