// -- highlight a passage in the article and offer to share that exact quote.
// -- no deps: one debounced selectionchange listener + absolute positioning.

const pill = document.getElementById('quoteshare');
const body = document.querySelector<HTMLElement>('.article-body');

if (pill && body) {
  const POST_URL = pill.dataset.url || location.href;
  const POST_TITLE = pill.dataset.title || document.title;

  // X counts any link as 23 chars regardless of real length.
  const URL_COST = 23;
  const TWEET_MAX = 280;
  const label = pill.querySelector<HTMLElement>('[data-label]');

  let quote = '';
  let hideTimer: number | undefined;

  const clamp = (text: string) => {
    // budget: quotes + em-dash + title + blank lines + the link
    const overhead = 2 + 3 + POST_TITLE.length + 2 + URL_COST + 2;
    const room = TWEET_MAX - overhead;
    if (room < 40) return text.slice(0, 40).trimEnd() + '…';
    if (text.length <= room) return text;
    return text.slice(0, room - 1).trimEnd() + '…';
  };

  const hide = () => {
    pill.hidden = true;
    pill.classList.remove('is-visible');
    quote = '';
  };

  const place = (rect: DOMRect) => {
    pill.hidden = false;
    // measure before deciding which side to sit on
    const { offsetWidth: w, offsetHeight: h } = pill;
    const gap = 10;

    let top = rect.top + window.scrollY - h - gap;
    // not enough room above (top of viewport, or mobile selection handles) -> go below
    if (rect.top < h + gap) top = rect.bottom + window.scrollY + gap;

    let left = rect.left + window.scrollX + rect.width / 2 - w / 2;
    const margin = 8;
    const maxLeft = document.documentElement.clientWidth - w - margin;
    if (left < margin) left = margin;
    if (left > maxLeft) left = maxLeft;

    pill.style.top = `${Math.round(top)}px`;
    pill.style.left = `${Math.round(left)}px`;
    pill.classList.add('is-visible');
  };

  const update = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return hide();

    const text = sel.toString().trim().replace(/\s+/g, ' ');
    if (text.length < 2) return hide();

    const range = sel.getRangeAt(0);
    // only inside the article body — ignore nav, meta line, footer
    if (!body.contains(range.commonAncestorContainer)) return hide();

    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) return hide();

    quote = text;
    if (label) label.textContent = 'Copy';
    place(rect);
  };

  const schedule = () => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(update, 120);
  };

  document.addEventListener('selectionchange', schedule);
  document.addEventListener('mouseup', schedule);
  document.addEventListener('touchend', schedule);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });

  document.addEventListener('mousedown', (e) => {
    if (!pill.contains(e.target as Node)) hide();
  });

  window.addEventListener('resize', hide);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  pill.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn || !quote) return;

    if (btn.dataset.action === 'x') {
      const text = `"${clamp(quote)}"\n\n— ${POST_TITLE}`;
      const href =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(text) +
        '&url=' +
        encodeURIComponent(POST_URL);
      window.open(href, '_blank', 'noopener,noreferrer');
      hide();
    } else {
      await copy(`"${quote}"\n\n— ${POST_TITLE}\n${POST_URL}`);
      if (label) {
        label.textContent = 'Copied';
        window.setTimeout(hide, 900);
      }
    }
  });
}

// -- module marker: keeps these top-level consts out of the global scope
export {};
