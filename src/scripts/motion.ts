// -- parallax + reveal. no libraries, one rAF-gated scroll listener.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

type Tracked = { el: HTMLElement; speed: number; center: number };

function init() {
  if (reduced.matches) return;

  const tracked: Tracked[] = [];
  const root = document.documentElement;

  const measure = () => {
    tracked.length = 0;
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      el.style.transform = '';
      const rect = el.getBoundingClientRect();
      tracked.push({
        el,
        speed: parseFloat(el.dataset.parallax || '0.15'),
        center: rect.top + window.scrollY + rect.height / 2,
      });
    });
  };

  // reading progress rides the same scroll pass rather than adding a listener.
  // measured against the post text, not the whole <article> — the share row,
  // newsletter, related grid and app strip are not 'reading'.
  const article = document.querySelector<HTMLElement>('.article-body');

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    root.style.setProperty('--py', String(y));

    if (article) {
      const start = article.offsetTop;
      const span = article.offsetHeight - window.innerHeight * 0.5;
      const p = span > 0 ? (y - start + window.innerHeight * 0.5) / span : 0;
      root.style.setProperty('--read-progress', String(Math.min(1, Math.max(0, p))));
    }
    const mid = y + window.innerHeight / 2;
    for (const t of tracked) {
      const offset = (mid - t.center) * t.speed;
      t.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });

  let resizeTimer: number;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      update();
    }, 120);
  });
}

function reveal() {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!items.length) return;
  if (reduced.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
}

init();
reveal();

// -- 1 row in set (0.001 sec)
console.log(
  '%c-- horaciogarza.app\nSELECT * FROM humans WHERE curious = TRUE;\n\n+----+----------------+---------------------------+\n| id | name           | note                      |\n+----+----------------+---------------------------+\n|  1 | Horacio Garza  | builds iOS apps & writes  |\n+----+----------------+---------------------------+\n1 row in set (0.001 sec)\n\n-- psst: press "/" anywhere to open the query console.',
  'font-family: monospace; line-height: 1.5;'
);

// -- module marker: keeps these top-level consts out of the global scope
export {};
