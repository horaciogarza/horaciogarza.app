// -- highlight the section you're currently reading in the table of contents.

const toc = document.querySelector<HTMLElement>('.toc');
const body = document.querySelector<HTMLElement>('.article-body');

if (toc && body && 'IntersectionObserver' in window) {
  const links = new Map<string, HTMLAnchorElement>();
  toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    links.set(decodeURIComponent(a.getAttribute('href')!.slice(1)), a);
  });

  const heads = [...body.querySelectorAll<HTMLElement>('h2[id], h3[id]')].filter((h) =>
    links.has(h.id)
  );

  let current = '';
  const setActive = (id: string) => {
    if (id === current) return;
    if (current) links.get(current)?.classList.remove('is-active');
    links.get(id)?.classList.add('is-active');
    current = id;
  };

  // track which headings are above the reading line; the last one wins
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target.id);
        else seen.delete(e.target.id);
      }
      const visible = heads.find((h) => seen.has(h.id));
      if (visible) {
        setActive(visible.id);
        return;
      }
      // nothing on screen: fall back to the last heading scrolled past
      let last = '';
      for (const h of heads) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.3) last = h.id;
      }
      if (last) setActive(last);
    },
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
  );

  heads.forEach((h) => io.observe(h));
}

// -- module marker: keeps these top-level consts out of the global scope
export {};
